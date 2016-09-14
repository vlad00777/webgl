precision mediump float;
varying vec4 v_Color;
varying vec2 v_TexCords;
uniform sampler2D u_Sample;
void main(){
    //gl_FragColor = v_Color;
    gl_FragColor = texture2D(u_Sample,v_TexCords);
}