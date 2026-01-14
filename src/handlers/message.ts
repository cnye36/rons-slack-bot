import type { AnyMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { generateAIResponse } from '../services/ai.js';
import { getThreadHistory, client } from '../services/slack.js';

let botUserId: string | null = null;

async function getBotUserId(): Promise<string> {
  if (botUserId) return botUserId;
  
  try {
    const result = await client.auth.test();
    botUserId = result.user_id || '';
    return botUserId;
  } catch (error) {
    console.error('Error getting bot user ID:', error);
    return '';
  }
}

export async function handleMessage({
  message,
  say,
}: SlackEventMiddlewareArgs<'message'> & AnyMiddlewareArgs) {
  console.log('📨 Message received:', {
    channel_type: (message as any).channel_type,
    subtype: (message as any).subtype,
    hasText: 'text' in (message as any),
    text: 'text' in (message as any) ? (message as any).text?.substring?.(0, 50) : undefined,
  });

  // Ignore bot messages and messages without text
  if (
    (message as any).subtype === 'bot_message' ||
    (message as any).subtype === 'message_changed' ||
    !('text' in (message as any)) ||
    !(message as any).text
  ) {
    console.log('⚠️ Message ignored (bot message or no text)');
    return;
  }

  // Only respond in DMs or if explicitly mentioned
  const isDM = (message as any).channel_type === 'im';
  console.log('💬 Processing message, isDM:', isDM);
  
  if (!isDM) {
    // In channels, only respond if the bot is mentioned
    const userId = await getBotUserId();
    console.log('🔍 Bot user ID:', userId);
    if (!userId || !(message as any).text?.includes?.(`<@${userId}>`)) {
      console.log('⚠️ Message ignored (not in DM and not mentioning bot)');
      return;
    }
  }

  try {
    const messageText = (message as any).text?.replace?.(/<@[A-Z0-9]+>/g, '')?.trim?.() || '';
    
    if (!messageText) {
      return;
    }

    // Get conversation history if in a thread
    let conversationHistory;
    if ((message as any).thread_ts) {
      conversationHistory = await getThreadHistory((message as any).channel, (message as any).thread_ts);
    }

    // Generate AI response
    const response = await generateAIResponse({
      channel: (message as any).channel,
      user: (message as any).user || '',
      text: messageText,
      threadTs: (message as any).thread_ts,
    }, conversationHistory);

    const responseOptions: any = {
      text: response,
    };

    // Reply in thread if original message is in a thread
    if ((message as any).thread_ts) {
      responseOptions.thread_ts = (message as any).thread_ts;
    } else if ((message as any).ts) {
      // Start a new thread
      responseOptions.thread_ts = (message as any).ts;
    }

    await say(responseOptions);
  } catch (error) {
    console.error('Error handling message:', error);
    await say({
      text: "Sorry, I encountered an error processing your message. Please try again.",
    });
  }
}
