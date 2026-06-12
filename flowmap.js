/**
 * Sela's Land — Story flow map
 */
(function () {
  "use strict";

  const CH10_PATH_KEY = "selas-land-ch10-path";

  const AGE_15 = { transition: true, targetAge: 15, targetId: "ch15_date", label: "15岁" };
  const AGE_18 = { transition: true, targetAge: 18, targetId: "start", label: "18岁" };

  const CH10_TREE = {
    id: "start",
    label: "开场",
    branches: [
      {
        node: {
          id: "lover",
          label: "恋人",
          next: {
            id: "lover_final_choice",
            label: "生日 / 孤单",
            next: AGE_15,
          },
        },
      },
      {
        node: {
          id: "future_self",
          label: "未来的你",
          branches: [
            {
              node: {
                id: "future_correct_name",
                label: "饶芝筠",
                next: AGE_15,
              },
            },
            {
              node: {
                id: "future_wrong_name",
                label: "饶智军",
                branches: [
                  { node: { id: "future_sorry", label: "?", bad: true } },
                  { node: { id: "future_renamed_lie", label: "?", bad: true } },
                ],
              },
            },
          ],
        },
      },
    ],
  };

  const CH15_GOSSIP_HUB = { id: "ch15_gossip", label: "八卦", hub: true };

  const CH15_TREE = {
    id: "ch15_date",
    label: "生日",
    branches: [
      {
        node: {
          id: "ch15_gossip",
          label: "八卦",
          next: {
            id: "ch15_confession",
            label: "被表白",
            next: {
              id: "ch15_reject_guy",
              label: "拒绝",
              branches: [
                {
                  node: {
                    id: "ch15_cruel",
                    label: "你真残忍",
                    branches: [
                      { node: { id: "ch15_wechat", label: "?", bad: true } },
                      {
                        node: {
                          id: "ch15_boys_say",
                          label: "主动说",
                          next: AGE_18,
                        },
                      },
                    ],
                  },
                },
                {
                  node: {
                    id: "ch15_who_like",
                    label: "喜欢谁",
                    next: {
                      id: "ch15_boys_say",
                      label: "主动说",
                      next: AGE_18,
                    },
                  },
                },
              ],
            },
          },
        },
      },
      {
        node: {
          id: "ch15_obvious",
          label: "刻意",
          next: {
            id: "ch15_no_gift",
            label: "礼物",
            branches: [
              { node: { id: "ch15_pretend", label: "?", bad: true } },
              { node: { id: "ch15_poor", label: "装可怜", next: CH15_GOSSIP_HUB } },
              { node: { id: "ch15_voice", label: "语音", next: CH15_GOSSIP_HUB } },
              { node: CH15_GOSSIP_HUB },
            ],
          },
        },
      },
    ],
  };

  const CH18_TREE = {
    id: "start",
    label: "见面",
    next: {
      id: "ch18_port",
      label: "口岸",
      next: {
        id: "ch18_birthday",
        label: "敏华",
        next: {
          id: "ch18_memory",
          label: "相册",
          next: {
            id: "ch18_photo",
            label: "照片",
            next: {
              id: "ch18_after_photo",
              label: "之后",
              branches: [
                {
                  node: {
                    id: "ch18_mom_photo",
                    label: "哪来的",
                    next: { id: "ch18_come_love", label: "速归" },
                  },
                },
                {
                  node: {
                    id: "ch18_ten_years",
                    label: "十年",
                    next: { id: "ch18_come_love", label: "速归" },
                  },
                },
              ],
            },
          },
        },
      },
    },
  };

  const CHAPTERS = [
    { age: 10, tag: "10岁", tree: CH10_TREE },
    { age: 15, tag: "15岁", tree: CH15_TREE },
    { age: 18, tag: "18岁", tree: CH18_TREE },
  ];

  function getCh10Path() {
    try {
      return localStorage.getItem(CH10_PATH_KEY);
    } catch {
      return null;
    }
  }

  function saveCh10Path(path) {
    if (!path) return;
    try {
      localStorage.setItem(CH10_PATH_KEY, path);
    } catch {
      /* ignore */
    }
  }

  function findPathToCheckpoint(dialogue, targetId) {
    if (!dialogue || !dialogue.start || !dialogue[targetId]) return null;

    const queue = [{ nodeId: "start", steps: [] }];
    const seen = new Set(["start"]);

    while (queue.length) {
      const { nodeId, steps } = queue.shift();
      if (nodeId === targetId) return steps;

      const node = dialogue[nodeId];
      if (!node) continue;

      const baseSteps = [...steps, { nodeId }];
      if (node.next && !seen.has(node.next)) {
        seen.add(node.next);
        queue.push({ nodeId: node.next, steps: baseSteps });
      }

      if (node.choices) {
        node.choices.forEach((choice) => {
          if (!choice.next || seen.has(choice.next)) return;
          seen.add(choice.next);
          queue.push({
            nodeId: choice.next,
            steps: [...baseSteps, { nodeId, choice: choice.label }],
          });
        });
      }
    }

    return null;
  }

  function createNodeButton(age, node, onJump) {
    const wrap = document.createElement("div");
    wrap.className = "tree-node-wrap";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tree-node";

    if (node.transition) {
      btn.classList.add("is-age-transition");
      btn.textContent = node.label;
      btn.title = `进入 ${node.label} 章节`;
      btn.addEventListener("click", () => onJump(node.targetAge, node.targetId));
    } else if (node.bad) {
      btn.classList.add("is-mystery");
      btn.textContent = "?";
      btn.title = "未知结局";
      btn.addEventListener("click", () => onJump(age, node.id));
    } else {
      if (node.hub) btn.classList.add("is-hub");
      btn.textContent = node.label;
      btn.title = node.label;
      btn.addEventListener("click", () => onJump(age, node.id));
    }

    wrap.appendChild(btn);
    return wrap;
  }

  function renderLinearChain(node, age, onJump) {
    const cell = document.createElement("div");
    cell.className = "tree-cell";

    let current = node;
    while (current) {
      cell.appendChild(createNodeButton(age, current, onJump));
      if (!current.next) break;

      const stem = document.createElement("div");
      stem.className = "tree-stem";
      cell.appendChild(stem);

      if (current.next.transition || current.next.branches?.length || current.next.next) {
        cell.appendChild(renderTreeNode(current.next, age, onJump));
        break;
      }

      current = current.next;
    }

    return cell;
  }

  function renderFork(node, age, onJump) {
    const cell = document.createElement("div");
    cell.className = "tree-cell";

    if (node.id || node.transition || node.bad) {
      cell.appendChild(createNodeButton(age, node, onJump));
    }

    if (!node.branches?.length) return cell;

    const stem = document.createElement("div");
    stem.className = "tree-stem";
    cell.appendChild(stem);

    const fan = document.createElement("div");
    fan.className = `tree-fan${node.branches.length > 1 ? " is-split" : " is-single"}`;
    if (node.branches.length > 1) {
      fan.style.setProperty("--fan-left", "8%");
      fan.style.setProperty("--fan-right", "8%");
    }

    node.branches.forEach((branch) => {
      const branchEl = document.createElement("div");
      branchEl.className = "tree-branch";
      const branchStem = document.createElement("div");
      branchStem.className = "tree-branch-stem";
      branchEl.appendChild(branchStem);
      branchEl.appendChild(renderTreeNode(branch.node, age, onJump));
      fan.appendChild(branchEl);
    });

    cell.appendChild(fan);
    return cell;
  }

  function renderTreeNode(node, age, onJump) {
    if (!node) {
      const empty = document.createElement("div");
      empty.className = "tree-cell";
      return empty;
    }
    if (node.transition) {
      const cell = document.createElement("div");
      cell.className = "tree-cell";
      cell.appendChild(createNodeButton(age, node, onJump));
      return cell;
    }
    if (node.branches?.length) return renderFork(node, age, onJump);
    if (node.next) return renderLinearChain(node, age, onJump);
    const cell = document.createElement("div");
    cell.className = "tree-cell";
    cell.appendChild(createNodeButton(age, node, onJump));
    return cell;
  }

  function renderChapter(chapter, onJump) {
    const block = document.createElement("div");
    block.className = "story-tree-chapter";

    const tag = document.createElement("span");
    tag.className = "story-tree-chapter-tag";
    tag.textContent = chapter.tag;
    block.appendChild(tag);
    block.appendChild(renderTreeNode(chapter.tree, chapter.age, onJump));
    return block;
  }

  function renderFlowmap(container, onJump) {
    if (!container) return;
    container.innerHTML = "";

    const root = document.createElement("div");
    root.className = "story-tree";

    const heading = document.createElement("p");
    heading.className = "story-tree-heading";
    heading.textContent = "// FLOW · 点击节点回溯";
    root.appendChild(heading);

    const scroll = document.createElement("div");
    scroll.className = "story-tree-scroll";

    CHAPTERS.forEach((chapter, index) => {
      scroll.appendChild(renderChapter(chapter, onJump));
      if (index < CHAPTERS.length - 1) {
        const link = document.createElement("div");
        link.className = "story-tree-chapter-link";
        link.setAttribute("aria-hidden", "true");
        scroll.appendChild(link);
      }
    });

    root.appendChild(scroll);
    container.appendChild(root);
  }

  window.SelasFlowmap = {
    renderFlowmap,
    findPathToCheckpoint,
    getCh10Path,
    saveCh10Path,
  };
})();
