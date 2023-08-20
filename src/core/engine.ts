import { GLUtils } from "./gl/GL";
import { gl } from "./gl/GL";
import { Shader } from "./gl/shader";
import { AttributeInfo, GLBuffer } from "./gl/glBuffer";


export class Engine 
{
    private _canvas : HTMLCanvasElement;
    private _shader : Shader;
    private _buffer : GLBuffer;

    constructor() { console.log('Engine constructed') }
    
    public start()
    {
        console.log('Engine started')
        this._canvas = GLUtils.init();
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        this.loadShaders();
        this._shader.use();
        this.createBuffer();
        gl.viewport(0, 0, this._canvas.width, this._canvas.height);
        this.loop();
    }


    private loop()
    {
        gl.clear( gl.COLOR_BUFFER_BIT );
        // set uniforms
        let colorLocation = this._shader.getUniformLocation( 'u_color' );
        gl.uniform4f( colorLocation , 1, 0.5, 0 ,1 );

        this._buffer.bind();
        this._buffer.draw();
        requestAnimationFrame( this.loop.bind(this) ) 
    }


    private createBuffer() : void
    {
        this._buffer = new GLBuffer(3);
        let positionAttribute = new AttributeInfo();
        positionAttribute.location = this._shader.getAttributeLocation( "aVertexPosition" );
        positionAttribute.offset = 0;
        positionAttribute.size = 3;
        this._buffer.addAttributeLocation( positionAttribute );
        let vertices : number[] =
            [ 0, 0, 0,
              0, 0.5, 0,
              0.5, 0.5, 0]

        this._buffer.pushBackData( vertices );
        this._buffer.upload()
        this._buffer.unbind();
    }



    private loadShaders () : void
    {
        let vertexShaderSource : string = 
        `
        attribute vec3 aVertexPosition;
        void main()
        {
            gl_Position = vec4(aVertexPosition, 1.0);
        }
        `;

        let fragmentShaderSource : string =
        `
        precision mediump float;
        uniform vec4 u_color;
        void main()
        {
            gl_FragColor = u_color;
        }
        `;

        this._shader = new Shader('basic', vertexShaderSource, fragmentShaderSource);
    }
}