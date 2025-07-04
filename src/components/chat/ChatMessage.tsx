
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, User, Image, FileText } from 'lucide-react';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
  onPdfOpen: (url: string, title: string) => void;
}

const ChatMessage = ({ message, onPdfOpen }: ChatMessageProps) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="w-4 h-4 text-red-500" />;
    } else {
      return <FileText className="w-4 h-4" />;
    }
  };

  // Parse PDF links from message content
  const parsePdfLinks = (content: string) => {
    const linkRegex = /🔗 PDF লিংক: (https?:\/\/[^\s]+)/g;
    const titleRegex = /• ([^(]+) \(/g;
    const links: Array<{title: string, url: string}> = [];
    
    let match;
    const urls: string[] = [];
    const titles: string[] = [];
    
    while ((match = linkRegex.exec(content)) !== null) {
      urls.push(match[1]);
    }
    
    let titleMatch;
    while ((titleMatch = titleRegex.exec(content)) !== null) {
      titles.push(titleMatch[1].trim());
    }
    
    for (let i = 0; i < Math.min(urls.length, titles.length); i++) {
      links.push({ title: titles[i], url: urls[i] });
    }
    
    return links;
  };

  // Clean content by removing raw PDF link lines
  const cleanContent = (content: string) => {
    const pdfLinkRegex = /🔗 PDF লিংক: https?:\/\/[^\s\n]+/g;
    return content.replace(pdfLinkRegex, '').trim();
  };

  const pdfLinks = message.role === 'assistant' ? parsePdfLinks(message.content) : [];
  const displayContent = message.role === 'assistant' ? cleanContent(message.content) : message.content;

  return (
    <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
        {/* File attachment display */}
        {message.hasFile && (
          <div className="mb-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <div className="flex items-center gap-2">
              {getFileIcon(message.fileType || '')}
              <span className="text-sm text-blue-800 dark:text-blue-200 bangla-text">
                {message.fileName}
              </span>
            </div>
          </div>
        )}
        
        <div className={`p-3 rounded-2xl ${
          message.role === 'user' 
            ? 'bg-blue-500 text-white' 
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        }`}>
          <p className={`whitespace-pre-wrap bangla-text text-sm leading-relaxed ${
            message.role === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'
          }`}>
            {displayContent}
          </p>
        </div>

        {/* PDF Action Buttons */}
        {pdfLinks.length > 0 && (
          <div className="mt-3 space-y-2">
            {pdfLinks.map((pdfLink, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onPdfOpen(pdfLink.url, pdfLink.title)}
                className="bangla-text bg-green-50 hover:bg-green-100 border-green-200 text-green-800 w-full justify-start"
              >
                <FileText className="w-4 h-4 mr-2 text-green-600" />
                📖 {pdfLink.title} - PDF খুলুন
              </Button>
            ))}
          </div>
        )}
        
        <div className={`text-xs text-gray-500 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString('bn-BD', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>

      {message.role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
