export var gl : WebGLRenderingContext;
/** 
 * This class is a utility class for WebGL.
*/
export class GLUtils
{
    /**
     * Initializes WebGL and returns the canvas element.
     * @param elementId The id of the canvas element to use. If not provided, a new canvas element will be created.
     * @returns The canvas element.
     * @throws Error if WebGL is not supported.
     * @throws Error if the canvas element cannot be found.
    */
    public static init( elementId? : string ) : HTMLCanvasElement
    {
        let canvas : HTMLCanvasElement; 

        if ( elementId != undefined ) 
        {
            canvas = document.getElementById(elementId) as HTMLCanvasElement;
            if ( canvas === undefined ) 
            {
                throw new Error('Cannot find canvas element with id: ' + elementId);
            }
        }
        else 
        {
            canvas = document.createElement('canvas') as HTMLCanvasElement;
            document.body.appendChild(canvas);
        }

        gl = canvas.getContext('webgl') as WebGLRenderingContext;
        if ( gl === undefined )
        {
            throw new Error('Unable to initialize WebGL. Your browser or machine may not support it.');
        }
        return canvas;
    }
}