
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle, RefreshCw, BookOpen, Users, GraduationCap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
  chapter?: string;
  board?: string;
  year?: number;
}

const MCQSection = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<MCQQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const { toast } = useToast();

  const departments = [
    { value: 'science', label: 'বিজ্ঞান বিভাগ', icon: '🔬' },
    { value: 'arts', label: 'মানবিক বিভাগ', icon: '📚' },
    { value: 'commerce', label: 'ব্যবসায় শিক্ষা বিভাগ', icon: '💼' },
    { value: 'alim', label: 'আলিম', icon: '🕌' },
    { value: 'dakhil', label: 'দাখিল', icon: '📖' }
  ];

  const classLevels = [
    { value: '6', label: 'ষষ্ঠ শ্রেণি' },
    { value: '7', label: 'সপ্তম শ্রেণি' },
    { value: '8', label: 'অষ্টম শ্রেণি' },
    { value: '9', label: 'নবম শ্রেণি' },
    { value: '10', label: 'দশম শ্রেণি' },
    { value: '11', label: 'একাদশ শ্রেণি' },
    { value: '12', label: 'দ্বাদশ শ্রেণি' }
  ];

  // Fetch available subjects based on department and class
  const { data: subjectsData } = useQuery({
    queryKey: ['subjects', selectedDepartment, selectedClass],
    queryFn: async () => {
      if (!selectedDepartment || !selectedClass) return [];
      
      let query = supabase
        .from('mcq_questions')
        .select('subject')
        .not('subject', 'is', null);

      // Add department-based filtering if needed
      if (selectedDepartment === 'alim' || selectedDepartment === 'dakhil') {
        query = query.ilike('board', `%${selectedDepartment}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching subjects:', error);
        return [];
      }

      const uniqueSubjects = [...new Set(data?.map(item => item.subject) || [])];
      return uniqueSubjects.filter(Boolean);
    },
    enabled: !!selectedDepartment && !!selectedClass
  });

  // Update available subjects when data changes
  useEffect(() => {
    if (subjectsData) {
      setAvailableSubjects(subjectsData);
    }
  }, [subjectsData]);

  // Fetch MCQ questions based on filters
  const { data: mcqQuestions, refetch: refetchQuestions } = useQuery({
    queryKey: ['mcq-questions', selectedDepartment, selectedClass, selectedSubject],
    queryFn: async () => {
      if (!selectedDepartment || !selectedClass || !selectedSubject) return [];
      
      let query = supabase
        .from('mcq_questions')
        .select('*')
        .eq('subject', selectedSubject)
        .not('question', 'is', null)
        .not('correct_answer', 'is', null);

      // Add department-based filtering
      if (selectedDepartment === 'alim' || selectedDepartment === 'dakhil') {
        query = query.ilike('board', `%${selectedDepartment}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching MCQ questions:', error);
        toast({
          title: "ত্রুটি",
          description: "প্রশ্ন লোড করতে সমস্যা হয়েছে।",
          variant: "destructive"
        });
        return [];
      }

      return data || [];
    },
    enabled: !!selectedDepartment && !!selectedClass && !!selectedSubject
  });

  const startNewQuestion = () => {
    if (!mcqQuestions || mcqQuestions.length === 0) {
      toast({
        title: "কোনো প্রশ্ন পাওয়া যায়নি",
        description: "এই বিভাগ ও বিষয়ের জন্য কোনো প্রশ্ন নেই।",
        variant: "destructive"
      });
      return;
    }

    const randomQuestion = mcqQuestions[Math.floor(Math.random() * mcqQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setSelectedAnswer('');
    setShowResult(false);
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    setShowResult(true);
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (isCorrect) {
      toast({
        title: "সঠিক উত্তর! 🎉",
        description: "অভিনন্দন! আপনার উত্তর সঠিক।"
      });
    } else {
      toast({
        title: "ভুল উত্তর",
        description: `সঠিক উত্তর: ${currentQuestion.correct_answer}`,
        variant: "destructive"
      });
    }
  };

  const resetGame = () => {
    setScore({ correct: 0, total: 0 });
    setCurrentQuestion(null);
    setSelectedAnswer('');
    setShowResult(false);
  };

  if (!selectedDepartment || !selectedClass || !selectedSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
            <CardHeader className="text-center py-8">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4 bangla-text">
                📝 MCQ প্র্যাকটিস
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 text-lg bangla-text">
                আপনার বিভাগ, শ্রেণি এবং বিষয় নির্বাচন করুন
              </p>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              {/* Department Selection */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-700 dark:text-gray-300 bangla-text flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  বিভাগ নির্বাচন করুন
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {departments.map((dept) => (
                    <Button
                      key={dept.value}
                      variant={selectedDepartment === dept.value ? "default" : "outline"}
                      onClick={() => {
                        setSelectedDepartment(dept.value);
                        setSelectedClass('');
                        setSelectedSubject('');
                      }}
                      className="h-16 text-left justify-start p-4 bangla-text"
                    >
                      <span className="text-2xl mr-3">{dept.icon}</span>
                      <span className="font-medium">{dept.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Class Selection */}
              {selectedDepartment && (
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-700 dark:text-gray-300 bangla-text flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    শ্রেণি নির্বাচন করুন
                  </label>
                  <Select value={selectedClass} onValueChange={(value) => {
                    setSelectedClass(value);
                    setSelectedSubject('');
                  }}>
                    <SelectTrigger className="w-full h-12 text-base bangla-text">
                      <SelectValue placeholder="শ্রেণি নির্বাচন করুন..." />
                    </SelectTrigger>
                    <SelectContent>
                      {classLevels.map((cls) => (
                        <SelectItem key={cls.value} value={cls.value} className="bangla-text">
                          {cls.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Subject Selection */}
              {selectedDepartment && selectedClass && availableSubjects.length > 0 && (
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-700 dark:text-gray-300 bangla-text flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    বিষয় নির্বাচন করুন
                  </label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-full h-12 text-base bangla-text">
                      <SelectValue placeholder="বিষয় নির্বাচন করুন..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubjects.map((subject) => (
                        <SelectItem key={subject} value={subject} className="bangla-text">
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Start Button */}
              {selectedDepartment && selectedClass && selectedSubject && (
                <div className="text-center pt-4">
                  <Button
                    onClick={startNewQuestion}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg font-semibold bangla-text shadow-lg"
                  >
                    প্র্যাকটিস শুরু করুন 🚀
                  </Button>
                </div>
              )}

              {selectedDepartment && selectedClass && availableSubjects.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 bangla-text text-lg">
                    এই বিভাগ ও শ্রেণির জন্য কোনো বিষয় পাওয়া যায়নি।
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Score */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader className="text-center py-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4 bangla-text">
              📝 MCQ প্র্যাকটিস
            </CardTitle>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <Badge variant="secondary" className="text-base px-4 py-2 bangla-text">
                বিভাগ: {departments.find(d => d.value === selectedDepartment)?.label}
              </Badge>
              <Badge variant="secondary" className="text-base px-4 py-2 bangla-text">
                শ্রেণি: {classLevels.find(c => c.value === selectedClass)?.label}
              </Badge>
              <Badge variant="secondary" className="text-base px-4 py-2 bangla-text">
                বিষয়: {selectedSubject}
              </Badge>
              <Badge variant="outline" className="text-base px-4 py-2 bangla-text">
                স্কোর: {score.correct}/{score.total}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Button
            onClick={startNewQuestion}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white bangla-text"
            disabled={!mcqQuestions || mcqQuestions.length === 0}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            নতুন প্রশ্ন
          </Button>
          <Button
            onClick={resetGame}
            variant="outline"
            className="bangla-text"
          >
            রিসেট করুন
          </Button>
          <Button
            onClick={() => {
              setSelectedDepartment('');
              setSelectedClass('');
              setSelectedSubject('');
              resetGame();
            }}
            variant="secondary"
            className="bangla-text"
          >
            বিভাগ পরিবর্তন করুন
          </Button>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-white bangla-text leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
                {currentQuestion.chapter && (
                  <Badge variant="outline" className="shrink-0 bangla-text">
                    {currentQuestion.chapter}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Options */}
              <div className="grid gap-3">
                {[
                  { key: 'A', text: currentQuestion.option_a },
                  { key: 'B', text: currentQuestion.option_b },
                  { key: 'C', text: currentQuestion.option_c },
                  { key: 'D', text: currentQuestion.option_d }
                ].map((option) => (
                  <Button
                    key={option.key}
                    variant={selectedAnswer === option.key ? "default" : "outline"}
                    className={`w-full text-left justify-start p-4 h-auto min-h-[60px] bangla-text ${
                      showResult
                        ? option.key === currentQuestion.correct_answer
                          ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-400 dark:text-green-300'
                          : selectedAnswer === option.key && option.key !== currentQuestion.correct_answer
                          ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300'
                          : ''
                        : ''
                    }`}
                    onClick={() => !showResult && setSelectedAnswer(option.key)}
                    disabled={showResult}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="font-bold text-lg bg-gray-100 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                        {option.key}
                      </span>
                      <span className="text-base leading-relaxed">{option.text}</span>
                      {showResult && option.key === currentQuestion.correct_answer && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />
                      )}
                      {showResult && selectedAnswer === option.key && option.key !== currentQuestion.correct_answer && (
                        <XCircle className="w-5 h-5 text-red-600 ml-auto" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              {/* Submit Button */}
              {!showResult && selectedAnswer && (
                <div className="text-center pt-4">
                  <Button
                    onClick={handleAnswerSubmit}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg font-semibold bangla-text"
                  >
                    উত্তর জমা দিন
                  </Button>
                </div>
              )}

              {/* Result */}
              {showResult && (
                <div className="text-center pt-4 space-y-4">
                  <div className={`text-xl font-bold bangla-text ${
                    selectedAnswer === currentQuestion.correct_answer 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {selectedAnswer === currentQuestion.correct_answer 
                      ? '🎉 সঠিক উত্তর!' 
                      : `❌ ভুল উত্তর! সঠিক উত্তর: ${currentQuestion.correct_answer}`
                    }
                  </div>
                  <Button
                    onClick={startNewQuestion}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white bangla-text"
                  >
                    পরবর্তী প্রশ্ন
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* No Questions Available */}
        {!currentQuestion && mcqQuestions && mcqQuestions.length === 0 && (
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
            <CardContent className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400 bangla-text mb-4">
                এই বিভাগ ও বিষয়ের জন্য কোনো প্রশ্ন পাওয়া যায়নি।
              </p>
              <Button
                onClick={() => {
                  setSelectedSubject('');
                }}
                variant="outline"
                className="bangla-text"
              >
                অন্য বিষয় নির্বাচন করুন
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MCQSection;
