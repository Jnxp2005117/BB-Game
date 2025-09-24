class DuckGame {
    constructor() {
        this.duck = document.getElementById('duck');
        this.gameContainer = document.querySelector('.game-container');
        this.timer = document.getElementById('timer');
        this.countdown = document.getElementById('countdown');
        this.datetime = document.getElementById('datetime');
        
        // Duck properties
        this.duckSize = 120; // Updated to match CSS
        this.speed = 4; // Increased speed
        this.isDead = false;
        this.timerInterval = null;
        this.curveAngle = 0; // For curved movement
        this.curveSpeed = 0.02; // How fast the curve changes
        
        // Screen boundaries
        this.maxX = window.innerWidth - this.duckSize;
        this.maxY = window.innerHeight - this.duckSize;
        
        // Start from center
        this.x = (window.innerWidth - this.duckSize) / 2;
        this.y = (window.innerHeight - this.duckSize) / 2;
        this.direction = Math.random() * Math.PI * 2; // Random initial direction
        
        // Initialize duck position
        this.updateDuckPosition();
        this.updateDuckDirection();
        
        // Add click event listener
        this.duck.addEventListener('click', () => this.killDuck());
        
        // Start date/time updates
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
        
        // Start animation
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.maxX = window.innerWidth - this.duckSize;
            this.maxY = window.innerHeight - this.duckSize;
        });
    }
    
    updateDuckPosition() {
        this.duck.style.left = this.x + 'px';
        this.duck.style.top = this.y + 'px';
    }
    
    updateDuckDirection() {
        // Remove existing direction classes
        this.duck.classList.remove('facing-left', 'facing-right');
        
        // Add appropriate direction class
        if (Math.cos(this.direction) > 0) {
            this.duck.classList.add('facing-right');
        } else {
            this.duck.classList.add('facing-left');
        }
    }
    
    updateDateTime() {
        const now = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        this.datetime.textContent = now.toLocaleDateString('en-US', options);
    }
    
    killDuck() {
        if (this.isDead) return; // Already dead
        
        this.isDead = true;
        
        // Play death sound effect
        this.playDeathSound();
        
        // Change image to dead duck
        const duckImage = this.duck.querySelector('.duck-image');
        duckImage.src = 'D2F4-BROWN.png';
        
        // Add death animation class
        this.duck.classList.add('dead');
        
        // Remove floating animation
        duckImage.style.animation = 'none';
        
        // Create sparkling particle effect
        this.createDeathParticles();
        
        // Show timer and start countdown
        this.showTimer();
        this.startCountdown();
        
        console.log('Duck died!');
    }
    
    createDeathParticles() {
        const particleCount = 15;
        const duckRect = this.duck.getBoundingClientRect();
        const centerX = duckRect.left + duckRect.width / 2;
        const centerY = duckRect.top + duckRect.height / 2;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'death-particle';
            
            // Random position around the duck
            const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
            const distance = 30 + Math.random() * 20;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            // Random size and color
            const size = 3 + Math.random() * 4;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Add to game container
            this.gameContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    }
    
    playDeathSound() {
        // Create audio context for sound generation
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a short, sharp sound for death effect
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configure the death sound (short, descending tone)
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
        
        // Volume envelope (quick attack, quick decay)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    showTimer() {
        this.timer.classList.add('show');
    }
    
    hideTimer() {
        this.timer.classList.remove('show');
    }
    
    startCountdown() {
        let timeLeft = 5;
        this.countdown.textContent = timeLeft;
        
        this.timerInterval = setInterval(() => {
            timeLeft--;
            this.countdown.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.resetGame();
            }
        }, 1000);
    }
    
    resetGame() {
        // Hide timer
        this.hideTimer();
        
        // Reset duck state
        this.isDead = false;
        this.duck.classList.remove('dead');
        
        // Reset duck image
        const duckImage = this.duck.querySelector('.duck-image');
        duckImage.src = 'D1F4-BROWN.png';
        duckImage.style.animation = 'float 2s ease-in-out infinite';
        
        // Reset position to center and random direction
        this.x = (window.innerWidth - this.duckSize) / 2;
        this.y = (window.innerHeight - this.duckSize) / 2;
        this.direction = Math.random() * Math.PI * 2;
        this.curveAngle = 0; // Reset curve angle
        
        // Update screen boundaries in case window was resized
        this.maxX = window.innerWidth - this.duckSize;
        this.maxY = window.innerHeight - this.duckSize;
        
        this.updateDuckPosition();
        this.updateDuckDirection();
        
        console.log('Game reset! Duck starting from center with new direction:', this.direction);
    }
    
    moveDuck() {
        // Don't move if duck is dead
        if (this.isDead) return;
        
        // Add curve to the movement
        this.curveAngle += this.curveSpeed;
        const curvedDirection = this.direction + Math.sin(this.curveAngle) * 0.5;
        
        // Calculate new position with curved movement
        const deltaX = Math.cos(curvedDirection) * this.speed;
        const deltaY = Math.sin(curvedDirection) * this.speed;
        
        this.x += deltaX;
        this.y += deltaY;
        
        // Bounce off walls with slight direction change for more organic movement
        if (this.x <= 0 || this.x >= this.maxX) {
            this.direction = Math.PI - this.direction + (Math.random() - 0.5) * 0.5; // Add some randomness
            this.x = Math.max(0, Math.min(this.maxX, this.x));
            this.curveAngle = 0; // Reset curve on bounce
        }
        
        if (this.y <= 0 || this.y >= this.maxY) {
            this.direction = -this.direction + (Math.random() - 0.5) * 0.5; // Add some randomness
            this.y = Math.max(0, Math.min(this.maxY, this.y));
            this.curveAngle = 0; // Reset curve on bounce
        }
        
        // Keep duck within bounds
        this.x = Math.max(0, Math.min(this.maxX, this.x));
        this.y = Math.max(0, Math.min(this.maxY, this.y));
        
        // Update position and direction
        this.updateDuckPosition();
        this.updateDuckDirection();
    }
    
    animate() {
        this.moveDuck();
        requestAnimationFrame(() => this.animate());
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DuckGame();
});
