// todo move from ui??

export const compileShader = (
  gl: WebGLRenderingContext,
  shaderString: string,
  type: "vertex" | "fragment"
) => {
  let shader;
  if (type === "vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else if (type === "fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else {
    return null;
  }
  if (!shader) {
    return null;
  }

  // Compile the shader using the supplied shader code
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  // Ensure the shader is valid
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
};

export type Program<A extends {}, U extends {}> = {
  program: WebGLProgram;
  attribLocations: { [K in keyof A]: number };
  uniformLocations: { [K in keyof U]: WebGLUniformLocation | null };
};

export const makeProgram = ({
  gl,
  vertexShader,
  fragmentShader,
}: {
  gl: WebGLRenderingContext;
  vertexShader: string;
  fragmentShader: string;
}): WebGLProgram | null => {
  // Create a program
  const program = gl.createProgram();
  if (!program) {
    return null;
  }

  const compiledVertShader = compileShader(gl, vertexShader, "vertex");
  if (!compiledVertShader) {
    return null;
  }

  const compiledFragShader = compileShader(gl, fragmentShader, "fragment");
  if (!compiledFragShader) {
    return null;
  }

  // Attach the shaders to this program
  gl.attachShader(program, compiledVertShader);
  gl.attachShader(program, compiledFragShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Could not initialize shaders");
  }

  return program;
};
