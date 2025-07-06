
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface SearchFiltersProps {
  classFilter: number | null;
  onClearClassFilter: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ classFilter, onClearClassFilter }) => {
  const getClassLevelName = (level: number) => {
    switch (level) {
      case 6: return '৬ষ্ঠ শ্রেণী';
      case 7: return '৭ম শ্রেণী';
      case 8: return '৮ম শ্রেণী';
      case 9: return '৯ম-১০ম শ্রেণী';
      default: return `${level} শ্রেণী`;
    }
  };

  if (!classFilter) return null;

  return (
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
              onClick={onClearClassFilter}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
