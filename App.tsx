import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Upload, 
  Type, 
  Loader2, 
  Camera,
  ChevronRight,
  FileText,
  Shuffle
} from 'lucide-react';
import clsx from 'clsx';
import { ExamType, EssayType, EssayConfig, GradingResult } from './types';
import { gradeEssay } from './services/geminiService';
import { PAST_PAPERS } from './constants';
import ResultDisplay from './components/ResultDisplay';

function App() {
  // Configuration State
  const [examType, setExamType] = useState<ExamType>(ExamType.ENGLISH_II);
  const [essayType, setEssayType] = useState<EssayType>(EssayType.PART_B);
  const [question, setQuestion] = useState<string>('');
  
  // New State for Year Selection
  const [selectedYear, setSelectedYear] = useState<string>('');
  
  // Calculate available years from data
  const availableYears = Array.from(new Set(PAST_PAPERS.map(p => p.year))).sort((a, b) => b - a);
  
  // Input State
  const [inputType, setInputType] = useState<'text' | 'image'>('text');
  const [textInput, setTextInput] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // App State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GradingResult | null>(null);

  // Auto-update question when Year, ExamType or EssayType changes
  useEffect(() => {
    if (!selectedYear) return;
    
    const year = parseInt(selectedYear);
    // Find matching paper. Logic: 
    // 1. Must match Year and EssayType.
    // 2. Match ExamType OR fallback to English II (since dataset is predominantly English II)
    const paper = PAST_PAPERS.find(p => 
      p.year === year && 
      p.essayType === essayType && 
      (p.examType === examType || p.examType === ExamType.ENGLISH_II)
    );

    if (paper) {
      setQuestion(paper.content);
    } else {
      // If no exact match found for this specific combo (e.g. English I specific year missing), 
      // we could clear it, but keeping the English II fallback handles most cases.
      // If strictly nothing found:
      setQuestion(`暂无 ${year}年 ${examType} ${essayType} 的真题数据。`);
    }
  }, [selectedYear, examType, essayType]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    // If user manually edits, clear the year selection to indicate "Custom"
    setSelectedYear('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRandomTopic = () => {
    // Filter relevant topics
    const candidates = PAST_PAPERS.filter(p => 
      p.essayType === essayType && 
      (p.examType === examType || p.examType === ExamType.ENGLISH_II) 
    );

    if (candidates.length > 0) {
      const random = candidates[Math.floor(Math.random() * candidates.length)];
      // Setting the year will trigger the useEffect to update the question text
      setSelectedYear(random.year.toString());
      setError(null);
    } else {
      setError("暂无该类型的真题，请手动输入题目。");
    }
  };

  const handleGrade = async () => {
    if (!question.trim()) {
      setError("请输入或随机选择题目要求 (Question/Prompt)。");
      return;
    }
    
    if (inputType === 'text' && !textInput.trim()) {
      setError("请输入您的作文内容。");
      return;
    }

    if (inputType === 'image' && !imageFile) {
      setError("请上传作文图片。");
      return;
    }

    setLoading(true);
    setError(null);

    const config: EssayConfig = {
      examType,
      essayType,
      question
    };

    try {
      const input = inputType === 'text' ? textInput : imageFile!;
      const data = await gradeEssay(input, config);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生意外错误，请重试。");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setTextInput('');
    setImageFile(null);
    setImagePreview(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">
                考研作文<span className="text-blue-600">智能批改</span>
              </span>
            </div>
            <div className="text-sm text-slate-500 hidden sm:block">
              AI-Powered English Composition Correction
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {result ? (
           <ResultDisplay result={result} onReset={handleReset} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Configuration */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Card 1: Exam Settings */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">1</span>
                  考试设置 (Settings)
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">考试类型 (Exam Type)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[ExamType.ENGLISH_I, ExamType.ENGLISH_II].map((type) => (
                        <button
                          key={type}
                          onClick={() => setExamType(type)}
                          className={clsx(
                            "px-4 py-2 text-sm rounded-lg border transition-all",
                            examType === type 
                              ? "bg-blue-50 border-blue-500 text-blue-700 font-medium" 
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {type === ExamType.ENGLISH_I ? '英语一 (English I)' : '英语二 (English II)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">题目类型 (Section)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[EssayType.PART_A, EssayType.PART_B].map((type) => (
                        <button
                          key={type}
                          onClick={() => setEssayType(type)}
                          className={clsx(
                            "px-4 py-2 text-sm rounded-lg border transition-all",
                            essayType === type 
                              ? "bg-blue-50 border-blue-500 text-blue-700 font-medium" 
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {type === EssayType.PART_A ? '小作文 (Part A)' : '大作文 (Part B)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Year Selection Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">选择真题年份 (Past Paper Year)</label>
                    <div className="relative">
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">自定义题目 (Custom Topic)</option>
                        {availableYears.map(year => (
                          <option key={year} value={year}>{year}年真题</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <ChevronRight className="h-4 w-4 rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Question Prompt */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">2</span>
                     题目要求 (Prompt)
                  </h2>
                  <button 
                    onClick={handleRandomTopic}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                    title="随机选择一年真题"
                  >
                    <Shuffle className="w-3 h-3" />
                    随机真题
                  </button>
                </div>
                <textarea
                  value={question}
                  onChange={handleQuestionChange}
                  placeholder="在此输入题目要求、图表描述或选择随机真题..."
                  className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
                />
              </div>
            </div>

            {/* Right Column: Essay Input */}
            <div className="lg:col-span-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
                 <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                   <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">3</span>
                   你的作文 (Your Response)
                </h2>

                {/* Input Method Tabs */}
                <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-6 w-fit">
                  <button
                    onClick={() => setInputType('text')}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                      inputType === 'text' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <Type className="w-4 h-4" />
                    文本输入
                  </button>
                  <button
                    onClick={() => setInputType('image')}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                      inputType === 'image' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <Camera className="w-4 h-4" />
                    拍照/上传
                  </button>
                </div>

                {/* Input Area */}
                <div className="flex-1 min-h-[300px]">
                  {inputType === 'text' ? (
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="在此开始写作..."
                      className="w-full h-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base leading-relaxed font-serif"
                    />
                  ) : (
                    <div className="h-full border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors relative overflow-hidden group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                           <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-4" />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-white font-medium flex items-center gap-2">
                                <Upload className="w-5 h-5" /> 点击更换图片
                              </p>
                           </div>
                        </div>
                      ) : (
                        <div className="text-center p-8">
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-medium text-slate-700">点击上传作文图片</p>
                          <p className="text-xs text-slate-500 mt-1">支持 JPG, PNG (最大 5MB)</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Footer */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100 pt-6">
                   <div className="text-xs text-slate-400">
                     * 评分标准基于2025年考研大纲
                   </div>
                   <div className="w-full sm:w-auto">
                     {error && <p className="text-red-500 text-sm mb-2 text-right">{error}</p>}
                     <button
                        onClick={handleGrade}
                        disabled={loading}
                        className={clsx(
                          "w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all shadow-md hover:shadow-lg transform active:scale-95",
                          loading ? "bg-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        )}
                     >
                       {loading ? (
                         <>
                           <Loader2 className="w-5 h-5 animate-spin" />
                           正在评分...
                         </>
                       ) : (
                         <>
                           开始智能评分
                           <ChevronRight className="w-5 h-5" />
                         </>
                       )}
                     </button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;