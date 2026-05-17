(function() {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let isTransitioning = false;

    const dotsContainer = document.getElementById('dotsContainer');
    const slideCounter = document.getElementById('slideCounter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const skillsSlide = document.getElementById('skillsSlide');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    let skillsAnimated = false;

    // Crear dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active-dot');
        dot.setAttribute('aria-label', 'Ir a diapositiva ' + (i + 1));
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    const dots = document.querySelectorAll('.dot');

    function updateCounter() {
        slideCounter.textContent = (currentIndex + 1) + ' / ' + totalSlides;
    }

    function updateDots() {
        dots.forEach((d, i) => {
            d.classList.toggle('active-dot', i === currentIndex);
        });
    }

    function animateSkillBars() {
        if (skillsAnimated) return;
        skillsAnimated = true;
        skillBars.forEach((bar, i) => {
            const targetWidth = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = targetWidth + '%';
                bar.classList.add('animated');
            }, i * 120);
        });
    }

    function goToSlide(index) {
        if (isTransitioning || index === currentIndex || index < 0 || index >= totalSlides) return;
        isTransitioning = true;

        const oldSlide = slides[currentIndex];
        const newSlide = slides[index];
        const direction = index > currentIndex ? 'right' : 'left';

        // Salida del slide actual
        oldSlide.classList.remove('active');
        oldSlide.classList.add(direction === 'right' ? 'exit-left' : 'exit-right');

        // Entrada del nuevo slide
        newSlide.classList.remove('exit-left', 'exit-right');
        void newSlide.offsetWidth; // Force reflow
        newSlide.classList.add('active');

        currentIndex = index;
        updateCounter();
        updateDots();

        // Animar skills si la slide actual es la de habilidades
        if (newSlide === skillsSlide) {
            setTimeout(animateSkillBars, 350);
        }

        setTimeout(() => {
            oldSlide.classList.remove('exit-left', 'exit-right');
            isTransitioning = false;
        }, 550); // Sincronizado con la transición de 0.55s en CSS
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            goToSlide(currentIndex + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            goToSlide(currentIndex - 1);
        }
    });

    // Swipe móvil
    let touchStartX = 0;
    const slidesWrapper = document.getElementById('slidesWrapper');

    slidesWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slidesWrapper.addEventListener('touchend', (e) => {
        let touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToSlide(currentIndex + 1);
            else goToSlide(currentIndex - 1);
        }
    });

    // Generar efecto de nieve
    function createSnow() {
        const container = document.getElementById('presentation');
        const count = 100; // Cantidad de copos
        for (let i = 0; i < count; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            const size = (Math.random() * 4 + 2) + 'px';
            flake.style.width = size;
            flake.style.height = size;
            flake.style.left = (Math.random() * 100) + 'vw';
            flake.style.opacity = (Math.random() * 0.5 + 0.3);
            const duration = (Math.random() * 10 + 15) + 's';
            const delay = (Math.random() * -20) + 's'; // Empiezan en puntos diferentes
            flake.style.animation = `snowfall ${duration} linear infinite ${delay}`;
            container.appendChild(flake);
        }
    }

    // Inicialización
    updateCounter();
    updateDots();
    
    // Verificar si empezamos en la slide de skills
    if (slides[currentIndex] === skillsSlide) {
        setTimeout(animateSkillBars, 400);
    }
    createSnow();

    console.log('✅ CV Interactivo listo.');
})();