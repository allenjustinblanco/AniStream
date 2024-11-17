import { Button } from '@/components/ui/button';

export interface Provider {
  id: string;
  name: string;
  quality: string;
  type: 'sub' | 'dub';
}

interface VideoProvidersProps {
  providers: Provider[];
  selectedProvider: string;
  onProviderSelect: (providerId: string) => void;
}

export function VideoProviders({
  providers,
  selectedProvider,
  onProviderSelect,
}: VideoProvidersProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Video Providers</h3>
      <div className="flex flex-wrap gap-2">
        {providers.map((provider) => (
          <Button
            key={provider.id}
            variant={selectedProvider === provider.id ? "default" : "outline"}
            onClick={() => onProviderSelect(provider.id)}
            className="flex items-center gap-2"
          >
            {provider.name}
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/20">
              {provider.quality} {provider.type.toUpperCase()}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}