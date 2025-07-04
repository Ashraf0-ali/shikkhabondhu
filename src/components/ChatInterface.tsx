
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2, Paperclip, X, Image, FileText } from 'lucide-react';
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
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    setMessages([{
      id: '1',
      content: 'আসসালামু আলাইকুম! আমি আপনার শিক্ষা সহায়ক AI। আপনার যেকোনো পড়াশোনার প্রশ্ন করতে পারেন। আমি MCQ, বোর্ড প্রশ্ন, এবং পাঠ্যবই নিয়ে সাহায্য করতে পারি। ফাইল আপলোড করেও প্রশ্ন করতে পারেন।',
      role: 'assistant',
      timestamp: new Date()
    }]);
  }, []);

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
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white bangla-text">
              AI শিক্ষক
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 bangla-text">
              আপনার ব্যক্তিগত পড়াশোনার সহায়ক
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area - Scrollable with proper spacing for bottom navigation */}
      <div className="flex-1 overflow-hidden" style={{ paddingBottom: '80px' }}>
        <ScrollArea className="h-full px-4 py-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-500' 
                      : 'bg-green-500'
                  }`}>
                    {message.role === 'user' ? 
                      <User className="w-5 h-5 text-white" /> : 
                      <Bot className="w-5 h-5 text-white" />
                    }
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white bangla-text">
                      {message.role === 'user' ? 'আপনি' : 'AI শিক্ষক'}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {/* File attachment display */}
                  {message.hasFile && (
                    <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                      <div className="flex items-center gap-2">
                        {getFileIcon(message.fileType || '')}
                        <span className="text-sm text-gray-700 dark:text-gray-300 bangla-text">
                          {message.fileName}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 max-w-none">
                    <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 bangla-text leading-relaxed text-base">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white bangla-text">
                      AI শিক্ষক
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-gray-500 bangla-text">চিন্তা করছি...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Fixed at bottom with proper spacing */}
      <div className="fixed bottom-16 left-0 right-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 z-10">
        <div className="max-w-4xl mx-auto">
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
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="আপনার প্রশ্ন লিখুন..."
                className="pr-12 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-blue-500 bangla-text h-12 text-base"
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
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={sendMessage}
              disabled={isLoading || (!inputMessage.trim() && !uploadedFile)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 h-12"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Quick Suggestions */}
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {[
                "গণিতের সমস্যা সমাধান",
                "ইংরেজি গ্রামার",
                "বিজ্ঞানের ধারণা",
                "MCQ সমাধান",
                "পরীক্ষার টিপস"
              ].map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(suggestion)}
                  className="text-xs bangla-text hover:bg-blue-50 dark:hover:bg-gray-800"
                  disabled={isLoading}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
