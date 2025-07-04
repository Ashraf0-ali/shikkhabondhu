
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Plus } from 'lucide-react';

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
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white bangla-text">
                AI শিক্ষক
              </h1>
              <p className="text-sm text-green-600 dark:text-green-400 bangla-text">
                অনলাইন
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating New Chat Button */}
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={onClearHistory}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg rounded-full p-3 bangla-text"
          size="sm"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </>
  );
};

export default ChatHeader;
