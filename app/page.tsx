'use client';

import { useState } from 'react';
import { FileText, Sparkles, Zap, Layout, CheckCircle } from 'lucide-react';
import KeywordInput from '@/components/KeywordInput';
import SeoAnalysisResult from '@/components/SeoAnalysisResult';
import ArticlePreview from '@/components/ArticlePreview';
import { getKeywordSuggestions, type KeywordSuggestion } from '@/lib/seo';
import { generateArticle, type GeneratedArticle } from '@/lib/ai';

type Step = 'input' | 'analysis' | 'preview';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [baseKeyword, setBaseKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([]);
  const [article, setArticle] = useState<GeneratedArticle | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAnalyze = async (keyword: string) => {
    setIsAnalyzing(true);
    setBaseKeyword(keyword);
    try {
      const results = await getKeywordSuggestions(keyword);
      setSuggestions(results);
      setCurrentStep('analysis');
    } catch (error) {
      console.error('SEO分析エラー:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateArticle = async (selectedKeywords: string[], charCount: number) => {
    setIsGenerating(true);
    try {
      const generatedArticle = await generateArticle(selectedKeywords, charCount);
      setArticle(generatedArticle);
      setCurrentStep('preview');
      // 画面を一番上にスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('記事生成エラー:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setCurrentStep('input');
    setBaseKeyword('');
    setSuggestions([]);
    setArticle(null);
  };

  return (
    <div className={`min-h-screen text-white selection:bg-blue-500/30 ${currentStep === 'preview' ? 'bg-white' : ''}`}>
      {/* ヘッダー */}
      <header className="fixed top-0 w-full z-[100] border-b border-white/10 bg-[#0f172a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              SEO AI Writer
            </span>
          </div>
          {currentStep !== 'input' && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              最初からやり直す
            </button>
          )}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* ステップインジケーター */}
        <div className="mb-16 flex justify-center">
          <div className="inline-flex p-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
            {[
              { step: 'input', label: 'キーワード', icon: Sparkles },
              { step: 'analysis', label: 'SEO分析', icon: Layout },
              { step: 'preview', label: '記事生成', icon: FileText },
            ].map((item, index) => {
              const Icon = item.icon;
              const isActive = currentStep === item.step;
              const isCompleted =
                (item.step === 'input' && currentStep !== 'input') ||
                (item.step === 'analysis' && currentStep === 'preview');

              return (
                <div key={item.step} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : isCompleted
                        ? 'text-green-400'
                        : 'text-gray-500'
                      }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {index < 2 && (
                    <div className="w-8 h-px bg-white/10 mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className={`animate-slideUp mx-auto ${currentStep === 'preview' ? 'max-w-none' : 'max-w-4xl'}`}>
          {currentStep === 'input' && (
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-6 tracking-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  SEO記事を瞬時に生成
                </span>
                <span className="block mt-2 text-2xl text-gray-300 font-normal">Create SEO Optimized Content</span>
              </h1>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                高度なAI分析とプロフェッショナルなライティング。
                キーワードを入力するだけで、検索順位の高い記事を自動生成します。
              </p>
              <div className="glass-panel rounded-2xl p-8">
                <KeywordInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
              </div>
            </div>
          )}

          {currentStep === 'analysis' && (
            <div className="glass-panel rounded-2xl p-8">
              <SeoAnalysisResult
                suggestions={suggestions}
                onGenerate={handleGenerateArticle}
                isGenerating={isGenerating}
              />
            </div>
          )}

          {currentStep === 'preview' && article && (
            <ArticlePreview article={article} />
          )}
        </div>
      </main>

      {/* 背景エフェクト */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>
    </div>
  );
}
