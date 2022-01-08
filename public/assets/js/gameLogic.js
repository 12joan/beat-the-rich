import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import Overlay from './overlay.js'
import Controls from './controls.js'
import Level1 from './level1.js'
import Level2 from './level2.js'
import CoinBurst from './coinBurst.js'

const ATTACK_MAX_DISTANCE = 2.5
const ATTACK_MAX_ANGLE = THREE.MathUtils.degToRad(30)

const WEALTH_REDUCTION_PER_HIT = 15e9 + Math.round(1e8 * Math.random())

class GameLogic extends GameComponent {
  tags = ['GameLogic']

  levels = [Level1, Level2]

  start() {
    this.initializeChild(Overlay)
    this.controls = this.initializeChild(Controls)
    this.startLevel()
  }

  update() {
    this.hud.data.countdownLabel = this.enemy.countdownLabel
    this.hud.data.remainingTime = this.enemy.remainingTime
    this.hud.data.enemyName = this.enemy.enemyName
    this.hud.data.startingWealth = this.enemy.startingWealth
    this.hud.data.currentWealth = this.enemyWealth

    if (this.enemy.active && this.enemy.remainingTime <= 0) {
      this.enemy.active = false
      setTimeout(() => this.gameOver(), 1000)
    }
  }

  startLevel() {
    this.currentLevel?.destroy()
    this.currentLevel = this.initializeChild(this.levels[0])
    this.controls.reset()
    this.enemy = this.find('Enemy')
    this.enemyWealth = this.enemy.startingWealth
  }

  restartLevel() {
    this.startLevel()
  }

  handleAttack() {
    const lookDirection = new THREE.Vector3()
    this.camera.getWorldDirection(lookDirection)
    lookDirection.y = 0

    const toEnemy = this.enemy.position.clone().sub(this.find('PlayerCharacter').position)
    toEnemy.y = 0

    const distance = toEnemy.length()
    const angle = toEnemy.angleTo(lookDirection)

    if (distance <= ATTACK_MAX_DISTANCE && angle <= ATTACK_MAX_ANGLE)
      this.handleHit()
  }

  handleHit() {
    if (this.enemy.active) {
      this.enemyWealth = Math.max(0, this.enemyWealth - WEALTH_REDUCTION_PER_HIT)
      this.initializeChild(CoinBurst, { position: this.enemy.headPosition() })

      if (this.enemyWealth == 0) {
        this.enemy.active = false
        setTimeout(() => this.levelCompleted(), 1000)
      }
    }
  }

  gameOver() {
    const controls = this.find('Controls')
    controls.unlock()

    this.find('Menus').setMenu('game-over', () => {
      this.restartLevel()
      controls.lock()
    })
  }

  levelCompleted() {
    const controls = this.find('Controls')
    controls.unlock()

    this.levels.shift()

    if (this.levels.length > 0) {
      this.startLevel()

      this.find('Menus').setMenu('level-2', () => {
        controls.lock()
      })
    } else {
      this.find('Menus').setMenu('game-completed', () => {
        window.open('https://choose.love/collections/daily-survival', '_blank')
        window.location.reload()
      })
    }
  }

  get hud() {
    return (this._hud ??= this.find('HUD'))
  }
}

export default GameLogic
