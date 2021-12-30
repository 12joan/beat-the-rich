import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import Overlay from './overlay.js'
import Controls from './controls.js'
import Level1 from './level1.js'
import Level2 from './level2.js'

const ATTACK_MAX_DISTANCE = 2.5
const ATTACK_MAX_ANGLE = THREE.MathUtils.degToRad(30)

const WEALTH_REDUCTION_PER_HIT = 15e9 + Math.round(1e8 * Math.random())

class GameLogic extends GameComponent {
  tags = ['GameLogic']

  start() {
    this.initializeChild(Overlay)
    this.controls = this.initializeChild(Controls)
    this.startLevel(Level1)
  }

  update() {
    this.hud.data.countdownLabel = this.enemy.countdownLabel
    this.hud.data.remainingTime = this.enemy.remainingTime
    this.hud.data.enemyName = this.enemy.enemyName
    this.hud.data.startingWealth = this.enemy.startingWealth
    this.hud.data.currentWealth = this.enemyWealth
  }

  startLevel(klass) {
    this.currentLevel = this.initializeChild(klass)
    this.controls.reset()
    this.enemy = this.find('Enemy')
    this.enemyWealth = this.enemy.startingWealth
  }

  handleAttack() {
    const lookDirection = new THREE.Vector3()
    this.camera.getWorldDirection(lookDirection)
    lookDirection.y = 0

    const toEnemy = this.enemy.position.clone().sub(this.camera.position)
    toEnemy.y = 0

    const distance = toEnemy.length()
    const angle = toEnemy.angleTo(lookDirection)

    if (distance <= ATTACK_MAX_DISTANCE && angle <= ATTACK_MAX_ANGLE)
      this.handleHit()
  }

  handleHit() {
    this.enemyWealth = Math.max(0, this.enemyWealth - WEALTH_REDUCTION_PER_HIT)

    if (this.enemyWealth == 0)
      this.levelCompleted()
  }

  levelCompleted() {
    this.currentLevel.destroy()
    this.startLevel(Level2)
  }

  get hud() {
    return (this._hud ??= this.find('HUD'))
  }
}

export default GameLogic
