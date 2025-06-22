
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, FileQuestion, Upload, FileText, Search, Lock, Plus, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [textbookForm, setTextbookForm] = useState({
    subject: '',
    class: '',
    chapter: '',
    content: ''
  });
  const [mcqForm, setMcqForm] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    answer: '',
    year: '',
    subject: '',
    chapter: '',
    board: ''
  });
  const { toast } = useToast();

  const handleLogin = () => {
    if (loginForm.username === 'Ashraf' && loginForm.password === 'Ashraf') {
      setIsAuthenticated(true);
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
    if (textbookForm.subject && textbookForm.class && textbookForm.chapter && textbookForm.content) {
      // Save to localStorage for demo
      const textbooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
      textbooks.push({ ...textbookForm, id: Date.now() });
      localStorage.setItem('textbooks', JSON.stringify(textbooks));
      
      toast({
        title: "সফল আপলোড ✅",
        description: "ফাইলটি সফলভাবে আপলোড হয়েছে",
      });
      
      setTextbookForm({ subject: '', class: '', chapter: '', content: '' });
    }
  };

  const handleMCQAdd = () => {
    if (mcqForm.question && mcqForm.answer) {
      const mcqs = JSON.parse(localStorage.getItem('mcqs') || '[]');
      mcqs.push({ ...mcqForm, id: Date.now() });
      localStorage.setItem('mcqs', JSON.stringify(mcqs));
      
      toast({
        title: "সফল যোগ ✅",
        description: "MCQ সফলভাবে যুক্ত হয়েছে",
      });
      
      setMcqForm({
        question: '', optionA: '', optionB: '', optionC: '', optionD: '',
        answer: '', year: '', subject: '', chapter: '', board: ''
      });
    }
  };

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
              🛠️ এডমিন প্যানেল - Admin Tools
            </CardTitle>
          </CardHeader>
        </Card>

        <Tabs defaultValue="textbooks" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md">
            <TabsTrigger value="textbooks" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">📚 Textbooks</span>
            </TabsTrigger>
            <TabsTrigger value="mcqs" className="flex items-center space-x-2">
              <FileQuestion className="w-4 h-4" />
              <span className="hidden sm:inline">❓ MCQs</span>
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">📥 CSV</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">📄 Files</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">🔍 SEO</span>
            </TabsTrigger>
            <TabsTrigger value="logout" onClick={() => setIsAuthenticated(false)}>
              🔐 Logout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="textbooks">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 dark:text-white">
                  📚 Textbook Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Subject (e.g., English)"
                    value={textbookForm.subject}
                    onChange={(e) => setTextbookForm({ ...textbookForm, subject: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="Class (e.g., 9)"
                    value={textbookForm.class}
                    onChange={(e) => setTextbookForm({ ...textbookForm, class: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="Chapter (e.g., 2)"
                    value={textbookForm.chapter}
                    onChange={(e) => setTextbookForm({ ...textbookForm, chapter: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                </div>
                <Textarea
                  placeholder="Content (multiline text)"
                  value={textbookForm.content}
                  onChange={(e) => setTextbookForm({ ...textbookForm, content: e.target.value })}
                  rows={6}
                  className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                />
                <Button
                  onClick={handleTextbookUpload}
                  className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Textbook
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mcqs">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 dark:text-white">
                  ❓ Question Bank Management
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
                    value={mcqForm.optionA}
                    onChange={(e) => setMcqForm({ ...mcqForm, optionA: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="Option B"
                    value={mcqForm.optionB}
                    onChange={(e) => setMcqForm({ ...mcqForm, optionB: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="Option C"
                    value={mcqForm.optionC}
                    onChange={(e) => setMcqForm({ ...mcqForm, optionC: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="Option D"
                    value={mcqForm.optionD}
                    onChange={(e) => setMcqForm({ ...mcqForm, optionD: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Input
                    placeholder="Correct Answer (A/B/C/D)"
                    value={mcqForm.answer}
                    onChange={(e) => setMcqForm({ ...mcqForm, answer: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
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
                    placeholder="Chapter"
                    value={mcqForm.chapter}
                    onChange={(e) => setMcqForm({ ...mcqForm, chapter: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                  <Input
                    placeholder="Board"
                    value={mcqForm.board}
                    onChange={(e) => setMcqForm({ ...mcqForm, board: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50 border-white/20"
                  />
                </div>
                <Button
                  onClick={handleMCQAdd}
                  className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add MCQ
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

          <TabsContent value="files">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 dark:text-white">
                  📄 PDF & Image Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-[#8E24AA] rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 text-[#8E24AA] mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Upload PDF, PNG, JPEG, JPG, HEIC files
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input placeholder="Subject" className="bg-white/50 dark:bg-gray-700/50 border-white/20" />
                  <Input placeholder="Type (Notes/Questions)" className="bg-white/50 dark:bg-gray-700/50 border-white/20" />
                  <Input placeholder="Year" className="bg-white/50 dark:bg-gray-700/50 border-white/20" />
                  <Input placeholder="Chapter" className="bg-white/50 dark:bg-gray-700/50 border-white/20" />
                </div>
                <Input placeholder="Or paste image link" className="bg-white/50 dark:bg-gray-700/50 border-white/20" />
                <Button className="bg-gradient-to-r from-[#00C49A] to-[#8E24AA] hover:from-[#00A085] hover:to-[#7B1FA2] text-white">
                  Upload Files
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
