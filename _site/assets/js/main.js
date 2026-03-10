document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");

  // Check if navbar should be static (always dark/visible) or already light
  if (navbar.classList.contains("navbar-static") || navbar.classList.contains("navbar-light")) {
     // Already styled or static, no scroll effect needed usually
  } else {
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

  // Check LocalStorage or System Preference
  if (currentTheme) {
    if (currentTheme === 'dark') {
      body.classList.add('dark-mode');
      if (themeSwitch) themeSwitch.checked = true;
    }
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add('dark-mode');
    if (themeSwitch) themeSwitch.checked = true;
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

// === Lógica do Botão de Idioma (Toggle) com Memória ===
let currentLang = localStorage.getItem('siteLang') || 'pt';

// Função para aplicar a tradução real na página
function applyTranslation(lang) {
    var teCombo = document.querySelector('.goog-te-combo');
    var langBtn = document.getElementById('lang-toggle-btn');
    
    if (teCombo) {
        teCombo.value = lang;
        teCombo.dispatchEvent(new Event('change'));
        
        // Atualiza visual do botão
        if (langBtn) {
            if (lang === 'en') {
                langBtn.innerText = 'PT';
                langBtn.classList.add('active-lang');
            } else {
                langBtn.innerText = 'EN';
                langBtn.classList.remove('active-lang');
            }
        }
    }
}

// Ao clicar no botão Toggle
window.toggleLanguage = function() {
    if (currentLang === 'pt') {
        currentLang = 'en';
    } else {
        currentLang = 'pt';
    }
    
    localStorage.setItem('siteLang', currentLang);
    applyTranslation(currentLang);
};

// Ao carregar a página, se o usuário tinha salvo 'en', tenta aplicar assim que o Google carregar
window.addEventListener('load', function() {
    if (currentLang === 'en') {
        // O script do Google Tradutor demora alguns milissegundos para renderizar o .goog-te-combo
        // Um pequeno intervalo garante que o dropdown já existe na tela para acionarmos
        let checkGoogleLoad = setInterval(function() {
            if (document.querySelector('.goog-te-combo')) {
                clearInterval(checkGoogleLoad);
                applyTranslation('en');
            }
        }, 300);
        
        // Para se não carregar em 5 segundos
        setTimeout(() => clearInterval(checkGoogleLoad), 5000);
    }
});
