export const callGeminiAPI = async (context: string, geminiApiKey: string) => {
  console.log('Calling Gemini API with context and chat history...');

  const messages = [
    {
      parts: [{ text: context }]
    }
  ];

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: messages,
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 800,
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', response.status, errorText);
    
    let errorMessage = 'AI সেবায় সমস্যা হয়েছে। আবার চেষ্টা করুন।';
    
    if (response.status === 401) {
      errorMessage = 'API কী সংক্রান্ত সমস্যা। অনুগ্রহ করে পরে চেষ্টা করুন।';
    } else if (response.status === 429) {
      errorMessage = '🚫 খুব বেশি অনুরোধ! ৫-১০ মিনিট পর আবার চেষ্টা করুন।\n\n💡 টিপসঃ একসাথে অনেক প্রশ্ন না করে একটু সময় নিয়ে প্রশ্ন করুন।';
    } else if (response.status >= 500) {
      errorMessage = 'সার্ভার সমস্যা। কিছুক্ষণ পর আবার চেষ্টা করুন।';
    }
    
    throw new Error(JSON.stringify({ 
      error: errorMessage,
      details: `HTTP ${response.status}` 
    }));
  }

  const data = await response.json();
  console.log('Gemini API response received successfully');
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    console.error('Invalid Gemini API response structure:', data);
    throw new Error(JSON.stringify({ 
      error: 'AI থেকে সঠিক উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।',
      details: 'Invalid API response structure'
    }));
  }

  const reply = data.candidates[0].content.parts[0].text;

  if (!reply || reply.trim().length === 0) {
    throw new Error(JSON.stringify({ 
      error: 'AI থেকে কোনো উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।',
      details: 'Empty response from AI'
    }));
  }

  console.log('Successfully generated contextual reply with chat history');
  return reply.trim();
};