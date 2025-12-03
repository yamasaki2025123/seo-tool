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
 * Googleサジェストキーワードを取得（簡易版）
 */
export async function getKeywordSuggestions(
  baseKeyword: string
): Promise<KeywordSuggestion[]> {
  try {
    // Google Suggest APIを使用して実際のキーワード候補を取得
    const suggestions: KeywordSuggestion[] = [];

    // 基本キーワード + よく使われる接尾辞でサジェストを取得
    const suffixes = ['', ' とは', ' 方法', ' やり方', ' 効果', ' おすすめ', ' 比較', ' 初心者', ' コツ', ' 使い方'];

    for (const suffix of suffixes) {
      const query = `${baseKeyword}${suffix}`;
      try {
        const response = await fetch(
          `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}&hl=ja&oe=utf-8`
        );

        if (response.ok) {
          const data = await response.json();
          const keywords = data[1] as string[]; // Googleサジェストの結果

          keywords.forEach((keyword: string) => {
            // 重複チェック
            if (!suggestions.find(s => s.keyword === keyword)) {
              // 難易度をキーワードの長さと競合度から推定
              const difficulty = keyword.length > 20 ? '高' : keyword.length > 10 ? '中' : '低';

              suggestions.push({
                keyword,
                searchVolume: undefined, // Google Suggestでは検索ボリュームは取得できない
                difficulty,
              });
            }
          });
        }
      } catch (error) {
        console.warn(`Failed to fetch suggestions for "${query}":`, error);
      }

      // レート制限を避けるため、少し待機
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 最大20件に制限
    return suggestions.slice(0, 20);

  } catch (error) {
    console.error('Error fetching Google Suggest data:', error);

    // エラー時はモックデータにフォールバック
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
