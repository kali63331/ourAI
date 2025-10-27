import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const VoiceConversation = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const { toast } = useToast();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
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
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording",
        description: "Speak now... Click stop when finished.",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "Failed to access microphone",
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
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];

        // Send to edge function
        const { data, error } = await supabase.functions.invoke(
          'voice-conversation',
          {
            body: {
              audio: base64Audio,
              conversationHistory: conversationHistory.slice(-10), // Keep last 10 messages for context
            },
          }
        );

        if (error) throw error;

        const { userText, aiText, audioBase64 } = data;

        // Update conversation history
        const newHistory = [
          ...conversationHistory,
          { role: 'user' as const, content: userText },
          { role: 'assistant' as const, content: aiText },
        ];
        setConversationHistory(newHistory);

        // Play AI response
        await playAudio(audioBase64);
        
        setIsProcessing(false);
      };
    } catch (error) {
      console.error("Error processing audio:", error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process audio",
        variant: "destructive",
      });
    }
  };

  const playAudio = async (base64Audio: string) => {
    try {
      setIsSpeaking(true);

      // Convert base64 to audio
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsSpeaking(false);
      toast({
        title: "Error",
        description: "Failed to play audio response",
        variant: "destructive",
      });
    }
  };

  const clearConversation = () => {
    setConversationHistory([]);
    toast({
      title: "Cleared",
      description: "Conversation history cleared",
    });
  };

  return (
    <div className="flex flex-col h-full gap-6 p-6">
      <Card className="flex-1 overflow-hidden bg-background/95 backdrop-blur-xl border-primary/20 shadow-2xl">
        <ScrollArea className="h-full p-6">
          {conversationHistory.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <div>
                <Volume2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Start a voice conversation</p>
                <p className="text-sm mt-2">Click the microphone to speak with your Python AI tutor</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {conversationHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>

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
        
        {isProcessing && (
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500/30 blur-2xl scale-150 animate-pulse' 
                : 'bg-primary/20 blur-xl'
            }`} />
            {!isRecording ? (
              <Button
                onClick={startRecording}
                disabled={isProcessing || isSpeaking}
                size="lg"
                className="relative rounded-full w-24 h-24 bg-gradient-python hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <Mic className="w-10 h-10 text-white" />
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                size="lg"
                className="relative rounded-full w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 scale-95 transition-all duration-300 shadow-2xl"
              >
                <MicOff className="w-10 h-10 text-white" />
              </Button>
            )}
          </div>

          {conversationHistory.length > 0 && (
            <Button
              onClick={clearConversation}
              variant="outline"
              disabled={isRecording || isProcessing}
              className="hover:bg-destructive/10"
            >
              Clear History
            </Button>
          )}
        </div>

        <p className="text-sm text-center text-muted-foreground font-medium max-w-md">
          {isRecording
            ? "Tap to stop and send"
            : "Tap to speak with your AI tutor"}
        </p>
      </div>
    </div>
  );
};

export default VoiceConversation;
