const loaderFill = document.getElementById('loader-fill');
const loaderPct  = document.getElementById('loader-pct');
const loaderStatus = document.getElementById('loader-status');
const statusMessages = [
    'Booting core modules...', 'Loading visual engine...',
    'Calibrating AI systems...', 'Initializing portfolio...',
    'Warming up aurora renderer...', 'System ready.'
];
let pct = 0;
const loaderInterval = setInterval(() => {
    pct += Math.random() * 12 + 4;
    if (pct > 100) pct = 100;
    loaderFill.style.width = pct + '%';
    loaderPct.textContent = Math.floor(pct) + '%';
    loaderStatus.textContent = statusMessages[Math.min(Math.floor(pct / 18), statusMessages.length - 1)];
    if (pct >= 100) {
        clearInterval(loaderInterval);
        setTimeout(() => {
            document.getElementById('loader').classList.add('done');
            setTimeout(() => {
                document.getElementById('loader').style.display = 'none';
                checkReveal();
            }, 700);
        }, 300);
    }
}, 100);

const dot  = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
})();
document.querySelectorAll('.interactable, input, button, a').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

let chatOpen = false;
function toggleChat() {
    chatOpen = !chatOpen;
    const panel = document.getElementById('chat-panel');
    const iconOpen  = document.getElementById('chat-toggle-icon');
    const iconClose = document.getElementById('chat-toggle-close');
    if (chatOpen) {
        panel.classList.remove('chat-panel-hidden');
        iconOpen.style.display = 'none';
        iconClose.style.display = 'block';
        document.getElementById('chat-inp').focus();
    } else {
        panel.classList.add('chat-panel-hidden');
        iconOpen.style.display = 'block';
        iconClose.style.display = 'none';
    }
}

const canvas = document.getElementById('aurora-canvas');
const ctx = canvas.getContext('2d');
let W, H, orbs;
const NEONZ_MODE = () => document.body.classList.contains('neonz');

function initAurora() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    orbs = [
        { x: W*0.2, y: H*0.3, r: W*0.35, vx: 0.4, vy: 0.25, hue: 195 },
        { x: W*0.7, y: H*0.6, r: W*0.3,  vx:-0.3, vy: 0.35, hue: 250 },
        { x: W*0.5, y: H*0.1, r: W*0.28, vx: 0.2, vy:-0.28, hue: 175 },
        { x: W*0.1, y: H*0.7, r: W*0.25, vx: 0.5, vy:-0.2,  hue: 220 },
    ];
}
window.addEventListener('resize', initAurora);
initAurora();

let cursorInfluenceX = W/2, cursorInfluenceY = H/2;
document.addEventListener('mousemove', e => {
    cursorInfluenceX = e.clientX;
    cursorInfluenceY = e.clientY;
});
function drawAurora() {
    ctx.clearRect(0, 0, W, H);
    const nz = NEONZ_MODE();
    orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if (o.x - o.r > W) o.x = -o.r;
        if (o.x + o.r < 0) o.x = W + o.r;
        if (o.y - o.r > H) o.y = -o.r;
        if (o.y + o.r < 0) o.y = H + o.r;

        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        if (nz) {
            grad.addColorStop(0, `rgba(255,255,255,0.018)`);
            grad.addColorStop(1, 'transparent');
        } else {
            const alpha = 0.055;
            grad.addColorStop(0, `hsla(${o.hue}, 100%, 60%, ${alpha})`);
            grad.addColorStop(1, 'transparent');
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
    });
    const mg = ctx.createRadialGradient(cursorInfluenceX, cursorInfluenceY, 0, cursorInfluenceX, cursorInfluenceY, 250);
    if (nz) {
        mg.addColorStop(0, 'rgba(255,255,255,0.012)');
    } else {
        mg.addColorStop(0, 'rgba(0,229,255,0.04)');
    }
    mg.addColorStop(1, 'transparent');
    ctx.fillStyle = mg;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(drawAurora);
}
drawAurora();

const nzCanvas = document.getElementById('nz-canvas');
const nzCtx = nzCanvas.getContext('2d');
let nzW, nzH, nzParticles, nzStars;

function initNzCanvas() {
    nzW = nzCanvas.width  = window.innerWidth;
    nzH = nzCanvas.height = window.innerHeight;

    nzParticles = Array.from({ length: 80 }, () => ({
        x: Math.random() * nzW,
        y: Math.random() * nzH,
        len: Math.random() * 60 + 20,
        speed: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.4 + 0.05,
        width: Math.random() * 0.8 + 0.2,
    }));
    nzStars = Array.from({ length: 220 }, () => ({
        x: Math.random() * nzW,
        y: Math.random() * nzH,
        r: Math.random() * 0.9 + 0.1,
        flicker: Math.random() * Math.PI * 2,
        flickerSpeed: Math.random() * 0.02 + 0.005,
    }));
}
window.addEventListener('resize', initNzCanvas);
initNzCanvas();

function drawNzCanvas() {
    nzCtx.clearRect(0, 0, nzW, nzH);
    const vignette = nzCtx.createRadialGradient(nzW/2, nzH/2, nzH*0.1, nzW/2, nzH/2, nzH*0.85);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.85)');
    nzCtx.fillStyle = vignette;
    nzCtx.fillRect(0, 0, nzW, nzH);

    const fogColors = [
        { x: nzW * 0.15, y: nzH * 0.25, r: nzW * 0.4,  h: 'rgba(120,0,255,0.025)' },
        { x: nzW * 0.8,  y: nzH * 0.7,  r: nzW * 0.35, h: 'rgba(255,0,100,0.02)' },
        { x: nzW * 0.5,  y: nzH * 0.1,  r: nzW * 0.3,  h: 'rgba(0,200,255,0.018)' },
    ];
    fogColors.forEach(f => {
        const g = nzCtx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        g.addColorStop(0, f.h);
        g.addColorStop(1, 'transparent');
        nzCtx.fillStyle = g;
        nzCtx.beginPath();
        nzCtx.arc(f.x, f.y, f.r, 0, Math.PI*2);
        nzCtx.fill();
    });
    const mg2 = nzCtx.createRadialGradient(cursorInfluenceX, cursorInfluenceY, 0, cursorInfluenceX, cursorInfluenceY, 300);
    mg2.addColorStop(0, 'rgba(255,255,255,0.018)');
    mg2.addColorStop(1, 'transparent');
    nzCtx.fillStyle = mg2;
    nzCtx.fillRect(0, 0, nzW, nzH);

    const t = performance.now() * 0.001;
    nzStars.forEach(s => {
        s.flicker += s.flickerSpeed;
        const alpha = 0.15 + Math.sin(s.flicker) * 0.12;
        nzCtx.beginPath();
        nzCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        nzCtx.fillStyle = `rgba(255,255,255,${alpha})`;
        nzCtx.fill();
    });
    nzParticles.forEach(p => {
        p.y += p.speed;
        if (p.y > nzH + p.len) { p.y = -p.len; p.x = Math.random() * nzW; }

        const grad = nzCtx.createLinearGradient(p.x, p.y - p.len, p.x, p.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, `rgba(255,255,255,${p.opacity})`);
        nzCtx.strokeStyle = grad;
        nzCtx.lineWidth = p.width;
        nzCtx.beginPath();
        nzCtx.moveTo(p.x, p.y - p.len);
        nzCtx.lineTo(p.x, p.y);
        nzCtx.stroke();
    });
    requestAnimationFrame(drawNzCanvas);
}
drawNzCanvas();

function checkReveal() {
    document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.88) {
            el.classList.add('visible');
            el.querySelectorAll('.skill-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
        }
    });
    document.querySelectorAll('.count-up').forEach(el => {
        const rect = el.closest('.stat-box').getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9 && !el.dataset.animated) {
            el.dataset.animated = '1';
            animCount(el);
        }
    });
}
document.addEventListener('scroll', checkReveal, { passive: true });
window.addEventListener('load', checkReveal);

function animCount(el) {
    const target   = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals) || 0;
    const duration = 1800;
    const start    = performance.now();
    (function step(now) {
        const t   = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        el.textContent = (target * ease).toFixed(decimals);
        if (t < 1) requestAnimationFrame(step);
    })(start);
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
function scramble(el) {
    const target = el.dataset.val || el.textContent;
    let i = 0;
    const iv = setInterval(() => {
        el.textContent = target.split('').map((c, idx) =>
            idx < i ? c : CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('');
        i += 0.5;
        if (i > target.length) { el.textContent = target; clearInterval(iv); }
    }, 35);
}

let currentMode = 'eng';
function switchMode() {
    const overlay = document.getElementById('switch-overlay');
    const soText  = document.getElementById('so-text');
    const soFill  = document.getElementById('so-fill');
    const soLog   = document.getElementById('so-log');
    const body    = document.body;
    const toNz    = currentMode === 'eng';
    currentMode   = toNz ? 'neonz' : 'eng';

    if (toNz) {
        overlay.style.background = '#000';
        soText.style.color = '#fff';
        soFill.style.background = '#fff';
        soFill.style.boxShadow  = '0 0 20px #fff';
        soText.textContent = 'SWITCHING TO NEONZ_PROTOCOL';
    } else {
        overlay.style.background = '#050812';
        soText.style.color = '#00e5ff';
        soFill.style.background = '#00e5ff';
        soFill.style.boxShadow  = '0 0 20px rgba(0,229,255,0.8)';
        soText.textContent = 'REBOOTING AAM_CORE';
    }

    overlay.classList.add('on');
    soFill.style.width = '0%';
    requestAnimationFrame(() => requestAnimationFrame(() => { soFill.style.transition = 'width 1.3s cubic-bezier(0.16,1,0.3,1)'; soFill.style.width = '100%'; }));
    let logIv = setInterval(() => {
        soLog.textContent = '[SYS] 0x' + Math.floor(Math.random()*0xFFFFFF).toString(16).toUpperCase().padStart(6,'0') + ' >> reallocating memory...';
    }, 120);
    setTimeout(() => {
        clearInterval(logIv);
        if (toNz) {
            body.classList.add('neonz');
            document.getElementById('layer-eng').classList.remove('active');
            document.getElementById('layer-neonz').classList.add('active');
            document.getElementById('mbtn-eng').classList.remove('active');
            document.getElementById('mbtn-nz').classList.add('active');
            document.getElementById('nav-brand').textContent = 'NEONZ';
            document.getElementById('chat-widget-name').textContent = 'NEONZ Assistant';
            soLog.textContent = '[SYS] NEONZ Media Engine — Online';
            document.querySelectorAll('.scramble-el').forEach(scramble);
        } else {
            body.classList.remove('neonz');
            document.getElementById('layer-neonz').classList.remove('active');
            document.getElementById('layer-eng').classList.add('active');
            document.getElementById('mbtn-nz').classList.remove('active');
            document.getElementById('mbtn-eng').classList.add('active');
            document.getElementById('nav-brand').textContent = 'ABDULRAHMAN';
            document.getElementById('chat-widget-name').textContent = 'AAM Assistant';
            soLog.textContent = '[SYS] AI Logic Engine — Online';
        }
        checkReveal();
    }, 950);
    setTimeout(() => {
        overlay.classList.remove('on');
        soFill.style.transition = 'none';
    }, 1550);
}

const KB = [
    { kw: ['skill','tech','language','program','stack','code','python','java','c#','r ','sql'], ans: `Abdulrahman's core languages are Python, Java, C#, R, PostgreSQL, and SQL. On the AI side, he specialises in RAG Pipelines, LLM integration, Data Analysis, and Machine Learning.` },
    { kw: ['edu','university','study','degree','apu','gpa','grade','uni'], ans: `He's studying BSc Computer Science (Hons) in Artificial Intelligence at Asia Pacific University (APU), currently holding a GPA of 3.65.` },
    { kw: ['cert','aws','cisco','red hat','certif','qualification'], ans: `Abdulrahman holds three industry certifications: AWS Machine Learning Foundations, Cisco CCNA (Introduction to Networks), and Red Hat System Administration I.` },
    { kw: ['work','experience','job','mentor','admin','career','employ','role'], ans: `He currently works as a Math Mentor at the APU Math Clinic. Previously, he was an Administrative Assistant at Success International School, managing operations and data workflows.` },
    { kw: ['creator','youtube','video','neonz','channel','content','xc'], ans: `He runs xc.neonz on YouTube — video production covering gaming, influencing, entertainment, and a developer series that bridges his tech and creative worlds.` },
    { kw: ['rag','pipeline','llm','ai','machine learning','intelligent','model'], ans: `His key technical focus is building RAG (Retrieval-Augmented Generation) pipelines and integrating LLMs into real applications — from data ingestion all the way through to the retrieval layer.` },
    { kw: ['project','build','built','made','portfolio'], ans: `His projects are showcased on this portfolio! They include work in Python, RAG pipelines, Java, and more. Scroll up to the Projects section for the full breakdown.` },
    { kw: ['contact','email','hire','reach','linkedin','collab','business','partner','ad','sponsor'], ans: `For professional enquiries, reach Abdulrahman at abdulrahman2004an@gmail.com or connect on LinkedIn. For business / creator partnerships, use xcn4ad@gmail.com.` },
    { kw: ['hello','hi','hey','sup','who are you','what are you'], ans: `Hey! I'm AAM-Core — Abdulrahman's personal AI assistant. Ask me about his skills, education, projects, or experience and I'll tell you everything I know.` },
    { kw: ['where','location','based','country','malaysia'], ans: `Abdulrahman is based in Malaysia, studying at Asia Pacific University (APU).` },
];
function askSuggested(btn) {
    document.getElementById('chat-inp').value = btn.textContent;
    sendMsg();
    document.getElementById('suggested-qs').style.display = 'none';
}

function addMsg(role, text) {
    const box = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'chat-msg ' + (role === 'ai' ? 'msg-ai' : 'msg-user');
    box.appendChild(div);
    if (role === 'ai') typeOut(div, text);
    else { div.textContent = text; }
    box.scrollTop = box.scrollHeight;
    return div;
}

function typeOut(el, text) {
    let i = 0;
    const iv = setInterval(() => {
        el.textContent = text.slice(0, ++i);
        el.closest('.chat-messages').scrollTop = 9999;
        if (i >= text.length) clearInterval(iv);
    }, 18);
}

function showTyping() {
    const box = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'chat-msg msg-ai';
    div.id = 'typing-indicator';
    div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    return div;
}

async function sendMsg() {
    const inp = document.getElementById('chat-inp');
    const text = inp.value.trim();
    if (!text) return;
    inp.value = '';
    addMsg('user', text);
    const typing = showTyping();

    await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
    typing.remove();
    const query = text.toLowerCase();
    const match = KB.find(e => e.kw.some(k => query.includes(k)));
    const reply = match
        ? match.ans
        : `I don't have that info right now — for anything specific, reach out to Abdulrahman directly at abdulrahman2004an@gmail.com and he'll get back to you!`;
    addMsg('ai', reply);
}

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
        const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';
        card.style.setProperty('--card-mx', x);
        card.style.setProperty('--card-my', y);
    });
});
window.addEventListener('load', () => {
    checkReveal();
});