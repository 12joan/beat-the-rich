import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import LevelEssentials from './levelEssentials.js'
import Sky from './sky.js'
import ElonMusk from './elonMusk.js'

class Level2 extends GameComponent {
  start() {
    this.initializeChild(LevelEssentials)

    this.camera.position.set(0, 0, 15)
    this.camera.rotation.set(0, 0, 0, 'YXZ')

    // Black background color
    this.scene.background = new THREE.Color(0x000000)

    // Light
    const light = this.objectRequiresCleanup(new THREE.PointLight(0xffffff, 1))

    light.position.setFromSphericalCoords(
      20,
      THREE.MathUtils.degToRad(15),
      THREE.MathUtils.degToRad(20),
    )

    light.castShadow = true
    light.shadow.mapSize.width = 4096
    light.shadow.mapSize.height = 4096

    this.scene.add(light)

    // Enemy
    this.initializeChild(ElonMusk)
  }

  update() {
    // Prevent looking up or down
    this.camera.rotation.x = 0
    this.camera.rotation.z = 0
  }
}

export default Level2
