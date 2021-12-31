import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import Shovel from './shovel.js'
import SpaceBackground from './spaceBackground.js'
import ElonMusk from './elonMusk.js'

class Level2 extends GameComponent {
  start() {
    this.camera.position.set(0, 0, 0)
    this.camera.rotation.set(0, 0, 0, 'YXZ')

    this.scene.background = new THREE.Color(0x000000)

    this.scene.add(this.objectRequiresCleanup(
      new THREE.AmbientLight(0x202020)
    ))

    this.initializeChild(Shovel)
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
