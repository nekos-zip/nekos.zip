import { Vector3 } from "./vector3";
import { Matrix4x4 } from "./matrix4x4";

export class Quaternion {
	public x: number;
	public y: number;
	public z: number;
	public w: number;

	public constructor(x?: number, y?: number, z?: number, w?: number) {
		this.x = x ?? 0;
		this.y = y ?? 0;
		this.z = z ?? 0;
		this.w = w ?? 1;
	}

	public get(index: number) {
		switch (index) {
			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			case 3: return this.w;
			default: throw new Error("Invalid Quaternion index.");
		}
	}

	public set(index: number, value: number) {
		switch (index) {
			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			case 3: this.w = value; break;
			default: throw new Error("Invalid Quaternion index.");
		}
	}

	public set_all(x: number, y: number, z: number, w: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	public static multiply(left: Quaternion, right: Quaternion): Quaternion {
		return new Quaternion(
			left.w * right.x + left.x * right.w + left.y * right.z - left.z * right.y,
			left.w * right.y + left.y * right.w + left.z * right.x - left.x * right.z,
			left.w * right.z + left.z * right.w + left.x * right.y - left.y * right.x,
			left.w * right.w - left.x * right.x - left.y * right.y - left.z * right.z
		);
	}

	public static rotate_point(rotation: Quaternion, point: Vector3) {

		const x: number = rotation.x * 2;
		const y: number = rotation.y * 2;
		const z: number = rotation.z * 2;
		const xx: number = rotation.x * x;
		const yy: number = rotation.y * y;
		const zz: number = rotation.z * z;
		const xy: number = rotation.x * y;
		const xz: number = rotation.x * z;
		const yz: number = rotation.y * z;
		const wx: number = rotation.w * x;
		const wy: number = rotation.w * y;
		const wz: number = rotation.w * z;

		const res = new Vector3();

		res.x = (1 - (yy + zz)) * point.x + (xy - wz) * point.y + (xz + wy) * point.z;
		res.y = (xy + wz) * point.x + (1 - (xx + zz)) * point.y + (yz - wx) * point.z;
		res.z = (xz - wy) * point.x + (yz + wx) * point.y + (1 - (xx + yy)) * point.z;

		return res;
	}

	private static is_equal_using_dot(dot: number): boolean {
		return dot > 1.0 - 0.000001;
	}

	public static equal(left: Quaternion, right: Quaternion) {
		return Quaternion.is_equal_using_dot(Quaternion.dot(left, right));
	}

	public static dot(left: Quaternion, right: Quaternion): number {
		return left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w;
	}

	public static angle(left: Quaternion, right: Quaternion): number {
		const dot = Quaternion.dot(left, right);
		return Quaternion.is_equal_using_dot(dot) ? 0 : Math.acos(Math.min(Math.abs(dot), 1)) * 2 * (360 / (Math.PI * 2));
	}

	private static internal_make_positive(euler: Vector3) {
		const negative_flip: number = -0.0001 * (360 / (Math.PI * 2));
		const positive_flip = 360 + negative_flip;


		if (euler.x < negative_flip)
			euler.x += 360.0;
		else if (euler.x > positive_flip)
			euler.x -= 360.0;

		if (euler.y < negative_flip)
			euler.y += 360.0;
		else if (euler.y > positive_flip)
			euler.y -= 360.0;

		if (euler.z < negative_flip)
			euler.z += 360.0;
		else if (euler.z > positive_flip)
			euler.z -= 360.0;

		return euler;
	}


	// https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles?oldformat=true#Quaternion_to_Euler_angles_conversion
	public static to_euler(q: Quaternion): Vector3 {
		const t0 = 2 * (q.w * q.x + q.y * q.z);
		const t1 = 1 - 2 * (q.x * q.x + q.y * q.y);
		const roll_x = Math.atan2(t0, t1);

		let t2 = 2 * (q.w * q.y - q.z * q.x);
		t2 = t2 > 1 ? 1 : t2;
		t2 = t2 < -1 ? -1 : t2;
		const pitch_y = Math.asin(t2);

		const t3 = 2 * (q.w * q.z + q.x * q.y);
		const t4 = 1 - 2 * (q.y * q.y + q.z * q.z);
		const yaw_z = Math.atan2(t3, t4);

		return new Vector3(roll_x, pitch_y, yaw_z);
	}

	// https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles?oldformat=true#Euler_angles_to_quaternion_conversion
	public static from_euler(v: Vector3): Quaternion {
		const c1 = Math.cos(v.x / 2);
		const c2 = Math.cos(v.y / 2);
		const c3 = Math.cos(v.z / 2);
		const s1 = Math.sin(v.x / 2);
		const s2 = Math.sin(v.y / 2);
		const s3 = Math.sin(v.z / 2);

		const q = new Quaternion();
		q.x = s1 * c2 * c3 + c1 * s2 * s3;
		q.y = c1 * s2 * c3 - s1 * c2 * s3;
		q.z = c1 * c2 * s3 + s1 * s2 * c3;
		q.w = c1 * c2 * c3 - s1 * s2 * s3;

		return q;
	}

	// https://automaticaddison.com/how-to-convert-a-quaternion-to-a-rotation-matrix/
	public to_rotation_matrix(): Matrix4x4 {
		// Precalculate coordinate products
		const x: number = this.x * 2;
		const y: number = this.y * 2;
		const z: number = this.z * 2;
		const xx: number = this.x * x;
		const yy: number = this.y * y;
		const zz: number = this.z * z;
		const xy: number = this.x * y;
		const xz: number = this.x * z;
		const yz: number = this.y * z;
		const wx: number = this.w * x;
		const wy: number = this.w * y;
		const wz: number = this.w * z;

		// Calculate 3x3 matrix from orthonormal basis
		const m = new Matrix4x4();

		m.m00 = 1 - (yy + zz); m.m10 = xy + wz; m.m20 = xz - wy;
		m.m01 = xy - wz; m.m11 = 1 - (xx + zz); m.m21 = yz + wx;
		m.m02 = xz + wy; m.m12 = yz - wx; m.m22 = 1 - (xx + yy);

		m.m33 = 1;

		return m;
	}

	public conjugated(): Quaternion {
		return new Quaternion(-this.x, -this.y, -this.z, this.w);
	}

	public norm(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	}

	public square_norm(): number {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	}
}