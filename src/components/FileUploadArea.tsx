import { useCallback, useState } from 'react';
import { Upload, FileAudio, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FileUploadAreaProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemoveFile: () => void;
  disabled?: boolean;
}

export function FileUploadArea({ onFileSelect, selectedFile, onRemoveFile, disabled }: FileUploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    const mp3File = files.find(file => file.type === 'audio/mpeg' || file.name.endsWith('.mp3'));
    
    if (mp3File) {
      onFileSelect(mp3File);
    }
  }, [onFileSelect, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'audio/mpeg' || file.name.endsWith('.mp3'))) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (selectedFile) {
    return (
      <Card className="border-2 border-primary/20 bg-gradient-muted p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileAudio className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveFile}
            disabled={disabled}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`border-2 border-dashed transition-all duration-300 cursor-pointer ${
        isDragOver 
          ? 'border-primary bg-primary/5 animate-pulse-glow' 
          : 'border-border hover:border-primary/50 hover:bg-primary/5'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="p-8 text-center">
        <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-primary w-fit">
          <Upload className="h-8 w-8 text-primary-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Upload Your Podcast</h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop your .mp3 file here, or click to browse
        </p>
        <input
          type="file"
          accept=".mp3,audio/mpeg"
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
          id="file-upload"
        />
        <label 
          htmlFor="file-upload" 
          className={`inline-block px-6 py-2 bg-gradient-primary text-primary-foreground font-medium rounded-lg transition-all hover:shadow-glow ${
            disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer'
          }`}
        >
          Choose File
        </label>
        <p className="text-xs text-muted-foreground mt-2">
          Only .mp3 files are supported
        </p>
      </div>
    </Card>
  );
}