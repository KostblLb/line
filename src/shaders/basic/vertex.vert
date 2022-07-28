#version 300 es
precision mediump float;

uniform mat4 uModelView;
uniform mat4 uCameraView;
uniform mat4 uProjection;

    // Supplied vertex position attribute
in vec3 aVertexPosition;
out vec3 color;

void main(void) {
      // Set the position in clipspace coordinates
    gl_Position = uProjection * uCameraView * uModelView * vec4(aVertexPosition, 1.0);
    color = aVertexPosition;
}