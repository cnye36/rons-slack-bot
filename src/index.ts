import { App, LogLevel } from '@slack/bolt';
import dotenv from 'dotenv';
import { handleAppMention } from './handlers/appMention.js';
import { handleMessage } from './handlers/message.js';
import { handleCanvasCommands } from './handlers/canvas.js';
import { handleReaction } from './handlers/reaction.js';
import { validateConfig } from './config/index.js';

// Load environment variables
dotenv.config();

// Validate configuration
try {
  validateConfig();
} catch (error) {
  console.error('Configuration error:', error);
  process.exit(1);
}

// Initialize Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  logLevel: LogLevel.INFO,
});

// Global debug: log every incoming envelope/event that Bolt processes
app.use(async ({ body, next, logger }: any) => {
  const anyBody = body as any;
  const eventType = anyBody?.event?.type;
  logger.debug(`📥 Incoming: body.type=${anyBody?.type} event.type=${eventType}`);
  if (eventType) {
    console.log('📥 Incoming event:', eventType);
  } else {
    console.log('📥 Incoming body:', anyBody?.type);
  }
  await next();
});

// Register event handlers
app.event('app_mention', handleAppMention as any);
app.message(handleMessage as any);

app.event('reaction_added', handleReaction);

// Slack "AI Assistant" surface events (what you see in the app's Chat tab)
// These are separate from normal message.im events.
app.event('assistant_thread_started', async (args: any) => {
  console.log('🧵 assistant_thread_started received');
  if (typeof args?.say === 'function') {
    await args.say('Hi! I’m online. Ask me anything and I’ll help.');
  }
});

app.event('assistant_thread_context_changed', async (_args: any) => {
  console.log('🧵 assistant_thread_context_changed received');
});

app.event('assistant_thread_message', async (args: any) => {
  console.log('🧵 assistant_thread_message received');
  // Many orgs expect the app to reply into the assistant thread using say()
  // The event payload shape can vary; we keep this minimal for now.
  const anyEvent = args?.event as any;
  const text =
    anyEvent?.message?.text ||
    anyEvent?.text ||
    anyEvent?.assistant_thread?.latest_message?.text ||
    '';

  if (!text) {
    if (typeof args?.say === 'function') {
      await args.say("I saw your message, but I couldn't read the text payload. Can you try again?");
    }
    return;
  }

  // Reuse the same AI response logic as normal messages by delegating via say()
  // (We keep it simple here and respond directly.)
  if (typeof args?.say === 'function') {
    await args.say(`Got it — you said: “${text}”. (Next: wire this into the LLM response.)`);
  }
});

// Register slash commands
app.command('/canvas', handleCanvasCommands);

// Error handling
app.error(async (error: Error) => {
  console.error('Error:', error);
});

// Start the app
(async () => {
  try {
    await app.start();
    console.log('🚀 Trail Bites AI Assistant is running!');
    console.log('📡 Listening for events...');
  } catch (error) {
    console.error('Failed to start app:', error);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on('SIGTERM', async () => {
  await app.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await app.stop();
  process.exit(0);
});
