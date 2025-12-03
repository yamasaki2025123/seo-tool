# パスワード保護機能ガイド

## ✅ 実装完了

SEO記事自動生成ツールにパスワード保護機能を追加しました！

![パスワードログイン画面](file:///Users/yamasakimotohiro/.gemini/antigravity/brain/3fe7e4a4-d880-41f0-b2ab-6e531453defa/password_login_screen_1764485621418.png)

![ログイン後の画面](file:///Users/yamasakimotohiro/.gemini/antigravity/brain/3fe7e4a4-d880-41f0-b2ab-6e531453defa/after_login_screen_1764485635804.png)

## 🔐 現在の設定

### デフォルトパスワード
```
seo2024
```

### 機能
- ✅ パスワード入力画面
- ✅ パスワード表示/非表示切り替え
- ✅ ログイン状態の保持（ブラウザを閉じても維持）
- ✅ ログアウトボタン（右上）

## 🛠️ パスワードの変更方法

### 方法1: ローカル環境（開発中）

`.env.local` ファイルを作成：

```bash
# プロジェクトフォルダで実行
echo "NEXT_PUBLIC_APP_PASSWORD=あなたの好きなパスワード" > .env.local
```

または、手動で `.env.local` ファイルを作成して以下を記述：

```env
NEXT_PUBLIC_APP_PASSWORD=your_custom_password
```

### 方法2: Netlify（本番環境）

1. Netlifyダッシュボードにログイン
2. デプロイしたサイトを選択
3. **Site settings** → **Environment variables** をクリック
4. **Add a variable** をクリック
5. 以下を入力：
   - **Key**: `NEXT_PUBLIC_APP_PASSWORD`
   - **Value**: あなたの好きなパスワード
6. **Save** をクリック
7. サイトを再デプロイ

## 🎨 カスタマイズ

### パスワードをコード内で直接変更

[`components/PasswordGate.tsx`](file:///Users/yamasakimotohiro/Desktop/バイブコーディング（アンチグラビティ）/SEO記事自動生成ツール/components/PasswordGate.tsx) の以下の行を編集：

```typescript
const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD || 'seo2024';
```

`'seo2024'` の部分を変更すれば、デフォルトパスワードが変わります。

### ログイン画面のデザイン変更

同じファイル内のJSXを編集してカスタマイズ可能です。

## 🔒 セキュリティレベル

### 現在の実装（基本レベル）
- フロントエンドでのパスワードチェック
- ローカルストレージで認証状態を保持
- 簡易的な保護に適している

### より強固にする場合
- バックエンドAPIでの認証
- JWT（JSON Web Token）の使用
- データベースでのユーザー管理

現在の実装は、**一般公開は避けたいが、知り合いには共有したい**という用途に最適です。

## 📝 使い方

1. ツールのURLにアクセス
2. パスワードを入力
3. 「ログイン」ボタンをクリック
4. ツールが使えるようになります
5. ログアウトしたい場合は、右上の「ログアウト」ボタンをクリック

## ⚠️ 注意事項

- パスワードはブラウザのローカルストレージに保存されます
- ブラウザのキャッシュをクリアすると、再度ログインが必要になります
- 環境変数を使う場合、`.env.local` ファイルは `.gitignore` に含まれているため、GitHubにプッシュされません

## 🚀 Netlifyデプロイ時の手順

1. パスワードを環境変数に設定（上記参照）
2. 通常通りデプロイ
3. デプロイ完了後、URLにアクセスしてパスワード画面が表示されることを確認
4. 設定したパスワードでログインできることを確認

これで、誰でもアクセスできるURLでありながら、パスワードを知っている人だけが使えるツールになります！
