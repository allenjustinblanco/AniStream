import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface VideoModalProps {
  embedUrl: string;
  title: string;
  onClose: () => void;
}

export function VideoModal({ embedUrl, title, onClose }: VideoModalProps) {
  const [isMuted, setIsMuted] = useState(true);

  // Add mute parameter to URL
  const videoUrl = new URL(embedUrl);
  videoUrl.searchParams.set('mute', isMuted ? '1' : '0');

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="fixed inset-0 flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-5xl">
          {/* Header */}
          <div className="absolute -top-12 left-0 right-0 flex items-center justify-between text-foreground">
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="text-foreground hover:text-primary"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-primary"
                onClick={onClose}
              >
                ×
              </Button>
            </div>
          </div>
          
          {/* Video player */}
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl">
            <iframe
              src={videoUrl.toString()}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      </div>
    </div>
  );
}