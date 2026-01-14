import { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from '@slack/bolt';
import { createCanvas, updateCanvas, getCanvas } from '../services/canvas.js';
import { generateAIResponse } from '../services/ai.js';

export async function handleCanvasCommands({
  command,
  ack,
  respond,
  client,
}: SlackCommandMiddlewareArgs & AllMiddlewareArgs) {
  await ack();

  const [action, ...args] = command.text.split(' ').filter(Boolean);
  const text = args.join(' ');

  try {
    switch (action) {
      case 'create':
      case 'new':
        if (!text) {
          await respond({
            text: 'Usage: `/canvas create <title>` or `/canvas create <title> with content: <content>`',
            response_type: 'ephemeral',
          });
          return;
        }

        // Parse title and optional content
        const contentMatch = text.match(/^(.+?)\s+with content:\s+(.+)$/i);
        const title = contentMatch ? contentMatch[1] : text;
        const initialContent = contentMatch ? contentMatch[2] : undefined;

        // If content provided, use it; otherwise generate with AI
        let content = initialContent;
        if (!content) {
          content = await generateAIResponse({
            channel: command.channel_id,
            user: command.user_id,
            text: `Create a canvas document with the title "${title}". Provide a well-structured document outline and initial content.`,
          });
        }

        const canvas = await createCanvas(client, command.channel_id, title, content);
        
        await respond({
          text: `✅ Canvas created: ${canvas.title}\n${canvas.url}`,
          response_type: 'ephemeral',
        });
        break;

      case 'update':
      case 'edit':
        if (!text) {
          await respond({
            text: 'Usage: `/canvas update <canvas_id> <new_content>`',
            response_type: 'ephemeral',
          });
          return;
        }

        const [canvasId, ...updateArgs] = text.split(' ');
        const updateContent = updateArgs.join(' ');

        if (!updateContent) {
          await respond({
            text: 'Please provide content to update the canvas with.',
            response_type: 'ephemeral',
          });
          return;
        }

        // Generate enhanced content with AI if needed
        const enhancedContent = await generateAIResponse({
          channel: command.channel_id,
          user: command.user_id,
          text: `Update the canvas content with: ${updateContent}`,
        });

        await updateCanvas(client, canvasId, enhancedContent);
        
        await respond({
          text: `✅ Canvas updated successfully!`,
          response_type: 'ephemeral',
        });
        break;

      case 'get':
      case 'show':
        if (!text) {
          await respond({
            text: 'Usage: `/canvas get <canvas_id>`',
            response_type: 'ephemeral',
          });
          return;
        }

        const canvasData = await getCanvas(client, text);
        
        await respond({
          text: `📄 Canvas: ${canvasData.title}\n${canvasData.url}\n\nContent preview:\n${canvasData.content?.substring(0, 500)}...`,
          response_type: 'ephemeral',
        });
        break;

      default:
        await respond({
          text: `Available commands:
• \`/canvas create <title>\` - Create a new canvas
• \`/canvas create <title> with content: <content>\` - Create canvas with specific content
• \`/canvas update <canvas_id> <content>\` - Update an existing canvas
• \`/canvas get <canvas_id>\` - Get canvas information`,
          response_type: 'ephemeral',
        });
    }
  } catch (error) {
    console.error('Error handling canvas command:', error);
    await respond({
      text: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      response_type: 'ephemeral',
    });
  }
}
