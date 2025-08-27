document.addEventListener('DOMContentLoaded', function () {
    const contactButton = document.getElementById('contactButton');
    let isVisible = false;

    // Scroll handler
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Show button after scrolling past first 100vh
        const shouldShow = scrollTop > windowHeight;

        if (shouldShow && !isVisible) {
            contactButton.classList.add('visible');
            isVisible = true;
        } else if (!shouldShow && isVisible) {
            contactButton.classList.remove('visible');
            isVisible = false;
        }

        // Hide button when near bottom of page
        const nearBottom = scrollTop > (documentHeight - windowHeight - 200);
        if (nearBottom && isVisible) {
            contactButton.style.opacity = '0.3';
        } else if (isVisible) {
            contactButton.style.opacity = '1';
        }
    }

    // Throttled scroll event
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
            setTimeout(() => ticking = false, 16);
        }
    }

    window.addEventListener('scroll', requestTick);

    // Enhanced hover effects
    contactButton.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-5px) scale(1.1)';
    });

    contactButton.addEventListener('mouseleave', function () {
        this.style.transform = isVisible ? 'translateY(0) scale(1)' : 'translateY(100px) scale(0.8)';
    });

    // Click ripple effect
    contactButton.addEventListener('click', function (e) {
        const ripple = document.createElement('div');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
                z-index: 3;
            `;

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    // Initial check
    handleScroll();
});