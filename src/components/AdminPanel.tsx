import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, FileQuestion, Upload, FileText, Search, Lock, Plus, Trash2, Edit, Key, MessageSquare } from 'lucide-react';
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
    type: 'notes', // 'notes' or 'questions'
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
    if (textbookForm.subject && textbookForm.class_level && textbookForm.title && textbookForm.content) {
      addNCTBBook.mutate({
        title: textbookForm.title,
        subject: textbookForm.subject,
        class_level: parseInt(textbookForm.class_level),
        chapter: textbookForm.chapter || null,
        content: textbookForm.content,
        file_type: 'text',
        seo_title: textbookForm.seo_title || null,
        seo_description: textbookForm.seo_description || null,
        seo_tags: textbookForm.seo_tags || null
      });
      
      setTextbookForm({
        subject: '', class_level: '', chapter: '', content: '', title: '',
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

  React.useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-gray-800 dark:text-white">
              🔐 Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              className="bg-white/50 dark:bg-gray-700/50 border-white/20"
            />
            <Input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="bg-white/50 dark:bg-gray-700/50 border-white/20"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-gray-800 dark:text-white">
              🛠️ এডমিন প্যানেল - Admin Tools (Supabase Connected)
            </CardTitle>
          </CardHeader>
        </Card>

        <Tabs defaultValue="textbooks" className="space-y-4">
          <TabsList className="grid w-full grid-cols-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md">
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
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 dark:text-white">
                  📚 NCTB Textbook Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Title (e.g., English for Today)"
                    value={textbookForm.title}
                    onChange={(e) => setTextbookForm({ ...textbookForm, title: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="Subject (e.g., English)"
                    value={textbookForm.subject}
                    onChange={(e) => setTextbookForm({ ...textbookForm, subject: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="Class (e.g., 9)"
                    value={textbookForm.class_level}
                    onChange={(e) => setTextbookForm({ ...textbookForm, class_level: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                </div>
                <Input
                  placeholder="Chapter (optional)"
                  value={textbookForm.chapter}
                  onChange={(e) => setTextbookForm({ ...textbookForm, chapter: e.target.value })}
                  className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                />
                <Textarea
                  placeholder="Content (multiline text)"
                  value={textbookForm.content}
                  onChange={(e) => setTextbookForm({ ...textbookForm, content: e.target.value })}
                  rows={6}
                  className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                />
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800 dark:text-white">SEO Information (Optional)</h4>
                  <Input
                    placeholder="SEO Title"
                    value={textbookForm.seo_title}
                    onChange={(e) => setTextbookForm({ ...textbookForm, seo_title: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Textarea
                    placeholder="SEO Description"
                    value={textbookForm.seo_description}
                    onChange={(e) => setTextbookForm({ ...textbookForm, seo_description: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="SEO Tags (comma separated)"
                    value={textbookForm.seo_tags}
                    onChange={(e) => setTextbookForm({ ...textbookForm, seo_tags: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                </div>
                <Button
                  onClick={handleTextbookUpload}
                  disabled={addNCTBBook.isPending}
                  className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {addNCTBBook.isPending ? 'Uploading...' : 'Upload Textbook'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mcqs">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 dark:text-white">
                  ❓ MCQ Question Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Question"
                  value={mcqForm.question}
                  onChange={(e) => setMcqForm({ ...mcqForm, question: e.target.value })}
                  className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Option A"
                    value={mcqForm.option_a}
                    onChange={(e) => setMcqForm({ ...mcqForm, option_a: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="Option B"
                    value={mcqForm.option_b}
                    onChange={(e) => setMcqForm({ ...mcqForm, option_b: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="Option C"
                    value={mcqForm.option_c}
                    onChange={(e) => setMcqForm({ ...mcqForm, option_c: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="Option D"
                    value={mcqForm.option_d}
                    onChange={(e) => setMcqForm({ ...mcqForm, option_d: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Select value={mcqForm.correct_answer} onValueChange={(value) => setMcqForm({ ...mcqForm, correct_answer: value })}>
                    <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-white/20">
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
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="Subject"
                    value={mcqForm.subject}
                    onChange={(e) => setMcqForm({ ...mcqForm, subject: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="Chapter (optional)"
                    value={mcqForm.chapter}
                    onChange={(e) => setMcqForm({ ...mcqForm, chapter: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="Board (optional)"
                    value={mcqForm.board}
                    onChange={(e) => setMcqForm({ ...mcqForm, board: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                </div>
                <Button
                  onClick={handleMCQAdd}
                  disabled={addMCQQuestion.isPending}
                  className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {addMCQQuestion.isPending ? 'Adding...' : 'Add MCQ'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 dark:text-white">
                  📄 File Upload Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={fileUploadForm.type} onValueChange={(value) => setFileUploadForm({...fileUploadForm, type: value})}>
                    <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-white/20">
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
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                </div>
                
                <Input
                  placeholder="Subject"
                  value={fileUploadForm.subject}
                  onChange={(e) => setFileUploadForm({...fileUploadForm, subject: e.target.value})}
                  className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                />
                
                {fileUploadForm.type === 'notes' && (
                  <Input
                    placeholder="Chapter (optional)"
                    value={fileUploadForm.chapter}
                    onChange={(e) => setFileUploadForm({...fileUploadForm, chapter: e.target.value})}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                )}
                
                {fileUploadForm.type === 'questions' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Year"
                      value={fileUploadForm.year}
                      onChange={(e) => setFileUploadForm({...fileUploadForm, year: e.target.value})}
                      className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                    />
                    <Input
                      placeholder="Board"
                      value={fileUploadForm.board}
                      onChange={(e) => setFileUploadForm({...fileUploadForm, board: e.target.value})}
                      className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                    />
                  </div>
                )}

                <Input
                  placeholder="File URL (PDF/Image link)"
                  value={fileUploadForm.fileUrl}
                  onChange={(e) => setFileUploadForm({...fileUploadForm, fileUrl: e.target.value})}
                  className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                />

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800 dark:text-white">SEO Information (Optional)</h4>
                  <Input
                    placeholder="SEO Title"
                    value={fileUploadForm.seoTitle}
                    onChange={(e) => setFileUploadForm({...fileUploadForm, seoTitle: e.target.value})}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Textarea
                    placeholder="SEO Description"
                    value={fileUploadForm.seoDescription}
                    onChange={(e) => setFileUploadForm({...fileUploadForm, seoDescription: e.target.value})}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="SEO Tags (comma separated)"
                    value={fileUploadForm.seoTags}
                    onChange={(e) => setFileUploadForm({...fileUploadForm, seoTags: e.target.value})}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                </div>

                <Button
                  onClick={handleFileUpload}
                  disabled={addNote.isPending || addBoardQuestion.isPending}
                  className="w-full bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {(addNote.isPending || addBoardQuestion.isPending) ? 'Uploading...' : 'Upload File'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 dark:text-white">
                  💬 Motivational Quotes Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add motivational quote in Bangla"
                  value={motivationalQuoteForm.quote}
                  onChange={(e) => setMotivationalQuoteForm({...motivationalQuoteForm, quote: e.target.value})}
                  rows={3}
                  className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Author (optional)"
                    value={motivationalQuoteForm.author}
                    onChange={(e) => setMotivationalQuoteForm({...motivationalQuoteForm, author: e.target.value})}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="Tags (comma separated)"
                    value={motivationalQuoteForm.tags}
                    onChange={(e) => setMotivationalQuoteForm({...motivationalQuoteForm, tags: e.target.value})}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                </div>
                <Button
                  onClick={handleQuoteAdd}
                  disabled={addMotivationalQuote.isPending}
                  className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {addMotivationalQuote.isPending ? 'Adding...' : 'Add Quote'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 dark:text-white">
                  🔑 AI API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={apiKeyForm.provider} onValueChange={(value) => setApiKeyForm({...apiKeyForm, provider: value as any})}>
                  <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-white/20">
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
                  className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                />
                <Button
                  onClick={handleApiKeyAdd}
                  disabled={addApiKey.isPending}
                  className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white"
                >
                  <Key className="w-4 h-4 mr-2" />
                  {addApiKey.isPending ? 'Saving...' : 'Save API Key'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="csv">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 dark:text-white">
                  📥 CSV / Google Sheet Import
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-[#00C49A] rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-[#00C49A] mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Drop your CSV file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported format: Question, Option A-D, Answer, Year, Chapter, Subject, Board, Type
                  </p>
                </div>
                <Input
                  placeholder="Or paste Google Sheet public link here"
                  className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                />
                <Button className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white">
                  Import Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 dark:text-white">
                  🔍 SEO Tags & Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Title" className="bg-white/50 dark:bg-gray-700/50 border-white/20" />
                <Textarea placeholder="Description" className="bg-white/50 dark:bg-gray-700/50 border-white/20" />
                <Input placeholder="Tags/Keywords (comma separated)" className="bg-white/50 dark:bg-gray-700/50 border-white/20" />
                <Button className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white">
                  Save SEO Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
