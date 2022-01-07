import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import { getResource } from './loadedResources.js'
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

    const { scene: playerObject, animations: playerAnimations } = getResource('player.glb')

    this.playerObject = playerObject
    this.playerObject.scale.set(0.5, 0.5, 0.5)

    this.playerObject.traverse(node => {
      if (node instanceof THREE.Mesh) {
        node.frustumCulled = false
      }
    })

    this.scene.add(this.playerObject)

    this.animationMixer = new THREE.AnimationMixer(this.playerObject)

    const clip = playerAnimations[0]
    this.animationMixer.clipAction(clip).play()
  }

  update(deltaTime) {
    this.animationMixer.update(deltaTime)

    const lookDirection = new THREE.Vector3()
    this.camera.getWorldDirection(lookDirection)

    // Update player object position
    this.playerObject.position.copy(this.position)
    this.playerObject.position.y -= 1

    // Face player object away from camera
    const facingDirection = lookDirection.clone()
    facingDirection.y = 0
    this.playerObject.lookAt(this.playerObject.position.clone().add(facingDirection))

    // Point camera at player without changing its rotation
    const cameraToPlayer = lookDirection.clone()

    if (cameraToPlayer.y > 0)
      cameraToPlayer.y = 0

    cameraToPlayer.multiplyScalar(4.5)

    const cameraPosition = this.position.clone()
    cameraPosition.sub(cameraToPlayer)
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
