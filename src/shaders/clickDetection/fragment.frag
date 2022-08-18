#version 300 es
precision mediump float;

    // Color that is the result of this shader
uniform vec3 uIdColor;
out vec4 fragColor;

void main(void) {
      // Set the result as red
    fragColor = vec4(uIdColor / 255.0, 1.0);
}