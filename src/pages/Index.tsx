import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PdfToImageConverter } from '@/components/PdfToImageConverter';
import { ImageToPdfConverter } from '@/components/ImageToPdfConverter';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { FileText, FileImage, ArrowRightLeft } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('pdf-to-image');

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container max-w-4xl py-8 md:py-16 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 mb-6 gradient-primary rounded-2xl shadow-glow"
          >
            <ArrowRightLeft className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
          </motion.div>
          
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Chuyển đổi{' '}
            <span className="text-gradient">PDF ↔ Ảnh</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Công cụ chuyển đổi miễn phí, bảo mật 100%.
          </p>
        </motion.div>

        {/* Privacy Badge */}
        <div className="mb-8 md:mb-12">
          <PrivacyBadge />
        </div>

        {/* Converter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8 h-14 p-1.5 bg-secondary rounded-2xl">
              <TabsTrigger 
                value="pdf-to-image" 
                className="flex items-center gap-2 rounded-xl data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft h-full font-semibold transition-all"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">PDF</span> → Ảnh
              </TabsTrigger>
              <TabsTrigger 
                value="image-to-pdf"
                className="flex items-center gap-2 rounded-xl data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft h-full font-semibold transition-all"
              >
                <FileImage className="w-4 h-4" />
                <span className="hidden sm:inline">Ảnh</span> → PDF
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pdf-to-image" className="mt-0">
              <PdfToImageConverter />
            </TabsContent>

            <TabsContent value="image-to-pdf" className="mt-0">
              <ImageToPdfConverter />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border">
            <h3 className="font-semibold text-foreground mb-2">
              🔒 Cam kết bảo mật
            </h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Tất cả quá trình chuyển đổi diễn ra hoàn toàn trên thiết bị của bạn. 
              Chúng tôi không có server lưu trữ, không thu thập dữ liệu, 
              đảm bảo 100% riêng tư cho file của bạn.
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
