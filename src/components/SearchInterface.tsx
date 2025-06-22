
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, BookOpen, FileText, MessageSquare } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'mcq' | 'quote' | 'file';
  tags: string[];
  content?: string;
  metadata?: any;
}

const SearchInterface = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const performSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get data from localStorage
    const textbooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
    const mcqs = JSON.parse(localStorage.getItem('mcqs') || '[]');
    const quotes = JSON.parse(localStorage.getItem('motivationalQuotes') || '[]');
    const files = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    
    const searchResults: SearchResult[] = [];
    
    // Search in textbooks
    textbooks.forEach((book: any) => {
      if (book.content?.toLowerCase().includes(query.toLowerCase()) ||
          book.subject?.toLowerCase().includes(query.toLowerCase()) ||
          book.chapter?.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          id: `book-${book.id}`,
          title: `${book.subject} - Chapter ${book.chapter}`,
          description: book.content?.substring(0, 150) + '...',
          type: 'book',
          tags: [book.subject, `Class ${book.class}`, `Chapter ${book.chapter}`],
          content: book.content,
          metadata: book
        });
      }
    });
    
    // Search in MCQs
    mcqs.forEach((mcq: any) => {
      if (mcq.question?.toLowerCase().includes(query.toLowerCase()) ||
          mcq.subject?.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          id: `mcq-${mcq.id}`,
          title: mcq.question,
          description: `Options: A) ${mcq.optionA} B) ${mcq.optionB}`,
          type: 'mcq',
          tags: [mcq.subject, mcq.board, mcq.year],
          metadata: mcq
        });
      }
    });
    
    // Search in quotes
    quotes.forEach((quote: any) => {
      if (quote.quote?.toLowerCase().includes(query.toLowerCase()) ||
          quote.tags?.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          id: `quote-${quote.id}`,
          title: quote.quote,
          description: quote.author || 'Anonymous',
          type: 'quote',
          tags: quote.tags?.split(',') || [],
          metadata: quote
        });
      }
    });
    
    // Search in files
    files.forEach((file: any) => {
      if (file.seoTitle?.toLowerCase().includes(query.toLowerCase()) ||
          file.seoDescription?.toLowerCase().includes(query.toLowerCase()) ||
          file.subject?.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          id: `file-${file.id}`,
          title: file.seoTitle || `${file.type} - ${file.subject}`,
          description: file.seoDescription || 'No description available',
          type: 'file',
          tags: [file.subject, file.type, ...(file.seoTags?.split(',') || [])],
          metadata: file
        });
      }
    });
    
    setResults(searchResults);
    setIsLoading(false);
  };

  const filteredResults = selectedFilter === 'all' 
    ? results 
    : results.filter(result => result.type === selectedFilter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return <BookOpen className="w-5 h-5" />;
      case 'mcq': return <FileText className="w-5 h-5" />;
      case 'quote': return <MessageSquare className="w-5 h-5" />;
      case 'file': return <FileText className="w-5 h-5" />;
      default: return <Search className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'book': return 'bg-blue-100 text-blue-800';
      case 'mcq': return 'bg-green-100 text-green-800';
      case 'quote': return 'bg-purple-100 text-purple-800';
      case 'file': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-gray-800 dark:text-white">
              🔍 Search Everything
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Search Bar */}
        <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Search books, questions, quotes, files..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-white/50 dark:bg-gray-700/50 border-white/20"
                onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              />
              <Button
                onClick={performSearch}
                disabled={isLoading}
                className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white px-6"
              >
                <Search className="w-4 h-4" />
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('all')}
                className={selectedFilter === 'all' ? 'bg-[#00C49A] text-white' : ''}
              >
                <Filter className="w-4 h-4 mr-2" />
                All
              </Button>
              <Button
                variant={selectedFilter === 'book' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('book')}
                className={selectedFilter === 'book' ? 'bg-[#00C49A] text-white' : ''}
              >
                📚 Books
              </Button>
              <Button
                variant={selectedFilter === 'mcq' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('mcq')}
                className={selectedFilter === 'mcq' ? 'bg-[#00C49A] text-white' : ''}
              >
                ❓ MCQs
              </Button>
              <Button
                variant={selectedFilter === 'quote' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('quote')}
                className={selectedFilter === 'quote' ? 'bg-[#00C49A] text-white' : ''}
              >
                💬 Quotes
              </Button>
              <Button
                variant={selectedFilter === 'file' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('file')}
                className={selectedFilter === 'file' ? 'bg-[#00C49A] text-white' : ''}
              >
                📄 Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <Card key={result.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                        {result.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {result.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : query && !isLoading ? (
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
              <CardContent className="p-8 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try different keywords or check your spelling
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;
