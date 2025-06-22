
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Heart, Brain, Star, RefreshCw } from 'lucide-react';

const TipsSection = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  const motivationalQuotes = [
    {
      text: "📖 পড়া কখনো বৃথা যায় না — সে আজ হোক, না কাল।",
      category: "Study Habits",
      icon: "📚"
    },
    {
      text: "💪 আত্মবিশ্বাস তোমার সবচেয়ে বড় শক্তি। নিজের উপর বিশ্বাস রাখো।",
      category: "Confidence",
      icon: "💪"
    },
    {
      text: "🌱 প্রতিদিন একটু একটু অগ্রগতিই বড় সফলতার চাবিকাঠি।",
      category: "Life Motivation",
      icon: "🌱"
    },
    {
      text: "🧠 কঠিন মনে হলেও থেমে যেও না। প্রতিটি চ্যালেঞ্জ তোমাকে আরো শক্তিশালী করে।",
      category: "Study Habits",
      icon: "🧠"
    },
    {
      text: "⭐ সফলতা একদিনে আসে না, কিন্তু প্রতিদিনের পরিশ্রম একদিন সফলতা এনে দেয়।",
      category: "Life Motivation",
      icon: "⭐"
    },
    {
      text: "📝 ভুল করলে হতাশ হয়ো না। ভুল থেকে শেখাটাই আসল শেখা।",
      category: "Study Habits",
      icon: "📝"
    }
  ];

  const studyTips = [
    {
      title: "📅 Study Schedule",
      tip: "প্রতিদিন একটি নির্দিষ্ট সময়ে পড়াশোনা করো। নিয়মিততাই সফলতার চাবিকাঠি।",
      icon: <Brain className="w-6 h-6 text-[#00C49A]" />
    },
    {
      title: "🔁 Revision Technique",
      tip: "পড়ার পর অবশ্যই রিভিশন করো। ২৪ ঘন্টার মধ্যে একবার দেখলে ৮০% মনে থাকে।",
      icon: <RefreshCw className="w-6 h-6 text-[#8E24AA]" />
    },
    {
      title: "📝 Note Taking",
      tip: "পড়ার সময় গুরুত্বপূর্ণ পয়েন্টগুলো নোট করো। নিজের ভাষায় লিখলে ভালো মনে থাকে।",
      icon: <Star className="w-6 h-6 text-[#FF5252]" />
    },
    {
      title: "🧘 Break Time",
      tip: "প্রতি ৪৫ মিনিট পড়ার পর ১৫ মিনিট বিশ্রাম নাও। মস্তিষ্ক তখন বেশি কার্যকর থাকে।",
      icon: <Heart className="w-6 h-6 text-[#00C49A]" />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-gray-800 dark:text-white">
              💡 পরামর্শ নাও - Tips & Feedback
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Motivational Quote */}
        <Card className="bg-gradient-to-r from-[#00C49A]/20 to-[#8E24AA]/20 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">
                {motivationalQuotes[currentQuote].icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Daily Motivation
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                {motivationalQuotes[currentQuote].text}
              </p>
              <div className="flex justify-center items-center space-x-4">
                <span className="text-sm text-gray-500 px-3 py-1 bg-white/50 rounded-full">
                  {motivationalQuotes[currentQuote].category}
                </span>
                <Button
                  onClick={nextQuote}
                  variant="outline"
                  size="sm"
                  className="border-[#00C49A] text-[#00C49A] hover:bg-[#00C49A] hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Next Quote
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studyTips.map((tip, index) => (
            <Card
              key={index}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-gray-800 dark:text-white">
                  {tip.icon}
                  <span>{tip.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  {tip.tip}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Stories */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 dark:text-white flex items-center">
              <Lightbulb className="w-6 h-6 text-[#FF5252] mr-3" />
              🌟 Success Stories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-[#00C49A]/10 to-[#8E24AA]/10 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>"রাহুল, ঢাকা বিশ্ববিদ্যালয়:"</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                "শিক্ষা বন্ধু AI ব্যবহার করে আমি প্রতিদিন ৫০টি MCQ সমাধান করতাম। ফলাফল - ঢাকা বিশ্ববিদ্যালয়ে চান্স!"
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#8E24AA]/10 to-[#FF5252]/10 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>"ফাতিমা, এইচএসসি ২০২৩:"</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                "AI চ্যাটবট আমার সব সন্দেহ দূর করে দিয়েছে। এইচএসসিতে A+ পেয়েছি!"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 dark:text-white">
              ⚡ Quick Study Hacks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-[#00C49A]">🕐 Time Management</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Pomodoro Technique ব্যবহার করো</li>
                  <li>• কঠিন বিষয় সকালে পড়ো</li>
                  <li>• টাইমার সেট করে পড়ো</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-[#8E24AA]">🧠 Memory Boost</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Flashcard তৈরি করো</li>
                  <li>• জোরে জোরে পড়ো</li>
                  <li>• অন্যকে শেখানোর চেষ্টা করো</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TipsSection;
