# AP Simulator

Attitudinal Psyche（AP）診断シミュレーター。チャット形式のシナリオ問答を通じてユーザーの対人態度タイプ（V/L/E/F の4機能の順位）を診断し、さらにベースタイプ専用のサブタイプ（1〜4）を算出するWebアプリ。

## スタック

- **React 19 + TypeScript**（Vite 6）
- **Tailwind CSS v4**（@tailwindcss/vite）
- **Framer Motion**（motion/react）
- **Bun**（パッケージマネージャー）

## 起動方法

```
bun run dev
```

ポート 5000 で起動。ワークフロー "Start application" で管理。

## アーキテクチャ

- `src/App.tsx` — メインのゲームロジック・状態管理
- `src/data/scenario.ts` — メインシナリオステップ一覧
- `src/data/subtypeQuestions.ts` — サブタイプ診断問題（タイプ別・ポジション別）
- `src/components/Controls.tsx` — inputType ごとの入力UI
- `src/components/ChatBubble.tsx` — チャットメッセージ表示
- `src/utils/audio.ts` — 効果音

## 診断フロー

1. **メインシナリオ**（`scenario.ts`）: 全ユーザー共通の質問群
2. **サブタイプ診断**（動的生成）: メイン終了時にベースタイプを判定 → そのタイプ専用の4問を `subtypeQuestions.ts` から自動生成
3. **結果表示**: タイプ（例: LVFE）+ サブタイプ番号 + スコア内訳

## User preferences

- 既存の構造・スタックを維持する
