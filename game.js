/**
 * Sela's Land — Dialogue Engine
 * Chapter 01: 10-year-old Sela
 */

(function () {
  "use strict";

  const screens = {
    title: document.getElementById("screen-title"),
    intro: document.getElementById("screen-intro"),
    transit: document.getElementById("screen-transit"),
    tea: document.getElementById("screen-tea"),
    bridge: document.getElementById("screen-bridge"),
    chat: document.getElementById("screen-chat"),
    end: document.getElementById("screen-end"),
    flowmap: document.getElementById("screen-flowmap"),
  };

  const btnStart = document.getElementById("btn-start");
  const btnSkipIntro = document.getElementById("btn-skip-intro");
  const btnBack = document.getElementById("btn-back");
  const btnReplay = document.getElementById("btn-replay");
  const btnToTitle = document.getElementById("btn-to-title");
  const btnEndFlowmap = document.getElementById("btn-end-flowmap");
  const btnTitleFlowmap = document.getElementById("btn-title-flowmap");
  const btnFlowmapBack = document.getElementById("btn-flowmap-back");
  const endStoryUnlock = document.getElementById("end-story-unlock");
  const titleStoryUnlock = document.getElementById("title-story-unlock");
  const flowmapTree = document.getElementById("flowmap-tree");
  const btnBridgeContinue = document.getElementById("btn-bridge-continue");
  const bridgeBody = document.getElementById("bridge-body");
  const bridgeLabel = document.getElementById("bridge-label");
  const bridgeTime = document.getElementById("bridge-time");
  const bridgeBtnText = document.getElementById("bridge-btn-text");
  const introTime = document.getElementById("intro-time");
  const teaTime = document.getElementById("tea-time");
  const introLines = document.querySelectorAll("#intro-body .intro-line");
  const transitLines = document.querySelectorAll("#transit-body .transit-line");
  const teaLines = document.querySelectorAll("#tea-body .tea-line");
  const transitWater = document.getElementById("transit-water");
  const transitFlash = document.getElementById("transit-flash");
  const transitBlackout = document.getElementById("transit-blackout");
  const chatMessages = document.getElementById("chat-messages");
  const contactNameEl = document.getElementById("contact-name");
  const contactStatusEl = document.getElementById("contact-status");
  const avatarImg = document.getElementById("avatar-img");
  const choicesPanel = document.getElementById("choices-panel");
  const choicesList = document.getElementById("choices-list");
  const chapterProgress = document.getElementById("chapter-progress");
  const phoneFrame = document.querySelector(".phone-frame");

  const PLAYER = { name: "Rex", birthday: { month: 6, day: 13, label: "6.13" } };

  const TIMELINE = {
    selaBirthYear: 2007,
    location: "上海",
    chapters: [
      { age: 10, id: "ch10" },
      { age: 15, id: "ch15" },
      { age: 18, id: "ch18" },
    ],
  };

  const CURRENT_CHAPTER = TIMELINE.chapters.find((c) => c.age === 10);
  const SPEAKER_CH10 = `Sela · 10岁`;
  const SPEAKER = SPEAKER_CH10;
  const TYPING_LABEL = "正在输入中...";

  const BAD_CH10_ENDINGS = ["future_blocked"];
  const BAD_CH15_ENDINGS = ["ch15_jerk"];
  const SPEAKER_15 = "Sela · 15岁";
  const SPEAKER_18 = "Sela · 18岁";

  const AVATAR_BY_AGE = {
    10: { src: "assets/sela-10.png", alt: "10岁的 Sela" },
    15: { src: "assets/sela-15.png", alt: "15岁的 Sela" },
    18: { src: "assets/sela-18.png", alt: "18岁的 Sela" },
  };

  const BRIDGE_OPENING = [
    "茶餐厅的霓虹灯管还在头顶嗡嗡响。",
    "你低头看了一眼手机——距离上一条消息发出，只过去了不到五分钟。",
    "但手机屏幕里的那个小女孩，好像已经认识你很久。",
  ];

  const BRIDGE_MIDDLE = {
    future_self: [
      "你记得，最后还是告诉她了。",
      "不是什么「未来的你」。是她未来的恋人。",
      "她那时候沉默了很久，然后发来一个表情包，说：「……那你为什么不早说呀。」",
    ],
  };

  const BRIDGE_CLOSING = [
    "从那以后，你们的聊天就没有断过。",
    "你看着她从「一天想吃十个冰淇淋」，变成会跟你说「今天考试好难」。",
    "你看着她从「日记本小姐」，变成会把心事藏在省略号里。",
    "你看着她一点一点长大——",
    "而你在茶餐厅里，只是发了几条消息的功夫。",
    "手机震了一下。",
    "是 Sela 发来的新消息。",
    "你点开。",
    "她的头像换了一张——不再是10岁时那张模糊的自拍，而是一个侧脸剪影，像是不想被看清表情。",
  ];

  const BRIDGE_LINES = {
    lover: [...BRIDGE_OPENING, ...BRIDGE_CLOSING],
    future_self: [...BRIDGE_OPENING, ...BRIDGE_MIDDLE.future_self, ...BRIDGE_CLOSING],
  };

  const BRIDGE_15_TO_18 = [
    "茶餐厅的霓虹灯管依旧在头顶嗡响。",
    "但你感觉有什么东西不一样了。",
    "你低头看着，发现 <em>Sela's Land</em> 变成了你自己的手机。",
    "屏幕上的聊天记录一直更新着，她的头像也换了，连带着聊天背景都变得不同。",
    "你愣了一下。",
    "因为你记得这张照片是你拍的。",
    "但你什么时候拍的？",
    "你今天才穿越回过去，你今天才认识了过去的 Sela……",
    "所有的记忆同时在脑子里炸开，两条时间线终于撞在了一起。",
  ];

  const TYPING_THINK_BASE = 700;
  const TYPING_THINK_PER_CHAR = 12;
  const TYPING_CHAR_MS = 52;
  const TYPING_LINE_PAUSE = 650;

  /** 15岁 · 输入又删掉：type=显示三点，stop=停手空白 */
  const HESITATE_PRESETS = {
    short: [
      { type: 550 },
      { stop: 380 },
      { type: 750 },
    ],
    medium: [
      { type: 950 },
      { stop: 620 },
      { type: 1300 },
    ],
    long: [
      { type: 1600 },
      { stop: 950 },
      { type: 1400 },
      { stop: 700 },
      { type: 2000 },
    ],
    reveal: [
      { type: 2100 },
      { stop: 1200 },
      { type: 900 },
      { stop: 850 },
      { type: 2600 },
    ],
    flustered: [
      { type: 2400 },
      { stop: 1400 },
      { type: 1800 },
      { stop: 1100 },
      { type: 3200 },
      { stop: 750 },
      { type: 1500 },
    ],
  };

  function hesitateMs(ms) {
    return Math.round(ms * (0.88 + Math.random() * 0.24));
  }

  function yearAtAge(age) {
    return TIMELINE.selaBirthYear + age;
  }

  let currentNode = null;
  let bubbleTimer = null;
  let typewriterTimer = null;
  let typingBubbleEl = null;
  let isPlayingBubbles = false;
  let bubbleState = null;
  let progress = 0;
  let currentAge = 10;
  let chosenPath = null;
  let chosenEnding = null;
  let flowTimers = [];
  let flowmapReturnTo = "end";
  let storyMapUnlocked = false;
  let activeCheckpointId = null;
  let isJumpReplay = false;
  let bridgeNextAge = 15;

  function scheduleFlow(fn, ms) {
    const id = setTimeout(() => {
      flowTimers = flowTimers.filter((t) => t !== id);
      fn();
    }, ms);
    flowTimers.push(id);
    return id;
  }

  function clearFlowTimers() {
    flowTimers.forEach(clearTimeout);
    flowTimers = [];
  }

  function clearAllTimers() {
    clearFlowTimers();
    clearBubbleTimers();
  }

  function resetIntroScreen() {
    introLines.forEach((line) => {
      line.classList.add("hidden");
      line.classList.remove("visible");
    });
    transitLines.forEach((line) => {
      line.classList.add("hidden");
      line.classList.remove("visible");
    });
    teaLines.forEach((line) => {
      line.classList.add("hidden");
      line.classList.remove("visible");
    });
    transitWater?.classList.remove("active");
    transitFlash?.classList.remove("active");
    transitBlackout?.classList.remove("active");
    btnSkipIntro.classList.add("hidden");
  }

  function resetTransitEffects() {
    transitWater?.classList.remove("active");
    transitFlash?.classList.remove("active");
    transitBlackout?.classList.remove("active");
  }

  function triggerTransitFlash() {
    if (!transitFlash) return;
    transitFlash.classList.remove("active");
    void transitFlash.offsetWidth;
    transitFlash.classList.add("active");
  }

  function resetEndScreenCopy() {
    const endTitle = document.getElementById("end-title");
    const endDesc = document.getElementById("end-desc");
    if (endTitle) endTitle.textContent = END_SCREEN_VARIANTS.default.title;
    if (endDesc) endDesc.innerHTML = END_SCREEN_VARIANTS.default.desc;
    setEndStoryMapVisible(false);
  }

  function setUnlockSectionVisible(el, visible) {
    if (!el) return;
    el.classList.toggle("hidden", !visible);
    el.hidden = !visible;
  }

  function setEndStoryMapVisible(visible) {
    setUnlockSectionVisible(endStoryUnlock, visible);
  }

  function updateTitleStoryMapUI() {
    setUnlockSectionVisible(titleStoryUnlock, storyMapUnlocked);
  }

  function unlockStoryMapForSession() {
    if (storyMapUnlocked) return;
    storyMapUnlocked = true;
    updateTitleStoryMapUI();
  }

  function setStoryMapUnlocked(unlocked) {
    if (unlocked) unlockStoryMapForSession();
    setEndStoryMapVisible(unlocked);
  }

  const DIALOGUE = {
    start: {
      speaker: SPEAKER,
      text: "你是谁？",
      choices: [
        { label: "我是你未来的恋人", next: "lover" },
        { label: "我是未来的你哦", next: "future_self" },
      ],
    },

    lover: {
      speaker: SPEAKER,
      text:
        "恋人就是会一直在一起的那种人对吧？我看过好多小说，里面的男主女主超让我羡慕的。可是爸爸妈妈老吵架诶，那我和你以后也会吵吗？",
      choices: [
        { label: "我们感情很好，从不吵架", next: "lover_no_fight" },
        { label: "我们总是吵架", next: "lover_fight" },
      ],
    },
    lover_no_fight: {
      speaker: SPEAKER,
      text: "那你肯定超级好！！",
      next: "lover_ask_name",
    },
    lover_fight: {
      speaker: SPEAKER,
      text:
        "我爸说我嘴皮子特别溜，说我要是早点出生能让日本去打美国哈哈哈！那跟你吵架肯定是我赢啦！",
      emoji: "😤",
      next: "lover_ask_name",
    },
    lover_ask_name: {
      speaker: SPEAKER,
      text: "那你叫什么名字呀？",
      choices: [{ label: "我叫做Rex", next: "lover_foreign" }],
    },
    lover_foreign: {
      speaker: SPEAKER,
      text: "诶？是英文名字诶，你是外国人吗？",
      choices: [
        { label: "没错，我是一个美国人", next: "lover_american" },
        {
          label: "只是英文名字而已，你现在比较喜欢叫我这个哦",
          next: "lover_english_name",
        },
      ],
    },
    lover_american: {
      speaker: SPEAKER,
      text:
        "天啊我和美国人谈恋爱？？这也太酷了吧！！我要跟同桌讲！！",
      next: "lover_final_choice",
    },
    lover_english_name: {
      speaker: SPEAKER,
      text: "哇未来的我好洋气啊",
      next: "lover_final_choice",
    },
    lover_final_choice: {
      speaker: "你",
      text: "",
      choicesOnly: true,
      choices: [
        { label: "今天是我的生日哦", next: "lover_birthday" },
        { label: "你有没有什么问题想要问我？", next: "lover_lonely" },
      ],
    },
    lover_birthday: {
      speaker: SPEAKER,
      text: `！！！真的吗！！生日快乐！！未来的我在你旁边吗？要一直一直幸福哦！！`,
      next: null,
      onComplete: () => handleChapterComplete(),
    },
    lover_lonely: {
      speaker: SPEAKER,
      text:
        "要问什么啊…其实我也说不上来。就是最近老觉得孤单，班上朋友换来换去的，可是没人把我当最亲近的人诶，大家都有自己的好朋友，不会把我放第一。只有同桌请假了没人陪才会来找我…",
      choices: [
        { label: "你会等到为你而来的人的", next: "lover_early_love" },
      ],
    },
    lover_early_love: {
      speaker: SPEAKER,
      text:
        "哈哈哈你说的是你自己吧？其实也没那么惨啦~没人理我就写日记，我有本超厚的笔记本一直放桌上，他们叫我笔记本小姐哈哈。回家还能拿手机跟网友聊。跟你聊这么多好开心！我会等着你的，等你来找我！",
      next: null,
      onComplete: () => handleChapterComplete(),
    },

    // ── 未来的你线 ──
    future_self: {
      speaker: SPEAKER,
      text: "真的吗！！那我叫什么名字呀",
      choices: [
        { label: "饶智军", next: "future_wrong_name" },
        { label: "饶芝筠", next: "future_correct_name" },
      ],
    },
    future_wrong_name: {
      speaker: SPEAKER,
      text: "你骗人！你根本不是我，干嘛骗我？",
      choices: [
        { label: "对不起....", next: "future_sorry" },
        { label: "我没有骗你，你未来改了名字", next: "future_renamed_lie" },
      ],
    },
    future_sorry: {
      speaker: SPEAKER,
      text: "我不想理你了！",
      next: null,
      endKey: "future_blocked",
      onComplete: () => showEndScreen({ mode: "bad" }),
    },
    future_renamed_lie: {
      speaker: SPEAKER,
      text: "骗子！我是女孩子怎么可能叫这名！",
      next: null,
      endKey: "future_blocked",
      onComplete: () => showEndScreen({ mode: "bad" }),
    },
    future_correct_name: {
      speaker: SPEAKER,
      text:
        "诶？居然真是我！！我有好多问题！你现在开心吗？是不是一天能炫好多冰淇淋那种？",
      choices: [
        {
          label: "很开心，一天吃十个冰淇淋都没有人会管",
          next: "future_ice_happy",
        },
        {
          label: "也不是那么开心，你现在要保持身材，不能吃那么多",
          next: "future_diet",
        },
      ],
    },
    future_ice_happy: {
      speaker: SPEAKER,
      text: "哇！！太好啦！！光想想就超爽",
      next: "future_dinner",
    },
    future_diet: {
      speaker: SPEAKER,
      text:
        "保持身材？？好复杂哦…我以后也会这样吗？妈妈老说我可爱，陌生人也会夸我眼睛大，未来的我居然也会想这些吗？",
      choices: [
        { label: "大人的世界是很复杂的", next: "future_grow_up" },
        { label: "你现在也很美", next: "future_beautiful_now" },
      ],
    },
    future_grow_up: {
      speaker: SPEAKER,
      text: "哈哈哈我想快点长大诶",
      choices: [
        { label: "为什么？", next: "future_why_grow" },
        { label: "长大一点也不好", next: "future_grow_bad" },
      ],
    },
    future_why_grow: {
      speaker: SPEAKER,
      text:
        "我看的小说里女主都超厉害的，尖头高跟鞋一穿西装一套，走路带风，啥事都能搞定！我也想以后变成那样！",
      choices: [
        {
          label: "你未来就是这样的，很厉害，赚了很多钱",
          next: "future_success",
        },
        {
          label: "小说里说的都有美化，每个人的生活都有自己的苦难",
          next: "future_hardship",
        },
      ],
    },
    future_success: {
      speaker: SPEAKER,
      text: "哇我们以后这么厉害啊！那你肯定超累的，要好好休息哦",
      choices: [{ label: "谢谢sela", next: "future_dinner" }],
    },
    future_hardship: {
      speaker: SPEAKER,
      text:
        "哦哦…这样啊，我大概懂了。那你肯定也有烦心事吧，你也要好好歇着呀",
      choices: [{ label: "好的 谢谢sela", next: "future_dinner" }],
    },
    future_grow_bad: {
      speaker: SPEAKER,
      text: "诶？你怎么了呀",
      choices: [
        {
          label: "实习好难找，无论如何都找不到",
          next: "future_internship",
        },
      ],
    },
    future_internship: {
      speaker: SPEAKER,
      text:
        "实习是什么呀？很重要吗？我不太懂诶…不过我觉得吃饱穿暖就挺好了",
      choices: [
        {
          label: "如果这样，我们或许只能平庸一生",
          next: "future_ordinary",
        },
      ],
    },
    future_ordinary: {
      speaker: SPEAKER,
      text:
        "我觉得不算平庸吧，就是普通？能赚大钱当然好，不行的话自己过得去也很棒呀",
      choices: [{ label: "好", next: "future_dinner" }],
    },
    future_beautiful_now: {
      speaker: SPEAKER,
      text:
        "是吗…可你刚才还说要保持身材诶，大人都这么一会儿这一会儿那的吗",
      next: "future_dinner",
    },
    future_dinner: {
      speaker: SPEAKER,
      text: "好啦妈妈喊我吃饭啦！明天还能聊吗！",
      emoji: "🍽️",
      next: null,
      onComplete: () => handleChapterComplete(),
    },
  };

  const DIALOGUE_15 = {
    ch15_date: {
      speaker: SPEAKER_15,
      text: "今天几号来着？",
      choices: [
        { label: "大小姐就不能自己看看手机日期？", next: "ch15_rude" },
        { label: "是6/13", next: "ch15_613" },
        { label: "有点刻意了吧", next: "ch15_obvious" },
      ],
    },
    ch15_rude: {
      speaker: SPEAKER_15,
      text: "你烦死了，问你就说呗干嘛呛我",
      choices: [{ label: "好好好，你是祖宗", next: "ch15_birthday_ask" }],
    },
    ch15_birthday_ask: {
      speaker: SPEAKER_15,
      text: "那今天岂不是你生日？",
      choices: [
        { label: "是啊，怎么了？", next: "ch15_happy_bday" },
        { label: "居然特意记了我的生日哦？", next: "ch15_close_bday" },
      ],
    },
    ch15_613: {
      speaker: SPEAKER_15,
      text: "那今天是你生日吧？",
      choices: [
        { label: "是啊，怎么了？", next: "ch15_happy_bday" },
        { label: "居然特意记了我的生日哦？", next: "ch15_close_bday" },
      ],
    },
    ch15_happy_bday: {
      speaker: SPEAKER_15,
      text: "哦哦没有，祝你生日快乐哈",
      hesitate: "short",
      next: "ch15_gossip",
    },
    ch15_close_bday: {
      speaker: SPEAKER_15,
      text: "不是，哪有你这样的。你的生日跟我那么近，我想忘记都难吧",
      hesitate: "medium",
      choices: [
        { label: "那我真是沾光了，多谢大小姐", next: "ch15_lucky" },
        { label: "是啊，怎么了？", next: "ch15_happy_bday" },
      ],
    },
    ch15_lucky: {
      speaker: SPEAKER_15,
      text: "神经啊，笑死我了，",
      hesitate: "short",
      next: "ch15_gossip",
    },
    ch15_obvious: {
      speaker: SPEAKER_15,
      text: "？你啥意思",
      choices: [
        { label: "没啥意思", next: "ch15_annoyed" },
        { label: "今天我生日啊", next: "ch15_forgot_bday" },
      ],
    },
    ch15_annoyed: {
      speaker: SPEAKER_15,
      text: "你神经啊，莫名其妙！",
      next: "ch15_annoyed_bday",
    },
    ch15_annoyed_bday: {
      speaker: SPEAKER_15,
      text: "行了，我知道是你生日，生日快乐，行了吧？",
      choices: [{ label: "敷衍", next: "ch15_enough" }],
    },
    ch15_enough: {
      speaker: SPEAKER_15,
      text: "差不多得了！",
      next: "ch15_gossip",
    },
    ch15_forgot_bday: {
      speaker: SPEAKER_15,
      text: "哦哦你不说我都没想起来好吧",
      choices: [
        { label: "那你也没给我准备礼物了？", next: "ch15_no_gift" },
        { label: "还装", next: "ch15_pretend" },
      ],
    },
    ch15_no_gift: {
      speaker: SPEAKER_15,
      text: "不然呢？我又不知道你在哪，连地址都没有，咋送？",
      choices: [
        { label: "我今天连蛋糕都没得吃，好可怜", next: "ch15_poor" },
        { label: "没地址就不能送了吗？", next: "ch15_lazy" },
      ],
    },
    ch15_poor: {
      speaker: SPEAKER_15,
      text: "关我啥事，别在我这装可怜好吧",
      next: "ch15_gossip",
    },
    ch15_lazy: {
      speaker: SPEAKER_15,
      text: "…神经，懒得理你，给你唱歌行了吧",
      hesitate: "short",
      next: "ch15_voice",
    },
    ch15_voice: {
      speaker: SPEAKER_15,
      voice: {
        src: "assets/ch15-birthday-voice.m4a",
        label: "Sela 的语音",
      },
      next: "ch15_gossip",
    },
    ch15_pretend: {
      speaker: SPEAKER_15,
      text: "？我装啥了，滚滚滚",
      next: null,
      endKey: "ch15_jerk",
      onComplete: () => handleChapterComplete(),
    },

    ch15_gossip: {
      speaker: SPEAKER_15,
      text: "话说回来，我跟你说个八卦",
      hesitate: "medium",
      choices: [{ label: "咋", next: "ch15_confession" }],
    },
    ch15_confession: {
      speaker: SPEAKER_15,
      text: "我今天被表白了了我靠，人生中第一次",
      hesitate: "reveal",
      choices: [
        { label: "卧槽，牛逼", next: "ch15_awesome" },
        { label: "哦，然后呢？", next: "ch15_reject_guy" },
      ],
    },
    ch15_awesome: {
      speaker: SPEAKER_15,
      text: "牛逼啥，喜欢我那不是很正常吗，我这么优秀",
      choices: [{ label: "行行行，那你答应他了吗？", next: "ch15_reject_guy" }],
    },
    ch15_reject_guy: {
      speaker: SPEAKER_15,
      text: "当然是拒绝啊，他脸长得可长，我们都说他长得像马。我又不喜欢他",
      hesitate: "medium",
      choices: [
        { label: "那你喜欢谁？", next: "ch15_who_like" },
        { label: "你真残忍", next: "ch15_cruel" },
      ],
    },
    ch15_who_like: {
      speaker: SPEAKER_15,
      text: "问我干啥",
      hesitate: "short",
      choices: [{ label: "行，不问，反正我知道", next: "ch15_who_dismiss" }],
    },
    ch15_who_dismiss: {
      speaker: SPEAKER_15,
      text: "…懒得理你，反正我听不懂你在说啥",
      hesitate: "medium",
      next: "ch15_boys_say",
    },
    ch15_cruel: {
      speaker: SPEAKER_15,
      text: "行行行，你温柔，你去找跟他在一起",
      choices: [
        { label: "行啊，那你把他微信给我", next: "ch15_wechat" },
        { label: "我才不去，我也有喜欢的人了", next: "ch15_i_like" },
      ],
    },
    ch15_i_like: {
      speaker: SPEAKER_15,
      text: "我靠，这得是我吧，要是不是我，你这不是出轨吗",
      hesitate: "long",
      choices: [
        { label: "你猜", next: "ch15_guess" },
        { label: "（沉默）", next: "ch15_silence" },
      ],
    },
    ch15_guess: {
      speaker: SPEAKER_15,
      text: "……",
      hesitate: "long",
      emoji: "🙄",
      next: "ch15_boys_say",
    },
    ch15_silence: {
      speaker: SPEAKER_15,
      text: "……",
      hesitate: "long",
      next: "ch15_boys_say",
    },
    ch15_wechat: {
      speaker: SPEAKER_15,
      text: "……",
      next: null,
      endKey: "ch15_jerk",
      onComplete: () => handleChapterComplete(),
    },

    ch15_boys_say: {
      speaker: SPEAKER_15,
      text: "男生喜欢人会不会主动说啊",
      hesitate: "medium",
      choices: [
        {
          label: "会说啊，你那位马哥不就大胆说出来了吗",
          next: "ch15_jealous",
        },
        { label: "不会说，急死你", next: "ch15_anxious" },
      ],
    },
    ch15_jealous: {
      speaker: SPEAKER_15,
      text: "谁马哥，感觉你像冷宫里疯了的妃子。吃上醋了吧",
      hesitate: "medium",
      choices: [
        { label: "还真是", next: "ch15_jealous_joke" },
        { label: "谁吃醋了", next: "ch15_jealous_clear" },
      ],
    },
    ch15_jealous_joke: {
      speaker: SPEAKER_15,
      text: "？你开啥玩笑，别搞",
      hesitate: "flustered",
      choices: [{ label: "哦哦这样的", next: "ch15_end_good" }],
    },
    ch15_jealous_clear: {
      speaker: SPEAKER_15,
      text: "谁吃醋谁心里清楚，乐死了",
      hesitate: "medium",
      next: "ch15_end_good",
    },
    ch15_anxious: {
      speaker: SPEAKER_15,
      text: "其实急眼的另有其人",
      hesitate: "medium",
      choices: [
        { label: "哦，是谁？", next: "ch15_anxious_who" },
        { label: "难道你在说我？", next: "ch15_anxious_me" },
      ],
    },
    ch15_anxious_who: {
      speaker: SPEAKER_15,
      text: "好奇怪，是谁啊？我也不知道",
      next: "ch15_end_good",
    },
    ch15_anxious_me: {
      speaker: SPEAKER_15,
      text: "你猜猜？猜对了奖励你0元代金券",
      hesitate: "long",
      next: "ch15_end_good",
    },
    ch15_end_good: {
      speaker: SPEAKER_15,
      text: "行了，我得去写作业了，不然我gpa真要完蛋了",
      next: null,
      onComplete: () => handleChapterComplete(),
    },
  };

  const DIALOGUE_18 = {
    start: {
      speaker: SPEAKER_18,
      text: "你到了吗？",
      choices: [{ label: "到了啊", next: "ch18_port" }],
    },
    ch18_port: {
      speaker: SPEAKER_18,
      text:
        "行，你没等很久吧，今天口岸感觉有一万个人，排队排了一万年，我真是服了",
      choices: [
        { label: "呵呵，等你等了八年有没有说法", next: "ch18_birthday" },
      ],
    },
    ch18_birthday: {
      speaker: SPEAKER_18,
      text:
        "？说啥呢，饿昏头了就点东西吃啊。我真搞不懂你，一年一次的生日非要去吃敏华冰厅，生日还要吃黯然销魂饭这一块。还让我把 Mesa 的位置退了，要不是你今天寿星，我非骂死你",
      choices: [
        { label: "哎呀对不起嘛，我就是想重温一下老资历时光", next: "ch18_memory" },
      ],
    },
    ch18_memory: {
      speaker: SPEAKER_18,
      text:
        "老啥资历啊，上次你来这里过生日我俩都是小不点呢，感觉有十年前了。前两天整理相册看到照片，我还挺感慨。我们居然已经认识这么久了",
      next: "ch18_photo",
    },
    ch18_photo: {
      speaker: SPEAKER_18,
      image: {
        src: "assets/ch18-memory-photo.png",
        alt: "敏华冰厅，小时候的生日",
      },
      next: "ch18_after_photo",
    },
    ch18_after_photo: {
      speaker: "你",
      text: "",
      choicesOnly: true,
      choices: [
        { label: "我去，你哪里来的照片啊", next: "ch18_mom_photo" },
        { label: "我靠，这真得有10年了吧", next: "ch18_ten_years" },
      ],
    },
    ch18_mom_photo: {
      speaker: SPEAKER_18,
      text:
        "当时你妈妈拍的啊，你忘了啊？我小时候来香港办事顺便拜访，结果刚好遇到你过生日啊，你咋这个都忘？",
      choices: [{ label: "饿得要命了，速归", next: "ch18_come_love" }],
    },
    ch18_ten_years: {
      speaker: SPEAKER_18,
      text:
        "还真是，感觉就是你十岁吧。你一转眼都20了，时间真快！我们也认识十年了，哎。",
      choices: [{ label: "饿得要命了，速归", next: "ch18_come_love" }],
    },
    ch18_come_love: {
      speaker: SPEAKER_18,
      text: "行了我知道了，小寿星你等着吧，我来爱你一下",
      next: null,
      endKey: "ch18_decade",
      onComplete: () => handleChapterComplete(),
    },
  };

  const END_SCREEN_VARIANTS = {
    future_blocked: {
      title: "达成结局：10岁的 Sela 拉黑了你",
      desc: "说错名字可不行……下次记得叫她「饶芝筠」哦。",
    },
    ch15_jerk: {
      title: "达成结局：你犯啥贱啊。。。",
      desc: "15岁的 Sela 不想理你了。试试别的分支吧。",
    },
    ch18_decade: {
      title: "达成结局：你和Sela的十年",
      desc: "一起期待下一个十年吧。",
    },
    default: {
      title: "时光链路暂时休眠……",
      desc: "试试别的分支吧。",
    },
  };

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  function nowTime() {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} — ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  function playIntro() {
    clearFlowTimers();
    resetIntroScreen();
    showScreen("intro");
    introTime.textContent = nowTime();

    introLines.forEach((line, i) => {
      scheduleFlow(() => {
        line.classList.remove("hidden");
        line.classList.add("visible");
        if (i === introLines.length - 1) {
          scheduleFlow(() => playTransit(), 1400);
        }
      }, 800 + i * 1200);
    });
  }

  function playTransit() {
    resetTransitEffects();
    showScreen("transit");
    triggerTransitFlash();

    const lineDelay = 1100;

    transitLines.forEach((line, i) => {
      scheduleFlow(() => {
        line.classList.remove("hidden");
        line.classList.add("visible");

        if (line.classList.contains("transit-line-water")) {
          transitWater?.classList.add("active");
          window.SelasAudio?.play("waterSplash", { volume: 0.82 });
        }

        if (line.classList.contains("transit-line-echo")) {
          triggerTransitFlash();
        }

        if (i === transitLines.length - 1) {
          scheduleFlow(() => {
            transitBlackout?.classList.add("active");
            scheduleFlow(() => playTea(), 1600);
          }, lineDelay);
        }
      }, 600 + i * lineDelay);
    });
  }

  function playTea() {
    resetTransitEffects();
    showScreen("tea");
    if (teaTime) teaTime.textContent = nowTime();
    window.SelasAudio?.startAmbient("teaBustleA", 0.34);

    teaLines.forEach((line, i) => {
      scheduleFlow(() => {
        line.classList.remove("hidden");
        line.classList.add("visible");
        if (i === teaLines.length - 1) {
          scheduleFlow(() => btnSkipIntro.classList.remove("hidden"), 600);
        }
      }, 500 + i * 1000);
    });
  }

  /** 按句号/问号/感叹号拆成独立气泡 */
  function splitSentences(text) {
    const trimmed = (text || "").trim();
    if (!trimmed) return [];
    return trimmed
      .split(/(?<=[。！？!?…])/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function getNodeLines(node) {
    if (Array.isArray(node.lines) && node.lines.length) return node.lines;
    return splitSentences(node.text);
  }

  function clearBubbleTimers() {
    clearTimeout(bubbleTimer);
    clearTimeout(typewriterTimer);
    bubbleTimer = null;
    typewriterTimer = null;
  }

  function setSelaTyping(isTyping) {
    if (contactNameEl) {
      contactNameEl.textContent = isTyping ? TYPING_LABEL : getSpeakerLabel();
      contactNameEl.classList.toggle("is-typing", isTyping);
    }
    if (contactStatusEl) {
      contactStatusEl.innerHTML = isTyping
        ? '<span class="status-dot typing-dot-pulse"></span>对方正在输入'
        : '<span class="status-dot"></span>时光链路已连接';
    }
  }

  function showTypingBubble() {
    removeTypingBubble();
    typingBubbleEl = document.createElement("div");
    typingBubbleEl.className = "msg-bubble them typing-bubble";
    typingBubbleEl.innerHTML =
      '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    chatMessages.appendChild(typingBubbleEl);
    scrollChatToBottom();
  }

  function playSelaMsgDeliver() {
    window.SelasAudio?.play("msgDeliver", { volume: 0.36, overlap: true });
  }

  function removeTypingBubble() {
    if (typingBubbleEl) {
      typingBubbleEl.remove();
      typingBubbleEl = null;
    }
  }

  function runHesitateSequence(preset, onComplete) {
    const steps =
      typeof preset === "string" ? HESITATE_PRESETS[preset] : preset;
    if (!steps?.length) {
      onComplete();
      return;
    }

    let i = 0;
    function nextStep() {
      if (i >= steps.length) {
        onComplete();
        return;
      }

      const step = steps[i];
      i += 1;

      if (step.type != null) {
        setSelaTyping(true);
        showTypingBubble();
        bubbleTimer = setTimeout(() => {
          removeTypingBubble();
          setSelaTyping(false);
          nextStep();
        }, hesitateMs(step.type));
        return;
      }

      if (step.stop != null) {
        removeTypingBubble();
        setSelaTyping(false);
        bubbleTimer = setTimeout(nextStep, hesitateMs(step.stop));
      }
    }

    nextStep();
  }

  function deliverSelaLine(line, onLineDone) {
    setSelaTyping(true);
    showTypingBubble();

    const thinkDelay =
      TYPING_THINK_BASE +
      line.length * TYPING_THINK_PER_CHAR +
      Math.random() * 400;

    bubbleTimer = setTimeout(() => {
      typeBubbleText(line, onLineDone);
    }, thinkDelay);
  }

  function finishBubbleSequence() {
    clearBubbleTimers();
    removeTypingBubble();
    setSelaTyping(false);
    const callback = bubbleState?.onComplete;
    bubbleState = null;
    isPlayingBubbles = false;
    if (callback) callback();
  }

  function typeBubbleText(text, onComplete) {
    removeTypingBubble();

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble them";
    const textSpan = document.createElement("span");
    textSpan.className = "bubble-text";
    const timeSpan = document.createElement("span");
    timeSpan.className = "msg-time";
    bubble.appendChild(textSpan);
    bubble.appendChild(timeSpan);
    chatMessages.appendChild(bubble);
    playSelaMsgDeliver();

    let i = 0;
    function tick() {
      if (i < text.length) {
        textSpan.textContent = text.slice(0, i + 1);
        i += 1;
        scrollChatToBottom();
        typewriterTimer = setTimeout(tick, TYPING_CHAR_MS + Math.random() * 30);
      } else {
        timeSpan.textContent = nowTime().split(" — ")[1];
        scrollChatToBottom();
        if (onComplete) onComplete();
      }
    }

    tick();
  }

  function playNextLine() {
    if (!bubbleState) return;

    if (bubbleState.index >= bubbleState.lines.length) {
      finishBubbleSequence();
      return;
    }

    const line = bubbleState.lines[bubbleState.index];
    const hesitate =
      bubbleState.hesitate && bubbleState.index === 0
        ? bubbleState.hesitate
        : null;

    const afterLine = () => {
      bubbleState.index += 1;
      if (bubbleState.index >= bubbleState.lines.length) {
        finishBubbleSequence();
      } else {
        bubbleTimer = setTimeout(playNextLine, TYPING_LINE_PAUSE);
      }
    };

    if (hesitate) {
      runHesitateSequence(hesitate, () => deliverSelaLine(line, afterLine));
      return;
    }

    deliverSelaLine(line, afterLine);
  }

  function playSelaLines(lines, onComplete, hesitate) {
    clearBubbleTimers();
    removeTypingBubble();

    if (!lines.length) {
      onComplete();
      return;
    }

    bubbleState = { lines, index: 0, onComplete, hesitate };
    isPlayingBubbles = true;
    playNextLine();
  }

  function sendSelaEmoji(emoji, onComplete) {
    setSelaTyping(true);
    showTypingBubble();
    bubbleTimer = setTimeout(() => {
      removeTypingBubble();
      addEmojiBubble(emoji);
      setSelaTyping(false);
      if (onComplete) onComplete();
    }, 900 + Math.random() * 300);
  }

  function scrollChatToBottom() {
    requestAnimationFrame(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
      requestAnimationFrame(() => {
        const last = chatMessages.lastElementChild;
        if (last) {
          last.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    });
  }

  function addEmojiBubble(emoji) {
    const bubble = document.createElement("div");
    bubble.className = "msg-bubble them msg-sticker";
    bubble.textContent = emoji;
    chatMessages.appendChild(bubble);
    playSelaMsgDeliver();
    scrollChatToBottom();
  }

  function addImageBubble(image) {
    const src = typeof image === "string" ? image : image.src;
    const alt = typeof image === "string" ? "" : image.alt || "";
    const bubble = document.createElement("div");
    bubble.className = "msg-bubble them msg-photo";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "msg-photo-btn";
    btn.setAttribute("aria-label", "点击查看大图");
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";
    btn.appendChild(img);
    btn.addEventListener("click", () => openPhotoViewer(src, alt));
    bubble.appendChild(btn);
    const time = document.createElement("span");
    time.className = "msg-time";
    time.textContent = nowTime().split(" — ")[1];
    bubble.appendChild(time);
    chatMessages.appendChild(bubble);
    playSelaMsgDeliver();
    scrollChatToBottom();
  }

  let activeVoiceAudio = null;
  let activeVoiceBtn = null;

  function stopActiveVoice() {
    if (activeVoiceAudio) {
      activeVoiceAudio.pause();
      activeVoiceAudio.currentTime = 0;
      activeVoiceAudio = null;
    }
    if (activeVoiceBtn) {
      activeVoiceBtn.classList.remove("is-playing");
      const icon = activeVoiceBtn.querySelector(".msg-voice-icon");
      if (icon) icon.textContent = "▶";
      activeVoiceBtn = null;
    }
  }

  function formatVoiceDuration(sec) {
    const s = Math.max(0, Math.round(sec));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  function addVoiceBubble(voice) {
    const src = typeof voice === "string" ? voice : voice.src;
    const label = (typeof voice === "object" && voice.label) || "语音消息";

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble them msg-voice";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "msg-voice-btn";
    btn.setAttribute("aria-label", label);

    const icon = document.createElement("span");
    icon.className = "msg-voice-icon";
    icon.textContent = "▶";

    const bars = document.createElement("span");
    bars.className = "msg-voice-bars";
    bars.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 5; i += 1) {
      const bar = document.createElement("span");
      bar.className = "msg-voice-bar";
      bars.appendChild(bar);
    }

    const dur = document.createElement("span");
    dur.className = "msg-voice-duration";
    dur.textContent = "0:00";

    btn.appendChild(icon);
    btn.appendChild(bars);
    btn.appendChild(dur);

    const audio = new Audio(src);
    audio.preload = "metadata";
    audio.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        dur.textContent = formatVoiceDuration(audio.duration);
      }
    });
    audio.addEventListener("ended", () => {
      btn.classList.remove("is-playing");
      icon.textContent = "▶";
      if (activeVoiceAudio === audio) {
        activeVoiceAudio = null;
        activeVoiceBtn = null;
      }
    });

    btn.addEventListener("click", () => {
      window.SelasAudio?.unlock();
      if (activeVoiceAudio && activeVoiceAudio !== audio) {
        stopActiveVoice();
      }
      if (audio.paused) {
        audio.play().catch(() => {});
        btn.classList.add("is-playing");
        icon.textContent = "❚❚";
        activeVoiceAudio = audio;
        activeVoiceBtn = btn;
      } else {
        audio.pause();
        btn.classList.remove("is-playing");
        icon.textContent = "▶";
        activeVoiceAudio = null;
        activeVoiceBtn = null;
      }
    });

    bubble.appendChild(btn);
    const time = document.createElement("span");
    time.className = "msg-time";
    time.textContent = nowTime().split(" — ")[1];
    bubble.appendChild(time);
    chatMessages.appendChild(bubble);
    playSelaMsgDeliver();
    scrollChatToBottom();
  }

  function sendSelaVoice(voice, onComplete) {
    setSelaTyping(true);
    showTypingBubble();
    bubbleTimer = setTimeout(() => {
      removeTypingBubble();
      addVoiceBubble(voice);
      setSelaTyping(false);
      if (onComplete) onComplete();
    }, 1200 + Math.random() * 400);
  }

  function openPhotoViewer(src, alt) {
    const viewer = document.getElementById("photo-viewer");
    const img = document.getElementById("photo-viewer-img");
    if (!viewer || !img) return;
    img.src = src;
    img.alt = alt || "";
    viewer.classList.remove("hidden");
    viewer.classList.add("is-open");
    document.body.classList.add("photo-viewer-open");
  }

  function closePhotoViewer() {
    const viewer = document.getElementById("photo-viewer");
    if (!viewer) return;
    viewer.classList.remove("is-open");
    viewer.classList.add("hidden");
    document.body.classList.remove("photo-viewer-open");
  }

  function sendSelaImage(image, onComplete) {
    setSelaTyping(true);
    showTypingBubble();
    bubbleTimer = setTimeout(() => {
      removeTypingBubble();
      addImageBubble(image);
      setSelaTyping(false);
      if (onComplete) onComplete();
    }, 1100 + Math.random() * 400);
  }

  function addSelaHistoryInstant(text) {
    const lines = getNodeLines({ text });
    lines.forEach((line) => {
      const bubble = document.createElement("div");
      bubble.className = "msg-bubble them msg-history";
      bubble.innerHTML = `${line}<span class="msg-time">${nowTime().split(" — ")[1]}</span>`;
      chatMessages.appendChild(bubble);
    });
  }

  function rebuildPathFromSteps(steps) {
    if (!steps || !steps.length) return;

    for (let i = 0; i < steps.length; i += 1) {
      const step = steps[i];
      const node = DIALOGUE[step.nodeId];
      if (!node) continue;

      const isLast = i === steps.length - 1;

      if (!node.choicesOnly && node.text) {
        addSelaHistoryInstant(node.text);
      }

      if (step.choice) {
        addChatBubble(step.choice, true);
        trackPath(getChoiceNext(node, step.choice));
      }

      if (isLast && node.emoji) {
        addEmojiBubble(node.emoji);
      }
    }
  }

  function getChoiceNext(node, label) {
    const match = node.choices?.find((c) => c.label === label);
    return match ? match.next : null;
  }

  function inferPathFromCheckpoint(checkpointId) {
    if (!window.SelasFlowmap) return null;
    return window.SelasFlowmap.findPathToCheckpoint(DIALOGUE, checkpointId);
  }

  function jumpToChapterNode(age, nodeId) {
    const dialogue =
      age === 15 ? DIALOGUE_15 : age === 18 ? DIALOGUE_18 : DIALOGUE;
    const checkpoint = dialogue[nodeId];
    if (!checkpoint) return;

    clearAllTimers();
    showScreen("chat");
    chatMessages.innerHTML = "";
    choicesPanel.classList.remove("active");
    chatMessages.classList.remove("has-choices");
    chosenPath = null;
    chosenEnding = null;
    bubbleState = null;
    removeTypingBubble();
    setSelaTyping(false);
    isPlayingBubbles = false;
    isJumpReplay = true;
    activeCheckpointId = nodeId;
    currentAge = age;
    updateChapterUI();
    resetEndScreenCopy();
    updateProgress(getProgressForNode(nodeId));

    if (checkpoint.choicesOnly && checkpoint.choices?.length) {
      currentNode = { ...checkpoint };
      showChoices(checkpoint.choices);
      scrollChatToBottom();
      return;
    }

    if (checkpoint.text && !checkpoint.choicesOnly) {
      addSelaHistoryInstant(checkpoint.text);
    }

    if (checkpoint.choices && checkpoint.choices.length) {
      currentNode = { ...checkpoint };
      showChoices(checkpoint.choices);
    } else {
      isJumpReplay = false;
      showDialogue(nodeId);
    }

    scrollChatToBottom();
  }

  function jumpToCheckpoint(checkpointId) {
    const path = inferPathFromCheckpoint(checkpointId);
    const checkpoint = DIALOGUE[checkpointId];
    if (!path || !checkpoint || !checkpoint.choices) return;

    clearAllTimers();
    showScreen("chat");
    chatMessages.innerHTML = "";
    choicesPanel.classList.remove("active");
    chatMessages.classList.remove("has-choices");
    chosenPath = null;
    chosenEnding = null;
    bubbleState = null;
    removeTypingBubble();
    setSelaTyping(false);
    isPlayingBubbles = false;
    isJumpReplay = true;
    activeCheckpointId = checkpointId;
    currentAge = 10;
    updateChapterUI();
    resetEndScreenCopy();

    rebuildPathFromSteps(path);
    currentNode = { ...checkpoint };
    updateProgress(getProgressForNode(checkpointId));

    if (checkpoint.choices) {
      showChoices(checkpoint.choices);
    }

    scrollChatToBottom();
  }

  function openStoryMap(returnTo) {
    if (!window.SelasFlowmap || !flowmapTree) return;
    flowmapReturnTo = returnTo === "title" ? "title" : "end";
    window.SelasFlowmap.renderFlowmap(flowmapTree, (age, nodeId) => {
      jumpToChapterNode(age, nodeId);
    });
    showScreen("flowmap");
  }

  function closeStoryMap() {
    showScreen(flowmapReturnTo === "title" ? "title" : "end");
  }

  function addChatBubble(text, isMe) {
    const bubble = document.createElement("div");
    bubble.className = `msg-bubble ${isMe ? "me" : "them"}`;
    bubble.innerHTML = `${text}<span class="msg-time">${nowTime().split(" — ")[1]}</span>`;
    chatMessages.appendChild(bubble);
    scrollChatToBottom();
  }

  function updateProgress(val) {
    progress = Math.min(val, 100);
    chapterProgress.textContent = `进度 ${progress}%`;
  }

  function completeNode(node) {
    if (node.image) {
      isPlayingBubbles = true;
      sendSelaImage(node.image, () => {
        isPlayingBubbles = false;
        completeNodeAfterMedia(node);
      });
      return;
    }
    if (node.voice) {
      isPlayingBubbles = true;
      sendSelaVoice(node.voice, () => {
        isPlayingBubbles = false;
        completeNodeAfterMedia(node);
      });
      return;
    }
    completeNodeAfterMedia(node);
  }

  function completeNodeAfterMedia(node) {
    if (node.emoji) {
      isPlayingBubbles = true;
      sendSelaEmoji(node.emoji, () => {
        isPlayingBubbles = false;
        afterSelaContent(node);
      });
      return;
    }
    afterSelaContent(node);
  }

  function afterSelaContent(node) {
    if (node.choices) {
      showChoices(node.choices);
      return;
    }

    if (node.next) {
      scheduleFlow(() => showDialogue(node.next), 500);
      return;
    }

    if (node.endKey) chosenEnding = node.endKey;
    if (node.onComplete) node.onComplete();
  }

  function showDialogue(nodeId) {
    isJumpReplay = false;
    const dialogue = getActiveDialogue();
    const node = dialogue[nodeId];
    if (!node) return;

    currentNode = { ...node };

    if (node.endKey && !chosenEnding) {
      chosenEnding = node.endKey;
    }

    choicesPanel.classList.remove("active");
    chatMessages.classList.remove("has-choices");

    if (node.choicesOnly) {
      showChoices(node.choices);
      updateProgress(getProgressForNode(nodeId));
      return;
    }

    const lines = getNodeLines(currentNode);
    playSelaLines(lines, () => completeNode(currentNode), currentNode.hesitate);
    updateProgress(getProgressForNode(nodeId));
  }

  function getProgressForNode(id) {
    const map = {
      start: 8,
      lover: 12,
      lover_no_fight: 22,
      lover_fight: 22,
      lover_ask_name: 32,
      lover_foreign: 42,
      lover_american: 52,
      lover_english_name: 52,
      lover_final_choice: 58,
      lover_birthday: 100,
      lover_lonely: 68,
      lover_early_love: 100,
      future_self: 15,
      future_wrong_name: 25,
      future_sorry: 100,
      future_renamed_lie: 100,
      future_correct_name: 40,
      future_ice_happy: 65,
      future_diet: 55,
      future_grow_up: 70,
      future_why_grow: 75,
      future_success: 85,
      future_hardship: 85,
      future_grow_bad: 75,
      future_internship: 85,
      future_ordinary: 92,
      future_beautiful_now: 80,
      future_dinner: 100,
      ch15_date: 5,
      ch15_birthday_ask: 15,
      ch15_613: 15,
      ch15_close_bday: 22,
      ch15_obvious: 18,
      ch15_forgot_bday: 28,
      ch15_no_gift: 32,
      ch15_voice: 36,
      ch15_gossip: 45,
      ch15_confession: 52,
      ch15_reject_guy: 62,
      ch15_cruel: 66,
      ch15_i_like: 72,
      ch15_boys_say: 85,
    };
    return map[id] || progress;
  }

  function showChoices(choices) {
    choicesList.innerHTML = "";
    choices.forEach((c) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = c.label;
      btn.addEventListener("click", () => selectChoice(c));
      choicesList.appendChild(btn);
    });
    chatMessages.classList.add("has-choices");
    choicesPanel.classList.add("active");
    scrollChatToBottom();
    scheduleFlow(scrollChatToBottom, 380);
  }

  function trackPath(next) {
    if (next === "lover" || next.startsWith("lover_")) chosenPath = "lover";
    else if (next === "future_self" || next.startsWith("future_")) {
      chosenPath = "future_self";
    }
  }

  function selectChoice(choice) {
    if (isPlayingBubbles) return;
    isJumpReplay = false;
    choicesPanel.classList.remove("active");
    chatMessages.classList.remove("has-choices");
    trackPath(choice.next);
    if (choice.endKey) chosenEnding = choice.endKey;
    addChatBubble(choice.label, true);
    scheduleFlow(() => showDialogue(choice.next), 450);
  }

  function getSpeakerLabel() {
    return `Sela · ${currentAge}岁`;
  }

  function getActiveDialogue() {
    if (currentAge === 10) return DIALOGUE;
    if (currentAge === 15) return DIALOGUE_15;
    return DIALOGUE_18;
  }

  function getChapterStartId(age) {
    if (age === 10) return "start";
    if (age === 15) return "ch15_date";
    return "start";
  }

  function getCh10PathForBridge() {
    const path = chosenPath || window.SelasFlowmap?.getCh10Path();
    return path === "future_self" ? "future_self" : "lover";
  }

  function updateChapterUI() {
    const year = yearAtAge(currentAge);
    const chapterMeta = TIMELINE.chapters.find((c) => c.age === currentAge);

    const yearTag = document.getElementById("chat-year-tag");
    if (yearTag) yearTag.textContent = String(year);

    if (contactNameEl) {
      contactNameEl.textContent = getSpeakerLabel();
    }

    const avatar = AVATAR_BY_AGE[currentAge] || AVATAR_BY_AGE[10];
    if (avatarImg) {
      avatarImg.src = avatar.src;
      avatarImg.alt = avatar.alt;
    }

    phoneFrame?.classList.toggle("has-ch18-bg", currentAge === 18);

    const chapterId = document.getElementById("chat-chapter-id");
    if (chapterId && chapterMeta) {
      chapterId.textContent = `USER: YOU · ${chapterMeta.id.toUpperCase()}`;
    }

    const syncLine = document.getElementById("time-sync-line");
    if (syncLine && currentAge === 10) {
      syncLine.textContent = `TIME: ${year} · AGE: ${currentAge} · LOCATION: ${TIMELINE.location}`;
    }
  }

  function resetBridgeScreen() {
    if (bridgeBody) bridgeBody.innerHTML = "";
    btnBridgeContinue?.classList.add("hidden");
  }

  function playBridgeSequence(lines, label, btnText, nextAge, ambient = "teaBustleB", ambientVolume = 0.3) {
    bridgeNextAge = nextAge;
    resetBridgeScreen();
    showScreen("bridge");
    window.SelasAudio?.startAmbient(ambient, ambientVolume);

    if (bridgeLabel) bridgeLabel.textContent = label;
    if (bridgeTime) bridgeTime.textContent = nowTime();
    if (bridgeBtnText) bridgeBtnText.textContent = btnText;

    lines.forEach((html) => {
      const p = document.createElement("p");
      p.className = "intro-line bridge-line hidden";
      p.innerHTML = `<span class="line-marker">▸</span>${html}`;
      bridgeBody.appendChild(p);
    });

    const bridgeLines = bridgeBody.querySelectorAll(".bridge-line");
    bridgeLines.forEach((line, i) => {
      scheduleFlow(() => {
        line.classList.remove("hidden");
        line.classList.add("visible");
        if (i === bridgeLines.length - 1) {
          scheduleFlow(() => btnBridgeContinue?.classList.remove("hidden"), 600);
        }
      }, 500 + i * 1400);
    });
  }

  function playBridgeTo15() {
    playBridgeSequence(
      BRIDGE_LINES[getCh10PathForBridge()],
      "TIME // 2017 → 2022",
      "进入 15 岁",
      15,
      "teaBustleB",
      0.3
    );
  }

  function playBridgeTo18() {
    playBridgeSequence(
      BRIDGE_15_TO_18,
      "TIME // 2022 → 2025",
      "进入 18 岁",
      18,
      "teaBustleA",
      0.24
    );
  }

  function handleChapterComplete() {
    if (currentAge === 10) {
      if (BAD_CH10_ENDINGS.includes(chosenEnding)) {
        showEndScreen({ mode: "bad" });
        return;
      }
      if (window.SelasFlowmap) {
        window.SelasFlowmap.saveCh10Path(chosenPath);
      }
      scheduleFlow(() => playBridgeTo15(), 600);
      return;
    }
    if (currentAge === 15) {
      if (BAD_CH15_ENDINGS.includes(chosenEnding)) {
        showEndScreen({ mode: "bad" });
        return;
      }
      scheduleFlow(() => playBridgeTo18(), 600);
      return;
    }
    if (currentAge === 18) {
      chosenEnding = "ch18_decade";
      window.SelasFlowmap?.saveCh10Path(chosenPath);
      showEndScreen({ mode: "good" });
      return;
    }
  }

  function startChapter(age) {
    window.SelasAudio?.unlock();
    window.SelasAudio?.stopAmbient(700);
    stopActiveVoice();
    currentAge = age;
    clearFlowTimers();
    showScreen("chat");
    chatMessages.innerHTML = "";
    progress = 0;
    chosenEnding = null;
    bubbleState = null;
    clearBubbleTimers();
    removeTypingBubble();
    setSelaTyping(false);
    isPlayingBubbles = false;
    isJumpReplay = false;
    activeCheckpointId = null;
    updateChapterUI();
    updateProgress(0);

    scheduleFlow(() => showDialogue(getChapterStartId(age)), 400);
  }

  const ENDING_SOUND_VOLUME = {
    future_blocked: 0.5,
    ch15_jerk: 0.54,
    ch18_decade: 0.58,
  };

  function getEndingKeyForScreen(options = {}) {
    if (options.mode === "good") return "ch18_decade";
    return chosenEnding || "future_blocked";
  }

  function showEndScreen(options = {}) {
    const endKey = getEndingKeyForScreen(options);
    const endKicker = document.getElementById("end-kicker");
    const endTitle = document.getElementById("end-title");
    const endDesc = document.getElementById("end-desc");

    if (options.mode === "good") {
      const variant = END_SCREEN_VARIANTS.ch18_decade;
      if (endKicker) endKicker.textContent = "ALL CHAPTERS · COMPLETE";
      if (endTitle) endTitle.textContent = variant.title;
      if (endDesc) endDesc.innerHTML = variant.desc;
      setStoryMapUnlocked(true);
    } else if (options.mode === "bad") {
      const variant =
        END_SCREEN_VARIANTS[chosenEnding] || END_SCREEN_VARIANTS.default;
      const chLabel =
        currentAge === 15 ? "02" : currentAge === 18 ? "03" : "01";
      if (endKicker) endKicker.textContent = `CHAPTER ${chLabel} · END`;
      if (endTitle) endTitle.textContent = variant.title;
      if (endDesc) endDesc.innerHTML = variant.desc;
      setStoryMapUnlocked(false);
    } else {
      const variant =
        END_SCREEN_VARIANTS[chosenEnding] || END_SCREEN_VARIANTS.default;
      if (endKicker) endKicker.textContent = "CHAPTER 01 · COMPLETE";
      if (endTitle) endTitle.textContent = variant.title;
      if (endDesc) endDesc.innerHTML = variant.desc;
      setStoryMapUnlocked(false);
    }

    scheduleFlow(() => {
      showScreen("end");
      window.SelasAudio?.unlock();
      window.SelasAudio?.playEnding(
        endKey,
        ENDING_SOUND_VOLUME[endKey]
      );
    }, 1200);
  }

  function startChat() {
    window.SelasAudio?.unlock();
    window.SelasAudio?.stopAmbient(700);
    clearFlowTimers();
    currentAge = 10;
    showScreen("chat");
    chatMessages.innerHTML = "";
    progress = 0;
    chosenPath = null;
    chosenEnding = null;
    bubbleState = null;
    clearBubbleTimers();
    removeTypingBubble();
    setSelaTyping(false);
    isPlayingBubbles = false;
    isJumpReplay = false;
    activeCheckpointId = null;
    updateChapterUI();
    updateProgress(0);
    resetEndScreenCopy();

    scheduleFlow(() => showDialogue("start"), 400);
  }

  function resetGame() {
    window.SelasAudio?.stopAmbient(400);
    stopActiveVoice();
    clearAllTimers();
    currentAge = 10;
    currentNode = null;
    chosenPath = null;
    chosenEnding = null;
    bubbleState = null;
    isPlayingBubbles = false;
    isJumpReplay = false;
    activeCheckpointId = null;
    progress = 0;
    removeTypingBubble();
    setSelaTyping(false);
    choicesPanel.classList.remove("active");
    chatMessages.classList.remove("has-choices");
    choicesList.innerHTML = "";
    chatMessages.innerHTML = "";
    closePhotoViewer();
    resetIntroScreen();
    resetBridgeScreen();
    resetEndScreenCopy();
    updateProgress(0);
    updateTitleStoryMapUI();
    showScreen("title");
  }

  function restartGame() {
    resetGame();
    playIntro();
  }

  function beginGame() {
    window.SelasAudio?.unlock();
    playIntro();
  }

  btnBridgeContinue?.addEventListener("click", () => startChapter(bridgeNextAge));
  btnStart?.addEventListener("click", beginGame);
  btnSkipIntro?.addEventListener("click", startChat);
  btnBack?.addEventListener("click", resetGame);
  btnReplay?.addEventListener("click", restartGame);
  btnToTitle?.addEventListener("click", resetGame);
  btnEndFlowmap?.addEventListener("click", () => openStoryMap("end"));
  btnTitleFlowmap?.addEventListener("click", () => openStoryMap("title"));
  btnFlowmapBack?.addEventListener("click", closeStoryMap);

  document.getElementById("photo-viewer-close")?.addEventListener("click", closePhotoViewer);
  document.getElementById("photo-viewer-backdrop")?.addEventListener("click", closePhotoViewer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePhotoViewer();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    if (screens.title.classList.contains("active")) {
      window.SelasAudio?.unlock();
      playIntro();
      return;
    }

    if (
      screens.tea.classList.contains("active") &&
      !btnSkipIntro.classList.contains("hidden")
    ) {
      startChat();
      return;
    }

    if (
      screens.bridge.classList.contains("active") &&
      !btnBridgeContinue?.classList.contains("hidden")
    ) {
      startChapter(bridgeNextAge);
    }
  });

  if (introTime) introTime.textContent = nowTime();
  if (teaTime) teaTime.textContent = nowTime();
  initTimelineUI();

  function initTimelineUI() {
    updateChapterUI();
    storyMapUnlocked = false;
    setEndStoryMapVisible(false);
    updateTitleStoryMapUI();

    const endTitle = document.getElementById("end-title");
    if (endTitle) endTitle.textContent = END_SCREEN_VARIANTS.default.title;
  }

})();
