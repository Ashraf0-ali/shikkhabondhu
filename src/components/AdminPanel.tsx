import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, FileText, BookOpen, MessageSquare, Key, Settings } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';

const mcqFormSchema = z.object({
  question: z.string().min(1, "প্রশ্ন লিখুন"),
  option_a: z.string().min(1, "অপশন A লিখুন"),
  option_b: z.string().min(1, "অপশন B লিখুন"),  
  option_c: z.string().min(1, "অপশন C লিখুন"),
  option_d: z.string().min(1, "অপশন D লিখুন"),
  correct_answer: z.enum(['A', 'B', 'C', 'D']),
  subject: z.string().min(1, "বিষয় নির্বাচন করুন"),
  board: z.string().optional(),
  year: z.string().optional(),
  chapter: z.string().optional(),
});

const boardQuestionFormSchema = z.object({
  title: z.string().min(1, "শিরোনাম লিখুন"),
  subject: z.string().min(1, "বিষয় নির্বাচন করুন"),
  board: z.string().min(1, "বোর্ড নির্বাচন করুন"),
  year: z.string().min(1, "বছর লিখুন"),
  file_type: z.string().optional(),
  file_url: z.string().optional(),
});

const nctbBookFormSchema = z.object({
  title: z.string().min(1, "বইয়ের নাম লিখুন"),
  subject: z.string().min(1, "বিষয় নির্বাচন করুন"),
  class_level: z.string().min(1, "শ্রেণি নির্বাচন করুন"),
  chapter: z.string().optional(),
  content: z.string().optional(),
  file_url: z.string().optional(),
  file_type: z.string().optional(),
});

const noteFormSchema = z.object({
  title: z.string().min(1, "নোটের শিরোনাম লিখুন"),
  subject: z.string().min(1, "বিষয় নির্বাচন করুন"),
  chapter: z.string().optional(),
  content: z.string().optional(),
  file_url: z.string().optional(),
  file_type: z.string().optional(),
});

const quoteFormSchema = z.object({
  quote: z.string().min(1, "উদ্দীপনামূলক কথা লিখুন"),
  author: z.string().optional(),
  tags: z.string().optional(),
});

const apiKeyFormSchema = z.object({
  provider: z.string().min(1, "প্রদানকারী নির্বাচন করুন"),
  api_key: z.string().min(1, "API Key লিখুন"),
});

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('mcq');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const { 
    addMCQQuestion, 
    addBoardQuestion, 
    addNCTBBook, 
    addNote,
    addMotivationalQuote,
    addApiKey,
    importMCQsFromCSV 
  } = useSupabaseData();
  const { toast } = useToast();

  // Form instances
  const mcqForm = useForm<z.infer<typeof mcqFormSchema>>({
    resolver: zodResolver(mcqFormSchema),
    defaultValues: {
      question: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      subject: '',
      board: '',
      year: '',
      chapter: '',
    }
  });

  const boardQuestionForm = useForm<z.infer<typeof boardQuestionFormSchema>>({
    resolver: zodResolver(boardQuestionFormSchema),
    defaultValues: {
      title: '',
      subject: '',
      board: '',
      year: '',
      file_type: '',
      file_url: '',
    }
  });

  const nctbBookForm = useForm<z.infer<typeof nctbBookFormSchema>>({
    resolver: zodResolver(nctbBookFormSchema),
    defaultValues: {
      title: '',
      subject: '',
      class_level: '',
      chapter: '',
      content: '',
      file_url: '',
      file_type: '',
    }
  });

  const noteForm = useForm<z.infer<typeof noteFormSchema>>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: '',
      subject: '',
      chapter: '',
      content: '',
      file_url: '',
      file_type: '',
    }
  });

  const quoteForm = useForm<z.infer<typeof quoteFormSchema>>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      quote: '',
      author: '',
      tags: '',
    }
  });

  const apiKeyForm = useForm<z.infer<typeof apiKeyFormSchema>>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      provider: '',
      api_key: '',
    }
  });

  // Subject and board options
  const subjects = [
    'বাংলা', 'ইংরেজি', 'গণিত', 'বিজ্ঞান', 'পদার্থবিজ্ঞান', 'রসায়ন', 
    'জীববিজ্ঞান', 'ইতিহাস', 'ভূগোল', 'পৌরনীতি', 'অর্থনীতি', 
    'ইসলাম শিক্ষা', 'হিন্দু ধর্ম', 'বৌদ্ধ ধর্ম', 'খ্রিস্তান ধর্ম', 
    'কৃষিশিক্ষা', 'গার্হস্থ্য বিজ্ঞান'
  ];

  const boards = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'যশোর', 'কুমিল্লা', 'বরিশাল', 'সিলেট', 'দিনাজপুর', 'মাদ্রাসা', 'কারিগরি'];
  const classLevels = ['৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম', 'একাদশ', 'দ্বাদশ'];
  const apiProviders = ['openai', 'gemini', 'claude'];

  // Submit handlers
  const onMCQSubmit = (values: z.infer<typeof mcqFormSchema>) => {
    addMCQQuestion.mutate({
      question: values.question,
      option_a: values.option_a,
      option_b: values.option_b,
      option_c: values.option_c,
      option_d: values.option_d,
      correct_answer: values.correct_answer,
      subject: values.subject,
      board: values.board || null,
      year: values.year ? parseInt(values.year) : null,
      chapter: values.chapter || null,
    });
    mcqForm.reset();
  };

  const onBoardQuestionSubmit = (values: z.infer<typeof boardQuestionFormSchema>) => {
    addBoardQuestion.mutate({
      title: values.title,
      subject: values.subject,
      board: values.board,
      year: parseInt(values.year),
      file_type: values.file_type || null,
      file_url: values.file_url || null,
    });
    boardQuestionForm.reset();
  };

  const onNCTBBookSubmit = (values: z.infer<typeof nctbBookFormSchema>) => {
    addNCTBBook.mutate({
      title: values.title,
      subject: values.subject,
      class_level: parseInt(values.class_level),
      chapter: values.chapter || null,
      content: values.content || null,
      file_url: values.file_url || null,
      file_type: values.file_type || null,
    });
    nctbBookForm.reset();
  };

  const onNoteSubmit = (values: z.infer<typeof noteFormSchema>) => {
    addNote.mutate({
      title: values.title,
      subject: values.subject,
      chapter: values.chapter || null,
      content: values.content || null,
      file_url: values.file_url || null,
      file_type: values.file_type || null,
    });
    noteForm.reset();
  };

  const onQuoteSubmit = (values: z.infer<typeof quoteFormSchema>) => {
    addMotivationalQuote.mutate({
      quote: values.quote,
      author: values.author || null,
      tags: values.tags || null,
    });
    quoteForm.reset();
  };

  const onApiKeySubmit = (values: z.infer<typeof apiKeyFormSchema>) => {
    addApiKey.mutate({
      provider: values.provider,
      api_key: values.api_key,
    });
    apiKeyForm.reset();
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const mcqs = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          return {
            question: values[0] || '',
            option_a: values[1] || '',
            option_b: values[2] || '',
            option_c: values[3] || '',
            option_d: values[4] || '',
            correct_answer: values[5] as 'A' | 'B' | 'C' | 'D' || 'A',
            subject: values[6] || '',
            board: values[7] || null,
            year: values[8] ? parseInt(values[8]) : null,
            chapter: values[9] || null,
          };
        })
        .filter(mcq => mcq.question && mcq.subject);

      if (mcqs.length > 0) {
        importMCQsFromCSV.mutate(mcqs);
      } else {
        toast({
          title: "CSV Format Error",
          description: "CSV ফাইলে কোনো বৈধ MCQ পাওয়া যায়নি।",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader className="text-center py-6">
            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-2 bangla-text">
              🛠️ এডমিন প্যানেল - Admin Tools
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg bangla-text">
              (Supabase Connected)
            </p>
          </CardHeader>
        </Card>

        {/* Tab Navigation */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              <Button
                onClick={() => setActiveTab('mcq')}
                variant={activeTab === 'mcq' ? 'default' : 'outline'}
                className={`bangla-text ${activeTab === 'mcq' ? 'bg-blue-500 text-white' : ''}`}
              >
                <FileText className="w-4 h-4 mr-2" />
                MCQ
              </Button>
              <Button
                onClick={() => setActiveTab('board')}
                variant={activeTab === 'board' ? 'default' : 'outline'}
                className={`bangla-text ${activeTab === 'board' ? 'bg-blue-500 text-white' : ''}`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                বোর্ড প্রশ্ন
              </Button>
              <Button
                onClick={() => setActiveTab('nctb')}
                variant={activeTab === 'nctb' ? 'default' : 'outline'}
                className={`bangla-text ${activeTab === 'nctb' ? 'bg-blue-500 text-white' : ''}`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                NCTB বই
              </Button>
              <Button
                onClick={() => setActiveTab('notes')}
                variant={activeTab === 'notes' ? 'default' : 'outline'}
                className={`bangla-text ${activeTab === 'notes' ? 'bg-blue-500 text-white' : ''}`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                নোটস
              </Button>
              <Button
                onClick={() => setActiveTab('quotes')}
                variant={activeTab === 'quotes' ? 'default' : 'outline'}
                className={`bangla-text ${activeTab === 'quotes' ? 'bg-blue-500 text-white' : ''}`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                উক্তি
              </Button>
              <Button
                onClick={() => setActiveTab('api')}
                variant={activeTab === 'api' ? 'default' : 'outline'}
                className={`bangla-text ${activeTab === 'api' ? 'bg-blue-500 text-white' : ''}`}
              >
                <Key className="w-4 h-4 mr-2" />
                API Keys
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* MCQ Management */}
        {activeTab === 'mcq' && (
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white bangla-text">
                📝 MCQ Question Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* CSV Upload Section */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 bangla-text text-gray-800 dark:text-white">
                  CSV ফাইল আপলোড করুন
                </h3>
                <div className="space-y-3">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="bangla-text"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-300 bangla-text">
                    CSV Format: question,option_a,option_b,option_c,option_d,correct_answer,subject,board,year,chapter
                  </p>
                </div>
              </div>

              {/* Manual MCQ Form */}
              <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4 bangla-text text-gray-800 dark:text-white">
                  ম্যানুয়াল MCQ যোগ করুন
                </h3>
                <Form {...mcqForm}>
                  <form onSubmit={mcqForm.handleSubmit(onMCQSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={mcqForm.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="bangla-text">বিষয়</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bangla-text">
                                  <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subjects.map((subject) => (
                                  <SelectItem key={subject} value={subject} className="bangla-text">
                                    {subject}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mcqForm.control}
                        name="board"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="bangla-text">বোর্ড (ঐচ্ছিক)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bangla-text">
                                  <SelectValue placeholder="বোর্ড নির্বাচন করুন" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {boards.map((board) => (
                                  <SelectItem key={board} value={board} className="bangla-text">
                                    {board}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={mcqForm.control}
                      name="question"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">প্রশ্ন</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="প্রশ্ন লিখুন..." className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={mcqForm.control}
                        name="option_a"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="bangla-text">অপশন A</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="অপশন A" className="bangla-text" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mcqForm.control}
                        name="option_b"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="bangla-text">অপশন B</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="অপশন B" className="bangla-text" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mcqForm.control}
                        name="option_c"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="bangla-text">অপশন C</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="অপশন C" className="bangla-text" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mcqForm.control}
                        name="option_d"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="bangla-text">অপশন D</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="অপশন D" className="bangla-text" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={mcqForm.control}
                        name="correct_answer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="bangla-text">সঠিক উত্তর</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bangla-text">
                                  <SelectValue placeholder="সঠিক উত্তর নির্বাচন করুন" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                                <SelectItem value="D">D</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mcqForm.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="bangla-text">বছর (ঐচ্ছিক)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="২০২৩" className="bangla-text" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mcqForm.control}
                        name="chapter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="bangla-text">অধ্যায় (ঐচ্ছিক)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="অধ্যায়ের নাম" className="bangla-text" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white bangla-text"
                      disabled={addMCQQuestion.isPending}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {addMCQQuestion.isPending ? 'যোগ করা হচ্ছে...' : 'MCQ যোগ করুন'}
                    </Button>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Board Questions Management */}
        {activeTab === 'board' && (
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white bangla-text">
                📚 বোর্ড প্রশ্ন ম্যানেজমেন্ট
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...boardQuestionForm}>
                <form onSubmit={boardQuestionForm.handleSubmit(onBoardQuestionSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={boardQuestionForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">শিরোনাম</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="প্রশ্নের শিরোনাম" className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={boardQuestionForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">বিষয়</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bangla-text">
                                <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject} value={subject} className="bangla-text">
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={boardQuestionForm.control}
                      name="board"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">বোর্ড</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bangla-text">
                                <SelectValue placeholder="বোর্ড নির্বাচন করুন" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {boards.map((board) => (
                                <SelectItem key={board} value={board} className="bangla-text">
                                  {board}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={boardQuestionForm.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">বছর</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="২০২৩" className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={boardQuestionForm.control}
                      name="file_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">ফাইল URL (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://..." className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={boardQuestionForm.control}
                      name="file_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">ফাইল টাইপ (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="pdf, doc, jpg" className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white bangla-text"
                    disabled={addBoardQuestion.isPending}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {addBoardQuestion.isPending ? 'যোগ করা হচ্ছে...' : 'বোর্ড প্রশ্ন যোগ করুন'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* NCTB Books Management */}
        {activeTab === 'nctb' && (
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white bangla-text">
                📖 NCTB বই ম্যানেজমেন্ট
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...nctbBookForm}>
                <form onSubmit={nctbBookForm.handleSubmit(onNCTBBookSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={nctbBookForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">বইয়ের নাম</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="বইয়ের নাম" className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={nctbBookForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">বিষয়</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bangla-text">
                                <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject} value={subject} className="bangla-text">
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={nctbBookForm.control}
                      name="class_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">শ্রেণি</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bangla-text">
                                <SelectValue placeholder="শ্রেণি নির্বাচন করুন" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classLevels.map((level) => (
                                <SelectItem key={level} value={level} className="bangla-text">
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={nctbBookForm.control}
                      name="chapter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">অধ্যায় (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="অধ্যায়ের নাম" className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={nctbBookForm.control}
                      name="file_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">ফাইল URL (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://..." className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={nctbBookForm.control}
                      name="file_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">ফাইল টাইপ (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="pdf, doc" className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={nctbBookForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="bangla-text">বিষয়বস্তু (ঐচ্ছিক)</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="বইয়ের বিষয়বস্তু..." className="bangla-text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white bangla-text"
                    disabled={addNCTBBook.isPending}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {addNCTBBook.isPending ? 'যোগ করা হচ্ছে...' : 'NCTB বই যোগ করুন'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Notes Management */}
        {activeTab === 'notes' && (
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white bangla-text">
                📝 নোটস ম্যানেজমেন্ট
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...noteForm}>
                <form onSubmit={noteForm.handleSubmit(onNoteSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={noteForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">নোটের শিরোনাম</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="নোটের শিরোনাম" className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={noteForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">বিষয়</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bangla-text">
                                <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject} value={subject} className="bangla-text">
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={noteForm.control}
                      name="chapter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">অধ্যায় (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="অধ্যায়ের নাম" className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={noteForm.control}
                      name="file_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">ফাইল URL (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://..." className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={noteForm.control}
                      name="file_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">ফাইল টাইপ (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="pdf, doc, txt" className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={noteForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="bangla-text">নোটের বিষয়বস্তু (ঐচ্ছিক)</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="নোটের বিষয়বস্তু..." className="bangla-text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white bangla-text"
                    disabled={addNote.isPending}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {addNote.isPending ? 'যোগ করা হচ্ছে...' : 'নোট যোগ করুন'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Motivational Quotes Management */}
        {activeTab === 'quotes' && (
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white bangla-text">
                💬 উদ্দীপনামূলক উক্তি ম্যানেজমেন্ট
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...quoteForm}>
                <form onSubmit={quoteForm.handleSubmit(onQuoteSubmit)} className="space-y-4">
                  <FormField
                    control={quoteForm.control}
                    name="quote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="bangla-text">উদ্দীপনামূলক কথা</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="উদ্দীপনামূলক কথা লিখুন..." className="bangla-text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={quoteForm.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">লেখক (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="লেখকের নাম" className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={quoteForm.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">ট্যাগ (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="অনুপ্রেরণা, শিক্ষা, সফলতা" className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white bangla-text"
                    disabled={addMotivationalQuote.isPending}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {addMotivationalQuote.isPending ? 'যোগ করা হচ্ছে...' : 'উক্তি যোগ করুন'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* API Keys Management */}
        {activeTab === 'api' && (
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white bangla-text">
                🔑 API Keys ম্যানেজমেন্ট
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...apiKeyForm}>
                <form onSubmit={apiKeyForm.handleSubmit(onApiKeySubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={apiKeyForm.control}
                      name="provider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">API প্রদানকারী</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bangla-text">
                                <SelectValue placeholder="প্রদানকারী নির্বাচন করুন" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {apiProviders.map((provider) => (
                                <SelectItem key={provider} value={provider} className="bangla-text">
                                  {provider.toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={apiKeyForm.control}
                      name="api_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">API Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="API Key লিখুন" className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white bangla-text"
                    disabled={addApiKey.isPending}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    {addApiKey.isPending ? 'সংরক্ষণ করা হচ্ছে...' : 'API Key সংরক্ষণ করুন'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
