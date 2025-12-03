'use client';

import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface KeywordInputProps {
    onAnalyze: (keyword: string) => void;
    isLoading: boolean;
}

export default function KeywordInput({ onAnalyze, isLoading }: KeywordInputProps) {
    const [keyword, setKeyword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (keyword.trim()) {
            onAnalyze(keyword.trim());
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8 justify-center">
                <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-left">
                    <h2 className="text-2xl font-bold text-white">Start Research</h2>
                    <p className="text-sm text-gray-400">キーワードを入力してSEO分析を開始</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="例: ダイエット、プログラミング、投資..."
                        className="w-full pl-12 pr-4 py-4 text-lg bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all outline-none text-white placeholder-gray-500"
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!keyword.trim() || isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            分析中...
                        </span>
                    ) : (
                        'SEO分析を開始'
                    )}
                </button>
            </form>

            <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex-1 h-px bg-white/10"></div>
                <span>AIが関連キーワードを自動提案します</span>
                <div className="flex-1 h-px bg-white/10"></div>
            </div>
        </div>
    );
}
