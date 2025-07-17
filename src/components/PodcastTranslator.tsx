import { useState } from 'react';
import { Languages, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileUploadArea } from './FileUploadArea';
import { ProcessingStatus, ProcessingStep } from './ProcessingStatus';
import { AudioPlayer } from './AudioPlayer';

export function PodcastTranslator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [translatedAudioUrl, setTranslatedAudioUrl] = useState<string | null>(null);
  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: 'transcribe',
      label: 'Transcribe Audio',
      status: 'pending',
      description: 'Converting speech to English text using AI transcription'
    },
    {
      id: 'translate',
      label: 'Translate to Mandarin',
      status: 'pending',
      description: 'Translating English text to Mandarin Chinese'
    },
    {
      id: 'synthesize',
      label: 'Generate Speech',
      status: 'pending',
      description: 'Creating natural Mandarin audio from translated text'
    }
  ]);

  const { toast } = useToast();

  const updateStepStatus = (stepId: string, status: ProcessingStep['status']) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const simulateProcessing = async () => {
    setIsProcessing(true);
    
    try {
      // Step 1: Transcribe
      updateStepStatus('transcribe', 'processing');
      await new Promise(resolve => setTimeout(resolve, 3000));
      updateStepStatus('transcribe', 'completed');
      
      // Step 2: Translate
      updateStepStatus('translate', 'processing');
      await new Promise(resolve => setTimeout(resolve, 2500));
      updateStepStatus('translate', 'completed');
      
      // Step 3: Synthesize
      updateStepStatus('synthesize', 'processing');
      await new Promise(resolve => setTimeout(resolve, 4000));
      updateStepStatus('synthesize', 'completed');
      
      // Create a mock audio URL (in real implementation, this would be the actual result)
      const mockAudioBlob = new Blob([new ArrayBuffer(1000)], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(mockAudioBlob);
      setTranslatedAudioUrl(audioUrl);
      
      toast({
        title: "Translation Complete!",
        description: "Your podcast has been successfully translated to Mandarin.",
      });
    } catch (error) {
      toast({
        title: "Translation Failed",
        description: "An error occurred during processing. Please try again.",
        variant: "destructive",
      });
      // Reset all steps to pending on error
      setSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const })));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartTranslation = () => {
    if (!selectedFile) return;
    
    // Reset previous results
    setTranslatedAudioUrl(null);
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const })));
    
    simulateProcessing();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setTranslatedAudioUrl(null);
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const })));
  };

  const handleDownload = () => {
    if (!translatedAudioUrl) return;
    
    const link = document.createElement('a');
    link.href = translatedAudioUrl;
    link.download = `${selectedFile?.name?.replace('.mp3', '')}_translated.wav` || 'translated_audio.wav';
    link.click();
    
    toast({
      title: "Download Started",
      description: "Your translated audio file is being downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-primary mr-3">
              <Languages className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Podcast Translator
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your English podcasts into natural Mandarin Chinese with AI-powered 
            translation and speech synthesis
          </p>
        </div>

        <div className="space-y-8">
          {/* File Upload */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">1. Upload Podcast File</h2>
            <FileUploadArea 
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
              onRemoveFile={handleRemoveFile}
              disabled={isProcessing}
            />
          </div>

          {/* Translate Button */}
          {selectedFile && !translatedAudioUrl && (
            <div className="text-center">
              <Button
                onClick={handleStartTranslation}
                disabled={isProcessing}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all text-lg px-8 py-6"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {isProcessing ? 'Translating...' : 'Translate & Speak'}
              </Button>
            </div>
          )}

          {/* Processing Status */}
          {(isProcessing || steps.some(step => step.status !== 'pending')) && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground">2. Processing Status</h2>
              <ProcessingStatus steps={steps} />
            </div>
          )}

          {/* Audio Player */}
          {translatedAudioUrl && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground">3. Translated Audio</h2>
              <AudioPlayer
                audioUrl={translatedAudioUrl}
                fileName={`${selectedFile?.name?.replace('.mp3', '')}_translated.wav` || 'translated_audio.wav'}
                onDownload={handleDownload}
              />
            </div>
          )}

          {/* Info Card */}
          <Card className="p-6 bg-gradient-muted border-primary/10">
            <h3 className="font-semibold text-foreground mb-3">How it works:</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• <strong>Transcription:</strong> AI converts your audio to English text</p>
              <p>• <strong>Translation:</strong> Advanced language models translate to Mandarin</p>
              <p>• <strong>Speech Synthesis:</strong> Natural-sounding Mandarin voice generation</p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Note: This is a demo version. For production use, you'll need to integrate with 
              real transcription, translation, and text-to-speech APIs.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}