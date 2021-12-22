import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import Timer from './timer.js'

const DELAY_BEFORE_ROTATION = 3
const ROTATION_DURATION = 1.5

const ROTATION_SPEED = THREE.MathUtils.degToRad(40)
const ROTATION_RADIUS = 5

const BOB_SPEED = THREE.MathUtils.degToRad(90)
const BOB_AMPLITUDE = 0.1

class ElonMusk extends GameComponent {
  tags = ['Enemy']
  enemyName = 'Elon Musk'
  countdownLabel = 'Elon will escape jetpack range in:'
  startingWealth = 302e9

  beforeRotationTimer = new Timer()
  rotationTimer = new Timer()
  rotationDirection = 0
  angle = 0
  bobPhase = 0
  remainingTime = 60

  start() {
    const material = this.requiresCleanup(new THREE.MeshPhysicalMaterial({
      color: 0xddaa88,
      metalness: 0,
      roughness: 0.5,
      clearcoat: 0.75,
    }), 'dispose')

    const rocketGeometry = this.requiresCleanup(new THREE.BoxGeometry(0.5, 1.5, 0.5), 'dispose')

    this.rocket = this.objectRequiresCleanup(new THREE.Mesh(rocketGeometry, material))
    this.rocket.castShadow = true
    this.rocket.receiveShadow = true
    this.scene.add(this.rocket)

    this.updateRocketPosition()
  }

  update(deltaTime) {
    this.remainingTime -= deltaTime

    this.bobPhase += BOB_SPEED * deltaTime
    this.angle += this.rotationDirection * ROTATION_SPEED * deltaTime

    if (this.rotationDirection === 0) {
      this.beforeRotationTimer.advanceClock(deltaTime)

      this.beforeRotationTimer.afterTime(DELAY_BEFORE_ROTATION, () => {
        this.rotationDirection = Math.random() > 0.5 ? 1 : -1
        this.beforeRotationTimer.reset()
      })
    } else {
      this.rotationTimer.advanceClock(deltaTime)

      this.rotationTimer.afterTime(ROTATION_DURATION, () => {
        this.rotationDirection = 0
        this.rotationTimer.reset()
      })
    }

    this.updateRocketPosition()
  }

  updateRocketPosition() {
    this.rocket.position.x = ROTATION_RADIUS * Math.cos(this.angle - (Math.PI / 2))
    this.rocket.position.z = ROTATION_RADIUS * Math.sin(this.angle - (Math.PI / 2))

    this.rocket.rotation.y = -this.angle

    this.rocket.position.y = BOB_AMPLITUDE * Math.sin(this.bobPhase)
  }

  get position() {
    return this.rocket.position
  }
}

export default ElonMusk
