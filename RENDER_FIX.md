# Fix Render Service Type Issue

## The Problem
Your service is currently configured as a **Web Service**, but it should be a **Background Worker** because:
- This bot uses Socket Mode (WebSocket connections)
- It doesn't need an HTTP server or public URL
- Background Workers are perfect for long-running processes like bots

## Solution: Change Service Type

You have two options:

### Option 1: Delete and Recreate (Recommended)

1. **Delete the current service:**
   - In Render dashboard, go to your service
   - Go to **Settings** → Scroll to bottom → **Delete Service**
   - Confirm deletion

2. **Create a new Background Worker:**
   - Click **"New +"** → **"Background Worker"** (NOT "Web Service")
   - Connect your Git repository: `https://github.com/cnye36/rons-slack-bot`
   - Set branch: `main`
   - Configure:
     - **Name**: `trail-bites-slack-bot`
     - **Environment**: `Node`
     - **Build Command**: `pnpm install && pnpm run build`
     - **Start Command**: `pnpm start`
     - **Plan**: `Free` (or paid for always-on)
   
3. **Set Environment Variables:**
   - Go to **Environment** tab
   - Add all required variables (see DEPLOY.md)

4. **Deploy:**
   - Click **Create Background Worker**
   - Monitor the build logs

### Option 2: Use Blueprint (render.yaml)

1. **Delete the current Web Service** (same as above)

2. **Create from Blueprint:**
   - Click **"New +"** → **"Blueprint"**
   - Connect your repository
   - Render will detect `render.yaml` and create the Background Worker automatically
   - You'll still need to set environment variables manually

## Verify Correct Setup

After recreating, verify:
- ✅ Service type shows "Background Worker" (not "Web Service")
- ✅ Build command: `pnpm install && pnpm run build`
- ✅ Start command: `pnpm start`
- ✅ No PORT or HTTP-related settings
- ✅ All environment variables are set

## Why This Matters

- **Web Services** expect to listen on a PORT for HTTP requests
- **Background Workers** run processes continuously without HTTP endpoints
- Your Socket Mode bot connects to Slack via WebSocket, so it needs a Background Worker
