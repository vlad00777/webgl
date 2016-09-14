var VSHADER_SOURCE = null;
var FSHADER_SOURCE = null;

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    readShaderFile(gl, 'vShader.glsl', 'v');
    readShaderFile(gl, 'fShader.glsl', 'f');

    function readShaderFile(gl, fileName, shader) {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status !== 404) {
                onReadShader(gl, request.responseText, shader);
            }
        }
        request.open('GET', fileName, true);
        request.send();
    }
    function onReadShader(gl, fileString, shader) {
        if (shader == 'v') {
            VSHADER_SOURCE = fileString;
        }
        else if (shader == 'f') {
            FSHADER_SOURCE = fileString;
        }

        if (VSHADER_SOURCE != null && FSHADER_SOURCE != null) {
            start(gl);
        }
    }
}

function rotateMat(gl){
    var angle = 25;
    var MatrixRotate = new Matrix4();
    MatrixRotate.setRotate(angle,0,0,1); //gl_Rotate in OpenGL
    var u_MatrixRotate = gl.getUniformLocation(gl.program,'u_MatrixRotate');
    gl.uniformMatrix4fv(u_MatrixRotate,false,MatrixRotate.elements);
}

function loadTexture(gl,n,texture,u_Sample,image){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE0,texture);

    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
    gl.uniform1i(u_Sample,0);
}

function initTextures(gl,n){
    var image = new Image();
    var texture = gl.createTexture();

    var u_Sample = gl.getUniformLocation(gl.program,'u_Sample');
    image.src = 'wall.jpg';

    image.onload = function(){
        loadTexture(gl,n,texture,u_Sample,image);
    }
    return true;
}

function start(gl){
    // Initialize the shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {
        return;
    }


    if (!initTextures(gl,n)) { return; }

    var verticies = new Float32Array([
        0.0,0.5,
        -0.5,-0.5,
        0.5,-0.5
    ]);

    var colors = new Float32Array([
        1.0,0.0,0.0,
        0.0,1.0,0.0,
        0.0,0.0,1.0
    ]);

    var texCords = new Float32Array([
        0.0,1.0,
        0.0,0.0,
        1.0,1.0,
        1.0,0.0
    ]);

    var n = 3;

    rotateMat(gl);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //----------------------------------------------

    var VertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,verticies,gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_Position);

    //--------------------------------------------

    var ColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,colors,gl.STATIC_DRAW);

    var a_Color = gl.getAttribLocation(gl.program,'a_Color');
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_Color);

    //------------------------------------------------

    var TextureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,TextureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,texCords,gl.STATIC_DRAW);

    var a_TexCords = gl.getAttribLocation(gl.program,'a_TexCords');
    gl.vertexAttribPointer(a_TexCords,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_TexCords);

    //------------------------------------------------

    gl.drawArrays(gl.TRIANGLES,0,n);

    gl.disableVertexAttribArray(a_Position);
    gl.disableVertexAttribArray(a_Color);
}

