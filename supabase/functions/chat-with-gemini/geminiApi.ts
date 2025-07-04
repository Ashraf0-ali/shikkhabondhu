
export const callGeminiAPI = async (context: string, geminiApiKey: string, retryCount = 0) => {
  const maxRetries = 0; // রিট্রাই বন্ধ - দ্রুত রেসপন্সের জন্য
  
  console.log('Calling Gemini API...');

  const messages = [
    {
      parts: [{ text: context }]
    }
  ];

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.2,
          topP: 0.5,
          maxOutputTokens: 200, // আরও কমিয়ে দিলাম
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      let errorMessage = 'AI সেবায় সমস্যা হয়েছে। আবার চেষ্টা করুন।';
      
      if (response.status === 401) {
        errorMessage = 'API কী সংক্রান্ত সমস্যা।';
      } else if (response.status === 429) {
        errorMessage = 'AI সেবা ব্যস্ত। ১ মিনিট পর চেষ্টা করুন।';
      } else if (response.status >= 500) {
        errorMessage = 'সার্ভার সমস্যা। কিছুক্ষণ পর চেষ্টা করুন।';
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Gemini API response received');
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid response structure:', data);
      throw new Error('AI থেকে সঠিক উত্তর পাওয়া যায়নি।');
    }

    const reply = data.candidates[0].content.parts[0].text;

    if (!reply || reply.trim().length === 0) {
      throw new Error('AI থেকে কোনো উত্তর পাওয়া যায়নি।');
    }

    return reply.trim();
    
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw new Error('AI সেবায় সমস্যা। আবার চেষ্টা করুন।');
  }
};
