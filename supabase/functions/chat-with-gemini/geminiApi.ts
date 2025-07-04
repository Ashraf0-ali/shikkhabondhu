
export const callGeminiAPI = async (context: string, geminiApiKey: string) => {
  console.log('Calling Gemini API...');

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: context }]
        }],
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          maxOutputTokens: 150,
        }
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      throw new Error('AI সেবায় সমস্যা হয়েছে।');
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid response structure:', data);
      throw new Error('AI থেকে সঠিক উত্তর পাওয়া যায়নি।');
    }

    const reply = data.candidates[0].content.parts[0].text.trim();
    
    if (!reply) {
      throw new Error('AI থেকে খালি উত্তর এসেছে।');
    }

    console.log('Gemini API response received successfully');
    return reply;
    
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
};
