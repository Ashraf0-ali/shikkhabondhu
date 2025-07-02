
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Key } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const ApiKeyForm = () => {
  const { addApiKey } = useSupabaseData();
  
  const [apiKeyData, setApiKeyData] = useState({
    provider: '',
    api_key: ''
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    addApiKey.mutate(apiKeyData);
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
      <CardHeader>
        <CardTitle className="bangla-text">🔑 API কী ম্যানেজমেন্ট</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
  );
};

export default ApiKeyForm;
