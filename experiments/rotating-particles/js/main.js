const SCREEN_WIDTH = 1000;
const SCREEN_HEIGHT = 1000;
const canvas = document.getElementById("canvas1");
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
/**@type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
class Particle {
	constructor(x, y, z, color) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.color = color;
	}
	project() {
		const fov = 300;
		const depth = this.z + fov;
		if (depth <= 0) return null;
		const px = (this.x * fov) / depth + SCREEN_WIDTH / 2;
		const py = (this.y * fov) / depth + SCREEN_HEIGHT / 2;
		return new Particle(px, py, depth, this.color);
	}
	rotateY(angle) {
		return new Particle(
			this.x * Math.cos(angle) + this.z * Math.sin(angle),
			this.y,
			-this.x * Math.sin(angle) + this.z * Math.cos(angle),
			this.color,
		);
	}
	rotateX(angle) {
		return new Particle(
			this.x,
			this.y * Math.cos(angle) - this.z * Math.sin(angle),
			this.y * Math.sin(angle) + this.z * Math.cos(angle),
			this.color,
		);
	}
}
const BACKGROUND = "BLACK";
const FOREGROUNDS = ["WHITE"];

const RADIUS = 150;
const NUM_POINTS = 200;
function randomFloat(min, max) {
	return min + Math.random() * (max - min);
}

const originalPoints = [];
for (let i = 0; i < NUM_POINTS; ++i) {
	const phi = Math.acos(1 - 2 * Math.random());
	const theta = randomFloat(0, Math.PI * 2);
	originalPoints.push(
		new Particle(
			RADIUS * Math.sin(phi) * Math.cos(theta),
			RADIUS * Math.sin(phi) * Math.sin(theta),
			RADIUS * Math.cos(phi),
			FOREGROUNDS[Math.trunc(Math.random() * FOREGROUNDS.length)],
		),
	);
}

let angle = 0;
let lastTime = performance.now();

function loop() {
	const now = performance.now();
	const dt = Math.min(16, now - lastTime) / 1000;
	lastTime = now;

	angle += ((5 * Math.PI) / 12) * dt;

	ctx.fillStyle = BACKGROUND;
	ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	const projected = originalPoints
		.map((p) =>
			p
				.rotateY(angle)
				.rotateX(angle / 3)
				.project(),
		)
		.filter((p) => p !== null);

	ctx.strokeStyle = "white";
	ctx.lineWidth = 0.5;
	ctx.beginPath();
	ctx.moveTo(projected[0].x, projected[0].y);
	for (const p of projected) {
		ctx.lineTo(p.x, p.y);
	}
	ctx.stroke();

	for (const p of projected) {
		const size = Math.max(0.5, 1000 / p.z);
		ctx.fillStyle = p.color;
		ctx.beginPath();
		ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
		ctx.fill();
	}

	requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
