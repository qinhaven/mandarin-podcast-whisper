import { CheckCircle, Circle, Loader } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  description: string;
}

interface ProcessingStatusProps {
  steps: ProcessingStep[];
}

export function ProcessingStatus({ steps }: ProcessingStatusProps) {
  const getStepIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-accent" />;
      case 'processing':
        return <Loader className="h-5 w-5 text-primary animate-spin" />;
      case 'error':
        return <Circle className="h-5 w-5 text-destructive" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStepStyles = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return 'border-accent/20 bg-accent/5';
      case 'processing':
        return 'border-primary/20 bg-primary/5 animate-pulse-glow';
      case 'error':
        return 'border-destructive/20 bg-destructive/5';
      default:
        return 'border-border bg-card';
    }
  };

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <Card 
          key={step.id} 
          className={`p-4 transition-all duration-500 ${getStepStyles(step.status)}`}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {getStepIcon(step.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">{step.label}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  step.status === 'completed' ? 'bg-accent/10 text-accent' :
                  step.status === 'processing' ? 'bg-primary/10 text-primary' :
                  step.status === 'error' ? 'bg-destructive/10 text-destructive' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {step.status === 'processing' ? 'Processing...' : 
                   step.status === 'completed' ? 'Completed' :
                   step.status === 'error' ? 'Error' : 'Pending'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              
              {/* Progress bar for processing steps */}
              {step.status === 'processing' && (
                <div className="mt-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full animate-pulse w-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}