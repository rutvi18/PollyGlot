// src/app/page.tsx
'use client'; // This directive is crucial for client-side components in Next.js App Router

import { useState, FormEvent } from 'react';

// Define a list of common languages for the dropdown
const LANGUAGES = [
  { name: "Spanish", value: "Spanish" },
  { name: "French", value: "French" },
  { name: "German", value: "German" },
  { name: "Italian", value: "Italian" },
  { name: "Japanese", value: "Japanese" },
  { name: "Korean", value: "Korean" },
  { name: "Chinese (Simplified)", value: "Chinese (Simplified)" },
  { name: "Hindi", value: "Hindi" },
  { name: "Arabic", value: "Arabic" },
  { name: "Portuguese", value: "Portuguese" },
  { name: "Russian", value: "Russian" },
  { name: "Tamil", value: "Tamil" },
  { name: "Bengali", value: "Bengali" },
  { name: "English", value: "English" }, // Allow translating back to English or from English
];

export default function PolyglotTranslator() {
  const [sentence, setSentence] = useState<string>('');
  const [targetLanguage, setTargetLanguage] = useState<string>(LANGUAGES[0].value);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTranslatedText('');
    setError(null);

    try {
      const response = await fetch('/api/translate-text', { // Call your API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence, targetLanguage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to translate sentence.');
      }

      const data = await response.json();
      setTranslatedText(data.translatedText);

    } catch (err: any) {
      console.error('Frontend error:', err);
      setError(err.message || 'An unexpected error occurred during translation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          Polyglot Translator 🌐
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="sentence-input" className="block text-sm font-medium text-gray-700 mb-1">
              Sentence to Translate:
            </label>
            <textarea
              id="sentence-input"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              rows={4}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-base"
              placeholder="Enter the sentence you want to translate..."
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">
              Translate To:
            </label>
            <select
              id="language-select"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-base bg-white"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            disabled={isLoading || !sentence.trim()}
          >
            {isLoading ? 'Translating...' : 'Translate Sentence'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            <p>Error: {error}</p>
          </div>
        )}

        {translatedText && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Translated Text:</h2>
            <textarea
              readOnly
              value={translatedText}
              rows={4}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 text-base resize-none"
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
}