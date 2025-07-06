
export const detectBookRequest = (message: string): boolean => {
  return message.toLowerCase().includes('বই') || 
         message.toLowerCase().includes('পিডিএফ') || 
         message.toLowerCase().includes('pdf') ||
         message.toLowerCase().includes('nctb') ||
         message.toLowerCase().includes('শ্রেণী') ||
         message.toLowerCase().includes('class');
};

export const detectMCQRequest = (message: string): boolean => {
  return message.toLowerCase().includes('mcq') || 
         message.toLowerCase().includes('এমসিকিউ') ||
         message.toLowerCase().includes('প্রশ্ন') ||
         message.toLowerCase().includes('রাজশাহী') ||
         message.toLowerCase().includes('বোর্ড') ||
         message.toLowerCase().includes('২০১৷') ||
         message.toLowerCase().includes('2017') ||
         message.toLowerCase().includes('বাংলা');
};

export const validateRequest = (message: string): string | null => {
  if (!message || typeof message !== 'string') {
    return 'অনুগ্রহ করে একটি বার্তা লিখুন।';
  }
  return null;
};

export const validateApiKey = (apiKey: string | undefined): string | null => {
  if (!apiKey) {
    console.error('Gemini API key not found in environment variables');
    return 'AI সেবা বর্তমানে উপলব্ধ নয়। পরে আবার চেষ্টা করুন।';
  }
  return null;
};
