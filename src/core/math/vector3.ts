export class Vector3
{
    private _x : number;
    private _y : number;
    private _z : number;

    public constructor( x : number = 0, y : number = 0, z : number = 0 )
    {
        this._x = x;
        this._y = y;
        this._z = z;
    }


    public getX() : number { return this._x; }

    public getY() : number { return this._y; }

    public getZ() : number { return this._z; }

    public setX( x : number ) : void { this._x = x; }

    public setY( y : number ) : void { this._y = y; }

    public setZ( z : number ) : void { this._z = z; }

    public toArray() : number[] { return [ this._x, this._y, this._z ]; }

    public toFloat32Array() : Float32Array { return new Float32Array( this.toArray() ); }


}