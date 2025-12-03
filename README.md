# SEO記事自動生成ツール

## 📝 プロジェクト概要

キーワードを入力するだけで、SEO最適化された高品質な記事を自動生成するWebアプリケーションです。

## 🎯 主な機能

1. **キーワード入力** - ターゲットキーワードを入力
2. **SEO調査** - 関連キーワード10件を自動取得（検索ボリューム・難易度付き）
3. **記事自動生成** - SEO最適化された記事を自動作成
4. **HTMLエクスポート** - 生成された記事をHTMLでコピー・ダウンロード
5. **パスワード保護** - アクセス制限機能

## 🔐 パスワード

**デフォルトパスワード:** `seo2025`

パスワードの変更方法は [`docs/password-protection-guide.md`](docs/password-protection-guide.md) を参照

## 🚀 使い方

### 開発環境で起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

### 本番環境へデプロイ

詳細は [`docs/netlify-deploy-guide.md`](docs/netlify-deploy-guide.md) を参照

## 📁 プロジェクト構成

```
SEO記事自動生成ツール/
├── app/
│   ├── page.tsx          # メインページ
│   ├── layout.tsx        # レイアウト（パスワード保護含む）
│   └── globals.css       # グローバルスタイル
├── components/
│   ├── KeywordInput.tsx          # キーワード入力UI
│   ├── SeoAnalysisResult.tsx     # SEO調査結果UI
│   ├── ArticlePreview.tsx        # 記事プレビューUI
│   └── PasswordGate.tsx          # パスワード認証UI
├── lib/
│   ├── seo.ts           # SEO調査ロジック
│   └── ai.ts            # 記事生成ロジック
├── docs/                # ドキュメント
└── README.md           # このファイル
```

## 🛠️ 技術スタック

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Language:** TypeScript

## 📚 ドキュメント

プロジェクトの詳細なドキュメントは `docs/` フォルダにあります：

- [`implementation_plan.md`](docs/implementation_plan.md) - 実装計画書
- [`walkthrough.md`](docs/walkthrough.md) - 完成報告・使い方
- [`netlify-deploy-guide.md`](docs/netlify-deploy-guide.md) - Netlifyデプロイ手順
- [`password-protection-guide.md`](docs/password-protection-guide.md) - パスワード保護機能ガイド

## 🎨 デザインの特徴

- モダンなグラデーション背景
- スムーズなアニメーション
- レスポンシブデザイン
- 直感的なUI/UX

## 🔧 カスタマイズ

### パスワード変更

`components/PasswordGate.tsx` の以下の行を編集：

```typescript
const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD || 'seo2025';
```

### 記事テンプレート変更

`lib/ai.ts` の `generateArticle` 関数を編集

### デザイン変更

各コンポーネントの `className` を編集（Tailwind CSS使用）

## 🌐 本番環境への移行

現在はモックデータを使用していますが、以下のAPIを統合可能：

- **記事生成:** OpenAI GPT-4、Google Gemini
- **SEO調査:** Google Suggest API、DataForSEO
- **画像生成:** DALL-E 3、Stable Diffusion

環境変数に APIキーを設定するだけで実際のAIサービスと連携できます。

## 📝 開発履歴

### 2024-11-30
- プロジェクト初期化（Next.js + Tailwind CSS）
- SEO調査モジュール実装
- 記事生成モジュール実装
- UI/UXコンポーネント実装
- パスワード保護機能追加
- デフォルトパスワードを `seo2025` に設定

## 🆘 トラブルシューティング

### 開発サーバーが起動しない

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### ビルドエラー

```bash
# ローカルでビルドテスト
npm run build
```

### パスワードが機能しない

ブラウザのキャッシュをクリアして再度アクセス

## 📞 サポート

質問や問題がある場合は、`docs/` フォルダ内のドキュメントを参照してください。

---

**作成日:** 2024-11-30  
**最終更新:** 2024-11-30
