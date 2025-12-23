import { languages, modes } from './data.js';

const translations = {
    en: {
        nav_keywords: "Keywords",
        nav_snippets: "Snippets",
        nav_full: "Full Code",
        nav_custom: "Custom",
        stat_wpm: "WPM",
        stat_acc: "ACCURACY",
        overlay_start: "Click to Start",
        label_size: "Size:",
        label_lang: "Language:",
        btn_restart: "Restart",
        modal_title: "Paste Your Code",
        placeholder_custom: "Paste code snippet here...",
        btn_cancel: "Cancel",
        btn_start: "Start Practice"
    },
    zh: {
        nav_keywords: "关键词",
        nav_snippets: "代码片段",
        nav_full: "完整代码",
        nav_custom: "自定义",
        stat_wpm: "速度 (WPM)",
        stat_acc: "准确率",
        overlay_start: "点击开始",
        label_size: "字体大小:",
        label_lang: "编程语言:",
        btn_restart: "重新开始",
        modal_title: "粘贴代码",
        placeholder_custom: "在此处粘贴代码...",
        btn_cancel: "取消",
        btn_start: "开始练习"
    }
};

class CodeDash {
    constructor() {
        this.dom = {
            codeDisplay: document.getElementById('code-display'),
            wpmSelect: document.getElementById('wpm'),
            accSelect: document.getElementById('accuracy'),
            langSelect: document.getElementById('language-select'),
            modeBtns: document.querySelectorAll('.nav-btn[data-mode]'),
            restartBtn: document.getElementById('restart-btn'),
            restartText: document.querySelector('#restart-btn span'),
            overlay: document.getElementById('overlay'),

            // UI Language
            langBtn: document.getElementById('lang-btn'),

            // Theme
            themeBtn: document.getElementById('theme-btn'),

            // Controls
            fontSizeSlider: document.getElementById('font-size-slider'),

            // Custom Modal
            modal: document.getElementById('custom-code-modal'),
            modalInput: document.getElementById('custom-input'),
            modalStart: document.getElementById('start-custom-btn'),
            modalCancel: document.getElementById('cancel-custom-btn')
        };

        this.state = {
            mode: 'keywords',
            lang: 'python',
            text: '',
            userInput: '',
            startTime: null,
            timer: null,
            errors: 0,
            isGameActive: false,
            totalCharsTyped: 0,

            customText: '',
            theme: localStorage.getItem('theme') || 'light',
            fontSize: localStorage.getItem('fontSize') || '1.5',
            uiLang: localStorage.getItem('uiLang') || 'zh'
        };

        this.init();
    }

    init() {
        // UI Language Init
        this.applyUILanguage(this.state.uiLang);
        this.dom.langBtn.addEventListener('click', () => this.cycleUILanguage());

        // Theme Init
        this.applyTheme(this.state.theme);
        this.dom.themeBtn.addEventListener('click', () => this.cycleTheme());

        // Font Size Init
        this.dom.fontSizeSlider.value = this.state.fontSize;
        this.applyFontSize(this.state.fontSize);
        this.dom.fontSizeSlider.addEventListener('input', (e) => {
            this.state.fontSize = e.target.value;
            this.applyFontSize(this.state.fontSize);
            localStorage.setItem('fontSize', this.state.fontSize);
        });

        // Custom Select Init
        this.initCustomSelect();

        // Event Listeners
        window.addEventListener('keydown', (e) => this.handleInput(e));

        // CLICK TO START
        this.dom.codeDisplay.addEventListener('click', () => {
            if (!this.state.isGameActive) {
                this.startGame();
            }
        });

        this.dom.langSelect.addEventListener('change', (e) => this.changeLanguage(e.target.value));
        this.dom.modeBtns.forEach(btn =>
            btn.addEventListener('click', (e) => this.changeMode(e.target))
        );
        this.dom.restartBtn.addEventListener('click', () => this.resetGame());

        // Modal Listeners
        this.dom.modalStart.addEventListener('click', () => this.confirmCustomMode());
        this.dom.modalCancel.addEventListener('click', () => this.closeModal());

        this.resetGame();
    }

    // --- Custom Select Logic ---
    initCustomSelect() {
        const select = this.dom.langSelect;
        // Check if already initialized to avoid duplication on re-runs (though init is only called once)
        if (select.parentNode.classList.contains('custom-select-wrapper')) return;

        // Create Wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);

        // Structure
        const customSelect = document.createElement('div');
        customSelect.className = 'custom-select';

        const trigger = document.createElement('div');
        trigger.className = 'custom-select__trigger';
        // Initial text
        const selectedOption = select.options[select.selectedIndex];
        trigger.innerHTML = `<span>${selectedOption.textContent}</span><div class="arrow"></div>`;

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-options';

        // Populate Options
        Array.from(select.options).forEach(option => {
            const customOption = document.createElement('div');
            customOption.className = 'custom-option';
            customOption.textContent = option.textContent;
            customOption.dataset.value = option.value;

            if (option.selected) customOption.classList.add('selected');

            customOption.addEventListener('click', () => {
                // Update Select Value
                select.value = customOption.dataset.value;

                // Update Custom UI
                trigger.querySelector('span').textContent = customOption.textContent;
                customSelect.querySelectorAll('.custom-option').forEach(el => el.classList.remove('selected'));
                customOption.classList.add('selected');
                customSelect.classList.remove('open');

                // Trigger Change Event
                select.dispatchEvent(new Event('change'));
            });

            optionsContainer.appendChild(customOption);
        });

        customSelect.appendChild(trigger);
        customSelect.appendChild(optionsContainer);
        wrapper.appendChild(customSelect);

        // Toggle Logic
        trigger.addEventListener('click', (e) => {
            customSelect.classList.toggle('open');
            e.stopPropagation(); // Prevent closing immediately
        });

        // Close on click outside
        window.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove('open');
            }
        });
    }

    // --- UI Language Logic ---
    cycleUILanguage() {
        this.state.uiLang = this.state.uiLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('uiLang', this.state.uiLang);
        this.applyUILanguage(this.state.uiLang);
        if (!this.state.isGameActive) {
            this.dom.overlay.textContent = translations[this.state.uiLang].overlay_start;
        }
    }

    applyUILanguage(lang) {
        const t = translations[lang];
        this.dom.langBtn.textContent = lang === 'zh' ? 'EN' : '中';

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (t[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = t[key];
                } else {
                    if (el.id === 'restart-btn') {
                        const span = el.querySelector('span');
                        if (span) span.textContent = t[key];
                    } else if (el.id === 'footer-text') {
                        const link = el.querySelector('a');
                        el.childNodes[0].nodeValue = t[key] + ' ';
                    } else {
                        el.textContent = t[key];
                    }
                }
            }
        });
    }

    // --- Theme Logic ---
    cycleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.state.theme);
        this.applyTheme(this.state.theme);
    }

    applyTheme(theme) {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        this.dom.themeBtn.innerHTML = this.getThemeIcon(theme);
    }

    // --- Font Size Logic ---
    applyFontSize(size) {
        document.documentElement.style.setProperty('--font-size', `${size}rem`);
        if (this.cursorEl) {
            this.updateCursorPosition(this.state.userInput.length);
        }
    }

    getThemeIcon(theme) {
        if (theme !== 'dark') {
            // Sun icon for Light Mode (shows 'toggle to dark') or just current state representation?
            // Usually button shows what it IS or what it WILL BE. 
            // Existing code: light returns sun, dark returns moon.
            return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        } else {
            // Moon icon for Dark Mode
            return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        }
    }

    // --- Mode Logic ---
    changeMode(btn) {
        const mode = btn.dataset.mode;
        if (mode === 'custom') {
            this.dom.modal.classList.remove('hidden-modal');
            this.dom.modalInput.focus();
        } else {
            this.dom.modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.state.mode = mode;
            this.resetGame();
        }
    }

    confirmCustomMode() {
        const text = this.dom.modalInput.value.trim();
        if (!text) return;

        this.state.customText = text;
        this.closeModal();

        this.dom.modeBtns.forEach(b => b.classList.remove('active'));
        const customBtn = Array.from(this.dom.modeBtns).find(b => b.dataset.mode === 'custom');
        if (customBtn) customBtn.classList.add('active');

        this.state.mode = 'custom';
        this.resetGame();
    }

    closeModal() {
        this.dom.modal.classList.add('hidden-modal');
    }

    changeLanguage(lang) {
        this.state.lang = lang;
        if (this.state.mode !== 'custom') {
            this.resetGame();
        }
    }

    resetGame() {
        clearInterval(this.state.timer);
        this.state.isGameActive = false;
        this.state.userInput = '';
        this.state.startTime = null;
        this.state.errors = 0;
        this.state.timer = null;
        this.state.totalCharsTyped = 0;

        this.dom.wpmSelect.textContent = '0';
        this.dom.accSelect.textContent = '100%';
        this.dom.overlay.classList.remove('hidden');

        this.dom.overlay.textContent = translations[this.state.uiLang].overlay_start;

        this.loadContent();
        this.renderText();
    }

    loadNextLevel() {
        this.state.userInput = '';
        if (this.state.mode === 'custom') {
        } else {
            this.loadContent();
        }
        this.renderText();
    }

    loadContent() {
        if (this.state.mode === 'custom') {
            this.state.text = this.state.customText || "Paste some code to start!";
            return;
        }

        const langData = languages[this.state.lang];
        if (!langData) return;

        let pool = langData.full;
        if (this.state.mode === 'keywords') pool = langData.keywords;
        else if (this.state.mode === 'snippets') pool = langData.snippets;

        this.state.text = pool[Math.floor(Math.random() * pool.length)];
    }

    renderText() {
        this.dom.codeDisplay.innerHTML = '';
        this.dom.codeDisplay.appendChild(this.dom.overlay);

        const cleanText = this.state.text.replace(/\r\n/g, '\n');
        this.state.text = cleanText;

        const chars = cleanText.split('').map(char => {
            const span = document.createElement('span');
            span.dataset.original = char;
            if (char === '\n') {
                span.textContent = '↵';
                span.className = 'char newline';
            } else {
                span.textContent = char;
                span.className = 'char';
            }
            return span;
        });

        chars.forEach(c => {
            this.dom.codeDisplay.appendChild(c);
            if (c.dataset.original === '\n') {
                this.dom.codeDisplay.appendChild(document.createTextNode('\n'));
            }
        });

        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        this.dom.codeDisplay.appendChild(cursor);
        this.cursorEl = cursor;
        this.updateCursorPosition(0);

        this.dom.codeDisplay.scrollTop = 0;
    }

    startGame() {
        this.state.isGameActive = true;
        this.state.startTime = Date.now();
        this.dom.overlay.classList.add('hidden');
        this.state.timer = setInterval(() => this.updateStats(), 100);
    }

    handleInput(e) {
        if (this.dom.modal.classList.contains('hidden-modal') === false) return;

        if (e.ctrlKey || e.altKey || e.metaKey) return;

        if (!this.state.isGameActive && e.key === 'Enter') {
            this.startGame();
            return;
        }
        if (!this.state.isGameActive) return;
        if (e.key === ' ' || e.key === 'Enter') e.preventDefault();

        const charEls = this.dom.codeDisplay.querySelectorAll('.char');
        const currentIndex = this.state.userInput.length;

        if (e.key === 'Backspace') {
            if (currentIndex > 0) {
                this.state.userInput = this.state.userInput.slice(0, -1);
                const prevCharEl = charEls[currentIndex - 1];
                prevCharEl.classList.remove('correct', 'incorrect');
                if (prevCharEl.dataset.original === '\n') prevCharEl.textContent = '↵';
                else prevCharEl.textContent = prevCharEl.dataset.original;
                this.updateCursorPosition(currentIndex - 1);
            }
            return;
        }

        if (e.key.length !== 1 && e.key !== 'Enter') return;

        if (currentIndex < this.state.text.length) {
            const targetChar = this.state.text[currentIndex];
            let inputChar = e.key === 'Enter' ? '\n' : e.key;
            this.state.userInput += inputChar;
            const currentEl = charEls[currentIndex];

            if (inputChar === targetChar) {
                currentEl.classList.add('correct');

                if (inputChar === '\n') {
                    let nextIdx = currentIndex + 1;
                    while (nextIdx < this.state.text.length && this.state.text[nextIdx] === ' ') {
                        this.state.userInput += ' ';
                        const spaceEl = charEls[nextIdx];
                        if (spaceEl) spaceEl.classList.add('correct');
                        nextIdx++;
                    }
                }
            } else {
                currentEl.classList.add('incorrect');
                if (inputChar !== '\n') currentEl.textContent = inputChar === ' ' ? '·' : inputChar;
                this.state.errors++;
                this.dom.codeDisplay.classList.add('shake');
                setTimeout(() => this.dom.codeDisplay.classList.remove('shake'), 300);
            }
            this.updateCursorPosition(this.state.userInput.length);
            if (this.state.userInput.length === this.state.text.length) {
                this.state.totalCharsTyped += this.state.userInput.length;
                this.loadNextLevel();
            }
        }
    }

    updateCursorPosition(index) {
        const charEls = this.dom.codeDisplay.querySelectorAll('.char');
        if (index >= charEls.length) return;
        const targetChar = charEls[index];
        const rect = targetChar.getBoundingClientRect();
        const containerRect = this.dom.codeDisplay.getBoundingClientRect();
        this.cursorEl.style.transform = `translate(${rect.left - containerRect.left}px, ${rect.top - containerRect.top}px)`;

        targetChar.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }

    updateStats() {
        if (!this.state.startTime) return;
        const timeElapsed = (Date.now() - this.state.startTime) / 1000 / 60;
        const totalTyped = this.state.totalCharsTyped + this.state.userInput.length;
        const wpm = Math.round((totalTyped / 5) / timeElapsed) || 0;
        const accuracy = Math.max(0, Math.round(((totalTyped) / (totalTyped + this.state.errors)) * 100)) || 100;
        this.dom.wpmSelect.textContent = isFinite(wpm) ? wpm : 0;
        this.dom.accSelect.textContent = `${accuracy}%`;
    }
}
new CodeDash();
