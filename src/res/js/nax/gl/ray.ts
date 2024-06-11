import { Vector3 } from "./vector3";

export class Ray {
	origin: Vector3;
	direction: Vector3;
	length: number;

	constructor(origin: Vector3, direction: Vector3, length: number) {
		this.origin = origin;
		this.direction = direction;
		this.length = length;
	}
}