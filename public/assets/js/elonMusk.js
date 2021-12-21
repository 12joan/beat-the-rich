import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'

class ElonMusk extends GameComponent {
  tags = ['Enemy']
  enemyName = 'Elon Musk'
  countdownLabel = 'Elon will escape jetpack range in:'
  startingWealth = 302e9

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
  }

  update(deltaTime) {
    this.remainingTime -= deltaTime
  }

  get position() {
    return this.rocket.position
  }
}

export default ElonMusk
