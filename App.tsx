
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import { retouchImage } from './services/geminiService';
import { ProcessingState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({
    isProcessing: false,
    error: null,
    originalImage: null,
    processedImage: null,
    targetSize: '800x800',
    customWidth: '800',
    customHeight: '800',
    apiKey: '',
  });

  const handleImageSelect = useCallback((base64: string, mimeType: string) => {
    setState(prev => ({
      ...prev,
      originalImage: base64,
      processedImage: null,
      error: null
    }));
  }, []);

  const handleRetouch = async () => {
    if (!state.originalImage) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const mimeType = state.originalImage.split(';')[0].split(':')[1];
      const result = await retouchImage(state.originalImage, mimeType, state.apiKey);
      
      // Resize the image if needed
      let finalImage = result;
      if (state.targetSize) {
        let width = 800;
        let height = 800;
        if (state.targetSize === '800x800') {
          width = 800; height = 800;
        } else if (state.targetSize === '1200x1200') {
          width = 1200; height = 1200;
        } else if (state.targetSize === 'custom') {
          width = parseInt(state.customWidth) || 800;
          height = parseInt(state.customHeight) || 800;
        }
        
        finalImage = await resizeImage(result, width, height);
      }

      setState(prev => ({ ...prev, processedImage: finalImage, isProcessing: false }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: err instanceof Error ? err.message : "处理图片时发生未知错误。"
      }));
    }
  };

  const resizeImage = (base64Str: string, width: number, height: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fill with white background in case of transparency
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          
          // Calculate aspect ratio fit
          const scale = Math.min(width / img.width, height / img.height);
          const x = (width / 2) - (img.width / 2) * scale;
          const y = (height / 2) - (img.height / 2) * scale;
          
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          resolve(canvas.toDataURL('image/jpeg', 0.95));
        } else {
          resolve(base64Str);
        }
      };
    });
  };

  const handleDownload = () => {
    if (!state.processedImage) return;
    const link = document.createElement('a');
    link.href = state.processedImage;
    link.download = `智能修图-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setState(prev => ({
      ...prev,
      isProcessing: false,
      error: null,
      originalImage: null,
      processedImage: null,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-3">
            电商产品 <span className="text-indigo-600">完美主图</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500">
            将普通服装产品瞬间转换为专业影棚级素材
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Original Image & Controls */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-700 flex items-center gap-2">
                <i className="fa-solid fa-upload text-indigo-500"></i> 上传原始图
              </span>
              {state.originalImage && (
                <button onClick={reset} className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors">
                  重新选择
                </button>
              )}
            </div>

            {!state.originalImage ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <ImageUploader onImageSelect={handleImageSelect} />
              </div>
            ) : (
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
                <img 
                  src={state.originalImage} 
                  alt="Original" 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}

            {/* Controls */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API 密钥 (可选)</label>
                <input 
                  type="password" 
                  placeholder="输入您的自定义 API Key..."
                  value={state.apiKey}
                  onChange={(e) => setState(prev => ({ ...prev, apiKey: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">留空则使用系统默认密钥</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">输出尺寸</label>
                <div className="flex flex-wrap gap-3">
                  {['800x800', '1200x1200', 'custom'].map((size) => (
                    <label key={size} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${state.targetSize === size ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      <input 
                        type="radio" 
                        name="targetSize" 
                        value={size} 
                        checked={state.targetSize === size}
                        onChange={(e) => setState(prev => ({ ...prev, targetSize: e.target.value }))}
                        className="hidden"
                      />
                      <span className="text-sm font-medium">
                        {size === 'custom' ? '自定义' : size}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {state.targetSize === 'custom' && (
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">宽度 (px)</label>
                    <input 
                      type="number" 
                      value={state.customWidth}
                      onChange={(e) => setState(prev => ({ ...prev, customWidth: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">高度 (px)</label>
                    <input 
                      type="number" 
                      value={state.customHeight}
                      onChange={(e) => setState(prev => ({ ...prev, customHeight: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={handleRetouch}
                disabled={!state.originalImage || state.isProcessing}
                className={`w-full py-3 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                  !state.originalImage 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : state.isProcessing
                      ? 'bg-indigo-400 text-white cursor-wait'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                }`}
              >
                {state.isProcessing ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> 处理中...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles"></i> 开始生成
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Processed Preview */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-base font-bold text-indigo-600 flex items-center gap-2">
                <i className="fa-solid fa-sparkles"></i> 输出结果
              </span>
              {state.processedImage && (
                <button 
                  onClick={handleDownload}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-bold transition-colors flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100"
                >
                  <i className="fa-solid fa-download"></i> 下载图片
                </button>
              )}
            </div>
            
            <div className="relative flex-grow rounded-xl overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
              {state.isProcessing ? (
                <div className="flex flex-col items-center gap-6 px-10 text-center">
                   <div className="space-y-3">
                      <p className="text-gray-800 font-bold">AI 正在处理中...</p>
                      <div className="h-1.5 w-48 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 animate-[loading_1.5s_ease-in-out_infinite]"></div>
                      </div>
                   </div>
                </div>
              ) : state.processedImage ? (
                <img 
                  src={state.processedImage} 
                  alt="Processed" 
                  className="max-h-full max-w-full object-contain shadow-lg animate-in zoom-in-95 duration-500"
                />
              ) : (
                <div className="text-gray-400 text-center px-10">
                  <i className="fa-solid fa-image text-5xl mb-4 opacity-20"></i>
                  <p className="text-sm">上传图片并点击生成后，结果将显示在此处</p>
                </div>
              )}
            </div>

            {state.error && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
                <i className="fa-solid fa-triangle-exclamation text-red-500 mt-1"></i>
                <div>
                  <h3 className="text-red-800 font-bold text-sm">处理失败</h3>
                  <p className="text-red-700 text-xs mt-1">{state.error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">&copy; 2024 AI 产品智能修图专家. 由 Gemini 2.5 Flash Image 提供支持。</p>
        </div>
      </footer>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default App;
