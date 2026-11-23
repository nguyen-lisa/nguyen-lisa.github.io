(function () {
  'use strict';

  // Projects visitors can see (drafts hide when SITE.showDrafts is false).
  const PROJ = PROJECTS.filter((p) => p && p.id && (SITE.showDrafts !== false || !p.draft));

  /* ---------- helpers ---------- */
  const root = document.documentElement;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const debounce = (fn, ms) => { let t; return () => { clearTimeout(t); t = setTimeout(fn, ms); }; };
  const HUES = ['pink', 'butter', 'mint', 'lilac', 'sky', 'peach'];
  const hueOf = (c) => (HUES.indexOf(c) > -1 ? c : 'lilac');
  const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const store = {
    get(k, d) { try { const v = localStorage.getItem('portfolio:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('portfolio:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  const mq = {
    dark: matchMedia('(prefers-color-scheme: dark)'),
    reduce: matchMedia('(prefers-reduced-motion: reduce)'),
    small: matchMedia('(max-width: 45rem), (max-height: 31rem)')
  };
  const isSmall = () => mq.small.matches;
  const remPx = () => parseFloat(getComputedStyle(root).fontSize) || 16;

  // Your local time with its zone, e.g. "9:16 p.m. EST" (EDT in summer), so visitors
  // elsewhere know which time it is. PROFILE.timezoneName adds the full name.
  function localTime() {
    const o = { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' };
    let t;
    try { t = new Intl.DateTimeFormat('en-US', Object.assign({ timeZone: PROFILE.timezone }, o)).format(new Date()); }
    catch (e) { t = new Intl.DateTimeFormat('en-US', o).format(new Date()); }
    return t + (PROFILE.timezoneName ? ' (' + PROFILE.timezoneName + ')' : '');
  }
  const TOKENS = {
    name: () => PROFILE.name,
    firstName: () => PROFILE.firstName,
    email: () => PROFILE.email,
    location: () => PROFILE.location,
    time: localTime,
    projectCount: () => WORDS[PROJ.length] || String(PROJ.length)
  };
  const listWords = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
  const langs = (learning) => (PROFILE.languages || []).filter((l) => /learn/i.test(l.level || '') === learning).map((l) => l.name);
  TOKENS.languages = () => listWords(langs(false));
  TOKENS.learning = () => listWords(langs(true)) || 'something new';
  TOKENS.hobbies = () => listWords((PROFILE.hobbies || []).map((h) => h.toLowerCase().indexOf('[') === 0 ? h : h.charAt(0).toLowerCase() + h.slice(1)));
  const fill = (s) => String(s).replace(/\{(\w+)\}/g, (m, k) => (TOKENS[k] ? TOKENS[k]() : m));

  /* ---------- pixel art (original 16x16 icons, drawn as SVG rects) ---------- */
  const PIX = {
    about: [
      '..KKKKKKKKK.....', '..KWWWWWWWKK....', '..KWWWWWWWKGK...', '..KWWWWWWWKGGK..',
      '..KWWWWWWWKKKK..', '..KWWWWWWWWWWK..', '..KWWPPWPPWWWK..', '..KWPPPPPPPWWK..',
      '..KWPPPPPPpWWK..', '..KWWPPPPpWWWK..', '..KWWWPPpWWWWK..', '..KWWWWpWWWWWK..',
      '..KWWWWWWWWWWK..', '..KWGGGGGGGGWK..', '..KWWWWWWWWWWK..', '..KKKKKKKKKKKK..'
    ],
    work: [
      '................', '................', '.KKKKK..........', 'KyyyyyK.........',
      'KyyyyyyKKKKKKKK.', 'KyyyyyyyyyyyyyyK', 'KKKKKKKKKKKKKKKK', 'KYWWWWWWWWWWWWYK',
      'KYYYYYYYYYYYYYYK', 'KYYYYYYYYYYLYYYK', 'KYYYYYYYYYLLLYYK', 'KYYYYYYYYYYLYYYK',
      'KYYYYYYYYYYYYYYK', 'KyyyyyyyyyyyyyyK', 'KKKKKKKKKKKKKKKK', '................'
    ],
    cv: [
      '..KKKKKKKKKKKK..', '..KWWWWWWWWWWK..', '..KWPPPWSSSSWK..', '..KWPPPWWWWWWK..',
      '..KWPPPWSSSWWK..', '..KWWWWWWWWWWK..', '..KWMMMMMMMMWK..', '..KWWWWWWWWWWK..',
      '..KWGGGGGGGGWK..', '..KWWWWWWWWWWK..', '..KWGGGGGGWWWK..', '..KWWWWWWWWWWK..',
      '..KWGGGGGGGGWK..', '..KWWWWWWWWWWK..', '..KWGGGGWWWWWK..', '..KKKKKKKKKKKK..'
    ],
    messages: [
      '................', '..KKKKKKKKKKKK..', '.KLLLLLLLLLLLLK.', 'KLWWLLLLLLLLLLLK',
      'KLWLLLLLLLLLLLLK', 'KLLLLLLLLLLLLLLK', 'KLLWWLLWWLLWWLLK', 'KLLWWLLWWLLWWLLK',
      'KLLLLLLLLLLLLLLK', 'KlLLLLLLLLLLLLlK', '.KllllllllllllK.', '..KlKKKKKKKKKK..',
      '.KlK............', '.KK.............', '................', '................'
    ],
    notes: [
      '................', '.KKKKKKKKKKKKK..', '.KYYYYYYYYYYYK..', '.KYYYYYYYYYYYK..', '.KYyyyyyyYYYYK..', '.KYYYYYYYYYYYK..',
      '.KYyyyyyyyyYYK..', '.KYYYYYYYYYYYK..', '.KYyyyyYYYYYYK..', '.KYYYYYYYYYYYK..', '.KYYYYYYYYYKKK..', '.KYYYYYYYYKyK...',
      '.KYYYYYYYYKK....', '.KKKKKKKKKK.....', '................', '................'
    ],
    controller: [
      '................', '................', '................', '..KKKKKKKKKKKK..', '.KLLLLLLLLLLLLK.', 'KLLLKLLLLLLPLLLK',
      'KLLKKKLLLLPLPLLK', 'KLLLKLLLLLLPLLLK', 'KLLLLLLLLLLLLLLK', '.KLLLLKKKKLLLLK.', '..KLLK....KLLK..', '...KK......KK...',
      '................', '................', '................', '................'
    ],
    goals: [
      '.....KKKKKK.....', '..KKKKOOOOKKKK..', '..KSSKKKKKKSSK..', '..KSWWWWWWWWSK..',
      '..KSWMMWGGGGSK..', '..KSWMMWWWWWSK..', '..KSWWWWWWWWSK..', '..KSWMMWGGGWSK..',
      '..KSWMMWWWWWSK..', '..KSWWWWWWWWSK..', '..KSWPPWGGGGSK..', '..KSWPPWWWWWSK..',
      '..KSWWWWWWWWSK..', '..KSSSSSSSSSSK..', '..KKKKKKKKKKKK..', '................'
    ],
    case: [
      '..KKKKKKKKKKKK..', '..KWWWWWWWWWWK..', '..KWKKKKKKKKWK..', '..KWKHHHHHHKWK..',
      '..KWKHHHHWHKWK..', '..KWKHHHHHHKWK..', '..KWKHHKHHHKWK..', '..KWKHKKKHHKWK..',
      '..KWKKKKKKKKWK..', '..KWWWWWWWWWWK..', '..KWGGGGGGGGWK..', '..KWWWWWWWWWWK..',
      '..KWGGGGGGWWWK..', '..KWWWWWWWWWWK..', '..KKKKKKKKKKKK..', '................'
    ]
  };
  const GLYPH = {
    close: ['KK....KK', 'KKK..KKK', '.KKKKKK.', '..KKKK..', '..KKKK..', '.KKKKKK.', 'KKK..KKK', 'KK....KK'],
    zoom: ['KKKKKKKK', 'KKKKKKKK', 'K......K', 'K......K', 'K......K', 'K......K', 'K......K', 'KKKKKKKK'],
    restore: ['..KKKKKK', '..KKKKKK', '..K....K', 'KKKKKK.K', 'KKKKKK.K', 'K....KKK', 'K....K..', 'KKKKKK..'],
    move: ['....K....', '...KKK...', '....K....', '.K..K..K.', 'KKKKKKKKK', '.K..K..K.', '....K....', '...KKK...', '....K....'],
    soundOn: ['....K......', '...KK....K.', 'KKKKK..K..K', 'KKKKK...K.K', 'KKKKK...K.K', 'KKKKK...K.K', 'KKKKK..K..K', '...KK....K.', '....K......'],
    soundOff: ['....K......', '...KK......', 'KKKKK.K...K', 'KKKKK..K.K.', 'KKKKK...K..', 'KKKKK..K.K.', 'KKKKK.K...K', '...KK......', '....K......'],
    moon: ['...KKKK..', '.KKKK....', '.KKK.....', 'KKK......', 'KKK......', 'KKK......', '.KKK.....', '.KKKK....', '...KKKK..'],
    sparkle: ['....K....', '....K....', '...KKK...', '..KKKKK..', 'KKKKKKKKK', '..KKKKK..', '...KKK...', '....K....', '....K....'],
    send: ['....KK...', '.....KK..', '......KK.', 'KKKKKKKKK', 'KKKKKKKKK', '......KK.', '.....KK..', '....KK...'],
    hand: ['....KK.....', '...K..K....', '...K..KKK..', 'KK.K..K..KK', 'K.KK......K', 'K.........K', '.K........K', '..K......K.', '...KKKKKK..'],
    kUp: ['...K...', '..KKK..', '.KKKKK.', 'KKKKKKK', '..KKK..', '..KKK..', '..KKK..'],
    kDown: ['..KKK..', '..KKK..', '..KKK..', 'KKKKKKK', '.KKKKK.', '..KKK..', '...K...'],
    kLeft: ['...K...', '..KK...', '.KKKKKK', 'KKKKKKK', '.KKKKKK', '..KK...', '...K...'],
    kRight: ['...K...', '...KK..', 'KKKKKK.', 'KKKKKKK', 'KKKKKK.', '...KK..', '...K...'],
    kB: ['KKKK.', 'K...K', 'K...K', 'KKKK.', 'K...K', 'K...K', 'KKKK.'],
    kA: ['.KKK.', 'K...K', 'K...K', 'KKKKK', 'K...K', 'K...K', 'K...K'],
    pointer: ['K.......', 'KK......', 'KKK.....', 'KKKK....', 'KKKKK...', 'KKKKKK..', 'KKKKKKK.', 'KKKK....', 'KK.KK...', 'K..KK...'],
    ext: ['...KKKKK', '......KK', '.....K.K', '....K..K', '...K....', '..K.....', '.K......', 'K.......']
  };
  const PX_CLASS = { K: 'ink', W: 'white', G: 'paper', P: 'pink', p: 'pink-d', L: 'lilac', l: 'lilac-d', Y: 'butter', y: 'butter-d', M: 'mint', m: 'mint-d', S: 'sky', s: 'sky-d', O: 'peach', o: 'peach-d', H: 'hue' };
  function pixelSVG(rows, cls, mono, scale) {
    const h = rows.length, w = rows[0].length;
    let out = '';
    for (let y = 0; y < h; y++) {
      const row = rows[y];
      let x = 0;
      while (x < w) {
        const c = row[x];
        if (c === '.' || c === undefined) { x++; continue; }
        let n = 1;
        while (x + n < w && row[x + n] === c) n++;
        out += '<rect x="' + x + '" y="' + y + '" width="' + n + '" height="1"' + (mono ? '' : ' class="px-' + PX_CLASS[c] + '"') + '/>';
        x += n;
      }
    }
    return '<svg class="' + cls + '" viewBox="0 0 ' + w + ' ' + h + '" width="' + w * scale + '" height="' + h * scale + '" aria-hidden="true" focusable="false" shape-rendering="crispEdges"' + (mono ? ' fill="currentColor"' : '') + '>' + out + '</svg>';
  }
  // Your own icon art: one image, used in both themes.
  const artImg = (src, cls, size) => '<img class="px px-art' + (cls ? ' ' + cls : '') + '" src="' + esc(src) + '" alt="" width="' + size + '" height="' + size + '">';
  const icon = (name, cls) => (ICON_IMAGES[name]
    ? artImg(ICON_IMAGES[name], cls, 48)
    : pixelSVG(PIX[name] || PIX.case, 'px' + (cls ? ' ' + cls : ''), false, 3));
  const ICON_IMAGES = {};   // filled from iconImage in WINDOWS
  if (typeof ART !== 'undefined' && ART && ART.caseStudyIcon) ICON_IMAGES.case = ART.caseStudyIcon;
  const ARTW = (typeof ART !== 'undefined' && ART) || {};
  const GLYPH_ART = { zoom: 'maximize', ext: 'externalLink', pointer: 'cursorToggle' };
  // Your button symbols: by default only their shape is used, filled with the
  // theme's text colour, so they pass contrast on every button in both themes.
  // Set ART.glyphColours to "asDrawn" to keep your own colours instead.
  const MASKS = {};
  function prepMask(src) {
    if (MASKS[src]) return;
    MASKS[src] = 'url("' + String(src).replace(/"/g, '%22') + '")';
    const im = new Image();
    im.onload = () => {   // scale up with hard pixel edges, so the shape stays crisp
      try {
        const c = document.createElement('canvas'); c.width = im.width * 2; c.height = im.height * 2;
        const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(im, 0, 0, c.width, c.height);
        MASKS[src] = 'url("' + c.toDataURL() + '")';
        $$('[data-mask="' + CSS.escape(src) + '"]').forEach((el) => el.style.setProperty('--glyph', MASKS[src]));
      } catch (e) { /* the browser blocked reading the file; the plain shape is used */ }
    };
    im.src = src;
  }
  const glyph = (name) => {
    const src = (ARTW.glyphs || {})[GLYPH_ART[name] || name];
    if (!src) return pixelSVG(GLYPH[name], 'glyph', true, 2);
    if (ARTW.glyphColours === 'asDrawn') return '<img class="glyph glyph-art" src="' + esc(src) + '" alt="" width="16" height="16">';
    prepMask(src);
    return '<span class="glyph glyph-mask" aria-hidden="true" data-mask="' + esc(src) + '" style="--glyph:' + esc(MASKS[src]) + '"></span>';
  };

  /* ---------- preferences ---------- */
  const prefs = {
    theme: store.get('theme', null),   // 'light' | 'dark' | null (follow the device)
    sound: store.get('sound', true),
    motion: store.get('motion', null)  // true | false | null (follow the device)
  };
  const motionOK = () => (prefs.motion === null ? !mq.reduce.matches : prefs.motion);
  function currentTheme() {
    if (prefs.theme === 'light' || prefs.theme === 'dark') return prefs.theme;
    const host = root.getAttribute('data-theme');
    if (host === 'light' || host === 'dark') return host;
    return mq.dark.matches ? 'dark' : 'light';
  }

  /* ---------- sound: everything is synthesized, no audio files ---------- */
  const NOTES = [1046.5, 1174.66, 1318.51, 1567.98, 1760];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const SOUNDS = {
    day: { // bubbly marimba
      hover(s) { s.tone(pick(NOTES), { type: 'triangle', dur: 0.07, gain: 0.045, slide: 1.05 }); },
      click(s) { s.tone(660, { dur: 0.09, gain: 0.16, slide: 0.5 }); s.tone(1320, { dur: 0.04, gain: 0.035 }); },
      open(s) { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => s.tone(f, { t: i * 0.045, dur: 0.16, type: 'triangle', gain: 0.1 })); },
      close(s) { [783.99, 587.33, 392].forEach((f, i) => s.tone(f, { t: i * 0.045, dur: 0.14, type: 'triangle', gain: 0.09 })); },
      zoom(s) { s.tone(523.25, { dur: 0.07, gain: 0.09, type: 'triangle' }); s.tone(1046.5, { t: 0.05, dur: 0.1, gain: 0.08, type: 'triangle' }); },
      drop(s) { s.tone(240, { dur: 0.09, gain: 0.12, slide: 0.7 }); },
      send(s) { s.tone(330, { dur: 0.12, gain: 0.11, slide: 2.2 }); },
      receive(s) { s.tone(1318.51, { dur: 0.16, gain: 0.09 }); s.tone(1046.5, { t: 0.08, dur: 0.24, gain: 0.08 }); },
      on(s) { s.tone(880, { dur: 0.07, gain: 0.09, type: 'triangle' }); s.tone(1318.51, { t: 0.05, dur: 0.1, gain: 0.08, type: 'triangle' }); },
      off(s) { s.tone(1318.51, { dur: 0.07, gain: 0.08, type: 'triangle' }); s.tone(880, { t: 0.05, dur: 0.1, gain: 0.08, type: 'triangle' }); },
      theme(s) { [1567.98, 2093, 2637.02, 3135.96, 2637.02].forEach((f, i) => s.tone(f, { t: i * 0.05, dur: 0.14, gain: 0.04 })); },
      page(s) { s.noise({ dur: 0.12, gain: 0.06, freq: 3200 }); s.tone(880, { t: 0.04, dur: 0.1, gain: 0.05, type: 'triangle' }); }
    },
    night: { // glassy celesta with a longer echo
      hover(s) { s.tone(pick(NOTES) * 1.5, { dur: 0.14, gain: 0.03, bell: 2.76 }); },
      click(s) { s.tone(1567.98, { dur: 0.3, gain: 0.08, bell: 2 }); },
      open(s) { [440, 659.25, 880, 1318.51].forEach((f, i) => s.tone(f, { t: i * 0.06, dur: 0.45, gain: 0.07, bell: 2.76 })); },
      close(s) { [1318.51, 987.77, 659.25].forEach((f, i) => s.tone(f, { t: i * 0.06, dur: 0.35, gain: 0.06, bell: 2.76 })); },
      zoom(s) { s.tone(880, { dur: 0.18, gain: 0.07, bell: 2.76 }); s.tone(1760, { t: 0.06, dur: 0.22, gain: 0.05, bell: 2.76 }); },
      drop(s) { s.tone(330, { dur: 0.2, gain: 0.08, bell: 2.76 }); },
      send(s) { s.tone(523.25, { dur: 0.18, gain: 0.07, slide: 2, bell: 2 }); },
      receive(s) { s.tone(1975.53, { dur: 0.35, gain: 0.06, bell: 2.76 }); s.tone(1318.51, { t: 0.1, dur: 0.45, gain: 0.06, bell: 2.76 }); },
      on(s) { s.tone(1318.51, { dur: 0.2, gain: 0.06, bell: 2.76 }); s.tone(1975.53, { t: 0.06, dur: 0.25, gain: 0.05, bell: 2.76 }); },
      off(s) { s.tone(1975.53, { dur: 0.2, gain: 0.05, bell: 2.76 }); s.tone(1318.51, { t: 0.06, dur: 0.25, gain: 0.05, bell: 2.76 }); },
      theme(s) { [2093, 2349.32, 2637.02, 3135.96, 3520].forEach((f, i) => s.tone(f, { t: i * 0.06, dur: 0.3, gain: 0.03, bell: 2.76 })); },
      page(s) { s.noise({ dur: 0.14, gain: 0.05, freq: 4200 }); s.tone(1318.51, { t: 0.05, dur: 0.25, gain: 0.04, bell: 2.76 }); }
    }
  };
  const Sound = {
    ctx: null, bus: null, master: null, fb: null, wet: null, noiseBuf: null, lastHover: 0,
    unlock() {
      if (!prefs.sound) return;
      try {
        if (!this.ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          const c = (this.ctx = new AC());
          this.master = c.createGain(); this.master.gain.value = 0.5;
          const comp = c.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 4;
          this.bus = c.createGain();
          const delay = c.createDelay(1); delay.delayTime.value = 0.17;
          const soft = c.createBiquadFilter(); soft.type = 'lowpass'; soft.frequency.value = 3000;
          this.fb = c.createGain(); this.wet = c.createGain();
          this.bus.connect(this.master);
          this.bus.connect(delay); delay.connect(soft); soft.connect(this.fb); this.fb.connect(delay);
          soft.connect(this.wet); this.wet.connect(this.master);
          this.master.connect(comp); comp.connect(c.destination);
          this.setMode();
        }
        if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      } catch (e) { this.ctx = null; }
    },
    setMode() {
      if (!this.ctx) return;
      const night = root.dataset.mode === 'dark', t = this.ctx.currentTime;
      this.fb.gain.setTargetAtTime(night ? 0.38 : 0.2, t, 0.05);
      this.wet.gain.setTargetAtTime(night ? 0.3 : 0.14, t, 0.05);
    },
    tone(freq, o) {
      o = o || {};
      const c = this.ctx, t0 = c.currentTime + (o.t || 0), dur = o.dur || 0.12, peak = o.gain || 0.1;
      const voice = (f, g, d, type) => {
        const osc = c.createOscillator(), env = c.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(f, t0);
        if (o.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, f * o.slide), t0 + d);
        env.gain.setValueAtTime(0.0001, t0);
        env.gain.exponentialRampToValueAtTime(g, t0 + 0.005);
        env.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
        osc.connect(env); env.connect(this.bus);
        osc.start(t0); osc.stop(t0 + d + 0.03);
      };
      voice(freq, peak, dur, o.type || 'sine');
      if (o.bell) voice(freq * o.bell, peak * 0.35, dur * 0.55, 'sine');
    },
    noise(o) {
      o = o || {};
      const c = this.ctx, t0 = c.currentTime + (o.t || 0), dur = o.dur || 0.08;
      if (!this.noiseBuf) {
        const len = Math.floor(c.sampleRate * 0.5), b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        this.noiseBuf = b;
      }
      const src = c.createBufferSource(); src.buffer = this.noiseBuf;
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = o.freq || 2000; bp.Q.value = 0.9;
      const env = c.createGain();
      env.gain.setValueAtTime(0.0001, t0);
      env.gain.exponentialRampToValueAtTime(o.gain || 0.1, t0 + 0.005);
      env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(bp); bp.connect(env); env.connect(this.bus);
      src.start(t0, Math.random() * 0.3); src.stop(t0 + dur + 0.02);
    },
    play(name) {
      if (!prefs.sound || !this.ctx || this.ctx.state !== 'running') return;
      if (name === 'hover') {
        const now = performance.now();
        if (now - this.lastHover < 45) return;
        this.lastHover = now;
      }
      const set = SOUNDS[root.dataset.mode === 'dark' ? 'night' : 'day'];
      try { (set[name] || set.click)(this); } catch (e) { /* ignore audio hiccups */ }
    }
  };

  /* ---------- pixel sky (drawn small, scaled up with crisp pixels) ---------- */
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const hex = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function setPx(img, x, y, c, a) {
    x |= 0; y |= 0;
    if (x < 0 || y < 0 || x >= img.width || y >= img.height) return;
    const k = (y * img.width + x) * 4, d = img.data;
    if (a === undefined || a >= 1) { d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; }
    else { d[k] += (c[0] - d[k]) * a; d[k + 1] += (c[1] - d[k + 1]) * a; d[k + 2] += (c[2] - d[k + 2]) * a; }
    d[k + 3] = 255;
  }
  function ditherSky(g, W, H, stops) {
    const img = g.createImageData(W, H), d = img.data, cols = stops.map(hex), n = cols.length - 1;
    for (let y = 0; y < H; y++) {
      const t = (y / Math.max(1, H - 1)) * n, i = Math.min(n - 1, Math.floor(t)), f = t - i;
      for (let x = 0; x < W; x++) {
        const th = (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
        const c = f > th ? cols[i + 1] : cols[i], k = (y * W + x) * 4;
        d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
      }
    }
    return img;
  }
  function glow(img, cx, cy, r, color, strength, mix) {
    const c = hex(color);
    for (let y = Math.max(0, Math.floor(cy - r)); y < Math.min(img.height, Math.ceil(cy + r)); y++) {
      for (let x = Math.max(0, Math.floor(cx - r)); x < Math.min(img.width, Math.ceil(cx + r)); x++) {
        const dist = Math.hypot(x - cx, y - cy) / r;
        if (dist >= 1) continue;
        const v = (1 - dist) * (1 - dist) * strength;
        if (v > (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16) setPx(img, x, y, c, mix);
      }
    }
  }
  function disc(img, cx, cy, r, color, cut) {
    const c = hex(color);
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
        if ((x - cx) ** 2 + (y - cy) ** 2 > r * r) continue;
        if (cut && (x - cut[0]) ** 2 + (y - cut[1]) ** 2 <= cut[2] * cut[2]) continue;
        setPx(img, x, y, c);
      }
    }
  }
  function line(img, x0, y0, x1, y1, color, a) {
    const c = hex(color);
    x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (let guard = 0; guard < 4000; guard++) {
      setPx(img, x0, y0, c, a);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  function cloudSprite(width, rnd, colTop, colUnder) {
    const w = Math.round(width), h = Math.round(w * 0.55) + 3, base = h - 2;
    const puffs = [], n = 3 + Math.floor(rnd() * 3);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const r = w * (0.12 + 0.14 * Math.sin(t * Math.PI)) * (0.85 + rnd() * 0.3);
      puffs.push([w * (0.12 + 0.76 * t), base - r * 0.55, r]);
    }
    const inside = (x, y) => y <= base && puffs.some((p) => (x - p[0]) ** 2 + (y - p[1]) ** 2 <= p[2] * p[2]);
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const g = cv.getContext('2d'), img = g.createImageData(w, h);
    const top = hex(colTop || '#FFFFFF'), under = hex(colUnder || '#F2DDF6');
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!inside(x, y)) continue;
        const c = (y > base - 3 || !inside(x, y + 2)) ? under : top, k = (y * w + x) * 4;
        img.data[k] = c[0]; img.data[k + 1] = c[1]; img.data[k + 2] = c[2]; img.data[k + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    return cv;
  }
  /* Landscape under the sky, shared by day and night with different colours:
     a lake, a mountain range, rolling hills, optional trees and a cabin. */
  const HILL = {   // the sky-only hill: lit edge, grass, and the dithered shade below
    day: { edge: '#C6F0CF', fill: '#9EDDB0', shade: '#5CA17F' },
    night: { edge: '#1D4A1F', fill: '#123515', shade: '#063328' }
  };
  const LAND = {
    night: { lake: '#3A2A72', lakeLit: '#45317F', back: ['#211F40', '#1B1A36'], front: ['#123515', '#0B2410'], edge: '#1D4A1F',
      trees: ['#103315', '#0A250F', '#1C130F'], roof: '#4E0D27', walls: '#741233', window: '#FFD447', chimney: '#3A0A1E' },
    day: { lake: '#BBD6F4', lakeLit: '#E2EEFF', back: ['#C7C0EC', '#BCB4E5'], front: ['#9EDDB0', '#88D09F'], edge: '#C6F0CF',
      trees: ['#6DBE88', '#55A673', '#9A6B5A'], roof: '#E77FAE', walls: '#FFF4E4', window: '#78AEE3', chimney: '#B65F82' }
  };
  function paintLand(img, W, H, horizon, pal, rnd) {
    const lakeEnd = Math.round(horizon + H * 0.05);
    const lake = hex(pal.lake), lakeLit = hex(pal.lakeLit);
    for (let y = horizon; y < H; y++) for (let x = 0; x < W; x++) {
      setPx(img, x, y, y < horizon + 2 && BAYER[(y & 3) * 4 + (x & 3)] < 8 ? lakeLit : lake);
    }
    const ridge = (base, amp, seed) => {
      const r = rng(seed), ph = [r() * 6.28, r() * 6.28, r() * 6.28];
      return Array.from({ length: W }, (_, x) => Math.round(base - amp * (0.55 * Math.sin(x / W * 5.1 + ph[0]) + 0.3 * Math.sin(x / W * 11.7 + ph[1]) + 0.15 * Math.sin(x / W * 23 + ph[2]))));
    };
    const fillBelow = (top, cols) => {
      const c = hex(cols[0]), c2 = hex(cols[1]);
      for (let x = 0; x < W; x++) for (let y = Math.max(0, top[x]); y < H; y++) {
        const deep = y > top[x] + 3 && (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 < (y - top[x]) / (H - top[x] + 8);
        setPx(img, x, y, deep ? c2 : c);
      }
    };
    const back = ridge(lakeEnd - H * 0.005, H * 0.085, 21);
    const front = ridge(lakeEnd + H * 0.1, H * 0.06, 34);
    fillBelow(back, pal.back);
    fillBelow(front, pal.front);
    for (let x = 0; x < W; x++) if (front[x] < H) setPx(img, x, front[x], hex(pal.edge));
    const cx = Math.round(W * (W > H ? 0.36 : 0.3)), cy = front[cx];
    if (pal.trees) {   // round pixel trees in small groups along the hills, clear of the cabin
      const [leaf, shade, trunk] = pal.trees.map(hex);
      const count = Math.round(W / 26) + 4;
      for (let i = 0; i < count; i++) {
        const tx = Math.round(rnd() * W);
        if (Math.abs(tx - cx) < 9) continue;
        const r = 2 + Math.round(rnd() * 2.5), ty = front[clamp(tx, 0, W - 1)] - r - 1;
        for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++) {
          if (xx * xx + yy * yy > r * r + 1) continue;
          setPx(img, tx + xx, ty + yy, xx + yy > r * 0.6 ? shade : leaf);
        }
        setPx(img, tx, ty + r + 1, trunk); setPx(img, tx, ty + r, trunk);
      }
    }
    const house = ['..RRR..', '.RRRRR.', 'RRRRRRR', '.WWYWW.', '.WWYWW.', '.WWWWW.'];
    const hc = { R: hex(pal.roof), W: hex(pal.walls), Y: hex(pal.window) };
    house.forEach((row, yy) => row.split('').forEach((ch, xx) => { if (ch !== '.') setPx(img, cx - 3 + xx, cy - 6 + yy, hc[ch]); }));
    setPx(img, cx + 2, cy - 8, hex(pal.chimney)); setPx(img, cx + 2, cy - 7, hex(pal.chimney));
    return [cx + 2, cy - 9];
  }
  /* Your sprites (ART.sprites in content.js). The code only moves, twinkles
     and fades them; with a sprite missing, the built-in one is drawn instead. */
  const SPR = { clouds: [], star: null, sparkle: null, smoke: null, shootingStar: null, wallpaperDay: null, wallpaperNight: null };
  function loadSprites(done) {
    const S = ARTW.sprites || {}, jobs = [];
    const load = (src) => new Promise((res) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = () => { console.warn('Could not load the image', src); res(null); };
      im.src = src;
    });
    (S.clouds || []).filter(Boolean).forEach((src) => jobs.push(load(src).then((im) => { if (im) SPR.clouds.push(im); })));
    ['star', 'sparkle', 'smoke', 'shootingStar'].forEach((k) => { if (S[k]) jobs.push(load(S[k]).then((im) => { SPR[k] = im; })); });
    ['wallpaperDay', 'wallpaperNight'].forEach((k) => { if (ARTW[k]) jobs.push(load(ARTW[k]).then((im) => { SPR[k] = im; })); });
    Promise.all(jobs).then(done);
  }
  // Draws a sprite centred on x, y at a whole-number scale.
  const twinkle = () => SPR.star || SPR.sparkle;
  function sprite(g, im, x, y, alpha, scale) {
    const k = scale || 1, w = im.width * k, h = im.height * k;
    g.globalAlpha = alpha;
    g.drawImage(im, Math.round(x - w / 2), Math.round(y - h / 2), w, h);
  }
  function drawSmoke(g, sec, at, colour) {
    if (!at) return;
    g.fillStyle = colour;
    for (let i = 0; i < 6; i++) {
      const life = (sec * 0.35 + i / 6) % 1;
      const px = Math.round(at[0] - life * 5 + Math.sin(life * 6 + i) * 1.2), py = Math.round(at[1] - life * 14);
      if (SPR.smoke) { sprite(g, SPR.smoke, px, py, (1 - life) * 0.9); continue; }
      if (colour === null) continue;
      g.globalAlpha = (1 - life) * 0.8;
      g.fillRect(px, py, life > 0.5 ? 2 : 1, life > 0.5 ? 2 : 1);
    }
    g.globalAlpha = 1;
  }
  const Sky = {
    S: 4, cv: null, g: null, W: 0, H: 0, bg: null, mode: '', run: false, raf: 0, last: 0, ready: false,
    clouds: [], sparkles: [], stars: [], cstars: [], shoot: null, nextShoot: 0,
    init() {
      this.cv = $('#sky');
      this.g = this.cv.getContext('2d');
      addEventListener('resize', debounce(() => this.build(), 160));
      this.ready = true;
      this.build();
    },
    build() {
      if (!this.ready) return;
      this.mode = root.dataset.mode;
      // Your own wallpaper replaces the drawn scene for that theme. It is drawn
      // pixel for pixel, scaled up a whole number of times to cover the screen,
      // and anchored to the bottom, so your sprites share its pixel size.
      // ART.skyOnly: just the gradient sky, with clouds, sparkles and stars, and no hills.
      this.skyOnly = !!(ARTW.skyOnly && this.gradient());
      const wall = this.skyOnly ? null : SPR[this.mode === 'dark' ? 'wallpaperNight' : 'wallpaperDay'];
      this.S = wall ? Math.max(1, Math.ceil(Math.max(innerWidth / wall.width, innerHeight / wall.height))) : 4;
      this.W = Math.max(8, Math.ceil(innerWidth / this.S));
      this.H = Math.max(8, Math.ceil(innerHeight / this.S));
      this.cv.width = this.W; this.cv.height = this.H;
      Object.assign(this.cv.style, { width: this.W * this.S + 'px', height: this.H * this.S + 'px',
        left: Math.round((innerWidth - this.W * this.S) / 2) + 'px', top: (innerHeight - this.H * this.S) + 'px' });
      this.bg = document.createElement('canvas');
      this.bg.width = this.W; this.bg.height = this.H;
      const b = this.bg.getContext('2d');
      this.own = !!wall || this.skyOnly;
      if (this.skyOnly) this.buildSky(rng(13), b);
      else if (wall) this.buildOwn(b, wall, rng(13));
      else { this.cv.style.background = ''; if (this.mode === 'dark') this.buildNight(b, rng(11)); else this.buildDay(b, rng(5)); }
      this.setRunning(motionOK());
    },
    buildOwn(b, wall, rnd) {
      const W = this.W, H = this.H, A = ARTW.animate || {}, x0 = Math.round((W - wall.width) / 2), y0 = H - wall.height;
      b.imageSmoothingEnabled = false;
      if (!this.gradient()) {   // with a gradient sky, see-through pixels stay see-through
        b.fillStyle = getComputedStyle(root).getPropertyValue('--desk') || '#000';
        b.fillRect(0, 0, W, H);
      }
      b.drawImage(wall, x0, y0);
      this.horizon = clamp(y0 + (A.skyBottom || Math.round(wall.height * 0.7)), 4, H);
      this.smoothSky(b, x0, y0, wall);
      this.chimney = A.smokeFrom ? [x0 + A.smokeFrom[0], y0 + A.smokeFrom[1]] : null;
      const night = this.mode === 'dark';
      // Until you draw cloud sprites, the built-in clouds drift over your day sky.
      this.clouds = (SPR.clouds.length || !night) && (!night || A.cloudsAtNight) ? Array.from({ length: A.cloudCount || 6 }, (_, i) => {
        const im = SPR.clouds.length ? SPR.clouds[i % SPR.clouds.length] : cloudSprite(16 + rnd() * 24, rnd);
        return { img: im, x: rnd() * (W + 60), y: Math.round(rnd() * Math.max(1, this.horizon - im.height - 2)), v: 0.5 + rnd() * 1.2 };
      }) : [];
      // Until you draw a sparkle sprite, small built-in pixel stars twinkle instead.
      this.stars = Array.from({ length: night ? (A.starCount || 40) : Math.round((A.starCount || 40) / 4) }, () => ({
        x: Math.floor(rnd() * W), y: 1 + Math.floor(rnd() * Math.max(1, this.horizon - 5)), ph: rnd() * 6.28, sp: 0.4 + rnd() * 1.4
      }));
      this.shoot = null;
      this.nextShoot = performance.now() + 4000;
    },
    // A smooth gradient sky behind your hills: your wallpaper's sky is
    // see-through, and the gradient is the canvas's CSS background, drawn at
    // full screen resolution. It runs from the top of the screen down to
    // animate.skyGradientTo, the lowest row where your sky shows.
    smoothSky(b, x0, y0, wall) {
      const cols = this.gradient();
      if (!cols) { this.cv.style.background = ''; return; }
      const A = ARTW.animate || {}, to = y0 + (A.skyGradientTo || wall.height * 0.72);
      const end = clamp((to + 1) / this.H * 100, 1, 100);
      this.cv.style.background = 'linear-gradient(to bottom, ' +
        cols.map((c, i) => c + ' ' + (i / (cols.length - 1) * end).toFixed(2) + '%').join(', ') + ')';
    },
    gradient() {
      const cols = ARTW[this.mode === 'dark' ? 'skyGradientNight' : 'skyGradientDay'];
      return Array.isArray(cols) && cols.length > 1 ? cols : null;
    },
    // The sky alone: the gradient fills the screen (as the canvas's CSS
    // background) and the canvas only draws what moves over it.
    buildSky(rnd, b) {
      const W = this.W, H = this.H, A = ARTW.animate || {}, night = this.mode === 'dark', cols = this.gradient();
      const top = this.paintHill(b, night);
      this.horizon = Math.min.apply(null, top);
      this.chimney = null;
      this.cv.style.background = 'linear-gradient(to bottom, ' +
        cols.map((c, i) => c + ' ' + (i / (cols.length - 1) * 100).toFixed(2) + '%').join(', ') + ')';
      this.clouds = night && !A.cloudsAtNight ? [] : Array.from({ length: SPR.clouds.length ? (A.cloudCount || 6) : Math.round(W / 42) + 4 }, (_, i) => {
        // At night the built-in clouds turn soft dusky lavender.
        const im = SPR.clouds.length ? SPR.clouds[i % SPR.clouds.length] : (night ? cloudSprite(16 + rnd() * 30, rnd, '#5A5296', '#433D7E') : cloudSprite(16 + rnd() * 30, rnd));
        return { img: im, x: rnd() * (W + 60), y: Math.round(rnd() * Math.max(1, Math.min(H * 0.8, this.horizon - 4) - im.height)), v: 0.5 + rnd() * 1.2 };
      });
      // Night: a starry sky. Day: a few soft sparkles between the clouds.
      this.stars = Array.from({ length: night ? Math.round((W * H) / 900) + 10 : Math.round((W * H) / 2800) + 6 }, () => {
        const x = Math.floor(rnd() * W), sky = top[x] - 4;   // stars stay above the hill
        return { x: x, y: 1 + Math.floor(rnd() * Math.max(1, sky)), ph: rnd() * 6.28, sp: 0.4 + rnd() * 1.4 };
      });
      this.shoot = null;
      this.nextShoot = performance.now() + 4000;
    },
    // One soft rolling hill along the bottom, like the old Windows XP wallpaper:
    // a broad crest left of centre, a lit edge, and a smooth gradient from the
    // grass colour to the shade colour toward the bottom. Returns the hill's
    // top row for each column.
    paintHill(b, night) {
      const W = this.W, H = this.H, pal = HILL[night ? 'night' : 'day'];
      const base = H * (H > W ? 0.86 : 0.8), rise = H * (H > W ? 0.07 : 0.11);
      const top = Array.from({ length: W }, (_, x) => {
        const u = x / W;
        return Math.round(base - rise * Math.exp(-Math.pow((u - 0.38) / 0.34, 2)) - H * 0.015 * Math.sin(u * 7.5 + 1.2));
      });
      const img = b.createImageData(W, H), d = img.data;
      const fill = hex(pal.fill), shade = hex(pal.shade), edge = hex(pal.edge);
      const crest = Math.min.apply(null, top);
      for (let x = 0; x < W; x++) for (let y = Math.max(0, top[x]); y < H; y++) {
        const t = Math.min(1, (y - crest) / Math.max(1, H - crest));   // one gradient for the whole hill
        const c = y === top[x] ? edge : fill.map((v, i) => Math.round(v + (shade[i] - v) * t));
        const k = (y * W + x) * 4;
        d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
      }
      b.putImageData(img, 0, 0);
      return top;
    },
    drawOwn(g, sec, t) {
      for (const c of this.clouds) {
        const span = this.W + c.img.width * 2;
        g.drawImage(c.img, Math.round((((c.x + sec * c.v) % span) + span) % span - c.img.width), c.y);
      }
      g.fillStyle = '#FFFFFF';
      for (const s of this.stars) {
        const v = 0.5 + 0.5 * Math.sin(sec * s.sp + s.ph);
        if (twinkle()) { sprite(g, twinkle(), s.x, s.y, 0.35 + 0.65 * v); continue; }
        g.globalAlpha = 0.4 + 0.6 * v;
        g.fillRect(s.x, s.y, 1, 1);
        if (v > 0.8) { g.fillRect(s.x - 1, s.y, 3, 1); g.fillRect(s.x, s.y - 1, 1, 3); }
      }
      g.globalAlpha = 1;
      drawSmoke(g, sec, this.chimney, null);
      if (this.mode === 'dark' && (SPR.shootingStar || this.skyOnly)) this.drawShootingStar(g, t);
    },
    buildDay(b, rnd) {
      const W = this.W, H = this.H, m = Math.min(W, H);
      const horizon = Math.round(H * (H > W ? 0.78 : 0.74));
      this.horizon = horizon;
      const img = b.createImageData(W, H);
      const sky = ditherSky(b, W, horizon, ['#BBD7FF', '#D6CBFF', '#FFCFE6', '#FFDCCF', '#FFF0CB']);
      img.data.set(sky.data);
      this.chimney = paintLand(img, W, H, horizon, LAND.day, rng(9));
      b.putImageData(img, 0, 0);
      this.clouds = [];
      const count = Math.round(W / 42) + 4;
      for (let i = 0; i < count; i++) {
        const cloudImg = SPR.clouds.length ? SPR.clouds[i % SPR.clouds.length] : cloudSprite(16 + rnd() * 30, rnd);
        this.clouds.push({ img: cloudImg, x: rnd() * (W + 60), y: Math.round(rnd() * Math.max(1, horizon - cloudImg.height - 4)), v: 0.5 + rnd() * 1.2 });
      }
      this.clouds.sort((p, q) => p.img.width - q.img.width);
      this.sparkles = Array.from({ length: Math.round((W * H) / 2800) + 6 }, () => ({
        x: Math.floor(rnd() * W), y: Math.floor(rnd() * (horizon - 6)), ph: rnd() * 6.28, sp: 0.6 + rnd() * 1.1
      }));
    },
    // Night: a starry gradient sky over a lake, mountains and green hills,
    // with a little cabin whose chimney smokes. Everything is drawn here, pixel by pixel.
    buildNight(b, rnd) {
      const W = this.W, H = this.H;
      const img = b.createImageData(W, H), d = img.data;
      const horizon = Math.round(H * (H > W ? 0.78 : 0.74));
      const lakeEnd = Math.round(horizon + H * 0.05);
      // sky: navy at the top, through indigo and violet, to a glowing purple horizon
      const stops = ['#0B0A1D', '#15143A', '#24235E', '#3A3794', '#5338AE', '#7432BA', '#9132C6'].map(hex), n = stops.length - 1;
      for (let y = 0; y < horizon; y++) {
        const tt = Math.pow(y / Math.max(1, horizon - 1), 0.9) * n, i = Math.min(n - 1, Math.floor(tt)), f = tt - i;
        for (let x = 0; x < W; x++) {
          const c = f > (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 ? stops[i + 1] : stops[i], k = (y * W + x) * 4;
          d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
        }
      }
      this.chimney = paintLand(img, W, H, horizon, LAND.night, rnd);
      b.putImageData(img, 0, 0);
      // stars: a few big glowing sparkles, many small ones, a sprinkle of colour
      this.horizon = horizon;
      this.stars = Array.from({ length: Math.round((W * horizon) / 260) + 12 }, () => {
        const roll = rnd();
        return { x: Math.floor(rnd() * W), y: Math.floor(rnd() * (horizon - 4)), ph: rnd() * 6.28, sp: 0.4 + rnd() * 1.4,
          c: roll > 0.93 ? '#7CF0A0' : roll > 0.86 ? '#FF9BE0' : roll > 0.55 ? '#FFFFFF' : '#9C9CD8', big: rnd() > 0.965 };
      });
      this.clouds = []; this.cstars = []; this.smoke = [];
      this.shoot = null;
      this.nextShoot = performance.now() + 4000;
    },
    setRunning(on) {
      this.run = on;
      cancelAnimationFrame(this.raf);
      this.draw(performance.now());
      if (!on) return;
      const tick = (t) => {
        if (t - this.last >= 50) { this.last = t; this.draw(t); }
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    },
    draw(t) {
      if (!this.bg) return;
      const g = this.g;
      g.globalAlpha = 1;
      g.clearRect(0, 0, this.W, this.H);
      g.drawImage(this.bg, 0, 0);
      const sec = this.run ? t / 1000 : 0;
      if (this.own) this.drawOwn(g, sec, t);
      else if (this.mode === 'dark') this.drawNight(g, sec, t); else this.drawDay(g, sec);
    },
    drawDay(g, sec) {
      drawSmoke(g, sec, this.chimney, '#FFFFFF');
      for (const c of this.clouds) {
        const span = this.W + c.img.width * 2;
        const x = Math.round((((c.x + sec * c.v) % span) + span) % span - c.img.width);
        g.drawImage(c.img, x, c.y);
      }
      g.fillStyle = '#FFFFFF';
      for (const s of this.sparkles) {
        const v = Math.sin(sec * s.sp + s.ph);
        if (v < -0.2) continue;
        if (twinkle()) { sprite(g, twinkle(), s.x, s.y, 0.3 + 0.6 * v); g.globalAlpha = 1; continue; }
        g.fillRect(s.x, s.y, 1, 1);
        if (v > 0.55) { g.fillRect(s.x - 1, s.y, 3, 1); g.fillRect(s.x, s.y - 1, 1, 3); }
        if (v > 0.9) { g.fillRect(s.x - 2, s.y, 5, 1); g.fillRect(s.x, s.y - 2, 1, 5); }
      }
    },
    drawNight(g, sec, t) {
      for (const s of this.stars) {
        const a = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(sec * s.sp + s.ph));
        if (twinkle()) { sprite(g, twinkle(), s.x, s.y, a); continue; }
        g.fillStyle = s.c;
        if (s.big) {
          g.globalAlpha = 0.25 * a; g.fillRect(s.x - 1, s.y - 1, 3, 3);            // soft glow
          g.globalAlpha = a; g.fillRect(s.x - 2, s.y, 5, 1); g.fillRect(s.x, s.y - 2, 1, 5);
          if (a > 0.85) { g.globalAlpha = a * 0.6; g.fillRect(s.x - 3, s.y, 7, 1); g.fillRect(s.x, s.y - 3, 1, 7); }
        } else { g.globalAlpha = a; g.fillRect(s.x, s.y, 1, 1); }
      }
      drawSmoke(g, sec, this.chimney, '#6E5E66');
      this.drawShootingStar(g, t);
    },
    drawShootingStar(g, t) {
      if (!this.run) return;
      if (!this.shoot && t > this.nextShoot) {
        this.shoot = { x: this.W * (0.45 + Math.random() * 0.5), y: (this.horizon || this.H) * Math.random() * 0.35, vx: -(55 + Math.random() * 30), vy: 22 + Math.random() * 14, born: t };
      }
      if (this.shoot) {
        const s = this.shoot, age = (t - s.born) / 1000;
        if (age > 0.9) { this.shoot = null; this.nextShoot = t + 7000 + Math.random() * 9000; return; }
        const hx = s.x + s.vx * age, hy = s.y + s.vy * age;
        if (SPR.shootingStar) { sprite(g, SPR.shootingStar, hx, hy, 1 - age / 0.9); g.globalAlpha = 1; return; }
        for (let i = 0; i < 14; i++) {
          g.globalAlpha = (1 - i / 14) * (1 - age / 0.9);
          g.fillStyle = i < 2 ? '#FFFFFF' : '#CFE0FF';
          g.fillRect(Math.round(hx - (s.vx / 60) * i), Math.round(hy - (s.vy / 60) * i), 1, 1);
        }
        g.globalAlpha = 1;
      }
    }
  };

  /* ---------- windows ---------- */
  const iconsRightEl = $('#icons-right');
  const winLayer = $('#windows'), iconsEl = $('#icons'), mainEl = $('#main'), chatHead = $('#chat-head'), heroEl = $('.hero');
  /* Window types. A new layout is one builder function plus one entry here;
     WINDOWS in content.js decides which windows exist. */
  const TYPES = {
    about: { build: buildAbout, onOpen: updateTimes, status: () => ['Updated ' + PROFILE.updated] },
    work: { build: buildWork, status: () => [PROJ.length + (PROJ.length === 1 ? ' case study' : ' case studies')] },
    cv: { build: buildCV, status: () => ['Updated ' + CV.updated] },
    messages: { build: buildChat, place: 'right', noHash: true, status: () => [] },
    page: { build: buildPage, status: (win) => (win.status ? [win.status] : []) },
    goals: { build: buildGoals, status: () => [countGoals() + ' items'] },
    affirmations: { build: buildAffirmations, status: () => [((typeof AFFIRMATIONS !== 'undefined' && AFFIRMATIONS) || []).length + ' notes'] }
  };
  const RESERVED = ['settings', 'sidebar', 'customize', 'upgrade', 'downloads', 'main'];
  const DEFS = {};
  (typeof WINDOWS !== 'undefined' ? WINDOWS : []).forEach((win) => {
    const type = TYPES[win.type];
    if (!type || !win.id || DEFS[win.id]) { console.warn('Skipped window: check its id and type', win); return; }
    if (win.type === 'messages' && SITE.chat === false) return;
    let iconName = PIX[win.icon] ? win.icon : 'case';
    if (win.iconImage) { iconName = 'img-' + win.id; ICON_IMAGES[iconName] = win.iconImage; }
    DEFS[win.id] = {
      title: win.title || win.id, icon: iconName, hue: hueOf(win.color), side: win.side === 'right' ? 'right' : 'left',
      hash: type.noHash || RESERVED.indexOf(win.id) > -1 ? null : win.id,
      size: [win.width || 40, win.height || 38], place: type.place,
      build: (w) => type.build(w, win), onOpen: type.onOpen,
      status: () => type.status(win),
      menu: win.menu !== false, desktop: win.desktop !== false
    };
  });
  const DESKTOP = Object.keys(DEFS).filter((id) => DEFS[id].desktop && DEFS[id].side === 'left').map((id) => [id, DEFS[id].title]);
  const DESKTOP_RIGHT = Object.keys(DEFS).filter((id) => DEFS[id].desktop && DEFS[id].side === 'right').map((id) => [id, DEFS[id].title]);
  const MENU = Object.keys(DEFS).filter((id) => DEFS[id].menu).map((id) => [id, DEFS[id].title]);
  const has = (id) => !!getDef(id);
  function getDef(id) {
    if (DEFS[id]) return DEFS[id];
    const p = PROJ.find((x) => 'case-' + x.id === id);
    if (!p) return null;
    return {
      title: p.title, srSuffix: ', case study', icon: 'case', hue: hueOf(p.color), hash: 'case-' + p.id, size: [56, 48],
      build: (w) => buildCase(w, p), status: () => [(p.draft ? 'Draft case study' : 'Case study') + (p.year ? ', ' + p.year : ''), p.role]
    };
  }
  const visible = (el) => !!el && el.isConnected && el.getClientRects().length > 0 && !el.closest('[inert], [hidden]');

  const WM = {
    wins: new Map(), z: 20, active: null, cascade: 0,
    area() { const r = winLayer.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; },
    gutter() {
      if (isSmall()) return 0;
      const r = iconsEl.getBoundingClientRect();
      return Math.max(0, r.right - this.area().x) + 8;
    },
    rightGutter() {
      if (isSmall() || iconsRightEl.parentNode.hidden) return 0;
      const r = iconsRightEl.getBoundingClientRect();
      return Math.max(0, this.area().x + this.area().w - r.left);
    },
    isOpen(id) { const w = this.wins.get(id); return !!w && !w.el.hidden; },
    ensure(id) {
      if (this.wins.has(id)) return this.wins.get(id);
      const def = getDef(id);
      if (!def) return null;
      const el = document.createElement('section');
      el.className = 'window';
      el.id = 'win-' + id;
      el.hidden = true;
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-labelledby', 'win-' + id + '-title');
      el.style.setProperty('--hue', 'var(--' + def.hue + ')');
      el.style.setProperty('--hue-d', 'var(--' + def.hue + '-d)');
      el.style.setProperty('--px-hue', 'var(--px-' + def.hue + ')');
      const t = esc(def.title);
      el.innerHTML =
        '<div class="titlebar">' +
          '<h2 class="win-title" id="win-' + id + '-title">' + icon(def.icon) + '<span>' + t + '</span>' + (def.srSuffix ? '<span class="sr-only">' + esc(def.srSuffix) + '</span>' : '') + '</h2>' +
          '<span class="titlebar-fill" aria-hidden="true"></span>' +
          '<button type="button" class="win-btn win-move" aria-label="Move ' + t + ' window" aria-describedby="move-hint" data-sound="none">' + glyph('move') + '</button>' +
          '<button type="button" class="win-btn win-zoom" aria-label="Maximize ' + t + '" data-sound="none">' + glyph('zoom') + '</button>' +
          '<button type="button" class="win-btn win-close" aria-label="Close ' + t + '" data-sound="none">' + glyph('close') + '</button>' +
        '</div>' +
        '<div class="win-body" id="win-' + id + '-body" tabindex="-1"></div>' +
        '<p class="win-status"></p>';
      winLayer.appendChild(el);
      const w = { id, def, el, body: $('.win-body', el), x: 0, y: 0, w: 0, h: 0, placed: false, max: false, opener: null, opening: false, suppressClick: false };
      this.wins.set(id, w);
      def.build(w);
      // A window with nothing to tab to still needs to scroll from the keyboard.
      if (!w.body.querySelector('a[href], button, input, select, textarea, [tabindex="0"]')) {
        w.body.tabIndex = 0;
        w.body.setAttribute('role', 'region');
        w.body.setAttribute('aria-labelledby', 'win-' + id + '-title');
      }
      $('.win-status', el).innerHTML = (def.status ? def.status() : []).map((s) => '<span>' + esc(s) + '</span>').join('');
      this.wire(w);
      resizeObs.observe(el);
      return w;
    },
    wire(w) {
      const el = w.el, tb = $('.titlebar', el), mv = $('.win-move', el);
      el.addEventListener('pointerdown', () => this.focus(w.id), true);
      el.addEventListener('focusin', () => this.focus(w.id));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !e.defaultPrevented) { e.preventDefault(); this.close(w.id); }
      });
      tb.addEventListener('pointerdown', (e) => this.dragStart(e, w));
      tb.addEventListener('dblclick', (e) => { if (!e.target.closest('button') && !isSmall()) this.setMax(w, !w.max, true); });
      $('.win-close', el).addEventListener('click', () => this.close(w.id));
      $('.win-zoom', el).addEventListener('click', () => this.setMax(w, !w.max, true));
      mv.addEventListener('click', () => { if (w.suppressClick) return; this.center(w); Sound.play('zoom'); });
      mv.addEventListener('keydown', (e) => this.keyMove(e, w));
    },
    place(w) {
      const A = this.area(), rem = remPx(), g = this.gutter(), d = w.def;
      let W = Math.min(d.size[0] * rem, A.w - g - 24), H = Math.min(d.size[1] * rem, A.h - 32);
      W = Math.max(W, Math.min(17 * rem, A.w - 16));
      H = Math.max(H, Math.min(12 * rem, A.h - 16));
      let x, y;
      if (d.place === 'right') { x = A.w - W - 24 - this.rightGutter(); y = A.h - H - 20; }
      else { const k = this.cascade++ % 5; x = g + 16 + k * 28; y = 14 + k * 24; }
      Object.assign(w, { x: Math.round(x), y: Math.round(y), w: Math.round(W), h: Math.round(H) });
      this.keepInside(w);
    },
    keepInside(w) {
      const A = this.area();
      w.w = Math.min(w.w, A.w); w.h = Math.min(w.h, A.h);
      w.x = clamp(w.x, 0, Math.max(0, A.w - w.w));
      w.y = clamp(w.y, 0, Math.max(0, A.h - w.h));
    },
    keepReachable(w) {
      const A = this.area();
      w.x = clamp(w.x, -(w.w - 96), A.w - 96);
      w.y = clamp(w.y, 0, A.h - 40);
    },
    applyPos(w) { w.el.style.left = w.x + 'px'; w.el.style.top = w.y + 'px'; },
    apply(w) { this.applyPos(w); w.el.style.width = w.w + 'px'; w.el.style.height = w.h + 'px'; },
    screenRect(w) {
      const A = this.area();
      if (w.max) return { left: A.x, top: A.y, width: A.w, height: A.h };
      return { left: A.x + w.x, top: A.y + w.y, width: w.w, height: w.h };
    },
    originRect(id, opener) {
      let el = visible(opener) ? opener : null;
      if (!el) el = $('[data-icon-for="' + id + '"]');
      if (!visible(el)) el = id === 'messages' && visible(chatHead) ? chatHead : null;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: r.left, top: r.top, width: r.width, height: r.height };
    },
    zoomRect(from, to) {
      if (!from || !to || !document.body.animate) return Promise.resolve();
      const d = document.createElement('div');
      d.className = 'zoom-rect';
      d.setAttribute('aria-hidden', 'true');
      document.body.appendChild(d);
      const f = (r) => ({ left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
      const a = d.animate([f(from), f(to)], { duration: 220, easing: 'steps(6, end)', fill: 'forwards' });
      return a.finished.catch(() => {}).then(() => d.remove());
    },
    async open(id, opts) {
      opts = opts || {};
      const w = this.ensure(id);
      if (!w || w.opening) return;
      const opener = opts.opener === undefined ? document.activeElement : opts.opener;
      const moveFocus = opts.focus !== false;
      if (!w.el.hidden) {
        if (opts.sound !== false) Sound.play('click');
        this.focus(id, { moveFocus });
        return;
      }
      w.opener = opener && opener !== document.body ? opener : null;
      if (!w.placed) { this.place(w); w.placed = true; } else this.keepInside(w);
      this.apply(w);
      if (w.def.onOpen) w.def.onOpen(w);
      if (opts.sound !== false) Sound.play(opts.sound || 'open');
      if (opts.animate !== false && motionOK() && !isSmall()) {
        const from = this.originRect(id, opener);
        if (from) { w.opening = true; await this.zoomRect(from, this.screenRect(w)); w.opening = false; }
      }
      w.el.hidden = false;
      this.focus(id, { moveFocus, keepHash: opts.keepHash });
      syncDesktop();
    },
    close(id, opts) {
      opts = opts || {};
      const w = this.wins.get(id);
      if (!w || w.el.hidden) return;
      const hadFocus = w.el.contains(document.activeElement);
      const rect = this.screenRect(w);
      w.el.hidden = true;
      w.el.classList.remove('is-active', 'is-top');
      if (this.active === w) this.active = null;
      if (!opts.silent) {
        Sound.play('close');
        if (motionOK() && !isSmall()) this.zoomRect(rect, this.originRect(id, null));
      }
      const next = this.topmost();
      this.updateTop();
      syncDesktop();
      if (next) this.focus(next.id, { keepHash: true });
      setHash(next && next.def.hash ? next.def.hash : '');
      if (hadFocus && opts.returnFocus !== false) {
        const op = w.opener;
        if (visible(op)) op.focus({ preventScroll: true });
        else if (next) next.body.focus({ preventScroll: true });
        else {
          const ic = $('[data-icon-for="' + id + '"]');
          (visible(ic) ? ic : mainEl).focus({ preventScroll: true });
        }
      }
    },
    focus(id, opts) {
      opts = opts || {};
      const w = this.wins.get(id);
      if (!w || w.el.hidden) return;
      if (this.active !== w) {
        if (this.active) this.active.el.classList.remove('is-active');
        w.el.classList.add('is-active');
        this.active = w;
      }
      if (Number(w.el.style.zIndex) !== this.z) w.el.style.zIndex = String(++this.z);
      this.updateTop();
      if (opts.moveFocus) w.body.focus({ preventScroll: true });
      if (w.def.hash && !opts.keepHash) setHash(w.def.hash);
    },
    topmost() {
      let top = null;
      this.wins.forEach((w) => { if (!w.el.hidden && (!top || Number(w.el.style.zIndex) > Number(top.el.style.zIndex))) top = w; });
      return top;
    },
    updateTop() {
      const top = this.topmost(), small = isSmall();
      this.wins.forEach((w) => {
        w.el.classList.toggle('is-top', w === top);
        w.el.inert = small && !w.el.hidden && w !== top;
      });
      // On small screens an open window covers the page, so the page behind it rests.
      heroEl.inert = small && !!top;
      iconsEl.inert = small && !!top;
      iconsRightEl.inert = small && !!top;
      document.body.classList.toggle('has-sheet', small && !!top);
    },
    setMax(w, v, sound) {
      w.max = v;
      w.el.classList.toggle('is-max', v);
      const b = $('.win-zoom', w.el);
      b.setAttribute('aria-label', (v ? 'Restore ' : 'Maximize ') + w.def.title);
      b.innerHTML = glyph(v ? 'restore' : 'zoom');
      if (sound) Sound.play('zoom');
    },
    center(w) {
      if (w.max || isSmall()) return;
      const A = this.area();
      w.x = Math.round((A.w - w.w) / 2); w.y = Math.round((A.h - w.h) / 2);
      this.keepInside(w); this.applyPos(w);
    },
    dragStart(e, w) {
      if (e.button !== 0 || isSmall() || w.max) return;
      const btn = e.target.closest('button');
      if (btn && !btn.classList.contains('win-move')) return;
      if (!btn) e.preventDefault();
      const sx = e.clientX, sy = e.clientY, ox = w.x, oy = w.y, tb = e.currentTarget;
      let moved = false;
      const move = (ev) => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!moved && Math.abs(dx) + Math.abs(dy) < 4) return;
        if (!moved) { moved = true; tb.classList.add('is-dragging'); document.body.classList.add('is-dragging'); }
        w.x = ox + dx; w.y = oy + dy;
        this.keepReachable(w); this.applyPos(w);
      };
      const up = () => {
        removeEventListener('pointermove', move);
        removeEventListener('pointerup', up);
        removeEventListener('pointercancel', up);
        tb.classList.remove('is-dragging');
        document.body.classList.remove('is-dragging');
        if (moved) { w.suppressClick = true; setTimeout(() => { w.suppressClick = false; }, 0); Sound.play('drop'); }
      };
      addEventListener('pointermove', move);
      addEventListener('pointerup', up);
      addEventListener('pointercancel', up);
    },
    keyMove(e, w) {
      const step = e.shiftKey ? 64 : 16;
      let dx = 0, dy = 0;
      if (e.key === 'ArrowLeft') dx = -step;
      else if (e.key === 'ArrowRight') dx = step;
      else if (e.key === 'ArrowUp') dy = -step;
      else if (e.key === 'ArrowDown') dy = step;
      else return;
      e.preventDefault();
      if (w.max || isSmall()) return;
      w.x += dx; w.y += dy;
      this.keepInside(w); this.applyPos(w);
    },
    reflow() {
      if (isSmall()) return;
      this.wins.forEach((w) => { if (!w.el.hidden) { this.keepInside(w); this.apply(w); } });
    }
  };
  const resizeObs = new ResizeObserver((entries) => {
    entries.forEach((en) => {
      const w = Array.from(WM.wins.values()).find((x) => x.el === en.target);
      if (!w || w.el.hidden || w.max || w.opening || isSmall()) return;
      const r = w.el.getBoundingClientRect();
      if (r.width) { w.w = Math.round(r.width); w.h = Math.round(r.height); }
    });
  });

  function setHash(name) {
    try {
      const cur = location.hash.slice(1);
      if ((name || '') === cur) return;
      history.replaceState(null, '', name ? '#' + name : location.pathname + location.search);
    } catch (e) { /* the frame may not allow it */ }
  }
  function hashTarget() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return null;
    if (DEFS[h] && DEFS[h].hash === h) return h;
    if (h.indexOf('case-') === 0 && PROJ.some((p) => 'case-' + p.id === h)) return h;
    return null;
  }
  function syncDesktop() {
    $$('[data-icon-for]').forEach((b) => {
      const open = WM.isOpen(b.dataset.iconFor);
      b.classList.toggle('is-open', open);
      $('.icon-state', b).textContent = open ? ', window open' : '';
    });
    chatHead.hidden = !has('messages') || WM.isOpen('messages');
  }

  /* ---------- shared bits of markup ---------- */
  function avatarHTML(cls) {
    const p = PROFILE.photo || {};
    if (p.src) return '<img class="' + cls + '" src="' + esc(p.src) + '" alt="' + (cls === 'monogram' ? esc(p.alt || PROFILE.name) : '') + '">';
    return '<span class="' + cls + '" aria-hidden="true">' + esc(PROFILE.initials) + '</span>';
  }
  function extLink(l, cls) {
    return '<a' + (cls ? ' class="' + cls + '"' : '') + ' href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' +
      esc(l.label) + '<span class="sr-only"> (opens in a new tab)</span>' + glyph('ext') + '</a>';
  }
  const mailto = () => '<a href="mailto:' + esc(PROFILE.email) + '">' + esc(PROFILE.email) + '</a>';
  const linkEmail = (html) => html.split(esc(PROFILE.email)).join(mailto());
  function updateTimes() { $$('[data-localtime]').forEach((n) => { n.textContent = localTime(); }); }

  /* ---------- About ---------- */
  function buildAbout(w) {
    w.body.innerHTML =
      '<div class="about">' +
        '<div class="about-hero">' + avatarHTML('monogram') +
          '<div><p class="about-name">' + esc(PROFILE.name) + '</p><p class="about-role">' + esc(PROFILE.role) + '</p></div>' +
        '</div>' +
        '<dl class="facts">' +
          '<div><dt>Based in</dt><dd>' + esc(PROFILE.location) + '</dd></div>' +
          '<div><dt>My local time</dt><dd data-localtime>' + esc(localTime()) + '</dd></div>' +
          '<div><dt>Status</dt><dd>' + esc(PROFILE.availability) + '</dd></div>' +
        '</dl>' +
        '<div class="prose">' + PROFILE.bio.map((p, i) => '<p' + (i === 0 ? ' class="lead"' : '') + '>' + esc(p) + '</p>').join('') + '</div>' +
        '<div class="about-fun">' +
          ((PROFILE.languages || []).length ? '<section class="fun-box" aria-labelledby="about-langs"><h3 id="about-langs">Languages</h3><ul class="lang-list">' +
            PROFILE.languages.map((l) => '<li>' + (l.signed
                ? '<span class="hello hello-signed">' + glyph('hand') + '<span>' + esc(l.greeting || 'Signed') + '</span></span>'
                : l.greeting ? '<span class="hello"' + (l.lang ? ' lang="' + esc(l.lang) + '"' : '') + '>' + esc(l.greeting) + '</span>'
                : '<span class="hello hello-more">' + glyph('sparkle') + '</span>') +
              '<span class="lang-name">' + esc(l.name) + '</span><span class="lang-level">' + esc(l.level) + '</span></li>').join('') + '</ul></section>' : '') +
          ((PROFILE.hobbies || []).length ? '<section class="fun-box" aria-labelledby="about-hobbies"><h3 id="about-hobbies">Outside of work</h3>' +
            (PROFILE.hobbiesIntro ? '<p>' + esc(PROFILE.hobbiesIntro) + '</p>' : '') + '<ul class="stickers">' +
            PROFILE.hobbies.map((h) => '<li>' + esc(h) + '</li>').join('') + '</ul>' +
            (PROFILE.talkAbout ? '<p class="talk-about">' + esc(PROFILE.talkAbout) + '</p>' : '') + '</section>' : '') +
        '</div>' +
        ((PROFILE.values || []).length ? '<h3>What I care about</h3><div class="prose">' + PROFILE.values.map((v) => '<p>' + esc(v) + '</p>').join('') + '</div>' : '') +
        '<h3>How I work</h3>' +
        '<ul class="pixel-list">' + PROFILE.strengths.map((s) => '<li><h4>' + esc(s.title) + '</h4><p>' + esc(s.text) + '</p></li>').join('') + '</ul>' +
        '<h3>Get in touch</h3>' +
        '<p class="contact-line">' + mailto() + '<button type="button" class="btn btn-small" data-copy="email">Copy email</button></p>' +
        '<ul class="link-row">' + PROFILE.links.map((l) => '<li>' + extLink(l) + '</li>').join('') + '</ul>' +
        ctaButtons([{ label: 'See my work', open: 'work', primary: true }, { label: 'Read my CV', open: 'cv' }], 'cta-row') +
        '<h3>Accessibility</h3>' +
        '<div class="prose">' +
          '<p>This site is designed to meet WCAG 2.2 Level AA, which covers the web requirements of Ontario’s AODA (WCAG 2.0 Level AA). Sound and animation can be switched off in the top bar.</p>' +
          '<dl class="keys">' +
            '<div><dt><kbd>Tab</kbd></dt><dd>Moves between buttons, links and windows. <kbd>Shift</kbd> + <kbd>Tab</kbd> goes back.</dd></div>' +
            '<div><dt><kbd>Enter</kbd></dt><dd>Opens a window or presses a button.</dd></div>' +
            '<div><dt><kbd>Esc</kbd></dt><dd>Closes the window you’re in and returns you to where you were.</dd></div>' +
            '<div><dt>Arrow keys</dt><dd>Move a window while its move button is focused. Hold <kbd>Shift</kbd> to move further.</dd></div>' +
          '</dl>' +
          '<p>Found a barrier, or need my work in another format? Email ' + mailto() + ' and I’ll reply within two working days.</p>' +
        '</div>' +
      '</div>';
    // keep the definition rows valid: dt/dd pairs wrapped in div
    $$('.keys > div', w.body).forEach((d) => { d.style.display = 'contents'; });
  }

  function ctaButtons(list, cls) {
    const items = (list || []).filter((b) => has(b.open));
    if (!items.length) return '';
    return '<div class="' + cls + '">' + items.map((b) => '<button type="button" class="btn' + (b.primary ? ' btn-primary' : '') + '" data-open="' + esc(b.open) + '" data-sound="none">' + esc(b.label) + '</button>').join('') + '</div>';
  }
  const pdfLink = (cls) => '<a class="' + cls + '" href="' + esc(CV.pdf) + '" target="_blank" rel="noopener">Download my CV (PDF)<span class="sr-only"> (opens in a new tab)</span></a>';

  /* ---------- simple "page" windows (type: "page" in WINDOWS) ---------- */
  function buildPage(w, win) {
    const hue = hueOf(win.color);
    w.body.innerHTML = '<article class="case" style="--hue: var(--' + hue + '); --hue-d: var(--' + hue + '-d); --px-hue: var(--px-' + hue + ');">' +
      (win.sections || []).map(sectionHTML).join('') + '</article>';
  }

  /* ---------- Goals ---------- */
  const goalGroups = () => ((typeof GOALS !== 'undefined' && GOALS.groups) || []);
  const countGoals = () => goalGroups().reduce((n, g) => n + (g.items || []).length, 0);
  function buildGoals(w) {
    w.body.innerHTML = '<div class="goal-groups">' +
      (GOALS.intro ? '<p class="work-intro">' + esc(GOALS.intro) + '</p>' : '') +
      goalGroups().map((g) => '<section class="goal-group"><h3>' + esc(g.title) + '</h3><ul class="pixel-list">' +
        (g.items || []).map((it) => '<li><h4>' + esc(it.title) + '</h4>' + (it.text ? '<p>' + esc(it.text) + '</p>' : '') +
          (it.link && it.link.url ? '<p>' + extLink(it.link) + '</p>' : '') + '</li>').join('') +
      '</ul></section>').join('') + '</div>';
  }

  /* ---------- Affirmations: one random sticky note at a time ---------- */
  const NOTE_COLOURS = ['butter', 'pink', 'mint', 'sky', 'lilac', 'peach'];
  function buildAffirmations(w) {
    const list = (typeof AFFIRMATIONS !== 'undefined' && AFFIRMATIONS) || [];
    let last = -1, turn = 0;
    w.body.innerHTML = '<div class="affirm"><p class="affirm-intro">A little note for you. Take one, or take a few.</p>' +
      '<div class="sticky" aria-live="polite"><p class="sticky-text"></p></div>' +
      '<div class="cta-row"><button type="button" class="btn btn-primary affirm-next" data-sound="none">Show another note</button></div></div>';
    const note = $('.sticky', w.body), text = $('.sticky-text', w.body);
    const show = (animate) => {
      if (!list.length) { text.textContent = 'Notes are on their way.'; return; }
      let i = Math.floor(Math.random() * list.length);
      if (list.length > 1 && i === last) i = (i + 1) % list.length;
      last = i; turn++;
      text.textContent = fill(list[i]);
      note.style.setProperty('--note', 'var(--px-' + NOTE_COLOURS[turn % NOTE_COLOURS.length] + ')');
      const tilt = (turn % 2 ? -2 : 1.5) + 'deg';
      note.style.setProperty('--tilt', tilt);
      if (animate && motionOK() && note.animate) note.animate([{ transform: 'rotate(' + tilt + ') translateY(-10px) scale(.96)', opacity: 0.4 }, { transform: 'rotate(' + tilt + ')', opacity: 1 }], { duration: 220, easing: 'steps(4, end)' });
    };
    show(false);
    $('.affirm-next', w.body).addEventListener('click', () => { show(true); Sound.play('page'); });
  }

  /* ---------- Work ---------- */
  const MOCKS = {
    editorial: () =>
      '<div class="mk-browser"><div class="mk-bar"><i></i><i></i><i></i><span class="mk-url"></span></div>' +
      '<div class="mk-ed"><div class="mk-ed-head"><span class="mk-ed-nav"><i></i><i></i><i></i></span><span class="mk-ed-big">Art</span>' +
      '<span class="mk-row dark"></span><span class="mk-row short"></span></div><div class="mk-ed-tiles"><i></i><i></i><i></i></div></div></div>',
    desktop: () =>
      '<div class="mk-desk"><span class="mk-desk-bar"></span><span class="mk-desk-icons"><i></i><i></i><i></i></span>' +
      '<div class="mk-win mk-win-a"><span class="mk-win-title"></span><span class="mk-line2"></span><span class="mk-line2 s"></span><span class="mk-btn2"></span></div>' +
      '<div class="mk-win mk-win-b"><span class="mk-win-title"></span><span class="mk-bubble"></span><span class="mk-bubble r"></span></div></div>',
    extension: () =>
      '<div class="mk-browser"><div class="mk-bar"><i></i><i></i><i></i><span class="mk-url"></span><span class="mk-ext"></span></div>' +
      '<div class="mk-article"><span class="mk-row dark"></span><span class="mk-row"></span><span class="mk-row"></span><span class="mk-row short"></span><span class="mk-img"></span></div></div>' +
      '<div class="mk-popup"><span class="mk-search"></span><span class="mk-bm"><i></i><b></b></span><span class="mk-bm"><i></i><b></b></span>' +
      '<span class="mk-bm"><i></i><b></b></span><span class="mk-bm"><i></i><b></b></span><span class="mk-chiprow"><i></i><i></i><i></i></span></div>',
    shop: () =>
      '<div class="mk-phone"><div class="mk-screen mk-shop"><span class="mk-shop-bar"></span><span class="mk-grid"><i></i><i></i><i></i><i></i></span>' +
      '<span class="mk-line w70" style="background:#2B2145"></span><span class="mk-pill"></span></div></div>' +
      '<div class="mk-card mk-card-a mk-shades"><i></i><i></i><i></i><i></i><i></i></div>' +
      '<div class="mk-card mk-card-b"><span class="mk-ico"></span><span class="mk-lines"><i></i><i></i></span></div>',
    phone: () =>
      '<div class="mk-phone"><div class="mk-screen"><span class="mk-status"></span><span class="mk-moon"></span>' +
      '<span class="mk-line w70"></span><span class="mk-line w45"></span><span class="mk-ring"><span></span></span>' +
      '<span class="mk-pill"></span><span class="mk-nav"><i></i><i></i><i></i></span></div></div>' +
      '<div class="mk-card mk-card-a"><span class="mk-ico"></span><span class="mk-lines"><i></i><i></i></span></div>' +
      '<div class="mk-card mk-card-b"><span class="mk-bars"><i></i><i></i><i></i><i></i><i></i></span></div>',
    browser: () =>
      '<div class="mk-browser"><div class="mk-bar"><i></i><i></i><i></i><span class="mk-url"></span></div>' +
      '<div class="mk-page"><div class="mk-side"><span class="mk-toggle"><i></i></span><span class="mk-row dark"></span>' +
      '<span class="mk-row"></span><span class="mk-row short"></span><span class="mk-stop"><i></i><b></b></span><span class="mk-stop"><i></i><b></b></span></div>' +
      '<div class="mk-map"><svg viewBox="0 0 100 70" preserveAspectRatio="none"><path class="road" d="M0 52 L28 40 L48 48 L72 18 L100 8"/>' +
      '<path class="route" d="M8 60 L30 44 L46 50 L70 22 L92 12"/></svg><i class="mk-pin a"></i><i class="mk-pin b"></i><i class="mk-pin c"></i></div></div></div>',
    system: () =>
      '<div class="mk-sheet"><div class="mk-swatches"><i></i><i></i><i></i><i></i><i></i></div><div class="mk-type">Aa</div>' +
      '<div class="mk-stack"><span class="mk-b1"></span><span class="mk-b2"></span></div>' +
      '<div class="mk-controls"><span class="mk-switch"><i></i></span><span class="mk-check"></span><span class="mk-radio"></span><span class="mk-field"></span></div></div>' +
      '<div class="mk-card mk-card-c"><span class="mk-token"><i></i><b></b></span><span class="mk-token"><i></i><b></b></span><span class="mk-token"><i></i><b></b></span></div>'
  };
  const tagsHTML = (p) => '<ul class="tags">' + (p.draft ? '<li class="tag-draft">Draft</li>' : '') +
    (p.tags || []).map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>';
  function coverHTML(p) {
    const c = p.cover || {};
    if (c.image) return '<figure class="cover"><img src="' + esc(c.image) + '" alt="' + esc(c.alt || '') + '"></figure>';
    // A text cover, like "Coming soon". Decorative: the same news is in the case study itself.
    if (c.text) return '<div class="cover cover-text" aria-hidden="true"><p>' + esc(c.text) + '</p></div>';
    return '<div class="cover" aria-hidden="true">' + (MOCKS[c.style] || MOCKS.phone)() + '</div>';
  }
  const hueVars = (p) => { const h = hueOf(p.color); return '--hue: var(--' + h + '); --hue-d: var(--' + h + '-d); --px-hue: var(--px-' + h + ');'; };
  function buildWork(w) {
    if (!PROJ.length) { w.body.innerHTML = '<p class="empty-note">New case studies are on their way. In the meantime, ask me anything in Messages.</p>'; return; }
    const years = PROJ.map((p) => parseInt(p.year, 10)).filter((n) => !isNaN(n));
    const range = years.length ? (Math.min.apply(null, years) === Math.max.apply(null, years) ? String(years[0]) : Math.min.apply(null, years) + '–' + Math.max.apply(null, years)) : '';
    w.body.innerHTML =
      '<p class="work-intro">Selected case studies' + (range ? ' from ' + range : '') + '. Open one to read the problem, the research and the results.</p>' +
      '<ul class="project-grid">' + PROJ.map((p) =>
        '<li class="project-card" style="' + hueVars(p) + '">' + coverHTML(p) +
          '<h3><button type="button" class="project-open" data-open="case-' + esc(p.id) + '" data-sound="none" aria-describedby="pc-' + esc(p.id) + '">' + esc(p.title) + '</button></h3>' +
          '<p class="project-sum" id="pc-' + esc(p.id) + '">' + esc(p.summary) + '</p>' +
          '<p class="project-meta">' + [p.year, p.role].filter(Boolean).map((t) => '<span>' + esc(t) + '</span>').join('') + '</p>' +
          tagsHTML(p) +
        '</li>').join('') + '</ul>';
  }

  /* ---------- Case study ---------- */
  // A picture in a case study. Each one is a button that opens the photo viewer,
  // so visitors can see sketches and screenshots full size.
  const hasSrc = (im) => !!(im && im.src);
  function shotHTML(im, group, idx, cls) {
    const alt = im.alt || im.caption || '';
    return '<figure class="' + (cls || 'case-figure') + '">' +
      '<button type="button" class="shot" data-view="' + esc(group) + '" data-view-i="' + idx + '" data-sound="none">' +
        '<img src="' + esc(im.src) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async">' +
        '<span class="sr-only">, view larger</span>' +
      '</button>' +
      (im.caption ? '<figcaption>' + esc(im.caption) + '</figcaption>' : '') +
    '</figure>';
  }
  let shotGroups = 0;
  const SHOTS = {};
  function sectionHTML(s) {
    const group = 'g' + (++shotGroups), pics = [];
    const add = (im, cls) => { pics.push(im); return shotHTML(im, group, pics.length - 1, cls); };
    let h = '';
    const texts = Array.isArray(s.text) ? s.text : (s.text ? [s.text] : []);
    h += texts.map((t) => '<p>' + esc(t) + '</p>').join('');
    if (s.list) h += '<ul class="pixel-list">' + s.list.map((li) => '<li>' + esc(li) + '</li>').join('') + '</ul>';
    if (s.quote) {
      const q = typeof s.quote === 'string' ? { text: s.quote } : s.quote;
      h += '<blockquote class="insight"><p>“' + esc(q.text) + '”</p>' + (q.cite ? '<footer>' + esc(q.cite) + '</footer>' : '') + '</blockquote>';
    }
    if (s.steps) h += '<ol class="steps">' + s.steps.map((st) => '<li><div><h4>' + esc(st.title) + '</h4>' + (st.text ? '<p>' + esc(st.text) + '</p>' : '') +
      (hasSrc(st.image) ? add(st.image, 'case-figure step-figure') : '') + '</div></li>').join('') + '</ol>';
    if (s.highlights) h += '<ul class="highlights">' + s.highlights.map((x) => '<li><h4>' + esc(x.title) + '</h4><p>' + esc(x.text) + '</p></li>').join('') + '</ul>';
    if (s.metrics) h += '<ul class="metrics">' + s.metrics.map((m) => '<li><span class="metric-value">' + esc(m.value) + '</span><span class="metric-label">' + esc(m.label) + '</span></li>').join('') + '</ul>';
    if (hasSrc(s.image)) h += add(s.image);
    const gal = (s.gallery || []).filter(hasSrc);
    if (gal.length) h += '<ul class="gallery' + (s.layout === 'wide' ? ' gallery-wide' : '') + '">' + gal.map((im) => '<li>' + add(im, 'case-figure gallery-item') + '</li>').join('') + '</ul>';
    if (!h) return '';   // a section with nothing filled in yet stays hidden
    if (pics.length) SHOTS[group] = { title: s.heading, pics: pics };
    return '<section class="case-section"><h3>' + esc(s.heading) + '</h3>' + h + '</section>';
  }

  /* ---------- Photo viewer ----------
     A modal dialog: Esc or Close shuts it and focus goes back to the photo
     that opened it. Left and right arrows, or Previous and Next, move
     between the photos in the same section. */
  const Viewer = {
    el: null, group: null, i: 0, opener: null,
    build() {
      const d = document.createElement('dialog');
      d.className = 'viewer';
      d.setAttribute('aria-labelledby', 'viewer-title');
      d.innerHTML =
        '<div class="viewer-bar">' +
          '<h2 id="viewer-title" class="viewer-title"></h2>' +
          '<button type="button" class="win-btn viewer-close" aria-label="Close photo" data-sound="none">' + glyph('close') + '</button>' +
        '</div>' +
        '<figure class="viewer-figure"><img class="viewer-img" alt=""><figcaption class="viewer-cap"></figcaption></figure>' +
        '<div class="viewer-nav">' +
          '<button type="button" class="btn viewer-prev" data-sound="none">Previous</button>' +
          '<p class="viewer-count" aria-live="polite"></p>' +
          '<button type="button" class="btn viewer-next" data-sound="none">Next</button>' +
        '</div>';
      document.body.appendChild(d);
      $('.viewer-close', d).addEventListener('click', () => this.close());
      $('.viewer-prev', d).addEventListener('click', () => this.step(-1));
      $('.viewer-next', d).addEventListener('click', () => this.step(1));
      d.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); this.step(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); this.step(1); }
        e.stopPropagation();
      });
      d.addEventListener('click', (e) => { if (e.target === d) this.close(); });   // click outside the photo
      d.addEventListener('close', () => {
        Sound.play('close');
        if (this.opener && this.opener.isConnected) this.opener.focus();
      });
      this.el = d;
    },
    open(btn) {
      const g = SHOTS[btn.dataset.view];
      if (!g) return;
      if (!this.el) this.build();
      this.group = g; this.i = +btn.dataset.viewI || 0; this.opener = btn;
      this.show();
      this.el.showModal();
      Sound.play('open');
    },
    show() {
      const d = this.el, g = this.group, im = g.pics[this.i], many = g.pics.length > 1;
      $('.viewer-title', d).textContent = g.title || 'Photo';
      const img = $('.viewer-img', d);
      img.src = im.src; img.alt = im.alt || im.caption || '';
      const cap = $('.viewer-cap', d);
      cap.textContent = im.caption || ''; cap.hidden = !im.caption;
      $('.viewer-nav', d).hidden = !many;
      $('.viewer-count', d).textContent = many ? 'Photo ' + (this.i + 1) + ' of ' + g.pics.length : '';
    },
    step(dir) {
      const n = this.group.pics.length;
      if (n < 2) return;
      this.i = (this.i + dir + n) % n;
      this.show();
      Sound.play('page');
    },
    close() { if (this.el && this.el.open) this.el.close(); }
  };

  function buildCase(w, p) {
    const n = PROJ.length, i = PROJ.indexOf(p);
    const prev = PROJ[(i - 1 + n) % n], next = PROJ[(i + 1) % n];
    const meta = [['Role', p.role], ['Timeline', p.timeline], ['Team', p.team], ['Platform', p.platform], ['Tools', p.tools]]
      .filter((r) => r[1]).map((r) => '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>').join('');
    const links = (p.links || []).filter((l) => l && l.url);
    let nav = '';
    if (n > 1 && prev !== p && prev !== next) nav += '<button type="button" class="btn" data-case-go="' + esc(prev.id) + '" data-sound="none">Previous: ' + esc(prev.title) + '</button>';
    if (has('work')) nav += '<button type="button" class="btn" data-open="work" data-sound="none">All work</button>';
    if (n > 1) nav += '<button type="button" class="btn btn-primary" data-case-go="' + esc(next.id) + '" data-sound="none">Next: ' + esc(next.title) + '</button>';
    w.body.innerHTML =
      '<article class="case" style="' + hueVars(p) + '">' +
        '<div class="case-hero">' + coverHTML(p) +
          '<p class="case-title">' + esc(p.title) + '</p>' +
          '<p class="case-summary">' + esc(p.summary) + '</p>' +
          tagsHTML(p) +
          (links.length ? '<p class="cta-row">' + links.map((l, i) => extLink(l, 'btn' + (i === 0 ? ' btn-primary' : ''))).join('') + '</p>' : '') +
        '</div>' +
        (meta ? '<dl class="meta">' + meta + '</dl>' : '') +
        (p.sections || []).map(sectionHTML).join('') +
        '<nav class="case-nav" aria-label="More case studies">' + nav + '</nav>' +
      '</article>';
  }
  function goToCase(btn, pid) {
    const fromEl = btn.closest('.window');
    const from = fromEl ? Array.from(WM.wins.values()).find((x) => x.el === fromEl) : null;
    const toId = 'case-' + pid;
    const to = WM.ensure(toId);
    if (!to) return;
    if (from && from !== to && to.el.hidden) {
      Object.assign(to, { x: from.x, y: from.y, w: from.w, h: from.h, placed: true });
      if (from.max) WM.setMax(to, true);
    }
    WM.open(toId, { opener: from ? from.opener : btn, animate: false, sound: 'page' });
    if (from && from !== to) WM.close(from.id, { silent: true, returnFocus: false });
    to.body.scrollTop = 0;
    to.body.focus({ preventScroll: true });
  }

  /* ---------- CV ---------- */
  function buildCV(w) {
    const list = (items) => '<ul class="cv-list">' + items.map((e) =>
      '<li class="cv-item"><p class="cv-dates">' + esc(e.dates) + '</p><div><h4>' + esc(e.title || e.role) + (e.org ? ', ' + esc(e.org) : '') + '</h4>' +
      (e.place ? '<p class="cv-place">' + esc(e.place) + '</p>' : '') +
      (e.points && e.points.length ? '<ul>' + e.points.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') +
      '</div></li>').join('') + '</ul>';
    w.body.innerHTML =
      '<div class="cv">' +
        '<div class="cv-head"><p class="cv-name">' + esc(PROFILE.name) + '</p><p class="cv-role">' + esc(PROFILE.role) + '</p>' +
          '<p class="cv-contact"><span>' + esc(PROFILE.location) + '</span>' + mailto() + '</p>' +
          (CV.pdf ? pdfLink('btn btn-primary') : '') +
        '</div>' +
        '<p class="lead">' + esc(CV.summary) + '</p>' +
        '<section class="cv-sec"><h3>Experience</h3>' + list(CV.experience) + '</section>' +
        '<section class="cv-sec"><h3>Education</h3>' + list(CV.education) + '</section>' +
        (CV.certifications.length ? '<section class="cv-sec"><h3>Certification</h3>' + list(CV.certifications) + '</section>' : '') +
        '<section class="cv-sec"><h3>Skills</h3><dl class="cv-skills">' + CV.skills.map((s) => '<div><dt>' + esc(s.group) + '</dt><dd>' + esc(s.items.join(', ')) + '</dd></div>').join('') + '</dl></section>' +
        (CV.community.length ? '<section class="cv-sec"><h3>Talks and community</h3><ul class="cv-plain">' + CV.community.map((c) => '<li>' + esc(c) + '</li>').join('') + '</ul></section>' : '') +
      '</div>';
  }

  /* ---------- Messages ---------- */
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Finds the best answer for a typed question. A keyword counts when a word
  // starts with it ("design" finds "designing"), or is one letter off for longer
  // words ("proccess"). Phrases like "open to work" count double.
  function editsApart(a, b) {
    if (Math.abs(a.length - b.length) > 1) return 2;
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let prev = row[0]; row[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const cur = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = cur;
      }
    }
    return row[b.length];
  }
  function matchQuestion(text) {
    const t = ' ' + text.toLowerCase().replace(/[^a-z0-9%+'\s]/g, ' ').replace(/\s+/g, ' ') + ' ';
    const words = t.trim().split(' ');
    let best = null, bestScore = 0;
    CHAT.questions.concat(CHAT.extras).forEach((q) => {
      let s = 0;
      const keys = (q.keywords || []).concat(q.id === 'who' ? [PROFILE.firstName.toLowerCase()] : []);
      keys.forEach((k) => {
        const kw = k.toLowerCase();
        if (kw.indexOf(' ') > -1) { if (t.indexOf(' ' + kw) > -1) s += 3; return; }
        // exact or word-start matches count double; one-letter typos count once
        if (words.some((w) => (kw.length <= 3 ? w === kw : w.indexOf(kw) === 0))) s += 2;
        else if (kw.length >= 5 && words.some((w) => w.length >= kw.length - 1 && editsApart(w.slice(0, kw.length + 1), kw) <= 1)) s += 1;
      });
      if (s > bestScore) { bestScore = s; best = q; }
    });
    return best;
  }
  function answerParts(q) {
    if (q.random) {
      let i = Math.floor(Math.random() * q.random.length);
      if (q.random.length > 1 && i === q.lastPick) i = (i + 1) % q.random.length;
      q.lastPick = i;
      return [fill(q.random[i])];
    }
    return (q.answer || CHAT.fallback).map(fill);
  }
  function actionsHTML(q) {
    let h = '';
    if (q.projects && PROJ.length) {
      h += '<ul class="msg-projects">' + PROJ.map((p) =>
        '<li><button type="button" class="msg-project" data-open="case-' + esc(p.id) + '" data-sound="none" style="' + hueVars(p) + '">' +
        '<span class="msg-project-title">' + esc(p.title) + '</span><span class="msg-project-sum">' + esc(p.summary) + '</span></button></li>').join('') + '</ul>';
    }
    const btns = (q.actions || []).filter((a) => a.egg || has(a.open)).map((a) => a.egg
      ? '<button type="button" class="btn btn-small" data-egg data-sound="none">' + esc(a.label) + '</button>' : '<button type="button" class="btn btn-small" data-open="' + esc(a.open) + '" data-sound="none">' + esc(a.label) + '</button>');
    if (q.cvPdf && CV.pdf) btns.push(pdfLink('btn btn-small'));
    if (q.copyEmail) btns.push('<button type="button" class="btn btn-small" data-copy="email">Copy email</button>');
    if (q.profileLinks) PROFILE.links.forEach((l) => btns.push(extLink(l, 'btn btn-small')));
    if (btns.length) h += '<div class="msg-actions">' + btns.join('') + '</div>';
    return h;
  }
  const Chat = {
    log: null, input: null, busy: false, readyAt: 0,
    add(who, html) {
      const m = document.createElement('div');
      m.className = 'msg msg-' + who;
      m.innerHTML = '<span class="sr-only">' + (who === 'bot' ? esc(PROFILE.firstName) : 'You') + ': </span>' + html;
      this.log.appendChild(m);
      this.log.scrollTo({ top: this.log.scrollHeight, behavior: motionOK() ? 'smooth' : 'auto' });
      return m;
    },
    typing() {
      const d = document.createElement('div');
      d.className = 'msg msg-bot typing';
      d.setAttribute('aria-hidden', 'true');
      d.innerHTML = '<i></i><i></i><i></i>';
      this.log.appendChild(d);
      this.log.scrollTo({ top: this.log.scrollHeight, behavior: motionOK() ? 'smooth' : 'auto' });
      return d;
    },
    canAsk() { return !this.busy && performance.now() >= this.readyAt; },
    setWaiting(on) {
      $$('.chip, .chat-form [type="submit"]', this.log.parentNode).forEach((b) => b.setAttribute('aria-disabled', String(on)));
      this.log.parentNode.classList.toggle('is-waiting', on);
    },
    // Ignores clicks while an answer is being typed and for a moment after,
    // so tapping several questions at once can't pile up a backlog.
    ask(text, q) {
      if (!this.canAsk()) { announce('Wait for the reply to finish, then ask your next question.'); return false; }
      this.busy = true;
      this.setWaiting(true);
      const pause = Math.max(0, Number(CHAT.waitBetweenQuestions) || 0);
      this.respond(text, q).catch(() => {}).then(() => {
        this.busy = false;
        this.readyAt = performance.now() + pause;
        setTimeout(() => { if (this.canAsk()) this.setWaiting(false); }, pause);
      });
      return true;
    },
    async respond(text, q) {
      this.add('user', '<p>' + esc(text) + '</p>');
      Sound.play('send');
      const parts = answerParts(q);
      for (let i = 0; i < parts.length; i++) {
        const dots = this.typing();
        await wait(motionOK() ? clamp(260 + parts[i].length * 9, 500, 1400) : 300);
        dots.remove();
        const last = i === parts.length - 1;
        this.add('bot', '<p>' + linkEmail(esc(parts[i])) + '</p>' + (last ? actionsHTML(q) : ''));
        Sound.play('receive');
        if (!last) await wait(140);
      }
    }
  };
  function buildChat(w) {
    w.body.classList.add('chat-body');
    w.body.innerHTML =
      '<div class="chat-head-row">' + avatarHTML('avatar') +
        '<div><p class="chat-name">' + esc(PROFILE.name) + '</p><p class="chat-status"><span class="dot" aria-hidden="true"></span>' + esc(fill(CHAT.status)) + '</p></div>' +
      '</div>' +
      '<div class="chat-log" role="log" aria-label="Conversation" tabindex="0"></div>' +
      '<div class="chat-suggest"><p class="suggest-label" id="suggest-label">Suggested questions</p>' +
        '<div class="chips" id="chat-chips" role="group" aria-labelledby="suggest-label">' +
          CHAT.questions.map((q, i) => '<button type="button" class="chip' + (i >= 3 ? ' chip-extra' : '') + '" data-q="' + esc(q.id) + '" data-sound="none">' + esc(fill(q.chip)) + '</button>').join('') +
        '</div>' +
        (CHAT.questions.length > 3 ? '<button type="button" class="chips-more" aria-expanded="false" aria-controls="chat-chips" data-sound="none"></button>' : '') +
        '</div>' +
      '<form class="chat-form" novalidate>' +
        '<label class="sr-only" for="chat-input">Message ' + esc(PROFILE.firstName) + '</label>' +
        '<input id="chat-input" class="chat-input" type="text" autocomplete="off" placeholder="' + esc(fill(CHAT.placeholder)) + '"' + (CHAT.typeHint ? ' aria-describedby="chat-hint"' : '') + '>' +
        '<button type="submit" class="btn btn-primary" data-sound="none">' + glyph('send') + '<span>Send</span></button>' +
      '</form>' +
      (CHAT.typeHint ? '<p class="chat-hint" id="chat-hint">' + esc(fill(CHAT.typeHint)) + '</p>' : '');
    // Narrow window: show three suggestions and a "More questions" toggle.
    const chips = $('.chips', w.body), more = $('.chips-more', w.body), extra = CHAT.questions.length - 3;
    let open = false;
    const setChips = () => {
      if (!more) return;
      const narrow = w.body.clientWidth < 480;
      more.hidden = !narrow;
      chips.classList.toggle('is-collapsed', narrow && !open);
      more.setAttribute('aria-expanded', String(open));
      more.textContent = open ? 'Fewer questions' : 'More questions (' + extra + ')';
    };
    if (more) {
      more.addEventListener('click', () => { open = !open; setChips(); Sound.play(open ? 'expand' : 'collapse'); });
      new ResizeObserver(setChips).observe(w.body);
      setChips();
    }
    Chat.log = $('.chat-log', w.body);
    Chat.input = $('#chat-input', w.body);
    CHAT.intro.forEach((t) => Chat.add('bot', '<p>' + linkEmail(esc(fill(t))) + '</p>'));
    $('.chips', w.body).addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b) return;
      const q = CHAT.questions.find((x) => x.id === b.dataset.q);
      if (q) Chat.ask(fill(q.chip), q);
    });
    $('.chat-form', w.body).addEventListener('submit', (e) => {
      e.preventDefault();
      const v = Chat.input.value.trim();
      if (!v) { Chat.input.focus(); return; }
      if (Chat.ask(v, matchQuestion(v) || { answer: CHAT.fallback })) Chat.input.value = '';
    });
  }

  /* ---------- copy email ---------- */
  async function copyEmail(btn) {
    if (!btn.dataset.label) btn.dataset.label = btn.textContent;
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      btn.textContent = 'Copied';
      announce('Email address copied');
      Sound.play('on');
    } catch (e) {
      btn.textContent = 'Copy blocked';
      announce('Couldn’t copy here. The address is ' + PROFILE.email);
    }
    clearTimeout(btn.copyTimer);
    btn.copyTimer = setTimeout(() => { btn.textContent = btn.dataset.label; }, 2200);
  }
  const liveEl = $('#announcer');
  function announce(msg) { liveEl.textContent = ''; setTimeout(() => { liveEl.textContent = msg; }, 60); }

  /* ---------- menu bar, hero, icons ---------- */
  function renderChrome() {
    $('#brand-mark').innerHTML = glyph('sparkle');
    $('#brand-name').textContent = PROFILE.name;
    $('#menu-list').innerHTML = MENU.map((d) => '<li><button type="button" class="menu-btn" data-open="' + d[0] + '" data-sound="none">' + esc(d[1]) + '</button></li>').join('');
    $('#hero-name').textContent = PROFILE.name;
    // The browser tab and search description follow your name in content.js.
    document.title = PROFILE.name + ', ' + PROFILE.role;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', 'Portfolio of ' + PROFILE.name + ', ' + PROFILE.role + '. ' + PROFILE.tagline);
    // A faint, decorative hint for the easter egg. The same secret is in the chat for everyone.
    $('#egg-pad').innerHTML = ARTW.controllerIcon
      ? artImg(ARTW.controllerIcon, '', 32)
      : pixelSVG(PIX.controller, 'px', false, 2);
    $('#konami-hint').innerHTML = ARTW.konamiHint ? '<img class="glyph-art" src="' + esc(ARTW.konamiHint) + '" alt="" onload="this.width=this.naturalWidth*2;this.height=this.naturalHeight*2">' : ['kUp', 'kUp', 'kDown', 'kDown', 'kLeft', 'kRight', 'kLeft', 'kRight', 'kB', 'kA'].map((g) => pixelSVG(GLYPH[g], 'glyph', true, 2)).join('');
    $('#hero-tagline').textContent = PROFILE.tagline;
    $('#hero-status').textContent = PROFILE.availability;
    $('.hero-ctas').outerHTML = ctaButtons(SITE.heroButtons, 'hero-ctas');
    if (SITE.sounds === false) { prefs.sound = false; $('#sound-btn').hidden = true; }
    if (SITE.animatedSky === false) { prefs.motion = false; $('#motion-btn').hidden = true; }
    const iconList = (list) => list.map((d) =>
      '<li><button type="button" class="icon-btn" data-open="' + d[0] + '" data-icon-for="' + d[0] + '" data-sound="none">' +
      icon(DEFS[d[0]].icon) + '<span class="icon-label">' + esc(d[1]) + '</span><span class="sr-only icon-state"></span></button></li>').join('');
    iconsEl.innerHTML = iconList(DESKTOP);
    iconsRightEl.innerHTML = iconList(DESKTOP_RIGHT);
    iconsRightEl.parentNode.hidden = !DESKTOP_RIGHT.length;
    chatHead.innerHTML = avatarHTML('avatar') + '<span>Ask me anything</span>';
    $('#motion-btn .tray-ico').innerHTML = glyph('sparkle');
    $('#theme-btn .tray-ico').innerHTML = glyph('moon');
  }
  function syncToggles() {
    const s = $('#sound-btn');
    s.setAttribute('aria-pressed', String(prefs.sound));
    $('.tray-ico', s).innerHTML = glyph(prefs.sound ? 'soundOn' : 'soundOff');
    $('#motion-btn').setAttribute('aria-pressed', String(motionOK()));
    $('#theme-btn').setAttribute('aria-pressed', String(root.dataset.mode === 'dark'));
  }
  function applyTheme() {
    const t = currentTheme();
    const changed = root.dataset.mode !== t;
    root.dataset.mode = t;
    if (changed) Sky.build();
    Sound.setMode();
    syncToggles();
  }
  function applyMotion() {
    root.dataset.motion = motionOK() ? 'full' : 'reduce';
    Sky.setRunning(motionOK());
    syncToggles();
  }
  function updateClock() {
    const now = new Date(), el = $('#clock');
    el.textContent = new Intl.DateTimeFormat(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' }).format(now);
    el.setAttribute('datetime', now.toISOString());
    updateTimes();
  }

  /* ---------- pixel cursor ----------
     Pixel-art arrow and hand, drawn here as SVG. A white outline keeps them
     visible on both themes. Visitors can switch back to their own cursor
     (for example a large system cursor) from the top bar. */
  const CURSORS = {
    arrow: { hot: [0, 0], rows: ['K...............', 'KK..............', 'KWK.............', 'KWWK............', 'KWWWK...........', 'KWWWWK..........', 'KWWWWWK.........', 'KWWWWWWK........',
      'KWWWWWWWK.......', 'KWWWWWWWWK......', 'KWWWWWKKKKK.....', 'KWWKWWK.........', 'KWK.KWWK........', 'KK..KWWK........', 'K....KWWK.......', '.....KKK........'] },
    hand: { hot: [4.5, 0], rows: ['....KK..........', '...KWWK.........', '...KWWK.........', '...KWWK.........', '...KWWKKK.......', '...KWWKWWKKK....', 'KK.KWWKWWKWWKK..', 'KWKKWWWWWWWWKWK.',
      'KWWKWWWWWWWWWWK.', '.KWWWWWWWWWWWWK.', '..KWWWWWWWWWWWK.', '..KWWWWWWWWWWK..', '...KWWWWWWWWWK..', '....KWWWWWWWK...', '....KKKKKKKKK...', '................'] }
  };
  // High contrast on any background: a near-black body, a white outline,
  // then a thin dark ring so the white edge still shows on white pages.
  function cursorURL(c) {
    const n = 20, pad = 2, grid = Array.from({ length: n }, () => Array(n).fill('.'));
    // The art's outline pixels become white (keeping finger lines), its fill becomes dark.
    c.rows.forEach((r, y) => r.split('').forEach((ch, x) => { if (ch !== '.') grid[y + pad][x + pad] = ch === 'K' ? 'O' : 'B'; }));
    const ring = (g, from, to, diag) => g.map((r, y) => r.map((ch, x) => ch !== '.' ? ch :
      [[1, 0], [-1, 0], [0, 1], [0, -1]].concat(diag ? [[1, 1], [-1, -1], [1, -1], [-1, 1]] : [])
        .some((d) => from.indexOf((g[y + d[1]] || [])[x + d[0]]) > -1) ? to : '.'));
    const outlined = ring(grid, ['O', 'B'], 'R', true);
    const col = { B: '#140C24', O: '#FFFFFF', R: '#140C24' };
    let rects = '';
    outlined.forEach((r, y) => r.forEach((ch, x) => { if (ch !== '.') rects += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + col[ch] + '"/>'; }));
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 20 20" shape-rendering="crispEdges">' + rects + '</svg>';
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '") ' + Math.round((c.hot[0] + pad) * 2) + ' ' + Math.round((c.hot[1] + pad) * 2);
  }
  const ownCursor = (src, hot) => 'url("' + String(src).replace(/"/g, '%22') + '") ' + ((hot || [])[0] || 0) + ' ' + ((hot || [])[1] || 0);
  root.style.setProperty('--cur-arrow', (ARTW.cursor ? ownCursor(ARTW.cursor, ARTW.cursorHotspot) : cursorURL(CURSORS.arrow)) + ', default');
  root.style.setProperty('--cur-hand', (ARTW.cursorHand ? ownCursor(ARTW.cursorHand, ARTW.cursorHandHotspot) : cursorURL(CURSORS.hand)) + ', pointer');
  prefs.cursor = SITE.pixelCursor === false ? false : store.get('cursor', true);
  function applyCursor() {
    root.classList.toggle('pixel-cursor', !!prefs.cursor);
    const b = $('#cursor-btn');
    b.hidden = SITE.pixelCursor === false;
    b.setAttribute('aria-pressed', String(!!prefs.cursor));
    $('.tray-ico', b).innerHTML = glyph('pointer');
  }

  /* ---------- sparkles on click and behind the pointer ----------
     Brief, small and never flashing. Only runs while animation is on, so it
     stops for anyone who turns animation off or asks their device for reduced
     motion (WCAG 2.3.3). The canvas ignores the mouse and screen readers. */
  const FX = {
    cv: null, g: null, parts: [], raf: 0, lastTrail: 0,
    colours() { return root.dataset.mode === 'dark' ? ['#FFD97A', '#FFFFFF', '#C2B6FF', '#8FE3D0'] : ['#FFB3D3', '#9B85EE', '#FFE08A', '#5EC699']; },
    on() { return SITE.cursorSparkles !== false && motionOK(); },
    init() {
      this.cv = document.createElement('canvas');
      this.cv.className = 'fx-layer';
      this.cv.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.cv);
      this.g = this.cv.getContext('2d');
      const size = () => { this.cv.width = innerWidth; this.cv.height = innerHeight; };
      size(); addEventListener('resize', debounce(size, 120));
      document.addEventListener('pointerdown', (e) => { if (this.on()) this.burst(e.clientX, e.clientY); }, true);
      document.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse' || !this.on() || document.body.classList.contains('is-dragging')) return;
        const now = performance.now();
        if (now - this.lastTrail < 45) return;
        this.lastTrail = now;
        this.add(e.clientX + (Math.random() * 10 - 5), e.clientY + (Math.random() * 10 - 5), (Math.random() - 0.5) * 20, 18 + Math.random() * 20, 380, 1);
      }, { passive: true });
    },
    add(x, y, vx, vy, life, size, grav) {
      if (this.parts.length > 320) this.parts.shift();
      const c = this.colours();
      this.parts.push({ x, y, vx, vy, life, born: performance.now(), size, grav: grav || 0, c: c[Math.floor(Math.random() * c.length)] });
      if (!this.raf) this.raf = requestAnimationFrame((t) => this.frame(t));
    },
    burst(x, y) {
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + Math.random() * 0.4, sp = 70 + Math.random() * 60;
        this.add(x, y, Math.cos(a) * sp, Math.sin(a) * sp, 480, 2);
      }
    },
    frame(t) {
      const g = this.g;
      g.clearRect(0, 0, this.cv.width, this.cv.height);
      this.parts = this.parts.filter((p) => t - p.born < p.life);
      this.parts.forEach((p) => {
        const age = (t - p.born) / 1000, k = 1 - (t - p.born) / p.life, u = 3 * p.size;
        const x = Math.round(p.x + p.vx * age), y = Math.round(p.y + p.vy * age + 0.5 * p.grav * age * age);
        if (SPR.sparkle) { g.imageSmoothingEnabled = false; sprite(g, SPR.sparkle, x, y, Math.max(0, k), Sky.S); return; }
        g.globalAlpha = Math.max(0, k);
        g.fillStyle = p.c;
        g.fillRect(x - u, y, u * 2 + 1, Math.max(1, p.size));     // a little pixel star
        g.fillRect(x, y - u, Math.max(1, p.size), u * 2 + 1);
      });
      g.globalAlpha = 1;
      this.raf = this.parts.length ? requestAnimationFrame((n) => this.frame(n)) : 0;
      if (!this.raf) g.clearRect(0, 0, this.cv.width, this.cv.height);
    }
  };

  /* ---------- Konami code easter egg ----------
     Up, up, down, down, left, right, left, right, B, A. Fireworks are small
     bursts, at most two a second and never a full-screen flash (WCAG 2.3.1),
     and with animation off only the message appears. */
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiAt = 0;
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select') || e.repeat) return;
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Fn'].indexOf(e.key) > -1) return;   // modifier keys don't break the code
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === KONAMI[konamiAt]) {
      konamiAt++;
      if (prefs.sound && Sound.ctx && Sound.ctx.state === 'running') Sound.tone(392 * Math.pow(2, konamiAt / 12 * 2), { dur: 0.08, gain: 0.06, type: 'square' });
    } else konamiAt = k === 'ArrowUp' ? (konamiAt === 2 ? 2 : 1) : 0;
    if (konamiAt === KONAMI.length) { konamiAt = 0; easterEgg(); }
  });
  function fireworks() {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const x = innerWidth * (0.2 + Math.random() * 0.6), y = innerHeight * (0.18 + Math.random() * 0.35);
        for (let j = 0; j < 28; j++) {
          const a = (j / 28) * Math.PI * 2, sp = 120 + Math.random() * 90;
          FX.add(x, y, Math.cos(a) * sp, Math.sin(a) * sp, 1100, 2, 160);
        }
        Sound.play(i % 2 ? 'theme' : 'on');
      }, i * 450);
    }
  }
  // The little controller on the desktop plays the code for people who can't use a keyboard.
  function playCode() {
    const marks = $$('#konami-hint > *'), hint = $('#konami-hint');
    if (!motionOK() || !marks.length) { easterEgg(); return; }
    hint.classList.add('playing');
    marks.forEach((m, i) => setTimeout(() => {
      marks.forEach((x) => x.classList.remove('lit'));
      m.classList.add('lit');
      Sound.tone && prefs.sound && Sound.ctx && Sound.ctx.state === 'running' && Sound.tone(392 * Math.pow(2, (i + 1) / 6), { dur: 0.08, gain: 0.06, type: 'square' });
    }, i * 110));
    setTimeout(() => { marks.forEach((x) => x.classList.remove('lit')); hint.classList.remove('playing'); easterEgg(); }, marks.length * 110 + 80);
  }
  let toastTimer = 0;
  function easterEgg() {
    const egg = typeof EASTER_EGG !== 'undefined' ? EASTER_EGG : { title: 'Cheat code accepted!', lines: [] };
    let t = $('#egg-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'egg-toast';
      t.className = 'egg-toast';
      document.body.appendChild(t);
    }
    t.innerHTML = '<p class="egg-title">' + esc(egg.title) + '</p><ul>' + (egg.lines || []).map((l) => '<li>' + esc(l) + '</li>').join('') + '</ul>' +
      '<button type="button" class="win-btn egg-close" aria-label="Close message">' + glyph('close') + '</button>';
    t.hidden = false;
    $('.egg-close', t).addEventListener('click', () => { t.hidden = true; });
    announce(egg.title + ' ' + (egg.lines || []).join('. '));
    if (motionOK()) fireworks(); else Sound.play('theme');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { if (!t.contains(document.activeElement)) t.hidden = true; }, 9000);
  }

  /* ---------- events ---------- */
  const HOVERABLE = 'button, a[href], .chip';
  let hoverEl = null;
  document.addEventListener('pointerover', (e) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.target.closest(HOVERABLE);
    if (el === hoverEl) return;
    hoverEl = el;
    if (el && !el.disabled) Sound.play('hover');
  });
  const unlock = () => Sound.unlock();
  document.addEventListener('pointerdown', unlock, true);
  document.addEventListener('keydown', unlock, true);
  document.addEventListener('click', (e) => {
    const el = e.target.closest('button, a[href]');
    if (!el) return;
    const s = el.dataset.sound || 'click';
    if (s !== 'none') Sound.play(s);
  }, true);
  document.addEventListener('click', (e) => {
    const op = e.target.closest('[data-open]');
    if (op) { if (has(op.dataset.open)) WM.open(op.dataset.open, { opener: op }); return; }
    const go = e.target.closest('[data-case-go]');
    if (go) { goToCase(go, go.dataset.caseGo); return; }
    if (e.target.closest('[data-egg]')) { easterEgg(); return; }
    if (e.target.closest('#egg-pad')) { playCode(); return; }
    const sh = e.target.closest('[data-view]');
    if (sh) { Viewer.open(sh); return; }
    const cp = e.target.closest('[data-copy]');
    if (cp) copyEmail(cp);
  });
  $('#sound-btn').addEventListener('click', () => {
    prefs.sound = !prefs.sound;
    store.set('sound', prefs.sound);
    if (prefs.sound) { Sound.unlock(); setTimeout(() => Sound.play('on'), 30); }
    syncToggles();
    announce(prefs.sound ? 'Sound effects on' : 'Sound effects off');
  });
  $('#cursor-btn').addEventListener('click', () => {
    prefs.cursor = !prefs.cursor;
    store.set('cursor', prefs.cursor);
    applyCursor();
    Sound.play(prefs.cursor ? 'on' : 'off');
    announce(prefs.cursor ? 'Pixel cursor on' : 'Using your own cursor');
  });
  $('#motion-btn').addEventListener('click', () => {
    prefs.motion = !motionOK();
    store.set('motion', prefs.motion);
    applyMotion();
    Sound.play(prefs.motion ? 'on' : 'off');
    announce(prefs.motion ? 'Animation on' : 'Animation off');
  });
  $('#theme-btn').addEventListener('click', () => {
    prefs.theme = root.dataset.mode === 'dark' ? 'light' : 'dark';
    store.set('theme', prefs.theme);
    applyTheme();
    Sound.play('theme');
  });
  mq.dark.addEventListener('change', () => { if (!prefs.theme) applyTheme(); });
  mq.reduce.addEventListener('change', () => { if (prefs.motion === null) applyMotion(); });
  mq.small.addEventListener('change', () => { WM.updateTop(); WM.reflow(); });
  new MutationObserver(() => { if (!prefs.theme) applyTheme(); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  addEventListener('resize', debounce(() => WM.reflow(), 120));
  addEventListener('hashchange', () => { const t = hashTarget(); if (t) WM.open(t, { opener: null }); });

  /* ---------- start ---------- */
  renderChrome();
  applyCursor();
  FX.init();
  applyTheme();
  Sky.init();
  loadSprites(() => Sky.build());
  applyMotion();
  updateClock();
  setInterval(updateClock, 20000);
  syncDesktop();

  // Open the chat with its intro when there's room beside the intro text;
  // otherwise the "Ask me anything" button waits in the corner.
  const target = hashTarget();
  const roomForChat = () => {
    if (isSmall() || !has('messages') || SITE.openChatOnLoad === false) return false;
    const A = WM.area(), chatW = Math.min(DEFS.messages.size[0] * remPx(), A.w - 48) + WM.rightGutter();
    if (!$('.hero-plate')) return true;
    const heroRight = $('.hero-plate').getBoundingClientRect().right;
    return A.x + A.w - chatW - 24 > heroRight + 16;
  };
  const start = roomForChat()
    ? WM.open('messages', { opener: null, focus: false, sound: false, animate: !target, keepHash: true })
    : Promise.resolve();
  start.then(() => { if (target) WM.open(target, { opener: null, focus: false, sound: false, animate: false }); });
})();
