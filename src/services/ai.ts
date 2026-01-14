import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables before initializing OpenAI client
// This ensures OPENAI_API_KEY is available even if this module is imported before dotenv.config() in index.ts
dotenv.config();

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface MessageContext {
  channel: string;
  user: string;
  text: string;
  threadTs?: string;
  workspaceInfo?: string;
}

export async function generateAIResponse(
  context: MessageContext,
  conversationHistory?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): Promise<string> {
  const systemPrompt = `You are Trail Bites AI Assistant, a helpful and friendly AI assistant for the Trail Bites Slack community. 

Your capabilities include:
- Answering questions and providing information
- Creating and editing canvases (Slack's document format)
- Reading and understanding context from messages
- Helping with file management
- Assisting with community engagement

Be concise, helpful, and maintain a friendly tone. When creating documents or canvases, structure the content clearly and professionally.`;

  const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
    { role: 'system', content: systemPrompt },
  ];

  // Add conversation history if provided
  if (conversationHistory) {
    messages.push(...conversationHistory);
  }

  // Add current message
  messages.push({
    role: 'user',
    content: context.text,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini',
      messages,
      reasoning_effort: 'medium',
      max_completion_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate AI response');
  }
}

export async function summarizeText(text: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that provides concise summaries of text.',
        },
        {
          role: 'user',
          content: `Please provide a brief summary of the following text:\n\n${text}`,
        },
      ],
      reasoning_effort: 'medium',
      max_completion_tokens: 300,
    });

    return completion.choices[0]?.message?.content || 'Could not generate summary.';
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw error;
  }
}
