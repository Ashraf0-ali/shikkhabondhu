
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Play, Target } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type MCQQuestion = Tables<'mcq_questions'>;

const MCQPracticeSection = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedClassLevel, setSelectedClassLevel] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [practiceStarted, setPracticeStarted] = useState(false);
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

  const universities = questions?.filter(q => q.class_level === 'admission' && q.admission_info)
    .map(q => {
      const admissionInfo = q.admission_info as any;
      return admissionInfo?.university;
    })
    .filter(Boolean);
  const uniqueUniversities = [...new Set(universities)] as string[];

  const filteredQuestions = questions?.filter(q => {
    const matchesSubject = selectedSubject === 'all' || q.subject === selectedSubject;
    const matchesBoard = selectedBoard === 'all' || q.board === selectedBoard;
    const matchesYear = selectedYear === 'all' || q.year === parseInt(selectedYear);
    const matchesClassLevel = selectedClassLevel === 'all' || q.class_level === selectedClassLevel;
    
    if (selectedClassLevel === 'admission' && q.admission_info) {
      const admissionInfo = q.admission_info as any;
      const matchesGroup = selectedGroup === 'all' || admissionInfo?.group === selectedGroup;
      const matchesUnit = selectedUnit === 'all' || admissionInfo?.unit === selectedUnit;
      const matchesUniversity = selectedUniversity === 'all' || admissionInfo?.university === selectedUniversity;
      
      return matchesSubject && matchesBoard && matchesYear && matchesClassLevel && 
             matchesGroup && matchesUnit && matchesUniversity;
    }
    
    return matchesSubject && matchesBoard && matchesYear && matchesClassLevel;
  }) || [];

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const startPractice = () => {
    if (filteredQuestions.length === 0) {
      toast({
        title: "কোনো প্রশ্ন পাওয়া যায়নি",
        description: "ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন",
        variant: "destructive"
      });
      return;
    }
    setPracticeStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) {
      toast({
        title: "উত্তর নির্বাচন করুন",
        description: "একটি উত্তর নির্বাচন করে তারপর সাবমিট করুন",
        variant: "destructive"
      });
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestionIndex < filteredQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer('');
        setShowResult(false);
      } else {
        toast({
          title: "অনুশীলন শেষ!",
          description: `আপনার স্কোর: ${isCorrect ? score + 1 : score}/${filteredQuestions.length}`,
        });
        setPracticeStarted(false);
      }
    }, 2000);
  };

  const resetAdmissionFilters = () => {
    setSelectedGroup('all');
    setSelectedUnit('all');
    setSelectedUniversity('all');
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
              🎯 MCQ অনুশীলন
            </CardTitle>
            <p className="text-lg text-gray-600 dark:text-gray-300 bangla-text">
              ইন্টারেক্টিভ MCQ অনুশীলন - নিজেকে পরীক্ষা করুন
            </p>
          </CardHeader>
        </Card>

        {!practiceStarted ? (
          <>
            {/* Filters */}
            <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="bangla-text">🔍 ফিল্টার করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium bangla-text">ক্লাস</label>
                    <Select value={selectedClassLevel} onValueChange={handleClassLevelChange}>
                      <SelectTrigger className="bangla-text">
                        <SelectValue placeholder="ক্লাস নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">সব ক্লাস</SelectItem>
                        <SelectItem value="class_9_10">নবম-দশম শ্রেণী</SelectItem>
                        <SelectItem value="class_11_12">একাদশ-দ্বাদশ শ্রেণী</SelectItem>
                        <SelectItem value="admission">ভর্তি পরীক্ষা</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedClassLevel === 'admission' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium bangla-text">গ্রুপ</label>
                        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                          <SelectTrigger className="bangla-text">
                            <SelectValue placeholder="গ্রুপ নির্বাচন করুন" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">সব গ্রুপ</SelectItem>
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
                            <SelectItem value="all">সব ইউনিট</SelectItem>
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
                            <SelectItem value="all">সব বিশ্ববিদ্যালয়</SelectItem>
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

            {/* Start Practice */}
            <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
              <CardContent className="p-8 text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <h3 className="text-2xl font-bold bangla-text mb-4">
                  অনুশীলন শুরু করুন
                </h3>
                <p className="text-gray-600 dark:text-gray-300 bangla-text mb-6">
                  মোট প্রশ্ন: {filteredQuestions.length}টি
                </p>
                <Button 
                  onClick={startPractice}
                  size="lg"
                  className="bangla-text"
                  disabled={isLoading || filteredQuestions.length === 0}
                >
                  <Play className="w-5 h-5 mr-2" />
                  অনুশীলন শুরু করুন
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Practice Mode */
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="bangla-text">
                  প্রশ্ন {currentQuestionIndex + 1} / {filteredQuestions.length}
                </CardTitle>
                <div className="text-sm text-gray-500 bangla-text">
                  স্কোর: {score}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentQuestion && (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="font-medium bangla-text text-lg">
                      {currentQuestion.question}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {['A', 'B', 'C', 'D'].map((option) => {
                      const optionText = currentQuestion[`option_${option.toLowerCase()}` as keyof typeof currentQuestion] as string;
                      if (!optionText) return null;
                      
                      return (
                        <button
                          key={option}
                          onClick={() => !showResult && setSelectedAnswer(option)}
                          disabled={showResult}
                          className={`w-full text-left p-4 rounded-lg border transition-colors bangla-text ${
                            showResult
                              ? option === currentQuestion.correct_answer
                                ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300'
                                : selectedAnswer === option
                                ? 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300'
                                : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-600'
                              : selectedAnswer === option
                              ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700'
                              : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="font-medium">{option}.</span> {optionText}
                        </button>
                      );
                    })}
                  </div>

                  {!showResult && (
                    <Button 
                      onClick={handleAnswerSubmit}
                      disabled={!selectedAnswer}
                      className="w-full bangla-text"
                    >
                      উত্তর সাবমিট করুন
                    </Button>
                  )}

                  {showResult && (
                    <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <p className="bangla-text">
                        {selectedAnswer === currentQuestion.correct_answer 
                          ? '🎉 সঠিক উত্তর!' 
                          : `❌ ভুল উত্তর। সঠিক উত্তর: ${currentQuestion.correct_answer}`
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

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

export default MCQPracticeSection;
