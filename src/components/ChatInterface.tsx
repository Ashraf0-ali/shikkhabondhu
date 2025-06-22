
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Upload, Image } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  attachments?: { type: 'image' | 'pdf'; url: string; name: string }[];
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'আসসালামু আলাইকুম! 😊 আমি তোমার শিক্ষা বন্ধু AI। যেকোনো পড়াশোনার সমস্যায় আমাকে জিজ্ঞেস করতে পারো। তুমি PDF বা ছবিও আপলোড করতে পারো।',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMotivationalQuote = () => {
    const quotes = [
      "📖 পড়া কখনো বৃথা যায় না — সে আজ হোক, না কাল।",
      "💪 সফলতার জন্য ধৈর্য ও অধ্যবসায় প্রয়োজন।",
      "🌟 তুমি যা ভাবো তার চেয়ে বেশি সক্ষম।",
      "🎯 লক্ষ্য নির্ধারণ করো, তারপর সে লক্ষ্যে পৌঁছানোর জন্য কাজ করো।",
      "📚 প্রতিদিন একটু একটু করে পড়লেই বিরাট পরিবর্তন আসবে।"
    ];
    
    const storedQuotes = JSON.parse(localStorage.getItem('motivationalQuotes') || '[]');
    const allQuotes = [...quotes, ...storedQuotes.map((q: any) => q.quote)];
    
    return allQuotes[Math.floor(Math.random() * allQuotes.length)];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type.includes('image') || file.type.includes('pdf')
    );
    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && attachedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage || "📎 File uploaded",
      sender: 'user',
      timestamp: new Date(),
      attachments: attachedFiles.map(file => ({
        type: file.type.includes('image') ? 'image' : 'pdf',
        url: URL.createObjectURL(file),
        name: file.name
      }))
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setAttachedFiles([]);
    setIsTyping(true);

    // Check if we need to show motivational quote
    const shouldShowQuote = Math.random() < 0.3; // 30% chance

    // Simulate thinking process for complex queries
    if (inputMessage.length > 50 || attachedFiles.length > 0) {
      setIsThinking(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsThinking(false);
    }

    setTimeout(() => {
      let botResponse = getBotResponse(inputMessage, attachedFiles.length > 0);
      
      if (shouldShowQuote) {
        botResponse += `\n\n✨ ${getMotivationalQuote()}`;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userInput: string, hasAttachment: boolean): string => {
    const input = userInput.toLowerCase();
    
    if (hasAttachment) {
      return '📄 আমি তোমার ফাইলটি বিশ্লেষণ করছি... যেকোনো প্রশ্ন থাকলে জিজ্ঞেস করো! 🤔';
    } else if (input.includes('mcq') || input.includes('প্রশ্ন')) {
      return '📊 তোমার জন্য কিছু MCQ প্রশ্ন তৈরি করছি... কোন বিষয় এবং কোন অধ্যায় থেকে চাও?';
    } else if (input.includes('অধ্যায়') || input.includes('chapter')) {
      return '📚 কোন ক্লাস এবং কোন বিষয়ের অধ্যায় সম্পর্কে জানতে চাও? আমি সাহায্য করতে পারি।';
    } else if (input.includes('ধন্যবাদ') || input.includes('thanks')) {
      return '😊 তোমার কোনো প্রশ্ন থাকলে জিজ্ঞেস করো। পড়াশোনায় সফল হও! 💪';
    } else if (input.includes('tired') || input.includes('ক্লান্ত')) {
      return `🌟 ${getMotivationalQuote()}\n\nআরাম করো, তারপর আবার চেষ্টা করো!`;
    } else {
      // Simulate Google search for missing data
      return '🔍 এই তথ্যটি এখনো সিস্টেমে যোগ হয়নি। Google থেকে খোঁজ করে তোমাকে সাহায্য করার চেষ্টা করছি... 🤔';
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
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        {message.attachments && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center space-x-2 text-xs bg-white/50 p-2 rounded">
                                {attachment.type === 'image' ? (
                                  <Image className="w-4 h-4" />
                                ) : (
                                  <Upload className="w-4 h-4" />
                                )}
                                <span>{attachment.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-[#E0F2F1] p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-5 h-5 text-[#00C49A]" />
                      <div className="text-sm">🤔 Thinking...</div>
                    </div>
                  </div>
                </div>
              )}
              
              {isTyping && !isThinking && (
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

        {/* File Attachments Preview */}
        {attachedFiles.length > 0 && (
          <Card className="mb-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
            <CardContent className="p-3">
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-[#00C49A]/10 p-2 rounded-lg">
                    {file.type.includes('image') ? (
                      <Image className="w-4 h-4 text-[#00C49A]" />
                    ) : (
                      <Upload className="w-4 h-4 text-[#00C49A]" />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Input */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="icon"
                className="border-[#00C49A] text-[#00C49A] hover:bg-[#00C49A] hover:text-white"
              >
                <Upload className="w-4 h-4" />
              </Button>
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
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
