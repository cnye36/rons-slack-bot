# Trail Bites AI Assistant - Slack Bot

An AI-powered Slack bot designed for the Trail Bites community. This bot can create canvases, write documents, read and answer messages, and assist with various community tasks.

## Features

- 🤖 **AI-Powered Responses**: Uses OpenAI's GPT models to provide intelligent responses
- 📝 **Canvas Management**: Create, update, and manage Slack canvases
- 💬 **Message Handling**: Responds to mentions and direct messages
- 📄 **File Operations**: Read and write files in Slack
- 🔍 **Context Awareness**: Maintains conversation context in threads
- ⚡ **Reactions**: Can summarize messages when reacted with 📝

## Prerequisites

- Node.js 18+ and pnpm
- A Slack app with the following OAuth scopes:
  - `app_mentions:read`
  - `assistant:write`
  - `canvases:read`
  - `canvases:write`
  - `channels:read`
  - `chat:write`
  - `chat:write.public`
  - `files:read`
  - `files:write`
  - `groups:history`
  - `im:read`
  - `im:write`
  - `mpim:history`
  - `reactions:read`
  - `reactions:write`
  - `search:read.files`
  - `search:read.public`
  - `team:read`
  - `users:read`
- OpenAI API key

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Slack App Credentials
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_SIGNING_SECRET=your-signing-secret

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key

# Optional: OpenAI Model (defaults to gpt-4)
OPENAI_MODEL=gpt-4

# Optional: Default channel
DEFAULT_CHANNEL=your-channel-id
```

### 3. Get Slack App Credentials

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Select your app (or create a new one)
3. Navigate to **OAuth & Permissions** to get your `SLACK_BOT_TOKEN` (starts with `xoxb-`)
4. Navigate to **Basic Information** > **App-Level Tokens** to create an app-level token with `connections:write` scope. This is your `SLACK_APP_TOKEN` (starts with `xapp-`)
5. Get your `SLACK_SIGNING_SECRET` from **Basic Information** > **App Credentials**

### 4. Configure Slack App

1. **Enable Socket Mode**: Go to **Socket Mode** in your Slack app settings and enable it
2. **Configure Event Subscriptions**: 
   - Go to **Event Subscriptions**
   - Subscribe to `app_mentions` and `message.channels`, `message.groups`, `message.im`
   - Subscribe to `reaction_added`
3. **Add Slash Commands**:
   - Go to **Slash Commands**
   - Create a new command: `/canvas`
   - Request URL: Not needed (Socket Mode handles this)

### 5. Build and Run

```bash
# Build TypeScript
pnpm run build

# Run in production
pnpm start

# Or run in development mode (with hot reload)
pnpm run dev
```

## Usage

### Mention the Bot

Simply mention the bot in a channel or DM:

```
@Trail Bites AI Assistant What is the weather today?
```

### Canvas Commands

Create a new canvas:
```
/canvas create Project Planning
```

Create a canvas with initial content:
```
/canvas create Meeting Notes with content: Today we discussed...
```

Update an existing canvas:
```
/canvas update <canvas_id> Updated content here
```

Get canvas information:
```
/canvas get <canvas_id>
```

### Message Summarization

React to any message with 📝 (memo emoji) to generate a summary.

## Project Structure

```
.
├── src/
│   ├── handlers/          # Event handlers
│   │   ├── appMention.ts  # Handle @mentions
│   │   ├── message.ts     # Handle direct messages
│   │   ├── canvas.ts      # Handle canvas commands
│   │   └── reaction.ts    # Handle reactions
│   ├── services/          # Business logic
│   │   ├── ai.ts          # AI/OpenAI integration
│   │   ├── slack.ts       # Slack API utilities
│   │   └── canvas.ts      # Canvas operations
│   ├── config/            # Configuration
│   │   └── index.ts       # Config management
│   └── index.ts           # Main entry point
├── dist/                  # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Development

```bash
# Type checking
pnpm run type-check

# Development mode with hot reload
pnpm run dev

# Build for production
pnpm run build
```

## Troubleshooting

1. **Bot not responding**: 
   - Check that Socket Mode is enabled
   - Verify all tokens are correct in `.env`
   - Check that the bot is invited to the channel

2. **Canvas operations failing**:
   - Ensure `canvases:read` and `canvases:write` scopes are granted
   - Check that you're using the correct canvas ID format

3. **AI responses not working**:
   - Verify your OpenAI API key is valid
   - Check API rate limits and quota

## License

MIT
