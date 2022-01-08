import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import { getResource } from './loadedResources.js'
import Timer from './timer.js'

const ROCKET_OFFSET_Y = -0.2

const DELAY_BEFORE_ROTATION = 1.5
const ROTATION_DURATION = 1

const ROTATION_SPEED = THREE.MathUtils.degToRad(60)
const ROTATION_RADIUS = 8

const BOB_SPEED = THREE.MathUtils.degToRad(120)
const BOB_AMPLITUDE = 0.2

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
    this.rocket = this.objectRequiresCleanup(this.resetObject(getResource('rocket.obj')))
    this.rocket.scale.set(1.5, 1.5, 1.5)

    this.rocket.traverse(node => {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true
      }
    })

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

    this.rocket.position.y = ROCKET_OFFSET_Y + (BOB_AMPLITUDE * Math.sin(this.bobPhase))
  }

  get position() {
    return this.rocket.position
  }

  headPosition() {
    const position = this.rocket.position.clone()
    position.y += 0.4
    return position
  }
}

export default ElonMusk
