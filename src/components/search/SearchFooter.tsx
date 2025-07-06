
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const SearchFooter = () => {
  return (
    <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
      <CardContent className="p-4 text-center">
        <p className="text-sm text-gray-600 bangla-text">
          Developed by Ashraf | যেকোনো প্রয়োজনে মেসেজ করুন - 
          <a href="https://wa.me/8801825210571" className="text-blue-600 hover:underline ml-1">
            WhatsApp: 01825210571
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

export default SearchFooter;
