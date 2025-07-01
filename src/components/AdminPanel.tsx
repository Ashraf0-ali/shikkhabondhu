import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, FileText, BookOpen, Book, Quote, Key, Upload, LogOut, Settings } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import AdminLogin from './AdminLogin';

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('mcq');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { 
    addMCQQuestion, 
    addBoardQuestion, 
    addNCTBBook, 
    addNote, 
    addMotivationalQuote, 
    addApiKey,
    importMCQsFromCSV 
  } = useSupabaseData();

  // Form states
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

  const [nctbData, setNctbData] = useState({
    title: '',
    subject: '',
    class_level: 6,
    chapter: '',
    content: '',
    file_url: '',
    file_type: 'pdf'
  });

  const [quoteData, setQuoteData] = useState({
    quote: '',
    author: '',
    tags: ''
  });

  const [apiKeyData, setApiKeyData] = useState({
    provider: '',
    api_key: ''
  });

  const [chatbotSettings, setChatbotSettings] = useState({
    is_enabled: true,
    max_daily_requests: 100,
    system_prompt: 'আপনি একজন বাংলাদেশি শিক্ষা সহায়ক AI।'
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('admin_logged_in');
    const loginTime = localStorage.getItem('admin_login_time');
    
    if (adminLoggedIn === 'true' && loginTime) {
      const currentTime = Date.now();
      const loginTimestamp = parseInt(loginTime);
      const timeDifference = currentTime - loginTimestamp;
      const hoursElapsed = timeDifference / (1000 * 60 * 60);
      
      if (hoursElapsed < 24) {
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_login_time');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_login_time');
    setIsLoggedIn(false);
    toast({
      title: "লগআউট সফল",
      description: "আপনি সফলভাবে লগআউট হয়েছেন",
    });
  };

  const handleMcqSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    addMCQQuestion.mutate(mcqData);
  };

  const handleNCTBSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    addNCTBBook.mutate(nctbData);
  };

  const handleQuoteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    addMotivationalQuote.mutate(quoteData);
  };

  const handleApiKeySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    addApiKey.mutate(apiKeyData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleCSVImport = async () => {
    if (!selectedFile) {
      toast({
        title: "ফাইল নির্বাচন করুন",
        description: "প্রথমে একটি CSV ফাইল নির্বাচন করুন",
        variant: "destructive"
      });
      return;
    }

    const text = await selectedFile.text();
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    
    const mcqs = lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        question: values[0] || '',
        option_a: values[1] || '',
        option_b: values[2] || '',
        option_c: values[3] || '',
        option_d: values[4] || '',
        correct_answer: (values[5] || 'A') as 'A' | 'B' | 'C' | 'D',
        subject: values[6] || '',
        chapter: values[7] || '',
        board: values[8] || '',
        year: parseInt(values[9]) || new Date().getFullYear()
      };
    });

    importMCQsFromCSV.mutate(mcqs);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader className="text-center py-6">
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent bangla-text">
                🛠️ এডমিন প্যানেল
              </CardTitle>
              <Button onClick={handleLogout} variant="outline" className="bangla-text">
                <LogOut className="w-4 h-4 mr-2" />
                লগআউট
              </Button>
            </div>
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
                { id: 'nctb', label: '📚 NCTB বই', icon: BookOpen },
                { id: 'quotes', label: '💭 উদ্ধৃতি', icon: Quote },
                { id: 'api', label: '🔑 API কী', icon: Key },
                { id: 'csv', label: '📊 CSV ইমপোর্ট', icon: Upload },
                { id: 'chatbot', label: '🤖 চ্যাটবট কন্ট্রোল', icon: Settings }
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
          )}

          {activeTab === 'nctb' && (
            <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="bangla-text">📚 NCTB বই যোগ করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNCTBSubmit} className="space-y-4">
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
          )}

          {activeTab === 'quotes' && (
            
            <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="bangla-text">💭 উদ্দীপনামূলক উক্তি যোগ করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium bangla-text">উক্তি</label>
                    <Textarea
                      value={quoteData.quote}
                      onChange={(e) => setQuoteData({...quoteData, quote: e.target.value})}
                      placeholder="উক্তি লিখুন"
                      className="bangla-text min-h-[100px]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium bangla-text">লেখক</label>
                    <Input
                      value={quoteData.author}
                      onChange={(e) => setQuoteData({...quoteData, author: e.target.value})}
                      placeholder="লেখকের নাম"
                      className="bangla-text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium bangla-text">ট্যাগ</label>
                    <Input
                      value={quoteData.tags}
                      onChange={(e) => setQuoteData({...quoteData, tags: e.target.value})}
                      placeholder="ট্যাগ (কমা দিয়ে আলাদা করুন)"
                      className="bangla-text"
                    />
                  </div>
                  <Button type="submit" className="w-full bangla-text" disabled={addMotivationalQuote.isPending}>
                    {addMotivationalQuote.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        যোগ করা হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        উক্তি যোগ করুন
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'api' && (
            
            <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="bangla-text">🔑 API কী ম্যানেজমেন্ট</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApiKeySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium bangla-text">প্রোভাইডার</label>
                    <Select value={apiKeyData.provider} onValueChange={(value) => setApiKeyData({...apiKeyData, provider: value})}>
                      <SelectTrigger className="bangla-text">
                        <SelectValue placeholder="প্রোভাইডার নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium bangla-text">API কী</label>
                    <Input
                      type="password"
                      value={apiKeyData.api_key}
                      onChange={(e) => setApiKeyData({...apiKeyData, api_key: e.target.value})}
                      placeholder="API কী লিখুন"
                      className="bangla-text"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bangla-text" disabled={addApiKey.isPending}>
                    {addApiKey.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        সংরক্ষণ করা হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        API কী সংরক্ষণ করুন
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'csv' && (
            
            <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="bangla-text">📊 CSV ফাইল ইমপোর্ট</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium bangla-text">CSV ফাইল নির্বাচন করুন</label>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="bangla-text"
                  />
                </div>
                <div className="text-sm text-gray-600 bangla-text">
                  <p>CSV ফরম্যাট: question,option_a,option_b,option_c,option_d,correct_answer,subject,chapter,board,year</p>
                </div>
                <Button 
                  onClick={handleCSVImport} 
                  className="w-full bangla-text" 
                  disabled={importMCQsFromCSV.isPending || !selectedFile}
                >
                  {importMCQsFromCSV.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ইমপোর্ট করা হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      CSV ইমপোর্ট করুন
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'chatbot' && (
            
            <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="bangla-text">🤖 চ্যাটবট কন্ট্রোল</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium bangla-text">চ্যাটবট চালু/বন্ধ</h3>
                    <p className="text-xs text-gray-500 bangla-text">চ্যাটবট সেবা নিয়ন্ত্রণ করুন</p>
                  </div>
                  <Switch
                    checked={chatbotSettings.is_enabled}
                    onCheckedChange={(checked) => setChatbotSettings({...chatbotSettings, is_enabled: checked})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium bangla-text">দৈনিক সর্বোচ্চ অনুরোধ</label>
                  <Input
                    type="number"
                    value={chatbotSettings.max_daily_requests}
                    onChange={(e) => setChatbotSettings({...chatbotSettings, max_daily_requests: parseInt(e.target.value)})}
                    placeholder="দৈনিক সর্বোচ্চ অনুরোধ"
                    className="bangla-text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium bangla-text">সিস্টেম প্রম্পট</label>
                  <Textarea
                    value={chatbotSettings.system_prompt}
                    onChange={(e) => setChatbotSettings({...chatbotSettings, system_prompt: e.target.value})}
                    placeholder="সিস্টেম প্রম্পট"
                    className="bangla-text min-h-[100px]"
                  />
                </div>
                <Button className="w-full bangla-text">
                  <Settings className="w-4 h-4 mr-2" />
                  সেটিংস সংরক্ষণ করুন
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600 bangla-text">
              Developed by Ashraf | যেকোনো প্রয়োজনে মেসেজ করুন - 
              <a href="https://wa.me/8801825210571" className="text-blue-600 hover:underline ml-1">
                WhatsApp: 01825210571
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
