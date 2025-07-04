
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/components/chat/types';

export const processFileContent = async (file: File): Promise<string> => {
  try {
    if (file.type.startsWith('image/')) {
      return `[ছবি: ${file.name}]`;
    } else if (file.type === 'application/pdf') {
      return `[PDF: ${file.name}]`;
    } else if (file.type === 'text/plain') {
      const text = await file.text();
      return `[টেক্সট: ${file.name}]\n${text.substring(0, 500)}`;
    }
    return '';
  } catch (error) {
    console.error('File processing error:', error);
    return `[ফাইল: ${file.name}]`;
  }
};

export const prepareChatHistory = (messages: Message[]): Message[] => {
  return messages
    .filter(msg => msg.content && msg.content.trim() !== '')
    .slice(-1); // শুধু শেষ মেসেজ
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
    
    const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
      body: { message: message.trim() }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error('AI সেবায় সংযোগ সমস্যা।');
    }

    if (!data) {
      throw new Error('AI থেকে কোনো উত্তর পাওয়া যায়নি।');
    }

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.reply || data.reply.trim() === '') {
      throw new Error('AI থেকে খালি উত্তর।');
    }

    console.log('AI response received');
    return { reply: data.reply };
    
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
};

export const getErrorMessage = (error: any): string => {
  if (!error) {
    return 'অজানা সমস্যা হয়েছে।';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error.message) {
    return error.message;
  }
  
  return 'দুঃখিত, একটি সমস্যা হয়েছে।';
};
