import { Vector4 } from "./vector";

export const JS_GL_Typed_Array: { [index: number]: any } = {}

JS_GL_Typed_Array[5120]   = Int8Array;
JS_GL_Typed_Array[5121]   = Uint8Array;
JS_GL_Typed_Array[5122]   = Int16Array;
JS_GL_Typed_Array[5123]   = Uint16Array;
JS_GL_Typed_Array[5124]   = Int32Array;
JS_GL_Typed_Array[5125]   = Uint32Array;
JS_GL_Typed_Array[5126]   = Float32Array;
JS_GL_Typed_Array[32819]  = Uint16Array;
JS_GL_Typed_Array[32820]  = Uint16Array;
JS_GL_Typed_Array[33635]  = Uint16Array;
JS_GL_Typed_Array[5131]   = Uint16Array;
JS_GL_Typed_Array[33640]  = Uint32Array;
JS_GL_Typed_Array[35899]  = Uint32Array;
JS_GL_Typed_Array[35902]  = Uint32Array;
JS_GL_Typed_Array[36269]  = Uint32Array;
JS_GL_Typed_Array[34042]  = Uint32Array;
JS_GL_Typed_Array[0x8B50] = Float32Array;
JS_GL_Typed_Array[0x8B51] = Float32Array;
JS_GL_Typed_Array[0x8B52] = Float32Array;



// location: WebGLUniformLocation | null, data: Float32List, srcOffset?: number | undefined, srcLength?: number | undefined
// location: WebGLUniformLocation | null, data: Int32List, srcOffset?: number | undefined, srcLength?: number | undefined

type UniformSetterMethod = (loc: WebGLUniformLocation, data: number[]) => void;

export class Material {
	public readonly vertex_shader: string;
	public readonly fragment_shader: string;

	private vertex_shader_compiled: WebGLShader;
	private fragment_shader_compiled: WebGLShader;

	private gl: WebGL2RenderingContext;
	public readonly program: WebGLProgram;
	public readonly vertex_array: WebGLVertexArrayObject;
	public readonly buffers: { [index: string]: WebGLBuffer };
	public readonly uniform_setters: { [index: string]: (data: number[]) => void };

	public active_attribute_count: number;
	public attribute_info: { [index: string]: { info: WebGLActiveInfo, location: number, size: number } };

	constructor(
		gl: WebGL2RenderingContext,
		vertex_shader: string,
		fragment_shader: string,
		attribute_data: AttributeData,
	) {
		this.gl = gl;
		this.buffers = {};

		this.vertex_shader = vertex_shader;
		this.fragment_shader = fragment_shader;

		this.vertex_shader_compiled = this.create_shader(
			WebGL2RenderingContext.VERTEX_SHADER,
			vertex_shader
		)!;

		this.fragment_shader_compiled = this.create_shader(
			WebGL2RenderingContext.FRAGMENT_SHADER,
			fragment_shader
		)!;

		this.program = this.create_program()!;
		gl.useProgram(this.program);

		this.vertex_array = gl.createVertexArray()!;

		this.attribute_info = {};
		this.active_attribute_count = this.gl.getProgramParameter(this.program, WebGL2RenderingContext.ACTIVE_ATTRIBUTES);
		for (let i = 0; i < this.active_attribute_count; i++) {
			const attribute_info: WebGLActiveInfo = this.gl.getActiveAttrib(this.program, i)!;
			// console.log(attribute_info);
			const attribute_location: number = this.gl.getAttribLocation(this.program, attribute_info.name);
			this.attribute_info[attribute_info.name] = {
				info: attribute_info,
				location: attribute_location,
				size: attribute_data[attribute_info.name].size
			};
			this.buffers[attribute_info.name] = this.gl.createBuffer()!;
		}

		this.uniform_setters = {};
	}

	private create_shader(type: number, source: string): WebGLShader | undefined {
		const shader: WebGLShader = this.gl.createShader(type)!;
		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);
		const compile_status = this.gl.getShaderParameter(
			shader,
			this.gl.COMPILE_STATUS
		);

		if (compile_status) {
			return shader;
		} else {
			console.error(this.gl.getShaderInfoLog(shader));
			this.gl.deleteShader(shader);
		}
	}

	private create_program(): WebGLProgram | undefined {
		const program = this.gl.createProgram()!;
		this.gl.attachShader(program, this.vertex_shader_compiled);
		this.gl.attachShader(program, this.fragment_shader_compiled);
		this.gl.linkProgram(program);

		const link_status = this.gl.getProgramParameter(
			program,
			this.gl.LINK_STATUS
		);

		if (link_status) {
			return program;
		} else {
			console.error(this.gl.getProgramInfoLog(program));
			this.gl.deleteProgram(program);
		}
	}

	public bind_attribute_data(attributes: AttributeData) {

		for (let attribute_name in attributes) {
			const attribute_info = this.attribute_info[attribute_name];
			const buffer = this.buffers[attribute_name];

			this.gl.bindBuffer(
				WebGL2RenderingContext.ARRAY_BUFFER,
				buffer
			);

			this.gl.bufferData(
				WebGL2RenderingContext.ARRAY_BUFFER,
				new JS_GL_Typed_Array[attribute_info.info.type](attributes[attribute_name].data),
				WebGL2RenderingContext.STATIC_DRAW
			);

			//const attrib_loc = this.gl.getAttribLocation(this.program, attribute_name);

			this.gl.vertexAttribPointer(
				attribute_info.location,
				attribute_info.size,
				WebGL2RenderingContext.FLOAT,
				// this.attribute_info[attribute_name].info.type,
				false,
				0,
				0
			);

			this.gl.enableVertexAttribArray(attribute_info.location);
		}
	}

	public bind_uniform_data(uniforms: UniformData) {
		const active_uniform_count = this.gl.getProgramParameter(this.program, WebGL2RenderingContext.ACTIVE_UNIFORMS);
		for (let i = 0; i < active_uniform_count; i++) {
			const uniform_info: WebGLActiveInfo | null = this.gl.getActiveUniform(this.program, i);

			if (uniform_info) {
				const uniform_loc = this.gl.getUniformLocation(this.program, uniform_info.name)!;

				let setter = this.create_uniform_setter(uniform_info);

				if (uniforms[uniform_info.name]) {
					// console.log(`${uniform_info.name}`);
					this.uniform_setters[uniform_info.name] = (data: number[]) => setter(uniform_loc, data);
					this.uniform_setters[uniform_info.name](uniforms[uniform_info.name].data);
				}
			} else {
				throw new Error(`Invalid uniform index ${i}`);
			}
		}
	}

	public use(gl: WebGL2RenderingContext) {
		gl.useProgram(this.program);
		gl.bindVertexArray(this.vertex_array);
	}

	private create_uniform_setter(uniform_info: WebGLActiveInfo): UniformSetterMethod {
		let setter: UniformSetterMethod;

		switch (uniform_info.type) {
			case 0x1406: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform1fv(loc, data); break;
			case 0x8B50: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform2fv(loc, data); break;
			case 0x8B51: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform3fv(loc, data); break;
			case 0x8B52: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform4fv(loc, data); break;
			case 0x1404: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform1iv(loc, data); break;
			case 0x8B53: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform1iv(loc, data); break;
			case 0x8B54: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform1iv(loc, data); break;
			case 0x8B55: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform1iv(loc, data); break;
			case 0x1405: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform1uiv(loc, data); break;
			case 0x8DC6: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform1uiv(loc, data); break;
			case 0x8DC7: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform1uiv(loc, data); break;
			case 0x8DC8: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform1uiv(loc, data); break;
			case 0x8B56: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform1iv(loc, data); break;
			case 0x8B57: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform2iv(loc, data); break;
			case 0x8B58: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform3iv(loc, data); break;
			case 0x8B59: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform4iv(loc, data); break;
			case 0x8B5A: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniformMatrix2fv(loc, false, data); break;
			case 0x8B5B: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniformMatrix3fv(loc, false, data); break;
			case 0x8B5C: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniformMatrix4fv(loc, false, data); break;
			case 0x8B5E: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform1iv(loc, data); break;
			case 0x8B60: setter = (loc: WebGLUniformLocation, data: number[]) => this.gl.uniform1iv(loc, data); break;
			default: throw new Error(`Invalid uniform type ${uniform_info.type}`);
		}

		return setter;
	}

	public buffer_data(attribute_name: string, data: ArrayBuffer) {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[attribute_name]);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
	}

	public set_float(attribute_name: string, value: number) {
		this.buffer_data(attribute_name, new Float32Array([value]));
	}

	public set_float_array(attrib_name: string, values: number[]) {
		this.buffer_data(attrib_name, new Float32Array(values));
	}

	public set_int(attribute_name: string, value: number) {
		this.buffer_data(attribute_name, new Int32Array([value]));
	}

	public set_int_array(attribute_name: string, values: number) {
		this.buffer_data(attribute_name, new Int32Array(values));
	}

	public set_vector(attribute_name: string, value: Vector4) {
		this.buffer_data(
			attribute_name,
			new Float32Array([
				value.x,
				value.y,
				value.z,
				value.w,
			])
		);
	}

	public set_vector_array(attribute_name: string, values: Vector4[]) {
		let values_spread: number[] = [];
		for (let i = 0; i < values.length; i++) {
			values_spread.push.apply([
				values[i].x,
				values[i].y,
				values[i].z,
				values[i].w
			]);
		}

		this.buffer_data(
			attribute_name,
			new Float32Array(values_spread)
		);
	}
}

export interface AttributeData {
	[index: string]: {
		data: any[],
		size: number
	}
}

export interface UniformData {
	[index: string]: {
		data: number[]
	}
}