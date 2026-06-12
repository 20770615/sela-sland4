/**
 * DEV ONLY — 填充开发者面板按钮（开关逻辑在 index.html 内联脚本）
 */
(function () {
  "use strict";

  const QUICK_SCENES = [
    { label: "标题", fn: () => D().gotoScreen("title") },
    { label: "落水", fn: () => D().skipToTransit() },
    { label: "茶餐厅", fn: () => D().skipToTea() },
    { label: "10岁聊天", fn: () => D().startChat() },
    {
      label: "过渡·恋人",
      fn: () => {
        D().setPath("lover");
        D().playBridge("lover");
      },
    },
    {
      label: "过渡·未来你",
      fn: () => {
        D().setPath("future_self");
        D().playBridge("future_self");
      },
    },
    { label: "过渡·18岁", fn: () => D().playBridgeTo18() },
    { label: "15岁", fn: () => D().goChapter(15) },
    { label: "18岁", fn: () => D().goChapter(18) },
    { label: "18岁·发照片", fn: () => D().jumpTo18("ch18_photo") },
    { label: "18岁·照片分支", fn: () => D().jumpTo18("ch18_after_photo") },
    { label: "故事地图", fn: () => D().openStoryMap() },
  ];

  const QUICK_CH15 = [
    { label: "开场·几号", id: "ch15_date" },
    { label: "生日·呛她后", id: "ch15_birthday_ask" },
    { label: "生日·6/13", id: "ch15_613" },
    { label: "生日·记了没", id: "ch15_close_bday" },
    { label: "刻意·啥意思", id: "ch15_obvious" },
    { label: "敷衍分支", id: "ch15_annoyed_bday" },
    { label: "礼物·没想起", id: "ch15_forgot_bday" },
    { label: "礼物·没地址", id: "ch15_no_gift" },
    { label: "礼物·唱歌语音", id: "ch15_voice" },
    { label: "八卦", id: "ch15_gossip" },
    { label: "被表白", id: "ch15_confession" },
    { label: "拒绝马脸", id: "ch15_reject_guy" },
    { label: "喜欢谁", id: "ch15_who_like" },
    { label: "你真残忍", id: "ch15_cruel" },
    { label: "我也喜欢", id: "ch15_i_like" },
    { label: "男生主动说", id: "ch15_boys_say" },
  ];
  const QUICK_CH10 = [
    { label: "开场", id: "start" },
    { label: "恋人线", id: "lover" },
    { label: "未来你线", id: "future_self" },
    { label: "名字quiz", id: "future_correct_name" },
    { label: "长大/为什么", id: "future_grow_up" },
    { label: "小说两选项", id: "future_why_grow" },
    { label: "生日/孤单", id: "lover_final_choice" },
  ];

  const QUICK_ENDS = [
    { label: "拉黑", endKey: "future_blocked", mode: "bad" },
    { label: "15岁犯贱", endKey: "ch15_jerk", mode: "bad" },
    { label: "十年", endKey: "ch18_decade", mode: "good" },
  ];

  let cpSelect = null;

  function D() {
    return window.SelasLandDev;
  }

  function btn(label, fn, extraClass) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "dev-mode-btn" + (extraClass ? " " + extraClass : "");
    el.textContent = label;
    el.onclick = function () {
      if (!D()) {
        alert("游戏未就绪，请刷新页面");
        return;
      }
      fn();
    };
    return el;
  }

  function section(title, children) {
    const wrap = document.createElement("div");
    wrap.className = "dev-mode-section";
    const label = document.createElement("span");
    label.className = "dev-mode-label";
    label.textContent = title;
    wrap.appendChild(label);
    const grid = document.createElement("div");
    grid.className = "dev-mode-grid";
    children.forEach(function (c) {
      grid.appendChild(c);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function populateCheckpoints() {
    if (!cpSelect || !D()) return;
    cpSelect.innerHTML = '<option value="">— 全部检查点 —</option>';
    const list = D().getAllCheckpoints
      ? D().getAllCheckpoints()
      : D().getCheckpoints();
    list.forEach(function (cp) {
      const opt = document.createElement("option");
      opt.value = cp.id;
      opt.textContent = cp.preview || cp.id;
      cpSelect.appendChild(opt);
    });
  }

  function buildPanelContent(container) {
    container.innerHTML = "";

    container.appendChild(
      section(
        "场景跳转",
        QUICK_SCENES.map(function (s) {
          return btn(s.label, s.fn);
        })
      )
    );

    container.appendChild(
      section("10岁 · 路径", [
        btn("恋人 root", function () {
          D().setPath("lover");
          D().jumpTo("lover");
        }),
        btn("未来你 root", function () {
          D().setPath("future_self");
          D().jumpTo("future_self");
        }),
      ])
    );

    container.appendChild(
      section(
        "15岁 · 检查点",
        QUICK_CH15.map(function (c) {
          return btn(
            c.label,
            function () {
              D().jumpTo15(c.id);
            },
            "is-accent"
          );
        })
      )
    );

    container.appendChild(
      section(
        "10岁 · 检查点",
        QUICK_CH10.map(function (c) {
          return btn(
            c.label,
            function () {
              D().jumpTo(c.id);
            },
            "is-accent"
          );
        })
      )
    );

    cpSelect = document.createElement("select");
    cpSelect.className = "dev-mode-select";
    cpSelect.innerHTML = '<option value="">— 全部检查点 —</option>';

    container.appendChild(
      section("检查点列表", [
        cpSelect,
        btn(
          "跳转所选",
          function () {
            if (cpSelect.value.startsWith("ch15_")) D().jumpTo15(cpSelect.value);
              else if (cpSelect.value.startsWith("ch18_")) D().jumpTo18(cpSelect.value);
              else D().jumpTo(cpSelect.value);
          },
          "is-accent"
        ),
      ])
    );

    container.appendChild(
      section(
        "结局预览",
        QUICK_ENDS.map(function (e) {
          return btn(
            e.label,
            function () {
              D().showEnd(e.mode, e.endKey);
            },
            e.mode === "good" ? "is-warn" : undefined
          );
        })
      )
    );

    container.appendChild(
      section("工具", [
        btn("故事地图", function () {
          D().openStoryMap();
        }),
        btn("重置", function () {
          D().reset();
        }),
        btn("完整 intro", function () {
          D().playIntro();
        }),
      ])
    );
  }

  function init() {
    const body = document.getElementById("dev-mode-body");
    if (!body) return;

    buildPanelContent(body);
    window.__selasDevOnOpen = populateCheckpoints;

    var titleBtn = document.getElementById("btn-dev-open");
    if (titleBtn) {
      titleBtn.onclick = function () {
        window.toggleSelasDevPanel();
      };
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "F9") {
        e.preventDefault();
        window.toggleSelasDevPanel();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
