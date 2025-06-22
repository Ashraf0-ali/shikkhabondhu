
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'আসসালামু আলাইকুম! 😊 আমি তোমার শিক্ষা বন্ধু AI। যেকোনো পড়াশোনার সমস্যায় আমাকে জিজ্ঞেস করতে পারো।',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('mcq') || input.includes('প্রশ্ন')) {
      return '📊 তোমার জন্য কিছু MCQ প্রশ্ন তৈরি করছি... কোন বিষয় এবং কোন অধ্যায় থেকে চাও?';
    } else if (input.includes('অধ্যায়') || input.includes('chapter')) {
      return '📚 কোন ক্লাস এবং কোন বিষয়ের অধ্যায় সম্পর্কে জানতে চাও? আমি সাহায্য করতে পারি।';
    } else if (input.includes('ধন্যবাদ') || input.includes('thanks')) {
      return '😊 তোমার কোনো প্রশ্ন থাকলে জিজ্ঞেস করো। পড়াশোনায় সফল হও! 💪';
    } else {
      return '🤔 তোমার প্রশ্নটি আমি বুঝতে পারছি। আরো স্পষ্ট করে বলতে পারো? অথবা কোনো নির্দিষ্ট বিষয়ে সাহায্য চাও?';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
              📚 পড়া শিখি - Student Chat
            </h1>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="h-[60vh] bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20 mb-4">
          <CardContent className="p-4 h-full overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-[#FCE4EC] text-gray-800 ml-auto'
                        : 'bg-[#E0F2F1] text-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && (
                        <Bot className="w-5 h-5 text-[#00C49A] mt-0.5 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="w-5 h-5 text-[#8E24AA] mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#E0F2F1] p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-5 h-5 text-[#00C49A]" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#00C49A] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#00C49A] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-[#00C49A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Input */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="এখানে তোমার প্রশ্ন লিখো..."
                className="flex-1 bg-white/50 dark:bg-gray-700/50 border-white/20"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
