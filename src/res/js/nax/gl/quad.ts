import { Transform } from "./transform";
import { Material } from "./material";
import * as Texture from "./texture_utils";
import { Camera } from "./camera";
import { Matrix4x4 } from "./matrix4x4";

export class Quad {
	public readonly mesh = [
		-1, -1,
		1, -1,
		-1, 1,
		1, 1
	];

	public readonly triangles = [
		0, 1, 2,
		2, 1, 3
	];

	public readonly UVs = [
		0, 0,
		1, 0,
		0, 1,
		1, 1
	];

	public texture: WebGLTexture;
	public material: Material;
	public frame_buffer: WebGLFramebuffer;
	public index_buffer: WebGLBuffer;
	public transform: Transform;

	private time: number = 0;

	constructor(gl: WebGL2RenderingContext, image: HTMLImageElement) {

		const vertex_shader_source = `#version 300 es
in vec4 a_pos;
in vec2 a_uv;

out vec2 v_uv;

uniform mat4 u_matrix;

void main() {
	gl_Position = u_matrix * a_pos;
	//gl_Position = a_pos;
	v_uv = a_uv;
}
`;

		const fragment_shader_source = `#version 300 es
precision highp float;
precision highp int;

uniform float time;
uniform sampler2D u_texture;

in vec2 v_uv;

out vec4 outColour;

int Dither(ivec2 fragCoord) {
	const int bayer[16] = int[16](
		-4, +0, -3, +1,
		+2, -2, +3, -1,
		-3, +1, -4, +0,
		+3, -1, +2, -2
	);

	int x = fragCoord.x % 4;
	int y = fragCoord.y % 4;
	return bayer[y * 4 + x];
}

vec2 GetGradient(vec2 intPos, float t) {

	float rand = fract(sin(dot(intPos, vec2(12.9898, 78.233))) * 43758.5453);

	// Rotate gradient: random starting rotation, random rotation rate
	float angle = 6.283185 * rand + 4.0 * t * rand;
	return vec2(cos(angle), sin(angle));
}

float Pseudo3dNoise(vec3 pos) {
	vec2 i = floor(pos.xy);
	vec2 f = pos.xy - i;
	vec2 blend = f * f * (3.0 - 2.0 * f);
	float noiseVal = mix(mix(dot(GetGradient(i + vec2(0, 0), pos.z), f - vec2(0, 0)), dot(GetGradient(i + vec2(1, 0), pos.z), f - vec2(1, 0)), blend.x), mix(dot(GetGradient(i + vec2(0, 1), pos.z), f - vec2(0, 1)), dot(GetGradient(i + vec2(1, 1), pos.z), f - vec2(1, 1)), blend.x), blend.y);
	// normalize to about [-1..1]
	return noiseVal / 0.7;
}

float warpGrid(vec2 fragCoord) {
	float gridSize = 100.0;

	float noiseSize = 100.0;

	vec2 distortion = vec2(30.0 * Pseudo3dNoise(vec3(fragCoord / noiseSize, time / 2.0)), 30.0 * Pseudo3dNoise(vec3(fragCoord / noiseSize, time / 2.0)));

	vec2 coords = fragCoord.xy + distortion.xy;

	float col = mod(floor(coords.x / gridSize) * gridSize +
		floor(coords.y / gridSize) * gridSize, 2.0 * gridSize);

	return clamp(col, 0.0, 1.0);
}

void main() {
	float glitcha = 5.0;
	float offset = floor(Pseudo3dNoise(vec3(floor(gl_FragCoord.y * 0.8 + cos(time * 0.0)), gl_FragCoord.y*14.0/2.0, time * 0.0)) * glitcha) / glitcha;
	offset *= 5.0;

	vec2 uv = gl_FragCoord.xy + vec2(0, -time) / 0.025;
	float gridFactor = warpGrid(vec2(uv.x + offset, uv.y));
	int bayer = Dither(ivec2(gl_FragCoord.xy / 4.0));

	ivec3 c = ivec3(round(texture(u_texture, vec2(1.0 - v_uv.y, v_uv.x)).rgb * 255.0));
	c += ivec3(bayer);
	c >>= 3;
	vec4 col = vec4(vec3(c) / float(1 << 5), 1.0);
	outColour = mix(vec4(0.0), col, gridFactor);
}
`;

		const texture_options: Texture.AllocateTextureOptions = { border: 0, internal_format: gl.RGBA, type: gl.UNSIGNED_BYTE, format: gl.RGBA };
		this.texture = Texture.allocate_from_image(gl, image, 0, texture_options)!;
		this.frame_buffer = Texture.attach_tex_to_frame_buffer(gl, this.texture, 0)!;

		this.index_buffer = gl.createBuffer()!;
		gl.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, this.index_buffer);
		gl.bufferData(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triangles), gl.STATIC_DRAW);

		this.transform = new Transform();

		this.material = new Material(
			gl,
			vertex_shader_source,
			fragment_shader_source,
			{
				"a_pos": { data: this.mesh, size: 2 },
				"a_uv": { data: this.UVs, size: 2 }
			}
		);
	}

	public draw(gl: WebGL2RenderingContext, delta_time: number, camera: Camera) {

		this.time += delta_time;

		this.material.use(gl);

		this.material.bind_attribute_data(
			{
				"a_pos": { data: this.mesh, size: 2 },
				"a_uv": { data: this.UVs, size: 2 }
			}
		);
		this.material.bind_uniform_data(
			{
				"u_matrix": { data: (Matrix4x4.multiply(camera.clip_matrix, this.transform.getMatrix()).to_array()) },
				"time": { data: [this.time] },
			}
		);

		gl.activeTexture(WebGL2RenderingContext.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		gl.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, this.index_buffer);
		gl.drawElements(WebGL2RenderingContext.TRIANGLES, 6, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
		// gl.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 6);
	}
}