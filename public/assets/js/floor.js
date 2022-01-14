import GameComponent from './gameComponent.js'
import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import { getResource } from './loadedResources.js'

// The floor of Level 1.

const SIZE = 2000
const TEXTURE_SIZE = 10

class Floor extends GameComponent {
  start() {
    const geometry = this.requiresCleanup(new THREE.PlaneGeometry(SIZE, SIZE), 'dispose')
    geometry.rotateX(-Math.PI / 2)

    const texture = getResource('stone.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(SIZE / TEXTURE_SIZE, SIZE / TEXTURE_SIZE)

    const material = this.requiresCleanup(new THREE.MeshPhysicalMaterial({
      map: texture,
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
