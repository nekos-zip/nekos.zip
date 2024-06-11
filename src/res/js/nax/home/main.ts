import { Camera, Quad, Vector3 } from "🌙js/gl";

let canvas = document.querySelector("#bgc") as HTMLCanvasElement;
let context = canvas.getContext("webgl2")!;
if (context === null) {
	throw new Error("WebGL2 not supported.");
}

const camera: Camera = new Camera(canvas.width / canvas.height);
camera.dirty = true;

function resize() {
	canvas.setAttribute("width", String(window.innerWidth));
	canvas.setAttribute("height", String(window.innerHeight));
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	context.viewport(0, 0, innerWidth, innerHeight);
	camera.aspect_ratio = innerWidth / innerHeight;
	camera.dirty = true;
}

window.addEventListener("resize", resize, true);
resize();

context.viewport(0, 0, canvas.width, canvas.height);
context.clearColor(0, 0, 0, 1);
context.enable(context.DEPTH_TEST);
context.enable(context.BLEND);
context.cullFace(context.BACK);

let last = 0;

camera.transform.dirty = true;
camera.update();

let image = document.querySelector("#gradient") as HTMLImageElement;

let quad = new Quad(context, image);
quad.transform.position = new Vector3(0, 0, 0);

const draw = function (now: number) {

	now *= 0.001;
	const delta_time = now - last;
	last = now;

	context.bindFramebuffer(context.FRAMEBUFFER, null);
	context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

	// quad.transform.rotation.x += delta_time;
	// quad.transform.dirty = true;
	quad.draw(context, delta_time, camera);
	// console.log(quad.transform.rotation.y);


	requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
