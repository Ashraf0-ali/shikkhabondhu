
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const EnhancedMCQForm = () => {
  const { addMCQQuestion } = useSupabaseData();
  
  const [mcqData, setMcqData] = useState({
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    subject: '',
    board: '',
    chapter: '',
    year: new Date().getFullYear(),
    class_level: 'class_9_10',
    // Admission specific fields
    university: '',
    group: '',
    unit: ''
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Prepare the data for submission
    const submissionData = {
      question: mcqData.question,
      option_a: mcqData.option_a,
      option_b: mcqData.option_b,
      option_c: mcqData.option_c,
      option_d: mcqData.option_d,
      correct_answer: mcqData.correct_answer,
      subject: mcqData.subject,
      board: mcqData.board,
      chapter: mcqData.chapter,
      year: mcqData.year,
      class_level: mcqData.class_level,
      admission_info: mcqData.class_level === 'admission' ? {
        university: mcqData.university,
        group: mcqData.group,
        unit: mcqData.unit
      } : {}
    };

    addMCQQuestion.mutate(submissionData);
    
    // Reset form after successful submission
    if (!addMCQQuestion.isError) {
      setMcqData({
        question: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 'A',
        subject: '',
        board: '',
        chapter: '',
        year: new Date().getFullYear(),
        class_level: 'class_9_10',
        university: '',
        group: '',
        unit: ''
      });
    }
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
      <CardHeader>
        <CardTitle className="bangla-text">📝 MCQ প্রশ্ন যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Class Level Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium bangla-text">ক্লাস লেভেল</label>
            <Select value={mcqData.class_level} onValueChange={(value) => setMcqData({...mcqData, class_level: value})}>
              <SelectTrigger className="bangla-text">
                <SelectValue placeholder="ক্লাস লেভেল নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class_9_10">নবম-দশম শ্রেণী</SelectItem>
                <SelectItem value="class_11_12">একাদশ-দ্বাদশ শ্রেণী</SelectItem>
                <SelectItem value="admission">ভর্তি পরীক্ষা</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Admission specific fields */}
          {mcqData.class_level === 'admission' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium bangla-text">বিশ্ববিদ্যালয়</label>
                  <Input
                    value={mcqData.university}
                    onChange={(e) => setMcqData({...mcqData, university: e.target.value})}
                    placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয়"
                    className="bangla-text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium bangla-text">গ্রুপ</label>
                  <Select value={mcqData.group} onValueChange={(value) => setMcqData({...mcqData, group: value})}>
                    <SelectTrigger className="bangla-text">
                      <SelectValue placeholder="গ্রুপ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="science">বিজ্ঞান</SelectItem>
                      <SelectItem value="arts">মানবিক</SelectItem>
                      <SelectItem value="commerce">ব্যবসায় শিক্ষা</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium bangla-text">ইউনিট</label>
                  <Select value={mcqData.unit} onValueChange={(value) => setMcqData({...mcqData, unit: value})}>
                    <SelectTrigger className="bangla-text">
                      <SelectValue placeholder="ইউনিট নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">ক ইউনিট</SelectItem>
                      <SelectItem value="B">খ ইউনিট</SelectItem>
                      <SelectItem value="C">গ ইউনিট</SelectItem>
                      <SelectItem value="D">ঘ ইউনিট</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

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
              <label className="text-sm font-medium bangla-text">অপশন A</label>
              <Input
                value={mcqData.option_a}
                onChange={(e) => setMcqData({...mcqData, option_a: e.target.value})}
                placeholder="অপশন A"
                className="bangla-text"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">অপশন B</label>
              <Input
                value={mcqData.option_b}
                onChange={(e) => setMcqData({...mcqData, option_b: e.target.value})}
                placeholder="অপশন B"
                className="bangla-text"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">অপশন C</label>
              <Input
                value={mcqData.option_c}
                onChange={(e) => setMcqData({...mcqData, option_c: e.target.value})}
                placeholder="অপশন C"
                className="bangla-text"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">অপশন D</label>
              <Input
                value={mcqData.option_d}
                onChange={(e) => setMcqData({...mcqData, option_d: e.target.value})}
                placeholder="অপশন D"
                className="bangla-text"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">সঠিক উত্তর</label>
              <Select value={mcqData.correct_answer} onValueChange={(value) => setMcqData({...mcqData, correct_answer: value})}>
                <SelectTrigger className="bangla-text">
                  <SelectValue placeholder="সঠিক উত্তর নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">বিষয়</label>
              <Input
                value={mcqData.subject}
                onChange={(e) => setMcqData({...mcqData, subject: e.target.value})}
                placeholder="বিষয়"
                className="bangla-text"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">বোর্ড</label>
              <Input
                value={mcqData.board}
                onChange={(e) => setMcqData({...mcqData, board: e.target.value})}
                placeholder="বোর্ড"
                className="bangla-text"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium bangla-text">অধ্যায়</label>
              <Input
                value={mcqData.chapter}
                onChange={(e) => setMcqData({...mcqData, chapter: e.target.value})}
                placeholder="অধ্যায়"
                className="bangla-text"
              />
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

          <Button type="submit" className="w-full bangla-text" disabled={addMCQQuestion.isPending}>
            {addMCQQuestion.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                যোগ করা হচ্ছে...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                MCQ যোগ করুন
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedMCQForm;
