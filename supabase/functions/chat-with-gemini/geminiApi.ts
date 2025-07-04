
export const callGeminiAPI = async (context: string, geminiApiKey: string, retryCount = 0) => {
  const maxRetries = 2; // Reduced from 3
  const baseDelay = 1000; // Reduced from 2000ms to 1000ms
  
  console.log(`Calling Gemini API (attempt ${retryCount + 1}/${maxRetries + 1}) with context and chat history...`);

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
          temperature: 0.5, // Reduced from 0.7 for faster, more focused responses
          topP: 0.7, // Reduced from 0.8
          maxOutputTokens: 500, // Reduced from 1000 for faster responses
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      // Reduced retry logic for faster failure
      if (response.status === 429 && retryCount < maxRetries) {
        const delay = baseDelay * (retryCount + 1); // Linear backoff instead of exponential
        console.log(`Rate limited. Waiting ${delay}ms before retry ${retryCount + 1}...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return callGeminiAPI(context, geminiApiKey, retryCount + 1);
      }
      
      let errorMessage = 'AI সেবায় সমস্যা হয়েছে। আবার চেষ্টা করুন।';
      
      if (response.status === 401) {
        errorMessage = 'API কী সংক্রান্ত সমস্যা। অনুগ্রহ করে পরে চেষ্টা করুন।';
      } else if (response.status === 429) {
        errorMessage = '⚡ AI সেবা ব্যস্ত। ১ মিনিট পর চেষ্টা করুন।';
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
    
  } catch (fetchError) {
    console.error('Network error calling Gemini API:', fetchError);
    
    // Faster retry on network errors
    if (retryCount < maxRetries) {
      const delay = baseDelay * (retryCount + 1);
      console.log(`Network error. Waiting ${delay}ms before retry ${retryCount + 1}...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return callGeminiAPI(context, geminiApiKey, retryCount + 1);
    }
    
    throw new Error(JSON.stringify({ 
      error: 'নেটওয়ার্ক সমস্যা। ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।',
      details: 'Network connection failed'
    }));
  }
};
