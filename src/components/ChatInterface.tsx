import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2, Paperclip, X } from 'lucide-react';
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
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
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
      `${inputMessage.trim() || 'ফাইল আপলোড করেছি'} [ফাইল: ${uploadedFile.name}]` : 
      inputMessage.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      timestamp: new Date(),
      hasFile: !!uploadedFile,
      fileName: uploadedFile?.name
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2 bangla-text">
              চ্যাটবট লোড হচ্ছে...
            </h2>
            <p className="text-gray-600 dark:text-gray-400 bangla-text">
              অনুগ্রহ করে অপেক্ষা করুন
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!chatbotSettings?.is_enabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2 bangla-text">
              চ্যাটবট সেবা বন্ধ
            </h2>
            <p className="text-gray-600 dark:text-gray-400 bangla-text">
              চ্যাটবট সেবা বর্তমানে রক্ষণাবেক্ষণের জন্য বন্ধ রয়েছে। অসুবিধার জন্য দুঃখিত।
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader className="text-center py-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-2 bangla-text">
              🤖 AI শিক্ষক
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 bangla-text">
              আপনার ব্যক্তিগত পড়াশোনার সহায়ক - ফাইল আপলোড সহ
            </p>
          </CardHeader>
        </Card>

        {/* Chat Messages */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardContent className="p-0">
            <ScrollArea 
              ref={scrollAreaRef}
              className="h-[500px] p-6 space-y-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-purple-500 text-white'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white ml-8'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mr-8'
                    }`}>
                      <p className="whitespace-pre-wrap bangla-text leading-relaxed">
                        {message.content}
                      </p>
                      {message.hasFile && (
                        <div className="mt-2 text-xs opacity-75">
                          📎 {message.fileName}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1 max-w-[80%]">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 mr-8">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-gray-600 dark:text-gray-300 bangla-text">
                          চিন্তা করছি...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Input Area */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardContent className="p-4">
            {/* File Upload Preview */}
            {uploadedFile && (
              <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800 dark:text-blue-200 bangla-text">
                      {uploadedFile.name}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      ({(uploadedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="আপনার প্রশ্ন লিখুন বা ফাইল আপলোড করুন..."
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-blue-500 bangla-text pr-12"
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
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={sendMessage}
                disabled={isLoading || (!inputMessage.trim() && !uploadedFile)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Suggestions */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 bangla-text">
              দ্রুত প্রশ্ন:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                "গণিতের একটি সমস্যা সমাধান করুন",
                "ইংরেজি গ্রামার ব্যাখ্যা করুন",
                "বিজ্ঞানের একটি ধারণা বুঝিয়ে দিন",
                "ইতিহাসের একটি ঘটনা বলুন",
                "MCQ সমাধানের কৌশল",
                "পরীক্ষার প্রস্তুতির টিপস"
              ].map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => setInputMessage(suggestion)}
                  className="text-left justify-start h-auto py-2 px-3 text-sm bangla-text hover:bg-blue-50 dark:hover:bg-gray-700"
                  disabled={isLoading}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
