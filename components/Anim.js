var Anim = window.Anim = {
    _instances: [],
    _observer: null,

    _init() {
        if (window.gsap && window.TextPlugin) {
            gsap.registerPlugin(TextPlugin);
        }
        this._injectFilters();
    },

    _injectFilters() {
        if (document.getElementById('anim-svg-filters')) return;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = "anim-svg-filters";
        svg.style.position = "absolute";
        svg.style.width = "0";
        svg.style.height = "0";
        svg.innerHTML = `
            <defs>
                <filter id="ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
        `;
        document.body.appendChild(svg);
    },

    _getObserver() {
        if (!this._observer) {
            this._observer = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    const instance = this._instances.find(i => i.card === e.target);
                    if (!instance) return;
                    if (e.isIntersecting) {
                        if (instance.tl) instance.tl.play();
                    } else {
                        if (instance.tl) instance.tl.pause();
                    }
                });
            }, { threshold: 0.1 });
        }
        return this._observer;
    },

    _createCard(container, title, accent) {
        this._init();
        const card = document.createElement('div');
        card.className = 'anim-card';
        if (accent) card.style.setProperty('--anim-accent', accent);

        const header = document.createElement('div');
        header.className = 'anim-card-header';
        header.innerHTML = `<span class="anim-card-title">${title}</span>`;

        const fsBtn = document.createElement('button');
        fsBtn.className = 'anim-card-fs';
        fsBtn.textContent = 'Fullscreen';
        fsBtn.onclick = () => {
            const isFS = card.classList.toggle('fullscreen');
            fsBtn.textContent = isFS ? 'Exit Fullscreen' : 'Fullscreen';
            // Simple delay to ensure CSS has applied before measuring
            setTimeout(() => this._handleResize(card), 50);
        };
        header.appendChild(fsBtn);

        const stageOuter = document.createElement('div');
        stageOuter.className = 'anim-stage-outer';

        const stageInner = document.createElement('div');
        stageInner.className = 'anim-stage-inner';

        const viewport = document.createElement('div');
        viewport.className = 'anim-viewport';

        stageInner.appendChild(viewport);
        stageOuter.appendChild(stageInner);
        card.appendChild(header);
        card.appendChild(stageOuter);
        container.appendChild(card);

        // Auto-scaling
        const ro = new ResizeObserver(() => this._handleResize(card));
        ro.observe(stageInner);

        return { card, viewport };
    },

    _handleResize(card) {
        const inner = card.querySelector('.anim-stage-inner');
        const viewport = card.querySelector('.anim-viewport');
        if (!inner || !viewport) return;

        const w = inner.offsetWidth;
        const h = inner.offsetHeight;
        const scale = Math.min(w / 1920, h / 1080);
        gsap.set(viewport, { scale: scale });
    },

    _register(card, tl) {
        this._instances.push({ card, tl });
        this._getObserver().observe(card);
    },

    // ── HELPERS ──
    _getAnim(defaults, override) {
        return { ...defaults, ...(override || {}) };
    },

    _sketch(tl, element, duration = 1.5) {
        if (!element) return;
        const paths = element.querySelectorAll('path, line, circle, ellipse, polyline, polygon');
        paths.forEach(p => {
            const len = p.getTotalLength();
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
            tl.to(p, { strokeDashoffset: 0, duration: duration, ease: "power2.inOut" }, "-=1.2");
        });
    },

    // ── TYPES v6 ──

    mascot(container, title, opts = {}) {
        const { card, viewport } = this._createCard(container, title, opts.accent);
        const paper = this._createTornPaper(viewport, 800, 600);

        const stage = document.createElement('div');
        stage.style.width = '100%';
        stage.style.height = '100%';
        stage.style.display = 'flex';
        stage.style.flexDirection = 'column';
        stage.style.alignItems = 'center';
        stage.style.justifyContent = 'center';
        paper.appendChild(stage);

        stage.innerHTML = `
            <svg viewBox="0 0 800 600" width="800" height="600" class="anim-ink-text">
                <g class="mascot-group">
                    <path class="anim-sketch-path" d="M 300 400 Q 400 250 500 400 Q 550 500 400 500 Q 250 500 300 400" />
                    <g class="eyes">
                        <circle class="anim-sketch-path" cx="360" cy="380" r="15" />
                        <circle class="anim-sketch-path" cx="440" cy="380" r="15" />
                        <circle class="pupil" cx="360" cy="380" r="6" fill="var(--anim-accent)" />
                        <circle class="pupil" cx="440" cy="380" r="6" fill="var(--anim-accent)" />
                    </g>
                    <path class="anim-sketch-path" d="M 380 430 Q 400 450 420 430" />
                </g>
                <text class="label" x="400" y="580" text-anchor="middle" fill="var(--anim-accent)" style="font-size: 80px; opacity:0; font-family:'Kalam', cursive; font-weight:700;">${opts.word || "MONAD"}</text>
            </svg>
        `;

        const mascot = stage.querySelector('.mascot-group');
        const label = stage.querySelector('.label');

        const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: opts.repeatDelay || 1.5 });

        const inA = this._getAnim({ y: 1200, rotate: 5, duration: opts.inDuration || 1.5, ease: "expo.out" }, opts.in);
        tl.from(paper, inA);

        this._sketch(tl, stage, opts.sketchDuration || 1.8);
        tl.to(label, { opacity: 1, y: -10, duration: opts.labelDuration || 1, ease: "power2.out" }, "-=0.8")
            .to(mascot, { y: -20, duration: opts.duration || 2.5, ease: "sine.inOut" }, "-=1.5");

        if (opts.out) {
            const outA = this._getAnim({ duration: opts.outDuration || 0.6 }, opts.out);
            tl.to(paper, outA, "+=3");
        }

        this._register(card, tl);
    },

    typing3d(container, title, lines, opts = {}) {
        const { card, viewport } = this._createCard(container, title, opts.accent);
        const paper = this._createTornPaper(viewport, 1100, 700);

        const stage = document.createElement('div');
        stage.style.width = '100%';
        stage.style.height = '100%';
        stage.style.display = 'flex';
        stage.style.alignItems = 'center';
        stage.style.justifyContent = 'center';
        paper.appendChild(stage);

        const tbox = document.createElement('div');
        tbox.className = 'anim-tcolorbox-v4';
        stage.appendChild(tbox);

        const lineData = lines.map(text => {
            const el = document.createElement('div');
            el.className = 'anim-typing-line-v4';
            tbox.appendChild(el);
            return { el, text };
        });

        const cursor = document.createElement('div');
        cursor.className = 'anim-cursor-v4';
        tbox.appendChild(cursor);

        const tl = gsap.timeline({ repeat: -1, repeatDelay: opts.repeatDelay || 3 });
        const inA = this._getAnim({ y: -1200, rotate: -3, duration: opts.inDuration || 1.4, ease: "power4.out" }, opts.in);
        tl.from(paper, inA);

        const typeSpeed = opts.typeSpeed || 0.04;
        lineData.forEach(({ el, text }) => {
            tl.to(el, {
                duration: text.length * typeSpeed,
                text: text,
                ease: "none",
                onStart: () => el.after(cursor)
            });
        });

        if (opts.out) {
            const outA = this._getAnim({ duration: opts.outDuration || 0.6 }, opts.out);
            tl.to(paper, outA, "+=3");
        }

        this._register(card, tl);
    },

    boom(container, title, opts = {}) {
        const { card, viewport } = this._createCard(container, title, opts.accent);
        const paper = this._createTornPaper(viewport, 1000, 700);

        const stage = document.createElement('div');
        stage.style.width = '100%';
        stage.style.height = '100%';
        stage.style.display = 'flex';
        stage.style.flexDirection = 'column';
        stage.style.alignItems = 'center';
        stage.style.justifyContent = 'center';
        paper.appendChild(stage);

        stage.innerHTML = `
            <div class="anim-boom-v4" style="opacity:0">${opts.word || "BOOM"}</div>
            <div class="anim-lt-sub-v4" style="opacity:0; margin-top:20px;">${opts.subtitle || ""}</div>
        `;
        const word = stage.querySelector('.anim-boom-v4');
        const sub = stage.querySelector('.anim-lt-sub-v4');

        const tl = gsap.timeline({ repeat: -1, repeatDelay: opts.repeatDelay || 2.5 });
        const inA = this._getAnim({ scale: 0, rotate: -20, duration: opts.inDuration || 1, ease: "back.out(1.7)" }, opts.in);
        const outA = this._getAnim({ opacity: 0, scale: 1.1, duration: opts.outDuration || 0.6 }, opts.out);

        tl.from(paper, inA)
            .to(word, { opacity: 1, scale: 1, duration: opts.duration || 0.5, ease: "elastic.out(1, 0.3)" })
            .to(sub, { opacity: 1, y: -10, duration: opts.subtitleDuration || 0.8 }, "-=0.2")
            .to(paper, outA, `+=${opts.holdTime || 4}`);

        this._register(card, tl);
    },

    table(container, title, opts = {}) {
        const { card, viewport } = this._createCard(container, title, opts.accent);
        const paper = this._createTornPaper(viewport, 1400, 900);
        const stage = document.createElement('div');
        stage.style.width = '100%';
        stage.style.padding = '30px';
        paper.appendChild(stage);

        const table = document.createElement('table');
        table.className = 'anim-table-v4';
        const headers = opts.headers || [];
        const rows = opts.rows || [];

        table.innerHTML = `
            <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
            <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
        `;
        stage.appendChild(table);

        const tl = gsap.timeline({ repeat: -1, repeatDelay: opts.repeatDelay || 3 });
        const inA = this._getAnim({ x: 1920, rotate: 5, duration: opts.inDuration || 1.2, ease: "power3.out" }, opts.in);
        tl.from(paper, inA);

        const items = table.querySelectorAll('th, td');
        tl.from(items, { opacity: 0, y: 30, stagger: opts.stagger || 0.1, duration: opts.duration || 0.8, ease: "power2.out" }, "-=0.4");

        if (opts.out) {
            const outA = this._getAnim({ duration: opts.outDuration || 0.6 }, opts.out);
            tl.to(paper, outA, "+=4");
        }

        this._register(card, tl);
    },

    tree(container, title, data, opts = {}) {
        const { card, viewport } = this._createCard(container, title, opts.accent);
        const paper = this._createTornPaper(viewport, 1500, 900);
        const stage = document.createElement('div');
        stage.style.width = '100%';
        stage.style.height = '100%';
        paper.appendChild(stage);

        const tl = gsap.timeline({ repeat: -1, repeatDelay: opts.repeatDelay || 3 });
        const inA = this._getAnim({ opacity: 0, scale: 0.8, duration: opts.inDuration || 1.5, ease: "power2.inOut" }, opts.in);
        tl.from(paper, inA);

        const drawNode = (node, x, y, level) => {
            const circle = document.createElement('div');
            circle.className = 'tree-node';
            circle.style.position = 'absolute';
            circle.style.left = x + 'px';
            circle.style.top = y + 'px';
            circle.style.width = '120px';
            circle.style.height = '120px';
            circle.style.borderRadius = '50%';
            circle.style.border = `4px solid var(--anim-accent)`;
            circle.style.display = 'flex';
            circle.style.alignItems = 'center';
            circle.style.justifyContent = 'center';
            circle.style.fontSize = '2rem';
            circle.style.fontFamily = "'Kalam', cursive";
            circle.textContent = node.symbol;
            stage.appendChild(circle);

            tl.from(circle, { opacity: 0, scale: 0, duration: opts.nodeDuration || 0.6, ease: "back.out(1.5)" }, "-=0.4");

            if (node.children) {
                node.children.forEach((child, idx) => {
                    const cx = x + (idx - (node.children.length - 1) / 2) * 250;
                    const cy = y + 200;

                    const line = document.createElement('div');
                    line.style.position = 'absolute';
                    line.style.background = 'var(--anim-accent)';
                    line.style.height = '2px';
                    line.style.width = '200px';
                    line.style.transformOrigin = 'left center';
                    line.style.left = (x + 60) + 'px';
                    line.style.top = (y + 120) + 'px';
                    const angle = Math.atan2(cy - y, cx - x) * 180 / Math.PI;
                    line.style.transform = `rotate(${angle}deg)`;
                    stage.appendChild(line);

                    tl.from(line, { scaleX: 0, duration: opts.lineDuration || 0.4 }, "-=0.4");
                    drawNode(child, cx, cy, level + 1);
                });
            }
        };

        drawNode(data[0], 700, 150, 0);

        if (opts.out) {
            const outA = this._getAnim({ duration: opts.outDuration || 0.6 }, opts.out);
            tl.to(paper, outA, "+=4");
        }

        this._register(card, tl);
    },

    _createTornPaper(viewport, w = 1200, h = 800) {
        const paper = document.createElement('div');
        paper.className = 'anim-torn-paper';
        paper.style.width = w + 'px';
        paper.style.height = h + 'px';
        paper.style.left = (1920 - w) / 2 + 'px';
        paper.style.top = (1080 - h) / 2 + 'px';

        // More organic jagged edge
        let path = "polygon(";
        const steps = 60;
        const drift = 2.5;
        for (let i = 0; i <= steps; i++) { path += `${(i / steps) * 100}% ${Math.random() * drift}% ,`; }
        for (let i = 0; i <= steps; i++) { path += `${100 - Math.random() * drift}% ${(i / steps) * 100}% ,`; }
        for (let i = steps; i >= 0; i--) { path += `${(i / steps) * 100}% ${100 - Math.random() * drift}% ,`; }
        for (let i = steps; i >= 0; i--) { path += `${Math.random() * drift}% ${(i / steps) * 100}% ,`; }
        path = path.slice(0, -1) + ")";
        paper.style.clipPath = path;

        viewport.appendChild(paper);
        return paper;
    },

    // ── TYPES v7 ──

    flow(container, title, steps, opts = {}) {
        const { card, viewport } = this._createCard(container, title, opts.accent);

        const stage = document.createElement('div');
        stage.style.width = '100%';
        stage.style.height = '100%';
        stage.style.display = 'flex';
        stage.style.alignItems = 'center';
        stage.style.justifyContent = 'center';
        stage.style.gap = '60px';
        viewport.appendChild(stage);

        const tl = gsap.timeline({ repeat: -1, repeatDelay: opts.repeatDelay || 3 });

        steps.forEach((s, i) => {
            const paper = this._createTornPaper(stage, 400, 250);
            paper.style.position = "relative";
            paper.style.left = "auto"; paper.style.top = "auto";
            paper.style.display = "flex"; paper.style.alignItems = "center"; paper.style.justifyContent = "center";
            paper.style.padding = "40px";

            const content = document.createElement('div');
            content.style.fontSize = "2.8rem";
            content.style.color = "var(--anim-accent)";
            content.style.fontFamily = "'Kalam', cursive";
            content.style.fontWeight = "700";
            content.style.lineHeight = "1.2";
            content.style.textAlign = "center";
            content.textContent = s;
            paper.appendChild(content);

            const inA = this._getAnim({
                y: 800,
                rotate: (Math.random() - 0.5) * 15,
                duration: opts.inDuration || 1,
                ease: "back.out(1.2)"
            }, opts.in);

            tl.from(paper, inA, i * (opts.stagger || 0.4));

            if (i < steps.length - 1) {
                const arr = document.createElement('div');
                arr.style.fontSize = '8rem';
                arr.style.color = 'var(--anim-text-dim)';
                arr.style.fontFamily = "'Inter', sans-serif";
                arr.textContent = '→';
                stage.appendChild(arr);
                tl.from(arr, { opacity: 0, scale: 0, duration: opts.arrowDuration || 0.6, ease: "elastic.out(1, 0.5)" }, "-=0.2");
            }
        });

        if (opts.out) {
            const outA = this._getAnim({ duration: opts.outDuration || 0.6 }, opts.out);
            tl.to(stage, outA, "+=4");
        }

        this._register(card, tl);
    },

    lowerThird(container, title, opts = {}) {
        const { card, viewport } = this._createCard(container, title, opts.accent);
        const paper = this._createTornPaper(viewport, 950, 300);
        paper.style.bottom = "80px"; paper.style.left = "80px"; paper.style.top = "auto";

        const stage = document.createElement('div');
        stage.className = 'anim-lt-v4';
        paper.appendChild(stage);

        stage.innerHTML = `
            <div class="anim-lt-name-v4">${opts.name || "Title"}</div>
            <div class="anim-lt-sub-v4" style="opacity:0">${opts.subtitle || "Subtitle"}</div>
        `;
        const sub = stage.querySelector('.anim-lt-sub-v4');

        const tl = gsap.timeline({ repeat: -1, repeatDelay: opts.repeatDelay || 4 });
        const inA = this._getAnim({ y: 200, opacity: 0, duration: opts.inDuration || 1, ease: "power3.out" }, opts.in);
        const outA = this._getAnim({ opacity: 0, scale: 0.9, duration: opts.outDuration || 0.8 }, opts.out);

        tl.from(paper, inA)
            .to(sub, { opacity: 1, duration: opts.subtitleDuration || 1 }, "-=0.2")
            .to(paper, outA, `+=${opts.holdTime || 5}`);

        this._register(card, tl);
    },

    codeReveal(container, title, code, opts = {}) {
        const { card, viewport } = this._createCard(container, title, opts.accent);
        const paper = this._createTornPaper(viewport, 1400, 900);
        const stage = document.createElement('div');
        stage.style.width = '100%';
        stage.style.height = '100%';
        stage.style.padding = "80px";
        paper.appendChild(stage);

        const lineData = code.split('\n').map(line => {
            const el = document.createElement('div');
            el.className = 'anim-typing-line-v4';
            el.textContent = '';
            stage.appendChild(el);
            return { el, text: line || ' ' };
        });

        const tl = gsap.timeline({ repeat: -1, repeatDelay: opts.repeatDelay || 3 });
        const inA = this._getAnim({ y: 1100, rotate: -2, duration: opts.inDuration || 1.2, ease: "power4.out" }, opts.in);
        tl.from(paper, inA);

        const typeSpeed = opts.typeSpeed || 0.03;
        lineData.forEach(({ el, text }) => {
            tl.to(el, { text: text, duration: text.length * typeSpeed, ease: "none" });
        });

        if (opts.out) {
            const outA = this._getAnim({ duration: opts.outDuration || 0.6 }, opts.out);
            tl.to(paper, outA, "+=4");
        }

        this._register(card, tl);
    },

    scroll(container, title, opts = {}) {
        const verse = opts.verse || [];
        const meaning = opts.meaning || [];
        const accent = opts.accent || "var(--anim-accent)";

        const { card, viewport } = this._createCard(container, title, accent);

        const stage = document.createElement('div');
        stage.style.cssText = `
            position:absolute; top:0; left:0; width:1920px; height:1080px;
            display:flex; align-items:center; justify-content:center;
        `;
        viewport.appendChild(stage);

        const scroll = document.createElement('div');
        scroll.style.cssText = `
            position:relative; width:1400px;
            background: linear-gradient(160deg, #f5e6c8 0%, #ede0b5 40%, #e8d6a0 100%);
            border-radius: 8px;
            box-shadow: 0 20px 80px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.5);
            overflow: hidden;
        `;
        stage.appendChild(scroll);

        const rodTop = document.createElement('div');
        rodTop.style.cssText = `
            width:100%; height:48px;
            background: linear-gradient(180deg, #5a3e28 0%, #8b6040 50%, #5a3e28 100%);
            border-radius: 8px 8px 0 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;
        scroll.appendChild(rodTop);

        const verseSection = document.createElement('div');
        verseSection.style.cssText = `padding: 80px 120px 60px; border-bottom: 2px solid rgba(120,80,40,0.3);`;
        scroll.appendChild(verseSection);

        const verseEls = verse.map(line => {
            const el = document.createElement('div');
            el.style.cssText = `
                font-family: 'Kalam', cursive;
                font-size: 3.8rem; font-weight: 700;
                color: #2c1a0a; line-height: 1.7;
                text-shadow: 1px 1px 0 rgba(255,255,255,0.6);
                letter-spacing: 0.03em;
                /* fully clipped right → wipe from left to reveal */
                clip-path: inset(0 100% 0 0);
                will-change: clip-path;
            `;
            el.textContent = line;
            verseSection.appendChild(el);
            return el;
        });

        const divider = document.createElement('div');
        divider.style.cssText = `
            padding: 30px 120px 20px;
            font-family: 'Kalam', cursive; font-size: 2rem;
            color: rgba(90,60,30,0.8); font-style: italic;
            clip-path: inset(0 100% 0 0); will-change: clip-path;
        `;
        divider.textContent = "— नेपाली अर्थ —";
        scroll.appendChild(divider);

        const meaningSection = document.createElement('div');
        meaningSection.style.cssText = `padding: 20px 120px 80px;`;
        scroll.appendChild(meaningSection);

        const meaningEls = meaning.map(line => {
            const el = document.createElement('div');
            el.style.cssText = `
                font-family: 'Kalam', cursive;
                font-size: 3.2rem; font-weight: 400;
                color: #3d2010; line-height: 1.8;
                clip-path: inset(0 100% 0 0);
                will-change: clip-path;
            `;
            el.textContent = line;
            meaningSection.appendChild(el);
            return el;
        });

        const rodBottom = document.createElement('div');
        rodBottom.style.cssText = `
            width:100%; height:48px;
            background: linear-gradient(180deg, #8b6040 0%, #5a3e28 100%);
            border-radius: 0 0 8px 8px;
            box-shadow: 0 -4px 12px rgba(0,0,0,0.4);
        `;
        scroll.appendChild(rodBottom);

        const tl = gsap.timeline({ repeat: -1, repeatDelay: opts.repeatDelay || 4 });

        const inA = this._getAnim({
            y: -1080, scaleY: 0.05, duration: opts.inDuration || 1.8,
            ease: "back.out(1.2)", transformOrigin: "top center"
        }, opts.in);
        tl.from(scroll, inA);

        const wipeDuration = opts.wipeDuration || 1.5;
        verseEls.forEach((el, i) => {
            tl.to(el, {
                clipPath: "inset(0 0% 0 0)",
                duration: wipeDuration,
                ease: "power3.inOut"
            }, i === 0 ? "+=0.3" : `-=${wipeDuration * 0.46}`);
        });

        tl.to(divider, {
            clipPath: "inset(0 0% 0 0)",
            duration: opts.dividerDuration || 1,
            ease: "power2.inOut"
        }, "+=0.4");

        const meaningWipeDuration = opts.meaningWipeDuration || 1.2;
        meaningEls.forEach((el, i) => {
            tl.to(el, {
                clipPath: "inset(0 0% 0 0)",
                duration: meaningWipeDuration,
                ease: "power2.out"
            }, i === 0 ? "+=0.2" : `-=${meaningWipeDuration * 0.5}`);
        });

        const outA = this._getAnim({
            y: 1300, opacity: 0, duration: opts.outDuration || 1.5, ease: "power3.in"
        }, opts.out);
        tl.to(scroll, outA, `+=${opts.holdTime || 5}`);

        this._register(card, tl);
    },

    from(selector, type, opts = {}) {
        const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (!el) return console.warn(`Anim.from: Element ${selector} not found`);

        const container = document.createElement('div');
        container.className = 'anim-container-wrapper';
        el.parentNode.insertBefore(container, el);

        let data = null;
        if (type === 'typing3d' || type === 'flow') {
            data = Array.from(el.querySelectorAll('li')).map(li => li.innerText.trim());
        } else if (type === 'table') {
            const headers = Array.from(el.querySelectorAll('th')).map(th => th.innerText.trim());
            const rows = Array.from(el.querySelectorAll('tbody tr')).map(tr => 
                Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim())
            );
            data = { headers, rows };
        } else if (type === 'codeReveal') {
            data = el.innerText.trim();
        }

        // Hide original
        el.style.display = 'none';

        // Call the appropriate method
        if (type === 'typing3d') {
            this.typing3d(container, opts.title || "List", data, opts);
        } else if (type === 'table') {
            this.table(container, opts.title || "Table", { ...data, ...opts });
        } else if (type === 'flow') {
            this.flow(container, opts.title || "Flow", data, opts);
        } else if (type === 'codeReveal') {
            this.codeReveal(container, opts.title || "Code", data, opts);
        } else if (type === 'boom') {
            this.boom(container, opts.title || "Impact", { word: el.innerText.trim(), ...opts });
        }

        return container;
    }
};
