import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Bot, User, Code2, Globe, Brain, ArrowLeft, Zap, Mic, Camera, Plus, MessageSquare, Volume2, Languages } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { VoiceRecorder } from './VoiceRecorder';
import { CameraCapture } from './CameraCapture';
import VoiceConversation from './VoiceConversation';
import { MultilingualVoiceChat } from './MultilingualVoiceChat';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isCodeBlock?: boolean;
}

interface PythonAIChatProps {
  onBack?: () => void;
}

export const PythonAIChat = ({ onBack }: PythonAIChatProps): JSX.Element => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your Python AI assistant. I can help you with Python programming questions using different AI models. I'm currently set to use the free AI model that doesn't require any API keys. Feel free to ask me anything about Python!\n\nHere are some examples of questions you can ask:\n• how do i make a list in python?\n• whats the difference between == and is?\n• can you show me how to read a file?\n• help me understand loops please\n• my code isnt working, how do i debug it?\n• what libraries should i use for data science?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'perplexity' | 'openai' | 'expertise' | 'enhanced' | 'solutions' | 'free'>('free');
  const [conversationMode, setConversationMode] = useState<'text' | 'voice' | 'multilingual'>('text');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatCodeContent = (content: string) => {
    // Simple code detection - if content contains python keywords or syntax
    const pythonKeywords = ['def ', 'import ', 'from ', 'class ', 'if __name__', 'print(', 'for ', 'while ', 'try:', 'except:'];
    const hasCode = pythonKeywords.some(keyword => content.includes(keyword));
    
    if (hasCode) {
      return content.split('\n').map((line, index) => (
        <div key={index} className="font-mono text-sm">
          {line}
        </div>
      ));
    }
    
    return content;
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = currentMessage;
    setCurrentMessage('');
    setIsLoading(true);

    try {
      let aiResponse = "";

      if (selectedModel === 'free') {
        // Use free HuggingFace AI that doesn't require API keys
        const { data, error } = await supabase.functions.invoke('python-ai-huggingface', {
          body: { message: messageContent }
        });

        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(`Function call failed: ${error.message}`);
        }

        aiResponse = data?.response || "I'm sorry, I couldn't generate a response. Please try again.";
      } else if (selectedModel === 'perplexity') {
        const { data, error } = await supabase.functions.invoke('python-ai-chat', {
          body: { message: messageContent }
        });

        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(`Function call failed: ${error.message}`);
        }

        aiResponse = data?.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
      } else {
        // Use enhanced Python AI with better natural language processing
        const { data, error } = await supabase.functions.invoke('python-ai-enhanced', {
          body: { 
            message: messageContent,
            mode: selectedModel 
          }
        });

        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(`Function call failed: ${error.message}`);
        }

        aiResponse = data?.response || "I'm sorry, I couldn't generate a response. Please try again.";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
        isCodeBlock: aiResponse.includes('```') || aiResponse.includes('def ') || aiResponse.includes('import ')
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleVoiceTranscription = (text: string) => {
    setCurrentMessage(text);
  };

  const handleImageAnalysis = (analysis: string) => {
    setCurrentMessage(analysis);
  };

  const speakMessage = (messageId: string, content: string) => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    if (speakingMessageId === messageId) {
      setSpeakingMessageId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(content);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onend = () => {
      setSpeakingMessageId(null);
    };
    
    utterance.onerror = () => {
      setSpeakingMessageId(null);
      toast({
        title: "Error",
        description: "Could not play audio. Please try again.",
        variant: "destructive",
      });
    };

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-chat animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-border bg-gradient-card backdrop-blur-sm">
        {onBack && (
          <Button 
            onClick={onBack}
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2 hover-lift"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </Button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-python flex items-center justify-center animate-pulse-glow">
            <Bot size={18} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-semibold bg-gradient-python bg-clip-text text-transparent">
              Python AI Assistant
            </h1>
            <div className="flex gap-2 mt-1">
              <Button
                variant={conversationMode === 'text' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setConversationMode('text')}
                className="h-6 text-xs"
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                Text
              </Button>
              <Button
                variant={conversationMode === 'voice' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setConversationMode('voice')}
                className="h-6 text-xs"
              >
                <Mic className="w-3 h-3 mr-1" />
                Voice
              </Button>
              <Button
                variant={conversationMode === 'multilingual' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setConversationMode('multilingual')}
                className="h-6 text-xs"
              >
                <Globe className="w-3 h-3 mr-1" />
                Multilingual
              </Button>
            </div>
          </div>
        </div>
        <div className="w-12 md:w-16"></div> {/* Spacer for centering */}
      </div>

      {/* Content - conditional based on mode */}
      {conversationMode === 'multilingual' ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <MultilingualVoiceChat />
        </div>
      ) : conversationMode === 'voice' ? (
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">Voice Conversation</h2>
              <p className="text-sm text-muted-foreground">
                Have a natural voice conversation with the Python AI assistant. 
                Click the button below to start talking!
              </p>
            </div>
            <VoiceConversation />
            <div className="mt-4 text-xs text-muted-foreground text-center">
              Have natural voice conversations with your AI Python tutor using OpenAI Whisper and TTS
            </div>
          </Card>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-6">
                <div className="space-y-4 md:space-y-6">
                  {messages.map((message) => (
                <div key={message.id} className="group">
                    <div className={`flex gap-2 md:gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                    {message.sender === 'bot' && (
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-bot flex items-center justify-center flex-shrink-0 mt-1 animate-pulse-glow">
                        <Bot size={16} className="text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-[85%] md:max-w-[80%] ${message.sender === 'user' ? 'order-1' : ''}`}>
                      <div className={`rounded-lg px-3 md:px-4 py-2 md:py-3 hover-lift transition-all duration-300 ${
                        message.sender === 'user' 
                          ? 'bg-gradient-message text-primary-foreground ml-auto shadow-lg' 
                          : 'bg-gradient-card border border-border/50'
                      }`}>
                        <div className={`text-sm md:text-base leading-relaxed ${
                          message.isCodeBlock 
                            ? 'font-mono whitespace-pre-wrap text-xs md:text-sm' 
                            : ''
                        }`}>
                          {message.isCodeBlock ? formatCodeContent(message.content) : message.content}
                        </div>
                        {message.sender === 'bot' && (
                          <div className="flex justify-end mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => speakMessage(message.id, message.content)}
                              className="h-6 px-2 text-xs hover:bg-background/10"
                            >
                              <Volume2 
                                size={14} 
                                className={`mr-1 ${speakingMessageId === message.id ? 'text-primary animate-pulse' : ''}`}
                              />
                              {speakingMessageId === message.id ? 'Stop' : 'Listen'}
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className={`text-xs text-muted-foreground mt-1 ${
                        message.sender === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-python flex items-center justify-center flex-shrink-0 mt-1">
                        <User size={16} className="text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="group animate-slide-up">
                  <div className="flex gap-2 md:gap-4 justify-start">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-bot flex items-center justify-center flex-shrink-0 mt-1 animate-pulse-glow">
                      <Bot size={16} className="text-white" />
                    </div>
                    
                    <div className="max-w-[85%] md:max-w-[80%]">
                      <div className="bg-gradient-card border border-border/50 rounded-lg px-3 md:px-4 py-2 md:py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                            <div className="w-2 h-2 bg-python-blue rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-python-purple rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                          </div>
                          <span className="text-xs md:text-sm text-foreground bg-gradient-python bg-clip-text text-transparent font-medium">
                            Python AI is thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Input Area */}
      <div className="border-t border-border bg-gradient-card backdrop-blur-sm safe-area-bottom">
        <div className="max-w-4xl mx-auto p-3 md:p-4">
          <div className="mb-2 md:mb-3">
            <Select value={selectedModel} onValueChange={(value: 'perplexity' | 'openai' | 'expertise' | 'enhanced' | 'solutions' | 'free') => setSelectedModel(value)}>
              <SelectTrigger className="w-full h-10 md:h-auto text-sm md:text-base bg-gradient-card border-border/50 hover-lift">
                <SelectValue placeholder="Choose AI Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-green-500" />
                    <span className="text-sm md:text-base">Free AI (No API Key)</span>
                  </div>
                </SelectItem>
                <SelectItem value="openai">
                  <div className="flex items-center gap-2">
                    <Brain size={16} />
                    <span className="text-sm md:text-base">OpenAI GPT</span>
                  </div>
                </SelectItem>
                <SelectItem value="expertise">
                  <div className="flex items-center gap-2">
                    <Code2 size={16} />
                    <span className="text-sm md:text-base">Python Expert</span>
                  </div>
                </SelectItem>
                <SelectItem value="enhanced">
                  <div className="flex items-center gap-2">
                    <Globe size={16} />
                    <span className="text-sm md:text-base">Internet Enhanced</span>
                  </div>
                </SelectItem>
                <SelectItem value="solutions">
                  <div className="flex items-center gap-2">
                    <Zap size={16} />
                    <span className="text-sm md:text-base">Smart Solutions</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about Python... (try: 'how do i make a function?' or 'whats wrong with my code?')"
              disabled={isLoading}
              className="flex-1 h-14 md:h-10 text-lg md:text-sm px-4 bg-gradient-card border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover-lift transition-all duration-300"
              style={{ fontSize: '18px' }} // Prevents zoom on iOS and makes text larger
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={isLoading}
                  className="h-14 w-14 md:h-10 md:w-10 shrink-0 bg-gradient-card border-border/50 hover-lift"
                >
                  <Plus size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-background border border-border shadow-lg z-50 p-2"
                sideOffset={8}
              >
                <VoiceRecorder 
                  onTranscription={handleVoiceTranscription}
                  disabled={isLoading}
                />
                <div className="my-1 h-px bg-border" />
                <CameraCapture 
                  onAnalysis={handleImageAnalysis}
                  disabled={isLoading}
                />
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              onClick={sendMessage}
              disabled={isLoading || !currentMessage.trim()}
              size="icon"
              className="h-14 w-14 md:h-10 md:w-10 shrink-0 bg-gradient-python hover:scale-105 transition-all duration-300 animate-pulse-glow"
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};