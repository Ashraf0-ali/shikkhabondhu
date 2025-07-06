import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MessageCircle, Search, BrainCircuit, GraduationCap, Quote, Target, BookOpen, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DarkModeToggle from './DarkModeToggle';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Fetch motivational quotes
  const { data: quotes } = useQuery({
    queryKey: ['motivational_quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motivational_quotes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Auto-rotate quotes every 5 seconds
  useEffect(() => {
    if (quotes && quotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prevIndex) => 
          prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [quotes]);

  const currentQuote = quotes && quotes.length > 0 ? quotes[currentQuoteIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader className="text-center py-8">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4 bangla-text font-shurjo">
              শিক্ষা বন্ধু AI
            </CardTitle>
            <p className="text-lg text-gray-600 dark:text-gray-300 bangla-text">
              AI এর সাহায্যে শিক্ষাকে করুন আরও সহজ এবং আনন্দদায়ক
            </p>
          </CardHeader>
        </Card>

        {/* Top Utility Bar: Admin Button + Dark Mode */}
<div className="fixed top-4 left-0 right-0 px-4 flex justify-between items-center z-50">
  <Button
    onClick={() => navigate('/admin')}
    variant="outline"
    size="sm"
    className="bangla-text bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20"
  >
    <Settings className="w-4 h-4 mr-1" />
    Admin
  </Button>
  <DarkModeToggle />
</div>

        {/* Motivational Quote */}
        {currentQuote && (
          <Card className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-xl border-white/20 shadow-lg">
            <CardContent className="p-4 text-center">
              <Quote className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <blockquote className="text-base font-medium bangla-text mb-2 text-gray-700 dark:text-gray-300">
                "{currentQuote.quote}"
              </blockquote>
              {currentQuote.author && (
                <p className="text-xs text-gray-500 bangla-text">
                  - {currentQuote.author}
                </p>
              )}
              {quotes && quotes.length > 1 && (
                <div className="flex justify-center mt-2 space-x-1">
                  {quotes.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${
                        index === currentQuoteIndex ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Service Cards Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold bangla-text text-gray-800 dark:text-gray-200 mb-2">
            আমাদের সেবাসমূহ
          </h2>
        </div>

        {/* Service Cards */}
        <div className="space-y-4">
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/chat')}>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold bangla-text">AI চ্যাট</h3>
                <p className="text-gray-600 dark:text-gray-300 bangla-text text-sm">
                  কৃত্রিম বুদ্ধিমত্তা সাহায্যে যেকোনো প্রশ্নের উত্তর পান
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/mcqs')}>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold bangla-text">MCQ অনুশীলন</h3>
                <p className="text-gray-600 dark:text-gray-300 bangla-text text-sm">
                  বিভিন্ন বিষয়ের MCQ প্রশ্ন অনুশীলন করুন
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/search')}>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold bangla-text">স্মার্ট সার্চ</h3>
                <p className="text-gray-600 dark:text-gray-300 bangla-text text-sm">
                  ক্লাস এবং বিষয় ভিত্তিক তথ্য খুঁজে পান
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/quiz')}>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold bangla-text">কুইজ প্রতিযোগিতা</h3>
                <p className="text-gray-600 dark:text-gray-300 bangla-text text-sm">
                  নিজের মেধা যাচাই করে কুইজে অংশগ্রহণ করুন
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/tips')}>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold bangla-text">শিক্ষা টিপস</h3>
                <p className="text-gray-600 dark:text-gray-300 bangla-text text-sm">
                  পড়াশোনার কার্যকরী টিপস এবং কৌশল
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/search?type=books')}>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold bangla-text">বই সংগ্রহ</h3>
                <p className="text-gray-600 dark:text-gray-300 bangla-text text-sm">
                  NCTB এবং অনেক তথ্যপূর্ণ বই
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600 bangla-text">
              © ২০২৪ শিক্ষা প্ল্যাটফর্ম। সর্বস্বত্ব সংরক্ষিত।
 								Developed by Ashraf Ali
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
