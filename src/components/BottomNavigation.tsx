
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, FileQuestion, Settings, Gamepad2 } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const navItems = [
    { icon: Home, label: '🏠 Home', path: '/' },
    { icon: BookOpen, label: '📚 Chat', path: '/chat' },
    { icon: FileQuestion, label: '📊 MCQs', path: '/mcqs' },
    { icon: Settings, label: '🛠️ Admin', path: '/admin' },
    { icon: Gamepad2, label: '🎮 Quiz', path: '/quiz' }
  ];

  // Handle keyboard visibility
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const heightDiff = window.innerHeight - window.visualViewport.height;
        setIsKeyboardVisible(heightDiff > 150);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    window.addEventListener('resize', handleResize);
    
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Hide bottom navigation when keyboard is visible and on chat page
  if (isKeyboardVisible && location.pathname === '/chat') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-t border-white/20 shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                isActive 
                  ? 'text-[#00C49A] bg-[#00C49A]/10' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-[#8E24AA]'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
