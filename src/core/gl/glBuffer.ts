import { gl } from "./GL";


export class AttributeInfo
{
    public location : number;
    public size : number;
    public offset : number;
}


export class GLBuffer
{
    private _hasAttributeLocation : boolean = false;
    private _elementSize : number;
    private _stride : number;
    private _buffer : WebGLBuffer;
    private _targetBufferType : number;
    private _dataType : number;
    private _mode : number;
    private _typeSize : number;
    private _data : number[] = [];
    private _attributes : AttributeInfo[] = [];

    /**
     * Creates a new buffer
     * @param elementSize The size of each element in the buffer.
     * @param targetBufferType The target buffer type. Default is gl.ARRAY_BUFFER.
     * @param dataType The data type. Default is gl.FLOAT.
     * @param mode The mode. Default is gl.TRIANGLES.
     * @throws Error if the data type is invalid.
    */
    public constructor ( elementSize : number, targetBufferType : number = gl.ARRAY_BUFFER, dataType : number = gl.FLOAT, mode : number = gl.TRIANGLES )
    {
        this._elementSize = elementSize;
        this._targetBufferType = targetBufferType;
        this._dataType = dataType;
        this._mode = mode;

        switch ( this._dataType )
        {
            case gl.FLOAT: this._typeSize = 4; break;
            case gl.INT: this._typeSize = 4; break;
            case gl.UNSIGNED_INT: this._typeSize = 4; break;
            case gl.SHORT: this._typeSize = 2; break;
            case gl.UNSIGNED_SHORT: this._typeSize = 2; break;
            case gl.BYTE: this._typeSize = 1; break;
            case gl.UNSIGNED_BYTE: this._typeSize = 1; break;
            default: throw new Error('Invalid data type: ' + this._dataType);
        }

        this._stride = this._elementSize * this._typeSize;
        this._buffer = gl.createBuffer() as WebGLBuffer;
    }


    public destroy() : void
    {
        gl.deleteBuffer(this._buffer);
    }


    public bind( normalized : boolean = false ) : void
    {
        gl.bindBuffer(this._targetBufferType, this._buffer);
        if ( this._hasAttributeLocation )
        {
            for ( let it of this._attributes ) 
            {
                gl.vertexAttribPointer( it.location, it.size, this._dataType, normalized, this._stride, it.offset * this._typeSize );
                gl.enableVertexAttribArray( it.location );
            }
        }
    }


    public unbind() : void
    {
        for ( let it of this._attributes ) 
        {
            gl.disableVertexAttribArray( it.location );
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer );
    }



    public addAttributeLocation( info : AttributeInfo ) : void
    {
        this._hasAttributeLocation = true;
        this._attributes.push( info );
    }





    public pushBackData( data : number[] ) : void
    {
        for ( let d of data ) { this._data.push(d); }
    }





    /**
    * Uploads this buffers data to the GPU 
    */
    public upload() : void
    {
        gl.bindBuffer(this._targetBufferType, this._buffer);
        let bufferData : ArrayBuffer;
        switch ( this._dataType )
        {
            case gl.FLOAT: bufferData = new Float32Array(this._data); break;
            case gl.INT: bufferData = new Int32Array(this._data); break;
            case gl.UNSIGNED_INT: bufferData = new Uint32Array(this._data); break; 
            case gl.SHORT: bufferData = new Int16Array(this._data); break; 
            case gl.UNSIGNED_SHORT:  bufferData = new Uint16Array(this._data); break;  
            case gl.BYTE: bufferData = new Int8Array(this._data); break;
            case gl.UNSIGNED_BYTE: bufferData = new Uint8Array(this._data); break;
            default: throw new Error('Invalid data type: ' + this._dataType);
        }

        gl.bufferData( this._targetBufferType, bufferData, gl.STATIC_DRAW );
    }



    public draw() : void
    {
        if ( this._targetBufferType == gl.ARRAY_BUFFER )
        {
            gl.drawArrays( this._mode, 0, this._data.length / this._elementSize );
        }
        else if ( this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER )
        {
            gl.drawElements( this._mode, this._data.length, this._dataType, 0 );
        }
    }



}
