document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle - Refactored for robustness
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    function toggleMenu() {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      // Prevent body scroll when menu is open
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    }

    navToggle.onclick = function(e) {
      e.stopPropagation();
      toggleMenu();
    };

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.onclick = function() {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      };
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  const navbar = document.querySelector(".navbar");
  // Check if navbar should be static (always dark/visible) or already light
  if (navbar && (navbar.classList.contains("navbar-static") || navbar.classList.contains("navbar-light"))) {
     // Already styled or static, no scroll effect needed usually
  } else if (navbar) {
      // Only add scroll listener if not static/pre-colored
      window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      });
  }
  // Dark Mode Logic
  const themeSwitch = document.getElementById('switch');
  const body = document.body;
  const currentTheme = localStorage.getItem('theme');

  // Check LocalStorage or System Preference (Only on index page)
  const isHomepage = window.location.pathname === '/' || window.location.pathname === '/observatorio-estrategia-site/' || window.location.pathname.endsWith('index.html');
  
  if (isHomepage) {
    if (currentTheme) {
      if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeSwitch) themeSwitch.checked = true;
      }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      body.classList.add('dark-mode');
      if (themeSwitch) themeSwitch.checked = true;
    }
  } else {
      // Force light mode on all other pages regardless of preferences
      body.classList.remove('dark-mode');
      if (themeSwitch) themeSwitch.checked = false;
  }

  // Toggle Event Listener
  if (themeSwitch) {
      themeSwitch.addEventListener('change', function (e) {
        if (e.target.checked) {
          body.classList.add('dark-mode');
          localStorage.setItem('theme', 'dark');
        } else {
          body.classList.remove('dark-mode');
          localStorage.setItem('theme', 'light');
        }
      });
  }
});

/* --- Slider Automático --- */
document.addEventListener('DOMContentLoaded', function() {
    let slideIndex = 0;
    let slides = document.querySelectorAll(".slide");
    let dots = document.querySelectorAll(".dot");
    let slideInterval;

    function showSlides(n) {
        if (!slides.length) return;
        
        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));
        
        slideIndex = n;
        if (slideIndex >= slides.length) {slideIndex = 0}
        if (slideIndex < 0) {slideIndex = slides.length - 1}
        
        slides[slideIndex].classList.add("active");
        dots[slideIndex].classList.add("active");
    }

    function startSlider() {
        if (slides.length > 1) {
            slideInterval = setInterval(() => { showSlides(slideIndex + 1); }, 6000); // 6 segundos
        }
    }

    // Nova função para as setas
    window.changeSlide = function(n) {
        clearInterval(slideInterval);
        showSlides(slideIndex + n);
        startSlider();
    };

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            clearInterval(slideInterval);
            showSlides(index);
            startSlider();
        });
    });

    // Event listeners for arrows (using data-dir to avoid inline onclick if possible, but user asked for global fn)
    // We can also bind the arrows if they exist
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    if (prevBtn) prevBtn.addEventListener("click", () => window.changeSlide(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => window.changeSlide(1));

    if (slides.length > 0) {
        showSlides(0);
        startSlider();
    }
});

// === Lógica do Botão de Idioma (Toggle) Ultra-Robusta ===
window.toggleLanguage = function() {
    const langBtn = document.getElementById('lang-toggle-btn');
    const teCombo = document.querySelector('.goog-te-combo');
    
    if (!teCombo) {
        alert("O tradutor do Google ainda está carregando. Por favor, tente novamente em alguns segundos.");
        return;
    }

    // O botão mostra 'EN' se o site estiver em PT, e 'PT' se estiver em EN.
    const isCurrentlyEn = (langBtn && langBtn.innerText === 'PT');

    if (isCurrentlyEn) {
        // Mudar para Português (Original)
        // O primeiro item (index 0) costuma ser o idioma padrão da página
        teCombo.selectedIndex = 0;
        teCombo.dispatchEvent(new Event('change'));
        
        if (langBtn) langBtn.innerText = 'EN';
        localStorage.setItem('siteLang', 'pt');
    } else {
        // Mudar para Inglês
        let enIndex = -1;
        
        // Procura pelo valor 'en' ou pelo texto contendo 'inglês'/'english'
        for (let i = 0; i < teCombo.options.length; i++) {
            let optVal = teCombo.options[i].value.toLowerCase();
            let optText = teCombo.options[i].text.toLowerCase();
            
            if (optVal === 'en' || optText.includes('inglês') || optText.includes('english')) {
                enIndex = i;
                break;
            }
        }

        if (enIndex !== -1) {
            teCombo.selectedIndex = enIndex;
            teCombo.dispatchEvent(new Event('change'));
            if (langBtn) langBtn.innerText = 'PT';
            localStorage.setItem('siteLang', 'en');
        } else {
            // Caso extremo: tenta setar o valor diretamente
            teCombo.value = 'en';
            teCombo.dispatchEvent(new Event('change'));
            if (langBtn) langBtn.innerText = 'PT';
            localStorage.setItem('siteLang', 'en');
        }
    }
};

// Ao carregar a página, se o usuário tinha salvo 'en', aplica
window.addEventListener('load', function() {
    const savedLang = localStorage.getItem('siteLang') || 'pt';
    const langBtn = document.getElementById('lang-toggle-btn');

    if (savedLang === 'en') {
        let checkGoogleLoad = setInterval(function() {
            const teCombo = document.querySelector('.goog-te-combo');
            if (teCombo) {
                clearInterval(checkGoogleLoad);
                teCombo.value = 'en';
                teCombo.dispatchEvent(new Event('change'));
                if (langBtn) langBtn.innerText = 'PT';
            }
        }, 300);
        setTimeout(() => clearInterval(checkGoogleLoad), 5000);
    }
});
