'use client';

import { useState } from 'react';
import { Check, TrendingUp, BarChart3, Zap, FileText, CheckCircle } from 'lucide-react';
import type { KeywordSuggestion } from '@/lib/seo';

interface SeoAnalysisResultProps {
    suggestions: KeywordSuggestion[];
    onGenerate: (selectedKeywords: string[], charCount: number) => void;
    isGenerating: boolean;
}

export default function SeoAnalysisResult({
    suggestions,
    onGenerate,
    isGenerating,
}: SeoAnalysisResultProps) {
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [charCount, setCharCount] = useState<number>(5000);

    const handleKeywordToggle = (keyword: string) => {
        if (selectedKeywords.includes(keyword)) {
            setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword));
        } else {
            if (selectedKeywords.length < 5) {
                setSelectedKeywords([...selectedKeywords, keyword]);
            }
        }
    };

    const handleGenerate = () => {
        onGenerate(selectedKeywords, charCount);
    };

    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty) {
            case '低':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case '中':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case '高':
                return 'bg-red-500/20 text-red-300 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="glass-panel p-8 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            SEO分析結果
                        </h2>
                        <p className="text-gray-400">
                            分析されたキーワードから記事に使用するものを選択してください（最大5つ）
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <span className="text-blue-400 font-medium">
                            {suggestions.length}件のキーワードが見つかりました
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleKeywordToggle(suggestion.keyword)}
                            className={`group relative p-4 rounded-xl border text-left transition-all duration-300 ${selectedKeywords.includes(suggestion.keyword)
                                ? 'bg-blue-500/30 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.3)] ring-1 ring-blue-400/50'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${selectedKeywords.includes(suggestion.keyword)
                                            ? 'bg-blue-500 border-blue-400'
                                            : 'border-white/30 bg-transparent group-hover:border-white/50'
                                        }`}>
                                        {selectedKeywords.includes(suggestion.keyword) && (
                                            <Check className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                    <span className={`font-bold text-lg ${selectedKeywords.includes(suggestion.keyword)
                                        ? 'text-white'
                                        : 'text-gray-300 group-hover:text-white'
                                        }`}>
                                        {suggestion.keyword}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm pl-9">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-gray-500">検索ボリューム:</span>
                                    <span className="text-gray-300 font-medium">{suggestion.searchVolume}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-gray-500">難易度:</span>
                                    <span className={`font-medium ${suggestion.difficulty === '高' ? 'text-red-400' :
                                        suggestion.difficulty === '中' ? 'text-yellow-400' :
                                            'text-green-400'
                                        }`}>
                                        {suggestion.difficulty}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
                    <div className="text-gray-400 text-sm">
                        選択中: <span className="text-white font-bold text-lg mx-1">{selectedKeywords.length}</span> / 5
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                            <span className="text-sm text-gray-400 whitespace-nowrap">文字数:</span>
                            <input
                                type="number"
                                value={charCount}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (isNaN(val)) {
                                        setCharCount(0); // Allow clearing
                                    } else {
                                        setCharCount(val);
                                    }
                                }}
                                onBlur={() => {
                                    // Clamp on blur
                                    const clamped = Math.max(1000, Math.min(20000, charCount || 5000));
                                    setCharCount(clamped);
                                }}
                                step={500}
                                min={1000}
                                max={20000}
                                className="w-24 bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-right font-medium focus:outline-none focus:border-blue-500/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="text-sm text-gray-400">文字</span>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={selectedKeywords.length === 0 || isGenerating}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 ${selectedKeywords.length === 0 || isGenerating
                                ? 'bg-gray-700/50 cursor-not-allowed text-gray-500'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>生成中...</span>
                                </>
                            ) : (
                                <>
                                    <FileText className="w-5 h-5" />
                                    <span>記事を生成する</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
