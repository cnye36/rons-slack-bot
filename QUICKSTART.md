# Quick Start Guide

## 1. Install Dependencies

```bash
pnpm install
```

## 2. Set Up Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp env.example .env
```

Then edit `.env` with your actual credentials:

```env
SLACK_BOT_TOKEN=xoxb-your-actual-token
SLACK_APP_TOKEN=xapp-your-actual-token
SLACK_SIGNING_SECRET=your-actual-secret
OPENAI_API_KEY=your-openai-key
```

## 3. Get Your Slack Credentials

### Bot Token (SLACK_BOT_TOKEN)
1. Go to https://api.slack.com/apps
2. Select your app
3. Go to **OAuth & Permissions**
4. Copy the **Bot User OAuth Token** (starts with `xoxb-`)

### App Token (SLACK_APP_TOKEN)
1. In your Slack app settings, go to **Basic Information**
2. Scroll down to **App-Level Tokens**
3. Click **Generate Token and Scopes**
4. Create a token with `connections:write` scope
5. Copy the token (starts with `xapp-`)

### Signing Secret (SLACK_SIGNING_SECRET)
1. In your Slack app settings, go to **Basic Information**
2. Scroll to **App Credentials**
3. Copy the **Signing Secret**

## 4. Enable Socket Mode

1. In your Slack app settings, go to **Socket Mode**
2. Toggle **Enable Socket Mode** to ON

## 5. Subscribe to Events

1. Go to **Event Subscriptions**
2. Enable **Subscribe to bot events**
3. Add these bot events:
   - `app_mentions`
   - `message.channels`
   - `message.groups`
   - `message.im`
   - `reaction_added`

## 6. Create Slash Command

1. Go to **Slash Commands**
2. Click **Create New Command**
3. Command: `/canvas`
4. Short Description: `Manage Slack canvases`
5. Click **Save**

## 7. Run the Bot

### Development Mode (with hot reload):
```bash
pnpm run dev
```

### Production Mode:
```bash
pnpm run build
pnpm start
```

You should see: `🚀 Trail Bites AI Assistant is running!`

## 8. Test the Bot

1. Invite the bot to a channel: `/invite @Trail Bites AI Assistant`
2. Mention the bot: `@Trail Bites AI Assistant hello!`
3. Try a canvas command: `/canvas create Test Canvas`

## Troubleshooting

- **"Failed to start app"**: Check that all tokens in `.env` are correct
- **Bot not responding**: Make sure Socket Mode is enabled and the bot is invited to the channel
- **Canvas errors**: Verify `canvases:read` and `canvases:write` scopes are added in OAuth & Permissions
