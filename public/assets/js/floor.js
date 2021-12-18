import GameComponent from './gameComponent.js'
import * as THREE from '../../vendor/js/three.js/build/three.module.js'

class Floor extends GameComponent {
  start() {
    const geometry = new THREE.PlaneGeometry(2000, 2000)
    geometry.rotateX(- Math.PI / 2)

    const material = new THREE.MeshPhysicalMaterial({
      color: 0x666666,
      metalness: 0,
      roughness: 0.5,
      clearcoat: 0.75,
    })

    const plane = new THREE.Mesh(geometry, material)
    plane.receiveShadow = true
    this.scene.add(plane)
  }
}

export default Floor
