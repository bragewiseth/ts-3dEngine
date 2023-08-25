import { gl } from './GL';
export class Shader
{
    private _name : string;
    private _program : WebGLProgram;
    private _attributes : Map<string, number> = new Map<string, number>(); 
    private _uniforms : Map<string, WebGLUniformLocation> = new Map<string, WebGLUniformLocation>();




    public constructor ( name : string, vertexSource : string, fragmentSource : string )
    {
        this._name = name;
        let vertexShader : WebGLShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
        let fragmentShader : WebGLShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER); 
        this.createProgram(vertexShader, fragmentShader);
        this.detectAttributes();
        this.detectUniforms();
        console.log('Shader constructed')
    }




    public get name() : string { return this._name; }




    public use() : void
    {
        gl.useProgram(this._program);
    }





    public getAttributeLocation(name:string) : number
    {
        if ( this._attributes.has(name) ) { return this._attributes.get(name) as number; }
        else { throw new Error('Attribute ' + name + ' not found in shader ' + this._name); }
    }



   public getUniformLocation(name:string) : number
    {
        if ( this._uniforms.has(name) ) { return this._uniforms.get(name) as number; }
        else { throw new Error('Uniform ' + name + ' not found in shader ' + this._name); }
    }




    private loadShader ( source : string, type : number ) : WebGLShader 
    {
        let shader : WebGLShader = gl.createShader(type) as WebGLShader;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) )
        {
            const errorLog = gl.getShaderInfoLog(shader);
            console.error("An error occurred compiling the shaders:", errorLog);
            console.error("Shader source:", source); // Add this line to log the shader 
            throw new Error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        }
        return shader;
    }




    private createProgram ( vertexShader : WebGLShader, fragmentShader : WebGLShader ) : void
    {
        this._program = gl.createProgram() as WebGLProgram;
        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);
        gl.linkProgram(this._program);
        let error = gl.getProgramInfoLog(this._program);
        if ( error !== '' )
        {
            throw new Error('Unable to initialize the shader program: ' + error);
        }
    }




    private detectAttributes() : void
    {
        let attributeCounter = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
        for ( let i = 0; i < attributeCounter; i++ )
        {
            let attribute = gl.getActiveAttrib(this._program, i);
            if ( !attribute ) { break; }
            this._attributes.set(attribute.name, gl.getAttribLocation(this._program, attribute.name));
        }
    }



    private detectUniforms() : void
    {
        let uniformCounter = gl.getProgramParameter( this._program, gl.ACTIVE_UNIFORMS );
        for ( let i = 0; i < uniformCounter; i++ )
        {
            let info : WebGLActiveInfo = gl.getActiveUniform(this._program, i) as WebGLActiveInfo;
            if ( !info ) { break; }
            this._uniforms.set(info.name, gl.getUniformLocation(this._program, info.name) as WebGLUniformLocation);
        }
    } 
}