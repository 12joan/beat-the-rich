import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import PlayerCharacter from './playerCharacter.js'
import SpaceBackground from './spaceBackground.js'
import ElonMusk from './elonMusk.js'

/* Initialise all child components required for Level 2 and configure the
 * background, ambient light and camera. For this level, it's important that
 * the player can only look left or right, not up or down, to avoid
 * disorientation.
 */

class Level2 extends GameComponent {
  start() {
    this.camera.position.set(0, 0, 0)
    this.camera.rotation.set(0, 0, 0, 'YXZ')

    this.scene.background = new THREE.Color(0x000000)

    this.scene.add(this.objectRequiresCleanup(
      new THREE.AmbientLight(0x202020)
    ))

    this.initializeChild(PlayerCharacter, {
      position: new THREE.Vector3(0, 0, 0),
    })

    this.initializeChild(SpaceBackground)
    this.initializeChild(ElonMusk)
  }

  update() {
    // Prevent looking up or down
    this.camera.rotation.x = 0
    this.camera.rotation.z = 0
  }
}

export default Level2
