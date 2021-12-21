import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import LevelEssentials from './levelEssentials.js'
import Sky from './sky.js'
import Floor from './floor.js'
import JeffBezos from './jeffBezos.js'

class Level1 extends GameComponent {
  start() {
    this.camera.position.set(0, 1, 15)
    this.camera.rotation.set(0, 0, 0)

    this.initializeChild(LevelEssentials)

    this.initializeChild(Sky)
    this.initializeChild(Floor)

    // Enemy
    this.initializeChild(JeffBezos)
  }
}

export default Level1
