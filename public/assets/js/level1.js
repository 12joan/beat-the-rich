import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import PlayerCharacter from './playerCharacter.js'
import Sky from './sky.js'
import Floor from './floor.js'
import JeffBezos from './jeffBezos.js'

/* Initialise all child components required for Level 1 and configure the
 * ambient light and camera.
 */

class Level1 extends GameComponent {
  start() {
    this.camera.position.set(0, 1, 15)
    this.camera.rotation.set(0, 0, 0)

    this.scene.add(this.objectRequiresCleanup(
      new THREE.AmbientLight(0x404040)
    ))

    this.initializeChild(PlayerCharacter, {
      position: new THREE.Vector3(0, 1, 15),
    })

    this.initializeChild(Sky)
    this.initializeChild(Floor)
    this.initializeChild(JeffBezos)
  }
}

export default Level1
