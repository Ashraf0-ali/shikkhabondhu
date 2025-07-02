
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const NCTBForm = () => {
  const { addNCTBBook } = useSupabaseData();
  
  const [nctbData, setNctbData] = useState({
    title: '',
    subject: '',
    class_level: 6,
    chapter: '',
    content: '',
    file_url: '',
    file_type: 'pdf'
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    addNCTBBook.mutate(nctbData);
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
      <CardHeader>
        <CardTitle className="bangla-text">📚 NCTB বই যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">বইয়ের নাম</label>
              <Input
                value={nctbData.title}
                onChange={(e) => setNctbData({...nctbData, title: e.target.value})}
                placeholder="বইয়ের নাম লিখুন"
                className="bangla-text"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">বিষয়</label>
              <Input
                value={nctbData.subject}
                onChange={(e) => setNctbData({...nctbData, subject: e.target.value})}
                placeholder="বিষয় লিখুন"
                className="bangla-text"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">শ্রেণী</label>
              <Select value={nctbData.class_level.toString()} onValueChange={(value) => setNctbData({...nctbData, class_level: parseInt(value)})}>
                <SelectTrigger className="bangla-text">
                  <SelectValue placeholder="শ্রেণী নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {[6, 7, 8, 9, 10, 11, 12].map(cls => (
                    <SelectItem key={cls} value={cls.toString()}>শ্রেণী {cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">অধ্যায়</label>
              <Input
                value={nctbData.chapter}
                onChange={(e) => setNctbData({...nctbData, chapter: e.target.value})}
                placeholder="অধ্যায় লিখুন"
                className="bangla-text"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium bangla-text">বিষয়বস্তু</label>
            <Textarea
              value={nctbData.content}
              onChange={(e) => setNctbData({...nctbData, content: e.target.value})}
              placeholder="বইয়ের বিষয়বস্তু বা বিবরণ লিখুন"
              className="bangla-text min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium bangla-text">ফাইল URL</label>
            <Input
              value={nctbData.file_url}
              onChange={(e) => setNctbData({...nctbData, file_url: e.target.value})}
              placeholder="PDF ফাইলের URL লিখুন"
              className="bangla-text"
            />
          </div>

          <Button type="submit" className="w-full bangla-text" disabled={addNCTBBook.isPending}>
            {addNCTBBook.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                যোগ করা হচ্ছে...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                NCTB বই যোগ করুন
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NCTBForm;
