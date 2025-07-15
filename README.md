This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 技術仕様

### firebase

`{ app, auth, db }`(client)は/firebase.ts に格納されている。`@firebase`でアクセス可能

### 認証

@/lib/firebase/google-provider に`loginWithGoogle`あり。

server component：@/utils/get-server-user.ts の`getUserOnServer`で user を取得可能。

client component：@/utils/features/auth/hooks/use-get-user.ts の`useGetUser`関数から user を取得可能。

user 情報は tanstack-query で管理。サーバー側は cookie で認証を取得。

認証の監視は@/features/auth/components/auth-sync.tsx で定義された、`<AuthSync />` component が担っている。この component はログイン時に API を叩いて cookie を生成し、ログアウト時に cookie を削除する。root layout に配置。

### Database
