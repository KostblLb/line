#version 300 es
precision mediump float;

    // Color that is the result of this shader
in vec3 color;
out vec4 fragColor;

void main(void) {
      // Set the result as red
    fragColor = vec4(color, 1.0);
}