import { mat4 } from "gl-matrix";
import { Shader } from "./shader";
import { Buffers } from "./buffers";



function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    const needResize = canvas.width !== displayWidth ||
        canvas.height !== displayHeight;

    if (needResize) {
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }

    return needResize;
}

function drawScene(gl: WebGLRenderingContext, shader : Shader , buffers : Buffers, texture : WebGLTexture ,canvas : HTMLCanvasElement, cubeRotation : number) 
{
    if (resizeCanvasToDisplaySize(canvas)) { gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); }

    gl.clearColor(0.15, 0.15 , 0.15, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = (45 * Math.PI) / 2000; // in radians
    const aspect = gl.canvas.width / gl.canvas.height;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    const modelViewMatrix = mat4.create();
    mat4.translate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [-0.0, 0.0, -80.0],
    ); // amount to translate
    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        cubeRotation, // amount to rotate in radians
        [0, 0, 1],
    ); // axis to rotate around (Z)
    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        cubeRotation * 0.7, // amount to rotate in radians
        [0, 1, 0],
    ); // axis to rotate around (Y)
    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        cubeRotation * 0.3, // amount to rotate in radians
        [1, 0, 0],
    ); // axis to rotate around (X)


    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    setPositionAttribute(gl, buffers, shader);
    // setColorAttribute(gl, buffers, shader);
    setTextureAttribute(gl, buffers, shader);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices as WebGLBuffer);
    setNormalAttribute(gl, buffers, shader);
    shader.use();

    gl.uniformMatrix4fv(
        shader.getUniformLocation('uProjectionMatrix'),
        false,
        projectionMatrix,
    );
    gl.uniformMatrix4fv(
        shader.getUniformLocation('uModelViewMatrix'),
        false,
        modelViewMatrix,
    );
    gl.uniformMatrix4fv(
        shader.getUniformLocation('uNormalMatrix'),
        false,
        normalMatrix,
    );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(shader.getUniformLocation("uSampler"), 0);
    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

}

function setPositionAttribute(gl: WebGLRenderingContext, buffers : Buffers, shader : Shader) {
    const numComponents = 3; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position as WebGLBuffer);
    gl.vertexAttribPointer(
        shader.getAttributeLocation('aVertexPosition'),
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(shader.getAttributeLocation('aVertexPosition'));
}



function setColorAttribute(gl: WebGLRenderingContext, buffers : Buffers, shader : Shader) 
{
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color as WebGLBuffer);
    gl.vertexAttribPointer(
        shader.getAttributeLocation('aVertexColor'),
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(shader.getAttributeLocation('aVertexColor'));
}



function setTextureAttribute(gl: WebGLRenderingContext, buffers : Buffers, shader : Shader) {
    const num = 2; // every coordinate composed of 2 values
    const type = gl.FLOAT; // the data in the buffer is 32-bit float
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set to the next
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord as WebGLBuffer);
    gl.vertexAttribPointer(
        shader.getAttributeLocation('aTextureCoord'),
        num,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(shader.getAttributeLocation('aTextureCoord'));
}



function setNormalAttribute(gl: WebGLRenderingContext, buffers : Buffers, shader : Shader) {
  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal as WebGLBuffer);
  gl.vertexAttribPointer(
    shader.getAttributeLocation('aVertexNormal'),
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
  gl.enableVertexAttribArray(shader.getAttributeLocation('aVertexNormal'));
}

export { drawScene };
