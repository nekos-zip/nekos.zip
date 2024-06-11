export class Vector4 {
	public x: number;
	public y: number;
	public z: number;

	public w: number;

	public constructor(x?: number, y?: number, z?: number, w?: number) {
		this.x = x ?? 0;
		this.y = y ?? 0;
		this.z = z ?? 0;
		this.w = w ?? 0;
	}

	public add_vec(other: Vector4) {
		this.x += other.x;
		this.y += other.y;
		this.z += other.z;
		this.w += other.w;
	}

	public sub_vec(other: Vector4) {
		this.x -= other.x;
		this.y -= other.y;
		this.z -= other.z;
		this.w -= other.w;
	}

	public scale_vec(other: Vector4) {
		this.x *= other.x;
		this.y *= other.y;
		this.z *= other.z;
		this.w *= other.w;
	}

	public to_array() {
		return [this.x, this.y, this.z, this.w];
	}
	
	static readonly zero: Vector4 = <Vector4>{x: 0, y: 0, z: 0, w: 0};
}