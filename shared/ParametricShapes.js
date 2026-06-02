class Particle {
	constructor(x, y, z, color) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.color = color;
	}
}
class ParticleCloud {
	constructor(particles) {
		/**@type {Array} */
		this.particles = particles;
	}
	project(fov = 300) {
		const projected = [];
		for (const particle of this.particles) {
			const depth = particle.z + fov;
			if (depth <= 0) continue;
			const px = (particle.x * fov) / depth + SCREEN_WIDTH / 2;
			const py = (particle.y * fov) / depth + SCREEN_HEIGHT / 2;
			projected.push(new Particle(px, py, depth, particle.color));
		}
		return new ParticleCloud(projected);
	}
	rotate(angleX, angleY, angleZ) {
		const cx = Math.cos(angleX),
			sx = Math.sin(angleX);
		const cy = Math.cos(angleY),
			sy = Math.sin(angleY);
		const cz = Math.cos(angleZ),
			sz = Math.sin(angleZ);
		const rotated = [];
		for (const particle of this.particles) {
			const nx =
				cy * cz * particle.x +
				(sx * sy * cz - cx * sz) * particle.y +
				(cx * sy * cz + sx * sz) * particle.z;
			const ny =
				cy * sz * particle.x +
				(sx * sy * sz + cx * cz) * particle.y +
				(cx * sy * sz - sx * cz) * particle.z;
			const nz = -sy * particle.x + sx * cy * particle.y + cx * cy * particle.z;

			rotated.push(new Particle(nx, ny, nz, particle.color));
		}
		return new ParticleCloud(rotated);
	}
	draw(ctx) {
		for (const p of this.particles) {
			const size = Math.max(0.5, 1000 / p.z);
			ctx.fillStyle = p.color;
			ctx.beginPath();
			ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
			ctx.fill();
		}
	}
}
class ParametricShape {
	constructor(fn, uSteps, vSteps, uRange, vRange, color) {
		this.fn = fn;
		this.uSteps = uSteps;
		this.vSteps = vSteps;

		this.uRange = uRange;
		/**@type {Array} */
		this.vRange = vRange;
		/**@type {Array} */
		this.color = color;
		this.particles = [];
		for (let i = 0; i < this.uSteps; i++) {
			const u = uRange[0] + (i / uSteps) * (uRange[1] - uRange[0]);
			for (let j = 0; j < this.vSteps; j++) {
				const v = vRange[0] + (j / vSteps) * (vRange[1] - vRange[0]);
				const [x, y, z] = fn(u, v);
				this.particles.push(new Particle(x, y, z, color));
			}
		}
	}
	toCloud() {
		return new ParticleCloud(this.particles);
	}
}
