
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type MCQQuestion = Tables<'mcq_questions'>;

const MCQSection = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const { toast } = useToast();

  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['mcq_questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mcq_questions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const subjects = [...new Set(questions?.map(q => q.subject))].filter(Boolean) as string[];
  const boards = [...new Set(questions?.map(q => q.board))].filter(Boolean) as string[];
  const years = [...new Set(questions?.map(q => q.year?.toString()))].filter(Boolean) as string[];

  const filteredQuestions = questions?.filter(q => {
    const matchesSubject = !selectedSubject || q.subject === selectedSubject;
    const matchesBoard = !selectedBoard || q.board === selectedBoard;
    const matchesYear = !selectedYear || q.year === parseInt(selectedYear);
    
    return matchesSubject && matchesBoard && matchesYear;
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader className="text-center py-8">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4 bangla-text">
              📚 MCQ অনুশীলন
            </CardTitle>
            <p className="text-lg text-gray-600 dark:text-gray-300 bangla-text">
              বিভিন্ন বিষয়ের MCQ প্রশ্ন অনুশীলন করুন
            </p>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardHeader>
            <CardTitle className="bangla-text">🔍 ফিল্টার করুন</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium bangla-text">বিষয়</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bangla-text">
                    <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব বিষয়</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium bangla-text">বোর্ড</label>
                <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                  <SelectTrigger className="bangla-text">
                    <SelectValue placeholder="বোর্ড নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব বোর্ড</SelectItem>
                    {boards.map(board => (
                      <SelectItem key={board} value={board}>{board}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium bangla-text">বছর</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bangla-text">
                    <SelectValue placeholder="বছর নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব বছর</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MCQ List */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardHeader>
            <CardTitle className="bangla-text">📚 MCQ প্রশ্নসমূহ</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-gray-500 bangla-text">লোড হচ্ছে...</p>
            ) : error ? (
              <p className="text-center text-red-500 bangla-text">
                ত্রুটি: {error.message}
              </p>
            ) : filteredQuestions.length === 0 ? (
              <p className="text-center text-gray-500 bangla-text">
                কোনো প্রশ্ন পাওয়া যায়নি
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredQuestions.map((question) => (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <p className="font-medium bangla-text">{question.question}</p>
                    <ul className="list-none space-y-2 mt-2">
                      <li>A. {question.option_a}</li>
                      <li>B. {question.option_b}</li>
                      <li>C. {question.option_c}</li>
                      <li>D. {question.option_d}</li>
                    </ul>
                    <p className="mt-2 font-bold bangla-text">
                      সঠিক উত্তর: {question.correct_answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600 bangla-text">
              Developed by Ashraf | যেকোনো প্রয়োজনে মেসেজ করুন -
              <a
                href="https://wa.me/8801825210571"
                className="text-blue-600 hover:underline ml-1"
              >
                WhatsApp: 01825210571
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MCQSection;
