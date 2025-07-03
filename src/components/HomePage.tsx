
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MessageCircle, Search, BrainCircuit, GraduationCap, Quote, Target, BookOpen } from 'lucide-react';
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
              🌟 শিক্ষা বন্ধু AI
            </CardTitle>
            <p className="text-lg text-gray-600 dark:text-gray-300 bangla-text">
              আপনার শিক্ষার সহায়ক - MCQ, AI চ্যাট, এবং আরও অনেক কিছু
            </p>
          </CardHeader>
        </Card>

        {/* Motivational Quote - Smaller Design */}
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

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/chat')}>
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
              <MessageCircle className="w-10 h-10 text-green-500" />
              <h3 className="text-xl font-semibold bangla-text text-center">AI চ্যাট</h3>
              <p className="text-gray-600 dark:text-gray-300 bangla-text text-center">AI এর সাথে আপনার যেকোনো প্রশ্নের উত্তর খুঁজুন</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/mcqs')}>
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
              <CalendarDays className="w-10 h-10 text-blue-500" />
              <h3 className="text-xl font-semibold bangla-text text-center">MCQ প্রশ্ন</h3>
              <p className="text-gray-600 dark:text-gray-300 bangla-text text-center">বিভিন্ন বিষয়ের MCQ প্রশ্ন দেখুন</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/practice')}>
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
              <Target className="w-10 h-10 text-purple-500" />
              <h3 className="text-xl font-semibold bangla-text text-center">MCQ অনুশীলন</h3>
              <p className="text-gray-600 dark:text-gray-300 bangla-text text-center">ইন্টারেক্টিভ MCQ অনুশীলন করুন</p>
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

        {/* NCTB Books Section */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center bangla-text flex items-center justify-center gap-2">
              <BookOpen className="w-8 h-8 text-blue-500" />
              📚 NCTB বই
            </CardTitle>
            <p className="text-center text-gray-600 dark:text-gray-300 bangla-text">
              সরকারি পাঠ্যবই পড়ুন এবং ডাউনলোড করুন
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { class: "৬ষ্ঠ শ্রেণী", level: 6 },
                { class: "৭ম শ্রেণী", level: 7 },
                { class: "৮ম শ্রেণী", level: 8 },
                { class: "৯ম-১০ম শ্রেণী", level: 9 }
              ].map((item) => (
                <Button
                  key={item.level}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bangla-text hover:bg-blue-50 dark:hover:bg-gray-700"
                  onClick={() => {
                    // Navigate to a books page with class filter
                    navigate(`/search?type=books&class=${item.level}`);
                  }}
                >
                  <BookOpen className="w-6 h-6 text-blue-500" />
                  <span className="text-sm font-medium">{item.class}</span>
                </Button>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                className="bangla-text"
                onClick={() => navigate('/search?type=books')}
              >
                সব বই দেখুন
              </Button>
            </div>
          </CardContent>
        </Card>

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
