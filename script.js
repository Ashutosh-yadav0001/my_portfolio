document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // TYPEWRITER
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
    // SCROLL REVEAL
    // =============================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const delay = e.target.style.getPropertyValue('--delay') || '0s';
                setTimeout(() => e.target.classList.add('visible'),
                    parseFloat(delay) * 1000);
                revealObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.anim-reveal').forEach(el => revealObserver.observe(el));

    // =============================================
    // HEADER SHRINK ON SCROLL
    // =============================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    });

    // =============================================
    // ANIMATED STATS COUNTER
    // =============================================
    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const startTime = performance.now();

        function update(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const value = Math.floor(eased * target);
            if (target >= 1000) {
                el.textContent = value.toLocaleString() + suffix;
            } else {
                el.textContent = value + suffix;
            }
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
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) statsObserver.observe(statsSection);

    // =============================================
    // TERMINAL TYPING ANIMATION
    // =============================================
    const terminalLines = document.getElementById('terminalLines');
    const termCursor = document.getElementById('termCursor');

    const script = [
        { type: 'prompt', text: 'PS C:\\Automation> ' },
        { type: 'cmd', text: 'Get-IntuneManagedDevice | Where-Object {$_.complianceState -eq "noncompliant"}', pause: 80 },
        { type: 'newline' },
        { type: 'output', text: 'Connecting to Microsoft Graph API...', delay: 300 },
        { type: 'success', text: '[✓] Authenticated — Tenant: global-client.onmicrosoft.com', delay: 200 },
        { type: 'warn',    text: '[!] Found 47 non-compliant devices', delay: 150 },
        { type: 'newline' },
        { type: 'prompt', text: 'PS C:\\Automation> ' },
        { type: 'cmd', text: 'Invoke-IntuneDeviceAction -Action Sync -DeviceIds $devices', pause: 80 },
        { type: 'newline' },
        { type: 'success', text: '[✓] Sync triggered on 47 devices', delay: 200 },
        { type: 'success', text: '[✓] Compliance policies re-applied', delay: 150 },
        { type: 'output', text: '    Processing...  3.2s', delay: 400 },
        { type: 'success', text: '[✓] 47/47 devices synced & compliant', delay: 200 },
        { type: 'newline' },
        { type: 'prompt', text: 'PS C:\\Automation> ' },
        { type: 'cmd', text: 'Close-ServiceNowTicket -IncidentId "INC0098234" -Resolution "Auto-remediated"', pause: 70 },
        { type: 'newline' },
        { type: 'success', text: '[✓] INC0098234 resolved — SLA met (3.2h / 4h target)', delay: 200 },
        { type: 'blue',    text: '    Total manual effort saved: 0 minutes (fully automated)', delay: 150 },
        { type: 'newline' },
        { type: 'prompt', text: 'PS C:\\Automation> ' },
    ];

    let lineIndex = 0;

    function renderLine(item, charIndex = 0) {
        return new Promise(resolve => {
            if (item.type === 'newline') {
                terminalLines.innerHTML += '<br>';
                return resolve();
            }

            const colorMap = {
                prompt: 't-prompt', cmd: 't-cmd', output: 't-output',
                success: 't-success', warn: 't-warn', blue: 't-blue'
            };
            const cls = colorMap[item.type] || 't-output';

            if (item.type === 'cmd') {
                // Type character by character
                const span = document.createElement('span');
                span.className = cls;
                terminalLines.appendChild(span);

                let i = 0;
                function typeChar() {
                    if (i < item.text.length) {
                        span.textContent += item.text[i++];
                        setTimeout(typeChar, item.pause || 60);
                    } else {
                        terminalLines.innerHTML += '<br>';
                        resolve();
                    }
                }
                typeChar();
            } else {
                // Appear with delay
                setTimeout(() => {
                    terminalLines.innerHTML += `<span class="${cls}">${item.text}</span><br>`;
                    resolve();
                }, item.delay || 100);
            }
        });
    }

    async function runTerminal() {
        for (const item of script) {
            await renderLine(item);
            // Auto-scroll terminal
            const body = document.getElementById('terminalBody');
            if (body) body.scrollTop = body.scrollHeight;
        }
        // Loop after pause
        setTimeout(() => {
            terminalLines.innerHTML = '';
            runTerminal();
        }, 4000);
    }

    // Start terminal when section is visible
    const terminalSection = document.querySelector('.terminal-section');
    if (terminalSection) {
        const termObs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                runTerminal();
                termObs.disconnect();
            }
        }, { threshold: 0.3 });
        termObs.observe(terminalSection);
    }

    // =============================================
    // HAMBURGER
    // =============================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const icon = hamburger.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            });
        });
    }

    // =============================================
    // CONTACT FORM
    // =============================================
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            btn.textContent = 'Sending...';
            btn.disabled = true;
            setTimeout(() => {
                form.reset();
                btn.textContent = 'Send Message';
                btn.disabled = false;
                formSuccess.style.display = 'flex';
                setTimeout(() => formSuccess.style.display = 'none', 4000);
            }, 1200);
        });
    }

    // =============================================
    // YEAR
    // =============================================
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // =============================================
    // SMOOTH SCROLL
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // =============================================
    // SOUND TOGGLE (keep muted by default)
    // =============================================
    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            const icon = soundBtn.querySelector('i');
            icon.classList.toggle('fa-volume-mute');
            icon.classList.toggle('fa-volume-up');
        });
    }

});
