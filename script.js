/**
 * Durairajan Subramaniyan - Executive Portfolio Script
 * Handles theme switching, dynamic filtering, animated counters,
 * mobile drawer navigation, active link tracking, and contact message generation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initActiveNavTracker();
  initAnimatedCounters();
  initSkillsFilter();
  initContactForm();
  initBackToTop();
});

/* ==========================================================================
   Theme Management (Executive Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('executive_portfolio_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme, themeIcon);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('executive_portfolio_theme', newTheme);
      updateThemeIcon(newTheme, themeIcon);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark Executive' : 'Light Professional'} Theme`);
    });
  }
}

function updateThemeIcon(theme, iconEl) {
  if (!iconEl) return;
  if (theme === 'light') {
    // Moon icon for switching back to dark
    iconEl.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    iconEl.setAttribute('aria-label', 'Switch to Dark Mode');
  } else {
    // Sun icon for switching to light
    iconEl.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
    iconEl.setAttribute('aria-label', 'Switch to Light Mode');
  }
}

/* ==========================================================================
   Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close when clicking nav link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   Active Navigation Tracker on Scroll
   ========================================================================== */
function initActiveNavTracker() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px' }
  );

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   Animated Counters
   ========================================================================== */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.counter-val');
  let hasAnimated = false;

  const countUp = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800; // ms
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out cubic
      const current = Math.round(target * (1 - Math.pow(1 - progress, 3)));

      el.textContent = `${prefix}${current}${suffix}`;

      if (frame >= totalFrames) {
        clearInterval(counter);
        el.textContent = `${prefix}${target}${suffix}`;
      }
    }, frameRate);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          counterElements.forEach(el => countUp(el));
          obs.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const metricsSection = document.getElementById('metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

/* ==========================================================================
   Interactive Skills Filter
   ========================================================================== */
function initSkillsFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   Contact Form & Quick Actions
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('executive-contact-form');
  const sendEmailBtn = document.getElementById('btn-send-email');
  const sendWhatsappBtn = document.getElementById('btn-send-whatsapp');

  const getFormValues = () => {
    const name = document.getElementById('sender-name')?.value.trim() || 'Hiring Team / Recruiter';
    const org = document.getElementById('sender-org')?.value.trim() || 'Organization';
    const email = document.getElementById('sender-email')?.value.trim() || '';
    const subject = document.getElementById('sender-subject')?.value.trim() || 'Leadership / Consulting Inquiry';
    const message = document.getElementById('sender-message')?.value.trim() || 'Hello Durairajan, I reviewed your executive profile and would like to connect.';

    return { name, org, email, subject, message };
  };

  if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const { name, org, email, subject, message } = getFormValues();
      const emailBody = `Sender: ${name} (${org})\nEmail: ${email}\n\nMessage:\n${message}\n\n[Inquiry sent via Durairajan Subramaniyan Executive Portfolio]`;
      const mailtoUrl = `mailto:duraisubbu50@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoUrl;
      showToast('Opening your default email client...');
    });
  }

  if (sendWhatsappBtn) {
    sendWhatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const { name, org, message } = getFormValues();
      const waText = `Hello Durairajan, this is ${name} from ${org}.\n\n${message}`;
      const waUrl = `https://wa.me/919791018785?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank');
      showToast('Redirecting to WhatsApp...');
    });
  }
}

/* ==========================================================================
   Copy to Clipboard Utility
   ========================================================================== */
window.copyToClipboard = function(text, label = 'Text') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} copied to clipboard!`);
    }).catch(() => {
      fallbackCopy(text, label);
    });
  } else {
    fallbackCopy(text, label);
  }
};

function fallbackCopy(text, label) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`${label} copied to clipboard!`);
  } catch (err) {
    showToast('Failed to copy. Please manually copy the info.');
  }
  document.body.removeChild(textArea);
}

/* ==========================================================================
   Back to Top
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('executive-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'executive-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

