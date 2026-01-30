import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { ConversionProgress as ProgressType } from '@/lib/converters';

interface ConversionProgressProps {
  progress: ProgressType;
}

export function ConversionProgress({ progress }: ConversionProgressProps) {
  const percentage = Math.round((progress.current / progress.total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full p-6 bg-card rounded-2xl shadow-card"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 gradient-primary rounded-xl">
          <Loader2 className="w-6 h-6 text-primary-foreground animate-spin" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">{progress.status}</p>
          <p className="text-sm text-muted-foreground">
            {progress.current} / {progress.total}
          </p>
        </div>
        <span className="text-2xl font-bold text-primary">{percentage}%</span>
      </div>
      
      <Progress value={percentage} className="h-3" />
    </motion.div>
  );
}
