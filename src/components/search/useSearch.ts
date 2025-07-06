
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { generateSearchTerms, buildSearchConditions } from '@/utils/searchOptimization';
import { FileText, BookOpen, Book, FileTextIcon } from 'lucide-react';
import { SearchResult } from './types';

export const useSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
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
        type: 'nctb' as const, 
        icon: Book,
        relevance: 0
      }));

      setSearchResults(results);
    } catch (error) {
      console.error('NCTB Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

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

      // Combine and format results with relevance scoring and proper type conversion
      const combinedResults: SearchResult[] = [
        ...(mcqResults || []).map(item => ({ 
          ...item, 
          class_level: item.class_level ? parseInt(item.class_level) : null,
          type: 'mcq' as const, 
          icon: FileText, 
          relevance: calculateRelevance(item, searchTerms) 
        })),
        ...(boardResults || []).map(item => ({ 
          ...item, 
          type: 'board' as const, 
          icon: BookOpen, 
          relevance: calculateRelevance(item, searchTerms) 
        })),
        ...(nctbResults || []).map(item => ({ 
          ...item, 
          type: 'nctb' as const, 
          icon: Book, 
          relevance: calculateRelevance(item, searchTerms) 
        })),
        ...(notesResults || []).map(item => ({ 
          ...item, 
          type: 'notes' as const, 
          icon: FileTextIcon, 
          relevance: calculateRelevance(item, searchTerms) 
        }))
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

  // Initial load - যদি class filter থাকে তাহলে সেই class এর বই দেখাবো
  useEffect(() => {
    if (classFilter && !searchQuery) {
      performNCTBSearch('', classFilter);
    }
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    classFilter,
    clearClassFilter
  };
};
