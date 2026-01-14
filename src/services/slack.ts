import { WebClient } from '@slack/web-api';

const client = new WebClient(process.env.SLACK_BOT_TOKEN);

export interface ThreadMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function getThreadHistory(
  channel: string,
  threadTs: string
): Promise<Array<{ role: 'user' | 'assistant' | 'system'; content: string }> | undefined> {
  try {
    const result = await client.conversations.replies({
      channel,
      ts: threadTs,
      limit: 50,
    });

    if (!result.messages) {
      return undefined;
    }

    // Get bot user ID
    const authResult = await client.auth.test();
    const botUserId = authResult.user_id;

    return result.messages
      .filter((msg) => msg.text)
      .map((msg) => ({
        role: msg.user === botUserId ? 'assistant' : 'user',
        content: msg.text || '',
      }));
  } catch (error) {
    console.error('Error fetching thread history:', error);
    return undefined;
  }
}

export async function getMessageContext(
  channel: string,
  messageTs: string
): Promise<{ text: string; user?: string } | null> {
  try {
    const result = await client.conversations.history({
      channel,
      latest: messageTs,
      inclusive: true,
      limit: 1,
    });

    const message = result.messages?.[0];
    if (!message || !('text' in message)) {
      return null;
    }

    return {
      text: message.text || '',
      user: 'user' in message ? message.user : undefined,
    };
  } catch (error) {
    console.error('Error fetching message context:', error);
    return null;
  }
}

export { client };
