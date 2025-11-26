import React, { useState } from 'react';
import { GradingResult } from '../types';
import ScoreRadar from './ScoreRadar';
import { CheckCircle2, AlertCircle, BookOpen, Lightbulb, ArrowRight, X } from 'lucide-react';
import clsx from 'clsx';

interface ResultDisplayProps {
  result: GradingResult;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'correction'>('overview');

  const getScoreColor = (score: number, max: number) => {
    const percentage = score / max;
    if (percentage >= 0.8) return 'text-emerald-600';
    if (percentage >= 0.6) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider">
               {result.band}
             </span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            <span className={getScoreColor(result.totalScore, result.maxScore)}>
              {result.totalScore}
            </span>
            <span className="text-slate-400 text-xl"> / {result.maxScore}</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">总分 (Total Score)</p>
        </div>
        <button 
          onClick={onReset}
          className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-full transition-colors"
          title="批改下一篇"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={clsx(
            "flex-1 py-3 text-sm font-medium transition-colors relative",
            activeTab === 'overview' ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
          )}
        >
          概览与分析 (Analysis)
          {activeTab === 'overview' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('correction')}
          className={clsx(
            "flex-1 py-3 text-sm font-medium transition-colors relative",
            activeTab === 'correction' ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
          )}
        >
          批改与原文 (Correction)
          {activeTab === 'correction' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' ? (
          <div className="space-y-8">
            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                  维度雷达图
                </h3>
                <ScoreRadar breakdown={result.breakdown} />
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                  总评 (General Comments)
                </h3>
                <div className="bg-blue-50 text-blue-900 p-4 rounded-lg text-sm leading-relaxed border border-blue-100">
                  {result.generalComment}
                </div>

                <div className="mt-6 space-y-3">
                  {result.improvementSuggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-slate-400" />
                详细点评 (Detailed Breakdown)
              </h3>
              <div className="grid gap-4">
                {result.detailedFeedback.map((item, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 hover:border-blue-200 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-700">{item.criterion}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                         评分: {item.score}/10
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{item.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {result.ocrText && (
               <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    原文识别 (Original Text OCR)
                  </h3>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 whitespace-pre-wrap font-serif">
                    {result.ocrText}
                  </div>
               </div>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                润色修正 (Corrected Version)
              </h3>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-sm text-slate-800 whitespace-pre-wrap font-serif leading-relaxed">
                {result.correctedText}
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 text-xs rounded-md border border-amber-100">
              <AlertCircle className="w-4 h-4" />
              <span>学习建议: 对比你的原文和修正版，找出常犯的语法错误。</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;