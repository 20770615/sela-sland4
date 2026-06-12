/**
 * Sela's Land — scene audio (ambient + one-shots)
 * 将 MP3 放入 assets/sounds/ 对应文件名即可。
 */
(function () {
  "use strict";

  const SOUNDS = {
    waterSplash: "assets/sounds/water-splash.mp3",
    teaBustleA: "assets/sounds/tea-bustle-a.mp3",
    teaBustleB: "assets/sounds/tea-bustle-b.mp3",
    msgDeliver: "assets/sounds/msg-deliver.mp3",
    endFailBlocked: "assets/sounds/end-fail-blocked.mp3",
    endFailJerk: "assets/sounds/end-fail-jerk.mp3",
    endSuccessDecade: "assets/sounds/end-success-decade.mp3",
  };

  const ENDING_SOUND_MAP = {
    future_blocked: "endFailBlocked",
    ch15_jerk: "endFailJerk",
    ch18_decade: "endSuccessDecade",
  };

  let enabled = true;
  let unlocked = false;
  const cache = {};
  let ambientId = null;
  let ambientVolume = 0.3;
  let fadeTimer = null;

  function get(id) {
    if (!SOUNDS[id]) return null;
    if (!cache[id]) {
      const audio = new Audio(SOUNDS[id]);
      audio.preload = "auto";
      cache[id] = audio;
    }
    return cache[id];
  }

  function canPlay() {
    return enabled && unlocked;
  }

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    Object.keys(SOUNDS).forEach((id) => {
      const audio = get(id);
      if (!audio) return;
      audio.volume = 0;
      audio.play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          if (id === ambientId) audio.volume = ambientVolume;
        })
        .catch(() => {});
    });
  }

  function play(id, opts = {}) {
    if (!canPlay()) return null;
    const template = get(id);
    if (!template) return null;
    const audio = opts.overlap ? template.cloneNode() : template;
    audio.loop = !!opts.loop;
    audio.volume = opts.volume ?? 0.5;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    return audio;
  }

  function stopAmbient(fadeMs = 500) {
    if (fadeTimer) {
      clearInterval(fadeTimer);
      fadeTimer = null;
    }
    const audio = ambientId ? get(ambientId) : null;
    if (!audio) {
      ambientId = null;
      return;
    }

    if (!fadeMs) {
      audio.pause();
      audio.currentTime = 0;
      ambientId = null;
      return;
    }

    const startVol = audio.volume;
    const steps = Math.max(1, Math.floor(fadeMs / 40));
    let step = 0;
    fadeTimer = setInterval(() => {
      step += 1;
      audio.volume = Math.max(0, startVol * (1 - step / steps));
      if (step >= steps) {
        clearInterval(fadeTimer);
        fadeTimer = null;
        audio.pause();
        audio.currentTime = 0;
        ambientId = null;
      }
    }, 40);
  }

  function startAmbient(id, volume = 0.3) {
    if (!canPlay()) return;
    stopAmbient(0);
    ambientVolume = volume;
    const audio = play(id, { loop: true, volume });
    if (audio) ambientId = id;
  }

  function playEnding(endKey, volume) {
    const soundId = ENDING_SOUND_MAP[endKey];
    if (!soundId) return;
    stopAmbient(350);
    play(soundId, { volume: volume ?? 0.52, overlap: true });
  }

  window.SelasAudio = {
    unlock,
    play,
    playEnding,
    startAmbient,
    stopAmbient,
    setEnabled(value) {
      enabled = value;
      if (!enabled) stopAmbient(0);
    },
  };
})();
