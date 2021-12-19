import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import InputManager from './inputManager.js'
import Timer from './timer.js'

const SHOVEL_HEIGHT = 0.5
const MIN_SHOVEL_ANGLE = THREE.MathUtils.degToRad(10)
const MAX_SHOVEL_ANGLE = THREE.MathUtils.degToRad(120)
const DESCENT_DURATION = 0.1
const ASCENT_DURATION = 0.2

const ANIMATION_STATES = {
  RESTING: 0,
  DESCENDING: 1,
  ASCENDING: 2,
}

class Shovel extends GameComponent {
  lastButtonState = false
  animationState = ANIMATION_STATES.RESTING
  shovelAngle = MIN_SHOVEL_ANGLE

  constructor({ onAttack, ...otherArgs }) {
    super(otherArgs)
    this.onAttack = onAttack
  }

  start() {
    this.cameraPivot = new THREE.Object3D()
    this.scene.add(this.cameraPivot)

    this.rotationPivot = new THREE.Object3D()
    this.rotationPivot.position.set(0.2, -0.5 * SHOVEL_HEIGHT, -0.75)
    this.cameraPivot.add(this.rotationPivot)

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xddaa88,
      metalness: 0,
      roughness: 0.5,
      clearcoat: 0.75,
    })

    const shovelGeometry = new THREE.BoxGeometry(0.1, SHOVEL_HEIGHT, 0.01)

    this.shovel = new THREE.Mesh(shovelGeometry, material)
    this.shovel.position.set(0, SHOVEL_HEIGHT / 2, 0)
    this.shovel.rotation.set(0, THREE.MathUtils.degToRad(10), 0)
    this.shovel.castShadow = true
    this.rotationPivot.add(this.shovel)

    this.followCamera()
    this.updateShovelAngle()
  }

  update(deltaTime) {
    this.followCamera()

    const buttonState = InputManager.getMouseButton(InputManager.MOUSE_BUTTONS.LEFT)

    if (buttonState && !this.lastButtonState && this.animationState === ANIMATION_STATES.RESTING) {
      this.animationState = ANIMATION_STATES.DESCENDING
      this.onAttack()
    }

    this.lastButtonState = buttonState

    switch (this.animationState) {
      case ANIMATION_STATES.DESCENDING:
        this.shovelAngle += deltaTime * (MAX_SHOVEL_ANGLE - MIN_SHOVEL_ANGLE) / DESCENT_DURATION

        if (this.shovelAngle >= MAX_SHOVEL_ANGLE) {
          this.animationState = ANIMATION_STATES.ASCENDING
        }

        break

      case ANIMATION_STATES.ASCENDING:
        this.shovelAngle -= deltaTime * (MAX_SHOVEL_ANGLE - MIN_SHOVEL_ANGLE) / ASCENT_DURATION

        if (this.shovelAngle <= MIN_SHOVEL_ANGLE) {
          this.animationState = ANIMATION_STATES.RESTING
          this.shovelAngle = MIN_SHOVEL_ANGLE
        }

        break
    }

    this.updateShovelAngle()
  }

  followCamera() {
    this.cameraPivot.position.copy(this.camera.position)
    this.cameraPivot.quaternion.copy(this.camera.quaternion)
  }

  updateShovelAngle() {
    this.rotationPivot.rotation.x = -this.shovelAngle
  }
}

export default Shovel
