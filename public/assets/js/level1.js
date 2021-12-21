import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import LevelEssentials from './levelEssentials.js'
import Sky from './sky.js'
import Floor from './floor.js'
import JeffBezos from './jeffBezos.js'

class Level1 extends GameComponent {
  start() {
    this.initializeChild(LevelEssentials)

    // White background color
    this.scene.background = new THREE.Color(0xffffff)

    // Ambient light
    this.scene.add(
      this.objectRequiresCleanup(new THREE.AmbientLight(0x404040))
    )

    this.initializeChild(Sky)
    this.initializeChild(Floor)

    // Enemy
    this.initializeChild(JeffBezos)
  }
}

export default Level1
