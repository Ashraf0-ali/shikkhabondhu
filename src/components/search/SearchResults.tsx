
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download } from 'lucide-react';
import { SearchResult } from './types';

interface SearchResultsProps {
  searchResults: SearchResult[];
  searchQuery: string;
  classFilter: number | null;
  isSearching: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  searchResults, 
  searchQuery, 
  classFilter, 
  isSearching 
}) => {
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

  if (!searchQuery && !classFilter) return null;

  return (
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
                              onClick={() => handleFileOpen(result.file_url!, result.title || '')}
                              className="bangla-text"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              পিডিএফ খুলুন
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(result.file_url!);
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
  );
};

export default SearchResults;
