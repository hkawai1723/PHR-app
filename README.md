This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 技術仕様

Front end: React 19, React-hook-form, Zod
Back end: Next.js 15, Tanstack Query, Firebase, Cloud Firestore

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

@/features/[feature]/apiにtanstack queryのuseMutationを使用してfirebaseに接続するcustom hooksを準備している。
楽観的更新で実装。
#### mutation 使用例
```
export const PMHForm = () => {
  
  const createPMH = useCreatePMH();//useMutation関数の返り値であるmutationオブジェクトを返却します。

  const onSubmit = async (data) => {
    //mutation objectのmutation method or mutateAsync methodを使用してfirestoreに接続します。
    createPMH.mutateAsync(data, {
      onSuccess: () => {
        //成功時の処理を記述
      }
    })
  };
}
```

### 認証

@/lib/firebase/google-provider に`loginWithGoogle`あり。@/features/auth/hooks/use-google-login.ts から、tanstack-query の mutation を使用してログインを行う。

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

#### Family history

```
diseaseName: string pprequired;　//診断名
relationship: string required;　//不明も許容
patientId: string; //家族ID(if exists)
writtenBy: string required; //記載者のID
notes: string;
createdAt : timestamp required;
updatedAt: timestamp required;
```

## TODO

- Auth guard 実装
- Family history 実装
