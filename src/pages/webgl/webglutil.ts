/**
 * 创建shader
 *
 * @param gl
 * @param type
 * @param source
 * @returns
 */
export function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (shader) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
}

/**
 * 创建WebGL程序
 *
 * @param gl
 * @param vertexShader
 * @param fragmentShader
 * @returns
 */
export function createProgram(gl: WebGLRenderingContext, vertexShader?: WebGLShader, fragmentShader?: WebGLShader) {
  var program = gl.createProgram();
  if (program && vertexShader && fragmentShader) {
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
}


