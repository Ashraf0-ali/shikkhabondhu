
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const QuotesForm = () => {
  const { addMotivationalQuote } = useSupabaseData();
  
  const [quoteData, setQuoteData] = useState({
    quote: '',
    author: '',
    tags: ''
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    addMotivationalQuote.mutate(quoteData);
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
      <CardHeader>
        <CardTitle className="bangla-text">💭 উদ্দীপনামূলক উক্তি যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium bangla-text">উক্তি</label>
            <Textarea
              value={quoteData.quote}
              onChange={(e) => setQuoteData({...quoteData, quote: e.target.value})}
              placeholder="উক্তি লিখুন"
              className="bangla-text min-h-[100px]"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium bangla-text">লেখক</label>
            <Input
              value={quoteData.author}
              onChange={(e) => setQuoteData({...quoteData, author: e.target.value})}
              placeholder="লেখকের নাম"
              className="bangla-text"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium bangla-text">ট্যাগ</label>
            <Input
              value={quoteData.tags}
              onChange={(e) => setQuoteData({...quoteData, tags: e.target.value})}
              placeholder="ট্যাগ (কমা দিয়ে আলাদা করুন)"
              className="bangla-text"
            />
          </div>
          <Button type="submit" className="w-full bangla-text" disabled={addMotivationalQuote.isPending}>
            {addMotivationalQuote.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                যোগ করা হচ্ছে...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                উক্তি যোগ করুন
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuotesForm;
