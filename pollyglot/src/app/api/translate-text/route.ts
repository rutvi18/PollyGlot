// src/app/api/translate-text/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with your API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { sentence, targetLanguage } = await request.json();

    // --- Input Validation ---
    if (!sentence || typeof sentence !== 'string' || sentence.length === 0) {
      return NextResponse.json({ error: 'Sentence to translate is required.' }, { status: 400 });
    }
    if (!targetLanguage || typeof targetLanguage !== 'string' || targetLanguage.length === 0) {
      return NextResponse.json({ error: 'Target language is required.' }, { status: 400 });
    }

    console.log(`Translating "${sentence.substring(0, 50)}..." to ${targetLanguage}`);

    // --- Construct Prompt for OpenAI Chat Completions API ---
    const systemPrompt = `You are a highly accurate and fluent language translator. Your task is to translate the given sentence into the specified target language. Provide only the translated text, without any additional commentary, explanations, or formatting.`;

    const userPrompt = `Translate the following sentence into ${targetLanguage}:\n\n"${sentence}"`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // You can use "gpt-3.5-turbo" for lower cost, but gpt-4o is better for translation quality
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 500, // Adjust based on expected length of translated text
      temperature: 0.2, // Lower temperature for more deterministic and accurate translation
    });

    const translatedText = response.choices[0].message.content?.trim();

    if (!translatedText) {
      return NextResponse.json({ error: 'Translation failed or returned empty.' }, { status: 500 });
    }

    return NextResponse.json({ translatedText });

  } catch (error) {
    console.error('Error during translation:', error);
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json({ error: error.message, code: error.status }, { status: error.status });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}