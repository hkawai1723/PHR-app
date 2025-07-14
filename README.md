This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 技術仕様

### firebase

`{ app, auth, db }`(client)は/firebase.ts に格納されている。`@firebase`でアクセス可能

### 認証

@/lib/firebase/google-provider に`loginWithGoogle`あり。
user 情報は tanstack-query で管理。サーバー側は cookie で認証を取得。
@/utils/get-server-user.ts の`getUserOnServer`で server component で user を取得可能。
@/utils/features/auth/custom-hooks/use-auth.ts の`useGetUser`で client component で user を取得可能。

### Database
