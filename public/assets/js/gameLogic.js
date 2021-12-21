import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'

const ATTACK_MAX_DISTANCE = 2.5
const ATTACK_MAX_ANGLE = THREE.MathUtils.degToRad(30)

const WEALTH_REDUCTION_PER_HIT = 15e9 + Math.round(1e8 * Math.random())

class GameLogic extends GameComponent {
  tags = ['GameLogic']

  start() {
    this.enemyWealth = this.enemy.startingWealth
    this.update()
  }

  update() {
    const hud = this.find('HUD')

    hud.data.startingWealth = this.enemy.startingWealth
    hud.data.currentWealth = this.enemyWealth
    hud.data.remainingTime = this.enemy.remainingTime
  }

  handleAttack() {
    const lookDirection = new THREE.Vector3()
    this.camera.getWorldDirection(lookDirection)

    const toEnemy = this.enemy.position.clone().sub(this.camera.position)
    const distance = toEnemy.length()
    const angle = toEnemy.angleTo(lookDirection)

    if (distance <= ATTACK_MAX_DISTANCE && angle <= ATTACK_MAX_ANGLE)
      this.handleHit()
  }

  handleHit() {
    this.enemyWealth = Math.max(0, this.enemyWealth - WEALTH_REDUCTION_PER_HIT)
  }

  get enemy() {
    return this.find('Enemy')
  }
}

export default GameLogic
