
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface MCQ {
  id: string;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  answer: string;
  subject: string;
  chapter: string;
  year: string;
  board: string;
}

const MCQSection = () => {
  const [currentMCQ, setCurrentMCQ] = useState<MCQ | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [filters, setFilters] = useState({
    subject: '',
    class: '',
    chapter: ''
  });

  // Sample MCQs for demo
  const sampleMCQs: MCQ[] = [
    {
      id: '1',
      question: 'বাংলাদেশের মুক্তিযুদ্ধ কত সালে সংঘটিত হয়?',
      options: {
        A: '১৯৭০ সালে',
        B: '১৯৭১ সালে',
        C: '১৯৭২ সালে',
        D: '১৯৭৩ সালে'
      },
      answer: 'B',
      subject: 'ইতিহাস',
      chapter: '১',
      year: '২০২৩',
      board: 'ঢাকা'
    },
    {
      id: '2',
      question: 'What is the capital of Bangladesh?',
      options: {
        A: 'Chittagong',
        B: 'Sylhet',
        C: 'Dhaka',
        D: 'Rajshahi'
      },
      answer: 'C',
      subject: 'English',
      chapter: '2',
      year: '2023',
      board: 'Dhaka'
    }
  ];

  const generateMCQ = () => {
    const randomMCQ = sampleMCQs[Math.floor(Math.random() * sampleMCQs.length)];
    setCurrentMCQ(randomMCQ);
    setSelectedAnswer('');
    setShowResult(false);
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || !currentMCQ) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === currentMCQ.answer;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const resetQuiz = () => {
    setScore({ correct: 0, total: 0 });
    setCurrentMCQ(null);
    setShowResult(false);
    setSelectedAnswer('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-gray-800 dark:text-white">
              📊 বোর্ড প্রশ্ন - Board MCQs
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select>
                <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-white/20">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangla">বাংলা</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="math">গণিত</SelectItem>
                  <SelectItem value="science">বিজ্ঞান</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-white/20">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9">ক্লাস ৯</SelectItem>
                  <SelectItem value="10">ক্লাস ১০</SelectItem>
                  <SelectItem value="11">ক্লাস ১১</SelectItem>
                  <SelectItem value="12">ক্লাস ১২</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Chapter"
                className="bg-white/50 dark:bg-gray-700/50 border-white/20"
              />
              
              <Button
                onClick={generateMCQ}
                className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white"
              >
                Generate MCQ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Score Card */}
        {score.total > 0 && (
          <Card className="mb-6 bg-gradient-to-r from-[#00C49A]/20 to-[#8E24AA]/20 backdrop-blur-md border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  Score: {score.correct}/{score.total} ({Math.round((score.correct/score.total)*100)}%)
                </div>
                <Button
                  onClick={resetQuiz}
                  variant="outline"
                  className="border-[#00C49A] text-[#00C49A] hover:bg-[#00C49A] hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* MCQ Card */}
        {currentMCQ ? (
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl text-gray-800 dark:text-white flex-1">
                  {currentMCQ.question}
                </CardTitle>
                <div className="text-sm text-gray-500 ml-4">
                  <p>{currentMCQ.subject} • Chapter {currentMCQ.chapter}</p>
                  <p>{currentMCQ.board} Board • {currentMCQ.year}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(currentMCQ.options).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => !showResult && setSelectedAnswer(key)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    showResult
                      ? key === currentMCQ.answer
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : key === selectedAnswer && key !== currentMCQ.answer
                        ? 'bg-red-100 border-red-300 text-red-800'
                        : 'bg-gray-100 border-gray-200 text-gray-600'
                      : selectedAnswer === key
                      ? 'bg-[#00C49A]/20 border-[#00C49A] text-[#00C49A]'
                      : 'bg-white/50 border-gray-200 hover:bg-[#00C49A]/10 hover:border-[#00C49A]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-bold">{key}.</span>
                    <span>{value}</span>
                    {showResult && key === currentMCQ.answer && (
                      <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                    )}
                    {showResult && key === selectedAnswer && key !== currentMCQ.answer && (
                      <XCircle className="w-5 h-5 text-red-600 ml-auto" />
                    )}
                  </div>
                </button>
              ))}

              {!showResult && (
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={!selectedAnswer}
                  className="w-full mt-6 bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white"
                >
                  Submit Answer
                </Button>
              )}

              {showResult && (
                <div className="mt-6 space-y-4">
                  <div className={`p-4 rounded-lg ${
                    selectedAnswer === currentMCQ.answer
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedAnswer === currentMCQ.answer
                      ? '🎉 Correct! Well done!'
                      : `❌ Incorrect. The correct answer is: ${currentMCQ.answer}. ${currentMCQ.options[currentMCQ.answer as keyof typeof currentMCQ.options]}`
                    }
                  </div>
                  <Button
                    onClick={generateMCQ}
                    className="w-full bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white"
                  >
                    Next Question
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
            <CardContent className="p-8 text-center">
              <FileQuestion className="w-16 h-16 text-[#00C49A] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Ready to Practice?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Click "Generate MCQ" to start practicing with board questions
              </p>
              <Button
                onClick={generateMCQ}
                className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white"
              >
                Start Practice
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MCQSection;
