import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, FileText, BookOpen, Book, FileTextIcon, Loader2, ExternalLink, Download, Filter, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { generateSearchTerms, buildSearchConditions } from '@/utils/searchOptimization';

const SearchInterface = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [classFilter, setClassFilter] = useState<number | null>(null);

  // URL থেকে class filter পড়া
  useEffect(() => {
    const classParam = searchParams.get('class');
    const typeParam = searchParams.get('type');
    
    if (classParam) {
      const classLevel = parseInt(classParam);
      setClassFilter(classLevel);
      
      // যদি type=books হয় তাহলে শুধু NCTB বই দেখাবো
      if (typeParam === 'books') {
        performNCTBSearch('', classLevel);
      }
    }
  }, [searchParams]);

  const performNCTBSearch = async (query: string, classLevel?: number) => {
    setIsSearching(true);
    try {
      let nctbQuery = supabase
        .from('nctb_books')
        .select('*');

      // Class filter প্রয়োগ করা
      if (classLevel) {
        nctbQuery = nctbQuery.eq('class_level', classLevel);
      }

      // Enhanced search with SEO optimization
      if (query && query.length >= 2) {
        const searchTerms = generateSearchTerms(query);
        const searchConditions = buildSearchConditions(searchTerms, 'nctb_books');
        nctbQuery = nctbQuery.or(searchConditions);
      }

      const { data: nctbResults } = await nctbQuery.limit(50);

      const results = (nctbResults || []).map(item => ({ 
        ...item, 
        type: 'nctb', 
        icon: Book 
      }));

      setSearchResults(results);
    } catch (error) {
      console.error('NCTB Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const performSearch = async (query: string) => {
    if (!query || query.length < 2) {
      // যদি class filter থাকে তাহলে সেই class এর সব বই দেখাবো
      if (classFilter) {
        performNCTBSearch('', classFilter);
        return;
      }
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Generate enhanced search terms using SEO optimization
      const searchTerms = generateSearchTerms(query);
      console.log('Enhanced search terms:', searchTerms);
      
      // Search MCQ questions with optimized terms
      const mcqConditions = buildSearchConditions(searchTerms, 'mcq_questions');
      const { data: mcqResults } = await supabase
        .from('mcq_questions')
        .select('*')
        .or(mcqConditions)
        .limit(20);

      // Search Board questions with optimized terms
      const boardConditions = buildSearchConditions(searchTerms, 'board_questions');
      const { data: boardResults } = await supabase
        .from('board_questions')
        .select('*')
        .or(boardConditions)
        .limit(20);

      // Search NCTB books with optimized terms
      let nctbQuery = supabase
        .from('nctb_books')
        .select('*');

      const nctbConditions = buildSearchConditions(searchTerms, 'nctb_books');
      nctbQuery = nctbQuery.or(nctbConditions);

      // Class filter প্রয়োগ করা
      if (classFilter) {
        nctbQuery = nctbQuery.eq('class_level', classFilter);
      }

      const { data: nctbResults } = await nctbQuery.limit(20);

      // Search Notes with optimized terms
      const notesConditions = buildSearchConditions(searchTerms, 'notes');
      const { data: notesResults } = await supabase
        .from('notes')
        .select('*')
        .or(notesConditions)
        .limit(20);

      // Combine and format results with relevance scoring
      const combinedResults = [
        ...(mcqResults || []).map(item => ({ ...item, type: 'mcq', icon: FileText, relevance: calculateRelevance(item, searchTerms) })),
        ...(boardResults || []).map(item => ({ ...item, type: 'board', icon: BookOpen, relevance: calculateRelevance(item, searchTerms) })),
        ...(nctbResults || []).map(item => ({ ...item, type: 'nctb', icon: Book, relevance: calculateRelevance(item, searchTerms) })),
        ...(notesResults || []).map(item => ({ ...item, type: 'notes', icon: FileTextIcon, relevance: calculateRelevance(item, searchTerms) }))
      ];

      // Sort by relevance score
      combinedResults.sort((a, b) => b.relevance - a.relevance);

      setSearchResults(combinedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Calculate relevance score based on search terms match
  const calculateRelevance = (item: any, searchTerms: string[]): number => {
    let score = 0;
    const searchableText = [
      item.title || '',
      item.subject || '',
      item.question || '',
      item.content || '',
      item.chapter || '',
      item.board || ''
    ].join(' ').toLowerCase();

    searchTerms.forEach(term => {
      const termLower = term.toLowerCase();
      if (searchableText.includes(termLower)) {
        // Higher score for exact matches in title
        if ((item.title || '').toLowerCase().includes(termLower)) {
          score += 10;
        }
        // Medium score for subject matches
        if ((item.subject || '').toLowerCase().includes(termLower)) {
          score += 5;
        }
        // Lower score for other field matches
        score += 1;
      }
    });

    return score;
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, classFilter]);

  const clearClassFilter = () => {
    setClassFilter(null);
    setSearchParams({});
    setSearchResults([]);
  };

  const getClassLevelName = (level: number) => {
    switch (level) {
      case 6: return '৬ষ্ঠ শ্রেণী';
      case 7: return '৭ম শ্রেণী';
      case 8: return '৮ম শ্রেণী';
      case 9: return '৯ম-১০ম শ্রেণী';
      default: return `${level} শ্রেণী`;
    }
  };

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

  const handleFileOpen = (fileUrl: string, title: string) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('ফাইল লিংক উপলব্ধ নেই');
    }
  };

  // Initial load - যদি class filter থাকে তাহলে সেই class এর বই দেখাবো
  useEffect(() => {
    if (classFilter && !searchQuery) {
      performNCTBSearch('', classFilter);
    }
  }, []);

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
              সব ধরনের শিক্ষা উপকরণ খুঁজে পান - বাংলা ও ইংরেজি উভয় ভাষায়
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 bangla-text mt-2">
              যেমন: "বাংলা ১ম পত্র" বা "bangla first paper" - দুইভাবেই খুঁজুন
            </p>
          </CardHeader>
        </Card>

        {/* Active Filters */}
        {classFilter && (
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 bangla-text">সক্রিয় ফিল্টার:</span>
                <Badge className="bg-blue-100 text-blue-800 bangla-text">
                  {getClassLevelName(classFilter)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={clearClassFilter}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Search Bar */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={classFilter ? 
                  `${getClassLevelName(classFilter)} এর বই অনুসন্ধান করুন...` : 
                  "বাংলা ১ম পত্র, english first paper, গণিত, physics - যেকোনো ভাষায় খুঁজুন..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg bangla-text border-2 focus:border-blue-500"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
              )}
            </div>
            <div className="mt-3 text-xs text-gray-500 bangla-text">
              💡 টিপস: "বাংলা ১ম পত্র", "bangla first paper", "গণিত ৮ম শ্রেণী", "physics class 9" - সব ধরনের সার্চ কাজ করবে
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {(searchQuery || classFilter) && (
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="bangla-text">
                📊 {classFilter ? `${getClassLevelName(classFilter)} এর বই` : 'সার্চ ফলাফল'} ({searchResults.length})
                {searchQuery && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    "{searchQuery}" এর জন্য
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchResults.length === 0 && !isSearching ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 bangla-text">
                    {classFilter ? 
                      `${getClassLevelName(classFilter)} এর কোনো বই পাওয়া যায়নি` : 
                      'কোনো ফলাফল পাওয়া যায়নি'
                    }
                  </p>
                  <p className="text-xs text-gray-400 bangla-text mt-2">
                    অন্য ভাষায় বা ভিন্ন শব্দ দিয়ে চেষ্টা করুন
                  </p>
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
                                {result.class_level && (
                                  <Badge variant="outline" className="text-xs">
                                    শ্রেণী {result.class_level}
                                  </Badge>
                                )}
                                {result.relevance > 5 && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    🎯 উচ্চ মিল
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
                              
                              {/* File Actions */}
                              {result.file_url && (
                                <div className="mt-3 flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleFileOpen(result.file_url, result.title)}
                                    className="bangla-text"
                                  >
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    পিডিএফ খুলুন
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      navigator.clipboard.writeText(result.file_url);
                                      alert('লিংক কপি হয়েছে!');
                                    }}
                                    className="bangla-text"
                                  >
                                    <Download className="w-4 h-4 mr-1" />
                                    লিংক কপি
                                  </Button>
                                </div>
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
