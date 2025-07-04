
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ChatHeader from './chat/ChatHeader';
import ChatInput from './chat/ChatInput';
import MessagesList from './chat/MessagesList';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';
import { processFileContent, prepareChatHistory, sendChatMessage, getErrorMessage } from '@/utils/chatUtils';
import { Message } from './chat/types';

const ChatInterface = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { messages, setMessages, clearChatHistory } = useChatMessages();
  const isKeyboardVisible = useKeyboardVisibility();

  const { data: chatbotSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['chatbot_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chatbot_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearHistory = () => {
    clearChatHistory();
    toast({
      title: "চ্যাট হিস্ট্রি মুছে ফেলা হয়েছে",
      description: "নতুন কথোপকথন শুরু করুন"
    });
  };

  const handlePdfOpen = (url: string, title: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const sendMessage = async () => {
    if ((!inputMessage.trim() && !uploadedFile) || isLoading) return;

    if (!chatbotSettings?.is_enabled) {
      toast({
        title: "চ্যাটবট বন্ধ",
        description: "চ্যাটবট সেবা বর্তমানে বন্ধ রয়েছে",
        variant: "destructive"
      });
      return;
    }

    const messageContent = uploadedFile ? 
      `${inputMessage.trim() || 'ফাইল আপলোড করেছি'}` : 
      inputMessage.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      timestamp: new Date(),
      hasFile: !!uploadedFile,
      fileName: uploadedFile?.name,
      fileType: uploadedFile?.type
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    const currentFile = uploadedFile;
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsLoading(true);

    try {
      const fileContent = currentFile ? await processFileContent(currentFile) : '';
      const finalMessage = fileContent ? 
        `${inputMessage.trim()}\n\n${fileContent}` : 
        inputMessage.trim();

      const data = await sendChatMessage(finalMessage, []);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Send message error:', error);
      
      const errorMsg = getErrorMessage(error);

      toast({
        title: "চ্যাট এরর",
        description: errorMsg,
        variant: "destructive"
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `দুঃখিত, ${errorMsg}`,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-blue-500 animate-spin" />
          <p className="text-gray-600 bangla-text">চ্যাটবট লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!chatbotSettings?.is_enabled) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-700 mb-2 bangla-text">
            চ্যাটবট সেবা বন্ধ
          </h2>
          <p className="text-gray-600 bangla-text">
            চ্যাটবট সেবা বর্তমানে রক্ষণাবেক্ষণের জন্য বন্ধ রয়েছে।
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <ChatHeader onClearHistory={handleClearHistory} />

      <MessagesList
        messages={messages}
        isLoading={isLoading}
        onPdfOpen={handlePdfOpen}
        messagesEndRef={messagesEndRef}
      />

      <ChatInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
        isLoading={isLoading}
        onSendMessage={sendMessage}
        onKeyPress={handleKeyPress}
        fileInputRef={fileInputRef}
        inputRef={inputRef}
      />
    </div>
  );
};

export default ChatInterface;
