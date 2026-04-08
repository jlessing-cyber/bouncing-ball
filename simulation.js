const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const gSlider = document.getElementById('gravity');
const eSlider = document.getElementById('elasticity');
const hSlider = document.getElementById('height');
const resetBtn = document.getElementById('resetBtn');

const gDisp = document.getElementById('g-val');
const eDisp = document.getElementById('e-val');
const hDisp = document.getElementById('h-val');

// Physics State
let ball = {
    x: 100,
    y: 100,
    radius: 20,
    vx: 4,
    vy: 0,
    color: '#58a6ff'
};

function resize() {
    // Set canvas to fill the remaining screen space
    canvas.width = window.innerWidth;
    const controls = document.getElementById('controls');
    const controlsHeight = controls ? controls.offsetHeight : 100;
    canvas.height = window.innerHeight - controlsHeight;
    
    // Force the ball back into view if a resize moves the floor above it
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    // Calculate height: Higher slider value = higher spawn point
    const heightFromFloor = parseInt(hSlider.value);
    ball.y = canvas.height - heightFromFloor - ball.radius;
    ball.vy = 0;
    ball.vx = (Math.random() - 0.5) * 10; // Give it some horizontal speed
}

function update() {
    const gravity = parseFloat(gSlider.value);
    const elasticity = parseFloat(eSlider.value);

    // Update Numerical Value Displays
    if(gDisp) gDisp.innerText = gravity.toFixed(2);
    if(eDisp) eDisp.innerText = elasticity.toFixed(2);
    if(hDisp) hDisp.innerText = hSlider.value + "px";

    // Physics Logic
    ball.vy += gravity; 
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Floor Collision
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.vy *= -elasticity;

        // Friction/Jitter fix
        if (Math.abs(ball.vy) < 0.5) ball.vy = 0;
    }

    // Side Wall Collisions
    if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius;
        ball.vx *= -elasticity;
    } else if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx *= -elasticity;
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.strokeStyle = "#f0f6fc";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
}

// Listeners
window.addEventListener('resize', resize);
if(resetBtn) resetBtn.addEventListener('click', resetBall);

// Start
resize();
resetBall(); // Ensure ball is positioned correctly immediately
update();
