const SCREEN_WIDTH = 1000;
const SCREEN_HEIGHT = 1000;
const canvas = document.getElementById("canvas1");
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
/**@type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const BACKGROUND = "BLACK";
const RADIUS = 150;
const TUBE_RADIUS = 20;

const cloud = new ParametricShape(
	(u, v) => [
		(RADIUS + TUBE_RADIUS * Math.cos(v)) * Math.cos(u),
		(RADIUS + TUBE_RADIUS * Math.cos(v)) * Math.sin(u),
		TUBE_RADIUS * Math.sin(v) + 100 * u,
	],
	100,
	100,
	[0, 2 * Math.PI * 3],
	[0, 2 * Math.PI],
	"RED",
).toCloud();

let angle = 0;
let lastTime = performance.now();

function loop() {
	const now = performance.now();
	const dt = Math.min(16, now - lastTime) / 1000;
	lastTime = now;
	angle += ((5 * Math.PI) / 12) * dt;

	ctx.fillStyle = BACKGROUND;
	ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	cloud
		.rotate(Math.PI / 2, angle / 2, 0)
		.project(1000)
		.draw(ctx);

	requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
