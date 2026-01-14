# Deployment Guide - Render

This guide walks you through deploying the Trail Bites AI Assistant to Render.

## Prerequisites

- A Render account (sign up at [render.com](https://render.com))
- Your Slack app credentials (from Slack API dashboard)
- Your OpenAI API key

## Deployment Steps

### 1. Push Code to Git Repository

Make sure your code is in a Git repository (GitHub, GitLab, or Bitbucket):

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create a New Service on Render

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Background Worker"**
3. Connect your Git repository
4. Configure the service:
   - **Name**: `trail-bites-slack-bot` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `pnpm start`
   - **Plan**: `Free` (or choose a paid plan for better performance)

### 3. Set Environment Variables

In the Render dashboard, go to your service → **Environment** tab and add:

| Variable | Description | Example |
|----------|-------------|---------|
| `SLACK_BOT_TOKEN` | Bot User OAuth Token (from Slack) | `xoxb-...` |
| `SLACK_APP_TOKEN` | App-Level Token with `connections:write` scope | `xapp-...` |
| `SLACK_SIGNING_SECRET` | Signing Secret (from Slack) | `abc123...` |
| `OPENAI_API_KEY` | OpenAI API Key | `sk-proj-...` |
| `OPENAI_MODEL` | (Optional) OpenAI model to use | `gpt-4o-mini` (default) |
| `NODE_ENV` | Set to `production` | `production` |

**Where to find Slack credentials:**
- **Bot Token**: Slack App → OAuth & Permissions → Bot User OAuth Token
- **App Token**: Slack App → Basic Information → App-Level Tokens → Generate (with `connections:write` scope)
- **Signing Secret**: Slack App → Basic Information → App Credentials → Signing Secret

### 4. Deploy

1. Click **"Create Background Worker"**
2. Render will automatically:
   - Clone your repository
   - Run `pnpm install` to install dependencies
   - Run `pnpm run build` to compile TypeScript
   - Start the service with `pnpm start`

### 5. Monitor Deployment

- Watch the build logs in the Render dashboard
- Once deployed, check the logs to see: `🚀 Trail Bites AI Assistant is running!`
- The service will automatically restart if it crashes

## Using render.yaml (Alternative Method)

If you prefer infrastructure-as-code, you can use the included `render.yaml`:

1. Make sure your code is pushed to Git
2. In Render Dashboard, click **"New +"** → **"Blueprint"**
3. Connect your repository
4. Render will detect `render.yaml` and use it for configuration
5. Still need to set environment variables in the dashboard

## Important Notes

### Socket Mode
This bot uses **Socket Mode**, which means:
- ✅ No public URL needed
- ✅ No webhooks to configure
- ✅ Works behind firewalls
- ✅ Perfect for background workers

### Environment Variables Security
- Never commit `.env` files to Git (already in `.gitignore`)
- All secrets should be set in Render's environment variables
- Environment variables in Render are encrypted at rest

### Monitoring
- Check logs regularly in the Render dashboard
- Set up alerts for service failures
- Monitor OpenAI API usage to avoid unexpected costs

### Scaling
- Free plan: 1 instance, sleeps after 15 min inactivity
- Starter plan: Always-on, better for production
- Can scale horizontally if needed (multiple instances)

## Troubleshooting

### Service won't start
- Check logs for error messages
- Verify all environment variables are set correctly
- Ensure Slack tokens are valid and not expired

### Bot not responding
- Check Render logs for errors
- Verify Socket Mode is enabled in Slack app settings
- Check that all required Slack scopes are granted
- Ensure OpenAI API key is valid and has credits

### Build fails
- Check that all dependencies are listed in `package.json`
- Verify TypeScript compilation works locally: `pnpm run build`
- Check Render logs for specific build errors

## Cost Estimation

- **Free Plan**: $0/month (may sleep after inactivity)
- **Starter Plan**: $7/month (always-on, recommended for production)
- **OpenAI API**: Pay-per-use (varies with usage)

## Support

For issues:
1. Check Render logs
2. Check Slack app configuration
3. Verify environment variables
4. Test locally first to isolate issues
