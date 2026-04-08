const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

const gSlider = document.getElementById('gravity');
const eSlider = document.getElementById('elasticity'); // Still exists in HTML, but we will ignore it for the bounce
const hSlider = document.getElementById('height');
const resetBtn = document.getElementById('resetBtn');

const gDisp = document.getElementById('g-val');
const eDisp = document.getElementById('e-val');
const hDisp = document.getElementById('h-val');

let ball = {
    x: 0,
    y: 0,
    radius: 20,
    vx: 3, 
    vy: 0,
    initialHeight: 0, 
    color: '#58a6ff'
};

function resize() {
    canvas.width = window.innerWidth;
    const controls = document.getElementById('controls');
    const controlsHeight = controls ? controls.offsetHeight : 100;
    canvas.height = window.innerHeight - controlsHeight;
    resetBall();
}

function resetBall() {
    ball.x = canvas.width / 2;
    // We lock the height here. This is the "Total Energy" of the system.
    ball.initialHeight = parseInt(hSlider.value);
    ball.y = canvas.height - ball.initialHeight - ball.radius;
    ball.vy = 0;
    ball.vx = 3; 
}

function update() {
    const gravity = parseFloat(gSlider.value);
    
    // UI Updates
    gDisp.innerText = gravity.toFixed(2);
    eDisp.innerText = "1.00 (Locked)"; // Overriding display to show it's conserved
    hDisp.innerText = hSlider.value + "px";

    // 1. Apply Gravity
    ball.vy += gravity;
    ball.y += ball.vy;
    ball.x += ball.vx;

    // 2. PERFECT CONSERVATION COLLISION
    // If the ball hits the floor...
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;

        // PHYSICS FIX: Instead of multiplying by a slider, 
        // we calculate exactly what velocity is needed to reach the initial height again.
        // Formula: v = sqrt(2 * g * h)
        if (gravity > 0) {
            ball.vy = -Math.sqrt(2 * gravity * ball.initialHeight);
        } else {
            ball.vy *= -1; // If gravity is 0, just flip the direction
        }
    }

    // 3. Wall Collisions (Perfectly Elastic)
    if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius;
        ball.vx *= -1;
    } else if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx *= -1;
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the "Energy Ceiling" - the ball will always return exactly here
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - ball.initialHeight - ball.radius);
    ctx.lineTo(canvas.width, canvas.height - ball.initialHeight - ball.radius);
    ctx.strokeStyle = "rgba(88, 166, 255, 0.3)";
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.strokeStyle = "#f0f6fc";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
}

window.addEventListener('resize', resize);
resetBtn.addEventListener('click', resetBall);

resize();
update();
