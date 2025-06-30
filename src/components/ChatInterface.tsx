
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
      content: 'আসসালামু আলাইকুম! আমি আপনার শিক্ষা সহায়ক AI। আপনার যেকোনো পড়াশোনার প্রশ্ন করতে পারেন। আমি MCQ, বোর্ড প্রশ্ন, এবং পাঠ্যবই নিয়ে সাহায্য করতে পারি।',
      role: 'assistant',
      timestamp: new Date()
    }]);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call Gemini edge function
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: {
          message: inputMessage,
          conversation: messages.slice(-5) // Send last 5 messages for context
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply || 'দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।',
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "চ্যাট এরর",
        description: "চ্যাট সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive"
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।',
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
              আপনার ব্যক্তিগত পড়াশোনার সহায়ক
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
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="আপনার প্রশ্ন লিখুন..."
                className="flex-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-blue-500 bangla-text"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
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
