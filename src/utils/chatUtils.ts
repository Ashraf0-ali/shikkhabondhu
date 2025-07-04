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
    .slice(-8); // Last 8 messages for context
};

export const sendChatMessage = async (
  message: string, 
  chatHistory: Message[]
): Promise<{ reply: string }> => {
  const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
    body: {
      message: message || 'ফাইল বিশ্লেষণ করুন',
      chatHistory: chatHistory
    }
  });

  if (error) {
    console.error('Function invoke error:', error);
    throw error;
  }

  if (!data || !data.reply) {
    throw new Error('Empty response from AI');
  }

  return data;
};

export const getErrorMessage = (error: any): string => {
  if (error.message?.includes('Functions')) {
    return 'AI সেবায় সমস্যা। কিছুক্ষণ পর চেষ্টা করুন।';
  } else if (error.message?.includes('network')) {
    return 'ইন্টারনেট সংযোগ সমস্যা। আবার চেষ্টা করুন।';
  }
  return 'দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।';
};