
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, FileText, Link } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  const [uploadType, setUploadType] = useState<'pdf' | 'text'>('pdf');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const dataToSubmit = {
      ...nctbData,
      file_type: uploadType,
      content: uploadType === 'text' ? nctbData.content : ''
    };
    addNCTBBook.mutate(dataToSubmit);
  };

  const resetForm = () => {
    setNctbData({
      title: '',
      subject: '',
      class_level: 6,
      chapter: '',
      content: '',
      file_url: '',
      file_type: 'pdf'
    });
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
      <CardHeader>
        <CardTitle className="bangla-text">📚 NCTB বই যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
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
              <Select 
                value={nctbData.class_level.toString()} 
                onValueChange={(value) => setNctbData({...nctbData, class_level: parseInt(value)})}
              >
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

          {/* Upload Type Selection */}
          <div className="space-y-4">
            <label className="text-sm font-medium bangla-text">আপলোড ধরন</label>
            <Tabs value={uploadType} onValueChange={(value) => setUploadType(value as 'pdf' | 'text')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pdf" className="bangla-text">
                  <Link className="w-4 h-4 mr-2" />
                  PDF লিংক
                </TabsTrigger>
                <TabsTrigger value="text" className="bangla-text">
                  <FileText className="w-4 h-4 mr-2" />
                  টেক্সট কন্টেন্ট
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pdf" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium bangla-text">PDF ফাইল URL</label>
                  <Input
                    value={nctbData.file_url}
                    onChange={(e) => setNctbData({...nctbData, file_url: e.target.value})}
                    placeholder="PDF ফাইলের URL লিখুন"
                    className="bangla-text"
                    type="url"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium bangla-text">বিবরণ (ঐচ্ছিক)</label>
                  <Textarea
                    value={nctbData.content}
                    onChange={(e) => setNctbData({...nctbData, content: e.target.value})}
                    placeholder="বইয়ের সংক্ষিপ্ত বিবরণ লিখুন"
                    className="bangla-text min-h-[100px]"
                  />
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium bangla-text">
                    বইয়ের টেক্সট কন্টেন্ট
                    <span className="text-xs text-gray-500 ml-2">
                      (AI প্রশ্ন তৈরির জন্য ব্যবহৃত হবে)
                    </span>
                  </label>
                  <Textarea
                    value={nctbData.content}
                    onChange={(e) => setNctbData({...nctbData, content: e.target.value})}
                    placeholder="বইয়ের সম্পূর্ণ টেক্সট কন্টেন্ট এখানে পেস্ট করুন..."
                    className="bangla-text min-h-[200px]"
                    required={uploadType === 'text'}
                  />
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300 bangla-text">
                    💡 <strong>টিপস:</strong> টেক্সট কন্টেন্ট থাকলে AI এই বিষয়বস্তু থেকে স্বয়ংক্রিয়ভাবে 
                    অনুরূপ প্রশ্ন তৈরি করতে পারবে এবং শিক্ষার্থীদের আরও ভাল সহায়তা প্রদান করতে পারবে।
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1 bangla-text" disabled={addNCTBBook.isPending}>
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
            <Button type="button" variant="outline" onClick={resetForm} className="bangla-text">
              রিসেট করুন
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NCTBForm;
