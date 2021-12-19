import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'

const ATTACK_MAX_DISTANCE = 2.5
const ATTACK_MAX_ANGLE = THREE.MathUtils.degToRad(30)

class GameLogic extends GameComponent {
  tags = ['GameLogic']

  constructor({ enemyComponent, ...otherArgs }) {
    super(otherArgs)
  }

  handleAttack() {
    const lookDirection = new THREE.Vector3()
    this.camera.getWorldDirection(lookDirection)

    const toEnemy = this.find('Enemy').position.clone().sub(this.camera.position)
    const distance = toEnemy.length()
    const angle = toEnemy.angleTo(lookDirection)

    if (distance <= ATTACK_MAX_DISTANCE && angle <= ATTACK_MAX_ANGLE)
      this.handleHit()
  }

  handleHit() {
    console.log('Hit!')
  }
}

export default GameLogic
