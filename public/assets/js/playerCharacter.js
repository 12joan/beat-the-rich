import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import Shovel from './shovel.js'

class PlayerCharacter extends GameComponent {
  tags = ['PlayerCharacter']

  constructor({ position, ...otherOptions }) {
    super(otherOptions)
    this.initialPosition = position
  }

  start() {
    this.object = this.objectRequiresCleanup(new THREE.Object3D())
    this.object.position.copy(this.initialPosition)
    this.scene.add(this.object)

    this.initializeChild(Shovel)
  }

  update() {
    const lookDirection = new THREE.Vector3()
    this.camera.getWorldDirection(lookDirection)

    if (lookDirection.y > 0)
      lookDirection.y = 0

    lookDirection.multiplyScalar(3)

    const cameraPosition = this.position.clone()
    cameraPosition.sub(lookDirection)
    cameraPosition.y += 0.5

    this.camera.position.copy(cameraPosition)
  }

  get position() {
    return this.object.position
  }

  get quaternion() {
    return this.camera.quaternion
  }
}

export default PlayerCharacter
