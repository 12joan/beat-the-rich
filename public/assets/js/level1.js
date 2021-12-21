import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import Controls from './controls.js'
import Shovel from './shovel.js'
import Environment from './environment.js'
import JeffBezos from './jeffBezos.js'

class Level1 extends GameComponent {
  tags = ['Level']

  start() {
    this.initializeChild(Controls)
    this.initializeChild(Shovel)
    this.initializeChild(Environment)
    this.initializeChild(JeffBezos)
  }
}

export default Level1
