
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, RotateCcw, Trophy, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MCQQuestion {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  subject: string;
  board?: string;
  year?: number;
  chapter?: string;
}

const MCQSection = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [quizMode, setQuizMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { toast } = useToast();

  // All available subjects
  const subjects = [
    'বাংলা', 'ইংরেজি', 'গণিত', 'বিজ্ঞান', 'পদার্থবিজ্ঞান', 'রসায়ন', 
    'জীববিজ্ঞান', 'ইতিহাস', 'ভূগোল', 'পৌরনীতি', 'অর্থনীতি', 
    'ইসলাম শিক্ষা', 'হিন্দু ধর্ম', 'বৌদ্ধ ধর্ম', 'খ্রিস্টান ধর্ম', 
    'কৃষিশিক্ষা', 'গার্হস্থ্য বিজ্ঞান'
  ];

  // Fetch MCQ questions
  const { data: mcqQuestions = [], isLoading, refetch } = useQuery({
    queryKey: ['mcq_questions', selectedSubject],
    queryFn: async () => {
      let query = supabase.from('mcq_questions').select('*');
      
      if (selectedSubject !== 'all') {
        query = query.eq('subject', selectedSubject);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MCQQuestion[];
    },
  });

  // Timer for quiz mode
  useEffect(() => {
    if (quizMode && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quizMode && timeLeft === 0 && !showResult) {
      handleSubmitAnswer();
    }
  }, [timeLeft, quizMode]);

  const currentQuestion = mcqQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer && !showResult) {
      toast({
        title: "উত্তর নির্বাচন করুন",
        description: "একটি উত্তর নির্বাচন করে তারপর জমা দিন।",
        variant: "destructive"
      });
      return;
    }

    setShowResult(true);
    
    if (selectedAnswer === currentQuestion?.correct_answer) {
      setScore(score + 1);
      toast({
        title: "সঠিক উত্তর! 🎉",
        description: "চমৎকার! আপনার উত্তর সঠিক।",
      });
    } else {
      toast({
        title: "ভুল উত্তর 😞",
        description: `সঠিক উত্তর: ${getOptionText(currentQuestion?.correct_answer)}`,
        variant: "destructive"
      });
    }

    setAnsweredQuestions(prev => new Set(prev).add(currentQuestionIndex));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mcqQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
      if (quizMode) {
        setTimeLeft(30); // 30 seconds per question
      }
    } else {
      toast({
        title: "কুইজ শেষ!",
        description: `আপনার স্কোর: ${score}/${mcqQuestions.length}`,
      });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer('');
      setShowResult(false);
      if (quizMode) {
        setTimeLeft(30);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Set());
    setQuizMode(false);
    setTimeLeft(0);
  };

  const startQuizMode = () => {
    setQuizMode(true);
    setTimeLeft(30);
    resetQuiz();
    toast({
      title: "কুইজ মোড শুরু!",
      description: "প্রতিটি প্রশ্নের জন্য ৩০ সেকেন্ড সময়।",
    });
  };

  const getOptionText = (option: string) => {
    if (!currentQuestion) return '';
    switch (option) {
      case 'A': return currentQuestion.option_a;
      case 'B': return currentQuestion.option_b;
      case 'C': return currentQuestion.option_c;
      case 'D': return currentQuestion.option_d;
      default: return '';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg bangla-text">MCQ লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader className="text-center py-6">
            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2 bangla-text">
              📝 MCQ প্র্যাকটিস
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg bangla-text">
              বিভিন্ন বিষয়ের MCQ দিয়ে প্র্যাকটিস করুন
            </p>
          </CardHeader>
        </Card>

        {/* Controls */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between">
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start md:items-center">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full md:w-48 bangla-text">
                    <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="bangla-text">সব বিষয়</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject} className="bangla-text">
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex gap-2">
                  <Button
                    onClick={startQuizMode}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white bangla-text"
                    disabled={mcqQuestions.length === 0}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    কুইজ মোড
                  </Button>
                  
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    className="bangla-text"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    রিসেট
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="bangla-text">স্কোর: {score}/{answeredQuestions.size}</span>
                </div>
                {quizMode && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span className="bangla-text font-mono">{formatTime(timeLeft)}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {mcqQuestions.length === 0 ? (
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 bangla-text">
                কোনো MCQ পাওয়া যায়নি
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 bangla-text">
                {selectedSubject === 'all' 
                  ? 'এখনো কোনো MCQ আপলোড করা হয়নি।' 
                  : `${selectedSubject} বিষয়ের কোনো MCQ পাওয়া যায়নি।`
                }
              </p>
              {selectedSubject !== 'all' && (
                <Button
                  onClick={() => setSelectedSubject('all')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white bangla-text"
                >
                  সব বিষয় দেখুন
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Question Card */}
            <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg md:text-xl text-gray-800 dark:text-white bangla-text">
                    প্রশ্ন {currentQuestionIndex + 1} of {mcqQuestions.length}
                  </CardTitle>
                  {currentQuestion?.subject && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm bangla-text">
                      {currentQuestion.subject}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {currentQuestion ? (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-4 leading-relaxed bangla-text">
                        {currentQuestion.question}
                      </h3>
                      
                      <div className="space-y-3">
                        {['A', 'B', 'C', 'D'].map((option) => {
                          const optionText = getOptionText(option);
                          const isSelected = selectedAnswer === option;
                          const isCorrect = option === currentQuestion.correct_answer;
                          const showCorrectAnswer = showResult && isCorrect;
                          const showWrongAnswer = showResult && isSelected && !isCorrect;
                          
                          return (
                            <button
                              key={option}
                              onClick={() => !showResult && handleAnswerSelect(option)}
                              disabled={showResult}
                              className={`w-full p-3 md:p-4 text-left rounded-xl border-2 transition-all duration-200 bangla-text ${
                                showCorrectAnswer
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                  : showWrongAnswer
                                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                  : isSelected
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 bg-white dark:bg-gray-700'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <span className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm md:text-base ${
                                  showCorrectAnswer
                                    ? 'border-green-500 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
                                    : showWrongAnswer
                                    ? 'border-red-500 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300'
                                    : isSelected
                                    ? 'border-blue-500 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                                    : 'border-gray-400 dark:border-gray-500'
                                }`}>
                                  {option}
                                </span>
                                <span className="flex-1 text-sm md:text-base">
                                  {optionText}
                                </span>
                                {showCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-500" />}
                                {showWrongAnswer && <XCircle className="w-5 h-5 text-red-500" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-3 justify-between">
                      <div className="flex gap-2">
                        <Button
                          onClick={handlePreviousQuestion}
                          disabled={currentQuestionIndex === 0}
                          variant="outline"
                          className="bangla-text"
                        >
                          পূর্ববর্তী
                        </Button>
                        
                        {showResult ? (
                          <Button
                            onClick={handleNextQuestion}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white bangla-text"
                          >
                            {currentQuestionIndex < mcqQuestions.length - 1 ? 'পরবর্তী প্রশ্ন' : 'কুইজ শেষ'}
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSubmitAnswer}
                            disabled={!selectedAnswer}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white bangla-text"
                          >
                            উত্তর জমা দিন
                          </Button>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-300 bangla-text">
                        {currentQuestion.board && `${currentQuestion.board} বোর্ড`}
                        {currentQuestion.year && ` - ${currentQuestion.year}`}
                        {currentQuestion.chapter && ` - ${currentQuestion.chapter}`}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-300 bangla-text">প্রশ্ন লোড হচ্ছে...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default MCQSection;
