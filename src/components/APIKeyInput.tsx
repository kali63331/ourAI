import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Key, ExternalLink } from 'lucide-react';

interface APIKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

export const APIKeyInput = ({ onApiKeySet }: APIKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is already saved
    const savedApiKey = localStorage.getItem('perplexity_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeySet(savedApiKey);
    }
  }, [onApiKeySet]);

  const validateAndSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Perplexity API key",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);

    try {
      // Test the API key with a simple request
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'user',
              content: 'Test message'
            }
          ],
          max_tokens: 10,
        }),
      });

      if (response.ok) {
        localStorage.setItem('perplexity_api_key', apiKey);
        onApiKeySet(apiKey);
        toast({
          title: "Success",
          description: "API key validated and saved successfully!",
        });
      } else {
        throw new Error(`API key validation failed: ${response.status}`);
      }
    } catch (error) {
      console.error('API key validation error:', error);
      toast({
        title: "Invalid API Key",
        description: "Please check your Perplexity API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto bg-gradient-card border-2 border-primary/20 shadow-python">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-python rounded-full flex items-center justify-center">
          <Key className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Enter API Key</h2>
        <p className="text-muted-foreground">
          Enter your Perplexity API key to start chatting with Python AI
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="pplx-xxxxxxxxxxxxxxxxxxxxxxxx"
            className="pr-10 border-2 border-primary/20 focus:border-primary"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setShowApiKey(!showApiKey)}
          >
            {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </Button>
        </div>

        <Button
          onClick={validateAndSaveApiKey}
          disabled={isValidating || !apiKey.trim()}
          className="w-full"
          variant="python"
        >
          {isValidating ? 'Validating...' : 'Save API Key'}
        </Button>

        <div className="text-center">
          <a
            href="https://www.perplexity.ai/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Get your Perplexity API key
            <ExternalLink size={14} />
          </a>
        </div>

        <div className="bg-primary/5 p-3 rounded-md">
          <p className="text-xs text-muted-foreground">
            🔒 Your API key is stored locally in your browser and never sent to our servers.
            It's only used to make direct requests to Perplexity AI.
          </p>
        </div>
      </div>
    </Card>
  );
};