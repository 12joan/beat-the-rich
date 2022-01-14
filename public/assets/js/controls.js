import GameComponent from './gameComponent.js'
import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import { PointerLockControls } from '../../vendor/js/three.js/examples/jsm/controls/PointerLockControls.js'
import InputManager from './inputManager.js'

/* Controls the movement of the player and the camera controls. The player is
 * accelerated and decelerated to provide a smooth experience of moving.
 *
 * PointerLockControls from Three.js are used to rotate the camera. The
 * position of the camera relative to the player is also updated in
 * PlayerCharacter.
 */

const ACCELERATION = 40
const DECCELERATION_COEFFICIENT = 10
const MAX_SPEED = 6

class Controls extends GameComponent {
  tags = ['Controls']

  velocity = new THREE.Vector3()
  cycleViewButtonWasDown = false

  start() {
    this.controls = new PointerLockControls(this.camera, document.body)
    this.scene.add(this.objectRequiresCleanup(this.controls.getObject()))
  }

  reset() {
    this.velocity.set(0, 0, 0)
  }

  update(deltaTime) {
    // Get input direction
    const inputHeading = new THREE.Vector3()

    if (InputManager.getKey('w'))
      inputHeading.z -= 1

    if (InputManager.getKey('s'))
      inputHeading.z += 1

    if (InputManager.getKey('a'))
      inputHeading.x -= 1

    if (InputManager.getKey('d'))
      inputHeading.x += 1

    const acceleration = new THREE.Vector3()

    // Accelerate according to input
    acceleration.add(inputHeading.clone().normalize().multiplyScalar(ACCELERATION))

    // If there is no input, deccelerate
    if (inputHeading.lengthSq() === 0)
      acceleration.sub(this.velocity.clone().multiplyScalar(DECCELERATION_COEFFICIENT))

    this.velocity.add(acceleration.clone().multiplyScalar(deltaTime))
    this.velocity.clampLength(0, MAX_SPEED)

    const movement = this.velocity.clone().multiplyScalar(deltaTime)
    const speed = movement.length()

    // Rotate movement vector relative to camera
    movement.applyMatrix4(new THREE.Matrix4().extractRotation(this.camera.matrix))
    movement.y = 0
    movement.setLength(speed)

    this.find('PlayerCharacter')?.position?.add(movement)

    // Cycle camera view
    const cycleViewButtonIsDown = InputManager.getKey('c')

    if (cycleViewButtonIsDown && !this.cycleViewButtonWasDown) {
      this.find('PlayerCharacter')?.cycleCameraView?.()
    }

    this.cycleViewButtonWasDown = cycleViewButtonIsDown
  }

  lock() {
    this.controls.lock()
  }

  unlock() {
    this.controls.unlock()
  }

  get isLocked() {
    return this.controls.isLocked
  }
}

export default Controls
