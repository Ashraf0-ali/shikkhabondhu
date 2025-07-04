
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/components/chat/types';

export const processFileContent = async (file: File): Promise<string> => {
  if (file.type.startsWith('image/')) {
    return `[ছবি আপলোড করা হয়েছে: ${file.name}]`;
  } else if (file.type === 'application/pdf') {
    return `[PDF ফাইল আপলোড করা হয়েছে: ${file.name}]`;
  } else if (file.type === 'text/plain') {
    const text = await file.text();
    return `[টেক্সট ফাইল: ${file.name}]\n${text}`;
  }
  return '';
};

export const prepareChatHistory = (messages: Message[]): Message[] => {
  return messages
    .filter(msg => msg.content !== 'আসসালামু আলাইকুম! আমি আপনার শিক্ষা সহায়ক AI। আপনার যেকোনো পড়াশোনার প্রশ্ন করতে পারেন। আমি MCQ, বোর্ড প্রশ্ন, এবং পাঠ্যবই নিয়ে সাহায্য করতে পারি। ফাইল আপলোড করেও প্রশ্ন করতে পারেন।')
    .slice(-6); // Reduced from 8 to 6 for faster processing
};

export const sendChatMessage = async (
  message: string, 
  chatHistory: Message[]
): Promise<{ reply: string }> => {
  // Removed retry logic for faster single attempts
  try {
    const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
      body: {
        message: message || 'ফাইল বিশ্লেষণ করুন',
        chatHistory: chatHistory
      }
    });

    // Check for Supabase function invoke error
    if (error) {
      console.error('Function invoke error:', error);
      throw error;
    }

    // Check for errors returned in the response data
    if (data && data.error) {
      console.error('Function returned error:', data.error);
      throw new Error(data.error);
    }

    if (!data || !data.reply) {
      throw new Error('Empty response from AI');
    }

    return data;
    
  } catch (error) {
    throw error;
  }
};

export const getErrorMessage = (error: any): string => {
  // Try to parse JSON error messages from Gemini API
  if (error.message && typeof error.message === 'string') {
    try {
      const parsedError = JSON.parse(error.message);
      if (parsedError.error) {
        return parsedError.error;
      }
    } catch (e) {
      // Not a JSON error, continue with regular error handling
    }
  }
  
  // Handle specific error messages
  if (error.message?.includes('প্রতি মিনিটে') || error.message?.includes('খুব দ্রুত')) {
    return error.message;
  }
  
  // Handle Supabase function errors
  if (error.message?.includes('Functions') || error.message?.includes('FunctionsError')) {
    return 'AI সেবায় সমস্যা। কিছুক্ষণ পর চেষ্টা করুন।';
  } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return 'ইন্টারনেট সংযোগ সমস্যা। আবার চেষ্টা করুন।';
  } else if (error.message?.includes('API key')) {
    return 'API কী সংক্রান্ত সমস্যা। কিছুক্ষণ পর চেষ্টা করুন।';
  }
  
  return 'দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।';
};
