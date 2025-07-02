
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
  const [selectedClassLevel, setSelectedClassLevel] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
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
  const classLevels = [...new Set(questions?.map(q => q.class_level))].filter(Boolean) as string[];

  // Extract universities from admission_info for admission questions
  const universities = questions?.filter(q => q.class_level === 'admission' && q.admission_info)
    .map(q => {
      const admissionInfo = q.admission_info as any;
      return admissionInfo?.university;
    })
    .filter(Boolean);
  const uniqueUniversities = [...new Set(universities)] as string[];

  const filteredQuestions = questions?.filter(q => {
    const matchesSubject = !selectedSubject || q.subject === selectedSubject;
    const matchesBoard = !selectedBoard || q.board === selectedBoard;
    const matchesYear = !selectedYear || q.year === parseInt(selectedYear);
    const matchesClassLevel = !selectedClassLevel || q.class_level === selectedClassLevel;
    
    // Additional filtering for admission questions
    if (selectedClassLevel === 'admission' && q.admission_info) {
      const admissionInfo = q.admission_info as any;
      const matchesGroup = !selectedGroup || admissionInfo?.group === selectedGroup;
      const matchesUnit = !selectedUnit || admissionInfo?.unit === selectedUnit;
      const matchesUniversity = !selectedUniversity || admissionInfo?.university === selectedUniversity;
      
      return matchesSubject && matchesBoard && matchesYear && matchesClassLevel && 
             matchesGroup && matchesUnit && matchesUniversity;
    }
    
    return matchesSubject && matchesBoard && matchesYear && matchesClassLevel;
  }) || [];

  const resetAdmissionFilters = () => {
    setSelectedGroup('');
    setSelectedUnit('');
    setSelectedUniversity('');
  };

  const handleClassLevelChange = (value: string) => {
    setSelectedClassLevel(value);
    if (value !== 'admission') {
      resetAdmissionFilters();
    }
  };

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Class Level Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium bangla-text">ক্লাস</label>
                <Select value={selectedClassLevel} onValueChange={handleClassLevelChange}>
                  <SelectTrigger className="bangla-text">
                    <SelectValue placeholder="ক্লাস নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">সব ক্লাস</SelectItem>
                    <SelectItem value="class_9_10">নবম-দশম শ্রেণী</SelectItem>
                    <SelectItem value="class_11_12">একাদশ-দ্বাদশ শ্রেণী</SelectItem>
                    <SelectItem value="admission">ভর্তি পরীক্ষা</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Admission specific filters */}
              {selectedClassLevel === 'admission' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium bangla-text">গ্রুপ</label>
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                      <SelectTrigger className="bangla-text">
                        <SelectValue placeholder="গ্রুপ নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">সব গ্রুপ</SelectItem>
                        <SelectItem value="science">বিজ্ঞান</SelectItem>
                        <SelectItem value="arts">মানবিক</SelectItem>
                        <SelectItem value="commerce">ব্যবসায় শিক্ষা</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium bangla-text">ইউনিট</label>
                    <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                      <SelectTrigger className="bangla-text">
                        <SelectValue placeholder="ইউনিট নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">সব ইউনিট</SelectItem>
                        <SelectItem value="A">ক ইউনিট</SelectItem>
                        <SelectItem value="B">খ ইউনিট</SelectItem>
                        <SelectItem value="C">গ ইউনিট</SelectItem>
                        <SelectItem value="D">ঘ ইউনিট</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium bangla-text">বিশ্ববিদ্যালয়</label>
                    <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                      <SelectTrigger className="bangla-text">
                        <SelectValue placeholder="বিশ্ববিদ্যালয় নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">সব বিশ্ববিদ্যালয়</SelectItem>
                        {uniqueUniversities.map(university => (
                          <SelectItem key={university} value={university}>{university}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium bangla-text">বিষয়</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bangla-text">
                    <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">সব বিষয়</SelectItem>
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
                    <SelectItem value="">সব বোর্ড</SelectItem>
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
                    <SelectItem value="">সব বছর</SelectItem>
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
            <CardTitle className="bangla-text">
              📚 MCQ প্রশ্নসমূহ ({filteredQuestions.length}টি প্রশ্ন)
            </CardTitle>
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
                  <div key={question.id} className="p-4 border rounded-lg bg-white/50 dark:bg-gray-700/50">
                    <div className="mb-2">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded bangla-text">
                        {question.class_level === 'class_9_10' ? 'নবম-দশম' : 
                         question.class_level === 'class_11_12' ? 'একাদশ-দ্বাদশ' : 'ভর্তি পরীক্ষা'}
                      </span>
                      {question.class_level === 'admission' && question.admission_info && (
                        <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded bangla-text">
                          {(question.admission_info as any)?.university} - {(question.admission_info as any)?.unit} ইউনিট
                        </span>
                      )}
                    </div>
                    <p className="font-medium bangla-text mb-3">{question.question}</p>
                    <ul className="list-none space-y-2 mb-3">
                      <li className="bangla-text">A. {question.option_a}</li>
                      <li className="bangla-text">B. {question.option_b}</li>
                      <li className="bangla-text">C. {question.option_c}</li>
                      <li className="bangla-text">D. {question.option_d}</li>
                    </ul>
                    <p className="font-bold text-green-600 dark:text-green-400 bangla-text">
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
