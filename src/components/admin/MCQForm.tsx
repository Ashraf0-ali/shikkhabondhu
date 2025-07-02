
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const MCQForm = () => {
  const { addMCQQuestion } = useSupabaseData();
  
  const [mcqData, setMcqData] = useState({
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A' as 'A' | 'B' | 'C' | 'D',
    subject: '',
    chapter: '',
    board: '',
    year: new Date().getFullYear()
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    addMCQQuestion.mutate(mcqData);
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
      <CardHeader>
        <CardTitle className="bangla-text">📝 MCQ প্রশ্ন যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">বিষয়</label>
              <Input
                value={mcqData.subject}
                onChange={(e) => setMcqData({...mcqData, subject: e.target.value})}
                placeholder="বিষয় লিখুন"
                className="bangla-text"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">অধ্যায়</label>
              <Input
                value={mcqData.chapter}
                onChange={(e) => setMcqData({...mcqData, chapter: e.target.value})}
                placeholder="অধ্যায় লিখুন"
                className="bangla-text"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">বোর্ড/শ্রেণী</label>
              <Select value={mcqData.board} onValueChange={(value) => setMcqData({...mcqData, board: value})}>
                <SelectTrigger className="bangla-text">
                  <SelectValue placeholder="বোর্ড/শ্রেণী নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ঢাকা">ঢাকা বোর্ড</SelectItem>
                  <SelectItem value="চট্টগ্রাম">চট্টগ্রাম বোর্ড</SelectItem>
                  <SelectItem value="রাজশাহী">রাজশাহী বোর্ড</SelectItem>
                  <SelectItem value="যশোর">যশোর বোর্ড</SelectItem>
                  <SelectItem value="কুমিল্লা">কুমিল্লা বোর্ড</SelectItem>
                  <SelectItem value="বরিশাল">বরিশাল বোর্ড</SelectItem>
                  <SelectItem value="সিলেট">সিলেট বোর্ড</SelectItem>
                  <SelectItem value="দিনাজপুর">দিনাজপুর বোর্ড</SelectItem>
                  <SelectItem value="আলিম">আলিম</SelectItem>
                  <SelectItem value="দাখিল">দাখিল</SelectItem>
                  <SelectItem value="কারিগরি">কারিগরি</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">বছর</label>
              <Input
                type="number"
                value={mcqData.year}
                onChange={(e) => setMcqData({...mcqData, year: parseInt(e.target.value)})}
                placeholder="বছর"
                className="bangla-text"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium bangla-text">প্রশ্ন</label>
            <Textarea
              value={mcqData.question}
              onChange={(e) => setMcqData({...mcqData, question: e.target.value})}
              placeholder="প্রশ্ন লিখুন"
              className="bangla-text min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">বিকল্প A</label>
              <Input
                value={mcqData.option_a}
                onChange={(e) => setMcqData({...mcqData, option_a: e.target.value})}
                placeholder="বিকল্প A"
                className="bangla-text"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">বিকল্প B</label>
              <Input
                value={mcqData.option_b}
                onChange={(e) => setMcqData({...mcqData, option_b: e.target.value})}
                placeholder="বিকল্প B"
                className="bangla-text"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">বিকল্প C</label>
              <Input
                value={mcqData.option_c}
                onChange={(e) => setMcqData({...mcqData, option_c: e.target.value})}
                placeholder="বিকল্প C"
                className="bangla-text"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">বিকল্প D</label>
              <Input
                value={mcqData.option_d}
                onChange={(e) => setMcqData({...mcqData, option_d: e.target.value})}
                placeholder="বিকল্প D"
                className="bangla-text"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium bangla-text">সঠিক উত্তর</label>
            <Select value={mcqData.correct_answer} onValueChange={(value: 'A' | 'B' | 'C' | 'D') => setMcqData({...mcqData, correct_answer: value})}>
              <SelectTrigger className="bangla-text">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bangla-text" disabled={addMCQQuestion.isPending}>
            {addMCQQuestion.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                যোগ করা হচ্ছে...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                MCQ প্রশ্ন যোগ করুন
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MCQForm;
