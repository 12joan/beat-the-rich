import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import { getResource } from './loadedResources.js'
import Timer from './timer.js'

const COIN_COUNT = 400
const COIN_MIN_SPEED = 1
const COIN_MAX_SPEED = 3
const GRAVITY = 10
const LIFETIME = 2

class CoinBurst extends GameComponent {
  lifetimeTimer = new Timer()

  constructor({ position, ...otherOptions }) {
    super(otherOptions)
    this.initialPosition = position
  }

  start() {
    const coinMaterial = this.requiresCleanup(new THREE.SpriteMaterial({
      map: getResource('coin.png'),
      color: 0xffffff,
      transparent: true,
      depthWrite: false,
    }), 'dispose')

    this.coins = Array(COIN_COUNT).fill().map(() => {
      const coin = this.objectRequiresCleanup(new THREE.Sprite(coinMaterial))
      coin.scale.multiplyScalar(0.05)
      coin.position.copy(this.initialPosition)

      this.scene.add(coin)

      return {
        object: coin,
        velocity: new THREE.Vector3().setFromSphericalCoords(
          THREE.MathUtils.randFloat(COIN_MIN_SPEED, COIN_MAX_SPEED),
          THREE.MathUtils.randFloat(0, Math.PI),
          THREE.MathUtils.randFloat(0, Math.PI * 2),
        ),
      }
    })
  }

  update(deltaTime) {
    this.coins.forEach(({ object, velocity }) => {
      velocity.y -= GRAVITY * deltaTime
      object.position.add(velocity.clone().multiplyScalar(deltaTime))
    })

    this.lifetimeTimer.advanceClock(deltaTime)
    this.lifetimeTimer.afterTime(LIFETIME, this.destroy.bind(this))
  }
}

export default CoinBurst
