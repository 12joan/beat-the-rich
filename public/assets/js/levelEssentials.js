import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import Shovel from './shovel.js'

class LevelEssentials extends GameComponent {
  start() {
    this.initializeChild(Shovel)

    this.scene.add(this.objectRequiresCleanup(
      new THREE.AmbientLight(0x404040)
    ))
  }
}

export default LevelEssentials
