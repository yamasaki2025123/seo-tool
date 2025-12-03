'use client';

import { useState } from 'react';
import { Download, Copy, Eye, Code, CheckCircle2, FileText } from 'lucide-react';
import type { GeneratedArticle } from '@/lib/ai';

interface ArticlePreviewProps {
    article: GeneratedArticle;
}

export default function ArticlePreview({ article }: ArticlePreviewProps) {
    const [viewMode, setViewMode] = useState<'preview' | 'html'>('preview');
    const [copied, setCopied] = useState(false);

    const handleCopyHTML = async () => {
        await navigator.clipboard.writeText(article.htmlContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadHTML = () => {
        const blob = new Blob([article.htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${article.title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full space-y-6">
            {/* ヘッダー */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 shadow-lg border border-green-500/30">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500 rounded-lg shadow-lg shadow-green-500/20">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">記事が生成されました！</h3>
                        <p className="text-sm text-green-300">SEO最適化された記事が生成されました</p>
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 mb-3 border border-white/10">
                    <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">タイトル</div>
                    <div className="text-lg font-semibold text-white">{article.title}</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">メタディスクリプション</div>
                    <div className="text-sm text-gray-300">{article.metaDescription}</div>
                </div>
            </div>

            {/* コントロールバー */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex gap-2 bg-black/20 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('preview')}
                            className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 text-sm ${viewMode === 'preview'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Eye className="w-4 h-4" />
                            プレビュー
                        </button>
                        <button
                            onClick={() => setViewMode('html')}
                            className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 text-sm ${viewMode === 'html'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Code className="w-4 h-4" />
                            HTMLコード
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleCopyHTML}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-all flex items-center gap-2 border border-white/10"
                        >
                            {copied ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                    コピー済み
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    HTMLをコピー
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleDownloadHTML}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            <Download className="w-4 h-4" />
                            ダウンロード
                        </button>
                    </div>
                </div>
            </div>

            {/* コンテンツ表示 */}
            {viewMode === 'preview' ? (
                <div className="py-8" style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
                    <div className="mx-auto shadow-2xl rounded-xl p-8 md:p-12" style={{ backgroundColor: '#ffffff', color: '#1f2937', maxWidth: '800px' }}>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight pb-4 border-b-4 border-blue-500">
                            {article.title}
                        </h1>

                        {/* 目次 */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
                            <p className="font-bold text-lg mb-4 text-center text-gray-800">目次</p>
                            <ul className="space-y-2">
                                {article.sections.map((section, index) => {
                                    const h3Matches = section.content.match(/^###\s+(.+)$/gm);
                                    return (
                                        <li key={index}>
                                            <a href={`#section-${index}`} className="text-gray-700 hover:text-blue-600 font-semibold hover:underline block">
                                                {section.heading}
                                            </a>
                                            {h3Matches && (
                                                <ul className="ml-6 mt-1 space-y-1">
                                                    {h3Matches.map((h3, h3Index) => (
                                                        <li key={h3Index}>
                                                            <span className="text-sm text-gray-600">
                                                                - {h3.replace(/^###\s+/, '')}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* 記事本文 */}
                        {article.sections.map((section, index) => (
                            <div key={index} id={`section-${index}`} className="mb-10 scroll-mt-20">
                                <h2 className="text-2xl md:text-3xl font-bold mb-8 pb-3 border-b-4" style={{ color: '#2563eb', borderColor: '#2563eb' }}>
                                    {section.heading}
                                </h2>
                                <div className="prose prose-lg max-w-none text-gray-700">
                                    {(() => {
                                        // Markdown形式の太字・斜体を変換
                                        const convertMarkdown = (text: string) => {
                                            let converted = text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 bg-yellow-100 px-1 rounded">$1</strong>');
                                            converted = converted.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
                                            return converted;
                                        };

                                        const lines = section.content.split('\n');
                                        const elements: React.ReactElement[] = [];
                                        let paragraphLines: string[] = [];
                                        let pKey = 0;

                                        const flushParagraph = () => {
                                            if (paragraphLines.length > 0) {
                                                elements.push(
                                                    <p key={`p-${pKey++}`} className="mb-6 leading-8 text-gray-700 text-lg tracking-wide font-normal">
                                                        {paragraphLines.map((line, lIndex) => (
                                                            <span key={lIndex}>
                                                                <span dangerouslySetInnerHTML={{ __html: convertMarkdown(line) }} />
                                                                {lIndex < paragraphLines.length - 1 && <br />}
                                                            </span>
                                                        ))}
                                                    </p>
                                                );
                                                paragraphLines = [];
                                            }
                                        };

                                        lines.forEach((line, index) => {
                                            if (line.startsWith('### ')) {
                                                flushParagraph();
                                                elements.push(
                                                    <h3 key={`h3-${index}`} className="text-lg font-semibold text-gray-800 mt-8 mb-4 pl-4 border-l-4 border-blue-400">
                                                        {line.replace(/^###\s+/, '')}
                                                    </h3>
                                                );
                                            } else if (line.trim() === '') {
                                                flushParagraph();
                                            } else {
                                                paragraphLines.push(line);
                                            }
                                        });

                                        flushParagraph();
                                        return elements;
                                    })()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-0">
                    <pre className="bg-[#1e1e1e] text-gray-300 p-6 overflow-x-auto text-sm font-mono leading-relaxed">
                        <code>{article.htmlContent}</code>
                    </pre>
                </div>
            )}
        </div>
    );
}
