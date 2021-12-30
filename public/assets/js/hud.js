import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'

class HUD extends GameComponent {
  tags = ['HUD']

  // Modified by external components
  data = {}

  hudEl = document.querySelector('#game-overlay-hud')

  update() {
    // Countdown
    this.hudEl.querySelector('#game-overlay-hud-countdown-label').innerText = this.data.countdownLabel
    this.hudEl.querySelector('#game-overlay-hud-countdown-value').innerText = Math.max(0, Math.ceil(this.data.remainingTime)) + ' seconds'

    // Enemy name
    this.hudEl.querySelector('#game-overlay-hud-wealth-name').innerText = this.data.enemyName

    // Wealth bar
    const wealthFillEl = this.hudEl.querySelector('#game-overlay-hud-wealth-bar-fill')

    wealthFillEl.setAttribute('data-text', this.formatWealth(this.data.currentWealth))
    wealthFillEl.style.width = this.data.currentWealth > 0
      ? (100 * this.data.currentWealth / this.data.startingWealth) + '%'
      : '0'

    // Unhide HUD after data is updated
    this.hudEl.classList.remove('d-none')
  }

  formatWealth(value) {
    const reversedDigits = Array.from(String(value)).reverse().join('')
    const reversedWithCommas = reversedDigits.replaceAll(/(\d{3})(?!$)/g, '$1,')
    const withCommas = Array.from(reversedWithCommas).reverse().join('')
    return '$' + withCommas
  }
}

export default HUD
