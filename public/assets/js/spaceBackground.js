import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import { getResource } from './loadedResources.js'

const STAR_COUNT = 7500
const RADIUS = 1000
const RADIUS_VARIATION = 750
const MAX_ALTITUDE = 300
const MIN_ALTITUDE = -300
const STAR_SIZE = 1000
const STAR_SPEED = 40
const SUN_SPEED = 5

class SpaceBackground extends GameComponent {
  start() {
    const starPositions = []

    for (let i = 0; i < STAR_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = RADIUS + RADIUS_VARIATION * (Math.random() - 0.5)
      const altitude = MIN_ALTITUDE + (Math.random() * (MAX_ALTITUDE - MIN_ALTITUDE))

      starPositions.push([
        radius * Math.cos(angle),
        altitude,
        radius * Math.sin(angle),
      ])
    }

    const starsGeometry = this.requiresCleanup(new THREE.BufferGeometry(), 'dispose')
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starPositions.flat()), 3))

    this.starsMaterial = this.requiresCleanup(new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        maxAltitude: { value: MAX_ALTITUDE },
        minAltitude: { value: MIN_ALTITUDE },
        size: { value: STAR_SIZE },
        speed: { value: STAR_SPEED },
        starTexture: { value: getResource('star.png') },
      },
      vertexShader: getResource('space_background.vert'),
      fragmentShader: getResource('space_background.frag'),
      transparent: true,
    }), 'dispose')

    const stars = this.objectRequiresCleanup(new THREE.Points(starsGeometry, this.starsMaterial))
    this.scene.add(stars)

    const sunMaterial = this.requiresCleanup(new THREE.SpriteMaterial({
      map: getResource('sun.png'),
      color: 0xffffff,
      sizeAttenuation: false,
      transparent: true,
      depthWrite: false,
    }), 'dispose')

    const sunPosition = new THREE.Vector3()
    sunPosition.setFromSphericalCoords(
      RADIUS - (RADIUS_VARIATION / 2),
      THREE.MathUtils.degToRad(80),
      THREE.MathUtils.degToRad(40),
    )

    this.sunSprite = this.objectRequiresCleanup(new THREE.Sprite(sunMaterial))
    this.sunSprite.position.copy(sunPosition)
    this.sunSprite.scale.set(1, 1, 1)
    this.sunSprite.frustumCulled = false
    this.scene.add(this.sunSprite)

    this.sunLight = this.objectRequiresCleanup(new THREE.DirectionalLight(0xffffff, 1))
    this.sunLight.position.copy(sunPosition)

    this.sunLight.castShadow = true
    this.sunLight.shadow.mapSize.width = 4096
    this.sunLight.shadow.mapSize.height = 4096

    this.scene.add(this.sunLight)
  }

  update(deltaTime) {
    this.starsMaterial.uniforms.time.value += deltaTime
    this.sunSprite.position.y -= SUN_SPEED * deltaTime
    this.sunLight.position.y -= SUN_SPEED * deltaTime
  }
}

export default SpaceBackground
