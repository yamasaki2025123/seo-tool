/**
 * SEO調査モジュール
 * キーワードサジェストや関連キーワードを取得する
 */
'use server';

export interface KeywordSuggestion {
  keyword: string;
  searchVolume?: number;
  difficulty?: string;
}

/**
 * Gemini AIを使用してキーワードサジェストを取得
 */
export async function getKeywordSuggestions(
  baseKeyword: string
): Promise<KeywordSuggestion[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('Gemini API key not found. Using fallback suggestions.');
    return getFallbackSuggestions(baseKeyword);
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `あなたはSEOの専門家です。以下のキーワードに関連する、検索されやすいキーワード候補を20個提案してください。

基本キーワード: ${baseKeyword}

以下の形式でJSON配列として出力してください：
[
  {
    "keyword": "具体的なキーワード",
    "searchVolume": 推定検索ボリューム（数値）,
    "difficulty": "低" または "中" または "高"
  }
]

注意事項：
- 実際に検索されそうな、具体的で実用的なキーワードを提案してください
- 検索ボリュームは1000〜10000の範囲で推定してください
- 難易度は競合の多さを考慮して設定してください
- 必ず20個のキーワードを提案してください
- JSON形式以外の説明文は含めないでください`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // JSONを抽出（マークダウンのコードブロックを除去）
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from Gemini response');
    }

    const suggestions = JSON.parse(jsonMatch[0]) as KeywordSuggestion[];

    // 最大20件に制限
    return suggestions.slice(0, 20);

  } catch (error) {
    console.error('Error fetching keyword suggestions from Gemini:', error);
    return getFallbackSuggestions(baseKeyword);
  }
}

/**
 * フォールバック用のモックデータ
 */
function getFallbackSuggestions(baseKeyword: string): KeywordSuggestion[] {
  const mockSuggestions: KeywordSuggestion[] = [
    { keyword: `${baseKeyword} とは`, searchVolume: 5400, difficulty: '低' },
    { keyword: `${baseKeyword} 方法`, searchVolume: 8100, difficulty: '中' },
    { keyword: `${baseKeyword} やり方`, searchVolume: 3600, difficulty: '低' },
    { keyword: `${baseKeyword} 効果`, searchVolume: 2900, difficulty: '中' },
    { keyword: `${baseKeyword} おすすめ`, searchVolume: 6700, difficulty: '高' },
    { keyword: `${baseKeyword} 比較`, searchVolume: 4200, difficulty: '中' },
    { keyword: `${baseKeyword} ランキング`, searchVolume: 3100, difficulty: '高' },
    { keyword: `${baseKeyword} 初心者`, searchVolume: 2400, difficulty: '低' },
    { keyword: `${baseKeyword} コツ`, searchVolume: 1800, difficulty: '低' },
    { keyword: `${baseKeyword} メリット デメリット`, searchVolume: 1500, difficulty: '中' },
    { keyword: `${baseKeyword} 意味`, searchVolume: 1200, difficulty: '低' },
    { keyword: `${baseKeyword} 使い方`, searchVolume: 2100, difficulty: '中' },
    { keyword: `${baseKeyword} 始め方`, searchVolume: 1900, difficulty: '低' },
    { keyword: `${baseKeyword} 種類`, searchVolume: 1600, difficulty: '中' },
    { keyword: `${baseKeyword} 注意点`, searchVolume: 1400, difficulty: '高' },
    { keyword: `${baseKeyword} 事例`, searchVolume: 1100, difficulty: '中' },
    { keyword: `${baseKeyword} 費用`, searchVolume: 3300, difficulty: '高' },
    { keyword: `${baseKeyword} 手順`, searchVolume: 1700, difficulty: '低' },
    { keyword: `${baseKeyword} 仕組み`, searchVolume: 1300, difficulty: '中' },
    { keyword: `${baseKeyword} 活用`, searchVolume: 1000, difficulty: '低' },
  ];

  return mockSuggestions.sort((a, b) => (b.searchVolume || 0) - (a.searchVolume || 0));
}

/**
 * 関連キーワードを取得
 */
export async function getRelatedKeywords(
  baseKeyword: string
): Promise<string[]> {
  // 実際のプロダクションでは、関連キーワードAPIを使用
  const related = [
    `${baseKeyword} 2024`,
    `${baseKeyword} 最新`,
    `${baseKeyword} 人気`,
    `${baseKeyword} 口コミ`,
    `${baseKeyword} 評判`,
  ];

  await new Promise((resolve) => setTimeout(resolve, 500));

  return related;
}
