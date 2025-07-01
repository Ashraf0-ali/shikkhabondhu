
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, FileText, BookOpen, Book, FileTextIcon, Loader2 } from 'lucide-react';

const SearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchTerm = query.toLowerCase();
      
      // Search MCQ questions
      const { data: mcqResults } = await supabase
        .from('mcq_questions')
        .select('*')
        .or(`question.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%,chapter.ilike.%${searchTerm}%,board.ilike.%${searchTerm}%`)
        .limit(20);

      // Search Board questions
      const { data: boardResults } = await supabase
        .from('board_questions')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%,board.ilike.%${searchTerm}%`)
        .limit(20);

      // Search NCTB books
      const { data: nctbResults } = await supabase
        .from('nctb_books')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .limit(20);

      // Search Notes
      const { data: notesResults } = await supabase
        .from('notes')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .limit(20);

      // Combine and format results
      const combinedResults = [
        ...(mcqResults || []).map(item => ({ ...item, type: 'mcq', icon: FileText })),
        ...(boardResults || []).map(item => ({ ...item, type: 'board', icon: BookOpen })),
        ...(nctbResults || []).map(item => ({ ...item, type: 'nctb', icon: Book })),
        ...(notesResults || []).map(item => ({ ...item, type: 'notes', icon: FileTextIcon }))
      ];

      setSearchResults(combinedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mcq': return 'MCQ প্রশ্ন';
      case 'board': return 'বোর্ড প্রশ্ন';
      case 'nctb': return 'NCTB বই';
      case 'notes': return 'নোটস';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mcq': return 'bg-blue-100 text-blue-800';
      case 'board': return 'bg-green-100 text-green-800';
      case 'nctb': return 'bg-purple-100 text-purple-800';
      case 'notes': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader className="text-center py-8">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4 bangla-text">
              🔍 স্মার্ট সার্চ
            </CardTitle>
            <p className="text-lg text-gray-600 dark:text-gray-300 bangla-text">
              সব ধরনের শিক্ষা উপকরণ খুঁজে পান
            </p>
          </CardHeader>
        </Card>

        {/* Search Bar */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="MCQ, বোর্ড প্রশ্ন, NCTB বই, নোটস - যেকোনো কিছু খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg bangla-text border-2 focus:border-blue-500"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchQuery && (
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="bangla-text">
                📊 সার্চ ফলাফল ({searchResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchResults.length === 0 && !isSearching ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 bangla-text">কোনো ফলাফল পাওয়া যায়নি</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((result, index) => {
                    const IconComponent = result.icon;
                    return (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <IconComponent className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={`text-xs ${getTypeColor(result.type)}`}>
                                  {getTypeLabel(result.type)}
                                </Badge>
                                {result.subject && (
                                  <Badge variant="outline" className="text-xs">
                                    {result.subject}
                                  </Badge>
                                )}
                                {result.board && (
                                  <Badge variant="outline" className="text-xs">
                                    {result.board}
                                  </Badge>
                                )}
                                {result.year && (
                                  <Badge variant="outline" className="text-xs">
                                    {result.year}
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-medium text-gray-900 dark:text-gray-100 bangla-text mb-1">
                                {result.title || result.question?.substring(0, 100) + '...' || 'শিরোনাম নেই'}
                              </h3>
                              {result.question && result.type === 'mcq' && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 bangla-text">
                                  {result.question.substring(0, 150)}...
                                </p>
                              )}
                              {result.content && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 bangla-text">
                                  {result.content.substring(0, 150)}...
                                </p>
                              )}
                              {result.chapter && (
                                <p className="text-xs text-gray-500 bangla-text mt-1">
                                  অধ্যায়: {result.chapter}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
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
      </div>
    </div>
  );
};

export default SearchInterface;
