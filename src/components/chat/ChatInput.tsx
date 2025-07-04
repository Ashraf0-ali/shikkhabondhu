
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Paperclip, X, Image, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  isLoading: boolean;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ChatInput = ({
  inputMessage,
  setInputMessage,
  uploadedFile,
  setUploadedFile,
  isLoading,
  onSendMessage,
  onKeyPress,
  fileInputRef,
  inputRef
}: ChatInputProps) => {
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "ফাইল বেশি বড়",
          description: "৫ MB এর কম ফাইল আপলোড করুন",
          variant: "destructive"
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "ফাইল টাইপ সমর্থিত নয়",
          description: "ছবি, PDF বা টেক্সট ফাইল আপলোড করুন",
          variant: "destructive"
        });
        return;
      }
      
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="w-4 h-4 text-red-500" />;
    } else {
      return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-[100]">
      <div className="max-w-3xl mx-auto">
        {/* File Upload Preview */}
        {uploadedFile && (
          <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(uploadedFile.type)}
                <div>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200 bangla-text">
                    {uploadedFile.name}
                  </span>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Input Row */}
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder="মেসেজ লিখুন..."
              className="pr-12 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 bangla-text h-11 text-sm rounded-full"
              disabled={isLoading}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.txt"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={onSendMessage}
            disabled={isLoading || (!inputMessage.trim() && !uploadedFile)}
            className="bg-blue-500 hover:bg-blue-600 text-white w-11 h-11 p-0 rounded-full flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
