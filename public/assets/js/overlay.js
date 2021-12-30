import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import HUD from './hud.js'
import Menus from './menus.js'

class Overlay extends GameComponent {
  tags = ['Overlay']

  overlayEl = document.querySelector('#game-overlay')

  start() {
    window.addEventListener('resize', this.updateOverlayPosition.bind(this))
    this.updateOverlayPosition()

    this.initializeChild(HUD)
    this.initializeChild(Menus)
  }

  teardown() {
    window.removeEventListener('resize', this.updateOverlayPosition.bind(this))
  }

  updateOverlayPosition() {
    this.overlayEl.style.top = (this.canvas.getBoundingClientRect().top + window.scrollY) + 'px'
    this.overlayEl.style.left = (this.canvas.getBoundingClientRect().left + window.scrollX) + 'px'
    this.overlayEl.style.width = this.canvas.getBoundingClientRect().width + 'px'
    this.overlayEl.style.height = this.canvas.getBoundingClientRect().height + 'px'
    this.overlayEl.classList.remove('d-none')
  }
}

export default Overlay
