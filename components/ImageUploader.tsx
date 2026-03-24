
import React, { useCallback } from 'react';

interface ImageUploaderProps {
  onImageSelect: (base64: string, mimeType: string) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, disabled }) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string, file.type);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  return (
    <div className="w-full">
      <label className={`
        flex flex-col items-center justify-center w-full h-64 
        border-2 border-dashed rounded-2xl cursor-pointer
        transition-all duration-300
        ${disabled ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50' : 'bg-white border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/50'}
      `}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <i className="fa-solid fa-cloud-arrow-up text-indigo-600 text-2xl"></i>
          </div>
          <p className="mb-2 text-sm text-gray-700 font-semibold">
            点击上传或拖拽图片至此处
          </p>
          <p className="text-xs text-gray-500">
            支持 PNG, JPG, 或 WEBP (最大 10MB)
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
};

export default ImageUploader;
