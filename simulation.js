const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

const gSlider = document.getElementById('gravity');
const hSlider = document.getElementById('height');
const resetBtn = document.getElementById('resetBtn');

const gDisp = document.getElementById('g-val');
const hDisp = document.getElementById('h-val');

// Energy Bar Elements
const peBar = document.getElementById('pe-bar');
const keBar = document.getElementById('ke-bar');

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
    ball.initialHeight = parseInt(hSlider.value);
    ball.y = canvas.height - ball.initialHeight - ball.radius;
    ball.vy = 0;
    ball.vx = 3; 
}

function update() {
    const gravity = parseFloat(gSlider.value);
    
    // UI Updates
    gDisp.innerText = gravity.toFixed(2);
    hDisp.innerText = hSlider.value + "px";

    // 1. Apply Physics
    ball.vy += gravity;
    ball.y += ball.vy;
    ball.x += ball.vx;

    // 2. Collision with floor (Conserving Energy)
    const floorY = canvas.height - ball.radius;
    if (ball.y > floorY) {
        ball.y = floorY;
        ball.vy = -Math.sqrt(2 * gravity * ball.initialHeight);
    }

    // 3. Wall Collisions
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.vx *= -1;
        ball.x = ball.x < ball.radius ? ball.radius : canvas.width - ball.radius;
    }

    // 4. Energy Calculations
    // Height is current distance from floor
    const currentHeight = Math.max(0, canvas.height - ball.y - ball.radius);
    
    // Total Energy is based on the initial height (mgh)
    // We simplify mass (m) to 1 for the visualization
    const totalEnergy = gravity * ball.initialHeight;
    const potentialEnergy = gravity * currentHeight;
    const kineticEnergy = 0.5 * (ball.vy * ball.vy);

    // Update Bars (Percentage of Total Energy)
    const pePercent = (potentialEnergy / totalEnergy) * 100;
    const kePercent = (kineticEnergy / totalEnergy) * 100;

    peBar.style.width = `${pePercent}%`;
    keBar.style.width = `${kePercent}%`;

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Energy Ceiling Line
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - ball.initialHeight - ball.radius);
    ctx.lineTo(canvas.width, canvas.height - ball.initialHeight - ball.radius);
    ctx.strokeStyle = "rgba(88, 166, 255, 0.3)";
    ctx.stroke();
    ctx.setLineDash([]);

    // Ball
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
