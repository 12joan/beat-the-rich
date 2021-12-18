import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import Timer from './timer.js'

const DELAY_BETWEEN_LEAPS = 1
const LEAP_DURATION = 0.5
const LEAP_HEIGHT = 1.25
const LEAP_SPEED = 6

class JeffBezos extends GameComponent {
  leaping = false
  beforeLeapTimer = new Timer()
  leapTimer = new Timer()

  start() {
    const geometry = new THREE.BoxGeometry(0.75, 0.5, 0.55)

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xddaa88,
      metalness: 0,
      roughness: 0.5,
      clearcoat: 0.75,
    })

    this.basePositionY = geometry.parameters.height / 2

    this.cube = new THREE.Mesh(geometry, material)
    this.cube.castShadow = true
    this.cube.receiveShadow = true
    this.setAltitude(0)
    this.scene.add(this.cube)
  }

  update(deltaTime) {
    if (this.leaping) {
      this.leapTimer.advanceClock(deltaTime)

      // Leap in an upside down parabola or, to use the technical term, an umbrella.
      const progress = this.leapTimer.progressToTime(LEAP_DURATION)
      this.setAltitude(LEAP_HEIGHT * -4 * progress * (progress - 1))

      // Travel in a random direction
      this.cube.position.add(this.leapDirection.clone().multiplyScalar(LEAP_SPEED * deltaTime))

      // Rotate in the direction of travel
      this.cube.rotation.y = this.leapDirection.angleTo(new THREE.Vector3(0, 0, 1))

      this.leapTimer.afterTime(LEAP_DURATION, () => {
        this.leaping = false
        this.leapTimer.reset()
      })
    } else {
      this.beforeLeapTimer.advanceClock(deltaTime)
      this.setAltitude(0)

      this.beforeLeapTimer.afterTime(DELAY_BETWEEN_LEAPS, () => {
        this.randomiseLeapDirection()
        this.leaping = true
        this.beforeLeapTimer.reset()
      })
    }
  }

  setAltitude(altitude) {
    this.cube.position.y = this.basePositionY + altitude
  }

  randomiseLeapDirection() {
    this.leapDirection = new THREE.Vector3(
      Math.random() - 0.5,
      0,
      Math.random() - 0.5,
    ).normalize()
  }
}

export default JeffBezos
