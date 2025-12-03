/**
 * AI記事生成・画像生成モジュール
 */
'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ArticleSection {
  heading: string;
  content: string;
}

export interface GeneratedArticle {
  title: string;
  metaDescription: string;
  thumbnail: string;
  sections: ArticleSection[];
  htmlContent: string;
}

/**
 * Gemini APIを使用して記事を生成する
 */
async function generateArticleWithGemini(
  keywords: string[],
  charCount: number
): Promise<GeneratedArticle | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('Gemini API key not found. Using mock data.');
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const mainKeyword = keywords[0] || 'キーワード';
    const relatedKeywords = keywords.slice(1, 6).join('、');

    // 現在の日付を取得
    const now = new Date();
    const currentDate = `${now.getFullYear()}年${now.getMonth() + 1}月`;

    // 記事タイプを判定
    let articleType = '解説型';
    if (
      mainKeyword.includes('やり方') ||
      mainKeyword.includes('方法') ||
      mainKeyword.includes('手順')
    ) {
      articleType = '手順型';
    } else if (
      mainKeyword.includes('おすすめ') ||
      mainKeyword.includes('比較') ||
      mainKeyword.includes('ランキング')
    ) {
      articleType = 'ランキング型';
    }

    const prompt = `あなたはプロのSEOライターです。以下の条件に従って、高品質なSEO記事を生成してください。

【記事の条件】
- メインキーワード: ${mainKeyword}
- 関連キーワード: ${relatedKeywords}
- 記事タイプ: ${articleType}
- 現在の日付: ${currentDate}
- 文字数: 約${charCount}文字
- 対象読者: 初心者から中級者
- トーン: わかりやすく、親しみやすい

【記事の構成】
以下のJSON形式で出力してください：

\`\`\`json
{
  "title": "記事のタイトル（キーワードを含む、魅力的なもの）",
  "metaDescription": "メタディスクリプション（120文字程度、検索結果に表示される説明文）",
  "sections": [
    {
      "heading": "セクション1の見出し（H2）",
      "content": "導入文\\n\\n### 小見出し1（H3）\\n小見出し1の内容\\n\\n### 小見出し2（H3）\\n小見出し2の内容\\n\\n### 小見出し3（H3）\\n小見出し3の内容"
    },
    {
      "heading": "セクション2の見出し（H2）",
      "content": "導入文\\n\\n### 別の小見出し1（H3）\\n内容\\n\\n### 別の小見出し2（H3）\\n内容"
    }
  ]
}
\`\`\`

**重要**: 各セクションのcontentには、必ず「### 小見出し」の形式でH3見出しを2〜3個含めてください。

【重要な注意点】
1. ${articleType}の記事として適切な構成にしてください
2. **日付（${currentDate}）の使用は、情報の鮮度が重要な場合（「最新」「トレンド」などのキーワードがある場合）のみに限定してください。**
3. タイトルや本文に無理に日付を入れる必要はありません。文脈として不自然な場合は日付を省略し、普遍的な内容として書いてください。
4. 各セクションは十分な情報量を持たせてください（1セクションあたり500-800文字）
5. **各セクション（H2）の中に、必ず2〜3個のH3見出し（### 小見出し）を含めてください。H3を使って内容を細かく分けることで、読みやすさとSEO効果を高めます**
6. 具体例や数字を使って説得力を持たせてください
7. 読者の疑問に答える形で書いてください
8. SEOを意識し、キーワードを自然に含めてください
9. JSON形式のみを出力し、他の説明文は不要です

それでは、記事を生成してください。`;

    console.log('Generating article with Gemini API...', { mainKeyword, model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini API response received. Length:', text.length);

    try {
      // JSON部分だけを抽出（Markdownのコードブロックを除去）
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;

      const articleData = JSON.parse(jsonString);

      const htmlContent = generateHTML(mainKeyword, articleData.sections);

      return {
        title: articleData.title,
        metaDescription: articleData.metaDescription,
        thumbnail: '/placeholder-thumbnail.jpg',
        sections: articleData.sections,
        htmlContent,
      };
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.log('Raw text:', text);
      throw new Error('Failed to parse Gemini response');
    }
  } catch (error) {
    console.error('Error generating article with Gemini:', error);
    return null;
  }
}

/**
 * 記事を生成する（Gemini APIまたはモックデータ）
 */
export async function generateArticle(
  keywords: string[],
  charCount: number = 5000
): Promise<GeneratedArticle> {
  // Gemini APIを試す
  const geminiArticle = await generateArticleWithGemini(keywords, charCount);

  if (geminiArticle) {
    return geminiArticle;
  }

  // フォールバック: モックデータを使用
  const mainKeyword = keywords[0] || 'キーワード';

  await new Promise((resolve) => setTimeout(resolve, 2000));

  // キーワードに基づいてテンプレートを選択
  const sections = getSectionsByTemplate(mainKeyword);

  const htmlContent = generateHTML(mainKeyword, sections);

  return {
    title: `【完全ガイド】${mainKeyword}とは？やり方・効果を徹底解説`,
    metaDescription: `${mainKeyword}について、基礎知識から実践方法まで徹底解説。初心者でもわかりやすく、すぐに始められる情報をまとめました。`,
    thumbnail: '/placeholder-thumbnail.jpg',
    sections,
    htmlContent,
  };
}

/**
 * HTMLコンテンツを生成
 */
/**
 * HTMLコンテンツを生成
 */
function generateHTML(mainKeyword: string, sections: ArticleSection[]): string {
  // 目次生成のためのデータ構造を作成
  const toc: { id: string; text: string; level: number }[] = [];

  const sectionsHTML = sections
    .map((section, index) => {
      const sectionId = `section-${index + 1}`;
      toc.push({ id: sectionId, text: section.heading, level: 2 });

      // 本文中のH3（###）をパースして目次に追加し、HTMLタグに変換
      let contentHtml = section.content;
      let h3Index = 0;

      // H3見出しの処理
      contentHtml = contentHtml.replace(/^###\s+(.+)$/gm, (match, title) => {
        h3Index++;
        const h3Id = `${sectionId}-h3-${h3Index}`;
        toc.push({ id: h3Id, text: title, level: 3 });
        return `<h3 id="${h3Id}">${title}</h3>`;
      });

      // Markdown形式の太字・斜体をHTMLに変換
      const convertMarkdownToHtml = (text: string): string => {
        // 太字: **text** -> <strong>text</strong>
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // 斜体: *text* -> <em>text</em> (ただし**で囲まれていない場合のみ)
        text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
        return text;
      };

      // 段落の処理（H3以外の行をpタグで囲む）
      contentHtml = contentHtml
        .split('\n\n')
        .map(block => {
          if (block.startsWith('<h3')) return block; // H3はそのまま
          // Markdown形式を変換してからpタグで囲む
          const formattedBlock = convertMarkdownToHtml(block.replace(/\n/g, '<br>'));
          return `<p>${formattedBlock}</p>`;
        })
        .join('\n');

      return `
    <section class="article-section">
      <h2 id="${sectionId}">${section.heading}</h2>
      <div class="content">
        ${contentHtml}
      </div>
    </section>
  `;
    })
    .join('\n');

  // 目次HTMLの生成
  const tocHTML = `
    <div class="toc-container">
      <p class="toc-title">目次</p>
      <ul class="toc-list">
        ${toc.map(item => `
          <li class="toc-item-${item.level}">
            <a href="#${item.id}">${item.text}</a>
          </li>
        `).join('')}
      </ul>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${mainKeyword}について、基礎知識から実践方法まで徹底解説。">
  <title>【完全ガイド】${mainKeyword}とは？やり方・効果を徹底解説</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans JP', sans-serif;
      line-height: 1.8;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f9fafb;
    }
    h1 {
      font-size: 2rem;
      color: #1a1a1a;
      margin-bottom: 1rem;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 0.5rem;
    }
    h2 {
      font-size: 1.5rem;
      color: #2563eb;
      margin-top: 2rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }
    h3 {
      font-size: 1.25rem;
      color: #1f2937;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      border-left: 4px solid #3b82f6;
      padding-left: 0.75rem;
    }
    .toc-container {
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .toc-title {
      font-weight: bold;
      font-size: 1.125rem;
      margin-bottom: 1rem;
      text-align: center;
    }
    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .toc-list li {
      margin-bottom: 0.5rem;
    }
    .toc-list a {
      text-decoration: none;
      color: #374151;
      transition: color 0.2s;
    }
    .toc-list a:hover {
      color: #2563eb;
      text-decoration: underline;
    }
    .toc-item-2 {
      font-weight: 600;
    }
    .toc-item-3 {
      margin-left: 1.5rem;
      font-size: 0.95rem;
    }
    .article-section {
      background: white;
      padding: 2rem;
      margin-bottom: 2rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .content p {
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <article>
    <h1>【完全ガイド】${mainKeyword}とは？やり方・効果を徹底解説</h1>
    ${tocHTML}
    ${sectionsHTML}
  </article>
</body>
</html>`;
}

/**
 * 画像を生成する（プレースホルダー）
 */
export async function generateImage(prompt: string): Promise<string> {
  // 実際のプロダクションでは、DALL-E や Stable Diffusion API を使用
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // プレースホルダー画像を返す
  return `/api/placeholder/800/400?text=${encodeURIComponent(prompt)}`;
}

/**
 * キーワードに基づいてセクション構成を決定する
 */
function getSectionsByTemplate(keyword: string): ArticleSection[] {
  // テンプレート判定ロジック
  if (keyword.includes('やり方') || keyword.includes('方法') || keyword.includes('手順') || keyword.includes('始め方') || keyword.includes('使い方')) {
    return getHowToTemplate(keyword);
  } else if (keyword.includes('おすすめ') || keyword.includes('比較') || keyword.includes('ランキング') || keyword.includes('選定') || keyword.includes('選び方')) {
    return getRankingTemplate(keyword);
  } else {
    // デフォルトは解説型
    return getExplanationTemplate(keyword);
  }
}

/**
 * 解説型テンプレート（〜とは、意味、など）
 */
function getExplanationTemplate(keyword: string): ArticleSection[] {
  return [
    {
      heading: `${keyword}とは？基礎知識と重要性を徹底解説`,
      content: `${keyword}は、現代のビジネスや日常生活において、ますますその重要性を増しているキーワードです。多くの人々が${keyword}に関心を持ち、その効果や活用方法を模索しています。\n\nしかし、具体的にどのような意味を持ち、なぜ重要なのかを正しく理解している人は意外と少ないかもしれません。この記事では、${keyword}の基本的な定義から、実践的な応用までを網羅的に解説します。\n\nまずは、${keyword}が注目される背景について見ていきましょう。近年、テクノロジーの進化や社会情勢の変化に伴い、${keyword}を取り巻く環境は劇的に変化しています。これに対応するためには、正しい知識と最新のトレンドを把握することが不可欠です。\n\n本記事を通じて、${keyword}の本質を理解し、あなたの活動に役立てていただければ幸いです。初心者の方から上級者の方まで、それぞれのレベルに応じた情報を提供していきますので、ぜひ最後までお読みください。`,
    },
    {
      heading: `${keyword}の歴史と発展`,
      content: `${keyword}の歴史を振り返ることで、現在の形に至るまでの経緯と、今後の展望を理解することができます。\n\n**黎明期（初期段階）**\n${keyword}の概念が初めて登場したのは、社会的なニーズや技術的な進歩がきっかけでした。当初は限られた分野での活用にとどまっていましたが、その有用性が徐々に認識されるようになりました。\n\n**成長期（普及段階）**\n技術の発展とともに、${keyword}は急速に普及していきました。多くの企業や個人が導入を始め、成功事例が次々と報告されるようになりました。この時期に、${keyword}の標準化や体系化が進み、より多くの人が利用しやすくなりました。\n\n**成熟期（現在）**\n現在では、${keyword}は多くの分野で不可欠な要素となっています。AI技術やビッグデータとの融合により、さらに高度な活用が可能になっています。今後も継続的な進化が期待されています。`,
    },
    {
      heading: `${keyword}を導入する7つのメリット`,
      content: `${keyword}を適切に活用することで、多くのメリットが得られます。ここでは、特に重要な7つのポイントに絞って詳しく解説します。\n\n**1. 業務効率の劇的な向上**\n${keyword}を取り入れることで、従来の手作業や非効率なプロセスを自動化・最適化できる可能性があります。これにより、時間とコストの大幅な削減が期待できます。実際に導入した企業では、作業時間が平均30%削減されたという報告もあります。\n\n**2. 精度の高い意思決定**\nデータに基づいたアプローチが可能になるため、感覚や経験だけに頼らない、客観的で精度の高い意思決定ができるようになります。これは特に重要な経営判断において大きな価値を発揮します。\n\n**3. 競争優位性の確立**\n競合他社に先駆けて${keyword}を導入することで、市場における独自のポジションを築くことができます。差別化要因として大きな武器となるでしょう。先行者利益を享受できる可能性も高まります。\n\n**4. 顧客満足度の向上**\nサービスの質やスピードが向上することで、結果として顧客満足度が高まります。リピーターの獲得や口コミによる拡散も期待できます。顧客ロイヤルティの向上にも直結します。\n\n**5. 新しいビジネスチャンスの創出**\n${keyword}を活用する過程で、新たな課題やニーズに気づくことがあります。これが新規事業やサービス開発のヒントになることも少なくありません。イノベーションの源泉となる可能性を秘めています。\n\n**6. リスク管理の強化**\n${keyword}を通じて、潜在的なリスクを早期に発見し、対策を講じることができます。予防的なアプローチが可能になり、大きなトラブルを未然に防ぐことができます。\n\n**7. 従業員のモチベーション向上**\n効率的なツールや仕組みを導入することで、従業員の負担が軽減され、より創造的な業務に集中できるようになります。これは組織全体の活性化につながります。\n\nこれらのメリットを最大限に享受するためには、導入前の十分な検討と準備が欠かせません。`,
    },
    {
      heading: `${keyword}のデメリットと注意点`,
      content: `メリットの多い${keyword}ですが、導入にあたってはいくつかのデメリットや注意点も存在します。これらを事前に理解しておくことで、失敗のリスクを最小限に抑えることができます。\n\n**コストとリソースの問題**\n導入には初期費用やランニングコストがかかる場合があります。また、運用するための人材や時間の確保も必要です。費用対効果を慎重にシミュレーションすることが重要です。特に中小企業にとっては、予算の制約が大きな課題となることがあります。\n\n**セキュリティリスク**\nデジタル技術を活用する場合、情報漏洩やサイバー攻撃のリスクも考慮しなければなりません。適切なセキュリティ対策を講じることが必須となります。定期的なセキュリティ監査や従業員教育も欠かせません。\n\n**導入のハードル**\n新しいシステムや考え方を導入する際、現場からの抵抗や混乱が生じることがあります。丁寧な説明と教育を行い、スムーズな移行をサポートする体制が必要です。変革管理（チェンジマネジメント）の視点が重要になります。\n\n**依存性のリスク**\n${keyword}に過度に依存すると、システム障害時に業務が停止してしまうリスクがあります。バックアップ体制やBCP（事業継続計画）の整備が求められます。\n\nこれらの課題に対しては、スモールスタートで始める、専門家のサポートを受けるなどの対策が有効です。`,
    },
    {
      heading: `${keyword}の具体的な活用シーン`,
      content: `${keyword}は様々な場面で活用されています。ここでは代表的な活用シーンをご紹介します。\n\n**ビジネスシーン**\nマーケティング戦略の立案、営業活動の効率化、顧客管理の最適化など、ビジネスのあらゆる局面で${keyword}が活用されています。特にデータ分析と組み合わせることで、より精度の高い施策を打つことができます。\n\n**教育シーン**\n学習効果の向上や個別最適化された教育プログラムの提供など、教育分野でも${keyword}の活用が進んでいます。生徒一人ひとりの理解度に応じた指導が可能になります。\n\n**医療・ヘルスケアシーン**\n診断支援、治療計画の最適化、健康管理など、医療分野でも${keyword}の重要性が高まっています。患者の QOL（生活の質）向上に貢献しています。\n\n**日常生活シーン**\n個人の生活においても、${keyword}は様々な形で役立っています。時間管理、健康管理、趣味の充実など、生活の質を向上させるツールとして活用できます。`,
    },
    {
      heading: `${keyword}の成功事例と失敗事例から学ぶ`,
      content: `実際の事例を知ることは、自社の取り組みにおける大きなヒントになります。成功と失敗の両面から学びを得ましょう。\n\n**成功事例1：A社の場合**\nA社では、${keyword}を導入することで、残業時間を月平均20時間削減することに成功しました。勝因は、トップダウンではなく現場主導で導入を進めたことにあります。現場の声を丁寧に拾い上げ、使いやすいツールを選定したことが功を奏しました。また、段階的な導入により、従業員の抵抗感を最小限に抑えることができました。\n\n**成功事例2：C社の場合**\nC社は${keyword}を活用して、顧客満足度を15%向上させることに成功しました。カスタマーサポートの質を高め、問い合わせ対応時間を半減させたことが評価されています。\n\n**失敗事例1：B社の場合**\n一方、B社では高額なツールを導入したものの、現場に定着せず失敗に終わりました。原因は、目的が曖昧なまま導入してしまったことと、教育体制が不十分だったことです。ツールを入れることが目的になってしまい、本来の課題解決がおろそかになっていました。\n\n**失敗事例2：D社の場合**\nD社は、準備不足のまま全社一斉導入を試みて混乱を招きました。段階的な導入計画の重要性を痛感する結果となりました。\n\nこれらの事例から学べることは、「目的の明確化」「現場への配慮」「段階的な導入」「十分な教育」がいかに重要かということです。`,
    },
    {
      heading: `${keyword}の最新トレンドと未来予測`,
      content: `${keyword}の分野は日々進化しています。最新のトレンドと今後の展望について解説します。\n\n**AI・機械学習との融合**\n人工知能技術の発展により、${keyword}はより高度で自動化されたものへと進化しています。予測精度の向上や、パーソナライゼーションの実現が期待されています。\n\n**クラウド化の加速**\nクラウドベースのソリューションが主流となり、初期投資を抑えながら導入できる環境が整ってきています。スケーラビリティや柔軟性も向上しています。\n\n**モバイル対応の強化**\nスマートフォンやタブレットからのアクセスが当たり前になり、いつでもどこでも${keyword}を活用できる環境が整備されています。\n\n**今後の展望**\n今後5年間で、${keyword}はさらに進化し、より多くの分野で活用されるようになるでしょう。特に、IoTやブロックチェーンとの連携により、新たな価値創造が期待されています。`,
    },
    {
      heading: `まとめ：${keyword}で未来を切り拓こう`,
      content: `本記事では、${keyword}について多角的に解説してきました。\n\n要点を振り返ります：\n・${keyword}は現代において不可欠な要素である\n・導入には多くのメリットがあるが、デメリットにも注意が必要\n・成功のためには明確な目標設定とPDCAサイクルが重要\n・他社の事例から学び、自社に合った方法を見つける\n・最新トレンドを把握し、継続的に進化させていく\n\n${keyword}への取り組みは、一朝一夕で結果が出るものではありません。しかし、正しい方法で継続すれば、必ず大きな成果をもたらしてくれます。\n\n変化の激しい時代において、${keyword}を味方につけることは、あなたの強力な武器となるはずです。ぜひこの記事を参考に、第一歩を踏み出してみてください。\n\n最後に、${keyword}は単なるツールではなく、ビジネスや生活を変革するための手段であることを忘れないでください。目的を見失わず、常に改善を続けることで、真の価値を引き出すことができます。応援しています。`,
    },
  ];
}

/**
 * 手順型テンプレート（やり方、方法、手順、など）
 */
function getHowToTemplate(keyword: string): ArticleSection[] {
  return [
    {
      heading: `${keyword}完全ガイド：初心者でも失敗しない手順`,
      content: `${keyword}に挑戦したいけれど、何から始めればいいのかわからない...そんな悩みをお持ちではありませんか？\n\nこの記事では、初心者の方でも迷わずに${keyword}を実践できるよう、具体的な手順をステップバイステップで解説します。必要な準備から、実践のコツ、よくある失敗とその対策まで、成功に必要な情報をすべて網羅しました。\n\n正しい手順を知ることで、無駄な時間やコストを省き、最短距離で目標を達成することができます。ぜひ最後までお読みいただき、あなたの${keyword}ライフにお役立てください。`,
    },
    {
      heading: `始める前に準備するもの`,
      content: `${keyword}をスムーズに進めるためには、事前の準備が欠かせません。以下のリストを参考に、必要なものを揃えましょう。\n\n**必須アイテム**\n・PCまたはスマートフォン（スペックは中程度以上を推奨）\n・安定したインターネット環境（光回線推奨）\n・専用のツールやソフトウェア（必要に応じて）\n・作業用のノートやメモアプリ\n\n**あると便利なもの**\n・メモ帳や筆記用具（アイデアをすぐに書き留めるため）\n・参考書籍や教材（体系的に学ぶため）\n・予備のバッテリーやモバイル電源\n・快適な作業環境（デスク、椅子、照明など）\n\n準備が整ったら、いよいよ実践のステップに進みます。焦らず、一つずつ確実に進めていきましょう。`,
    },
    {
      heading: `ステップ1：基礎を固める`,
      content: `まずは、${keyword}の基本を理解することから始めましょう。\n\nいきなり応用的なことに手を出しても、基礎ができていないと失敗する可能性が高くなります。以下のポイントを押さえておきましょう。\n\n**用語の理解**\n${keyword}に関連する専門用語を正しく理解することが第一歩です。わからない言葉が出てきたら、その都度調べて自分の言葉で説明できるようにしましょう。\n\n**基本的なルールの把握**\n${keyword}には、守るべき基本的なルールや原則があります。これらを無視すると、後で大きな問題につながる可能性があります。\n\n**目的の明確化**\nなぜ${keyword}を始めるのか、何を達成したいのかを明確にしましょう。目的が明確であれば、モチベーションを維持しやすくなります。\n\n焦らずじっくりと基礎を固めることが、後の成長につながります。この段階で手を抜くと、後で必ず苦労することになります。`,
    },
    {
      heading: `ステップ2：実践してみる`,
      content: `基礎ができたら、実際に手を動かしてみましょう。\n\n最初はうまくいかないこともあるかもしれませんが、気にすることはありません。失敗は成功の母です。むしろ、失敗から学ぶことの方が多いくらいです。\n\n**実践のステップ**\n1. 小さな目標を立てる\n達成可能な小さな目標から始めましょう。大きすぎる目標は挫折の原因になります。\n\n2. 計画に沿って実行する\n計画を立てたら、それに従って着実に実行していきます。計画通りにいかなくても、柔軟に対応しましょう。\n\n3. 結果を記録する\n何をやって、どんな結果が出たのかを記録しておくことが重要です。後で振り返ったときに、大きな財産になります。\n\n4. フィードバックを得る\n可能であれば、経験者からフィードバックをもらいましょう。客観的な視点は非常に貴重です。\n\nこのサイクルを繰り返すことで、徐々に感覚が掴めてくるはずです。`,
    },
    {
      heading: `ステップ3：応用と改善`,
      content: `慣れてきたら、より高度なテクニックに挑戦してみましょう。\n\n**効率化ツールを導入する**\n作業を効率化するためのツールやアプリを積極的に活用しましょう。時間の節約になるだけでなく、ミスも減らせます。\n\n**他の人のやり方を参考にする**\nSNSやブログ、YouTubeなどで、他の人がどのように${keyword}を実践しているかを研究しましょう。新しい発見があるはずです。\n\n**自分なりの工夫を加える**\n基本を押さえた上で、自分なりのアレンジを加えてみましょう。オリジナリティが生まれ、より楽しくなります。\n\n**定期的な振り返り**\n月に一度は、自分の進捗を振り返る時間を設けましょう。何がうまくいって、何がうまくいかなかったのかを分析します。\n\n常に改善を意識することで、${keyword}のスキルは飛躍的に向上します。`,
    },
    {
      heading: `ステップ4：継続するためのコツ`,
      content: `${keyword}を継続するためには、モチベーション管理が重要です。\n\n**習慣化する**\n毎日決まった時間に取り組むことで、習慣化しやすくなります。歯磨きのように、やらないと気持ち悪いと感じるレベルまで持っていきましょう。\n\n**仲間を見つける**\n同じ目標を持つ仲間がいると、モチベーションを維持しやすくなります。オンラインコミュニティなどを活用しましょう。\n\n**小さな成功を祝う**\n大きな目標だけでなく、小さな成功も祝いましょう。自分を褒めることは、継続の原動力になります。\n\n**休息も大切に**\n無理をしすぎると燃え尽きてしまいます。適度に休息を取り、リフレッシュすることも忘れずに。`,
    },
    {
      heading: `よくある失敗と対策`,
      content: `${keyword}で初心者が陥りやすい失敗と、その対策を紹介します。\n\n**失敗例1：準備不足**\n必要なものが揃っていない状態で始めてしまい、途中で挫折するケースです。\n対策：事前にチェックリストを作成し、漏れがないか確認する。必要なものは早めに揃えておく。\n\n**失敗例2：目標が高すぎる**\n最初から高すぎる目標を設定してしまい、達成できずにモチベーションが下がるケースです。\n対策：達成可能な小さな目標から始める。段階的にレベルアップしていく。\n\n**失敗例3：継続できない**\n最初は頑張るものの、徐々にやらなくなってしまうケースです。\n対策：習慣化するための工夫をする（例：毎日決まった時間に行う、カレンダーに記録する）。\n\n**失敗例4：完璧主義**\n完璧を求めすぎて、なかなか前に進めないケースです。\n対策：「まずはやってみる」精神を大切に。60点でも良いので、とにかく前に進む。\n\n**失敗例5：孤独に頑張りすぎる**\n一人で抱え込んでしまい、行き詰まるケースです。\n対策：困ったときは遠慮なく質問する。コミュニティに参加して仲間を作る。\n\nこれらの対策を講じることで、挫折するリスクを大幅に減らすことができます。`,
    },
    {
      heading: `まとめ：${keyword}をマスターしよう`,
      content: `今回は、${keyword}の具体的な手順について解説しました。\n\n重要なのは、「まずはやってみる」ことです。完璧を目指す必要はありません。失敗を恐れずに、一歩を踏み出してみましょう。\n\n**振り返りのポイント**\n・準備をしっかり行う\n・基礎を固めてから応用に進む\n・小さな目標から始める\n・継続するための工夫をする\n・失敗から学ぶ姿勢を持つ\n\n${keyword}は、正しい方法で継続すれば、誰でも必ず上達します。焦らず、自分のペースで進めていってください。\n\nこの記事が、あなたの${keyword}への挑戦の助けになれば幸いです。応援しています！`,
    },
  ];
}

/**
 * ランキング/比較型テンプレート（おすすめ、比較、ランキング、など）
 */
function getRankingTemplate(keyword: string): ArticleSection[] {
  return [
    {
      heading: `【最新版】${keyword}徹底比較！おすすめランキングTOP5`,
      content: `${keyword}を選ぼうと思っても、種類が多すぎてどれが良いのか迷ってしまいますよね。\n\n「失敗したくない」「自分に合ったものを選びたい」\n\nそんなあなたのために、今回は人気の${keyword}を徹底比較し、おすすめランキング形式でご紹介します。価格、機能、使いやすさなど、様々な観点から検証しました。\n\nこの記事を読めば、あなたにぴったりの${keyword}が必ず見つかるはずです。`,
    },
    {
      heading: `${keyword}の選び方：失敗しない3つのポイント`,
      content: `ランキングを見る前に、まずは${keyword}を選ぶ際の重要なポイントを押さえておきましょう。\n\n**1. 目的に合っているか**\n何のために${keyword}を使うのか、目的を明確にしましょう。目的によって必要な機能やスペックは異なります。\n\n**2. 予算の範囲内か**\n初期費用だけでなく、ランニングコストも考慮する必要があります。無理のない予算設定をしましょう。\n\n**3. サポート体制は充実しているか**\n困ったときにすぐに相談できるサポート体制があるかどうかも重要です。口コミや評判も参考にしましょう。\n\nこれらのポイントを意識することで、選び方の失敗を防ぐことができます。`,
    },
    {
      heading: `第1位：圧倒的なコストパフォーマンス「製品A」`,
      content: `栄えある第1位は「製品A」です。\n\n**特徴**\n・低価格ながら高機能\n・初心者でも使いやすい直感的な操作性\n・24時間365日のサポート体制\n\n**おすすめな人**\n・初めて${keyword}を導入する人\n・コストを抑えたい人\n\n総合的なバランスが非常に良く、誰にでもおすすめできる${keyword}です。`,
    },
    {
      heading: `第2位：プロ仕様の多機能モデル「製品B」`,
      content: `第2位は、プロフェッショナルから高い評価を得ている「製品B」です。\n\n**特徴**\n・業界最高水準の機能性\n・高度なカスタマイズが可能\n・堅牢なセキュリティ\n\n**おすすめな人**\n・本格的に${keyword}を活用したい人\n・機能にこだわりたい人\n\n価格はやや高めですが、それに見合う価値は十分にあります。`,
    },
    {
      heading: `第3位：手軽に始められる「製品C」`,
      content: `第3位は、シンプルで使い勝手の良い「製品C」です。\n\n**特徴**\n・登録から利用開始までがスピーディー（最短5分）\n・必要最低限の機能に絞ったシンプル設計\n・スマホアプリでも利用可能（iOS/Android対応）\n・無料プランあり\n\n**おすすめな人**\n・手軽に試してみたい人\n・外出先でも利用したい人\n・まずは無料で始めたい人\n\nサブ機としての利用や、ライトユーザーに最適です。シンプルさを重視する方には特におすすめです。`,
    },
    {
      heading: `第4位：コミュニティが充実「製品D」`,
      content: `第4位は、活発なユーザーコミュニティが魅力の「製品D」です。\n\n**特徴**\n・ユーザー同士の情報交換が活発\n・定期的なアップデートで機能改善\n・チュートリアルやFAQが充実\n・ユーザー投稿のテンプレートが豊富\n\n**おすすめな人**\n・コミュニティで学びたい人\n・他のユーザーと交流したい人\n・最新情報をいち早く知りたい人\n\n困ったときに助け合える環境があるのは、初心者にとって心強いポイントです。`,
    },
    {
      heading: `第5位：企業向け大規模対応「製品E」`,
      content: `第5位は、大企業での導入実績が豊富な「製品E」です。\n\n**特徴**\n・大規模組織での利用に最適化\n・高度な権限管理機能\n・専任サポート担当が付く\n・オンプレミス対応可能\n\n**おすすめな人**\n・企業で大規模導入を検討している人\n・セキュリティを最重視する人\n・専任サポートが必要な人\n\n個人利用には過剰スペックですが、企業利用なら検討する価値があります。`,
    },
    {
      heading: `詳細比較：あなたに最適な${keyword}は？`,
      content: `ここでは、各製品をより詳しく比較していきます。\n\n**価格帯で選ぶ**\n・低価格重視：製品A、製品C\n・機能重視で予算に余裕：製品B、製品E\n・バランス重視：製品D\n\n**用途で選ぶ**\n・個人利用：製品A、製品C、製品D\n・ビジネス利用（小規模）：製品A、製品B\n・ビジネス利用（大規模）：製品E\n\n**サポート体制で選ぶ**\n・手厚いサポート：製品A、製品E\n・コミュニティサポート：製品D\n・セルフサービス：製品C\n\nあなたの優先順位に合わせて選択しましょう。`,
    },
    {
      heading: `比較一覧表`,
      content: `今回紹介した全5製品を一覧表にまとめました。\n\n| 製品名 | 価格 | 機能性 | 使いやすさ | サポート | 総合評価 |\n| --- | --- | --- | --- | --- | --- |\n| 製品A | ◎ | ◯ | ◎ | ◎ | ★★★★★ |\n| 製品B | △ | ◎ | ◯ | ◯ | ★★★★☆ |\n| 製品C | ◯ | △ | ◎ | △ | ★★★☆☆ |\n| 製品D | ◯ | ◯ | ◯ | ◎ | ★★★★☆ |\n| 製品E | △ | ◎ | △ | ◎ | ★★★★☆ |\n\n◎：優れている、◯：普通、△：やや劣る\n\nそれぞれの特徴を比較して、あなたに最適なものを選んでください。迷ったら、第1位の製品Aから試してみることをおすすめします。`,
    },
    {
      heading: `実際のユーザーの声`,
      content: `実際に各製品を使用しているユーザーの声をご紹介します。\n\n**製品Aユーザー（30代・会社員）**\n「コスパが最高です。初心者でも迷わず使えました。サポートの対応も早くて助かっています。」\n\n**製品Bユーザー（40代・フリーランス）**\n「機能が豊富で、プロの要求にも応えられます。少し価格は高いですが、それだけの価値はあります。」\n\n**製品Cユーザー（20代・学生）**\n「無料プランで十分使えます。シンプルで分かりやすいのが良いです。」\n\n**製品Dユーザー（30代・主婦）**\n「コミュニティで質問すると、すぐに答えが返ってきます。ユーザー同士の交流も楽しいです。」\n\n**製品Eユーザー（50代・経営者）**\n「会社で100人以上が使っていますが、問題なく運用できています。セキュリティ面も安心です。」\n\nリアルな声を参考に、自分に合ったものを選びましょう。`,
    },
    {
      heading: `よくある質問（FAQ）`,
      content: `${keyword}選びでよくある質問にお答えします。\n\n**Q1: 無料で使えるものはありますか？**\nA1: 製品Cには無料プランがあります。ただし、機能に制限があるため、本格的に使いたい場合は有料プランをおすすめします。\n\n**Q2: 途中で別の製品に乗り換えられますか？**\nA2: 多くの製品でデータのエクスポート機能があります。ただし、移行には手間がかかるため、最初から慎重に選ぶことをおすすめします。\n\n**Q3: 複数人で使う場合、どれがおすすめですか？**\nA3: チームの規模によります。小規模（5人以下）なら製品A、中規模（10-50人）なら製品B、大規模（50人以上）なら製品Eがおすすめです。\n\n**Q4: スマホだけで使えますか？**\nA4: 製品Cはスマホアプリが充実しています。他の製品もスマホ対応していますが、PCでの利用を前提とした設計です。`,
    },
    {
      heading: `まとめ：自分に合った${keyword}を見つけよう`,
      content: `今回は、おすすめの${keyword}をランキング形式でご紹介しました。\n\nどの製品にも一長一短があります。重要なのは、あなたの目的や予算に合っているかどうかです。\n\n**選び方のポイント（再確認）**\n・目的を明確にする\n・予算を決める\n・サポート体制を確認する\n・無料トライアルがあれば試してみる\n・口コミや評判をチェックする\n\n迷ったら、まずは第1位の製品Aから試してみることをおすすめします。多くの人に支持されているだけあって、失敗のリスクが低いです。\n\nぜひこの記事を参考に、納得のいく${keyword}選びをしてください。あなたの成功を応援しています。`,
    },
  ];
}
