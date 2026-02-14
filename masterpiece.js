/**
 * MASTERPIECE.JS
 * The Heart of the Experience
 */

const canvas = document.getElementById('canvas-experience');
const ctx = canvas.getContext('2d');
const music = document.getElementById('background-music');
const introPanel = document.getElementById('intro-panel');
const poetryContainer = document.getElementById('poetry-container');
const collageContainer = document.getElementById('collage-container');
const finalPiece = document.getElementById('final-piece');

let width, height, dpr;
let particles = [];
let petals = [];
let floatingHearts = [];
let frame = 0;
let isStarted = false;
let collageStarted = false;

const lizzyPhotos = [
    "Lizzy/IMG-20250328-WA0015.jpg",
    "Lizzy/IMG-20250413-WA0070.jpg",
    "Lizzy/IMG-20250413-WA0072.jpg",
    "Lizzy/IMG-20250720-WA0008.jpg",
    "Lizzy/IMG-20250727-WA0031.jpg",
    "Lizzy/IMG-20251018-WA0008.jpg",
    "Lizzy/IMG-20251019-WA0010.jpg",
    "Lizzy/IMG-20251019-WA0038.jpg",
    "Lizzy/IMG-20251022-WA0014.jpg",
    "Lizzy/IMG-20251029-WA0015.jpg",
    "Lizzy/IMG-20251217-WA0150.jpg",
    "Lizzy/IMG-20251219-WA0045.jpg",
    "Lizzy/IMG-20251219-WA0062.jpg",
    "Lizzy/IMG-20251228-WA0010.jpg",
    "Lizzy/IMG-20251228-WA0011.jpg",
    "Lizzy/IMG-20260107-WA0018.jpg",
    "Lizzy/IMG-20260121-WA0021.jpg",
    "Lizzy/IMG-20260121-WA0048.jpg",
    "Lizzy/IMG-20260121-WA0061.jpg",
    "Lizzy/IMG-20260121-WA0077.jpg",
    "Lizzy/IMG-20260127-WA0033.jpg",
    "Lizzy/IMG-20260127-WA0055.jpeg",
    "Lizzy/IMG-20260127-WA0073.jpg",
    "Lizzy/IMG-20260207-WA0037.jpg",
    "Lizzy/IMG-20260207-WA0039.jpg"
];

class FloatingHeart {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * width;
        this.y = height + 100;
        this.size = Math.random() * 40 + 15;
        this.speed = Math.random() * 1.5 + 0.8;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.wave = Math.random() * 2;
        this.waveSpeed = Math.random() * 0.03;
    }
    update() {
        this.y -= this.speed;
        this.x += Math.sin(frame * this.waveSpeed + this.wave) * 0.8;
        if (this.y < -100) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#B30000'; // Vibrant Red
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#F00000';
        ctx.beginPath();
        const s = this.size / 20;
        ctx.translate(this.x, this.y);
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-10 * s, -10 * s, -20 * s, 10 * s, 0, 20 * s);
        ctx.bezierCurveTo(20 * s, 10 * s, 10 * s, -10 * s, 0, 0);
        ctx.fill();
        ctx.restore();
    }
}

// Lyrics Timing (Refined from Ajike.html)
const lyrics = [
    { time: 0, text: "Close your eyes..." },
    { time: 3.5, text: "Let the world fade away" },
    { time: 7.0, text: "It's just us now" },
    { time: 10.0, text: "In this moment" },
    { time: 12.8, text: "I’ve been in the tunnel" },
    { time: 15.0, text: "You’re the light at the end of it" },
    { time: 17.5, text: "I know I’m not mistaken" },
    { time: 19.1, text: "Reality over illusion" },
    { time: 23.0, text: "Every breath I take" },
    { time: 26.5, text: "Is a whisper of your name" },
    { time: 29.5, text: "My beautiful Elizabeth" },
    { time: 32.5, text: "Listen closely..." },
    { time: 34.2, text: "You’re my devotion" },
    { time: 37.2, text: "So let me love you" },
    { time: 41.1, text: "Like my life depends on it" },
    { time: 44.2, text: "Every hour, every second" },
    { time: 47.5, text: "Every beat of my heart" },
    { time: 50.1, text: "So let me love you" },
    { time: 53.8, text: "Like we’re writing history" },
    { time: 57.0, text: "Close your eyes..." },
    { time: 58.6, text: "Let’s go anywhere away from here" },
    { time: 61.9, text: "Let’s go anywhere away from here" },
    { time: 64.2, text: "In the end say make we dey" },
    { time: 68.2, text: "Sun or rain" },
    { time: 71.6, text: "Joy or pain" },
    { time: 77.0, text: "In the end say make we dey" },
    { time: 81.0, text: "Sun or rain" },
    { time: 84.3, text: "Joy or pain" },
    { time: 89.6, text: "This feels like forever" },
    { time: 91.5, text: "Sworn by the moon and the stars" },
    { time: 95.4, text: "A love carved in the heavens" },
    { time: 98.5, text: "Never to be broken" },
    { time: 102.1, text: "You’re the answer to my prayers" },
    { time: 104.4, text: "Till death do us part" },
    { time: 106.4, text: "Hold onto me" },
    { time: 108.2, text: "For a million years and more" },
    { time: 114.1, text: "So let me love you" },
    { time: 117.8, text: "Like my life depends on it" },
    { time: 121.0, text: "Every hour, every second" },
    { time: 126.8, text: "So let me love you" },
    { time: 130.5, text: "Like we’re writing history" },
    { time: 133.9, text: "Close your eyes" },
    { time: 135.5, text: "Let's go anywhere away from here" },
    { time: 141.0, text: "In the end..." },
    { time: 145.2, text: "Through the sun and the rain" },
    { time: 154.1, text: "In the end, it's just us" },
    { time: 165.4, text: "So let me love you" },
    { time: 168.9, text: "Like my life depends on it" },
    { time: 172.2, text: "Every hour, every second" },
    { time: 178.1, text: "So let me love you" },
    { time: 181.9, text: "Like we’re writing history" },
    { time: 185.0, text: "Close your eyes" },
    { time: 186.7, text: "Stay with me forever" },
    { time: 189.8, text: "Let's go anywhere..." },
    { time: 195.0, text: "To the end of the world" },
    { time: 200.0, text: "And back to your arms." }
];

let activeLyricIdx = -1;

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.color = Math.random() > 0.5 ? '#8b0000' : '#4a0404'; // Crimson variations
        this.alpha = Math.random() * 0.5 + 0.2;
    }
    update(mouse) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = 150;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < maxDistance) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }

        // Floating motion
        this.baseY -= 0.2;
        if (this.baseY < -10) this.baseY = height + 10;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Petal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 5;
        this.vX = (Math.random() - 0.5) * 2;
        this.vY = Math.random() * 2 + 1;
        this.rotation = Math.random() * 360;
        this.rSpeed = (Math.random() - 0.5) * 5;
        this.alpha = 1;
        this.color = `hsla(${Math.random() * 10 + 350}, 80%, 40%, 0.8)`; // Rose colors
    }
    update() {
        this.x += this.vX;
        this.y += this.vY;
        this.rotation += this.rSpeed;
        this.alpha -= 0.005;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size, -this.size, -this.size, this.size, 0, this.size);
        ctx.bezierCurveTo(this.size, this.size, this.size, -this.size, 0, 0);
        ctx.fill();
        ctx.restore();
    }
}

const mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
    if (isStarted && Math.random() > 0.8) petals.push(new Petal(e.x, e.y));
});

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    particles = [];
    for (let i = 0; i < 200; i++) particles.push(new Particle());
    floatingHearts = [];
    for (let i = 0; i < 20; i++) floatingHearts.push(new FloatingHeart());
}

function startExperience() {
    isStarted = true;
    introPanel.style.opacity = '0';
    setTimeout(() => {
        introPanel.style.display = 'none';
        introPanel.classList.remove('visible');
        document.getElementById('main-heart').classList.add('visible');
    }, 1500);

    music.volume = 0;
    music.play();
    fadeInAudio();
}

function fadeInAudio() {
    let vol = 0;
    const interval = setInterval(() => {
        vol += 0.05;
        if (vol >= 0.7) { music.volume = 0.7; clearInterval(interval); }
        else music.volume = vol;
    }, 200);
}

function updateLyrics() {
    const time = music.currentTime;
    const lyric = lyrics.find((l, i) => time >= l.time && (i === lyrics.length - 1 || time < lyrics[i + 1].time));

    if (lyric && lyrics.indexOf(lyric) !== activeLyricIdx) {
        activeLyricIdx = lyrics.indexOf(lyric);
        displayLyric(lyric.text);
    }

    // Show collage towards the end (starting at 150s)
    if (time > 150 && !collageStarted) {
        startCollage();
    }

    // Show final centerpiece when music is near completion
    if (time > 205 && !finalPiece.classList.contains('visible')) {
        showFinal();
    }
}

function startCollage() {
    collageStarted = true;
    let idx = 0;
    const interval = setInterval(() => {
        if (!isStarted || idx >= lizzyPhotos.length) {
            clearInterval(interval);
            return;
        }
        spawnCollagePhoto(lizzyPhotos[idx]);
        idx++;
    }, 2000); // Appear every 2 seconds
}

function spawnCollagePhoto(src) {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'collage-photo';

    // Random Position
    const padding = 100;
    const x = Math.random() * (width - 300 - padding * 2) + padding;
    const y = Math.random() * (height - 400 - padding * 2) + padding;
    const rotation = (Math.random() - 0.5) * 30; // -15 to 15 deg

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.setProperty('--r', `${rotation}deg`);

    collageContainer.appendChild(img);

    setTimeout(() => img.classList.add('active'), 100);

    // Exit after a while
    setTimeout(() => {
        img.classList.add('exit');
        setTimeout(() => img.remove(), 2000);
    }, 10000);
}

function displayLyric(text) {
    const existing = poetryContainer.querySelectorAll('.lyric-line');
    existing.forEach(el => {
        el.classList.remove('active');
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 2000);
    });

    const el = document.createElement('div');
    el.className = 'lyric-line';
    el.innerText = text;
    poetryContainer.appendChild(el);

    setTimeout(() => {
        el.classList.add('active');
    }, 100);

    setTimeout(() => {
        el.classList.remove('active');
        el.style.opacity = '0';
    }, 4500);
}

function showFinal() {
    poetryContainer.style.display = 'none';
    finalPiece.style.display = 'block';
    setTimeout(() => {
        finalPiece.classList.add('visible');
    }, 100);
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw Particles
    particles.forEach(p => {
        p.update(mouse);
        p.draw();
    });

    // Draw Floating Hearts
    floatingHearts.forEach(h => {
        h.update();
        h.draw();
    });

    // Draw Petals
    for (let i = petals.length - 1; i >= 0; i--) {
        petals[i].update();
        petals[i].draw();
        if (petals[i].alpha <= 0) petals.splice(i, 1);
    }

    // Ambient Pulse (Simulated Beat)
    const pulse = 1 + Math.sin(frame * 0.02) * 0.01;
    // We could apply this pulse to elements later

    if (isStarted) updateLyrics();

    frame++;
    requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
resize();
draw();

// Initial Fade In
setTimeout(() => {
    introPanel.classList.add('visible');
}, 500);
