import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'

// Show and hide menus and delegate menu button clicks

class Menus extends GameComponent {
  tags = ['Menus']

  menuEl = document.querySelector('#game-overlay-menu')

  onButton = undefined

  start() {
    Array.from(this.menuEl.querySelectorAll('button')).forEach(button => button.addEventListener('click', () => {
      this.onButton?.()
    }))
  }

  get currentMenu() {
    return this.menuEl.dataset.currentMenu
  }

  setMenu(menuName, onButton = undefined) {
    this.menuEl.dataset.currentMenu = menuName
    this.onButton = onButton
  }
}

export default Menus
