import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'

class HUD extends GameComponent {
  tags = ['HUD']

  data = {}

  overlayEl = document.querySelector('#game-overlay')
  wealthFillEl = this.overlayEl.querySelector('#game-overlay-hud-wealth-bar-fill')

  start() {
    window.addEventListener('resize', () => this.updateOverlayPosition())
    this.updateOverlayPosition()
  }

  refresh() {
    this.wealthFillEl.setAttribute('data-text', this.formatWealth(this.data.currentWealth))
    this.wealthFillEl.style.width = this.data.currentWealth > 0
      ? (100 * this.data.currentWealth / this.data.startingWealth) + '%'
      : '0'
  }

  updateOverlayPosition() {
    this.overlayEl.style.display = 'initial'
    this.overlayEl.style.top = this.canvas.getBoundingClientRect().top + 'px'
    this.overlayEl.style.left = this.canvas.getBoundingClientRect().left + 'px'
    this.overlayEl.style.width = this.canvas.getBoundingClientRect().width + 'px'
    this.overlayEl.style.height = this.canvas.getBoundingClientRect().height + 'px'
  }

  formatWealth(value) {
    const reversedDigits = Array.from(String(value)).reverse().join('')
    const reversedWithCommas = reversedDigits.replaceAll(/(\d{3})(?!$)/g, '$1,')
    const withCommas = Array.from(reversedWithCommas).reverse().join('')
    return '$' + withCommas
  }
}

export default HUD
