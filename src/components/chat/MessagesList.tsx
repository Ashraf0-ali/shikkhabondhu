
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Bot } from 'lucide-react';
import ChatMessage from './ChatMessage';
import BookViewer from './BookViewer';
import { Message } from './types';

interface MessagesListProps {
  messages: Message[];
  isLoading: boolean;
  onPdfOpen: (url: string, title: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessagesList = ({ messages, isLoading, onPdfOpen, messagesEndRef }: MessagesListProps) => {
  const [bookViewer, setBookViewer] = useState<{url: string, title: string} | null>(null);

  const handleBookRead = (url: string, title: string) => {
    setBookViewer({ url, title });
  };

  const closeBookViewer = () => {
    setBookViewer(null);
  };

  return (
    <>
      <div className="flex-1 overflow-hidden" style={{ paddingBottom: '100px' }}>
        <ScrollArea className="h-full px-4 py-4">
          <div className="max-w-4xl mx-auto space-y-2">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                onPdfOpen={onPdfOpen}
                onBookRead={handleBookRead}
              />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start mb-4">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-green-500" />
                    <span className="text-gray-500 bangla-text text-sm">টাইপ করছি...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Book Viewer Modal */}
      {bookViewer && (
        <BookViewer
          bookUrl={bookViewer.url}
          bookTitle={bookViewer.title}
          onClose={closeBookViewer}
        />
      )}
    </>
  );
};

export default MessagesList;
