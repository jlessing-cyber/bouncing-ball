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
    x: 0,
    y: 0,
    radius: 20,
    vx: 2,
    vy: 0,
    color: '#58a6ff'
};

/**
 * Adjusts the canvas size to fill the window 
 * and resets the ball position.
 */
function resize() {
    canvas.width = window.innerWidth;
    const controlsHeight = document.getElementById('controls').offsetHeight;
    canvas.height = window.innerHeight - controlsHeight;
    resetBall();
}

/**
 * Resets the ball to the height defined by the slider.
 */
function resetBall() {
    ball.x = canvas.width / 2;
    // Calculate height from the floor (canvas.height)
    ball.y = canvas.height - parseInt(hSlider.value) - ball.radius;
    ball.vy = 0;
    ball.vx = (Math.random() - 0.5) * 4; // Add a tiny random horizontal push
}

/**
 * Main animation loop
 */
function update() {
    const gravity = parseFloat(gSlider.value);
    const elasticity = parseFloat(eSlider.value);

    // Update Numerical Value Displays
    gDisp.innerText = gravity.toFixed(2);
    eDisp.innerText = elasticity.toFixed(2);
    hDisp.innerText = hSlider.value + "px";

    // --- Physics Logic ---
    ball.vy += gravity; // Gravity increases downward velocity
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Floor Collision
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.vy *= -elasticity; // Reverse velocity and apply energy loss

        // Stop "jittering" when motion is very small
        if (Math.abs(ball.vy) < 1.1 && gravity > 0) {
            ball.vy = 0;
        }
    }

    // Side Wall Collisions
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.vx *= -elasticity;
        ball.x = ball.x < ball.radius ? ball.radius : canvas.width - ball.radius;
    }

    draw();
    requestAnimationFrame(update);
}

/**
 * Renders the ball to the canvas
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.strokeStyle = "#f0f6fc";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

// Event Listeners
window.addEventListener('resize', resize);
resetBtn.addEventListener('click', resetBall);

// Start Simulation
resize();
update();
