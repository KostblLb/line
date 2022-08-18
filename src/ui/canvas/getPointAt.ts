export const getPointAt = (
  x: number,
  y: number,
  gl: WebGLRenderingContext,
  draw: () => void
) => {
  const targetTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, targetTexture);

  {
    // define size and format of level 0
    const level = 0;
    const internalFormat = gl.RGBA;
    const border = 0;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    const data = null;
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      gl.canvas.width,
      gl.canvas.height,
      border,
      format,
      type,
      data
    );

    // set the filtering so we don't need mips
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  if (!gl.getParameter(gl.FRAMEBUFFER_BINDING)) {
    throw new Error("could not bind framebuffer");
  }

  const attachmentPoint = gl.COLOR_ATTACHMENT0;
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    attachmentPoint,
    gl.TEXTURE_2D,
    targetTexture,
    0
  );

  draw();

  const buffer = new Uint8Array(4);
  gl.readPixels(
    x,
    gl.canvas.height - y,
    1,
    1,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    buffer
  );

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return (buffer[0] << 0xff00) + (buffer[1] << 0xff) + buffer[2];
};
