import GameComponent from './gameComponent.js'
import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import { Sky as SkyObject } from '../../vendor/js/three.js/examples/jsm/objects/Sky.js'

class Sky extends GameComponent {
  start() {
    const sky = this.objectRequiresCleanup(new SkyObject())
    sky.scale.setScalar(450000)
    this.scene.add(sky)

    const uniforms = sky.material.uniforms

    uniforms['turbidity'].value = 5
    uniforms['rayleigh'].value = 1.15
    uniforms['mieCoefficient'].value = 0.02
    uniforms['mieDirectionalG'].value = 0.98

    const phi = THREE.MathUtils.degToRad(60)
    const theta = THREE.MathUtils.degToRad(42)

    uniforms['sunPosition'].value.setFromSphericalCoords(1, phi, theta)

    this.light = this.objectRequiresCleanup(new THREE.DirectionalLight(0xffffff, 1))
    this.light.position.setFromSphericalCoords(200, phi, theta)

    this.light.castShadow = true

    this.light.shadow.bias = -0.0001
    this.light.shadow.mapSize.width = 4096
    this.light.shadow.mapSize.height = 4096

    this.scene.add(this.light)
    this.scene.add(this.light.target)
  }

  update() {
    this.light.target.position.copy(this.find('Enemy').position)
  }
}

export default Sky
