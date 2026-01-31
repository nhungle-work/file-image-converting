import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDropZone } from './FileDropZone';
import { ConversionProgress } from './ConversionProgress';
import { ConversionResults } from './ConversionResults';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { pdfToImages, cleanupUrls, type ConversionProgress as ProgressType, type ConvertedFile, type ImageFormat } from '@/lib/converters';
import { Wand2 } from 'lucide-react';

export function PdfToImageConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState([92]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<ProgressType | null>(null);
  const [results, setResults] = useState<ConvertedFile[]>([]);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    const pdfFiles = newFiles.filter(f => f.type === 'application/pdf');
    if (pdfFiles.length > 0) {
      setFiles([pdfFiles[0]]); // Only one PDF at a time
      setResults([]);
    }
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    setProgress({ current: 0, total: 1, status: 'Đang chuẩn bị...' });

    try {
      const converted = await pdfToImages(
        files[0],
        format,
        quality[0] / 100,
        setProgress
      );
      setResults(converted);
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
            type="images"
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
              accept=".pdf,application/pdf"
              onFilesSelected={handleFilesSelected}
              files={files}
              onRemoveFile={handleRemoveFile}
              title="Kéo thả file PDF vào đây"
              description="hoặc click để chọn file"
              icon="pdf"
            />

            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-card rounded-2xl shadow-card space-y-6"
              >
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Định dạng đầu ra</Label>
                  <RadioGroup
                    value={format}
                    onValueChange={(v) => setFormat(v as ImageFormat)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="png" id="png" />
                      <Label htmlFor="png" className="font-medium cursor-pointer">PNG</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="jpg" id="jpg" />
                      <Label htmlFor="jpg" className="font-medium cursor-pointer">JPG</Label>
                    </div>
                  </RadioGroup>
                </div>

                {format === 'jpg' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-semibold">Chất lượng</Label>
                      <span className="text-sm font-medium text-primary">{quality[0]}%</span>
                    </div>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      min={50}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </motion.div>
                )}

                <Button
                  onClick={handleConvert}
                  size="lg"
                  className="w-full gradient-primary text-primary-foreground hover:opacity-90 h-12"
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  Chuyển đổi ngay
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
