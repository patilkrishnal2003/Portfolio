// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Check for saved theme preference
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

// Animate skill bars on scroll
const skillBars = document.querySelectorAll('.skill-progress');

function animateSkillBars() {
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}


// Animate counters
const counters = document.querySelectorAll('.stat-number');

function animateCounters() {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 20);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('skill-progress')) {
                animateSkillBars();
            }
            if (entry.target.classList.contains('stat-number')) {
                animateCounters();
            }
            entry.target.classList.add('animate-fade-in');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.skill-progress, .stat-number, .project-card, .cert-card').forEach(el => {
    observer.observe(el);
});

// ==========================
// Contact Form with EmailJS
// ==========================
const contactForm = document.getElementById("contactForm");
const submitText = document.getElementById("submitText");
const formLoader = document.getElementById("formLoader");

contactForm.addEventListener("submit", function(e) {
    e.preventDefault();

    submitText.style.display = "none";
    formLoader.style.display = "inline-block";

    // EmailJS send
    emailjs.sendForm("service_oxr3ocp", "template_z7n3rih", this)
        .then(() => {
            alert("✅ Thank you! Your message has been sent.");
            contactForm.reset();
        }, (error) => {
            alert("❌ Oops, something went wrong: " + error.text);
        })
        .finally(() => {
            submitText.style.display = "inline";
            formLoader.style.display = "none";
        });
});


// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add animation delays
    document.querySelectorAll('.animate-fade-in').forEach((el, index) => {
        el.classList.add(`delay-${(index % 6) * 100}`);
    });

    // Compute and render experience durations
    computeExperiences();
    // Start rotating hero tagline
    rotateTaglines();
    
    // Back-to-top button behavior
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        const toggleBackToTop = () => {
            if (window.scrollY > 300) backToTop.classList.add('show');
            else backToTop.classList.remove('show');
        };

        // Initial check
        toggleBackToTop();

        window.addEventListener('scroll', toggleBackToTop);

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// ==========================
// Experience duration helper
// ==========================
function computeExperiences() {
    const items = document.querySelectorAll('.exp-item');
    if (!items || items.length === 0) return;

    items.forEach(item => {
        const joinIso = item.getAttribute('data-join');
        if (!joinIso) return;
        const joinDate = new Date(joinIso);
        if (isNaN(joinDate)) return;

        const now = new Date();

        // Calculate total months difference
        let totalMonths = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth());
        // Adjust if current day is before join day
        if (now.getDate() < joinDate.getDate()) totalMonths -= 1;
        if (totalMonths < 0) totalMonths = 0;

        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;

        const yearsPart = years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '';
        const monthsPart = months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '';
        const durationText = [yearsPart, monthsPart].filter(Boolean).join(' ');

        const joinedSpan = item.querySelector('.joined-date');
        const durationSpan = item.querySelector('.duration-text');
        const totalSpan = item.querySelector('.total-months');

        if (joinedSpan) joinedSpan.textContent = joinDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        if (durationSpan) durationSpan.textContent = durationText || '0 months';
        if (totalSpan) totalSpan.textContent = totalMonths;
    });
}

// ==========================
// Tagline rotator
// ==========================
function rotateTaglines() {
    const el = document.getElementById('dynamicTagline');
    if (!el) return;

    const taglines = [
        'Data Science & Analytics',
        'Artificial Intelligence & Machine Learning',
        'Data Visualization & Storytelling',
        'ETL & Data Engineering',
        'Predictive Modeling & Insights',
        'AI-driven Product Prototyping'
    ];

    let idx = 0;
    const changeDelay = 3000; // ms
    const fadeDuration = 300; // matches CSS transition

    setInterval(() => {
        // fade out
        el.classList.add('fade-out');
        setTimeout(() => {
            idx = (idx + 1) % taglines.length;
            el.textContent = taglines[idx];
            // fade in
            el.classList.remove('fade-out');
        }, fadeDuration);
    }, changeDelay);
}
