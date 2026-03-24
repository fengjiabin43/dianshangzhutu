
export interface ProcessingState {
  isProcessing: boolean;
  error: string | null;
  originalImage: string | null;
  processedImage: string | null;
  targetSize: string;
  customWidth: string;
  customHeight: string;
  apiKey: string;
}

export interface ImageFile {
  file: File;
  preview: string;
}
