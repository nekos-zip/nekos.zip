export class Vector2 {
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add_vec(other: Vector2) {
		this.x += other.x;
		this.y += other.y;
	}

	sub_vec(other: Vector2) {
		this.x -= other.x;
		this.y -= other.y;
	}

	scale_vec(other: Vector2) {
		this.x *= other.x;
		this.y *= other.y;
	}
}