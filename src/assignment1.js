class PolygonRenderer {
  constructor(gl, posAttrLoc, colorAttrLoc) {
    this.gl = gl
    this.posAttrLoc = posAttrLoc
    this.colorAttrLoc = colorAttrLoc
  }

  renderPolygon(positions, colors) {
    positions = new Float32Array(positions)
    colors = new Float32Array(colors)

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

function sinDeg(degree) {
  return Math.sin(degree * (Math.PI / 180))
}

function cosDeg(degree) {
  return Math.cos(degree * (Math.PI / 180))
}

function generateTrianglePositions(x, y, r) {
  return [x, y - r, x - r * cosDeg(30), y + r * sinDeg(30), x + r * cosDeg(30), y + r * sinDeg(30)]
}

function generateRandomColors(n) {
  let colors = []
  for (let i = 0; i < n; i++) {
    colors.push([Math.random(), Math.random(), Math.random(), 1])
  }
  return colors
}

function renderCircle(renderer, x, y, r, vertexCnt, vertexColorCnt = vertexCnt) {
  const centerColor = generateRandomColors(1)[0]
  const vertexColors = generateRandomColors(vertexColorCnt)

  for (let i = 0; i < vertexCnt; i++) {
    const deg1 = (360 / vertexCnt) * i
    const deg2 = (360 / vertexCnt) * (i + 1)
    renderer.renderPolygon(
      [x, y, x + r * sinDeg(deg1), y - r * cosDeg(deg1), x + r * sinDeg(deg2), y - r * cosDeg(deg2)],
      [
        ...centerColor,
        ...vertexColors[Math.floor(i * (vertexColorCnt / vertexCnt))],
        ...vertexColors[Math.floor(((i + 1) % vertexCnt) * (vertexColorCnt / vertexCnt))],
      ]
    )
  }
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

  const x1 = 300
  const y1 = 300
  const r1 = 100
  const polygonRenderer = new PolygonRenderer(gl, positionAttributeLocation, colorAttributeLocation)
  polygonRenderer.renderPolygon(
    generateTrianglePositions(x1, y1 - r1, r1),
    generateRandomColors(3).reduce((prev, cur) => [...prev, ...cur])
  )
  polygonRenderer.renderPolygon(
    generateTrianglePositions(x1 - r1 * cosDeg(30), y1 + r1 * sinDeg(30), r1),
    generateRandomColors(3).reduce((prev, cur) => [...prev, ...cur])
  )
  polygonRenderer.renderPolygon(
    generateTrianglePositions(x1 + r1 * cosDeg(30), y1 + r1 * sinDeg(30), r1),
    generateRandomColors(3).reduce((prev, cur) => [...prev, ...cur])
  )
  polygonRenderer.renderPolygon(
    generateTrianglePositions(x1, y1, -r1),
    generateRandomColors(3).reduce((prev, cur) => [...prev, ...cur])
  )

  const x2 = 700
  const y2 = 300
  const r2 = 100
  // left to right, top to bottom 0 ~ 5
  const colors = generateRandomColors(6)
  polygonRenderer.renderPolygon(generateTrianglePositions(x2, y2 - r2, r2), [...colors[0], ...colors[1], ...colors[2]])
  polygonRenderer.renderPolygon(generateTrianglePositions(x2 - r2 * cosDeg(30), y2 + r2 * sinDeg(30), r2), [
    ...colors[1],
    ...colors[3],
    ...colors[4],
  ])
  polygonRenderer.renderPolygon(generateTrianglePositions(x2, y2, -r2), [...colors[4], ...colors[2], ...colors[1]])
  polygonRenderer.renderPolygon(generateTrianglePositions(x2 + r2 * cosDeg(30), y2 + r2 * sinDeg(30), r2), [
    ...colors[2],
    ...colors[4],
    ...colors[5],
  ])

  const x3 = 300
  const y3 = 600
  const r3 = 130
  renderCircle(polygonRenderer, x3, y3, r3, 20)

  const x4 = 700
  const y4 = 600
  const r4 = 130
  renderCircle(polygonRenderer, x4, y4, r4, 100, 1)
}

main()
