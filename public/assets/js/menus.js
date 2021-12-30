import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'

class Menus extends GameComponent {
  tags = ['Menus']

  menuEl = document.querySelector('#game-overlay-menu')

  onButton = undefined

  start() {
    Array.from(this.menuEl.querySelectorAll('button')).forEach(button => button.addEventListener('click', () => {
      this.onButton?.()
      /*this.menuEl.dataset.currentMenu = 'none'

      this.canvas.classList.remove('blur')
      document.querySelector('#game-overlay-hud').classList.remove('blur')

      document.querySelector('#game-overlay').classList.add('no-pointer-events')

      this.find('Controls').controls.lock()*/
    }))
  }

  setMenu(menuName, onButton = undefined) {
    this.menuEl.dataset.currentMenu = menuName
    this.onButton = onButton
  }
}

export default Menus
