
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SearchHeader = () => {
  return (
    <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
      <CardHeader className="text-center py-8">
        <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4 bangla-text">
          🔍 স্মার্ট সার্চ
        </CardTitle>
        <p className="text-lg text-gray-600 dark:text-gray-300 bangla-text">
          সব ধরনের শিক্ষা উপকরণ খুঁজে পান - বাংলা ও ইংরেজি উভয় ভাষায়
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 bangla-text mt-2">
          যেমন: "বাংলা ১ম পত্র" বা "bangla first paper" - দুইভাবেই খুঁজুন
        </p>
      </CardHeader>
    </Card>
  );
};

export default SearchHeader;
