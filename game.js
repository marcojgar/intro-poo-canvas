// Canvas setup 
const canvas = document.getElementById('gameCanvas'); 
const ctx = canvas.getContext('2d'); 
 
// Clase Ball (Pelota) 
class Ball { 
    constructor(x, y, radius, speedX, speedY, color) { 
        this.x = x; 
        this.y = y; 
        this.radius = radius; 
        this.speedX = speedX; 
        this.speedY = speedY; 
        this.color = color;
    } 
 
    draw() { 
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
        ctx.fillStyle = this.color; 
        ctx.fill(); 
        ctx.closePath();

    } 
 
    move() { 
        this.x += this.speedX; 
        this.y += this.speedY; 
 
        // Colisión con la parte superior e inferior 
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) { 
            this.speedY = -this.speedY; 
        } 
    } 
 
    reset() { 
        this.x = canvas.width / 2; 
        this.y = canvas.height / 2; 
        this.speedX = -this.speedX; // Cambia dirección al resetear 
    } 
} 
 
// Clase Paddle (Paleta) 
class Paddle { 
    constructor(x, y, width, height, color, speed, isPlayerControlled = false) { 
        this.x = x; 
        this.y = y; 
        this.width = width; 
        this.height = height; 
        this.color = color;
        this.speed = speed ;
        this.isPlayerControlled = isPlayerControlled;
        this.direction = 1;  
    } 
 
    draw() { 
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height); 
    } 
 
    move(direction) { 
        if (direction === 'up' && this.y > 0) { 
            this.y -= this.speed; 
        } else if (direction === 'down' && this.y + this.height < canvas.height) { 
            this.y += this.speed; 
        } 
    } 
 
    // Movimiento de la paleta NO automática (IA) 
    autoMoveVertical() { 
        this.y += this.speed * this.direction; 
        if (this.y <= 0 || this.y + this.height >= canvas.height) { 
            this.direction = -this.direction; // Cambiar dirección al llegar a los bordes superior e inferior
        } 
    }  
} 
 
// Clase Game (Controla el juego) 
class Game { 
    constructor() { 
        this.balls = [
            new Ball(canvas.width / 2, canvas.height / 2, 3.5, 1.5, 0.5, 'red'), 
            new Ball(canvas.width / 2, canvas.height / 2, 4.5, -1, 0.5, 'grey'), 
            new Ball(canvas.width / 2, canvas.height / 2, 17, -1.5, -0.6, 'orange'), 
            new Ball(canvas.width / 2, canvas.height / 2, 9, -1.5, 1.7, 'pink'), 
            new Ball(canvas.width / 2, canvas.height / 2, 11, 1.4, -0.8, 'blue')
        ];
        this.paddle1 = new Paddle(0, canvas.height / 2 - 50, 10, 220, 'purple', 0.5, true); // Controlado por el jugador 
        this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 100, 'green', 1); // Controlado por la computadora 
        this.keys = {}; // Para capturar las teclas 
    } 
 
    draw() { 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.balls.forEach(ball => ball.draw()); //Dibuja todas las pelotas
        this.paddle1.draw(); 
        this.paddle2.draw(); 
    } 
 
    update() { 
        this.balls.forEach(ball => {
            ball.move();
             
 
        // Movimiento de la paleta 1 (Jugador) controlado por teclas 
        if (this.keys['ArrowUp']) { 
            this.paddle1.move('up'); 
        } 
        if (this.keys['ArrowDown']) { 
            this.paddle1.move('down'); 
        } 
 
        // Movimiento de la paleta 2 (Controlada por IA)
        this.paddle2.autoMoveVertical();  
 
        // Colisiones con las paletas 
        if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width && 
            ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height) { 
            ball.speedX = -ball.speedX; 
        } 
 
        if (ball.x + ball.radius >= this.paddle2.x && 
            ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) { 
            ball.speedX = -ball.speedX; 
        } 
 
        // Detectar cuando la pelota sale de los bordes (punto marcado) 
        if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) { 
            ball.reset(); 
        }
        
    });
} 
 
    // Captura de teclas para el control de la paleta
    handleInput() { 
        window.addEventListener('keydown', (event) => { 
        this.keys[event.key] = true; 
        }); 
        window.addEventListener('keyup', (event) => { 
        this.keys[event.key] = false; 
        }); 
    } 
        run() { 
        this.handleInput(); 
        const gameLoop = () => { 
        this.update(); 
        this.draw(); 
        requestAnimationFrame(gameLoop); 
        }; 
        gameLoop(); 
    } 
} 
// Crear instancia del juego y ejecutarlo 
const game = new Game(); 
game.run();
     