export class Vector3 {
	public x: number;
	public y: number;
	public z: number;

	constructor(x?: number, y?: number, z?: number) {
		this.x = x ?? 0;
		this.y = y ?? 0;
		this.z = z ?? 0;
	}

	public add_vec(other: Vector3): Vector3 {
		this.x += other.x;
		this.y += other.y;
		this.z += other.z;
		return this;
	}

	public add(x: number, y: number, z: number) {
		this.x += x;
		this.y += y;
		this.z += z;
	}

	public static add_vec(a: Vector3, b: Vector3) {
		return new Vector3(
			a.x + b.x,
			a.y + b.y,
			a.z + b.z,
		);
	}


	public static add(vec: Vector3, x?: number, y?: number, z?: number) {
		return new Vector3(
			vec.x + (x ?? 0),
			vec.y + (y ?? 0),
			vec.z + (z ?? 0),
		);
	}


	public static sub(a: Vector3, b: Vector3): Vector3 {
		return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
	}

	public scale_vec(other: Vector3) {
		this.x *= other.x;
		this.y *= other.y;
		this.z *= other.z;
	}

	public scale_number(value: number): Vector3 {
		this.x *= value;
		this.y *= value;
		this.z *= value;
		return this;
	}

	public set_magnitude(magnitude: number): Vector3 {
		this.normalise();
		this.x *= magnitude;
		this.y *= magnitude;
		this.z *= magnitude;
		return this;
	}

	public magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	public square_magnitude(): number {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	public normalised(): Vector3 {
		const mag = this.magnitude();
		return new Vector3(this.x / mag, this.y / mag, this.z / mag);
	}

	public normalise() {
		const mag = this.magnitude();
		this.x /= mag;
		this.y /= mag;
		this.z /= mag;
	}

	public static cross(a: Vector3, b: Vector3): Vector3 {
		return new Vector3(
			a.y * b.z - a.z * b.y,
			a.z * b.x - a.x * b.z,
			a.x * b.y - a.y * b.x
		);
	}

	public invert(): Vector3 {
		return new Vector3(-this.x, -this.y, -this.z);
	}

	public static dot(a: Vector3, b: Vector3): number {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}

	public static up(): Vector3 {
		return <Vector3>{ x: 0, y: 1, z: 0 };
	}
	public static zero(): Vector3 {
		return <Vector3>{ x: 0, y: 0, z: 0 };
	}

	public to_array(): number[] {
		return [this.x, this.y, this.z];
	}

	public clone(): Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}
}