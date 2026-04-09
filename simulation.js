const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

const gSlider = document.getElementById('gravity');
const hSlider = document.getElementById('height');
const resetBtn = document.getElementById('resetBtn');
const gDisp = document.getElementById('g-val');
const hDisp = document.getElementById('h-val');
const peBar = document.getElementById('pe-bar');
const keBar = document.getElementById('ke-bar');

let ball = {
    x: 0,
    y: 0,
    radius: 25, // Slightly larger ball for visibility
    vx: 4, 
    vy: 0,
    initialHeight: 300, 
    color: '#58a6ff'
};

function resize() {
    // Fill the screen exactly
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.getElementById('controls').offsetHeight;
    resetBall();
}

function resetBall() {
    ball.initialHeight = parseInt(hSlider.value);
    ball.x = canvas.width / 2;
    // Set Y based on the floor
    ball.y = canvas.height - ball.initialHeight - ball.radius;
    ball.vy = 0;
    ball.vx = 4;
}

function update() {
    const gravity = parseFloat(gSlider.value);
    
    // Update Labels
    gDisp.innerText = gravity.toFixed(2);
    hDisp.innerText = hSlider.value + "px";

    // Movement
    ball.vy += gravity;
    ball.y += ball.vy;
    ball.x += ball.vx;

    // Floor Bounce (Conservation of Energy Math)
    const floorY = canvas.height - ball.radius;
    if (ball.y >= floorY) {
        ball.y = floorY;
        // The magic formula to ensure it returns to the same height
        ball.vy = -Math.sqrt(2 * gravity * ball.initialHeight);
    }

    // Side Wall Bounce
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.vx *= -1;
        ball.x = ball.x < ball.radius ? ball.radius : canvas.width - ball.radius;
    }

    // Energy Bar Logic
    const currentHeight = Math.max(0, canvas.height - ball.y - ball.radius);
    const totalE = gravity * ball.initialHeight;
    const pe = gravity * currentHeight;
    const ke = 0.5 * (ball.vy * ball.vy);

    peBar.style.width = `${(pe / totalE) * 100}%`;
    keBar.style.width = `${(ke / totalE) * 100}%`;

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Height Guide Line
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(0, canvas.height - ball.initialHeight - ball.radius);
    ctx.lineTo(canvas.width, canvas.height - ball.initialHeight - ball.radius);
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.stroke();
    ctx.setLineDash([]);

    // The Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
}

window.addEventListener('resize', resize);
resetBtn.addEventListener('click', resetBall);

// Start
resize();
update();
