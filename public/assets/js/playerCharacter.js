import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import { getResource } from './loadedResources.js'
import Shovel from './shovel.js'

/* The player character acts as the single source of truth for where the player
 * is, and also keeps the camera within the constraints of the camera view and
 * pointed towards the player.
 *
 * The shovel is a child of this component.
 */

class PlayerCharacter extends GameComponent {
  tags = ['PlayerCharacter']

  cameraViews = [
    { name: 'First-person', cameraAltitude: 0, cameraDistance: 0, modelVisible: false },
    { name: 'Third-person', cameraAltitude: 0.5, cameraDistance: 4.5, modelVisible: true },
  ]

  constructor({ position, ...otherOptions }) {
    super(otherOptions)
    this.initialPosition = position
  }

  start() {
    // Object representing the position of the player
    this.object = this.objectRequiresCleanup(new THREE.Object3D())
    this.object.position.copy(this.initialPosition)
    this.scene.add(this.object)

    this.initializeChild(Shovel)

    // Add player model
    const { scene: playerObject, animations: playerAnimations } = getResource('player.glb')

    this.playerObject = playerObject
    this.playerObject.scale.set(0.5, 0.5, 0.5)

    this.playerObject.traverse(node => {
      if (node instanceof THREE.Mesh) {
        node.frustumCulled = false
      }
    })

    this.scene.add(this.playerObject)

    // Player model animation
    this.animationMixer = new THREE.AnimationMixer(this.playerObject)

    const clip = playerAnimations[0]
    this.animationMixer.clipAction(clip).play()
  }

  update(deltaTime) {
    // Set model visability
    this.playerObject.visible = this.cameraView.modelVisible

    // Update animation
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

    cameraToPlayer.multiplyScalar(this.cameraView.cameraDistance)

    const cameraPosition = this.position.clone()
    cameraPosition.sub(cameraToPlayer)
    cameraPosition.y += this.cameraView.cameraAltitude

    this.camera.position.copy(cameraPosition)
  }

  cycleCameraView() {
    const [x, ...xs] = this.cameraViews
    this.cameraViews = [...xs, x]
  }

  get cameraView() {
    return this.cameraViews[0]
  }

  get position() {
    return this.object.position
  }

  get quaternion() {
    return this.camera.quaternion
  }
}

export default PlayerCharacter
