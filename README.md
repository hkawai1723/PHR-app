This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 技術仕様

### firebase

`{ app, auth, db }`(client)は/firebase.ts に格納されている。`@firebase`でアクセス可能

### Tanstack-query

各 features 内の api folder に`useMutation`インスタンスを返却する関数を定義している。それらの関数の返り値のプロパティとしては以下のものがある。

```
{
  //実行関数
  mutate: (data) => void,
  mutateAsync: (data) => Promise<TData>,
  reset: () => void,        // 状態をリセット

  // 状態
  isPending: boolean,        // 実行中かどうか
  isIdle: boolean,          // 未実行状態
  isError: boolean,         // エラー状態
  isSuccess: boolean,       // 成功状態
  failureCount: number,     // 失敗回数
  failureReason: Error | null,
  status: 'idle' | 'pending' | 'error' | 'success',

  // データ
  data: TData | undefined,  // 成功時のレスポンスデータ
  error: TError | null,     // エラー情報
}
```

### 認証

@/lib/firebase/google-provider に`loginWithGoogle`あり。

server component：@/utils/get-server-user.ts の`getUserOnServer`で user を取得可能。

client component：@/utils/features/auth/hooks/use-get-user.ts の`useGetUser`関数から user を取得可能。

user 情報は tanstack-query で管理。サーバー側は cookie で認証を取得。

認証の監視は@/features/auth/components/auth-sync.tsx で定義された、`<AuthSync />` component が担っている。この component はログイン時に API を叩いて cookie を生成し、ログアウト時に cookie を削除する。root layout に配置。

### Database

#### Past medical history

```
Collection ID: pastMedicalHistory
diseaseName: string required;　//診断名
diagnosisDate: string;　//診断日 #TODO: data形式がstringでよいか検討。診断日の取り決めについて。最低限年がわかれば良いと思われる。
primaryCareProvider: string;　//かかりつけ
userId: string required; //患者ID
writtenBy: string required; //記載者のID
notes: string;
createdAt : timestamp required;
updatedAt: timestamp required;

//手術に関してcollectionを作成。
operation
operativeProcedure: string;
operationDate: string;
operativeSite: string;
medicalInstitution: string;
notes: string;
```
