import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Video, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CameraCaptureProps {
  onAnalysis: (analysis: string) => void;
  disabled?: boolean;
}

export const CameraCapture = ({ onAnalysis, disabled }: CameraCaptureProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processFile = async (file: File, type: 'image' | 'video') => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Content = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('image-analysis', {
          body: { 
            content: base64Content,
            type: type,
            mimeType: file.type
          }
        });

        if (error) {
          throw error;
        }

        if (data?.analysis) {
          onAnalysis(data.analysis);
          toast({
            title: "Success",
            description: `${type === 'image' ? 'Image' : 'Video'} analyzed successfully!`,
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: `Failed to analyze ${type}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file, 'image');
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      processFile(file, 'video');
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Create a simple modal for camera preview
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.8); display: flex; align-items: center; 
        justify-content: center; z-index: 1000;
      `;
      
      const container = document.createElement('div');
      container.style.cssText = 'background: white; padding: 20px; border-radius: 10px;';
      
      video.style.cssText = 'width: 400px; height: 300px; border-radius: 10px;';
      
      const captureBtn = document.createElement('button');
      captureBtn.textContent = 'Capture Photo';
      captureBtn.style.cssText = `
        margin: 10px; padding: 10px 20px; background: #007bff; 
        color: white; border: none; border-radius: 5px; cursor: pointer;
      `;
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close';
      closeBtn.style.cssText = `
        margin: 10px; padding: 10px 20px; background: #6c757d; 
        color: white; border: none; border-radius: 5px; cursor: pointer;
      `;

      captureBtn.onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            processFile(new File([blob], 'capture.jpg', { type: 'image/jpeg' }), 'image');
          }
        }, 'image/jpeg');
        
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      };

      closeBtn.onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      };

      container.appendChild(video);
      container.appendChild(document.createElement('br'));
      container.appendChild(captureBtn);
      container.appendChild(closeBtn);
      modal.appendChild(container);
      document.body.appendChild(modal);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="hidden"
      />
      
      <Button
        onClick={openCamera}
        disabled={disabled || isProcessing}
        variant="ghost"
        className="w-full justify-start gap-3 h-12"
      >
        {isProcessing ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Camera size={18} />
        )}
        <span>{isProcessing ? "Processing..." : "Take Photo"}</span>
      </Button>

      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isProcessing}
        variant="ghost"
        className="w-full justify-start gap-3 h-12"
      >
        <Upload size={18} />
        <span>Upload Image</span>
      </Button>

      <Button
        onClick={() => videoInputRef.current?.click()}
        disabled={disabled || isProcessing}
        variant="ghost"
        className="w-full justify-start gap-3 h-12"
      >
        <Video size={18} />
        <span>Upload Video</span>
      </Button>
    </div>
  );
};