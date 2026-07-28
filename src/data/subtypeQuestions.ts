export const subtypeQuestions: Record<string, Record<string, any>> = {
  L: {
    1: {
      q: '考え方を否定されました。',
      options: [
        { label: 'すぐ理由を聞く', score: 4 },
        { label: '論理を組み立てて説明する', score: 3 },
        { label: 'かなり腹が立つ', score: 2 },
        { label: 'しばらく考え続ける', score: 1 }
      ]
    },
    2: {
      q: '他人の考えが間違っていることに気づきました。',
      options: [
        { label: '議論して一緒に深める', score: 4 },
        { label: '優しく指摘してあげる', score: 3 },
        { label: '相手に合わせて流す', score: 2 },
        { label: '面倒なので無視する', score: 1 }
      ]
    },
    3: {
      q: '「君の言っていることは矛盾している」と言われました。',
      options: [
        { label: '不安になってすぐ見直す', score: 4 },
        { label: '少し傷ついて黙る', score: 3 },
        { label: '感情的に言い返す', score: 2 },
        { label: '別にどうでもいいと思う', score: 1 }
      ]
    },
    4: {
      q: '複雑なルールのゲームをやることに。',
      options: [
        { label: '誰かに全部教えてもらう', score: 4 },
        { label: 'やりながら適当に覚える', score: 3 },
        { label: '自分で解読してみる', score: 2 },
        { label: 'そもそも参加しない', score: 1 }
      ]
    }
  },
  V: {
    1: {
      q: 'みんなの意見がバラバラで決まりません。',
      options: [
        { label: '自分が全員分決める', score: 4 },
        { label: '多数決で強引に進める', score: 3 },
        { label: '妥協点を探る', score: 2 },
        { label: '誰かが決めるまで待つ', score: 1 }
      ]
    },
    2: {
      q: '勝手に人生や予定を決められた。',
      options: [
        { label: '絶対嫌', score: 4 },
        { label: '相談ならOK', score: 3 },
        { label: '内心モヤモヤする', score: 2 },
        { label: 'そこまで気にならない', score: 1 }
      ]
    },
    3: {
      q: '「あなたはどうしたいの？」と強く迫られました。',
      options: [
        { label: 'プレッシャーで頭が真っ白になる', score: 4 },
        { label: '相手の望む答えを探す', score: 3 },
        { label: '意地でも自分で決める', score: 2 },
        { label: '適当に答える', score: 1 }
      ]
    },
    4: {
      q: '今日のランチ、何にする？',
      options: [
        { label: 'なんでもいい（決めてほしい）', score: 4 },
        { label: '君が決めて', score: 3 },
        { label: 'いくつか候補を出して選んでもらう', score: 2 },
        { label: '自分で絶対に決める', score: 1 }
      ]
    }
  },
  F: {
    1: {
      q: '自分の部屋のレイアウトや持ち物を勝手に変えられました。',
      options: [
        { label: '絶対に許せない', score: 4 },
        { label: '自分の気に入るようにすぐ直す', score: 3 },
        { label: '文句を言いつつ少し残す', score: 2 },
        { label: 'まぁいいかと思う', score: 1 }
      ]
    },
    2: {
      q: '友達の服のセンスが微妙です。',
      options: [
        { label: '一緒に服を買いに行ってあげる', score: 4 },
        { label: 'それとなくアドバイスする', score: 3 },
        { label: '良いところを探して褒める', score: 2 },
        { label: '気にしない', score: 1 }
      ]
    },
    3: {
      q: '「姿勢を毎日直しなさい」と言われました。',
      options: [
        { label: '必要なら頑張る', score: 4 },
        { label: 'やらなきゃと思う', score: 3 },
        { label: '面倒だけど気になる', score: 2 },
        { label: '別にどうでもいい', score: 1 }
      ]
    },
    4: {
      q: '「姿勢直して」と注意されました。',
      options: [
        { label: 'ありがとう（素直に従う）', score: 4 },
        { label: 'やってみよう', score: 3 },
        { label: '面倒', score: 2 },
        { label: '任せる（直してほしい）', score: 1 }
      ]
    }
  },
  E: {
    1: {
      q: 'あなたの好きなものを「それ微妙だね」と笑われました。',
      options: [
        { label: '激しく怒る・傷つく', score: 4 },
        { label: '相手を否定し返す', score: 3 },
        { label: '隠れて悲しむ', score: 2 },
        { label: '意見の違いとして受け入れる', score: 1 }
      ]
    },
    2: {
      q: 'グループの雰囲気が最悪です。',
      options: [
        { label: '冗談を言って和ませる', score: 4 },
        { label: 'みんなの話を聞いて回る', score: 3 },
        { label: '黙って嵐が過ぎるのを待つ', score: 2 },
        { label: 'その場から離れる', score: 1 }
      ]
    },
    3: {
      q: '「もっと感情表現した方がいいよ（感情を否定された）」',
      options: [
        { label: 'かなり傷つく', score: 4 },
        { label: '気にする', score: 3 },
        { label: '理由を考える', score: 2 },
        { label: '気にしない', score: 1 }
      ]
    },
    4: {
      q: '「感情表現をもっとした方がいい」と言われました。',
      options: [
        { label: '好きにさせて', score: 4 },
        { label: 'どういう意味？', score: 3 },
        { label: 'ちょっと傷つく', score: 2 },
        { label: 'へー', score: 1 }
      ]
    }
  }
};
