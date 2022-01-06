import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import { getResource } from './loadedResources.js'
import InputManager from './inputManager.js'
import Timer from './timer.js'

const SHOVEL_HEIGHT = 0.5
const SHOVEL_ANGLE_Y = THREE.MathUtils.degToRad(15)
const MIN_ATTACK_ANGLE = THREE.MathUtils.degToRad(10)
const MAX_ATTACK_ANGLE = THREE.MathUtils.degToRad(120)
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
  shovelAngle = MIN_ATTACK_ANGLE

  start() {
    this.cameraPivot = this.objectRequiresCleanup(new THREE.Object3D())
    this.scene.add(this.cameraPivot)

    this.shovel = this.objectRequiresCleanup(this.resetObject(getResource('shovel.obj')))

    this.shovel.position.set(0.2, -0.5 * SHOVEL_HEIGHT, -0.75)
    this.cameraPivot.add(this.shovel)

    this.followCamera()
    this.updateShovelAngle()
  }

  update(deltaTime) {
    this.followCamera()

    const buttonState = InputManager.getMouseButton(InputManager.MOUSE_BUTTONS.LEFT)

    if (buttonState && !this.lastButtonState && this.animationState === ANIMATION_STATES.RESTING) {
      this.animationState = ANIMATION_STATES.DESCENDING
      this.find('GameLogic').handleAttack()
    }

    this.lastButtonState = buttonState

    switch (this.animationState) {
      case ANIMATION_STATES.DESCENDING:
        this.shovelAngle += deltaTime * (MAX_ATTACK_ANGLE - MIN_ATTACK_ANGLE) / DESCENT_DURATION

        if (this.shovelAngle >= MAX_ATTACK_ANGLE) {
          this.animationState = ANIMATION_STATES.ASCENDING
        }

        break

      case ANIMATION_STATES.ASCENDING:
        this.shovelAngle -= deltaTime * (MAX_ATTACK_ANGLE - MIN_ATTACK_ANGLE) / ASCENT_DURATION

        if (this.shovelAngle <= MIN_ATTACK_ANGLE) {
          this.animationState = ANIMATION_STATES.RESTING
          this.shovelAngle = MIN_ATTACK_ANGLE
        }

        break
    }

    this.updateShovelAngle()
  }

  followCamera() {
    const playerCharacter = this.find('PlayerCharacter')

    if (playerCharacter !== null) {
      this.cameraPivot.position.copy(playerCharacter.position)
      this.cameraPivot.quaternion.copy(playerCharacter.quaternion)
    }
  }

  updateShovelAngle() {
    this.shovel.rotation.set(-this.shovelAngle, SHOVEL_ANGLE_Y, 0, 'YXZ')
  }
}

export default Shovel
