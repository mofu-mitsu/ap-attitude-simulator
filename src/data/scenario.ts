import { ScenarioStep } from '../types';

export const scenario: ScenarioStep[] = [
  {
    id: 'disclaimer',
    messages: [
      { id: 'm_disc1', sender: 'system', text: '【⚠️ 警告と同意 ⚠️】', delay: 1000 },
      { id: 'm_disc2', sender: 'system', text: '本シミュレーションには、苦手な質問や理不尽なギミックが含まれる場合があります。', delay: 1500 },
      { id: 'm_disc3', sender: 'system', text: '案内キャラクターの強烈な個性を作品の一部として受け入れ、診断結果やエラーに不満を感じてもキャラクターへ怒らないことを約束できますか？🥺', delay: 1500 }
    ],
    inputType: 'choice',
    options: [
      { label: '約束する🥺', scores: {} },
      { label: '無理かも…（引き返す）', scores: {}, next: 'exit' }
    ]
  },
  {
    id: 'init-checkbox',
    messages: [
      { id: 'm_chk1', sender: 'system', text: 'シミュレーションを始める前に、あなたの「普段の振る舞い」に最も近いものを【最大3つ】選んでください。', delay: 1500 },
    ],
    inputType: 'checkbox',
    options: [
      { label: '目標達成のためなら強引に進める', scores: { first: { v: 2 } } },
      { label: '理不尽なルールは絶対に受け入れない', scores: { first: { l: 2 } } },
      { label: '感情を抑えられず顔に出やすい', scores: { first: { e: 2 } } },
      { label: '快適な環境や物質的な豊かさを追求する', scores: { first: { f: 2 } } },
      { label: '相手の望む役割を自然に演じられる', scores: { second: { e: 2, v: 1 } } },
      { label: '複雑な議論の仲裁役になることが多い', scores: { second: { l: 2, e: 1 } } },
      { label: '「どうでもいい」「なんでもいい」が口癖', scores: { fourth: { v: 2, f: 2 } } },
      { label: '自分の気持ちを言葉にするのが面倒', scores: { fourth: { e: 2, l: 1 } } },
    ]
  },
  {
    id: 'init-checkbox-2',
    messages: [
      { id: 'm_chk2', sender: 'system', text: '続けて、最も「自分が得意だ」と感じるアプローチを選んでください（最大3つ）。', delay: 1500 },
    ],
    inputType: 'checkbox',
    options: [
      { label: '人に指示を出し、全体を動かすこと', scores: { first: { v: 2 }, second: { v: 1 } } },
      { label: 'バラバラな情報を論理的に整理すること', scores: { first: { l: 2 }, second: { l: 1 } } },
      { label: 'その場の空気を盛り上げ、共感を生むこと', scores: { first: { e: 2 }, second: { e: 1 } } },
      { label: '効率的な手順や、物理的な環境を整えること', scores: { first: { f: 2 }, second: { f: 1 } } },
      { label: '誰かの目標や意思決定をサポートすること', scores: { second: { v: 2 } } },
      { label: '人の悩みを聞き、感情に寄り添うこと', scores: { second: { e: 2 } } },
      { label: '他人の論理の穴を見つけ、議論を深めること', scores: { second: { l: 2 } } },
      { label: '体力仕事や雑務を率先して引き受けること', scores: { second: { f: 2 } } },
    ]
  },
  {
    id: 'init-checkbox-3',
    messages: [
      { id: 'm_chk3', sender: 'system', text: '最後に、あなたが「どうしても苦手・苦痛だ」と感じるものを選んでください（最大3つ）。', delay: 1500 },
    ],
    inputType: 'checkbox',
    options: [
      { label: '自分の本当の気持ちや弱さをさらけ出すこと', scores: { third: { e: 2 } } },
      { label: '論理的な根拠を細かく説明させられること', scores: { third: { l: 2 } } },
      { label: '責任を負わされ、決断を迫られること', scores: { third: { v: 2 } } },
      { label: '自分の外見や生活習慣を指摘されること', scores: { third: { f: 2 } } },
      { label: '「あなたはどう思う？」と意見を求められること', scores: { third: { v: 1, l: 1 } } },
      { label: '感情的な対立や、ドロドロした人間関係', scores: { third: { e: 1 }, fourth: { e: 2 } } },
      { label: '細かいルールや手順に縛られること', scores: { third: { f: 1, l: 1 } } },
      { label: '自分のために時間やお金を使うこと', scores: { fourth: { f: 2, v: 1 } } },
    ]
  },
  {
    id: 'timeline',
    messages: [
      { id: 'm_tl1', sender: 'system', text: '【SNSタイムライン】', delay: 1500 },
      { id: 'm_tl2', sender: 'system', text: 'TLに色んな投稿が流れてきました。一番最初に「反応（いいねやリプライ）」したいのはどれ？', delay: 1500 },
    ],
    inputType: 'timeline',
    options: [
      { label: '仕事辞めたい😭', scores: { first: { e: 2 } } },
      { label: '猫かわいい🐈', scores: { first: { f: 2 } } },
      { label: 'AIに仕事奪われるかも怖い🤖', scores: { first: { l: 2 } } },
      { label: 'プロジェクト達成した！🎉', scores: { first: { v: 2 } } },
    ]
  },
  {
    id: 'priority-tap',
    messages: [
      { id: 'm_pt1', sender: 'system', text: '【思考のバブル】', delay: 1500 },
      { id: 'm_pt2', sender: 'system', text: 'あなたの頭の中に浮かぶ「言葉」。直感で最初にタップするならどれ？', delay: 1500 },
    ],
    inputType: 'priority-tap',
    options: [
      { label: '理由', scores: { first: { l: 2 } } },
      { label: '気持ち', scores: { first: { e: 2 } } },
      { label: '目的', scores: { first: { v: 2 } } },
      { label: '現実', scores: { first: { f: 2 } } },
    ]
  },
  {
    id: 'intro',
    messages: [
      { id: 'm1', sender: '🐛', text: '『合理的』という言葉は便利だけど、観察していると人によって意味が違う。', delay: 1500 },
      { id: 'm2', sender: '🐛', text: '最短時間を合理と呼ぶ人。\n成功率を合理と呼ぶ人。\n楽しさを合理と呼ぶ人。\n失敗しないことを合理と呼ぶ人。', delay: 1500 },
      { id: 'm3', sender: '🐛', text: 'だから、『合理的だった』という結論だけでは、分析として不十分になる。重要なのは、その人が何を最適化したのか。そこに個体差が現れる。', delay: 4500 },
      { id: 'm4', sender: '🐛', text: '……君なら、合理性をどう定義する？', delay: 1500 },
    ],
    inputType: 'choice',
    options: [
      { label: '面白い。私なら〇〇かな。', scores: { first: { l: 2 } } },
      { label: 'そういう考えもあるね。', scores: { fourth: { e: 2 } } },
      { label: 'え、難しいwww', scores: { fourth: { e: 1 } } },
      { label: '🐛スタンプを送る', scores: { first: { v: 2, f: 2 } }, metadata: { isStamp: true, stampText: '🐛' } },
      { label: '( ˙꒳˙ )ﾁｮﾄﾅﾆｲｯﾃﾙｶﾜｶﾝﾅｲ', scores: { fourth: { f: 2 } }, metadata: { isStamp: true, stampText: '( ˙꒳˙ )' } },
    ]
  },
  {
    id: 'slider-bug',
    messages: [
      { id: 'm5', sender: '🐛', text: 'ほう。', delay: 1500 },
      { id: 'm6', sender: '🐛', text: 'では、具体的に君の「合理性」の重心はどこにある？', delay: 1500 },
    ],
    inputType: 'slider-bug'
  },
  {
    id: 'bug-text',
    messages: [
      { id: 'm_bt1', sender: '🐛', text: 'なるほど。', delay: 1500 },
      { id: 'm_bt2', sender: '🐛', text: '君は合理性をそう定義するわけだ。しかし、それは“誰にとって”合理的なのだろうか。', delay: 1500 },
      { id: 'm_bt3', sender: '🐛', text: '君自身にとってか、システムにとってか、それとも名もなき群衆にとってか？\n君のその「合理性」が、他者の非合理と衝突したとき、君はどう振る舞う？自由に意見を聞かせてほしい。', delay: 5250 },
    ],
    inputType: 'text'
  },
  {
    id: 'darling-interruption',
    messages: [
      { id: 'm7', sender: '🥺', text: 'ねぇ、ダーリン♡', delay: 1500 },
      { id: 'm8', sender: '🥺', text: 'ここまでのあなたの回答……“本音”と“演出”、どちらが多くなっちゃったのかな〜？', delay: 1500 },
    ],
    inputType: 'slider-darling'
  },
  {
    id: 'avatar-builder',
    messages: [
      { id: 'm_av1', sender: '🥺', text: 'うふふ♡', delay: 1500 },
      { id: 'm_av2', sender: '🥺', text: 'ところで、ここであなた自身の「アバター」を作ってみて？ どんな姿で私に会いに来てくれるのかな〜？', delay: 1500 },
    ],
    inputType: 'avatar-builder'
  },
  {
    id: 'darling-redpen',
    messages: [
      { id: 'm_red1', sender: '🥺', text: '……ねぇ。', delay: 1500 },
      { id: 'm_red3', sender: '🥺', text: '（あなたが作ったアバターに、赤いペンで無残な×印が次々と書き込まれていく……！）', delay: 2000 },
      { id: 'm_red4', sender: '🥺', text: 'その服の合わせ方……。まるで、クローゼットにあるものを適当に掴んで、鏡も見ずに着たみたい。色味の不調和が、私の網膜を汚しているわ。', delay: 4500 },
      { id: 'm_red5', sender: '🥺', text: 'それに、その立ち姿。自分では『自然体』のつもり？ ……ふふ、端から見れば、ただの『自信のなさの現れ』にしか見えないのに。滑稽だわぁ♡', delay: 5250 },
      { id: 'm_red6', sender: '🥺', text: '外面すら整えられない人間が、内面の正しさを主張したところで……誰がそれを『美しい』と認めるのかしら？', delay: 4500 },
    ],
    inputType: 'darling-redpen'
  },
  {
    id: 'darling-3v-erase',
    messages: [
      { id: 'm_3v1', sender: '🥺', text: 'ねぇ、ダーリン。あなたにとって『価値ある人間』の条件って何かしら？ あなた自身の言葉で、自信を持って語ってみて？', delay: 1500 },
    ],
    inputType: 'disabled-choices', options: [
      { label: '新しい価値を生み出せる人', scores: {} },
      { label: '周りを笑顔にできる人', scores: {} },
      { label: '自分の信念を貫ける人', scores: {} },
      { label: '誰かのために尽くせる人', scores: {} }
    ]
  },
  {
    id: 'darling-3e-group',
    messages: [
      { id: 'm_3e1', sender: 'system', text: '【グループチャット】', delay: 1500 },
      { id: 'm_3e2', sender: '💬', text: '今週末どっか行こーよ！', delay: 1500 },
      { id: 'm_3e3', sender: '😎', text: 'いいね！ 海とかどお？', delay: 1500 },
      { id: 'm_3e4', sender: '👻', text: '暑いのやだ〜。カフェでよくない？', delay: 1500 },
    ],
    inputType: 'group-chat'
  },
  {
    id: 'bug-3l-glitch',
    messages: [
      { id: 'm_3l1', sender: '🐛', text: '『論理の矛盾を検知。君は先ほどの設問でAという傾向を示しつつ、別の行動ではBという結果を出した。これは構造的に成立しない。説明を要求する。』', delay: 2000 },
    ],
    inputType: 'text-erase'
  },
  {
    id: 'darling-3f-posture',
    messages: [
      { id: 'm_3f1', sender: 'system', text: '※デバイスの環境ログを解析中……', delay: 1500 },
      { id: 'm_3f2', sender: '🥺', text: 'ねぇ、ダーリン♡ 今、どんな体勢でスマホ触ってるの？ ……背中が丸まってて、なんだか『疲れ切った猫』みたいになっているのが、ログから丸見えよ？♡', delay: 2000 },
    ],
    inputType: 'posture-check',
    options: [
      { label: '部屋は綺麗だし、姿勢も良い', scores: { third: { v: 2, f: 1 } } },
      { label: '見ないでほしい', scores: { third: { f: 2, e: 1 } } },
      { label: 'めんどくさいしやだよー', scores: { third: { f: 2 }, fourth: { f: 2 } } },
    ]
  },
  {
    id: 'dice-event',
    messages: [
      { id: 'm_dice1', sender: 'system', text: '突然、目の前にサイコロが現れた。', delay: 1500 },
    ],
    inputType: 'dice'
  },
  {
    id: 'friend-advice',
    messages: [
      { id: 'm_fa1', sender: '💬', text: '実は恋人と喧嘩しちゃってさ……どうしよう。', delay: 1500 },
    ],
    inputType: 'choice',
    options: [
      { label: '共感する', scores: { second: { e: 2 } } },
      { label: '原因を探る', scores: { second: { l: 2 } } },
      { label: '解決策を出す', scores: { second: { v: 2 } } },
      { label: '様子を見る', scores: { second: { f: 2 } } },
    ]
  },
  {
    id: 'rank-problem',
    messages: [
      { id: 'm_rk1', sender: 'system', text: '問題発生。まず考える順番を【タップして】並び替えてください。', delay: 1500 },
    ],
    inputType: 'sortable-rank',
    options: [
      { label: '原因', value: 'l', scores: {} },
      { label: '人', value: 'e', scores: {} },
      { label: '現実', value: 'f', scores: {} },
      { label: '目標', value: 'v', scores: {} },
    ]
  },
  {
    id: 'read-receipt',
    messages: [
      { id: 'm10', sender: '💬', text: '今電話できる？', delay: 1500 },
    ],
    inputType: 'read-receipt'
  },
  {
    id: 'incoming-call-event',
    messages: [
    ],
    inputType: 'incoming-call'
  },
  {
    id: 'phone-response',
    messages: [
      { id: 'm_pr_d1', sender: '💬', text: '『もしもし？ さっきの話なんだけど…』', delay: 2000 },
      { id: 'm_pr_d2', sender: '💬', text: '『実はさ、仕事辞めて新しいこと始めようと思ってて。』', delay: 2000 },
      { id: 'm_pr_d3', sender: '💬', text: '『でも、具体的に何をするかはまだ全く決めてないんだよね。』', delay: 2000 },
      { id: 'm_pr_d4', sender: '💬', text: '『ねえ……あなたはどう思う？ 賛成してくれる？』', delay: 2000 },
      { id: 'm_pr1', sender: 'system', text: '友達の無計画な相談に対して、あなたはどう答えますか？', delay: 1500 }
    ],
    inputType: 'choice',
    options: [
      { label: '無計画すぎる。まずは具体的なプランを立てるべきだと諭す', scores: { first: { l: 2 }, third: { e: 1 } } },
      { label: '本人が決めたことなら応援する！と背中を押す', scores: { second: { e: 2 }, fourth: { l: 2 } } },
      { label: 'どんなビジネスか気になって質問攻めにする', scores: { second: { l: 2 }, third: { f: 1 } } },
      { label: '正直どうでもいいので、適当に相槌を打つ', scores: { fourth: { v: 2, e: 2 } } }
    ]
  },
  {
    id: 'conflict-choice',
    messages: [
      { id: 'm_cc1', sender: 'system', text: '友達と意見が対立しました。最初に気になるのは？', delay: 1500 },
    ],
    inputType: 'choice',
    options: [
      { label: 'どちらが正しいか', scores: { second: { l: 2 } } },
      { label: 'どうすれば話がまとまるか', scores: { second: { v: 2 } } },
      { label: '相手がどう感じたか', scores: { second: { e: 2 } } },
      { label: '現実的にどう解決するか', scores: { second: { f: 2 } } },
    ]
  },
  {
    id: 'conflict-rank',
    messages: [
      { id: 'm_cr1', sender: 'system', text: 'その理由を一番近い順に【タップして】並び替えてください。', delay: 1500 },
    ],
    inputType: 'sortable-rank',
    options: [
      { label: '納得したい', value: 'l', scores: {} },
      { label: '相手を理解したい', value: 'v', scores: {} },
      { label: '関係を壊したくない', value: 'e', scores: {} },
      { label: '早く終わらせたい', value: 'f', scores: {} },
    ]
  }
,
  {
    id: 'help-wanted',
    messages: [
      { id: 'm_hw1', sender: 'system', text: '【質問】自分が困っている時、他人に【最もやってほしいこと】と【最も余計なお世話だと感じること】は何ですか？', delay: 1200 }
    ],
    inputType: 'checkbox',
    options: [
      { label: '考え方を整理してほしい（嬉しい）', scores: { second: { l: 2 } } },
      { label: '一緒に方向性を決めてほしい（嬉しい）', scores: { second: { v: 2 } } },
      { label: '生活や体調を整えてほしい（嬉しい）', scores: { second: { f: 2 } } },
      { label: 'ただ気持ちを受け止めてほしい（嬉しい）', scores: { second: { e: 2 } } },
      { label: '考え方を否定される（嫌だ）', scores: { first: { l: 2 }, third: { l: 1 } } },
      { label: '生き方や目標を決められる（嫌だ）', scores: { first: { v: 2 }, third: { v: 1 } } },
      { label: '生活習慣を管理・干渉される（嫌だ）', scores: { first: { f: 2 }, third: { f: 1 } } },
      { label: '「こう感じてるんでしょ」と決めつけられる（嫌だ）', scores: { first: { e: 2 }, third: { e: 1 } } },
    ]
  },
  {
    id: 'trust-friend',
    messages: [
      { id: 'm_tf1', sender: 'system', text: '【究極の選択】\n親友に一週間だけ、自分の人生の【ある部分】を完全に任せなければなりません。どれを任せますか？', delay: 1200 }
    ],
    inputType: 'choice',
    options: [
      { label: '食事・睡眠などの生活管理', scores: { fourth: { f: 2 } } },
      { label: 'やるべきタスクとスケジュールの決定', scores: { fourth: { v: 2 } } },
      { label: '他人とのメッセージの返信や人付き合い', scores: { fourth: { e: 2 } } },
      { label: '仕事や勉強のやり方・学習計画', scores: { fourth: { l: 2 } } }
    ]
  },
  {
    id: 'denial-event',
    messages: [
      { id: 'm_de1', sender: 'system', text: 'ダーリンがあなたの考えを聞いて、こう言いました。', delay: 1500 },
      { id: 'm_de2', sender: '🥺', text: '『ねぇダーリン。あなたさっきから色々言ってるけど、その考え方、根本的に間違ってるわよ♡』', delay: 1500 },
    ],
    inputType: 'choice',
    options: [
      { label: '「どこが間違ってるの？」と理由を求める', scores: { first: { l: 2 } } },
      { label: '「そういう考えもあるね」と受け止める', scores: { second: { l: 2 } } },
      { label: '「やっぱり自分が間違ってたのかな…」と悩む', scores: { third: { l: 2 } } },
      { label: '「もうどうでもいいや」と流す', scores: { fourth: { l: 2 } } }
    ]
  },
  {
    id: 'subtype-logic',
    messages: [
      { id: 'm_stl', sender: 'system', text: 'あなたの【考え方（Logic）】について、一番近いものは？', delay: 1500 }
    ],
    inputType: 'choice',
    options: [
      { label: '自分で結論を出したい', scores: { attitude: { L: 1 }, first: { l: 5 } } },
      { label: '人と議論して深めたい', scores: { attitude: { L: 2 }, second: { l: 5 } } },
      { label: '間違っていないか不安', scores: { attitude: { L: 3 }, third: { l: 5 } } },
      { label: 'あまりこだわらない', scores: { attitude: { L: 4 }, fourth: { l: 5 } } }
    ]
  },
  {
    id: 'subtype-volition',
    messages: [
      { id: 'm_stv', sender: 'system', text: 'あなたの【決断（Volition）】について、一番近いものは？', delay: 1500 }
    ],
    inputType: 'choice',
    options: [
      { label: '自分で決めたい', scores: { attitude: { V: 1 }, first: { v: 5 } } },
      { label: '一緒に決めたい', scores: { attitude: { V: 2 }, second: { v: 5 } } },
      { label: '決断を間違えたくない', scores: { attitude: { V: 3 }, third: { v: 5 } } },
      { label: '誰かが決めてもいい', scores: { attitude: { V: 4 }, fourth: { v: 5 } } }
    ]
  },
  {
    id: 'subtype-physics',
    messages: [
      { id: 'm_stp', sender: 'system', text: 'あなたの【生活・物質（Physics）】について、一番近いものは？', delay: 1500 }
    ],
    inputType: 'choice',
    options: [
      { label: '自分のこだわりを貫きたい', scores: { attitude: { F: 1 }, first: { f: 5 } } },
      { label: '他人と共有して楽しみたい', scores: { attitude: { F: 2 }, second: { f: 5 } } },
      { label: '押し付けられるのは嫌だけど不安', scores: { attitude: { F: 3 }, third: { f: 5 } } },
      { label: 'ぶっちゃけ面倒・どうでもいい', scores: { attitude: { F: 4 }, fourth: { f: 5 } } }
    ]
  },
  {
    id: 'subtype-emotion',
    messages: [
      { id: 'm_ste', sender: 'system', text: 'あなたの【感情・表現（Emotion）】について、一番近いものは？', delay: 1500 }
    ],
    inputType: 'choice',
    options: [
      { label: '自分の感情は自分で決める', scores: { attitude: { E: 1 }, first: { e: 5 } } },
      { label: '他人と感情を共有したい', scores: { attitude: { E: 2 }, second: { e: 5 } } },
      { label: 'どう思われるか不安', scores: { attitude: { E: 3 }, third: { e: 5 } } },
      { label: '感情を語ることに執着がない', scores: { attitude: { E: 4 }, fourth: { e: 5 } } }
    ]
  },
  {
    id: 'emotion-rejection',
    messages: [
      { id: 'm_er1', sender: 'system', text: '過去に、他者から言われて一番「ムッと来た」言葉はどれですか？', delay: 1500 }
    ],
    inputType: 'choice',
    options: [
      { label: '「冷たいね」「ロボットみたい」', scores: { third: { e: 2 } } },
      { label: '「なんでそんなことで泣くの？」', scores: { third: { e: 2 } } },
      { label: '「頭固いね」「理屈っぽい」', scores: { third: { l: 2 } } },
      { label: '「だらしないね」「現実見なよ」', scores: { third: { f: 2 } } }
    ]
  },
  {
    id: 'backpack-event',
    messages: [
      { id: 'm_bp1', sender: 'system', text: '【お助けリュック】\nあなたは今、4つの重い荷物を背負っています。', delay: 1200 },
      { id: 'm_bp2', sender: 'system', text: '「考えること」「決めること」「生活の管理」「人付き合い」…\nこの中で、誰かに【1つだけ】預けられるとしたら？', delay: 2500 }
    ],
    inputType: 'choice',
    options: [
      { label: '「考えること」を預ける', scores: { fourth: { l: 2 } } },
      { label: '「決めること」を預ける', scores: { fourth: { v: 2 } } },
      { label: '「生活の管理」を預ける', scores: { fourth: { f: 2 } } },
      { label: '「人付き合い」を預ける', scores: { fourth: { e: 2 } } }
    ]
  },
  {
    id: 'backpack-reject',
    messages: [
      { id: 'm_bpr1', sender: 'system', text: '【追加質問】絶対に預けたくない荷物はどれでしたか？', delay: 1000 }
    ],
    inputType: 'choice',
    options: [
      { label: '地図とコンパス', scores: { first: { l: 2 }, third: { l: 2 } } },
      { label: '全員の食料', scores: { first: { f: 2 }, third: { f: 2 } } },
      { label: '進行スケジュールの決定権', scores: { first: { v: 2 }, third: { v: 2 } } },
      { label: 'メンバーのテンション管理', scores: { first: { e: 2 }, third: { e: 2 } } }
    ]
  },
  {
    id: 'logic-sort',
    messages: [
      { id: 'm_ls1', sender: 'system', text: '【論理並べ替えゲーム】', delay: 1500 },
      { id: 'm_ls2', sender: 'system', text: 'LSI芋虫がバラバラの文章を送ってきました。論理的に意味が通る順に【タップして】並べ替えてください。', delay: 2500 }
    ],
    inputType: 'sortable-rank',
    options: [
      { label: 'だから、明日は傘が必要だ', value: 'l1', scores: {} },
      { label: '空が暗くなってきた', value: 'l2', scores: {} },
      { label: '天気予報でも雨だと言っていた', value: 'l3', scores: {} },
      { label: '雨が降りそうだ', value: 'l4', scores: {} }
    ]
  },
  {
    id: 'observation-game',
    messages: [
      { id: 'm_og1', sender: 'system', text: '【相手観察ゲーム】', delay: 1500 },
      { id: 'm_og2', sender: 'system', text: 'これから5秒間だけ、あるグループチャットの様子が表示されます。しっかり見てください。', delay: 2500 },
    ],
    inputType: 'observation-chat',
    options: []
  },
];
