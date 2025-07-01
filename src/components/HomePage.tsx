import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChatBubble, Search, BrainCircuit, GraduationCap, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader className="text-center py-8">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4 bangla-text">
              🌟 শিক্ষার আলো
            </CardTitle>
            <p className="text-lg text-gray-600 dark:text-gray-300 bangla-text">
              আপনার শিক্ষার সহায়ক - MCQ, AI চ্যাট, এবং আরও অনেক কিছু
            </p>
          </CardHeader>
        </Card>

        {/* Motivational Quote */}
        {currentQuote && (
          <Card className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white shadow-2xl">
            <CardContent className="p-8 text-center">
              <Quote className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <blockquote className="text-xl font-medium bangla-text mb-4">
                "{currentQuote.quote}"
              </blockquote>
              {currentQuote.author && (
                <p className="text-sm opacity-90 bangla-text">
                  - {currentQuote.author}
                </p>
              )}
              {quotes && quotes.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {quotes.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentQuoteIndex ? 'bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/mcqs')}>
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
              <CalendarDays className="w-10 h-10 text-blue-500" />
              <h3 className="text-xl font-semibold bangla-text text-center">MCQ অনুশীলন</h3>
              <p className="text-gray-600 dark:text-gray-300 bangla-text text-center">বিভিন্ন বিষয়ের MCQ প্রশ্ন অনুশীলন করুন</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/chat')}>
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
              <ChatBubble className="w-10 h-10 text-green-500" />
              <h3 className="text-xl font-semibold bangla-text text-center">AI চ্যাট</h3>
              <p className="text-gray-600 dark:text-gray-300 bangla-text text-center">AI এর সাথে আপনার যেকোনো প্রশ্নের উত্তর খুঁজুন</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/tips')}>
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
              <BrainCircuit className="w-10 h-10 text-orange-500" />
              <h3 className="text-xl font-semibold bangla-text text-center">শিক্ষা টিপস</h3>
              <p className="text-gray-600 dark:text-gray-300 bangla-text text-center">পরীক্ষার প্রস্তুতি এবং পড়ালেখার জন্য টিপস</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/quiz')}>
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
              <GraduationCap className="w-10 h-10 text-purple-500" />
              <h3 className="text-xl font-semibold bangla-text text-center">কুইজ</h3>
              <p className="text-gray-600 dark:text-gray-300 bangla-text text-center">নিজেকে যাচাই করুন কুইজের মাধ্যমে</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/search')}>
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
              <Search className="w-10 h-10 text-teal-500" />
              <h3 className="text-xl font-semibold bangla-text text-center">স্মার্ট সার্চ</h3>
              <p className="text-gray-600 dark:text-gray-300 bangla-text text-center">যা খুঁজছেন, তা সহজেই খুঁজে বের করুন</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600 bangla-text">
              Developed by Ashraf | যেকোনো প্রয়োজনে মেসেজ করুন - 
              <a href="https://wa.me/8801825210571" className="text-blue-600 hover:underline ml-1">
                WhatsApp: 01825210571
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
