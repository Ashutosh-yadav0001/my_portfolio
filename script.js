document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. REVEAL ANIMATIONS (.anim-reveal)
    // =============================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const delay = parseFloat(e.target.style.getPropertyValue('--delay') || '0') * 1000;
                setTimeout(() => e.target.classList.add('visible'), delay);
                revealObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.anim-reveal').forEach(el => revealObserver.observe(el));

    // Also handle old .fade-in class
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                fadeObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

    // =============================================
    // 2. TYPEWRITER
    // =============================================
    class TypeWriter {
        constructor(el, phrases, typeSpeed = 70, deleteSpeed = 35, pauseTime = 2000) {
            this.el = el;
            this.phrases = phrases;
            this.typeSpeed = typeSpeed;
            this.deleteSpeed = deleteSpeed;
            this.pauseTime = pauseTime;
            this.phraseIndex = 0;
            this.charIndex = 0;
            this.isDeleting = false;
            this.tick();
        }
        tick() {
            const current = this.phrases[this.phraseIndex];
            if (this.isDeleting) {
                this.el.textContent = current.slice(0, --this.charIndex);
            } else {
                this.el.textContent = current.slice(0, ++this.charIndex);
            }
            let delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
            if (!this.isDeleting && this.charIndex === current.length) {
                delay = this.pauseTime;
                this.isDeleting = true;
            } else if (this.isDeleting && this.charIndex === 0) {
                this.isDeleting = false;
                this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
                delay = 400;
            }
            setTimeout(() => this.tick(), delay);
        }
    }

    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        new TypeWriter(typedEl, [
            '3 Years Enterprise Automation Experience',
            'ServiceNow & Intune Specialist',
            'B.Sc. DS & AI — IIT Guwahati',
            'Deep Learning & AI/ML Developer',
            'PowerShell & Workflow Automation',
        ], 70, 35, 2000);
    }

    // =============================================
    // 3. ANIMATED STATS COUNTER
    // =============================================
    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const startTime = performance.now();
        function update(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);
            el.textContent = (target >= 1000 ? value.toLocaleString() : value) + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('.stat-number[data-target]').forEach(animateCounter);
                statsObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.4 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) statsObserver.observe(statsSection);

    // =============================================
    // 4. TERMINAL TYPING ANIMATION
    // =============================================
    const terminalLines = document.getElementById('terminalLines');

    const script = [
        { type: 'prompt', text: 'PS C:\\Automation> ' },
        { type: 'cmd', text: 'Get-IntuneManagedDevice | Where-Object {$_.complianceState -eq "noncompliant"}', pause: 65 },
        { type: 'newline' },
        { type: 'output', text: 'Connecting to Microsoft Graph API...', delay: 300 },
        { type: 'success', text: '[✓] Authenticated — Tenant: global-client.onmicrosoft.com', delay: 200 },
        { type: 'warn',    text: '[!] Found 47 non-compliant devices', delay: 150 },
        { type: 'newline' },
        { type: 'prompt', text: 'PS C:\\Automation> ' },
        { type: 'cmd', text: 'Invoke-IntuneDeviceAction -Action Sync -DeviceIds $devices', pause: 65 },
        { type: 'newline' },
        { type: 'success', text: '[✓] Sync triggered on 47 devices', delay: 200 },
        { type: 'success', text: '[✓] Compliance policies re-applied', delay: 150 },
        { type: 'output', text: '    Processing...  3.2s', delay: 500 },
        { type: 'success', text: '[✓] 47/47 devices synced & compliant', delay: 200 },
        { type: 'newline' },
        { type: 'prompt', text: 'PS C:\\Automation> ' },
        { type: 'cmd', text: 'Close-ServiceNowTicket -Id "INC0098234" -Resolution "Auto-remediated"', pause: 65 },
        { type: 'newline' },
        { type: 'success', text: '[✓] INC0098234 resolved — SLA met (3.2h / 4h target)', delay: 200 },
        { type: 'blue',    text: '    Manual effort saved: 0 min  (fully automated ✓)', delay: 150 },
        { type: 'newline' },
        { type: 'prompt', text: 'PS C:\\Automation> ' },
    ];

    function renderLine(item) {
        return new Promise(resolve => {
            if (!terminalLines) return resolve();
            if (item.type === 'newline') {
                terminalLines.innerHTML += '<br>';
                return resolve();
            }
            const colorMap = { prompt:'t-prompt', cmd:'t-cmd', output:'t-output', success:'t-success', warn:'t-warn', blue:'t-blue' };
            const cls = colorMap[item.type] || 't-output';

            if (item.type === 'cmd') {
                const span = document.createElement('span');
                span.className = cls;
                terminalLines.appendChild(span);
                let i = 0;
                function typeChar() {
                    if (i < item.text.length) {
                        span.textContent += item.text[i++];
                        const body = document.getElementById('terminalBody');
                        if (body) body.scrollTop = body.scrollHeight;
                        setTimeout(typeChar, item.pause || 65);
                    } else {
                        terminalLines.innerHTML += '<br>';
                        resolve();
                    }
                }
                typeChar();
            } else {
                setTimeout(() => {
                    terminalLines.innerHTML += `<span class="${cls}">${item.text}</span><br>`;
                    const body = document.getElementById('terminalBody');
                    if (body) body.scrollTop = body.scrollHeight;
                    resolve();
                }, item.delay || 100);
            }
        });
    }

    async function runTerminal() {
        if (!terminalLines) return;
        terminalLines.innerHTML = '';
        for (const item of script) await renderLine(item);
        setTimeout(runTerminal, 3500);
    }

    const termSection = document.querySelector('#automation');
    if (termSection) {
        const termObs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { runTerminal(); termObs.disconnect(); }
        }, { threshold: 0.3 });
        termObs.observe(termSection);
    }

    // =============================================
    // 5. HAMBURGER MENU
    // =============================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            navLinks.classList.toggle('active'); // support both class names
            const icon = hamburger.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('open', 'active');
                const icon = hamburger.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            });
        });
    }

    // =============================================
    // 6. ACTIVE NAV ON SCROLL
    // =============================================
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navAnchors.forEach(a => a.classList.remove('nav-active'));
                const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
                if (active) active.classList.add('nav-active');
            }
        });
    }, { threshold: 0.4 });
    sections.forEach(s => navObserver.observe(s));

    // =============================================
    // 7. HEADER SHRINK
    // =============================================
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 60));
    }

    // =============================================
    // 8. CONTACT FORM — Formspree
    // =============================================
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            btn.textContent = 'Sending...';
            btn.disabled = true;

            const data = new FormData(form);
            try {
                const res = await fetch('https://formspree.io/f/xdkojpqv', {
                    method: 'POST', body: data,
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    form.reset();
                    if (formSuccess) { formSuccess.style.display = 'flex'; setTimeout(() => formSuccess.style.display = 'none', 4000); }
                } else {
                    alert('Failed to send. Please email ay346285@gmail.com directly.');
                }
            } catch {
                alert('Failed to send. Please email ay346285@gmail.com directly.');
            }
            btn.textContent = 'Send Message';
            btn.disabled = false;
        });
    }

    // =============================================
    // 9. SMOOTH SCROLL
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });

    // =============================================
    // 10. YEAR + SOUND TOGGLE
    // =============================================
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            const icon = soundBtn.querySelector('i');
            icon.classList.toggle('fa-volume-mute');
            icon.classList.toggle('fa-volume-up');
        });
    }

    // =============================================
    // 11. BACK TO TOP BUTTON
    // =============================================
    const backTop = document.createElement('button');
    backTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backTop.id = 'backToTop';
    backTop.setAttribute('aria-label', 'Back to top');
    backTop.style.cssText = `
        position:fixed; bottom:28px; right:28px; z-index:999;
        background:var(--accent-primary); color:#fff; border:none;
        width:40px; height:40px; border-radius:50%; cursor:pointer;
        font-size:0.9rem; display:none; align-items:center; justify-content:center;
        transition:opacity 0.3s; box-shadow:0 2px 8px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(backTop);
    window.addEventListener('scroll', () => {
        backTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
    });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

});
