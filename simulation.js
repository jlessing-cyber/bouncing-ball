const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

const gSlider = document.getElementById('gravity');
const eSlider = document.getElementById('elasticity');
const hSlider = document.getElementById('height');
const resetBtn = document.getElementById('resetBtn');

const gDisp = document.getElementById('g-val');
const eDisp = document.getElementById('e-val');
const hDisp = document.getElementById('h-val');

let ball = {
    x: 0,
    y: 0,
    radius: 20,
    vx: 0, // Set to 0 for a perfect vertical bounce test
    vy: 0,
    initialHeight: 0, 
    color: '#58a6ff'
};

function resize() {
    canvas.width = window.innerWidth;
    const controlsHeight = document.getElementById('controls').offsetHeight;
    canvas.height = window.innerHeight - controlsHeight;
    resetBall();
}

function resetBall() {
    ball.x = canvas.width / 2;
    // Store the height so the physics engine knows where the "max energy" is
    ball.initialHeight = parseInt(hSlider.value);
    ball.y = canvas.height - ball.initialHeight - ball.radius;
    ball.vy = 0;
    ball.vx = 2; // Slight horizontal movement
}

function update() {
    const gravity = parseFloat(gSlider.value);
    const elasticity = parseFloat(eSlider.value);

    gDisp.innerText = gravity.toFixed(2);
    eDisp.innerText = elasticity.toFixed(2);
    hDisp.innerText = hSlider.value + "px";

    // 1. Apply Gravity
    ball.vy += gravity;
    ball.y += ball.vy;
    ball.x += ball.vx;

    // 2. Perfect Conservation Logic (Floor Collision)
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;

        if (elasticity >= 1.0) {
            /** * ENERGY CONSERVATION FORMULA:
             * To return to the exact starting height, 
             * Velocity must be sqrt(2 * gravity * height)
             */
            const requiredVelocity = Math.sqrt(2 * gravity * ball.initialHeight);
            ball.vy = -requiredVelocity;
        } else {
            // Normal bouncing with energy loss
            ball.vy *= -elasticity;
        }

        // Horizontal conservation
        if (elasticity < 1.0) ball.vx *= elasticity;
    }

    // 3. Wall Collisions
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.vx *= -1; // Bounce off walls perfectly
        ball.x = ball.x < ball.radius ? ball.radius : canvas.width - ball.radius;
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a "Height Marker" line so you can see it returns to the same spot
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - ball.initialHeight - ball.radius);
    ctx.lineTo(canvas.width, canvas.height - ball.initialHeight - ball.radius);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
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
