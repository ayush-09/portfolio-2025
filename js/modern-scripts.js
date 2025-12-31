document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypingEffect();
    initNavbarScroll();
    initTimeline();
    initCounters();
});

// Initialize jQuery plugins
$(document).ready(function () {
    // WOW JS
    new WOW().init();

    // Owl Carousel
    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        nav: false,
        dots: true,
        autoplay: true,
        responsive: {
            0: { items: 1 },
            600: { items: 2 },
            1000: { items: 3 }
        }
    });
});

/* -------------------------------------------------------------------------- */
/*                                Counter Animation                           */
/* -------------------------------------------------------------------------- */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const duration = 2000; // 2 seconds animation for all

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const counter = entry.target;

                // Get target number safely
                let targetText = counter.getAttribute('data-target');
                if (!targetText) {
                    targetText = counter.innerText;
                    counter.setAttribute('data-target', targetText);
                }

                // Parse standard integer (remove non-digits)
                const target = parseInt(targetText.replace(/\D/g, ''));

                if (isNaN(target)) {
                    observer.unobserve(counter);
                    return;
                }

                // Start from 0
                counter.innerText = '0';

                // Animation params
                const frameDuration = 20; // 50fps
                const totalFrames = duration / frameDuration;
                const increment = target / totalFrames;

                let current = 0;

                const updateCount = () => {
                    current += increment;

                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(() => setTimeout(updateCount, frameDuration));
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCount();
                observer.unobserve(counter); // Only animate once
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}


/* -------------------------------------------------------------------------- */
/*                               Modern UX Features                           */
/* -------------------------------------------------------------------------- */

// Mouse Spotlight
document.documentElement.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--x', e.clientX + 'px');
    document.documentElement.style.setProperty('--y', e.clientY + 'px');
});

// Scroll Progress
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scroll-progress').style.width = scrolled + "%";
});

// Fast Loading Screen logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500); // Wait for transition to finish
    }
});

// Vanilla 3D Tilt (Lightweight implementation)
document.querySelectorAll('.project-card, .skill-category, .content-box').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

/* -------------------------------------------------------------------------- */
/*                               Particle Network                             */
/* -------------------------------------------------------------------------- */
function initParticles() {
    const canvas = document.getElementById('canvas-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 60; // Number of particles
    const connectionDistance = 150; // Max distance to draw line
    const particleSpeed = 0.5;
    const particleColor = 'rgba(0, 255, 136, 0.5)'; // Primary color
    const lineColor = 'rgba(0, 255, 136, 0.15)';

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * particleSpeed;
            this.vy = (Math.random() - 0.5) * particleSpeed;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        resize();
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1 - distance / connectionDistance;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        particles = [];
        init();
    });

    init();
    animate();
}

/* -------------------------------------------------------------------------- */
/*                                Scroll Reveal                               */
/* -------------------------------------------------------------------------- */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    reveals.forEach((element) => {
        observer.observe(element);
    });
}

/* -------------------------------------------------------------------------- */
/*                                Typing Effect                               */
/* -------------------------------------------------------------------------- */
function initTypingEffect() {
    const textElement = document.getElementById('typing-text');
    if (!textElement) return;

    const textToType = "Data Scientist & AI/ML Developer";
    let index = 0;

    function type() {
        if (index < textToType.length) {
            textElement.textContent += textToType.charAt(index);
            index++;
            setTimeout(type, 100); // Typing speed
        }
    }

    // Clear initial text
    textElement.textContent = "";
    setTimeout(type, 1000); // Start delay
}

/* -------------------------------------------------------------------------- */
/*                               Navbar Active                                */
/* -------------------------------------------------------------------------- */
function initNavbarScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active-link');
            }
        });
    });
}

/* -------------------------------------------------------------------------- */
/*                            Neural Path Timeline                            */
/* -------------------------------------------------------------------------- */
function initTimeline() {
    const timeline = document.querySelector('.timeline');
    const progressLine = document.getElementById('timeline-progress');
    const items = document.querySelectorAll('.timeline-item');

    if (!timeline | !progressLine) return;

    window.addEventListener('scroll', () => {
        const triggers = window.innerHeight * 0.7; // Trigger point
        const timelineRect = timeline.getBoundingClientRect();
        const timelineTop = timelineRect.top;
        const timelineHeight = timelineRect.height;

        // Calculate how much of the timeline is visible
        let percentage = ((window.innerHeight / 2) - timelineTop) / timelineHeight * 100;

        // Clamp percentage 0-100
        percentage = Math.max(0, Math.min(100, percentage));
        progressLine.style.height = percentage + '%';

        // Activate items
        items.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < triggers) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });
}

// Call in DOMContentLoaded
initTimeline();
initAboutTyping();
initDecodeEffect();


/* -------------------------------------------------------------------------- */
/*                             Hero Decode Effect                             */
/* -------------------------------------------------------------------------- */
function initDecodeEffect() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const header = document.querySelector(".glitch-name");

    if (!header) return;

    // Preserve original text
    const originalText = header.dataset.value || header.innerText;

    let iterations = 0;

    const interval = setInterval(() => {
        header.innerText = originalText.split("")
            .map((letter, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return letters[Math.floor(Math.random() * 70)];
            })
            .join("");

        if (iterations >= originalText.length) {
            clearInterval(interval);
        }

        iterations += 1 / 5; // Slowed down for "Great Effect"
    }, 50);

    // Magnetic Button Effect (Simple Version)
    const btns = document.querySelectorAll('.magnetic-btn');
    btns.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const pos = btn.getBoundingClientRect();
            const x = e.clientX - pos.left - pos.width / 2;
            const y = e.clientY - pos.top - pos.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', function () {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}


/* -------------------------------------------------------------------------- */
/*                            About Section Typing                            */
/* -------------------------------------------------------------------------- */
function initAboutTyping() {
    const aboutElement = document.getElementById('about-typewriter');
    if (!aboutElement) return;

    // The text to type. HTML tags can be problematic in simple typewriters,
    // so we'll simulate them or just type raw text.
    // Enhanced strategy: Type text, but inject styled spans using a parser? 
    // Simpler: Type plain text that LOOKS like code/markdown.

    const textLines = [
        "> Initializing Personnel Profile...",
        "> Loading Data Points...",
        "> Role: AI Engineer & Data Scientist",
        "> Experience: 3+ Years",
        "",
        "I am a passionate AI/ML Developer specializing in Generative AI, Multi-Agent Systems, and NLP.",
        "My mission is to build intelligent systems that solve complex real-world problems.",
        "",
        "Currently architecting multi-agent document AI solutions at ContractPodAi."
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let isTyping = false;


    function typeLine() {
        if (lineIndex < textLines.length) {
            const currentLine = textLines[lineIndex];

            if (charIndex < currentLine.length) {
                // Determine if we need a new line or same line append
                // Logic: We append to the main element's innerHTML
                // But this is tricky with innerHTML refreshing.
                // Better: Append a new stored string to textContent?

                // Let's modify the last child node if it's text?
                // Simplest: just update innerHTML with the full built string so far

                // Optimized: Current line is being built in a variable 'currentLineStr'
                // No, simpler: Just strictly append chars

                const char = currentLine.charAt(charIndex);
                aboutElement.innerHTML += char;
                charIndex++;
                setTimeout(typeLine, 30); // Speed
            } else {
                // Line finished
                aboutElement.innerHTML += "<br/>";
                lineIndex++;
                charIndex = 0;
                setTimeout(typeLine, 300); // Pause between lines
            }
        } else {
            // Finished
            aboutElement.classList.add('typing-cursor'); // Add blinking cursor at end
        }
    }

    // Observer to start
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isTyping) {
                isTyping = true;
                aboutElement.innerHTML = ""; // Clear
                typeLine();
            }
        });
    }, { threshold: 0.5 });

    const aboutSection = document.getElementById('about');
    if (aboutSection) observer.observe(aboutSection);
}
