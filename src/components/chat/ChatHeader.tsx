
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

interface ChatHeaderProps {
  onClearHistory: () => void;
}

const ChatHeader = ({ onClearHistory }: ChatHeaderProps) => {
  return (
    <>
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 relative z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white font-shurjo">
                AI শিক্ষক
              </h1>
              <p className="text-sm text-green-600 dark:text-green-400 font-shurjo">
                অনলাইন
              </p>
            </div>
          </div>
          
          {/* New Chat Button - Moved further left and removed + icon */}
          <div className="flex items-center mr-16">
            <Button
              onClick={onClearHistory}
              className="bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium font-shurjo transition-all duration-200"
              size="sm"
            >
              নতুন চ্যাট
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
