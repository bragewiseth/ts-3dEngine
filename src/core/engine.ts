import { GLUtils } from "./gl/GL";
import { gl } from "./gl/GL";
import { Shader } from "./gl/shader";
import { Sprite } from "./graphics/sprite";
import { Matrix4x4 } from "./math/matrix4x4";


export class Engine 
{
    private _canvas : HTMLCanvasElement;
    private _shader : Shader;
    private _sprite : Sprite;
    private _projectionMatrix : Matrix4x4;

    constructor() { console.log('Engine constructed') }



    public start()
    {
        console.log('Engine started')
        this._canvas = GLUtils.init();
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        this.loadShaders();
        this._shader.use();
        // load
        this._projectionMatrix = Matrix4x4.orthographic(0, this._canvas.width, 0, this._canvas.height, -100, 100);
        this._sprite = new Sprite('test');
        this._sprite.load();
        // this._sprite.position.setX( 200 );
        // this._sprite.position.setY( this._canvas.height / 2 );

        this.resize();
        this.loop();
    }


    public resize() : void
    {
        if ( this._canvas !== undefined )
        {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
            gl.viewport( -1, 1, -1, 1 );
        }
    }

    private loop()
    {
        gl.clear( gl.COLOR_BUFFER_BIT );
        // set uniforms
        let colorLocation = this._shader.getUniformLocation( 'u_color' );
        gl.uniform4f( colorLocation , 1, 0.5, 0 ,1 );
        let matrixLocation = this._shader.getUniformLocation( 'uMVMatrix' );
        gl.uniformMatrix4fv( matrixLocation, false, new Float32Array( this._projectionMatrix.getData() ));
        let modelLocation = this._shader.getUniformLocation( 'uModel' );
        gl.uniformMatrix4fv( modelLocation, false, new Float32Array( Matrix4x4.translation(this._sprite.position).getData() ));
        this._sprite.draw();
        requestAnimationFrame( this.loop.bind(this) ) 
    }






    private loadShaders () : void
    {
        let vertexShaderSource : string = 
        `
        attribute vec3 aVertexPosition;
        uniform mat4 uMVMatrix;
        uniform mat4 uModel;
        void main()
        {
            gl_Position = uMVMatrix * uModel * vec4(aVertexPosition, 1.0);
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
