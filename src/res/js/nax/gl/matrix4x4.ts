import { Vector4 } from "./vector";
import { Vector3 } from "./vector3";
import { Quaternion } from "./quaternion";

export class Matrix4x4 {
	public m00: number;
	public m01: number;
	public m02: number;
	public m03: number;
	public m10: number;
	public m11: number;
	public m12: number;
	public m13: number;
	public m20: number;
	public m21: number;
	public m22: number;
	public m23: number;
	public m30: number;
	public m31: number;
	public m32: number;
	public m33: number;

	public constructor(column0?: Vector4, column1?: Vector4, column2?: Vector4, column3?: Vector4) {
		this.m00 = column0 ? column0.x : 0; this.m10 = column1 ? column1.x : 0; this.m20 = column2 ? column2.x : 0; this.m30 = column3 ? column3.x : 0;
		this.m01 = column0 ? column0.y : 0; this.m11 = column1 ? column1.y : 0; this.m21 = column2 ? column2.y : 0; this.m31 = column3 ? column3.y : 0;
		this.m02 = column0 ? column0.z : 0; this.m12 = column1 ? column1.z : 0; this.m22 = column2 ? column2.z : 0; this.m32 = column3 ? column3.z : 0;
		this.m03 = column0 ? column0.w : 0; this.m13 = column1 ? column1.w : 0; this.m23 = column2 ? column2.w : 0; this.m33 = column3 ? column3.w : 0;
	}

	public get(row: number, col: number) {
		switch (col * 4 + row) {
			case 0: return this.m00;
			case 1: return this.m01;
			case 2: return this.m02;
			case 3: return this.m03;
			case 4: return this.m10;
			case 5: return this.m11;
			case 6: return this.m12;
			case 7: return this.m13;
			case 8: return this.m20;
			case 9: return this.m21;
			case 10: return this.m22;
			case 11: return this.m23;
			case 12: return this.m30;
			case 13: return this.m31;
			case 14: return this.m32;
			case 15: return this.m33;
			default: throw new Error("Invalid Matrix4x4 index.");
		}
	}

	public set(row: number, col: number, value: number) {
		switch (col * 4 + row) {
			case 0: this.m00 = value; break;
			case 1: this.m01 = value; break;
			case 2: this.m02 = value; break;
			case 3: this.m03 = value; break;
			case 4: this.m10 = value; break;
			case 5: this.m11 = value; break;
			case 6: this.m12 = value; break;
			case 7: this.m13 = value; break;
			case 8: this.m20 = value; break;
			case 9: this.m21 = value; break;
			case 10: this.m22 = value; break;
			case 11: this.m23 = value; break;
			case 12: this.m30 = value; break;
			case 13: this.m31 = value; break;
			case 14: this.m32 = value; break;
			case 15: this.m33 = value; break;
			default: throw new Error("Invalid Matrix4x4 index.");
		}
	}

	public static multiply(left: Matrix4x4, right: Matrix4x4): Matrix4x4 {
		const res = new Matrix4x4();

		res.m00 = right.m00 * left.m00 + right.m01 * left.m10 + right.m02 * left.m20 + right.m03 * left.m30;
		res.m01 = right.m00 * left.m01 + right.m01 * left.m11 + right.m02 * left.m21 + right.m03 * left.m31;
		res.m02 = right.m00 * left.m02 + right.m01 * left.m12 + right.m02 * left.m22 + right.m03 * left.m32;
		res.m03 = right.m00 * left.m03 + right.m01 * left.m13 + right.m02 * left.m23 + right.m03 * left.m33;
		res.m10 = right.m10 * left.m00 + right.m11 * left.m10 + right.m12 * left.m20 + right.m13 * left.m30;
		res.m11 = right.m10 * left.m01 + right.m11 * left.m11 + right.m12 * left.m21 + right.m13 * left.m31;
		res.m12 = right.m10 * left.m02 + right.m11 * left.m12 + right.m12 * left.m22 + right.m13 * left.m32;
		res.m13 = right.m10 * left.m03 + right.m11 * left.m13 + right.m12 * left.m23 + right.m13 * left.m33;
		res.m20 = right.m20 * left.m00 + right.m21 * left.m10 + right.m22 * left.m20 + right.m23 * left.m30;
		res.m21 = right.m20 * left.m01 + right.m21 * left.m11 + right.m22 * left.m21 + right.m23 * left.m31;
		res.m22 = right.m20 * left.m02 + right.m21 * left.m12 + right.m22 * left.m22 + right.m23 * left.m32;
		res.m23 = right.m20 * left.m03 + right.m21 * left.m13 + right.m22 * left.m23 + right.m23 * left.m33;
		res.m30 = right.m30 * left.m00 + right.m31 * left.m10 + right.m32 * left.m20 + right.m33 * left.m30;
		res.m31 = right.m30 * left.m01 + right.m31 * left.m11 + right.m32 * left.m21 + right.m33 * left.m31;
		res.m32 = right.m30 * left.m02 + right.m31 * left.m12 + right.m32 * left.m22 + right.m33 * left.m32;
		res.m33 = right.m30 * left.m03 + right.m31 * left.m13 + right.m32 * left.m23 + right.m33 * left.m33;

		return res;
	}

	public static transform_Vector4_by_m4x4(m: Matrix4x4, v: Vector4): Vector4 {
		const res = Vector4.zero;

		res.x = m.m00 * v.x + m.m01 * v.y + m.m02 * v.z + m.m03 * v.w;
		res.y = m.m10 * v.x + m.m11 * v.y + m.m12 * v.z + m.m13 * v.w;
		res.z = m.m20 * v.x + m.m21 * v.y + m.m22 * v.z + m.m23 * v.w;
		res.w = m.m30 * v.x + m.m31 * v.y + m.m32 * v.z + m.m33 * v.w;

		return res;
	}

	public static equal(left: Matrix4x4, right: Matrix4x4) {

	}

	public get_column(index: number) {
		switch (index) {
			case 0: return new Vector4(this.m00, this.m10, this.m20, this.m30);
			case 1: return new Vector4(this.m01, this.m11, this.m21, this.m31);
			case 2: return new Vector4(this.m02, this.m12, this.m22, this.m32);
			case 3: return new Vector4(this.m03, this.m13, this.m23, this.m33);
			default: throw new Error("Invalid column index.");
		}
	}

	public get_row(index: number) {

		switch (index) {
			case 0: return new Vector4(this.m00, this.m01, this.m02, this.m03);
			case 1: return new Vector4(this.m10, this.m11, this.m12, this.m13);
			case 2: return new Vector4(this.m20, this.m21, this.m22, this.m23);
			case 3: return new Vector4(this.m30, this.m31, this.m32, this.m33);
			default: throw new Error("Invalid row index.");
		}
	}

	public set_column(index: number, v: Vector4) {
		this.set(0, index, v.x);
		this.set(1, index, v.y);
		this.set(2, index, v.z);
		this.set(3, index, v.w);
	}

	public set_row(index: number, v: Vector4) {
		this.set(index, 0, v.x);
		this.set(index, 1, v.y);
		this.set(index, 2, v.z);
		this.set(index, 3, v.w);
	}

	public multiply_point(point: Vector3): Vector3 {
		const res = new Vector3();

		res.x = this.m00 * point.x + this.m01 * point.y + this.m02 * point.z + this.m03;
		res.y = this.m10 * point.x + this.m11 * point.y + this.m12 * point.z + this.m13;
		res.z = this.m20 * point.x + this.m21 * point.y + this.m22 * point.z + this.m23;

		let w = this.m30 * point.x + this.m31 * point.y + this.m32 * point.z + this.m33;

		w = 1 / w;
		res.x *= w;
		res.y *= w;
		res.z *= w;

		return res;
	}

	public multiply_point_3x4(point: Vector3) {
		const res = new Vector3();

		res.x = this.m00 * point.x + this.m01 * point.y + this.m02 * point.z + this.m03;
		res.y = this.m10 * point.x + this.m11 * point.y + this.m12 * point.z + this.m13;
		res.z = this.m20 * point.x + this.m21 * point.y + this.m22 * point.z + this.m23;

		return res;
	}

	public multiply_vector(v: Vector3): Vector3 {
		const res = new Vector3();

		res.x = this.m00 * v.x + this.m01 * v.y + this.m02 * v.z;
		res.y = this.m10 * v.x + this.m11 * v.y + this.m12 * v.z;
		res.z = this.m20 * v.x + this.m21 * v.y + this.m22 * v.z;

		return res;
	}

	// Plane

	public static scale(vector: Vector3): Matrix4x4 {
		const m = new Matrix4x4();

		m.m00 = vector.x; m.m10 = 0; m.m20 = 0; m.m30 = 0;
		m.m01 = 0; m.m11 = vector.y; m.m21 = 0; m.m31 = 0;
		m.m02 = 0; m.m12 = 0; m.m22 = vector.z; m.m32 = 0;
		m.m03 = 0; m.m13 = 0; m.m23 = 0; m.m33 = 1;

		return m;
	}

	public static translate(vector: Vector3): Matrix4x4 {
		const m = new Matrix4x4();

		m.m00 = 1; m.m10 = 0; m.m20 = 0; m.m30 = vector.x;
		m.m01 = 0; m.m11 = 1; m.m21 = 0; m.m31 = vector.y;
		m.m02 = 0; m.m12 = 0; m.m22 = 1; m.m32 = vector.z;
		m.m03 = 0; m.m13 = 0; m.m23 = 0; m.m33 = 1;

		return m;
	}

	public static from_rotation(q: Quaternion): Matrix4x4 {

		// Precalculate coordinate products
		const x: number = q.x * 2;
		const y: number = q.y * 2;
		const z: number = q.z * 2;
		const xx: number = q.x * x;
		const yy: number = q.y * y;
		const zz: number = q.z * z;
		const xy: number = q.x * y;
		const xz: number = q.x * z;
		const yz: number = q.y * z;
		const wx: number = q.w * x;
		const wy: number = q.w * y;
		const wz: number = q.w * z;

		// Calculate 3x3 matrix from orthonormal basis
		const m = new Matrix4x4();

		m.m00 = 1 - (yy + zz); m.m10 = xy + wz; m.m20 = xz - wy;
		m.m01 = xy - wz; m.m11 = 1 - (xx + zz); m.m21 = yz + wx;
		m.m02 = xz + wy; m.m12 = yz - wx; m.m22 = 1 - (xx + yy);

		m.m33 = 1;

		return m;
	}

	// Realtime Rendering 4th Edition, Page 99, (Fig 4.75)
	public static perspective(fov_radians: number, aspect_ratio: number, near: number, far: number): Matrix4x4 {
		const res = new Matrix4x4();

		if (0 > near || near > far) throw new Error("Invalid clipping plane values");

		//const c = 1 / Math.tan(fov_radians / 2);
		const c = Math.tan(Math.PI / 2 - fov_radians / 2);

		res.m00 = c / aspect_ratio;
		res.m11 = c;
		res.m22 = (near + far) * (1 / (near - far));
		res.m23 = -1;
		res.m32 = near * far * (1 / (near - far)) * 2;

		// const top = Math.tan(fov_radians / 2) * near;
		// const bottom = -top;
		// const right = top * aspect_ratio;
		// const left = -top * aspect_ratio;

		// res.m00 = (near * 2) / (right - left);
		// res.m11 = (near * 2) / (top - bottom);
		// res.m20 = (right + left) / (right - left);
		// res.m21 = (top + bottom) / (top / bottom);
		// res.m22 = - ((far + near) / (far - near));
		// res.m23 = -1;
		// res.m32 = -(( 2 * far * near ) / (far - near));

		return res;
	}

	// Realtime Rendering 4th Edition, Page 95, (Fig 4.63)
	public static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4x4 {
		const res = new Matrix4x4();

		res.m00 = 2 / (right - left);
		res.m11 = 2 / (top - bottom);
		res.m22 = 2 / (far - near);
		res.m30 = -((right + left) / (right - left));
		res.m31 = -((top + bottom) / (top - bottom));
		res.m32 = -((far + near) / (far - near));
		res.m33 = 1;

		return res;
	}

	// http://blog.acipo.com/matrix-inversion-in-javascript/
	public inverse(): Matrix4x4 | undefined {
		const I = Matrix4x4.identity().copy();
		const C = this.copy();

		// Perform elementary row operations
		for (let diag = 0; diag < 4; diag += 1) {
			let e = C.get(diag, diag)!;

			if (e === 0) {
				for (let row_below = diag + 1; row_below < 4; row_below += 1) {

					// If the row below a non-0 value in the same column
					if (C.get(row_below, diag) !== 0) {

						// It would make the diagonal have a non-0 value, so swap it
						for (let column = 0; column < 4; column += 1) {
							C.swap_col_values_by_row(column, diag, row_below);
							I.swap_col_values_by_row(column, diag, row_below);
						}

						break;
					}
				}

				// If it's 0 then it can't be inverted
				const e = C.get(diag, diag);
				if (e === 0) return undefined;
			}

			// Scale this row down by e (So we have a 1 on the diagonal)
			for (let column = 0; column < 4; column += 1) {
				C.set(column, diag, C.get(column, diag)! / e);
				I.set(column, diag, I.get(column, diag)! / e);
			}

			// Subtract this row (scaled for each row) from all of the other rows,
			// so that there will be 0's in this column in all rows above and below this one
			for (let row2 = 0; row2 < 4; row2 += 1) {

				// Only apply to all other rows
				if (row2 === diag) continue;

				// Value we want to change to 0
				const e = C.get(diag, row2)!;

				// Subtract the row above (or below) scaled by e from the current row
				// But start at the row'th column and assume all the values left of the diagonal are 0
				for (let column = 0; column < 4; column += 1) {
					C.set(column, row2, C.get(column, row2)! - C.get(column, diag)! * e); // Apply to the original matrix
					I.set(column, row2, I.get(column, row2)! - I.get(column, diag)! * e); // Apply to identity
				}
			}
		}

		return I;
	}

	// https://d3cw3dd2w32x2b.cloudfront.net/wp-content/uploads/2015/01/matrix-to-quat.pdf
	public to_quaternion(): Quaternion {
		let t: number;
		let q: Quaternion;

		if (this.m22 < 0.0) {
			if (this.m00 > this.m11) {
				t = 1.0 + this.m00 - this.m11 - this.m22;
				q = new Quaternion(t, this.m10 + this.m01, this.m02 + this.m20, this.m21 - this.m12);
			} else {
				t = 1.0 - this.m00 + this.m11 - this.m22;
				q = new Quaternion(this.m10 + this.m01, t, this.m21 + this.m12, this.m02 - this.m20);
			}
		} else {
			if (this.m00 < -this.m11) {
				t = 1.0 - this.m00 - this.m11 + this.m22;
				q = new Quaternion(this.m02 + this.m20, this.m21 + this.m12, t, this.m10 - this.m01);
			} else {
				t = 1.0 + this.m00 + this.m11 + this.m22;
				q = new Quaternion(this.m21 - this.m12, this.m02 - this.m20, this.m10 - this.m01, t);
			}
		}

		const v = 0.5 / Math.sqrt(t);
		q.x *= v;
		q.y *= v;
		q.z *= v;
		q.w *= v;

		return q;
	}

	public static look_at(from: Vector3, to: Vector3, world_up: Vector3): Matrix4x4 {
		const z_axis: Vector3 = Vector3.sub(from, to).normalised(); // Z
		const x_axis: Vector3 = Vector3.cross(world_up, z_axis).normalised(); // X
		const y_axis: Vector3 = Vector3.cross(z_axis, x_axis).normalised(); // Y

		// const m = new Matrix4x4(
		// 	new Vector4(right.x,	up.x,	forward.x,	position.x	),
		// 	new Vector4(right.y,	up.y,	forward.y,	position.y	),
		// 	new Vector4(right.z,	up.z,	forward.z,	position.z	),
		// 	new Vector4(0,	0,	0,	1	)
		// );

		// const other = Matrix4x4.identity();
		// other.set_column(3, new Vector4(-from.x, -from.y, -from.z, 1));

		// const m = new Matrix4x4(
		// 	new Vector4(x_axis.x,	y_axis.x,	z_axis.x,	from.x	),
		// 	new Vector4(x_axis.y,	y_axis.y,	z_axis.y,	from.y	),
		// 	new Vector4(x_axis.z,	y_axis.z,	z_axis.z,	from.z	),
		// 	new Vector4(0,	0,	0,	1	)
		// );

		const m = new Matrix4x4(
			new Vector4(x_axis.x, x_axis.y, x_axis.z, 0),
			new Vector4(y_axis.x, y_axis.y, y_axis.z, 0),
			new Vector4(z_axis.x, z_axis.y, z_axis.z, 0),
			new Vector4(from.x, from.y, from.z, 1)
		);

		return m;
	}

	public swap_rows(a: number, b: number) {
		const tmp = this.get_row(a);
		this.set_row(a, this.get_row(b));
		this.set_row(b, tmp);
	}

	public swap_col_values_by_row(col: number, row1: number, row2: number) {
		const val = this.get(row1, col)!;
		this.set(row1, col, this.get(row2, col)!);
		this.set(row2, col, val);
	}

	public transposed(): Matrix4x4 {
		return new Matrix4x4(
			new Vector4(this.m00, this.m10, this.m20, this.m30),
			new Vector4(this.m01, this.m11, this.m21, this.m31),
			new Vector4(this.m02, this.m12, this.m22, this.m32),
			new Vector4(this.m03, this.m13, this.m23, this.m33)
		);
	}

	public copy(): Matrix4x4 {
		let n = new Matrix4x4;
		Object.assign(n, this);
		return n;
	}

	public to_f32_array(): Float32Array {
		return new Float32Array([
			this.m00,
			this.m01,
			this.m02,
			this.m03,
			this.m10,
			this.m11,
			this.m12,
			this.m13,
			this.m20,
			this.m21,
			this.m22,
			this.m23,
			this.m30,
			this.m31,
			this.m32,
			this.m33
		]);
	}

	public to_array(): number[] {
		return [
			this.m00,
			this.m01,
			this.m02,
			this.m03,
			this.m10,
			this.m11,
			this.m12,
			this.m13,
			this.m20,
			this.m21,
			this.m22,
			this.m23,
			this.m30,
			this.m31,
			this.m32,
			this.m33
		];
	}

	public log_as_table() {
		console.table([
			[this.m00, this.m10, this.m20, this.m30],
			[this.m01, this.m11, this.m21, this.m31],
			[this.m02, this.m12, this.m22, this.m32],
			[this.m03, this.m13, this.m23, this.m33],
		])
	}

	public static zero(): Matrix4x4 {
		let m = new Matrix4x4;
		m.m00 = 0; m.m10 = 0; m.m20 = 0; m.m30 = 0;
		m.m01 = 0; m.m11 = 0; m.m21 = 0; m.m31 = 0;
		m.m02 = 0; m.m12 = 0; m.m22 = 0; m.m32 = 0;
		m.m03 = 0; m.m13 = 0; m.m23 = 0; m.m33 = 0;
		return m;
	}

	public static identity(): Matrix4x4 {
		let m = new Matrix4x4;
		m.m00 = 1; m.m10 = 0; m.m20 = 0; m.m30 = 0;
		m.m01 = 0; m.m11 = 1; m.m21 = 0; m.m31 = 0;
		m.m02 = 0; m.m12 = 0; m.m22 = 1; m.m32 = 0;
		m.m03 = 0; m.m13 = 0; m.m23 = 0; m.m33 = 1;
		return m;
	}
}