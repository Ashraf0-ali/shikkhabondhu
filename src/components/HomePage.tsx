
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, FileQuestion, Search, Users, Trophy, MessageCircle, ChevronRight, Book, FileText, GraduationCap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const HomePage = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-4xl font-bold bg-gradient-to-r from-[#00C49A] to-[#8E24AA] bg-clip-text text-transparent">
              🎓 শিক্ষার্থী সহায়ক
            </CardTitle>
            <p className="text-center text-gray-600 dark:text-gray-300 text-lg">
              আপনার পড়াশোনার সঙ্গী - বোর্ড প্রশ্ন, MCQ, AI সহায়তা এবং আরও অনেক কিছু
            </p>
          </CardHeader>
        </Card>

        {/* Motivational Quote */}
        {quote && (
          <Card className="bg-gradient-to-r from-[#00C49A]/20 to-[#8E24AA]/20 backdrop-blur-md border-white/20 shadow-lg">
            <CardContent className="p-6">
              <blockquote className="text-lg font-medium text-gray-700 dark:text-gray-200 italic text-center">
                "{quote.quote}"
              </blockquote>
              {quote.author && (
                <p className="text-right text-gray-500 dark:text-gray-400 mt-2">
                  - {quote.author}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-12 h-12 text-[#00C49A] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Ask AI
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                AI এর সাথে চ্যাট করে যেকোনো প্রশ্নের উত্তর পান
              </p>
              <Button className="w-full bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white">
                চ্যাট শুরু করুন
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <FileQuestion className="w-12 h-12 text-[#8E24AA] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                MCQ প্র্যাকটিস
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                বোর্ড প্রশ্নের MCQ দিয়ে প্র্যাকটিস করুন
              </p>
              <Button className="w-full bg-gradient-to-r from-[#8E24AA] to-[#00C49A] hover:from-[#7B1FA2] hover:to-[#00A085] text-white">
                প্র্যাকটিস শুরু করুন
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Content>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <Search className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                স্মার্ট সার্চ
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                যেকোনো বিষয়ে তাৎক্ষণিক সার্চ করুন
              </p>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                সার্চ করুন
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                কুইজ গেম
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                মজার কুইজ খেলে শিখুন
              </p>
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                গেম খেলুন
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* NCTB Books Section */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 dark:text-white flex items-center">
              <BookOpen className="w-8 h-8 text-[#00C49A] mr-3" />
              📚 NCTB পাঠ্যবই
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C49A] mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">বই লোড হচ্ছে...</p>
              </div>
            ) : Object.keys(booksByClass).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(booksByClass).map(([className, books]) => (
                  <div key={className}>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                      <GraduationCap className="w-6 h-6 text-[#8E24AA] mr-2" />
                      {className}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {books.map((book) => (
                        <Card key={book.id} className="bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300 hover:scale-102">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                {book.file_type === 'pdf' ? (
                                  <FileText className="w-8 h-8 text-red-500" />
                                ) : (
                                  <Book className="w-8 h-8 text-blue-500" />
                                )}
                              </div>
                              <div className="flex-grow min-w-0">
                                <h4 className="font-bold text-gray-800 dark:text-white text-sm truncate">
                                  {book.title}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                                  বিষয়: {book.subject}
                                </p>
                                {book.chapter && (
                                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                                    অধ্যায়: {book.chapter}
                                  </p>
                                )}
                                <Button 
                                  size="sm" 
                                  className="mt-3 w-full bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white text-xs"
                                  onClick={() => {
                                    if (book.file_url) {
                                      window.open(book.file_url, '_blank');
                                    } else {
                                      // Handle text content view
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
              <div className="text-center py-8">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  এখনো কোনো বই আপলোড করা হয়নি
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  এডমিন প্যানেল থেকে বই আপলোড করুন
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-white/20 shadow-lg">
            <CardContent className="p-6">
              <Brain className="w-12 h-12 text-[#00C49A] mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                স্মার্ট AI সহায়তা
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                আপনার পড়াশোনার যেকোনো সমস্যার সমাধান পান AI এর মাধ্যমে
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-white/20 shadow-lg">
            <CardContent className="p-6">
              <FileQuestion className="w-12 h-12 text-[#8E24AA] mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                বোর্ড প্রশ্ন ব্যাংক
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                সকল বোর্ডের বিগত বছরের প্রশ্ন এবং MCQ সংগ্রহ
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-white/20 shadow-lg">
            <CardContent className="p-6">
              <Users className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                ইন্টারেক্টিভ শিক্ষা
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
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
