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

    const phi = THREE.MathUtils.degToRad(20)
    const theta = THREE.MathUtils.degToRad(42)

    uniforms['sunPosition'].value.setFromSphericalCoords(1, phi, theta)

    const light = this.objectRequiresCleanup(new THREE.PointLight(0xffffff, 1))
    light.position.setFromSphericalCoords(20, phi, theta)
    light.castShadow = true
    light.shadow.mapSize.width = 4096
    light.shadow.mapSize.height = 4096
    this.scene.add(light)
  }
}

export default Sky
