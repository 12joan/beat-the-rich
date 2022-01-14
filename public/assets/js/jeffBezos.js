import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import { getResource } from './loadedResources.js'
import Timer from './timer.js'

/* Enemy of Level 1. Jeff Bezos slowly descends into a box while hopping in
 * random directions
 */

const DELAY_BETWEEN_LEAPS = 2
const LEAP_DURATION = 0.5
const LEAP_HEIGHT = 1.25
const LEAP_SPEED = 10

const BOX_HEIGHT = 0.5
const CUT_OUT_HEIGHT = 1.7
const DESCENT_INTO_BOX_DURATION = 60

class JeffBezos extends GameComponent {
  tags = ['Enemy']
  enemyName = 'Jeff Bezos'
  countdownLabel = 'Same-day delivery shipping in:'
  startingWealth = 201.7e9

  leaping = false
  beforeLeapTimer = new Timer()
  leapTimer = new Timer()
  remainingTime = DESCENT_INTO_BOX_DURATION

  start() {
    /* The cut-out will be descending into the box. A clipping plane is used
     * to ensure that only the part of the model above and inside the box is
     * visible.
     */
    this.clippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

    this.box = this.objectRequiresCleanup(this.resetObject(getResource('box.obj')))
    this.setAltitude(0)

    this.box.traverse(node => {
      if (node instanceof THREE.Mesh) {
        node.receiveShadow = true
        node.castShadow = true
      }
    })

    this.scene.add(this.box)

    this.cutOut = this.objectRequiresCleanup(this.resetObject(getResource('jeff.obj')))

    this.cutOut.traverse(node => {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true
        node.material.clippingPlanes = [this.clippingPlane]
        node.material.clipShadows = true
      }
    })

    this.box.add(this.cutOut)
  }

  update(deltaTime) {
    // Descend into box
    this.cutOut.position.y -= (CUT_OUT_HEIGHT - BOX_HEIGHT) * deltaTime / DESCENT_INTO_BOX_DURATION
    this.remainingTime -= deltaTime

    if (this.leaping) {
      this.leapTimer.advanceClock(deltaTime)

      // Leap in an upside down parabola or, to use the technical term, an umbrella.
      const progress = this.leapTimer.progressToTime(LEAP_DURATION)
      this.setAltitude(LEAP_HEIGHT * -4 * progress * (progress - 1))

      // Travel in a random direction
      this.box.position.add(this.leapDirection.clone().multiplyScalar(LEAP_SPEED * deltaTime))

      this.leapTimer.afterTime(LEAP_DURATION, () => {
        this.leaping = false
        this.leapTimer.reset()
      })
    } else {
      this.beforeLeapTimer.advanceClock(deltaTime)
      this.setAltitude(0)

      this.beforeLeapTimer.afterTime(DELAY_BETWEEN_LEAPS, () => {
        this.randomiseLeapDirection()
        this.leaping = true
        this.beforeLeapTimer.reset()
      })
    }
  }

  get position() {
    return this.box.position
  }

  // The position to centre the coin burst on
  headPosition() {
    const position = new THREE.Vector3()
    this.cutOut.getWorldPosition(position)
    position.y += CUT_OUT_HEIGHT
    return position
  }

  setAltitude(altitude) {
    this.box.position.y = altitude
    this.clippingPlane.constant = -altitude
  }

  randomiseLeapDirection() {
    this.leapDirection = new THREE.Vector3(
      Math.random() - 0.5,
      0,
      Math.random() - 0.5,
    ).normalize()
  }
}

export default JeffBezos
