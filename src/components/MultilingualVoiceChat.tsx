import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Loader2, Volume2, Trash2, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const MultilingualVoiceChat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [language, setLanguage] = useState<'english' | 'hindi' | 'punjabi'>('english');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    audioContextRef.current = new AudioContext();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('multilingual-voice-chat', {
          body: { 
            audio: base64Audio,
            conversationHistory: messages,
            language: language
          }
        });

        if (error) throw error;

        if (data?.userText && data?.assistantText) {
          const newMessages: Message[] = [
            ...messages,
            { role: 'user', content: data.userText },
            { role: 'assistant', content: data.assistantText }
          ];
          setMessages(newMessages);

          // Play the audio response
          if (data.audioBase64) {
            await playAudio(data.audioBase64);
          }

          toast({
            title: "Success",
            description: "Voice processed successfully!",
          });
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Error",
        description: "Failed to process audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = async (base64Audio: string) => {
    try {
      setIsSpeaking(true);
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const audioBlob = new Blob([bytes], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsSpeaking(false);
      toast({
        title: "Error",
        description: "Failed to play audio response.",
        variant: "destructive",
      });
    }
  };

  const clearConversation = () => {
    setMessages([]);
    toast({
      title: "Cleared",
      description: "Conversation history cleared.",
    });
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'hindi': return 'हिंदी';
      case 'punjabi': return 'ਪੰਜਾਬੀ';
      default: return 'English';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-8 space-y-6 bg-background/95 backdrop-blur-xl border-primary/20 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-python opacity-20 blur-xl rounded-full" />
            <div className="relative w-14 h-14 rounded-full bg-gradient-python flex items-center justify-center">
              <Globe className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-python bg-clip-text text-transparent">
              AI Voice Assistant
            </h2>
            <p className="text-sm text-muted-foreground">
              Speak in {getLanguageLabel()}
            </p>
          </div>
        </div>
        <Button
          onClick={clearConversation}
          variant="ghost"
          size="sm"
          disabled={messages.length === 0}
          className="hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Select Language:</label>
          <Select value={language} onValueChange={(value: 'english' | 'hindi' | 'punjabi') => setLanguage(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">🇬🇧 English</SelectItem>
              <SelectItem value="hindi">🇮🇳 हिंदी (Hindi)</SelectItem>
              <SelectItem value="punjabi">🇮🇳 ਪੰਜਾਬੀ (Punjabi)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-64 w-full border rounded-lg p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Start a conversation by clicking the microphone button below</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-gradient-message text-primary-foreground'
                        : 'bg-gradient-card border border-border/50'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex flex-col items-center gap-6 py-4">
          {isSpeaking && (
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-6 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                <div className="w-1 h-7 bg-primary rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
              </div>
              <span className="bg-gradient-python bg-clip-text text-transparent">Speaking...</span>
            </div>
          )}
          
          <div className="relative">
            <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500/30 blur-2xl scale-150 animate-pulse' 
                : 'bg-primary/20 blur-xl'
            }`} />
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing || isSpeaking}
              size="lg"
              className={`relative w-24 h-24 rounded-full transition-all duration-300 ${
                isRecording 
                  ? 'bg-gradient-to-br from-red-500 to-pink-600 scale-95' 
                  : 'bg-gradient-python hover:scale-105'
              } shadow-2xl`}
            >
              {isProcessing ? (
                <Loader2 className="w-10 h-10 animate-spin text-white" />
              ) : isRecording ? (
                <MicOff className="w-10 h-10 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground font-medium">
            {isProcessing 
              ? 'Processing...' 
              : isRecording 
              ? 'Tap to stop' 
              : 'Tap to speak'}
          </p>
        </div>
      </div>

      <div className="text-xs text-center text-muted-foreground border-t pt-4">
        Using Gemini AI for multilingual understanding • OpenAI Whisper for transcription • OpenAI TTS for speech
      </div>
    </Card>
  );
};