
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Trophy, Clock, Zap } from 'lucide-react';

const QuizSection = () => {
  const [gameMode, setGameMode] = useState<'flashcards' | 'quiz' | null>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const flashcards = [
    {
      question: "বাংলাদেশের জাতীয় ফুল কী?",
      answer: "শাপলা",
      subject: "সাধারণ জ্ঞান"
    },
    {
      question: "What is the past tense of 'go'?",
      answer: "went",
      subject: "English"
    },
    {
      question: "২ + ২ × ৩ = ?",
      answer: "৮",
      subject: "গণিত"
    }
  ];

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
    setShowAnswer(false);
  };

  const flipCard = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-gray-800 dark:text-white">
              🎮 প্র্যাকটিস গেম - Quiz Mode
            </CardTitle>
          </CardHeader>
        </Card>

        {!gameMode ? (
          // Game Mode Selection
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => setGameMode('flashcards')}
            >
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#00C49A] to-[#8E24AA] rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
                  📚
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                  Flashcards
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Quick revision with flip cards. Perfect for memorizing facts and formulas.
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> 5-10 mins</span>
                  <span className="flex items-center"><Zap className="w-4 h-4 mr-1" /> Easy</span>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => setGameMode('quiz')}
            >
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#8E24AA] to-[#FF5252] rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
                  🏆
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                  Timed Quiz
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Challenge yourself with timed questions. Test your speed and accuracy.
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> 15-20 mins</span>
                  <span className="flex items-center"><Trophy className="w-4 h-4 mr-1" /> Challenge</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : gameMode === 'flashcards' ? (
          // Flashcards Mode
          <div className="space-y-6">
            <div className="text-center">
              <Button
                onClick={() => setGameMode(null)}
                variant="outline"
                className="mb-4"
              >
                ← Back to Games
              </Button>
              <p className="text-gray-600 dark:text-gray-300">
                Card {currentCard + 1} of {flashcards.length}
              </p>
            </div>

            <Card className="h-80 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20 cursor-pointer transform-gpu transition-transform hover:scale-[1.02]">
              <CardContent 
                className="h-full flex flex-col justify-center items-center p-8 text-center"
                onClick={flipCard}
              >
                {!showAnswer ? (
                  <>
                    <div className="text-6xl mb-4">🤔</div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      {flashcards[currentCard].question}
                    </h3>
                    <p className="text-sm text-[#8E24AA] font-medium">
                      {flashcards[currentCard].subject}
                    </p>
                    <p className="text-gray-500 mt-4">Click to reveal answer</p>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">💡</div>
                    <h3 className="text-3xl font-bold text-[#00C49A] mb-4">
                      {flashcards[currentCard].answer}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {flashcards[currentCard].question}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={flipCard}
                className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white"
              >
                {showAnswer ? 'Show Question' : 'Show Answer'}
              </Button>
              <Button
                onClick={nextCard}
                className="bg-gradient-to-r from-[#8E24AA] to-[#FF5252] hover:from-[#7B1FA2] hover:to-[#E53E3E] text-white"
              >
                Next Card
              </Button>
            </div>
          </div>
        ) : (
          // Quiz Mode (Coming Soon)
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
            <CardContent className="p-12 text-center">
              <div className="text-8xl mb-6">🚧</div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Timed Quiz Coming Soon!
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                We're working hard to bring you an amazing quiz experience with:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-[#00C49A]/10 rounded-lg">
                  <Trophy className="w-8 h-8 text-[#00C49A] mx-auto mb-2" />
                  <p className="font-medium">Leaderboards</p>
                </div>
                <div className="p-4 bg-[#8E24AA]/10 rounded-lg">
                  <Clock className="w-8 h-8 text-[#8E24AA] mx-auto mb-2" />
                  <p className="font-medium">Timed Challenges</p>
                </div>
              </div>
              <Button
                onClick={() => setGameMode(null)}
                className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white"
              >
                Back to Games
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Game Stats */}
        {gameMode && (
          <Card className="mt-6 bg-gradient-to-r from-[#00C49A]/20 to-[#8E24AA]/20 backdrop-blur-md border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{score}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Points</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {gameMode === 'flashcards' ? currentCard + 1 : 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cards Reviewed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">85%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizSection;
