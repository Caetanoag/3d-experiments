const SCREEN_WIDTH = 1000;
const SCREEN_HEIGHT = 1000;
const canvas = document.getElementById("canvas1");
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
/**@type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const BACKGROUND = "BLACK";
const _RADIUS = 150;
const _TUBE_RADIUS = 20;

const cloud = new ParametricShape(
	(u, v) => [
		u - u ** 3 / 3 + u * v ** 2,
		v - v ** 3 / 3 + v * u ** 2,
		u ** 2 - v ** 2,
	],
	100,
	200,
	[-6, 6],
	[-6, 6],
	"white",
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
		.rotate(angle / 3, angle / 9, angle)
		.project()
		.draw(ctx);

	requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
