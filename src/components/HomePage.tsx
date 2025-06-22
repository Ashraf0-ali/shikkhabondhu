
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileQuestion, Settings, Lightbulb, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "📚 পড়া শিখি",
      subtitle: "Student Chat",
      description: "Ask anything & get chapter-wise help",
      action: () => navigate('/chat')
    },
    {
      icon: <FileQuestion className="w-8 h-8" />,
      title: "📊 বোর্ড প্রশ্ন",
      subtitle: "Board MCQs", 
      description: "Practice previous board/admission questions",
      action: () => navigate('/mcqs')
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "🛠️ এডমিন প্যানেল",
      subtitle: "Admin Tools",
      description: "Upload books, questions, CSVs",
      action: () => navigate('/admin')
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "💡 পরামর্শ নাও",
      subtitle: "Tips & Feedback",
      description: "Study tips & motivational quotes",
      action: () => navigate('/tips')
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "🎮 প্র্যাকটিস গেম",
      subtitle: "Quiz Mode",
      description: "Flashcards & quizzes to test memory",
      action: () => navigate('/quiz')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          📘 Shikkha Bondhu AI
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Your Smart Study Companion
        </p>
        <div className="mt-4 p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Developed by <span className="font-semibold text-[#8E24AA]">Ashraf Ali</span>
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-4xl mx-auto space-y-4">
        {features.map((feature, index) => (
          <Card 
            key={index}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            onClick={feature.action}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#00C49A] to-[#8E24AA] rounded-xl flex items-center justify-center text-white shadow-lg">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#8E24AA] font-medium mb-2">
                    {feature.subtitle}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
                <div className="text-[#00C49A] text-2xl">→</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Motivational Quote */}
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-gradient-to-r from-[#00C49A]/20 to-[#8E24AA]/20 backdrop-blur-md rounded-xl border border-white/20">
        <p className="text-center text-gray-700 dark:text-gray-300 font-medium">
          "📖 পড়া কখনো বৃথা যায় না — সে আজ হোক, না কাল।"
        </p>
      </div>
    </div>
  );
};

export default HomePage;
