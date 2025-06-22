
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, FileQuestion, Settings, Lightbulb, Gamepad2, Search, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const defaultQuotes = [
    "📖 পড়া কখনো বৃথা যায় না — সে আজ হোক, না কাল।",
    "💪 সফলতার জন্য ধৈর্য ও অধ্যবসায় প্রয়োজন।",
    "🌟 তুমি যা ভাবো তার চেয়ে বেশি সক্ষম।",
    "🎯 লক্ষ্য নির্ধারণ করো, তারপর সে লক্ষ্যে পৌঁছানোর জন্য কাজ করো।",
    "📚 প্রতিদিন একটু একটু করে পড়লেই বিরাট পরিবর্তন আসবে।"
  ];

  const loadRandomQuote = () => {
    const storedQuotes = JSON.parse(localStorage.getItem('motivationalQuotes') || '[]');
    const allQuotes = [...defaultQuotes, ...storedQuotes.map((q: any) => q.quote)];
    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    setCurrentQuote(randomQuote);
  };

  useEffect(() => {
    loadRandomQuote();
  }, []);

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "📚 পড়া শিখি",
      subtitle: "Student Chat",
      description: "Ask anything & get chapter-wise help",
      action: () => navigate('/chat')
    },
    {
      icon: <FileQuestion className="w-8 h-8" />,
      title: "📊 বোর্ড প্রশ্ন",
      subtitle: "Board MCQs", 
      description: "Practice previous board/admission questions",
      action: () => navigate('/mcqs')
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "🛠️ এডমিন প্যানেল",
      subtitle: "Admin Tools",
      description: "Upload books, questions, CSVs",
      action: () => navigate('/admin')
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "💡 পরামর্শ নাও",
      subtitle: "Tips & Feedback",
      description: "Study tips & motivational quotes",
      action: () => navigate('/tips')
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "🎮 প্র্যাকটিস গেম",
      subtitle: "Quiz Mode",
      description: "Flashcards & quizzes to test memory",
      action: () => navigate('/quiz')
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      // You can add search results navigation here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          📘 Shikkha Bondhu AI
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Your Smart Study Companion
        </p>
        <div className="mt-4 p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Developed by <span className="font-semibold text-[#8E24AA]">Ashraf Ali</span>
          </p>
        </div>
      </div>

      {/* Motivational Quote Section */}
      <div className="max-w-2xl mx-auto mb-8">
        <Card className="bg-gradient-to-r from-[#00C49A]/20 to-[#8E24AA]/20 backdrop-blur-md border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">✨ আজকের অনুপ্রেরণা</h3>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {currentQuote}
                </p>
              </div>
              <Button 
                onClick={loadRandomQuote}
                variant="ghost" 
                size="icon"
                className="ml-4 text-[#00C49A] hover:bg-[#00C49A]/10"
              >
                <RefreshCw className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="বই, প্রশ্ন, নোট খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-white/50 dark:bg-gray-700/50 border-white/20"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white px-6"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="max-w-4xl mx-auto space-y-4 mb-20">
        {features.map((feature, index) => (
          <Card 
            key={index}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            onClick={feature.action}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#00C49A] to-[#8E24AA] rounded-xl flex items-center justify-center text-white shadow-lg">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#8E24AA] font-medium mb-2">
                    {feature.subtitle}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
                <div className="text-[#00C49A] text-2xl">→</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* NCTB Books Section */}
      <div className="max-w-4xl mx-auto mb-20">
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20 shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
              📚 NCTB Books (Class 6-12)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({length: 7}, (_, i) => i + 6).map((classNum) => (
                <Button
                  key={classNum}
                  variant="outline"
                  className="h-16 border-[#00C49A] text-[#00C49A] hover:bg-[#00C49A] hover:text-white"
                  onClick={() => console.log(`Class ${classNum} books`)}
                >
                  <div className="text-center">
                    <div className="font-bold">Class {classNum}</div>
                    <div className="text-xs">Books</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
