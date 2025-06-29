
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, FileQuestion, Search, Users, Trophy, MessageCircle, ChevronRight, Book, FileText, GraduationCap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  // Fetch NCTB books from Supabase
  const { data: nctbBooks = [], isLoading } = useQuery({
    queryKey: ['nctb_books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nctb_books')
        .select('*')
        .order('class_level', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch motivational quote
  const { data: quote } = useQuery({
    queryKey: ['motivational_quote'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motivational_quotes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) return null;
      return data;
    },
  });

  // Group books by class
  const booksByClass = nctbBooks.reduce((acc, book) => {
    const classKey = `Class ${book.class_level}`;
    if (!acc[classKey]) {
      acc[classKey] = [];
    }
    acc[classKey].push(book);
    return acc;
  }, {} as Record<string, typeof nctbBooks>);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader className="text-center py-8">
            <CardTitle className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
              🎓 শিক্ষার্থী সহায়ক
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 text-xl max-w-2xl mx-auto">
              আপনার পড়াশোনার সঙ্গী - বোর্ড প্রশ্ন, MCQ, AI সহায়তা এবং আরও অনেক কিছু
            </p>
          </CardHeader>
        </Card>

        {/* Motivational Quote */}
        {quote && (
          <Card className="bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-xl border-white/30 shadow-xl">
            <CardContent className="p-8">
              <blockquote className="text-xl font-medium text-gray-700 dark:text-gray-200 italic text-center leading-relaxed">
                "{quote.quote}"
              </blockquote>
              {quote.author && (
                <p className="text-right text-gray-500 dark:text-gray-400 mt-4 text-lg">
                  - {quote.author}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-blue-500 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Ask AI
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                AI এর সাথে চ্যাট করে যেকোনো প্রশ্নের উত্তর পান
              </p>
              <Button 
                onClick={() => handleNavigation('/chat')}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg"
              >
                চ্যাট শুরু করুন
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FileQuestion className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                MCQ প্র্যাকটিস
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                বোর্ড প্রশ্নের MCQ দিয়ে প্র্যাকটিস করুন
              </p>
              <Button 
                onClick={() => handleNavigation('/mcqs')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
              >
                প্র্যাকটিস শুরু করুন
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                স্মার্ট সার্চ
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                যেকোনো বিষয়ে তাৎক্ষণিক সার্চ করুন
              </p>
              <Button 
                onClick={() => handleNavigation('/search')}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg"
              >
                সার্চ করুন
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                কুইজ গেম
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                মজার কুইজ খেলে শিখুন
              </p>
              <Button 
                onClick={() => handleNavigation('/quiz')}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg"
              >
                গেম খেলুন
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* NCTB Books Section - Organized by Class */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-gray-800 dark:text-white flex items-center">
              <BookOpen className="w-10 h-10 text-blue-600 mr-4" />
              📚 NCTB পাঠ্যবই
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              ক্লাস অনুযায়ী সাজানো পাঠ্যবই
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                <p className="mt-6 text-gray-600 dark:text-gray-300 text-lg">বই লোড হচ্ছে...</p>
              </div>
            ) : Object.keys(booksByClass).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(booksByClass).map(([className, books]) => (
                  <div key={className}>
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg">
                        <h3 className="text-2xl font-bold flex items-center">
                          <GraduationCap className="w-7 h-7 mr-3" />
                          {className}
                        </h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {books.map((book) => (
                        <Card key={book.id} className="bg-white/70 dark:bg-gray-700/60 backdrop-blur-sm border-white/30 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                          <CardContent className="p-5">
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  book.file_type === 'pdf' 
                                    ? 'bg-red-100 dark:bg-red-900/30' 
                                    : 'bg-blue-100 dark:bg-blue-900/30'
                                } shadow-md group-hover:shadow-lg transition-shadow`}>
                                  {book.file_type === 'pdf' ? (
                                    <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                                  ) : (
                                    <Book className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                  )}
                                </div>
                              </div>
                              <div className="flex-grow min-w-0">
                                <h4 className="font-bold text-gray-800 dark:text-white text-sm leading-tight mb-2">
                                  {book.title}
                                </h4>
                                <div className="space-y-1 mb-4">
                                  <p className="text-gray-600 dark:text-gray-300 text-xs flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    বিষয়: {book.subject}
                                  </p>
                                  {book.chapter && (
                                    <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center">
                                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                      অধ্যায়: {book.chapter}
                                    </p>
                                  )}
                                </div>
                                <Button 
                                  size="sm" 
                                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs shadow-md hover:shadow-lg transition-all"
                                  onClick={() => {
                                    if (book.file_url) {
                                      window.open(book.file_url, '_blank');
                                    } else {
                                      console.log('View text content:', book.content);
                                    }
                                  }}
                                >
                                  {book.file_type === 'pdf' ? 'PDF দেখুন' : 'পড়ুন'}
                                  <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
                  এখনো কোনো বই আপলোড করা হয়নি
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  এডমিন প্যানেল থেকে বই আপলোড করুন
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-green-500 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                স্মার্ট AI সহায়তা
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                আপনার পড়াশোনার যেকোনো সমস্যার সমাধান পান AI এর মাধ্যমে
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FileQuestion className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                বোর্ড প্রশ্ন ব্যাংক
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                সকল বোর্ডের বিগত বছরের প্রশ্ন এবং MCQ সংগ্রহ
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                ইন্টারেক্টিভ শিক্ষা
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                মজার গেম এবং কুইজের মাধ্যমে শিখুন এবং মনে রাখুন
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
