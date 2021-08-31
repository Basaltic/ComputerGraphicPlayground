 // an attribute will receive data from a buffer
attribute vec2 a_position;

// 传入的分辨率
uniform vec2 u_resolution;
// 模型变换矩阵
uniform mat3 u_matrix;

// 
varying vec4 v_color;



// all shaders have a main function
void main() {

  vec2 position = (u_matrix * vec3(a_position, 1)).xy;

  // pixel position to [0, 1]
  vec2 zeroToOne = position / u_resolution;

  vec2 zeroToTwo = zeroToOne * 2.0;

  vec2 clipSpace = zeroToTwo - 1.0;


  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

  v_color = gl_Position * 0.5 + 0.5;
}
  