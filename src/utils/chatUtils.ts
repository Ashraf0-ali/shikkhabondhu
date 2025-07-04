
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
      .filter(msg => msg.content && msg.content.trim() !== '')
      .slice(-2); // শুধু শেষ ২টি মেসেজ - দ্রুততার জন্য
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
    console.log('Sending message to AI...');
    
    // টাইমআউট সেট করি - ১০ সেকেন্ড
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
      body: {
        message: message,
        chatHistory: prepareChatHistory(chatHistory || [])
      }
    });

    clearTimeout(timeoutId);

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error('AI সেবায় সংযোগ সমস্যা। আবার চেষ্টা করুন।');
    }

    if (!data || data.error) {
      console.error('AI function error:', data?.error);
      throw new Error(data?.error || 'AI থেকে উত্তর পাওয়া যায়নি।');
    }

    if (!data.reply || data.reply.trim() === '') {
      throw new Error('AI থেকে খালি উত্তর এসেছে।');
    }

    console.log('AI response received successfully');
    return { reply: data.reply };
    
  } catch (error) {
    console.error('Chat message error:', error);
    if (error.name === 'AbortError') {
      throw new Error('AI রেসপন্স টাইমআউট। আবার চেষ্টা করুন।');
    }
    throw error;
  }
};

export const getErrorMessage = (error: any): string => {
  console.error('Processing error:', error);
  
  if (!error) {
    return 'অজানা সমস্যা হয়েছে।';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error.message) {
    const message = error.message;
    
    if (message.includes('টাইমআউট')) {
      return 'AI রেসপন্স দেরি হচ্ছে। আবার চেষ্টা করুন।';
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
    
    return message;
  }
  
  return 'দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।';
};
