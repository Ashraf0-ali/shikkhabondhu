
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/components/chat/types';

export const processFileContent = async (file: File): Promise<string> => {
  try {
    if (file.type.startsWith('image/')) {
      return `[ছবি আপলোড করা হয়েছে: ${file.name}]`;
    } else if (file.type === 'application/pdf') {
      return `[PDF ফাইল আপলোড করা হয়েছে: ${file.name}]`;
    } else if (file.type === 'text/plain') {
      const text = await file.text();
      return `[টেক্সট ফাইল: ${file.name}]\n${text}`;
    }
    return '';
  } catch (error) {
    console.error('File processing error:', error);
    return `[ফাইল প্রক্রিয়াকরণে সমস্যা: ${file.name}]`;
  }
};

export const prepareChatHistory = (messages: Message[]): Message[] => {
  try {
    return messages
      .filter(msg => msg.content && msg.content.trim() !== '' && msg.content !== 'আসসালামু আলাইকুম! আমি আপনার শিক্ষা সহায়ক AI। আপনার যেকোনো পড়াশোনার প্রশ্ন করতে পারেন। আমি MCQ, বোর্ড প্রশ্ন, এবং পাঠ্যবই নিয়ে সাহায্য করতে পারি। ফাইল আপলোড করেও প্রশ্ন করতে পারেন।')
      .slice(-5); // Further reduced for faster processing
  } catch (error) {
    console.error('Chat history preparation error:', error);
    return [];
  }
};

export const sendChatMessage = async (
  message: string, 
  chatHistory: Message[]
): Promise<{ reply: string }> => {
  if (!message || message.trim() === '') {
    throw new Error('বার্তা খালি থাকতে পারে না।');
  }

  try {
    console.log('Sending message to AI:', message.substring(0, 100) + '...');
    
    const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
      body: {
        message: message,
        chatHistory: chatHistory || []
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error('AI সেবায় সংযোগ সমস্যা। আবার চেষ্টা করুন।');
    }

    if (!data) {
      throw new Error('AI থেকে কোনো উত্তর পাওয়া যায়নি।');
    }

    if (data.error) {
      console.error('AI function returned error:', data.error);
      throw new Error(data.error);
    }

    if (!data.reply || data.reply.trim() === '') {
      throw new Error('AI থেকে খালি উত্তর এসেছে।');
    }

    console.log('AI response received successfully');
    return { reply: data.reply };
    
  } catch (error) {
    console.error('Chat message error:', error);
    throw error;
  }
};

export const getErrorMessage = (error: any): string => {
  console.error('Processing error:', error);
  
  if (!error) {
    return 'অজানা সমস্যা হয়েছে।';
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle error objects
  if (error.message) {
    const message = error.message;
    
    // Try to parse JSON error messages
    try {
      const parsedError = JSON.parse(message);
      if (parsedError.error) {
        return parsedError.error;
      }
    } catch (e) {
      // Not a JSON error, continue with regular error handling
    }
    
    // Handle specific error patterns
    if (message.includes('প্রতি মিনিটে') || message.includes('খুব দ্রুত')) {
      return message;
    }
    
    if (message.includes('AI সেবায়') || message.includes('সংযোগ সমস্যা')) {
      return message;
    }
    
    if (message.includes('Functions') || message.includes('FunctionsError')) {
      return 'AI সেবায় সমস্যা। কিছুক্ষণ পর চেষ্টা করুন।';
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'ইন্টারনেট সংযোগ সমস্যা। আবার চেষ্টা করুন।';
    }
    
    if (message.includes('API key')) {
      return 'API কী সংক্রান্ত সমস্যা। কিছুক্ষণ পর চেষ্টা করুন।';
    }
    
    return message;
  }
  
  return 'দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।';
};
