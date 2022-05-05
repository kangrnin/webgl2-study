class PolygonRenderer {
  constructor(gl, posAttrLoc, colorAttrLoc) {
    this.gl = gl
    this.posAttrLoc = posAttrLoc
    this.colorAttrLoc = colorAttrLoc
  }

  renderPolygon(positions, colors) {
    this.setVertexPositions(positions)
    this.setColors(colors)

    // Draw the rectangle.
    var primitiveType = this.gl.TRIANGLES
    var offset = 0
    var count = 3
    this.gl.drawArrays(primitiveType, offset, count)
  }

  setVertexPositions(positions) {
    this.bindNewAttributeBuffer()
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW)
    this.setPositionAttributePointer()
  }

  setColors(colors) {
    this.bindNewAttributeBuffer()
    this.gl.bufferData(this.gl.ARRAY_BUFFER, colors, this.gl.STATIC_DRAW)
    this.setColorAttributePointer()
  }

  bindNewAttributeBuffer() {
    var attributeBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attributeBuffer)
  }

  setPositionAttributePointer() {
    this.gl.enableVertexAttribArray(this.posAttrLoc)
    var size = 2
    var type = this.gl.FLOAT
    var normalize = false
    var stride = 0
    var offset = 0
    this.gl.vertexAttribPointer(this.posAttrLoc, size, type, normalize, stride, offset)
  }

  setColorAttributePointer() {
    this.gl.enableVertexAttribArray(this.colorAttrLoc)
    var size = 4
    var type = this.gl.FLOAT
    var normalize = false
    var stride = 0
    var offset = 0
    this.gl.vertexAttribPointer(this.colorAttrLoc, size, type, normalize, stride, offset)
  }
}

function generateTrianglePositions(x, y, r) {
  const cos30 = Math.cos(30 * (Math.PI / 180))
  const sin30 = Math.sin(30 * (Math.PI / 180))
  return new Float32Array([x, y - r, x - r * cos30, y + r * sin30, x + r * cos30, y + r * sin30])
}

function generateRandomColors(n) {
  let colors = []
  for (let i = 0; i < n; i++) {
    colors = [...colors, Math.random(), Math.random(), Math.random(), 1]
  }

  return new Float32Array(colors)
}

function main() {
  const canvas = document.querySelector("#app")
  const gl = canvas.getContext("webgl2")
  if (!gl) {
    return
  }

  const program = webglUtils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"])

  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
  const colorAttributeLocation = gl.getAttribLocation(program, "a_color")

  webglUtils.resizeCanvasToDisplaySize(gl.canvas)

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0, 0, 0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.useProgram(program)
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

  const cos30 = Math.cos(30 * (Math.PI / 180))
  const sin30 = Math.sin(30 * (Math.PI / 180))
  const r = 100

  const polygonRenderer = new PolygonRenderer(gl, positionAttributeLocation, colorAttributeLocation)
  polygonRenderer.renderPolygon(
    generateTrianglePositions(gl.canvas.width / 2, gl.canvas.height / 2 - r, r),
    generateRandomColors(3)
  )
  polygonRenderer.renderPolygon(
    generateTrianglePositions(gl.canvas.width / 2 - r * cos30, gl.canvas.height / 2 + r * sin30, r),
    generateRandomColors(3)
  )
  polygonRenderer.renderPolygon(
    generateTrianglePositions(gl.canvas.width / 2 + r * cos30, gl.canvas.height / 2 + r * sin30, r),
    generateRandomColors(3)
  )
  polygonRenderer.renderPolygon(
    generateTrianglePositions(gl.canvas.width / 2, gl.canvas.height / 2, -r),
    generateRandomColors(3)
  )
}

main()
