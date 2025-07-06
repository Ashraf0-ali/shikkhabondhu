
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, User, Image, FileText, BookOpen } from 'lucide-react';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
  onPdfOpen: (url: string, title: string) => void;
  onBookRead?: (url: string, title: string) => void;
}

const ChatMessage = ({ message, onPdfOpen, onBookRead }: ChatMessageProps) => {
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

  // Parse book links from message content
  const parseBookLinks = (content: string) => {
    const bookLinkRegex = /📚 ([^:]+): (https?:\/\/[^\s]+)/g;
    const links: Array<{title: string, url: string}> = [];
    let match;
    
    while ((match = bookLinkRegex.exec(content)) !== null) {
      links.push({ title: match[1].trim(), url: match[2] });
    }
    
    return links;
  };

  // Clean content by removing raw PDF and book link lines
  const cleanContent = (content: string) => {
    const pdfLinkRegex = /🔗 PDF লিংক: https?:\/\/[^\s\n]+/g;
    const bookLinkRegex = /📚 [^:]+: https?:\/\/[^\s\n]+/g;
    return content.replace(pdfLinkRegex, '').replace(bookLinkRegex, '').trim();
  };

  // Format markdown text (bold, italic, etc.)
  const formatMarkdownText = (text: string) => {
    // Split text by markdown patterns while preserving the markers
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|_[^_]+_)/g);
    
    return parts.map((part, index) => {
      // Bold text with **
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        return (
          <strong key={index} className="font-semibold text-gray-900 dark:text-white">
            {content}
          </strong>
        );
      }
      // Bold text with __
      else if (part.startsWith('__') && part.endsWith('__')) {
        const content = part.slice(2, -2);
        return (
          <strong key={index} className="font-semibold text-gray-900 dark:text-white">
            {content}
          </strong>
        );
      }
      // Italic text with *
      else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        const content = part.slice(1, -1);
        return (
          <em key={index} className="italic">
            {content}
          </em>
        );
      }
      // Italic text with _
      else if (part.startsWith('_') && part.endsWith('_') && !part.startsWith('__')) {
        const content = part.slice(1, -1);
        return (
          <em key={index} className="italic">
            {content}
          </em>
        );
      }
      // Regular text
      else {
        return part;
      }
    });
  };

  const pdfLinks = message.role === 'assistant' ? parsePdfLinks(message.content) : [];
  const bookLinks = message.role === 'assistant' ? parseBookLinks(message.content) : [];
  const displayContent = message.role === 'assistant' ? cleanContent(message.content) : message.content;

  return (
    <div className={`flex gap-3 mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[85%] ${message.role === 'user' ? 'order-1' : ''}`}>
        {/* File attachment display */}
        {message.hasFile && (
          <div className="mb-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              {getFileIcon(message.fileType || '')}
              <span className="text-sm text-blue-800 dark:text-blue-200 bangla-text">
                {message.fileName}
              </span>
            </div>
          </div>
        )}
        
        {/* Message content */}
        <div className={`${
          message.role === 'user' 
            ? 'bg-blue-500 text-white px-4 py-3 rounded-2xl ml-8' 
            : 'text-gray-800 dark:text-gray-200 py-2'
        }`}>
          <div className={`whitespace-pre-wrap bangla-text text-[15px] leading-relaxed ${
            message.role === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'
          }`}>
            {message.role === 'assistant' ? formatMarkdownText(displayContent) : displayContent}
          </div>
        </div>

        {/* Book Reading Buttons */}
        {bookLinks.length > 0 && (
          <div className="mt-3 space-y-2">
            {bookLinks.map((bookLink, index) => (
              <div key={index} className="flex gap-2">
                <Button
                  onClick={() => onBookRead?.(bookLink.url, bookLink.title)}
                  className="bangla-text bg-blue-600 hover:bg-blue-700 text-white flex-1 justify-start"
                  size="sm"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  📖 {bookLink.title} - এখানে পড়ুন
                </Button>
                <Button
                  onClick={() => onPdfOpen(bookLink.url, bookLink.title)}
                  variant="outline"
                  size="sm"
                  className="bangla-text"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  ডাউনলোড
                </Button>
              </div>
            ))}
          </div>
        )}

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
        
        <div className={`text-xs text-gray-400 mt-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString('bn-BD', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>

      {message.role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
