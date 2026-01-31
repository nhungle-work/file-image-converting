import * as pdfjsLib from 'pdfjs-dist';

// Set worker source to match the installed version
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js`;

export { pdfjsLib };
