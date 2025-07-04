import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2, Paperclip, X, Image, FileText, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  hasFile?: boolean;
  fileName?: string;
  fileType?: string;
  pdfLinks?: Array<{title: string, url: string}>;
}

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
        // Set initial welcome message if no saved messages
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "ফাইল বেশি বড়",
          description: "৫ MB এর কম ফাইল আপলোড করুন",
          variant: "destructive"
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "ফাইল টাইপ সমর্থিত নয়",
          description: "ছবি, PDF বা টেক্সট ফাইল আপলোড করুন",
          variant: "destructive"
        });
        return;
      }
      
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="w-4 h-4 text-red-500" />;
    } else {
      return <FileText className="w-4 h-4" />;
    }
  };

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

  // Parse PDF links from message content
  const parsePdfLinks = (content: string) => {
    const linkRegex = /🔗 PDF লিংক: (https?:\/\/[^\s]+)/g;
    const titleRegex = /• ([^(]+) \(/g;
    const links: Array<{title: string, url: string}> = [];
    
    let match;
    const urls: string[] = [];
    const titles: string[] = [];
    
    while ((match = linkRegex.exec(content)) !== null) {
      urls.push(match[1]);
    }
    
    let titleMatch;
    while ((titleMatch = titleRegex.exec(content)) !== null) {
      titles.push(titleMatch[1].trim());
    }
    
    for (let i = 0; i < Math.min(urls.length, titles.length); i++) {
      links.push({ title: titles[i], url: urls[i] });
    }
    
    return links;
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

      // Parse PDF links from the response
      const pdfLinks = parsePdfLinks(data.reply);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        role: 'assistant',
        timestamp: new Date(),
        pdfLinks: pdfLinks.length > 0 ? pdfLinks : undefined
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
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 relative z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white bangla-text">
                AI শিক্ষক
              </h1>
              <p className="text-sm text-green-600 dark:text-green-400 bangla-text">
                অনলাইন
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating New Chat Button */}
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={clearChatHistory}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg rounded-full p-3 bangla-text"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          নতুন চ্যাট
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden" style={{ paddingBottom: '100px' }}>
        <ScrollArea className="h-full px-4 py-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                  {/* File attachment display */}
                  {message.hasFile && (
                    <div className="mb-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getFileIcon(message.fileType || '')}
                        <span className="text-sm text-blue-800 dark:text-blue-200 bangla-text">
                          {message.fileName}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className={`p-3 rounded-2xl ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}>
                    <p className={`whitespace-pre-wrap bangla-text text-sm leading-relaxed ${
                      message.role === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {message.content}
                    </p>
                  </div>

                  {/* PDF Action Buttons */}
                  {message.pdfLinks && message.pdfLinks.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.pdfLinks.map((pdfLink, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handlePdfOpen(pdfLink.url, pdfLink.title)}
                          className="bangla-text bg-green-50 hover:bg-green-100 border-green-200 text-green-800 w-full justify-start"
                        >
                          <FileText className="w-4 h-4 mr-2 text-green-600" />
                          📖 {pdfLink.title} - PDF খুলুন
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <div className={`text-xs text-gray-500 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString('bn-BD', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
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

      {/* Input Area - Fixed at bottom with higher z-index */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-[100]">
        <div className="max-w-3xl mx-auto">
          {/* File Upload Preview */}
          {uploadedFile && (
            <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon(uploadedFile.type)}
                  <div>
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200 bangla-text">
                      {uploadedFile.name}
                    </span>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Input Row */}
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="মেসেজ লিখুন..."
                className="pr-12 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 bangla-text h-11 text-sm rounded-full"
                disabled={isLoading}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.txt"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={sendMessage}
              disabled={isLoading || (!inputMessage.trim() && !uploadedFile)}
              className="bg-blue-500 hover:bg-blue-600 text-white w-11 h-11 p-0 rounded-full flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
