attribute vec4 a_Position;
uniform mat4 u_MatrixRotate;
attribute vec4 a_Color;
varying vec4 v_Color;
attribute vec2 a_TexCords;
varying vec2 v_TexCords;
void main(){
    gl_Position = a_Position * u_MatrixRotate;
    v_Color = a_Color;
    v_TexCords = a_TexCords;
}