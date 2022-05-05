"use strict";

class Renderer {
  constructor() {
    var canvas = document.querySelector("#app");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
      return;
    }

    var program = webglUtils.createProgramFromScripts(gl, [
      "vertex-shader",
      "fragment-shader",
    ]);

    var resolutionUniformLocation = gl.getUniformLocation(
      program,
      "u_resolution"
    );
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var colorAttributeLocation = gl.getAttribLocation(program, "a_color");

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // buffer for vertex position
    this.bufferTrianglePosition(
      gl,
      gl.canvas.width / 2,
      gl.canvas.height / 2,
      150
    );
    this.setPositionAttributePointer(gl, positionAttributeLocation);

    // buffer for color
    this.bufferColors(gl);

    gl.enableVertexAttribArray(colorAttributeLocation);
    var size = 4;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
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
  randomInt(range) {
    return Math.floor(Math.random() * range);
  }

  bufferTrianglePosition(gl, x, y, r) {
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const cos30 = Math.cos(30 * (Math.PI / 180));
    const sin30 = Math.sin(30 * (Math.PI / 180));
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        x,
        y - r,
        x - r * cos30,
        y + r * sin30,
        x + r * cos30,
        y + r * sin30,
      ]),
      gl.STATIC_DRAW
    );
  }

  setPositionAttributePointer(gl, positionAttributeLocation) {
    gl.enableVertexAttribArray(positionAttributeLocation);
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );
  }

  bufferColors(gl) {
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

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
}

function main() {
  new Renderer();
}

main();
