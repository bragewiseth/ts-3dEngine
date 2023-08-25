

attribute vec3 aVertexPosition;
uniform mat4 uMVMatrix;
uniform mat4 uModel;
void main()
{
    gl_Position = uMVMatrix * uModel * vec4(aVertexPosition, 1.0);
}