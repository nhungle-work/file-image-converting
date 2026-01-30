import { motion } from 'framer-motion';
import { Download, FileImage, FileText, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ConvertedFile } from '@/lib/converters';
import { downloadFile, createZip } from '@/lib/converters';
import { useState } from 'react';

interface ConversionResultsProps {
  files: ConvertedFile[];
  type: 'images' | 'pdf';
  onReset: () => void;
}

export function ConversionResults({ files, type, onReset }: ConversionResultsProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadAll = async () => {
    if (files.length === 1) {
      downloadFile(files[0]);
      return;
    }

    setDownloading(true);
    try {
      const zip = await createZip(files, 'converted_files.zip');
      downloadFile(zip);
    } finally {
      setDownloading(false);
    }
  };

  const IconComponent = type === 'pdf' ? FileText : FileImage;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full p-6 bg-card rounded-2xl shadow-card space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 gradient-accent rounded-xl">
            <IconComponent className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Chuyển đổi thành công!
            </h3>
            <p className="text-sm text-muted-foreground">
              {files.length} file{files.length > 1 ? 's' : ''} đã sẵn sàng
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {files.map((file, index) => (
          <motion.div
            key={file.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <IconComponent className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm font-medium truncate">{file.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadFile(file)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Download className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleDownloadAll}
          disabled={downloading}
          className="flex-1 gradient-primary text-primary-foreground hover:opacity-90"
        >
          {downloading ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Package className="w-4 h-4" />
              </motion.div>
              Đang nén...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              {files.length > 1 ? 'Tải tất cả (ZIP)' : 'Tải xuống'}
            </span>
          )}
        </Button>
        <Button variant="outline" onClick={onReset}>
          Chuyển đổi tiếp
        </Button>
      </div>
    </motion.div>
  );
}
