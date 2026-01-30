import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileImage, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropZoneProps {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  files: File[];
  onRemoveFile: (index: number) => void;
  title: string;
  description: string;
  icon: 'pdf' | 'image';
}

export function FileDropZone({
  accept,
  multiple = false,
  onFilesSelected,
  files,
  onRemoveFile,
  title,
  description,
  icon
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    onFilesSelected(droppedFiles);
  }, [onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      onFilesSelected(selectedFiles);
    }
  }, [onFilesSelected]);

  const IconComponent = icon === 'pdf' ? FileText : FileImage;

  return (
    <div className="space-y-4">
      <motion.label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[200px] p-8",
          "border-2 border-dashed rounded-2xl cursor-pointer",
          "transition-all duration-300 ease-out",
          isDragOver
            ? "border-primary bg-primary/5 shadow-glow scale-[1.02]"
            : "border-border bg-card hover:border-primary/50 hover:bg-secondary/50"
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <motion.div
          animate={{ y: isDragOver ? -5 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className={cn(
            "p-4 rounded-2xl transition-colors duration-300",
            isDragOver ? "bg-primary/10" : "bg-secondary"
          )}>
            {isDragOver ? (
              <Upload className="w-10 h-10 text-primary" />
            ) : (
              <IconComponent className="w-10 h-10 text-primary" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-semibold text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </motion.div>
      </motion.label>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <IconComponent className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  onClick={() => onRemoveFile(index)}
                  className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-destructive" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
