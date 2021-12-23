uniform sampler2D starTexture;

void main() {
  gl_FragColor = texture2D(starTexture, gl_PointCoord);
}
