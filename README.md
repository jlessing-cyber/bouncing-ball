// ---------------------------
// Canvas setup
// ---------------------------
const simCanvas = document.getElementById("simCanvas");
const graphCanvas = document.getElementById("graphCanvas");

const simCtx = simCanvas.getContext("2d");
const graphCtx = graphCanvas.getContext("2d");

function resize() {
    simCanvas.width = window.innerWidth;
    simCanvas.height = window.innerHeight - 200;
    graphCanvas.width = window.innerWidth;
}
resize();
window.onresize = resize;

// ---------------------------
// Parameters + UI
// ---------------------------
let gravitySlider = document.getElementById("gravity");
let elasticitySlider = document.getElementById("elasticity");
let dtSlider = document.getElementById("dt");

// ---------------------------
// Ball class
// ---------------------------
class Ball {
    constructor(x, y, vx, vy, radius, depth) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        
        // Fake “3D”: depth 1–3 influences size
        this.depth = depth;
    }

    update(g, dt) {
        this.vy += g * dt;       // Euler-Cromer: update velocity first
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    draw(ctx) {
        const scaledR = this.radius / this.depth;
        ctx.beginPath();
        ctx.arc(this.x, this.y, scaledR, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${100 + 50*this.depth}, 120, 200)`;
        ctx.fill();
    }
}

// ---------------------------
// Create multiple balls
// ---------------------------
let balls = [];
for (let i = 0; i < 6; i++) {
    balls.push(new Ball(
        Math.random() * simCanvas.width,
        Math.random() * simCanvas.height * 0.2,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        30 + Math.random() * 15,
        1 + Math.random() * 2   // depth for fake 3D
    ));
}

// ---------------------------
// Ball–ball elastic collisions
// ---------------------------
function handleBallCollisions() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const b1 = balls[i];
            const b2 = balls[j];

            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            const r1 = b1.radius / b1.depth;
            const r2 = b2.radius / b2.depth;

            if (dist < r1 + r2) {
                // Normalize collision vector
                const nx = dx / dist;
                const ny = dy / dist;

                // Relative velocity
                const dvx = b2.vx - b1.vx;
                const dvy = b2.vy - b1.vy;

                // Project relative velocity onto collision normal
                const relVel = dvx * nx + dvy * ny;

                // If separating, ignore
                if (relVel > 0) continue;

                const impulse = (2 * relVel) / 2; // equal masses

                b1.vx += impulse * nx;
                b1.vy += impulse * ny;
                b2.vx -= impulse * nx;
                b2.vy -= impulse * ny;

                // Prevent overlap
                const overlap = r1 + r2 - dist;
                b1.x -= nx * overlap/2;
                b1.y -= ny * overlap/2;
                b2.x += nx * overlap/2;
                b2.y += ny * overlap/2;
            }
        }
    }
}

// ---------------------------
// Wall collisions
// ---------------------------
function handleWallCollisions(ball, elasticity) {
    const r = ball.radius / ball.depth;

    if (ball.x - r < 0) {
        ball.x = r;
        ball.vx = -ball.vx * elasticity;
    }
    if (ball.x + r > simCanvas.width) {
        ball.x = simCanvas.width - r;
        ball.vx = -ball.vx * elasticity;
    }
    if (ball.y - r < 0) {
        ball.y = r;
        ball.vy = -ball.vy * elasticity;
    }
    if (ball.y + r > simCanvas.height) {
        ball.y = simCanvas.height - r;
        ball.vy = -ball.vy * elasticity;
    }
}

// ---------------------------
// Energy Graph
// ---------------------------
let energyHistory = [];

function recordEnergy(g) {
    let KE = 0, PE = 0;
    balls.forEach(b => {
        const v2 = b.vx**2 + b.vy**2;
        KE += 0.5 * v2;
        PE += g * (simCanvas.height - b.y);
    });
    energyHistory.push({ KE, PE, total: KE + PE });
    if (energyHistory.length > graphCanvas.width) {
        energyHistory.shift();
    }
}

function drawGraph() {
    graphCtx.fillStyle = "#000";
    graphCtx.fillRect(0, 0, graphCanvas.width, graphCanvas.height);

    for (let i = 0; i < energyHistory.length; i++) {
        const e = energyHistory[i];

        // Kinetic energy
        graphCtx.fillStyle = "red";
        graphCtx.fillRect(i, graphCanvas.height - e.KE * 0.02, 2, 2);

        // Potential
        graphCtx.fillStyle = "blue";
        graphCtx.fillRect(i, graphCanvas.height - e.PE * 0.02, 2, 2);

        // Total
        graphCtx.fillStyle = "yellow";
        graphCtx.fillRect(i, graphCanvas.height - e.total * 0.02, 2, 2);
    }
}

// ---------------------------
// Main loop
// ---------------------------
function update() {
    const g = parseFloat(gravitySlider.value);
    const elasticity = parseFloat(elasticitySlider.value);
    const dt = parseFloat(dtSlider.value);

    simCtx.fillStyle = "#111";
    simCtx.fillRect(0, 0, simCanvas.width, simCanvas.height);

    // Update physics
    balls.forEach(ball => {
        ball.update(g, dt);
        handleWallCollisions(ball, elasticity);
    });

    handleBallCollisions();

    // Draw balls
    balls.forEach(ball => ball.draw(simCtx));

    // Energy tracking + graph
    recordEnergy(g);
    drawGraph();

    requestAnimationFrame(update);
}

update();
