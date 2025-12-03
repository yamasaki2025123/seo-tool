# SEO記事自動生成ツール 実装計画書

## 目標
キーワードを入力するだけで、SEO調査、構成案作成、記事執筆、画像生成（サムネイル・図解）までを自動化するWebアプリケーションを作成します。
読みやすく、SEOに強く、視覚的にも魅力的なHTML記事を出力することを目的とします。

## ユーザーレビューが必要な事項
> [!IMPORTANT]
> **APIキーについて**: 記事生成と画像生成には外部AIサービス（OpenAI APIやGemini APIなど）を使用する想定です。APIキーの用意が必要になりますが、よろしいでしょうか？
> **SEOデータソース**: 本格的なSEO調査には専用ツール（Ahrefs/Semrush等）のAPIが必要ですが、今回は簡易的に「Googleサジェスト」や「関連キーワード」を取得する機能を実装する方向で進めます。

## 提案する変更

### 技術スタック
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS (モダンでプレミアムなデザイン)
- **Icons**: Lucide React
- **AI Integration**: OpenAI API (GPT-4o / DALL-E 3) または Gemini API
- **State Management**: React Hooks

### コンポーネント構成

#### [NEW] [app/page.tsx](file:///Users/yamasakimotohiro/Desktop/バイブコーディング（アンチグラビティ）/SEO記事自動生成ツール/app/page.tsx)
- メインのダッシュボード画面。
- キーワード入力フォーム。
- 処理ステータス表示。

#### [NEW] [components/KeywordInput.tsx](file:///Users/yamasakimotohiro/Desktop/バイブコーディング（アンチグラビティ）/SEO記事自動生成ツール/components/KeywordInput.tsx)
- ターゲットキーワードを入力するコンポーネント。

#### [NEW] [components/SeoAnalysisResult.tsx](file:///Users/yamasakimotohiro/Desktop/バイブコーディング（アンチグラビティ）/SEO記事自動生成ツール/components/SeoAnalysisResult.tsx)
- 調査されたキーワード一覧を表示し、記事生成に使うキーワードを選択するUI。

#### [NEW] [components/ArticlePreview.tsx](file:///Users/yamasakimotohiro/Desktop/バイブコーディング（アンチグラビティ）/SEO記事自動生成ツール/components/ArticlePreview.tsx)
- 生成された記事（HTML）をプレビュー表示するコンポーネント。
- 画像（サムネイル・図解）もここに表示。

#### [NEW] [lib/seo.ts](file:///Users/yamasakimotohiro/Desktop/バイブコーディング（アンチグラビティ）/SEO記事自動生成ツール/lib/seo.ts)
- SEO調査ロジック（サジェスト取得など）。

#### [NEW] [lib/ai.ts](file:///Users/yamasakimotohiro/Desktop/バイブコーディング（アンチグラビティ）/SEO記事自動生成ツール/lib/ai.ts)
- 記事生成および画像生成のためのAI API呼び出し処理。

## 検証計画

### 自動テスト
- 各コンポーネントのレンダリングテスト。
- APIルートの動作確認。

### 手動検証
1. キーワード「ダイエット」などを入力し、関連キーワードが取得できるか確認。
2. キーワードを選択し、記事生成ボタンを押下。
3. 記事が生成され、適切な見出し(H2, H3)と本文が含まれているか確認。
4. サムネイルや図解画像が生成され、記事内に配置されているか確認。
5. 生成されたHTMLがコピーまたはダウンロードできるか確認。
