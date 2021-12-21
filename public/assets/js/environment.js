import GameComponent from './gameComponent.js'
import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import Sky from './sky.js'
import Floor from './floor.js'

class Environment extends GameComponent {
  start() {
    // White background color
    this.scene.background = new THREE.Color(0xffffff)

    // Ambient light
    this.scene.add(
      this.objectRequiresCleanup(new THREE.AmbientLight(0x404040))
    )

    this.initializeChild(Sky)
    this.initializeChild(Floor)
  }
}

export default Environment
