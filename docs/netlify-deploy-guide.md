# Netlifyデプロイ手順書

## 🚀 最も簡単な方法：ドラッグ&ドロップ

### ステップ1: ビルドする

ターミナルで以下のコマンドを実行：

```bash
npm run build
```

これで `.next` フォルダにビルドファイルが作成されます。

### ステップ2: Netlifyアカウント作成

1. [https://www.netlify.com/](https://www.netlify.com/) にアクセス
2. 「Sign up」をクリック
3. GitHubアカウントまたはメールアドレスで登録（無料）

### ステップ3: デプロイ

1. Netlifyにログイン後、「Sites」タブを開く
2. 画面下部の「Want to deploy a new site without connecting to Git? Drag and drop your site output folder here」という場所を探す
3. プロジェクトフォルダ全体をドラッグ&ドロップ

**または:**

1. 「Add new site」→「Deploy manually」をクリック
2. プロジェクトフォルダ全体を選択してアップロード

### ステップ4: 完了！

- 自動的にURLが発行されます（例: `https://your-site-name.netlify.app`）
- このURLを誰にでも共有できます

---

## 🔧 より高度な方法：GitHub連携（推奨）

### メリット
- コードを更新すると自動で再デプロイ
- バージョン管理ができる
- ロールバックが簡単

### 手順

#### 1. GitHubリポジトリを作成

```bash
# プロジェクトフォルダで実行
git init
git add .
git commit -m "Initial commit"
```

GitHubで新しいリポジトリを作成後：

```bash
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
git branch -M main
git push -u origin main
```

#### 2. NetlifyとGitHubを連携

1. Netlifyにログイン
2. 「Add new site」→「Import an existing project」
3. 「GitHub」を選択
4. リポジトリを選択
5. ビルド設定:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. 「Deploy site」をクリック

#### 3. 自動デプロイ完了！

- GitHubにpushするたびに自動でデプロイされます
- 数分で公開URLが発行されます

---

## ⚙️ Next.js特有の設定

`netlify.toml` ファイルがすでに作成されています：

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

このファイルがあることで、Next.jsアプリが正しく動作します。

---

## 🎯 おすすめの手順

### 初めての方
→ **ドラッグ&ドロップ方式**（最も簡単）

### 継続的に更新する予定がある方
→ **GitHub連携方式**（自動デプロイで便利）

---

## 📌 注意点

1. **環境変数**: 本番環境でAPIキーを使う場合は、Netlifyの「Site settings」→「Environment variables」で設定
2. **カスタムドメイン**: 無料プランでも独自ドメインを設定可能
3. **ビルド時間**: 無料プランは月300分まで（このアプリなら十分）

---

## 🆘 トラブルシューティング

### ビルドエラーが出る場合

```bash
# ローカルでビルドテスト
npm run build

# エラーが出なければOK
npm run start
```

### デプロイ後に表示されない場合

1. Netlifyのログを確認
2. `netlify.toml` の設定を確認
3. Next.js用プラグインがインストールされているか確認

---

## 次のステップ

デプロイが完了したら、発行されたURLをお知らせください！
動作確認をお手伝いします。
