import { pdfjsLib } from './pdfWorker';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import heic2any from 'heic2any';

export type ImageFormat = 'png' | 'jpeg' | 'jpg';

// Supported image formats for conversion
export const SUPPORTED_IMAGE_FORMATS = [
  'image/png',
  'image/jpeg', 
  'image/jpg',
  'image/webp',
  'image/heic',
  'image/heif'
];

export interface ConversionProgress {
  current: number;
  total: number;
  status: string;
}

export interface ConvertedFile {
  name: string;
  blob: Blob;
  url: string;
}

// Convert HEIC/HEIF to JPEG
async function convertHeicToJpeg(file: File): Promise<Blob> {
  const result = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.92
  });
  return Array.isArray(result) ? result[0] : result;
}

// Check if file is HEIC/HEIF
function isHeicFile(file: File): boolean {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return type === 'image/heic' || type === 'image/heif' || 
         name.endsWith('.heic') || name.endsWith('.heif');
}

// PDF to Images conversion
export async function pdfToImages(
  file: File,
  format: ImageFormat = 'png',
  quality: number = 0.92,
  onProgress?: (progress: ConversionProgress) => void
): Promise<ConvertedFile[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;
  const results: ConvertedFile[] = [];

  for (let i = 1; i <= totalPages; i++) {
    onProgress?.({
      current: i,
      total: totalPages,
      status: `Đang chuyển đổi trang ${i}/${totalPages}...`
    });

    const page = await pdf.getPage(i);
    const scale = 2; // Higher scale for better quality
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas
    }).promise;

    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const extension = format;
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), mimeType, quality);
    });

    const baseName = file.name.replace(/\.pdf$/i, '');
    const fileName = totalPages > 1 
      ? `${baseName}_trang_${i}.${extension}`
      : `${baseName}.${extension}`;

    results.push({
      name: fileName,
      blob,
      url: URL.createObjectURL(blob)
    });
  }

  return results;
}

// Images to PDF conversion
export async function imagesToPdf(
  files: File[],
  onProgress?: (progress: ConversionProgress) => void
): Promise<ConvertedFile> {
  const pdfDoc = await PDFDocument.create();
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.({
      current: i + 1,
      total: files.length,
      status: `Đang xử lý ảnh ${i + 1}/${files.length}...`
    });

    let processedFile = file;
    
    // Convert HEIC/HEIF to JPEG first
    if (isHeicFile(file)) {
      onProgress?.({
        current: i + 1,
        total: files.length,
        status: `Đang chuyển đổi HEIC/HEIF ${i + 1}/${files.length}...`
      });
      const jpegBlob = await convertHeicToJpeg(file);
      processedFile = new File([jpegBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' });
    }
    
    const arrayBuffer = await processedFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    let image;
    const fileType = processedFile.type.toLowerCase();
    
    if (fileType === 'image/png') {
      image = await pdfDoc.embedPng(uint8Array);
    } else if (fileType === 'image/jpeg' || fileType === 'image/jpg') {
      image = await pdfDoc.embedJpg(uint8Array);
    } else {
      // For other formats (WEBP, etc.), convert to PNG via canvas
      const imgElement = await loadImage(processedFile);
      const canvas = document.createElement('canvas');
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(imgElement, 0, 0);
      
      const pngBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png');
      });
      const pngBuffer = await pngBlob.arrayBuffer();
      image = await pdfDoc.embedPng(new Uint8Array(pngBuffer));
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  onProgress?.({
    current: files.length,
    total: files.length,
    status: 'Đang tạo file PDF...'
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  
  const firstName = files[0]?.name || 'images';
  const baseName = firstName.replace(/\.[^.]+$/, '');
  const fileName = files.length > 1 
    ? `${baseName}_va_${files.length - 1}_anh_khac.pdf`
    : `${baseName}.pdf`;

  return {
    name: fileName,
    blob,
    url: URL.createObjectURL(blob)
  };
}

// Helper to load image
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Create ZIP from multiple files
export async function createZip(
  files: ConvertedFile[],
  zipName: string
): Promise<ConvertedFile> {
  const zip = new JSZip();
  
  for (const file of files) {
    zip.file(file.name, file.blob);
  }
  
  const blob = await zip.generateAsync({ type: 'blob' });
  
  return {
    name: zipName,
    blob,
    url: URL.createObjectURL(blob)
  };
}

// Download file
export function downloadFile(file: ConvertedFile) {
  const link = document.createElement('a');
  link.href = file.url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Cleanup URLs
export function cleanupUrls(files: ConvertedFile[]) {
  files.forEach(file => URL.revokeObjectURL(file.url));
}
