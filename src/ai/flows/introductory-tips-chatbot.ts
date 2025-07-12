'use server';

/**
 * @fileOverview A chatbot flow that provides introductory tips to new users.
 *
 * - getIntroductoryTips - A function that returns introductory tips for new users.
 * - IntroductoryTipsInput - The input type for the getIntroductoryTips function.
 * - IntroductoryTipsOutput - The return type for the getIntroductoryTips function.
 */

import { ai } from '../genkit';
import { z } from 'genkit';
import { defineFlow } from '@genkit-ai/flow';

const IntroductoryTipsInputSchema = z.object({
  userType: z
    .string()
    .describe("The type of user, e.g., 'new', 'returning', etc."),
});
export type IntroductoryTipsInput = z.infer<typeof IntroductoryTipsInputSchema>;

const IntroductoryTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('Helpful introductory tips for the user.'),
});
export type IntroductoryTipsOutput = z.infer<typeof IntroductoryTipsOutputSchema>;
export const introductoryTipsFlow = defineFlow(
  {
    name: 'introductoryTipsFlow',
    inputSchema: IntroductoryTipsInputSchema,
    outputSchema: IntroductoryTipsOutputSchema,
  },
  async (input: IntroductoryTipsInput): Promise<IntroductoryTipsOutput> => {
    const tipsResponse = await ai.generate(
      `Generate 3-5 short, helpful tips for new users of FolioFinds, a platform for buying and selling used books.
Each tip should be 1-2 sentences. Format as a bulleted list.`
    );

    // Clean up and filter only bulleted lines
    const tips = tipsResponse.text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.startsWith('•'))
      .map(line => line.replace(/^[-•]\s*/, ''))
      .filter(Boolean);

    return {
      tips,
    };
  }
);

export async function getIntroductoryTips(
  input: IntroductoryTipsInput
): Promise<IntroductoryTipsOutput> {
  return introductoryTipsFlow.run(input);
}
