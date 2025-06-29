import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, FileQuestion, Upload, FileText, Search, Lock, Plus, Trash2, Edit, Key, MessageSquare, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [textbookForm, setTextbookForm] = useState({
    subject: '',
    class_level: '',
    chapter: '',
    content: '',
    title: '',
    file_url: '',
    file_type: 'text',
    seo_title: '',
    seo_description: '',
    seo_tags: ''
  });
  const [mcqForm, setMcqForm] = useState({
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: '',
    year: '',
    subject: '',
    chapter: '',
    board: ''
  });
  const [fileUploadForm, setFileUploadForm] = useState({
    type: 'notes',
    subject: '',
    chapter: '',
    year: '',
    board: '',
    fileUrl: '',
    title: '',
    seoTitle: '',
    seoDescription: '',
    seoTags: ''
  });
  const [motivationalQuoteForm, setMotivationalQuoteForm] = useState({
    quote: '',
    author: '',
    tags: ''
  });
  const [apiKeyForm, setApiKeyForm] = useState({
    provider: 'openai' as 'openai' | 'claude' | 'gemini',
    api_key: ''
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessingCSV, setIsProcessingCSV] = useState(false);
  
  // Add practice game form state
  const [practiceGameForm, setPracticeGameForm] = useState({
    title: '',
    description: '',
    subject: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    questions: [] as Array<{
      question: string;
      options: string[];
      correct_answer: number;
    }>
  });

  const { toast } = useToast();
  
  const {
    addMCQQuestion,
    addBoardQuestion,
    addNCTBBook,
    addNote,
    addMotivationalQuote,
    addApiKey
  } = useSupabaseData();

  const handleLogin = () => {
    if (loginForm.username === 'Ashraf' && loginForm.password === 'Ashraf') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      toast({
        title: "সফল লগইন ✅",
        description: "এডমিন প্যানেলে স্বাগতম",
      });
    } else {
      toast({
        title: "লগইন ব্যর্থ ❌",
        description: "ভুল ইউজারনেম বা পাসওয়ার্ড",
        variant: "destructive"
      });
    }
  };

  const handleTextbookUpload = () => {
    if (textbookForm.subject && textbookForm.class_level && textbookForm.title) {
      if (textbookForm.file_type === 'text' && !textbookForm.content) {
        toast({
          title: "অসম্পূর্ণ তথ্য ❌",
          description: "টেক্সট কন্টেন্ট প্রয়োজন",
          variant: "destructive"
        });
        return;
      }
      
      if (textbookForm.file_type === 'pdf' && !textbookForm.file_url) {
        toast({
          title: "অসম্পূর্ণ তথ্য ❌",
          description: "PDF ফাইল URL প্রয়োজন",
          variant: "destructive"
        });
        return;
      }

      addNCTBBook.mutate({
        title: textbookForm.title,
        subject: textbookForm.subject,
        class_level: parseInt(textbookForm.class_level),
        chapter: textbookForm.chapter || null,
        content: textbookForm.file_type === 'text' ? textbookForm.content : null,
        file_url: textbookForm.file_type === 'pdf' ? textbookForm.file_url : null,
        file_type: textbookForm.file_type,
        seo_title: textbookForm.seo_title || null,
        seo_description: textbookForm.seo_description || null,
        seo_tags: textbookForm.seo_tags || null
      });
      
      setTextbookForm({
        subject: '', class_level: '', chapter: '', content: '', title: '', file_url: '', file_type: 'text',
        seo_title: '', seo_description: '', seo_tags: ''
      });
    } else {
      toast({
        title: "অসম্পূর্ণ তথ্য ❌",
        description: "দয়া করে সব প্রয়োজনীয় তথ্য দিন",
        variant: "destructive"
      });
    }
  };

  const handleMCQAdd = () => {
    if (mcqForm.question && mcqForm.correct_answer && mcqForm.subject && 
        mcqForm.option_a && mcqForm.option_b && mcqForm.option_c && mcqForm.option_d) {
      
      addMCQQuestion.mutate({
        question: mcqForm.question,
        option_a: mcqForm.option_a,
        option_b: mcqForm.option_b,
        option_c: mcqForm.option_c,
        option_d: mcqForm.option_d,
        correct_answer: mcqForm.correct_answer as 'A' | 'B' | 'C' | 'D',
        subject: mcqForm.subject,
        year: mcqForm.year ? parseInt(mcqForm.year) : null,
        board: mcqForm.board || null,
        chapter: mcqForm.chapter || null
      });
      
      setMcqForm({
        question: '', option_a: '', option_b: '', option_c: '', option_d: '',
        correct_answer: '', year: '', subject: '', chapter: '', board: ''
      });
    } else {
      toast({
        title: "অসম্পূর্ণ তথ্য ❌",
        description: "দয়া করে সব প্রয়োজনীয় তথ্য দিন",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = () => {
    if (fileUploadForm.subject && fileUploadForm.type && fileUploadForm.title) {
      if (fileUploadForm.type === 'notes') {
        addNote.mutate({
          title: fileUploadForm.title,
          subject: fileUploadForm.subject,
          chapter: fileUploadForm.chapter || null,
          file_url: fileUploadForm.fileUrl || null,
          file_type: fileUploadForm.fileUrl ? 'pdf' : null,
          seo_title: fileUploadForm.seoTitle || null,
          seo_description: fileUploadForm.seoDescription || null,
          seo_tags: fileUploadForm.seoTags || null
        });
      } else if (fileUploadForm.type === 'questions') {
        addBoardQuestion.mutate({
          title: fileUploadForm.title,
          subject: fileUploadForm.subject,
          year: parseInt(fileUploadForm.year),
          board: fileUploadForm.board,
          file_url: fileUploadForm.fileUrl || null,
          file_type: fileUploadForm.fileUrl ? 'pdf' : null,
          seo_title: fileUploadForm.seoTitle || null,
          seo_description: fileUploadForm.seoDescription || null,
          seo_tags: fileUploadForm.seoTags || null
        });
      }
      
      setFileUploadForm({
        type: 'notes', subject: '', chapter: '', year: '', board: '',
        fileUrl: '', title: '', seoTitle: '', seoDescription: '', seoTags: ''
      });
    } else {
      toast({
        title: "অসম্পূর্ণ তথ্য ❌",
        description: "দয়া করে সব প্রয়োজনীয় তথ্য দিন",
        variant: "destructive"
      });
    }
  };

  const handleQuoteAdd = () => {
    if (motivationalQuoteForm.quote) {
      addMotivationalQuote.mutate({
        quote: motivationalQuoteForm.quote,
        author: motivationalQuoteForm.author || null,
        tags: motivationalQuoteForm.tags || null,
        is_active: true
      });
      
      setMotivationalQuoteForm({ quote: '', author: '', tags: '' });
    } else {
      toast({
        title: "অসম্পূর্ণ তথ্য ❌",
        description: "দয়া করে উক্তি লিখুন",
        variant: "destructive"
      });
    }
  };

  const handleApiKeyAdd = () => {
    if (apiKeyForm.api_key) {
      addApiKey.mutate({
        provider: apiKeyForm.provider,
        api_key: apiKeyForm.api_key,
        is_active: true
      });
      
      setApiKeyForm({ provider: 'openai', api_key: '' });
    } else {
      toast({
        title: "অসম্পূর্ণ তথ্য ❌",
        description: "দয়া করে API Key দিন",
        variant: "destructive"
      });
    }
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      toast({
        title: "CSV ফাইল নির্বাচিত ✅",
        description: `${file.name} আপলোডের জন্য প্রস্তুত`,
      });
    } else {
      toast({
        title: "ভুল ফাইল ফরম্যাট ❌",
        description: "দয়া করে একটি CSV ফাইল নির্বাচন করুন",
        variant: "destructive"
      });
    }
  };

  const processCSVFile = async () => {
    if (!csvFile) {
      toast({
        title: "কোন ফাইল নেই ❌",
        description: "প্রথমে একটি CSV ফাইল নির্বাচন করুন",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingCSV(true);
    
    try {
      const text = await csvFile.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      let successCount = 0;
      let errorCount = 0;

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(v => v.trim());
        
        try {
          const mcqData: any = {};
          
          headers.forEach((header, index) => {
            switch(header) {
              case 'question':
                mcqData.question = values[index];
                break;
              case 'option_a':
              case 'option a':
                mcqData.option_a = values[index];
                break;
              case 'option_b':
              case 'option b':
                mcqData.option_b = values[index];
                break;
              case 'option_c':
              case 'option c':
                mcqData.option_c = values[index];
                break;
              case 'option_d':
              case 'option d':
                mcqData.option_d = values[index];
                break;
              case 'correct_answer':
              case 'answer':
                mcqData.correct_answer = values[index].toUpperCase();
                break;
              case 'subject':
                mcqData.subject = values[index];
                break;
              case 'year':
                mcqData.year = values[index] ? parseInt(values[index]) : null;
                break;
              case 'board':
                mcqData.board = values[index] || null;
                break;
              case 'chapter':
                mcqData.chapter = values[index] || null;
                break;
            }
          });

          if (mcqData.question && mcqData.option_a && mcqData.option_b && 
              mcqData.option_c && mcqData.option_d && mcqData.correct_answer && 
              mcqData.subject) {
            
            await new Promise((resolve, reject) => {
              addMCQQuestion.mutate(mcqData, {
                onSuccess: resolve,
                onError: reject
              });
            });
            
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error('Error processing row:', error);
          errorCount++;
        }
      }

      toast({
        title: "CSV প্রসেসিং সম্পন্ন ✅",
        description: `${successCount}টি MCQ সফলভাবে যুক্ত হয়েছে, ${errorCount}টি ত্রুটি`,
      });
      
      setCsvFile(null);
      // Reset file input
      const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('CSV processing error:', error);
      toast({
        title: "CSV প্রসেসিং ত্রুটি ❌",
        description: "ফাইল প্রসেস করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    } finally {
      setIsProcessingCSV(false);
    }
  };

  React.useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-gray-700 dark:text-white">
              🔐 Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              className="bg-white/50 dark:bg-gray-700/50 border-gray-300/50"
            />
            <Input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="bg-white/50 dark:bg-gray-700/50 border-gray-300/50"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-gray-700 dark:text-white">
              🛠️ এডমিন প্যানেল - Admin Tools (Supabase Connected)
            </CardTitle>
          </CardHeader>
        </Card>

        <Tabs defaultValue="textbooks" className="space-y-4">
          <TabsList className="grid w-full grid-cols-9 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
            <TabsTrigger value="textbooks" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">📚 Books</span>
            </TabsTrigger>
            <TabsTrigger value="mcqs" className="flex items-center space-x-2">
              <FileQuestion className="w-4 h-4" />
              <span className="hidden sm:inline">❓ MCQs</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">📄 Files</span>
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">💬 Quotes</span>
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">📥 CSV</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center space-x-2">
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">🔑 API</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">🎮 Games</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">🔍 SEO</span>
            </TabsTrigger>
            <TabsTrigger value="logout" onClick={() => {
              setIsAuthenticated(false);
              localStorage.removeItem('adminAuth');
            }}>
              🔐 Logout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="textbooks">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 dark:text-white">
                  📚 NCTB Textbook Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Title (e.g., English for Today)"
                    value={textbookForm.title}
                    onChange={(e) => setTextbookForm({ ...textbookForm, title: e.target.value })}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                  <Input
                    placeholder="Subject (e.g., English)"
                    value={textbookForm.subject}
                    onChange={(e) => setTextbookForm({ ...textbookForm, subject: e.target.value })}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                  <Input
                    placeholder="Class (e.g., 9)"
                    value={textbookForm.class_level}
                    onChange={(e) => setTextbookForm({ ...textbookForm, class_level: e.target.value })}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                  <Select value={textbookForm.file_type} onValueChange={(value) => setTextbookForm({ ...textbookForm, file_type: value })}>
                    <SelectTrigger className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50">
                      <SelectValue placeholder="Content Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">📝 Text Content</SelectItem>
                      <SelectItem value="pdf">📄 PDF File</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  placeholder="Chapter (optional)"
                  value={textbookForm.chapter}
                  onChange={(e) => setTextbookForm({ ...textbookForm, chapter: e.target.value })}
                  className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                />
                
                {textbookForm.file_type === 'text' ? (
                  <Textarea
                    placeholder="Content (multiline text)"
                    value={textbookForm.content}
                    onChange={(e) => setTextbookForm({ ...textbookForm, content: e.target.value })}
                    rows={6}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                ) : (
                  <Input
                    placeholder="PDF File URL"
                    value={textbookForm.file_url}
                    onChange={(e) => setTextbookForm({ ...textbookForm, file_url: e.target.value })}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                )}
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 dark:text-white">SEO Information (Optional)</h4>
                  <Input
                    placeholder="SEO Title"
                    value={textbookForm.seo_title}
                    onChange={(e) => setTextbookForm({ ...textbookForm, seo_title: e.target.value })}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                  <Textarea
                    placeholder="SEO Description"
                    value={textbookForm.seo_description}
                    onChange={(e) => setTextbookForm({ ...textbookForm, seo_description: e.target.value })}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                  <Input
                    placeholder="SEO Tags (comma separated)"
                    value={textbookForm.seo_tags}
                    onChange={(e) => setTextbookForm({ ...textbookForm, seo_tags: e.target.value })}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                </div>
                <Button
                  onClick={handleTextbookUpload}
                  disabled={addNCTBBook.isPending}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {addNCTBBook.isPending ? 'Uploading...' : 'Upload Textbook'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mcqs">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 dark:text-white">
                  ❓ MCQ Question Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Question"
                  value={mcqForm.question}
                  onChange={(e) => setMcqForm({ ...mcqForm, question: e.target.value })}
                  className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Option A"
                    value={mcqForm.option_a}
                    onChange={(e) => setMcqForm({ ...mcqForm, option_a: e.target.value })}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                  <Input
                    placeholder="Option B"
                    value={mcqForm.option_b}
                    onChange={(e) => setMcqForm({ ...mcqForm, option_b: e.target.value })}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                  <Input
                    placeholder="Option C"
                    value={mcqForm.option_c}
                    onChange={(e) => setMcqForm({ ...mcqForm, option_c: e.target.value })}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                  <Input
                    placeholder="Option D"
                    value={mcqForm.option_d}
                    onChange={(e) => setMcqForm({ ...mcqForm, option_d: e.target.value })}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Select value={mcqForm.correct_answer} onValueChange={(value) => setMcqForm({ ...mcqForm, correct_answer: value })}>
                    <SelectTrigger className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50">
                      <SelectValue placeholder="Correct Answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Year"
                    value={mcqForm.year}
                    onChange={(e) => setMcqForm({ ...mcqForm, year: e.target.value })}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                  <Input
                    placeholder="Subject"
                    value={mcqForm.subject}
                    onChange={(e) => setMcqForm({ ...mcqForm, subject: e.target.value })}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                  <Input
                    placeholder="Chapter (optional)"
                    value={mcqForm.chapter}
                    onChange={(e) => setMcqForm({ ...mcqForm, chapter: e.target.value })}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                  <Input
                    placeholder="Board (optional)"
                    value={mcqForm.board}
                    onChange={(e) => setMcqForm({ ...mcqForm, board: e.target.value })}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                </div>
                <Button
                  onClick={handleMCQAdd}
                  disabled={addMCQQuestion.isPending}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {addMCQQuestion.isPending ? 'Adding...' : 'Add MCQ'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 dark:text-white">
                  📄 File Upload Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={fileUploadForm.type} onValueChange={(value) => setFileUploadForm({...fileUploadForm, type: value})}>
                    <SelectTrigger className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notes">📝 Notes</SelectItem>
                      <SelectItem value="questions">❓ Question Papers</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Title"
                    value={fileUploadForm.title}
                    onChange={(e) => setFileUploadForm({...fileUploadForm, title: e.target.value})}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                </div>
                
                <Input
                  placeholder="Subject"
                  value={fileUploadForm.subject}
                  onChange={(e) => setFileUploadForm({...fileUploadForm, subject: e.target.value})}
                  className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                />
                
                {fileUploadForm.type === 'notes' && (
                  <Input
                    placeholder="Chapter (optional)"
                    value={fileUploadForm.chapter}
                    onChange={(e) => setFileUploadForm({...fileUploadForm, chapter: e.target.value})}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                )}
                
                {fileUploadForm.type === 'questions' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Year"
                      value={fileUploadForm.year}
                      onChange={(e) => setFileUploadForm({...fileUploadForm, year: e.target.value})}
                      className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                    />
                    <Input
                      placeholder="Board"
                      value={fileUploadForm.board}
                      onChange={(e) => setFileUploadForm({...fileUploadForm, board: e.target.value})}
                      className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                    />
                  </div>
                )}

                <Input
                  placeholder="File URL (PDF/Image link)"
                  value={fileUploadForm.fileUrl}
                  onChange={(e) => setFileUploadForm({...fileUploadForm, fileUrl: e.target.value})}
                  className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                />

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 dark:text-white">SEO Information (Optional)</h4>
                  <Input
                    placeholder="SEO Title"
                    value={fileUploadForm.seoTitle}
                    onChange={(e) => setFileUploadForm({...fileUploadForm, seoTitle: e.target.value})}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                  <Textarea
                    placeholder="SEO Description"
                    value={fileUploadForm.seoDescription}
                    onChange={(e) => setFileUploadForm({...fileUploadForm, seoDescription: e.target.value})}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                  <Input
                    placeholder="SEO Tags (comma separated)"
                    value={fileUploadForm.seoTags}
                    onChange={(e) => setFileUploadForm({...fileUploadForm, seoTags: e.target.value})}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                </div>

                <Button
                  onClick={handleFileUpload}
                  disabled={addNote.isPending || addBoardQuestion.isPending}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {(addNote.isPending || addBoardQuestion.isPending) ? 'Uploading...' : 'Upload File'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 dark:text-white">
                  💬 Motivational Quotes Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add motivational quote in Bangla"
                  value={motivationalQuoteForm.quote}
                  onChange={(e) => setMotivationalQuoteForm({...motivationalQuoteForm, quote: e.target.value})}
                  rows={3}
                  className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Author (optional)"
                    value={motivationalQuoteForm.author}
                    onChange={(e) => setMotivationalQuoteForm({...motivationalQuoteForm, author: e.target.value})}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                  <Input
                    placeholder="Tags (comma separated)"
                    value={motivationalQuoteForm.tags}
                    onChange={(e) => setMotivationalQuoteForm({...motivationalQuoteForm, tags: e.target.value})}
                    className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                  />
                </div>
                <Button
                  onClick={handleQuoteAdd}
                  disabled={addMotivationalQuote.isPending}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {addMotivationalQuote.isPending ? 'Adding...' : 'Add Quote'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 dark:text-white">
                  🔑 AI API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={apiKeyForm.provider} onValueChange={(value) => setApiKeyForm({...apiKeyForm, provider: value as any})}>
                  <SelectTrigger className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50">
                    <SelectValue placeholder="Select AI Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">🤖 OpenAI (ChatGPT)</SelectItem>
                    <SelectItem value="claude">🧠 Anthropic (Claude)</SelectItem>
                    <SelectItem value="gemini">✨ Google (Gemini)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="password"
                  placeholder="API Key"
                  value={apiKeyForm.api_key}
                  onChange={(e) => setApiKeyForm({...apiKeyForm, api_key: e.target.value})}
                  className="bg-white/70 dark:bg-gray-700/70 border-gray-300/50"
                />
                <Button
                  onClick={handleApiKeyAdd}
                  disabled={addApiKey.isPending}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Key className="w-4 h-4 mr-2" />
                  {addApiKey.isPending ? 'Saving...' : 'Save API Key'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="csv">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 dark:text-white">
                  📥 CSV / Google Sheet Import
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 text-center bg-blue-50/50 dark:bg-blue-900/20">
                  <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    MCQ ডেটা CSV ফাইল আপলোড করুন
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Required columns: question, option_a, option_b, option_c, option_d, correct_answer, subject
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Optional columns: year, board, chapter
                  </p>
                  <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => document.getElementById('csv-upload')?.click()}
                    variant="outline"
                    className="mb-4"
                  >
                    📄 Select CSV File
                  </Button>
                  {csvFile && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-green-700 dark:text-green-300">
                        Selected: {csvFile.name}
                      </p>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={processCSVFile}
                  disabled={!csvFile || isProcessingCSV}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  {isProcessingCSV ? 'Processing...' : 'Import MCQ Data'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="games">
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 dark:text-white">
                  🎮 প্রাকটিস গেম ম্যানেজমেন্ট
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Game Title"
                    value={practiceGameForm.title}
                    onChange={(e) => setPracticeGameForm({ ...practiceGameForm, title: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-gray-300/50"
                  />
                  <Select value={practiceGameForm.difficulty} onValueChange={(value) => setPracticeGameForm({ ...practiceGameForm, difficulty: value as any })}>
                    <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-gray-300/50">
                      <SelectValue placeholder="Difficulty Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">🟢 Easy</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="hard">🔴 Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Input
                  placeholder="Subject"
                  value={practiceGameForm.subject}
                  onChange={(e) => setPracticeGameForm({ ...practiceGameForm, subject: e.target.value })}
                  className="bg-white/50 dark:bg-gray-700/50 border-gray-300/50"
                />
                
                <Textarea
                  placeholder="Game Description"
                  value={practiceGameForm.description}
                  onChange={(e) => setPracticeGameForm({ ...practiceGameForm, description: e.target.value })}
                  className="bg-white/50 dark:bg-gray-700/50 border-gray-300/50"
                />

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Game Questions:</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                    প্রাকটিস গেমের প্রশ্নগুলো MCQ সেকশন থেকে automatically নেওয়া হবে
                  </p>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Create Practice Game
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 dark:text-white">
                  🔍 SEO Tags & Search Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">SEO কিভাবে কাজ করে:</h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• SEO Title: Google search এ দেখানো শিরোনাম</li>
                    <li>• SEO Description: Search results এ দেখানো বিবরণ</li>
                    <li>• SEO Tags: Search keywords যা আপনার content খুঁজে পেতে সাহায্য করে</li>
                    <li>• এই তথ্যগুলো যখন আপনি content যুক্ত করবেন তখন দিতে পারেন</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Chatbot Integration:</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    আপনার CSV থেকে upload করা MCQ এবং অন্যান্য content chatbot এ automatically available হবে। 
                    Students যখন প্রশ্ন করবে, chatbot এই database থেকে উত্তর দিতে পারবে।
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
