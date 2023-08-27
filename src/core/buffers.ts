export type Buffers = {
    position?: WebGLBuffer | null,
    color? : WebGLBuffer | null,
    textureCoord? : WebGLBuffer | null,
    indices?: WebGLBuffer | null,
    normal?: WebGLBuffer | null,
};


function initBuffers(
    gl: WebGLRenderingContext,
    position?: number[],
    color?: number[][],
    index?: number[],
    textureCoord?: number[],
    normal?: number[],
): Buffers
{
    const positionBuffer = initPositionBuffer(gl, position);
    const colorBuffer = initColorBuffer(gl, color);
    const indexBuffer = initIndexBuffer(gl, index);
    const textureCoordBuffer = initTextureBuffer(gl, textureCoord);
    const normalBuffer = initNormalBuffer(gl, normal);

    return { 
        position: positionBuffer as WebGLBuffer,
        color: colorBuffer as WebGLBuffer,
        textureCoord: textureCoordBuffer as WebGLBuffer,
        indices: indexBuffer as WebGLBuffer,
        normal: normalBuffer as WebGLBuffer,
    };
}




function initPositionBuffer(gl : WebGLRenderingContext, positions? : number[]) : WebGLBuffer | null
{
    if ( positions === undefined ) { return null; }
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return positionBuffer;
}





function initColorBuffer(gl : WebGLRenderingContext, faceColors? : number[][]) : WebGLBuffer | null 
{
    if ( faceColors === undefined ) { return null; }

    // Convert the array of colors into a table for all the vertices.
    var colors : number[] = [];
    for (var j = 0; j < faceColors.length; ++j) 
    {
        const c = faceColors[j];
        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
    }
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    return colorBuffer;
}



function initIndexBuffer(gl : WebGLRenderingContext, indices? : number[]) : WebGLBuffer | null 
{
    if ( indices === undefined ) { return null; }

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW,
    );

    return indexBuffer;
}



function initTextureBuffer(gl: WebGLRenderingContext, textureCoordinates? : number[]) : WebGLBuffer | null
{
    if ( textureCoordinates === undefined ) { return null; }

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(textureCoordinates),
        gl.STATIC_DRAW,
    );

    return textureCoordBuffer;
}



function initNormalBuffer(gl: WebGLRenderingContext, vertexNormals? : number[]) : WebGLBuffer | null 
{
    if ( vertexNormals === undefined ) { return null; }
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertexNormals),
        gl.STATIC_DRAW,
    );

    return normalBuffer;
}

export { initBuffers };
