import { Vector3 } from "./vector3";


export class Matrix4x4
{
    private _data : number[] = [];

    private constructor( data : number[] = [] )
    {
        if ( data.length == 0 )
        {
            this.setIdentity();
        }
        else
        {
            this._data = data;
        }
    }




    private setIdentity() : void
    {
        this._data = 
        [
            1, 0, 0, 0, 
            0, 1, 0, 0, 
            0, 0 ,1, 0, 
            0, 0, 0, 1
        ];
    }


    public getData() : number[] { return this._data; }


    public static createIdentity() : Matrix4x4 { return new Matrix4x4(); }


    public static orthographic( left : number, right : number, bottom : number, top : number, near : number, far : number ) : Matrix4x4
    {
        let matrix : Matrix4x4 = new Matrix4x4();
        matrix._data = 
        [
            2 / ( right - left ), 0, 0, 0,
            0, 2 / ( top - bottom ), 0, 0,
            0, 0, 2 / ( near - far ), 0,
            ( left + right ) / ( left - right ), ( bottom + top ) / ( bottom - top ), ( near + far ) / ( near - far ), 1
        ];
        return matrix;
    }

    public static translation(position : Vector3) : Matrix4x4
    {
        let matrix : Matrix4x4 = new Matrix4x4();
        matrix._data[12] = position.getX();
        matrix._data[13] = position.getY();
        matrix._data[14] = position.getZ();
        return matrix;
    }

}
