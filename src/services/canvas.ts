import { WebClient } from '@slack/web-api';

export interface CanvasInfo {
  id: string;
  title: string;
  url: string;
  content?: string;
}

export async function createCanvas(
  client: WebClient,
  channelId: string,
  title: string,
  content: string
): Promise<CanvasInfo> {
  try {
    // Slack Canvas API endpoint
    // Note: This uses the canvas.create API method
    const result = await client.apiCall('canvas.create', {
      title,
      content: {
        blocks: [
          {
            type: 'rich_text',
            elements: [
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: content,
                  },
                ],
              },
            ],
          },
        ],
      },
      channel: channelId,
    }) as any;

    if (!result.ok || !result.canvas) {
      throw new Error('Failed to create canvas');
    }

    return {
      id: result.canvas.id || result.canvas.id,
      title,
      url: result.canvas.url || '',
      content,
    };
  } catch (error) {
    console.error('Error creating canvas:', error);
    throw new Error(`Failed to create canvas: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateCanvas(
  client: WebClient,
  canvasId: string,
  content: string
): Promise<void> {
  try {
    const result = await client.apiCall('canvas.update', {
      canvas: canvasId,
      content: {
        blocks: [
          {
            type: 'rich_text',
            elements: [
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: content,
                  },
                ],
              },
            ],
          },
        ],
      },
    }) as any;

    if (!result.ok) {
      throw new Error('Failed to update canvas');
    }
  } catch (error) {
    console.error('Error updating canvas:', error);
    throw new Error(`Failed to update canvas: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getCanvas(
  client: WebClient,
  canvasId: string
): Promise<CanvasInfo> {
  try {
    const result = await client.apiCall('canvas.get', {
      canvas: canvasId,
    }) as any;

    if (!result.ok || !result.canvas) {
      throw new Error('Failed to get canvas');
    }

    const canvas = result.canvas;
    // Extract text content from canvas blocks
    let content = '';
    if (canvas.content?.blocks) {
      content = extractTextFromBlocks(canvas.content.blocks);
    }

    return {
      id: canvas.id || canvasId,
      title: canvas.title || 'Untitled Canvas',
      url: canvas.url || '',
      content,
    };
  } catch (error) {
    console.error('Error getting canvas:', error);
    throw new Error(`Failed to get canvas: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function extractTextFromBlocks(blocks: any[]): string {
  let text = '';
  
  for (const block of blocks) {
    if (block.type === 'rich_text' && block.elements) {
      text += extractTextFromElements(block.elements) + '\n';
    } else if (block.text) {
      text += block.text + '\n';
    }
  }
  
  return text.trim();
}

function extractTextFromElements(elements: any[]): string {
  let text = '';
  
  for (const element of elements) {
    if (element.type === 'text') {
      text += element.text || '';
    } else if (element.type === 'rich_text_section' && element.elements) {
      text += extractTextFromElements(element.elements);
    } else if (element.elements) {
      text += extractTextFromElements(element.elements);
    }
  }
  
  return text;
}
