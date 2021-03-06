"use strict";

function main() {
  // Get A WebGL context
  var canvas = document.querySelector("#app");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  var program = webglUtils.createProgramFromScripts(gl, [
    "vertex-shader",
    "fragment-shader",
  ]);
  console.log(program);

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  var resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  // buffer for vertex
  gl.enableVertexAttribArray(positionAttributeLocation);
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  bufferTriangle(gl, gl.canvas.width / 2, gl.canvas.height / 2, 150);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // buffer for color
  gl.enableVertexAttribArray(colorAttributeLocation);
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  bufferColors(gl);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 4; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    colorAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // Draw the rectangle.
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

function bufferTriangle(gl, x, y, r) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      x,
      y - r,
      x - r * 0.7,
      y + r * 0.3,
      x + r * 0.7,
      y + r * 0.3,
    ]),
    gl.STATIC_DRAW
  );
}

function bufferColors(gl) {
  // Make every vertex a different color.
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      Math.random(),
      Math.random(),
      Math.random(),
      1,
      Math.random(),
      Math.random(),
      Math.random(),
      1,
      Math.random(),
      Math.random(),
      Math.random(),
      1,
    ]),
    gl.STATIC_DRAW
  );
}

main();
