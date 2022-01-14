import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import HUD from './hud.js'
import Menus from './menus.js'

// The overlay, consisting of the HUD and menus

class Overlay extends GameComponent {
  tags = ['Overlay']

  start() {
    this.initializeChild(HUD)
    this.initializeChild(Menus)
  }
}

export default Overlay
