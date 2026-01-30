import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDropZone } from './FileDropZone';
import { ConversionProgress } from './ConversionProgress';
import { ConversionResults } from './ConversionResults';
import { Button } from '@/components/ui/button';
import { imagesToPdf, cleanupUrls, type ConversionProgress as ProgressType, type ConvertedFile } from '@/lib/converters';
import { Wand2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';

export function ImageToPdfConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<ProgressType | null>(null);
  const [results, setResults] = useState<ConvertedFile[]>([]);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles.filter(f => 
      f.type.startsWith('image/') && 
      (f.type === 'image/png' || f.type === 'image/jpeg' || f.type === 'image/jpg' || f.type === 'image/webp')
    );
    if (imageFiles.length > 0) {
      setFiles(prev => [...prev, ...imageFiles]);
      setResults([]);
    }
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const moveFile = (index: number, direction: 'up' | 'down') => {
    setFiles(prev => {
      const newFiles = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= newFiles.length) return prev;
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      return newFiles;
    });
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    setProgress({ current: 0, total: files.length, status: 'Đang chuẩn bị...' });

    try {
      const converted = await imagesToPdf(files, setProgress);
      setResults([converted]);
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      setIsConverting(false);
      setProgress(null);
    }
  };

  const handleReset = () => {
    cleanupUrls(results);
    setResults([]);
    setFiles([]);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {results.length > 0 ? (
          <ConversionResults
            key="results"
            files={results}
            type="pdf"
            onReset={handleReset}
          />
        ) : isConverting && progress ? (
          <ConversionProgress key="progress" progress={progress} />
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <FileDropZone
              accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
              multiple
              onFilesSelected={handleFilesSelected}
              files={[]}
              onRemoveFile={() => {}}
              title="Kéo thả ảnh vào đây"
              description="PNG, JPG, WEBP • Chọn nhiều ảnh cùng lúc"
              icon="image"
            />

            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-card rounded-2xl shadow-card space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    Thứ tự trang ({files.length} ảnh)
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Kéo để sắp xếp
                  </p>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {files.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${index}`}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 p-3 bg-secondary/50 rounded-xl"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                      <span className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm font-medium truncate">{file.name}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveFile(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveFile(index, 'down')}
                          disabled={index === files.length - 1}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleRemoveFile(index)}
                        >
                          ×
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={handleConvert}
                  size="lg"
                  className="w-full gradient-primary text-primary-foreground hover:opacity-90 h-12"
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  Tạo file PDF
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
