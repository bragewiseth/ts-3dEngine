import { GLUtils } from "./gl";
import { gl } from "./gl";
import { Shader } from "./shader";
import vertex  from './glsl/vertexShader.vert';
import fragment from './glsl/fragmentShader.frag';
import { drawScene } from "./drawscene";
import { initBuffers } from "./buffers";
import { positions, faceColors, indices, textureCoordinates, vertexNormals } from "./instance";

let deltaTime = 0;
let cubeRotation = 0.0;


function engine()
{
    let canvas = GLUtils.init();
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    let shader = new Shader('basic', vertex, fragment);
    const buffers = initBuffers(gl, positions, faceColors, indices, textureCoordinates, vertexNormals );
    const texture : WebGLTexture = loadTexture(gl, 'assets/copper.webp') as WebGLTexture;
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    requestAnimationFrame(render);
    let then = 0;
    function render(now: number)
    {
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;
        drawScene(gl, shader, buffers,texture, canvas, cubeRotation);
        cubeRotation += deltaTime;
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}




//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl : WebGLRenderingContext, url : string) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel,
    );

    const image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            image,
        );

        // WebGL1 has different requirements for power of 2 images
        // vs. non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;

    return texture;
}

function isPowerOf2(value : number) 
{
    return (value & (value - 1)) === 0;
}



export { engine };