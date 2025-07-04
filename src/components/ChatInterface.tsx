import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2, Paperclip, X, Image, FileText, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import ChatHeader from './chat/ChatHeader';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';
import { Message } from './chat/types';

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Check if chatbot is enabled
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

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Error loading chat history:', error);
        setInitialMessage();
      }
    } else {
      setInitialMessage();
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const setInitialMessage = () => {
    setMessages([{
      id: '1',
      content: 'আসসালামু আলাইকুম! আমি আপনার শিক্ষা সহায়ক AI। আপনার যেকোনো পড়াশোনার প্রশ্ন করতে পারেন। আমি MCQ, বোর্ড প্রশ্ন, এবং পাঠ্যবই নিয়ে সাহায্য করতে পারি। ফাইল আপলোড করেও প্রশ্ন করতে পারেন।',
      role: 'assistant',
      timestamp: new Date()
    }]);
  };

  // Handle keyboard visibility for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const heightDiff = window.innerHeight - window.visualViewport.height;
        setIsKeyboardVisible(heightDiff > 150);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    window.addEventListener('resize', handleResize);
    
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clearChatHistory = () => {
    localStorage.removeItem('chatMessages');
    setInitialMessage();
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

    // Check if chatbot is enabled
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
      let fileContent = '';
      
      // Process file if uploaded
      if (currentFile) {
        if (currentFile.type.startsWith('image/')) {
          fileContent = `[ছবি আপলোড করা হয়েছে: ${currentFile.name}]`;
        } else if (currentFile.type === 'application/pdf') {
          fileContent = `[PDF ফাইল আপলোড করা হয়েছে: ${currentFile.name}]`;
        } else if (currentFile.type === 'text/plain') {
          const text = await currentFile.text();
          fileContent = `[টেক্সট ফাইল: ${currentFile.name}]\n${text}`;
        }
      }

      const finalMessage = fileContent ? 
        `${inputMessage.trim()}\n\n${fileContent}` : 
        inputMessage.trim();

      // Call Gemini edge function
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: {
          message: finalMessage || 'ফাইল বিশ্লেষণ করুন'
        }
      });

      if (error) {
        console.error('Function invoke error:', error);
        throw error;
      }

      if (!data || !data.reply) {
        throw new Error('Empty response from AI');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMsg = 'দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।';
      
      if (error.message?.includes('Functions')) {
        errorMsg = 'AI সেবায় সমস্যা। কিছুক্ষণ পর চেষ্টা করুন।';
      } else if (error.message?.includes('network')) {
        errorMsg = 'ইন্টারনেট সংযোগ সমস্যা। আবার চেষ্টা করুন।';
      }

      toast({
        title: "চ্যাট এরর",
        description: errorMsg,
        variant: "destructive"
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMsg,
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

  // Show loading while checking settings
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
      <ChatHeader onClearHistory={clearChatHistory} />

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden" style={{ paddingBottom: '100px' }}>
        <ScrollArea className="h-full px-4 py-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                onPdfOpen={handlePdfOpen}
              />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-green-500" />
                    <span className="text-gray-500 bangla-text text-sm">টাইপ করছি...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

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
