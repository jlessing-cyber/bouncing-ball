const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Resize to full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ----- Parameters -----
const g = 9.8;               // gravity
const dt = 0.01;             // time step
const radius = 20;           // ball radius
const elasticity = 1.0;      // perfectly elastic

// ----- Initial state -----
let x = canvas.width / 2;
let y = 100;
let vx = 100;
let vy = 0;

// ----- Animation loop -----
function update() {
    // --- Physics (Euler-Cromer integrates velocity first) ---
    vy += g * dt;

    x += vx * dt;
    y += vy * dt;

    // --- Collisions with walls ---
    // floor
    if (y + radius > canvas.height) {
        y = canvas.height - radius;
        vy = -vy * elasticity;
    }

    // ceiling
    if (y - radius < 0) {
        y = radius;
        vy = -vy * elasticity;
    }

    // right wall
    if (x + radius > canvas.width) {
        x = canvas.width - radius;
        vx = -vx * elasticity;
    }

    // left wall
    if (x - radius < 0) {
        x = radius;
        vx = -vx * elasticity;
    }

    // --- Draw ---
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#e08a8a";
    ctx.fill();

    requestAnimationFrame(update);
}

// Start animation
update();
