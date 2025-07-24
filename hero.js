const carousel = document.getElementById('carousel');
        let position = 0;
        const speed = 0.5;

        function moveCarousel() {
            position -= speed;
            
            // Reset position when a card width is reached
            if (position < -320) {
                position = 0;
                // Move first card to end
                carousel.appendChild(carousel.firstElementChild);
            }
            
            // Apply the transform with a slight curve effect
            carousel.style.transform = `rotate(-5deg) translateX(${position}px)`;
            requestAnimationFrame(moveCarousel);
        }

        // Initialize carousel
        moveCarousel();

        // Add hover effect to pause animation
        carousel.addEventListener('mouseenter', () => speed = 0);
        carousel.addEventListener('mouseleave', () => speed = 0.5);
