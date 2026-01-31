import * as pdfjsLib from 'pdfjs-dist';

// Set worker source to use local bundled worker (avoids CDN supply chain risk)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export { pdfjsLib };
