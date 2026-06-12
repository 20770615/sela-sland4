/**
 * Sela's Land — Story flow map (Detroit-style tree)
 */
(function () {
  "use strict";

  const STORAGE_CH10_PATH = "selas-land-ch10-path";

  /**
   * 树状流程 — 短标签；mystery: true 显示红色 ?
   * age + id 用于跳转
   */
  const STORY_TREE = [
    {
      label: "10岁",
      root: {
        id: "start",
        age: 10,
        label: "开场",
        children: [
          {
            id: "lover",
            age: 10,
            label: "恋人",
            children: [
              {
                id: "lover_final_choice",
                age: 10,
                label: "生日 / 孤单",
                children: [{ id: "ch15_date", age: 15, label: "15岁", hub: true }],
              },
            ],
          },
          {
            id: "future_self",
            age: 10,
            label: "未来的你",
            children: [
              {
                id: "future_correct_name",
                age: 10,
                label: "饶芝筠",
                children: [{ id: "ch15_date", age: 15, label: "15岁", hub: true }],
              },
              {
                id: "future_wrong_name",
                age: 10,
                label: "饶智军",
                children: [
                  { id: "future_sorry", age: 10, label: "?", mystery: true },
                  { id: "future_renamed_lie", age: 10, label: "?", mystery: true },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      label: "15岁",
      root: {
        id: "ch15_date",
        age: 15,
        label: "生日",
        children: [
          {
            id: "ch15_gossip",
            age: 15,
            label: "八卦",
            children: [
              {
                id: "ch15_confession",
                age: 15,
                label: "被表白",
                children: [
                  {
                    id: "ch15_reject_guy",
                    age: 15,
                    label: "拒绝",
                    children: [
                      {
                        id: "ch15_cruel",
                        age: 15,
                        label: "你真残忍",
                        children: [
                          { id: "ch15_wechat", age: 15, label: "?", mystery: true },
                          {
                            id: "ch15_boys_say",
                            age: 15,
                            label: "主动说",
                            children: [
                              { id: "start", age: 18, label: "18岁", hub: true },
                            ],
                          },
                        ],
                      },
                      {
                        id: "ch15_who_like",
                        age: 15,
                        label: "喜欢谁",
                        children: [
                          {
                            id: "ch15_boys_say",
                            age: 15,
                            label: "主动说",
                            children: [
                              { id: "start", age: 18, label: "18岁", hub: true },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "ch15_obvious",
            age: 15,
            label: "刻意",
            children: [
              {
                id: "ch15_forgot_bday",
                age: 15,
                label: "礼物",
                children: [
                  { id: "ch15_pretend", age: 15, label: "?", mystery: true },
                  { id: "ch15_poor", age: 15, label: "装可怜" },
                  { id: "ch15_voice", age: 15, label: "语音" },
                  { id: "ch15_gossip", age: 15, label: "八卦", hub: true },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      label: "18岁",
      root: {
        id: "start",
        age: 18,
        label: "见面",
        children: [
          {
            id: "ch18_port",
            age: 18,
            label: "口岸",
            children: [
              {
                id: "ch18_birthday",
                age: 18,
                label: "敏华",
                children: [
                  {
                    id: "ch18_memory",
                    age: 18,
                    label: "相册",
                    children: [
                      {
                        id: "ch18_photo",
                        age: 18,
                        label: "照片",
                        children: [
                          {
                            id: "ch18_after_photo",
                            age: 18,
                            label: "之后",
                            children: [
                              {
                                id: "ch18_mom_photo",
                                age: 18,
                                label: "哪来的",
                                children: [
                                  {
                                    id: "ch18_come_love",
                                    age: 18,
                                    label: "速归",
                                  },
                                ],
                              },
                              {
                                id: "ch18_ten_years",
                                age: 18,
                                label: "十年",
                                children: [
                                  {
                                    id: "ch18_come_love",
                                    age: 18,
                                    label: "速归",
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ];

  function findPathToCheckpoint(dialogue, checkpointId) {
    if (!dialogue[checkpointId]) return null;
    let found = null;

    function dfs(nodeId, steps) {
      if (found) return true;
      const node = dialogue[nodeId];
      if (!node) return false;

      if (nodeId === checkpointId) {
        found = [...steps, { nodeId }];
        return true;
      }

      if (node.choices) {
        for (const c of node.choices) {
          if (dfs(c.next, [...steps, { nodeId, choice: c.label }])) return true;
        }
      } else if (node.next) {
        return dfs(node.next, [...steps, { nodeId }]);
      }
      return false;
    }

    dfs("start", []);
    return found;
  }

  function createNodeButton(node, onJump) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "tree-node" +
      (node.mystery ? " is-mystery" : "") +
      (node.hub ? " is-hub" : "");
    btn.textContent = node.mystery ? "?" : node.label;
    if (node.mystery) {
      btn.title = "未知分支";
      btn.setAttribute("aria-label", "未知分支");
    } else {
      btn.title = "从此处回溯";
    }
    btn.addEventListener("click", function () {
      onJump(node.age, node.id);
    });
    return btn;
  }

  function renderTreeNode(node, onJump) {
    const cell = document.createElement("div");
    cell.className = "tree-cell";

    const nodeWrap = document.createElement("div");
    nodeWrap.className = "tree-node-wrap";
    nodeWrap.appendChild(createNodeButton(node, onJump));
    cell.appendChild(nodeWrap);

    if (node.children && node.children.length) {
      const stem = document.createElement("div");
      stem.className = "tree-stem";
      stem.setAttribute("aria-hidden", "true");
      cell.appendChild(stem);

      const fan = document.createElement("div");
      fan.className =
        "tree-fan" + (node.children.length > 1 ? " is-split" : " is-single");

      node.children.forEach(function (child) {
        const branch = document.createElement("div");
        branch.className = "tree-branch";
        const branchStem = document.createElement("div");
        branchStem.className = "tree-branch-stem";
        branchStem.setAttribute("aria-hidden", "true");
        branch.appendChild(branchStem);
        branch.appendChild(renderTreeNode(child, onJump));
        fan.appendChild(branch);
      });

      cell.appendChild(fan);
    }

    return cell;
  }

  function renderTree(container, onJump) {
    if (!container) return;
    container.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.className = "story-tree";

    const heading = document.createElement("p");
    heading.className = "story-tree-heading";
    heading.textContent = "// FLOW · 点击节点回溯";
    wrap.appendChild(heading);

    const scroll = document.createElement("div");
    scroll.className = "story-tree-scroll";

    STORY_TREE.forEach(function (chapter, i) {
      const section = document.createElement("section");
      section.className = "story-tree-chapter";

      const tag = document.createElement("div");
      tag.className = "story-tree-chapter-tag";
      tag.textContent = chapter.label;
      section.appendChild(tag);

      section.appendChild(renderTreeNode(chapter.root, onJump));
      scroll.appendChild(section);

      if (i < STORY_TREE.length - 1) {
        const link = document.createElement("div");
        link.className = "story-tree-chapter-link";
        link.setAttribute("aria-hidden", "true");
        scroll.appendChild(link);
      }
    });

    wrap.appendChild(scroll);
    container.appendChild(wrap);
  }

  window.SelasFlowmap = {
    STORAGE_CH10_PATH,
    STORY_TREE,

    saveCh10Path(path) {
      if (path) localStorage.setItem(STORAGE_CH10_PATH, path);
    },

    getCh10Path() {
      return localStorage.getItem(STORAGE_CH10_PATH);
    },

    findPathToCheckpoint(dialogue, checkpointId) {
      return findPathToCheckpoint(dialogue, checkpointId);
    },

    renderCompact(container, onJump) {
      renderTree(container, onJump);
    },

    renderTree(container, onJump) {
      renderTree(container, onJump);
    },
  };
})();
