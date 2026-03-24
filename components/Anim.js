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

    _createTornPaper(viewport, w = 1200, h = 800) {
        const paper = document.createElement('div');
        paper.className = 'anim-torn-paper';
        paper.style.width = w + 'px';
        paper.style.height = h + 'px';
        paper.style.left = (1920 - w) / 2 + 'px';
        paper.style.top = (1080 - h) / 2 + 'px';

        // Generate jagged edge
        let path = "polygon(";
        const steps = 40;
        for(let i=0; i<=steps; i++) { path += `${(i/steps)*100}% ${Math.random()*2}% ,`; } // top
        for(let i=0; i<=steps; i++) { path += `${100-Math.random()*2}% ${(i/steps)*100}% ,`; } // right
        for(let i=steps; i>=0; i--) { path += `${(i/steps)*100}% ${100-Math.random()*2}% ,`; } // bottom
        for(let i=steps; i>=0; i--) { path += `${Math.random()*2}% ${(i/steps)*100}% ,`; } // left
        path = path.slice(0, -1) + ")";
        paper.style.clipPath = path;

        viewport.appendChild(paper);
        return paper;
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

        const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1.5 });
        tl.from(paper, { y: 1200, rotate: 5, duration: 1.5, ease: "expo.out" });
        this._sketch(tl, stage, 1.8);
        tl.to(label, { opacity: 1, y: -10, duration: 1, ease: "power2.out" }, "-=0.8")
          .to(mascot, { y: -20, duration: 2.5, ease: "sine.inOut" }, "-=1.5");

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

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
        tl.from(paper, { y: -1200, rotate: -3, duration: 1.4, ease: "power4.out" });
        
        lineData.forEach(({ el, text }) => {
            tl.to(el, {
                duration: text.length * 0.04,
                text: text,
                ease: "none",
                onStart: () => el.after(cursor)
            });
        });

        this._register(card, tl);
    },

    boom(container, title, opts = {}) {
        const { card, viewport } = this._createCard(container, title, opts.accent);
        const paper = this._createTornPaper(viewport, 900, 600);
        const stage = document.createElement('div');
        stage.style.width = '100%';
        stage.style.height = '100%';
        stage.style.display = 'flex';
        stage.style.flexDirection = 'column';
        stage.style.alignItems = 'center';
        stage.style.justifyContent = 'center';
        paper.appendChild(stage);

        const wordEl = document.createElement('div');
        wordEl.className = 'anim-boom-v4';
        wordEl.textContent = opts.word || "BOOM";
        stage.appendChild(wordEl);

        const subEl = document.createElement('div');
        subEl.className = 'anim-lt-sub-v4';
        subEl.style.opacity = '0';
        subEl.style.marginTop = '20px';
        subEl.textContent = opts.subtitle || "";
        stage.appendChild(subEl);

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        tl.from(paper, { scale: 0, rotate: 15, duration: 1, ease: "back.out(1.7)" })
          .from(wordEl, { opacity:0, scale: 0.5, duration: 0.8, ease: "elastic.out(1, 0.5)" }, "-=0.2")
          .to(subEl, { opacity: 1, y: -10, duration: 0.8 }, "-=0.4");

        this._register(card, tl);
    },

    table(container, title, opts = {}) {
        const { card, viewport } = this._createCard(container, title, opts.accent);
        const paper = this._createTornPaper(viewport, 1300, 750);
        const headers = opts.headers || [];
        const rows = opts.rows || [];

        const stage = document.createElement('div');
        stage.style.width = '100%';
        stage.style.height = '100%';
        stage.style.display = 'flex';
        stage.style.alignItems = 'center';
        stage.style.justifyContent = 'center';
        paper.appendChild(stage);

        const table = document.createElement('table');
        table.className = 'anim-table-v4';
        
        let html = '<thead><tr>';
        headers.forEach(h => html += `<th style="opacity:0">${h}</th>`);
        html += '</tr></thead><tbody>';
        rows.forEach(row => {
            html += '<tr>';
            row.forEach(cell => html += `<td style="opacity:0">${cell}</td>`);
            html += '</tr>';
        });
        html += '</tbody>';
        table.innerHTML = html;
        stage.appendChild(table);

        const ths = table.querySelectorAll('th');
        const tds = table.querySelectorAll('td');

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
        tl.from(paper, { y: -1000, duration: 1.2, ease: "bounce.out" })
          .to(ths, { opacity: 1, duration: 0.8, stagger: 0.1 })
          .to(tds, { 
            opacity: 1, 
            duration: 0.5, 
            stagger: 0.05,
            onStart: function() { this.targets().forEach(t => t.style.filter = 'var(--anim-ink-filter)'); }
          }, "-=0.3");

        this._register(card, tl);
    },

    tree(container, title, nodes, opts = {}) {
        const { card, viewport } = this._createCard(container, title, opts.accent);
        const paper = this._createTornPaper(viewport, 1400, 850);
        
        const stage = document.createElement('div');
        stage.style.width = '100%';
        stage.style.height = '100%';
        paper.appendChild(stage);

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 1600 800");
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.className.baseVal = "anim-ink-text";
        stage.appendChild(svg);

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        tl.from(paper, { x: 1920, rotate: -3, duration: 1, ease: "power2.out" });

        function drawNode(n, px, py, cx, cy) {
            if (px !== null) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", px); line.setAttribute("y1", py);
                line.setAttribute("x2", cx); line.setAttribute("y2", cy);
                line.setAttribute("stroke", "var(--anim-accent)");
                line.setAttribute("stroke-width", "3.5");
                line.setAttribute("stroke-linecap", "round");
                svg.appendChild(line);
                const len = Math.sqrt((cx-px)**2 + (cy-py)**2);
                tl.fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.8 }, "-=0.6");
            }

            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.innerHTML = `
                <circle class="anim-sketch-path" cx="${cx}" cy="${cy}" r="65" />
                <text x="${cx}" y="${cy}" text-anchor="middle" dy=".3em" fill="var(--anim-accent)" font-size="45" font-family="'Architects Daughter'">${n.symbol || ''}</text>
                <text x="${cx}" y="${cy+110}" text-anchor="middle" fill="var(--anim-text-dim)" font-size="28" font-family="'Gochi Hand'">${n.label}</text>
            `;
            svg.appendChild(g);
            
            const circle = g.querySelector('circle');
            const clen = circle.getTotalLength();
            tl.fromTo(circle, { strokeDasharray: clen, strokeDashoffset: clen }, { strokeDashoffset: 0, duration: 0.6 }, "-=0.5");
            tl.from(g.querySelectorAll('text'), { opacity:0, scale:0, duration: 0.5 }, "-=0.4");

            if (n.children) {
                n.children.forEach((child, i) => {
                    const nextX = cx + (i - (n.children.length-1)/2) * 350;
                    const nextY = cy + 280;
                    drawNode(child, cx, cy, nextX, nextY);
                });
            }
        }

        drawNode(nodes[0], null, null, 800, 150);
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
        for(let i=0; i<=steps; i++) { path += `${(i/steps)*100}% ${Math.random()*drift}% ,`; } 
        for(let i=0; i<=steps; i++) { path += `${100-Math.random()*drift}% ${(i/steps)*100}% ,`; }
        for(let i=steps; i>=0; i--) { path += `${(i/steps)*100}% ${100-Math.random()*drift}% ,`; }
        for(let i=steps; i>=0; i--) { path += `${Math.random()*drift}% ${(i/steps)*100}% ,`; }
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

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });

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

            tl.from(paper, { 
                y: 800, 
                rotate: (Math.random() - 0.5) * 15, 
                duration: 1, 
                ease: "back.out(1.2)" 
            }, i * 0.4);

            if (i < steps.length - 1) {
                const arr = document.createElement('div');
                arr.style.fontSize = '8rem';
                arr.style.color = 'var(--anim-text-dim)';
                arr.style.fontFamily = "'Inter', sans-serif";
                arr.textContent = '→';
                stage.appendChild(arr);
                tl.from(arr, { opacity: 0, scale: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }, "-=0.2");
            }
        });

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

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 4 });
        tl.from(paper, { y: 200, opacity: 0, duration: 1, ease: "power3.out" })
          .to(sub, { opacity: 1, duration: 1 }, "-=0.2")
          .to(paper, { opacity: 0, scale: 0.9, duration: 0.8 }, "+=5");

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

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
        tl.from(paper, { y: 1100, rotate: -2, duration: 1.2, ease: "power4.out" });

        lineData.forEach(({el, text}) => {
            tl.to(el, { text: text, duration: text.length * 0.03, ease: "none" });
        });

        this._register(card, tl);
    },

};
