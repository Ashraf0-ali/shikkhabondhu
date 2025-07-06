
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SearchHeader = () => {
  return (
    <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
      <CardHeader className="text-center py-6">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent bangla-text">
          🔍 স্মার্ট সার্চ
        </CardTitle>
        <p className="text-base text-gray-600 dark:text-gray-300 bangla-text mt-2">
          সব ধরনের শিক্ষা উপকরণ খুঁজে পান
        </p>
      </CardHeader>
    </Card>
  );
};

export default SearchHeader;
