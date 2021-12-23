uniform float time;
uniform float maxAltitude;
uniform float minAltitude;
uniform float size;
uniform float speed;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Stars move downwards over time
  mvPosition.y -= speed * time;

  // Wrap stars around when they exceed the minimum altitude
  while (mvPosition.y < minAltitude)
    mvPosition.y += maxAltitude - minAltitude;

  // Scale stars with distance
  gl_PointSize = size / -mvPosition.z;

  gl_Position = projectionMatrix * mvPosition;
}
