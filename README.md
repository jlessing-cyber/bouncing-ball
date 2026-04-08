const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");
const graphCanvas = document.getElementById("graphCanvas");
const gCtx = graphCanvas.getContext("2d");

// Grab slider elements
const gravityInput = document.getElementById("gravity");
const elasticityInput = document.getElementById("elasticity");
const dtInput = document.getElementById("dt");

// Physics State
let ball = {
    x: 100,
    y: 100,
    radius: 20,
    vx: 5,
    vy: 0,
    color: "#00d2ff"
};

// Resize logic
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 200;
    graphCanvas.width = window.innerWidth;
}

window.addEventListener('resize', resize);
resize();

// Simulation Loop
function update() {
    // 1. Get current values from sliders
    const gravity = parseFloat(gravityInput.value);
    const elasticity = parseFloat(elasticityInput.value);
    const dt = parseFloat(dtInput.value) * 100; // Scaled for visible speed

    // 2. Apply Physics
    ball.vy += gravity * dt;
    ball.x += ball.vx;
    ball.y += ball.vy;

    // 3. Wall Collisions (Floor)
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.vy *= -elasticity;
        
        // Add a tiny bit of friction so it doesn't slide forever
        ball.vx *= 0.99; 
    }

    // 4. Wall Collisions (Sides)
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.vx *= -elasticity;
        ball.x = ball.x < ball.radius ? ball.radius : canvas.width - ball.radius;
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    // Clear simulation canvas
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    // Simple Graph Placeholder (Clears the graph area)
    gCtx.fillStyle = "#222";
    gCtx.fillRect(0, 0, graphCanvas.width, graphCanvas.height);
    gCtx.fillStyle = "white";
    gCtx.fillText("Energy Graph Active", 20, 30);
}

// Start the simulation
update();
