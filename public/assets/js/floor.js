import GameComponent from './gameComponent.js'
import * as THREE from '../../vendor/js/three.js/build/three.module.js'

class Floor extends GameComponent {
  start() {
    const geometry = this.requiresCleanup(new THREE.PlaneGeometry(2000, 2000), 'dispose')
    geometry.rotateX(-Math.PI / 2)

    const material = this.requiresCleanup(new THREE.MeshPhysicalMaterial({
      color: 0x666666,
      metalness: 0,
      roughness: 1,
      clearcoat: 0,
    }), 'dispose')

    const plane = this.objectRequiresCleanup(new THREE.Mesh(geometry, material))
    plane.receiveShadow = true
    this.scene.add(plane)
  }
}

export default Floor
