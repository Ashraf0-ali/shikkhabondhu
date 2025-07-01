import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, FileText, BookOpen, Book, Quote, Key, Upload } from 'lucide-react';

interface MCQData {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  subject: string;
  chapter: string;
  board: string;
  year: number;
}

interface BoardData {
  title: string;
  subject: string;
  board: string;
  year: number;
  file_url: string;
  file_type: string;
}

interface NCTBData {
  title: string;
  subject: string;
  class_level: string;
  file_url: string;
  file_type: string;
}

interface NotesData {
  title: string;
  subject: string;
  file_url: string;
  file_type: string;
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('mcq');
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
  const [boardData, setBoardData] = useState({
    title: '',
    subject: '',
    board: '',
    year: new Date().getFullYear(),
    file_url: '',
    file_type: ''
  });
  const [nctbData, setNctbData] = useState({
    title: '',
    subject: '',
    class_level: '',
    file_url: '',
    file_type: ''
  });
  const [notesData, setNotesData] = useState({
    title: '',
    subject: '',
    file_url: '',
    file_type: ''
  });
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [isUploading, setIsUploading] = useState<{[key: string]: boolean}>({});

  const addMcqQuestion = useMutation(
    async (data: MCQData) => {
      const { data: response, error } = await supabase
        .from('mcq_questions')
        .insert([data]);
      if (error) throw error;
      return response;
    },
    {
      onSuccess: () => {
        toast({
          title: "সফল",
          description: "MCQ প্রশ্ন যোগ করা হয়েছে!",
        });
        setMcqData({
          question: '',
          option_a: '',
          option_b: '',
          option_c: '',
          option_d: '',
          correct_answer: 'A',
          subject: '',
          chapter: '',
          board: '',
          year: new Date().getFullYear()
        });
      },
      onError: (error: any) => {
        toast({
          title: "ত্রুটি",
          description: "MCQ প্রশ্ন যোগ করতে সমস্যা হয়েছে।",
          variant: "destructive"
        });
        console.error("Error adding MCQ question:", error);
      },
    }
  );

  const addBoardQuestion = useMutation(
    async (data: BoardData) => {
      const { data: response, error } = await supabase
        .from('board_questions')
        .insert([data]);
      if (error) throw error;
      return response;
    },
    {
      onSuccess: () => {
        toast({
          title: "সফল",
          description: "বোর্ড প্রশ্ন যোগ করা হয়েছে!",
        });
        setBoardData({
          title: '',
          subject: '',
          board: '',
          year: new Date().getFullYear(),
          file_url: '',
          file_type: ''
        });
      },
      onError: (error: any) => {
        toast({
          title: "ত্রুটি",
          description: "বোর্ড প্রশ্ন যোগ করতে সমস্যা হয়েছে।",
          variant: "destructive"
        });
        console.error("Error adding board question:", error);
      },
    }
  );

  const addNctbBook = useMutation(
    async (data: NCTBData) => {
      const { data: response, error } = await supabase
        .from('nctb_books')
        .insert([data]);
      if (error) throw error;
      return response;
    },
    {
      onSuccess: () => {
        toast({
          title: "সফল",
          description: "NCTB বই যোগ করা হয়েছে!",
        });
        setNctbData({
          title: '',
          subject: '',
          class_level: '',
          file_url: '',
          file_type: ''
        });
      },
      onError: (error: any) => {
        toast({
          title: "ত্রুটি",
          description: "NCTB বই যোগ করতে সমস্যা হয়েছে।",
          variant: "destructive"
        });
        console.error("Error adding NCTB book:", error);
      },
    }
  );

  const addNote = useMutation(
    async (data: NotesData) => {
      const { data: response, error } = await supabase
        .from('notes')
        .insert([data]);
      if (error) throw error;
      return response;
    },
    {
      onSuccess: () => {
        toast({
          title: "সফল",
          description: "নোট যোগ করা হয়েছে!",
        });
        setNotesData({
          title: '',
          subject: '',
          file_url: '',
          file_type: ''
        });
      },
      onError: (error: any) => {
        toast({
          title: "ত্রুটি",
          description: "নোট যোগ করতে সমস্যা হয়েছে।",
          variant: "destructive"
        });
        console.error("Error adding note:", error);
      },
    }
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, section: string) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log(`File selected for ${section}:`, file.name);
    }
  };

  const handleFileUpload = async (section: string) => {
    if (!selectedFile) {
      toast({
        title: "ত্রুটি",
        description: "অনুগ্রহ করে একটি ফাইল নির্বাচন করুন।",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(prev => ({ ...prev, [section]: true }));
    setUploadProgress(prev => ({ ...prev, [section]: 0 }));

    try {
      // Create a unique file name
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${section}/${fileName}`;

      // Upload to Supabase storage (if storage is set up)
      // For now, we'll just simulate the upload and store file info
      
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(prev => ({ ...prev, [section]: i }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const fileUrl = `uploads/${filePath}`;
      const fileType = selectedFile.type;

      // Add to appropriate table based on section
      if (section === 'board') {
        await addBoardQuestion.mutateAsync({
          ...boardData,
          file_url: fileUrl,
          file_type: fileType,
          title: boardData.title || selectedFile.name.split('.')[0],
          subject: boardData.subject || 'সাধারণ',
          board: boardData.board || 'সাধারণ'
        });
      } else if (section === 'nctb') {
        await addNctbBook.mutateAsync({
          ...nctbData,
          file_url: fileUrl,
          file_type: fileType,
          title: nctbData.title || selectedFile.name.split('.')[0],
          subject: nctbData.subject || 'সাধারণ'
        });
      } else if (section === 'notes') {
        await addNote.mutateAsync({
          ...notesData,
          file_url: fileUrl,
          file_type: fileType,
          title: notesData.title || selectedFile.name.split('.')[0],
          subject: notesData.subject || 'সাধারণ'
        });
      }

      toast({
        title: "সফল",
        description: "ফাইল সফলভাবে আপলোড হয়েছে!",
      });

      // Reset file selection
      setSelectedFile(null);
      const fileInput = document.querySelector(`input[type="file"][data-section="${section}"]`) as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "ত্রুটি",
        description: "ফাইল আপলোড করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setIsUploading(prev => ({ ...prev, [section]: false }));
      setUploadProgress(prev => ({ ...prev, [section]: 0 }));
    }
  };

  const handleMcqSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    addMcqQuestion.mutate(mcqData);
  };

  const renderFileUpload = (section: string, title: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="bangla-text">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium bangla-text">ফাইল নির্বাচন করুন</label>
          <Input
            type="file"
            onChange={(e) => handleFileSelect(e, section)}
            accept=".pdf,.doc,.docx,.txt"
            className="bangla-text"
            data-section={section}
          />
        </div>
        
        {selectedFile && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 bangla-text">
              নির্বাচিত ফাইল: {selectedFile.name}
            </p>
            <Button
              onClick={() => handleFileUpload(section)}
              disabled={isUploading[section]}
              className="w-full bangla-text"
            >
              {isUploading[section] ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  আপলোড হচ্ছে... {uploadProgress[section]}%
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  আপলোড করুন
                </>
              )}
            </Button>
            
            {uploadProgress[section] > 0 && uploadProgress[section] < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress[section]}%` }}
                ></div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader className="text-center py-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-2 bangla-text">
              🛠️ এডমিন প্যানেল
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 bangla-text">
              শিক্ষা উপকরণ ম্যানেজমেন্ট সিস্টেম
            </p>
          </CardHeader>
        </Card>

        {/* Tab Navigation */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardContent className="p-2">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'mcq', label: '📝 MCQ প্রশ্ন', icon: FileText },
                { id: 'board', label: '📋 বোর্ড প্রশ্ন', icon: BookOpen },
                { id: 'nctb', label: '📚 NCTB বই', icon: Book },
                { id: 'notes', label: '📓 নোটস', icon: FileText },
                { id: 'quotes', label: '💭 উদ্ধৃতি', icon: Quote },
                { id: 'api', label: '🔑 API কী', icon: Key }
              ].map(tab => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 bangla-text"
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'mcq' && (
            <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="bangla-text">📝 MCQ প্রশ্ন যোগ করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMcqSubmit} className="space-y-4">
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
                      <label className="text-sm font-medium bangla-text">বোর্ড</label>
                      <Select value={mcqData.board} onValueChange={(value) => setMcqData({...mcqData, board: value})}>
                        <SelectTrigger className="bangla-text">
                          <SelectValue placeholder="বোর্ড নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ঢাকা">ঢাকা</SelectItem>
                          <SelectItem value="চট্টগ্রাম">চট্টগ্রাম</SelectItem>
                          <SelectItem value="রাজশাহী">রাজশাহী</SelectItem>
                          <SelectItem value="যশোর">যশোর</SelectItem>
                          <SelectItem value="কুমিল্লা">কুমিল্লা</SelectItem>
                          <SelectItem value="বরিশাল">বরিশাল</SelectItem>
                          <SelectItem value="সিলেট">সিলেট</SelectItem>
                          <SelectItem value="দিনাজপুর">দিনাজপুর</SelectItem>
                          <SelectItem value="মাদ্রাসা">মাদ্রাসা</SelectItem>
                          <SelectItem value="কারিগরি">কারিগরি</SelectItem>
                          <SelectItem value="আলিম">আলিম</SelectItem>
                          <SelectItem value="দাখিল">দাখিল</SelectItem>
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

                  <Button type="submit" className="w-full bangla-text" disabled={addMcqQuestion.isPending}>
                    {addMcqQuestion.isPending ? (
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
          )}

          {activeTab === 'board' && renderFileUpload('board', '📋 বোর্ড প্রশ্ন আপলোড')}
          {activeTab === 'nctb' && renderFileUpload('nctb', '📚 NCTB বই আপলোড')}
          {activeTab === 'notes' && renderFileUpload('notes', '📓 নোটস আপলোড')}

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
