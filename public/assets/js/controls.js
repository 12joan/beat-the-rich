import GameComponent from './gameComponent.js'
import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import { PointerLockControls } from '../../vendor/js/three.js/examples/jsm/controls/PointerLockControls.js'
import InputManager from './inputManager.js'

const ACCELERATION = 40
const DECCELERATION_COEFFICIENT = 10
const MAX_SPEED = 8

class Controls extends GameComponent {
  velocity = new THREE.Vector2()

  start() {
    this.controls = new PointerLockControls(this.camera, document.body)
    this.scene.add(this.controls.getObject())
    this.canvas.addEventListener('click', () => this.controls.lock())
  }

  update(deltaTime) {
    const inputHeading = new THREE.Vector2()

    if (InputManager.getKey('w'))
      inputHeading.y += 1

    if (InputManager.getKey('s'))
      inputHeading.y -= 1

    if (InputManager.getKey('a'))
      inputHeading.x -= 1

    if (InputManager.getKey('d'))
      inputHeading.x += 1

    const acceleration = new THREE.Vector2()

    // Accelerate according to input
    acceleration.add(inputHeading.clone().normalize().multiplyScalar(ACCELERATION))

    // If there is no input, deccelerate
    if (inputHeading.lengthSq() === 0)
      acceleration.sub(this.velocity.clone().multiplyScalar(DECCELERATION_COEFFICIENT))

    this.velocity.add(acceleration.clone().multiplyScalar(deltaTime))
    this.velocity.clampLength(0, MAX_SPEED)

    const movement = this.velocity.clone().multiplyScalar(deltaTime)

    this.controls.moveForward(movement.y)
    this.controls.moveRight(movement.x)
  }

  get isLocked() {
    return this.controls.isLocked
  }
}

export default Controls
