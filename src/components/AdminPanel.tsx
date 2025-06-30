
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { 
  BookOpen, 
  FileText, 
  MessageSquare, 
  PlusCircle, 
  Upload,
  Database,
  Key,
  Quote,
  Target,
  Brain,
  Lightbulb,
  Download,
  BookMarked,
  GraduationCap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Form schemas
const mcqFormSchema = z.object({
  question: z.string().min(1, 'প্রশ্ন আবশ্যক'),
  option_a: z.string().min(1, 'অপশন A আবশ্যক'),
  option_b: z.string().min(1, 'অপশন B আবশ্যক'),
  option_c: z.string().min(1, 'অপশন C আবশ্যক'),
  option_d: z.string().min(1, 'অপশন D আবশ্যক'),
  correct_answer: z.enum(['A', 'B', 'C', 'D'], { required_error: 'সঠিক উত্তর নির্বাচন করুন' }),
  subject: z.string().min(1, 'বিষয় নির্বাচন করুন'),
  board: z.string().optional(),
  year: z.string().optional(),
  chapter: z.string().optional(),
});

const boardQuestionFormSchema = z.object({
  title: z.string().min(1, 'শিরোনাম আবশ্যক'),
  subject: z.string().min(1, 'বিষয় নির্বাচন করুন'),
  board: z.string().min(1, 'বোর্ড নির্বাচন করুন'),
  year: z.string().min(1, 'বছর আবশ্যক'),
  file_type: z.string().optional(),
  file_url: z.string().optional(),
});

const nctbBookFormSchema = z.object({
  title: z.string().min(1, 'শিরোনাম আবশ্যক'),
  subject: z.string().min(1, 'বিষয় নির্বাচন করুন'),
  class_level: z.string().min(1, 'শ্রেণি নির্বাচন করুন'),
  chapter: z.string().optional(),
  content: z.string().optional(),
  file_url: z.string().optional(),
  file_type: z.string().optional(),
});

const noteFormSchema = z.object({
  title: z.string().min(1, 'শিরোনাম আবশ্যক'),
  subject: z.string().min(1, 'বিষয় নির্বাচন করুন'),
  chapter: z.string().optional(),
  content: z.string().optional(),
  file_url: z.string().optional(),
  file_type: z.string().optional(),
});

const quoteFormSchema = z.object({
  quote: z.string().min(1, 'উদ্দীপনামূলক উক্তি আবশ্যক'),
  author: z.string().optional(),
  tags: z.string().optional(),
});

const apiKeyFormSchema = z.object({
  provider: z.string().min(1, 'প্রদানকারী নির্বাচন করুন'),
  api_key: z.string().min(1, 'API Key আবশ্যক'),
});

const AdminPanel = () => {
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});
  
  // Initialize forms
  const mcqForm = useForm<z.infer<typeof mcqFormSchema>>({
    resolver: zodResolver(mcqFormSchema),
    defaultValues: {
      question: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      subject: '',
      board: '',
      year: '',
      chapter: '',
    },
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
    },
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
    },
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
    },
  });

  const quoteForm = useForm<z.infer<typeof quoteFormSchema>>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      quote: '',
      author: '',
      tags: '',
    },
  });

  const apiKeyForm = useForm<z.infer<typeof apiKeyFormSchema>>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      provider: '',
      api_key: '',
    },
  });

  // Use Supabase hook
  const {
    addMCQQuestion,
    addBoardQuestion,
    addNCTBBook,
    addNote,
    addMotivationalQuote,
    addApiKey,
    importMCQsFromCSV
  } = useSupabaseData();

  // All subjects including department-wise subjects
  const subjects = [
    'বাংলা', 'ইংরেজি', 'গণিত', 'বিজ্ঞান', 'পদার্থবিজ্ঞান', 'রসায়ন', 
    'জীববিজ্ঞান', 'ইতিহাস', 'ভূগোল', 'পৌরনীতি', 'অর্থনীতি', 
    'ইসলাম শিক্ষা', 'হিন্দু ধর্ম', 'বৌদ্ধ ধর্ম', 'খ্রিস্তান ধর্ম', 
    'কৃষিশিক্ষা', 'গার্হস্থ্য বিজ্ঞান', 'তথ্য ও যোগাযোগ প্রযুক্তি',
    'হিসাববিজ্ঞান', 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা', 'আরবি', 'ফিকহ',
    'আকাইদ ও মানতিক', 'হাদিস শরীফ', 'তাফসীর শরীফ', 'সাধারণ বিজ্ঞান',
    'আল কুরআন ও তাজবীদ', 'ইতিহাস ও সামাজিক বিজ্ঞান'
  ];

  // Boards including madrasah boards
  const boards = [
    'ঢাকা', 'চট্টগ্রাম', 'কুমিল্লা', 'যশোর', 'বরিশাল', 'সিলেট', 'দিনাজপুর', 'রাজশাহী', 'ময়মনসিংহ', 
    'ঢাকা মাদরাসা', 'চট্টগ্রাম মাদরাসা', 'রাজশাহী মাদরাসা', 'সিলেট মাদরাসা'
  ];

  // Class levels
  const classLevels = [
    '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম', 'একাদশ', 'দ্বাদশ', 'দাখিল', 'আলিম'
  ];

  // File handling
  const handleFileSelect = (formType: string, file: File) => {
    setSelectedFiles(prev => ({
      ...prev,
      [formType]: file
    }));
    
    toast({
      title: "ফাইল নির্বাচিত হয়েছে",
      description: `${file.name} নির্বাচিত হয়েছে। আপলোড করতে "আপলোড করুন" বাটনে ক্লিক করুন।`,
    });
  };

  const handleFileUpload = async (formType: string) => {
    const file = selectedFiles[formType];
    if (!file) {
      toast({
        title: "ফাইল নির্বাচন করুন",
        description: "আপলোড করার জন্য প্রথমে একটি ফাইল নির্বাচন করুন।",
        variant: "destructive"
      });
      return;
    }

    try {
      // Here you would typically upload to Supabase Storage
      // For now, we'll just show a success message
      toast({
        title: "ফাইল আপলোড সফল ✅",
        description: `${file.name} সফলভাবে আপলোড হয়েছে।`,
      });
      
      // Clear the selected file after upload
      setSelectedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[formType];
        return newFiles;
      });
    } catch (error) {
      toast({
        title: "আপলোড ব্যর্থ ❌",
        description: "ফাইল আপলোড করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    }
  };

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

  // CSV Import Handler
  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        
        const mcqs = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const mcq: any = {};
          headers.forEach((header, index) => {
            mcq[header] = values[index] || '';
          });
          
          return {
            question: mcq.question || '',
            option_a: mcq.option_a || '',
            option_b: mcq.option_b || '',
            option_c: mcq.option_c || '',
            option_d: mcq.option_d || '',
            correct_answer: mcq.correct_answer || 'A',
            subject: mcq.subject || '',
            board: mcq.board || null,
            year: mcq.year ? parseInt(mcq.year) : null,
            chapter: mcq.chapter || null,
          };
        }).filter(mcq => mcq.question && mcq.subject);

        if (mcqs.length > 0) {
          importMCQsFromCSV.mutate(mcqs);
        } else {
          toast({
            title: "CSV ফাইল সমস্যা ❌",
            description: "CSV ফাইলে কোনো বৈধ MCQ পাওয়া যায়নি।",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "CSV পার্স এরর ❌",
          description: "CSV ফাইল পড়তে সমস্যা হয়েছে।",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader className="text-center py-6">
            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2 bangla-text">
              ⚙️ অ্যাডমিন প্যানেল
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg bangla-text">
              MCQ, বোর্ড প্রশ্ন, NCTB বই এবং নোট পরিচালনা করুন
            </p>
          </CardHeader>
        </Card>

        <Tabs defaultValue="mcq" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
            <TabsTrigger value="mcq" className="flex items-center gap-2 bangla-text">
              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              MCQ
            </TabsTrigger>
            <TabsTrigger value="board" className="flex items-center gap-2 bangla-text">
              <GraduationCap className="w-4 h-4 text-green-600 dark:text-green-400" />
              বোর্ড প্রশ্ন
            </TabsTrigger>
            <TabsTrigger value="nctb" className="flex items-center gap-2 bangla-text">
              <BookMarked className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              NCTB বই
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2 bangla-text">
              <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              নোট
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-2 bangla-text">
              <Quote className="w-4 h-4 text-red-600 dark:text-red-400" />
              উক্তি
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2 bangla-text">
              <Key className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              API Key
            </TabsTrigger>
          </TabsList>

          {/* MCQ Tab */}
          <TabsContent value="mcq">
            <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 bangla-text">
                  <Target className="w-5 h-5 text-blue-600" />
                  MCQ যুক্ত করুন
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* CSV Import */}
                <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg p-6 bg-blue-50/50 dark:bg-blue-900/20">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2 bangla-text">
                      CSV ফাইল আপলোড করুন
                    </h3>
                    <p className="text-blue-600 dark:text-blue-300 mb-4 bangla-text">
                      একসাথে অনেক MCQ আপলোড করতে CSV ফাইল ব্যবহার করুন
                    </p>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVImport}
                      className="max-w-xs mx-auto"
                    />
                    <p className="text-sm text-blue-500 dark:text-blue-400 mt-2 bangla-text">
                      CSV Format: question,option_a,option_b,option_c,option_d,correct_answer,subject,board,year,chapter
                    </p>
                  </div>
                </div>

                {/* Manual MCQ Form */}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={mcqForm.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="bangla-text">বছর (ঐচ্ছিক)</FormLabel>
                            <FormControl>
                              <Input placeholder="২০২৪" {...field} className="bangla-text" />
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
                              <Input placeholder="অধ্যায়ের নাম" {...field} className="bangla-text" />
                            </FormControl>
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
                            <Textarea 
                              placeholder="প্রশ্নটি লিখুন..." 
                              className="resize-none bangla-text" 
                              rows={3}
                              {...field} 
                            />
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
                              <Input placeholder="অপশন A" {...field} className="bangla-text" />
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
                              <Input placeholder="অপশন B" {...field} className="bangla-text" />
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
                              <Input placeholder="অপশন C" {...field} className="bangla-text" />
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
                              <Input placeholder="অপশন D" {...field} className="bangla-text" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={mcqForm.control}
                      name="correct_answer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">সঠিক উত্তর</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bangla-text max-w-xs">
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

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white bangla-text"
                      disabled={addMCQQuestion.isPending}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      {addMCQQuestion.isPending ? 'যুক্ত করা হচ্ছে...' : 'MCQ যুক্ত করুন'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Board Questions Tab */}
          <TabsContent value="board">
            <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 bangla-text">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                  বোর্ড প্রশ্ন যুক্ত করুন
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
                              <Input placeholder="প্রশ্নের শিরোনাম" {...field} className="bangla-text" />
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              <Input placeholder="২০২৪" {...field} className="bangla-text" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileSelect('board', file);
                            }
                          }}
                          className="max-w-md"
                        />
                        {selectedFiles['board'] && (
                          <Button
                            type="button"
                            onClick={() => handleFileUpload('board')}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white bangla-text"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            আপলোড করুন
                          </Button>
                        )}
                      </div>
                      {selectedFiles['board'] && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 bangla-text">
                          নির্বাচিত ফাইল: {selectedFiles['board'].name}
                        </p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white bangla-text"
                      disabled={addBoardQuestion.isPending}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      {addBoardQuestion.isPending ? 'যুক্ত করা হচ্ছে...' : 'বোর্ড প্রশ্ন যুক্ত করুন'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NCTB Books Tab */}
          <TabsContent value="nctb">
            <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 bangla-text">
                  <BookMarked className="w-5 h-5 text-purple-600" />
                  NCTB বই যুক্ত করুন
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
                              <Input placeholder="বইয়ের নাম" {...field} className="bangla-text" />
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                {classLevels.map((classLevel, index) => (
                                  <SelectItem key={classLevel} value={(index + 6).toString()} className="bangla-text">
                                    {classLevel}
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
                              <Input placeholder="অধ্যায়ের নাম" {...field} className="bangla-text" />
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
                            <Textarea 
                              placeholder="বইয়ের বিষয়বস্তু..." 
                              className="resize-none bangla-text" 
                              rows={4}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileSelect('nctb', file);
                            }
                          }}
                          className="max-w-md"
                        />
                        {selectedFiles['nctb'] && (
                          <Button
                            type="button"
                            onClick={() => handleFileUpload('nctb')}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white bangla-text"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            আপলোড করুন
                          </Button>
                        )}
                      </div>
                      {selectedFiles['nctb'] && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 bangla-text">
                          নির্বাচিত ফাইল: {selectedFiles['nctb'].name}
                        </p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white bangla-text"
                      disabled={addNCTBBook.isPending}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      {addNCTBBook.isPending ? 'যুক্ত করা হচ্ছে...' : 'NCTB বই যুক্ত করুন'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 bangla-text">
                  <FileText className="w-5 h-5 text-orange-600" />
                  নোট যুক্ত করুন
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
                              <Input placeholder="নোটের শিরোনাম" {...field} className="bangla-text" />
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
                    </div>

                    <FormField
                      control={noteForm.control}
                      name="chapter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">অধ্যায় (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Input placeholder="অধ্যায়ের নাম" {...field} className="bangla-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={noteForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">নোট বিষয়বস্তু (ঐচ্ছিক)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="নোটের বিষয়বস্তু..." 
                              className="resize-none bangla-text" 
                              rows={6}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileSelect('notes', file);
                            }
                          }}
                          className="max-w-md"
                        />
                        {selectedFiles['notes'] && (
                          <Button
                            type="button"
                            onClick={() => handleFileUpload('notes')}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white bangla-text"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            আপলোড করুন
                          </Button>
                        )}
                      </div>
                      {selectedFiles['notes'] && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 bangla-text">
                          নির্বাচিত ফাইল: {selectedFiles['notes'].name}
                        </p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white bangla-text"
                      disabled={addNote.isPending}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      {addNote.isPending ? 'যুক্ত করা হচ্ছে...' : 'নোট যুক্ত করুন'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes">
            <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 bangla-text">
                  <Quote className="w-5 h-5 text-red-600" />
                  উদ্দীপনামূলক উক্তি যুক্ত করুন
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
                          <FormLabel className="bangla-text">উক্তি</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="উদ্দীপনামূলক উক্তি লিখুন..." 
                              className="resize-none bangla-text" 
                              rows={4}
                              {...field} 
                            />
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
                              <Input placeholder="লেখকের নাম" {...field} className="bangla-text" />
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
                              <Input placeholder="অনুপ্রেরণা, সফলতা, ইত্যাদি" {...field} className="bangla-text" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white bangla-text"
                      disabled={addMotivationalQuote.isPending}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      {addMotivationalQuote.isPending ? 'যুক্ত করা হচ্ছে...' : 'উক্তি যুক্ত করুন'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api">
            <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 bangla-text">
                  <Key className="w-5 h-5 text-gray-600" />
                  API Key যুক্ত করুন
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...apiKeyForm}>
                  <form onSubmit={apiKeyForm.handleSubmit(onApiKeySubmit)} className="space-y-4">
                    <FormField
                      control={apiKeyForm.control}
                      name="provider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bangla-text">প্রদানকারী</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bangla-text">
                                <SelectValue placeholder="API প্রদানকারী নির্বাচন করুন" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="openai">OpenAI</SelectItem>
                              <SelectItem value="anthropic">Anthropic</SelectItem>
                              <SelectItem value="google">Google (Gemini)</SelectItem>
                              <SelectItem value="other">অন্যান্য</SelectItem>
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
                            <Input 
                              type="password" 
                              placeholder="API Key লিখুন..." 
                              {...field} 
                              className="bangla-text font-mono" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white bangla-text"
                      disabled={addApiKey.isPending}
                    >
                      <Key className="w-4 h-4 mr-2" />
                      {addApiKey.isPending ? 'সংরক্ষণ করা হচ্ছে...' : 'API Key সংরক্ষণ করুন'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
