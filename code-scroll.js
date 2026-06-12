/**
 * Full-screen dense code wall — multi-column line scroll
 */
(function () {
  "use strict";

  const MOBILE_QUERY = window.matchMedia(
    "(max-width: 768px), (hover: none) and (max-width: 900px)"
  );

  const CODE_POOL = [
    '<span class="c">// NEURAL_LINK :: SELA_LAND v2.077</span>',
    '<span class="k">import</span> { TimeSync, Channel, Memory } <span class="k">from</span> <span class="s">"sela/bridge"</span>;',
    '<span class="k">import</span> { PhotoLens, FlightRadar } <span class="k">from</span> <span class="s">"rex/modules"</span>;',
    '<span class="k">const</span> <span class="v">TARGET</span> = { <span class="p">year</span>: <span class="n">2017</span>, <span class="p">age</span>: <span class="n">10</span> };',
    '<span class="k">const</span> <span class="v">USER</span> = { <span class="p">id</span>: <span class="s">"REX"</span>, <span class="p">birthday</span>: <span class="s">"06.13"</span> };',
    '<span class="k">async function</span> <span class="f">openLink</span>() { <span class="k">await</span> sync(); }',
    'Channel.<span class="f">dial</span>(<span class="s">"CH-10"</span>);',
    'TimeSync.<span class="f">anchor</span>(<span class="s">"上海"</span>, <span class="n">2017</span>);',
    '<span class="n">[06.13]</span> birthday_flag = <span class="k">true</span>;',
    '<span class="n">[SYNC]</span> timeline_locked = OK;',
    '<span class="n">[WAIT]</span> player_input pending...',
    '<span class="k">while</span> (link.<span class="f">active</span>) { poll(); }',
    'msg = <span class="k">await</span> sela.<span class="f">recv</span>();',
    'ui.<span class="f">bubble</span>(msg, LEFT);',
    'choice = rex.<span class="f">select</span>();',
    '<span class="s">"你是谁？"</span> -> branch_init;',
    'route_lover | route_self | route_time;',
    '<span class="c">/* PHOTO_MODE */</span>',
    '<span class="k">class</span> <span class="v">MemoryCam</span> { shoot(); track(); }',
    'lens.<span class="f">capture</span>(<span class="s">"sky"</span>);',
    'radar.<span class="f">lock</span>(flight.alt);',
    '<span class="n">[PHOTO]</span> cloud_buffer += 1;',
    '<span class="n">[FLIGHT]</span> flyover_detected;',
    'callsign = <span class="s">"REX-613"</span>;',
    'heading = <span class="n">127</span>; alt = <span class="s">"T+0"</span>;',
    'notebook_girl.<span class="f">sync</span>();',
    '<span class="s">"我会一直等你的"</span>',
    'memory.<span class="f">write</span>(fragment);',
    'hex_dump(0x7F3A, timeline);',
    'push_stack(<span class="s">"sela@10"</span>);',
    'pop_stack(<span class="s">"rex@future"</span>);',
    'if (trust &lt; 0.5) link.<span class="f">drop</span>();',
    'else link.<span class="f">hold</span>(<span class="k">true</span>);',
    'entropy = Math.<span class="f">random</span>();',
    'buffer.<span class="f">fill</span>(<span class="n">0</span>);',
    'stream.<span class="f">pipe</span>(console);',
    '<span class="c">// ARCHIVE stream...</span>',
    '0x4E 0x45 0x55 0x52 0x41 0x4C',
    'decode_packet(raw_bytes);',
    'validate_checksum(frame);',
    'retry_count++;',
    'signal_strength = <span class="n">98</span>;',
    'latency_ms = <span class="n">12</span>;',
    'thread.<span class="f">spawn</span>(listener);',
    'mutex.<span class="f">lock</span>();',
    'queue.<span class="f">push</span>(event);',
    '<span class="k">export</span> { openLink, TARGET, USER };',
  ];

  const tracks = [];
  let wallEl = null;
  let resizeTimer = null;

  function isMobileView() {
    return MOBILE_QUERY.matches;
  }

  function updateDeviceLayout() {
    const stage = document.querySelector(".chat-stage");
    if (!stage) return;
    stage.classList.toggle("is-mobile", isMobileView());
    stage.classList.toggle("is-desktop", !isMobileView());
  }

  function rotateLines(offset) {
    const n = CODE_POOL.length;
    return Array.from({ length: n }, (_, i) => CODE_POOL[(i + offset) % n]);
  }

  function buildTrack(lines, colIndex) {
    const loop = [...lines, ...lines];
    const track = document.createElement("div");
    track.className = "code-wall-track";

    loop.forEach((html) => {
      const row = document.createElement("div");
      row.className = "code-wall-line";
      row.innerHTML = html;
      track.appendChild(row);
    });

    const lineCount = lines.length;
    const duration = 18 + (colIndex % 9) * 2.5;
    const delay = -(colIndex * 1.7 + (colIndex % 3) * 0.4);
    const reverse = colIndex % 4 === 1 || colIndex % 4 === 2;

    track.style.animation = `code-wall-scroll ${duration}s steps(${lineCount}, end) infinite`;
    track.style.animationDelay = `${delay}s`;
    if (reverse) track.style.animationDirection = "reverse";

    return track;
  }

  function buildWall() {
    if (!wallEl || isMobileView()) {
      if (wallEl) wallEl.innerHTML = "";
      tracks.length = 0;
      return;
    }

    const colMin = 82;
    const width = wallEl.clientWidth || window.innerWidth;
    const count = Math.max(14, Math.ceil(width / colMin));

    wallEl.innerHTML = "";
    tracks.length = 0;
    wallEl.style.setProperty("--code-cols", String(count));

    for (let i = 0; i < count; i++) {
      const col = document.createElement("div");
      col.className = "code-wall-col";
      col.style.setProperty("--col-i", String(i));

      const viewport = document.createElement("div");
      viewport.className = "code-wall-viewport";
      const track = buildTrack(rotateLines(i * 2), i);
      viewport.appendChild(track);
      col.appendChild(viewport);
      wallEl.appendChild(col);

      tracks.push({ track, col });
    }
  }

  function setPlaying(active) {
    wallEl?.classList.toggle("is-scrolling", active);
    tracks.forEach(({ track }) => {
      track.style.animationPlayState = active ? "running" : "paused";
    });
  }

  function syncScroll() {
    const chatScreen = document.getElementById("screen-chat");
    const shouldPlay =
      chatScreen?.classList.contains("active") && !isMobileView();
    setPlaying(!!shouldPlay);
  }

  function boot() {
    wallEl = document.getElementById("code-wall");
    const chatScreen = document.getElementById("screen-chat");
    if (!wallEl || !chatScreen) return;

    buildWall();

    updateDeviceLayout();
    syncScroll();

    MOBILE_QUERY.addEventListener("change", () => {
      updateDeviceLayout();
      buildWall();
      syncScroll();
    });

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildWall();
        syncScroll();
      }, 120);
    });

    const observer = new MutationObserver(() => {
      if (chatScreen.classList.contains("active") && !isMobileView()) {
        buildWall();
      }
      syncScroll();
    });
    observer.observe(chatScreen, { attributes: true, attributeFilter: ["class"] });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
