import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import Controls from './controls.js'
import Shovel from './shovel.js'

class LevelEssentials extends GameComponent {
  start() {
    this.initializeChild(Controls)
    this.initializeChild(Shovel)
  }
}

export default LevelEssentials
