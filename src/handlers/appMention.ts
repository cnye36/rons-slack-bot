import type { SlackEventMiddlewareArgs, AllMiddlewareArgs } from '@slack/bolt';
import { generateAIResponse } from '../services/ai.js';
import { getThreadHistory } from '../services/slack.js';

export async function handleAppMention({
  event,
  say,
}: SlackEventMiddlewareArgs<'app_mention'> & AllMiddlewareArgs) {
  console.log('🔔 App mention received:', (event as any).text?.substring?.(0, 50));
  try {
    const mentionText = (event as any).text?.replace?.(/<@[A-Z0-9]+>/g, '')?.trim?.() || '';
    
    if (!mentionText) {
      await say({
        text: "Hi! How can I help you today?",
        thread_ts: (event as any).ts,
      });
      return;
    }

    // Get conversation history from thread if available
    let conversationHistory;
    if ((event as any).thread_ts) {
      conversationHistory = await getThreadHistory((event as any).channel, (event as any).thread_ts);
    }

    // Generate AI response
    const response = await generateAIResponse({
      channel: (event as any).channel,
      user: (event as any).user || '',
      text: mentionText,
      threadTs: (event as any).thread_ts,
    }, conversationHistory);

    await say({
      text: response,
      thread_ts: (event as any).ts,
    });
  } catch (error) {
    console.error('Error handling app mention:', error);
    await say({
      text: "Sorry, I encountered an error processing your request. Please try again.",
      thread_ts: (event as any).ts,
    });
  }
}
