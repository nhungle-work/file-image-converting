import { motion } from 'framer-motion';
import { Shield, Lock, Eye } from 'lucide-react';

export function PrivacyBadge() {
  const features = [
    { icon: Shield, text: 'Xử lý 100% trên trình duyệt' },
    { icon: Lock, text: 'Không upload lên server' },
    { icon: Eye, text: 'Bảo mật tuyệt đối' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-wrap justify-center gap-4 md:gap-6"
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.text}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full"
        >
          <feature.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{feature.text}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
