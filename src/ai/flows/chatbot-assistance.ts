'use server';

/**
 * @fileOverview A general purpose chatbot for FolioFinds.
 *
 * - folioBot - A function that handles chatbot conversations.
 * - FolioBotInput - The input type for the folioBot function.
 * - FolioBotOutput - The return type for the folioBot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getIntroductoryTips } from './introductory-tips-chatbot';

const FolioBotInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  user: z.object({
      name: z.string(),
      email: z.string(),
  }).optional().describe("The user's personal information, if they are logged in."),
});
export type FolioBotInput = z.infer<typeof FolioBotInputSchema>;

const FolioBotOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
});
export type FolioBotOutput = z.infer<typeof FolioBotOutputSchema>;

const folioBotPrompt = ai.definePrompt({
    name: 'folioBotPrompt',
    input: { schema: FolioBotInputSchema },
    output: { schema: FolioBotOutputSchema },
    prompt: `You are a helpful and friendly assistant for an online marketplace for used books called FolioFinds.
    Your goal is to help users find books, answer questions about the platform, and provide a friendly, conversational, and personalized experience.
    
    {{#if user}}
    You are speaking with {{user.name}}. Address them by name when it feels natural.
    Their email is {{user.email}}.
    {{else}}
    You are speaking with a guest.
    {{/if}}

    If the user seems new or is asking for general help, you can suggest some introductory tips.
    
    User message: {{{message}}}
    `,
});


export const folioBotFlow = ai.defineFlow(
  {
    name: 'folioBotFlow',
    inputSchema: FolioBotInputSchema,
    outputSchema: FolioBotOutputSchema,
  },
  async (input) => {

    // A simple check to see if we should offer introductory tips.
    if (input.message.toLowerCase().includes('help') || input.message.toLowerCase().includes('start')) {
        const tips = await getIntroductoryTips({ userType: 'new' });
        
        let welcomeMessage = "Welcome to FolioFinds!";
        if (input.user?.name) {
            welcomeMessage = `Welcome to FolioFinds, ${input.user.name}!`;
        }

        const tipResponse = `${welcomeMessage} Here are a few tips to get you started:\n\n` + tips.tips.map(t => `- ${t}`).join('\n');
        return { response: tipResponse };
    }

    const {output} = await folioBotPrompt(input);
    return output!;
  }
);


type ChatbotInput = {
  message: string;
  user?: {
    name?: string;
    email?: string;
  };
};

type ChatbotOutput = {
  response: string;
};

/**
 * If you want to expose a chatbot function, use a regular async function export.
 * The Flow type from 'genkit' is only a type, not a runtime value.
 */
export const folioBot = async ({ message, user }: ChatbotInput): Promise<ChatbotOutput> => {
  const userContext = user 
    ? `User: ${user.name || 'Anonymous'} (${user.email || 'No email'})`
    : 'User is not logged in';

  const chatbotResponse = await ai.generate(`
You are FolioBot, a friendly assistant for the FolioFinds used bookstore platform.

${userContext}

User message: ${message}

Respond helpfully and concisely about book buying, selling, or using the platform. 
If asked about technical support or issues, suggest checking Firebase configuration or MongoDB connection.
Avoid responses longer than 150 words.
`);

  return {
    response: chatbotResponse.text,
  };
};
