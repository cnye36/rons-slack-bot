import type { SlackEventMiddlewareArgs, AllMiddlewareArgs } from '@slack/bolt';
import { summarizeText } from '../services/ai.js';
import { getMessageContext } from '../services/slack.js';

export async function handleReaction({
  event,
  say,
}: SlackEventMiddlewareArgs<'reaction_added'> & AllMiddlewareArgs) {
  // Only react to specific emoji reactions (e.g., 📝 for summarize)
  if ((event as any).reaction !== 'memo' && (event as any).reaction !== '📝') {
    return;
  }

  try {
    const messageContext = await getMessageContext((event as any).item.channel, (event as any).item.ts);
    
    if (!messageContext || !messageContext.text) {
      return;
    }

    // Generate summary
    const summary = await summarizeText(messageContext.text);
    
    // Post summary as a reply in a thread
    await say({
      text: `📝 Summary:\n${summary}`,
      thread_ts: (event as any).item.ts,
    });
    
  } catch (error) {
    console.error('Error handling reaction:', error);
  }
}
