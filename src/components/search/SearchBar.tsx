
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  isSearching: boolean;
  classFilter: number | null;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchQuery, 
  onSearchQueryChange, 
  isSearching, 
  classFilter 
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

  return (
    <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
      <CardContent className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder={classFilter ? 
              `${getClassLevelName(classFilter)} এর বই খুঁজুন...` : 
              "যেকোনো বিষয় খুঁজুন..."
            }
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-10 pr-4 py-3 text-lg bangla-text border-2 focus:border-blue-500"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchBar;
