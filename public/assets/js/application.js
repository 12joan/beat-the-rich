import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import Environment from './environment.js'
import GameControls from './controls.js'

const canvas = document.querySelector('#game-canvas')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const rootComponent = new GameComponent({ scene, camera, renderer, canvas })

const controlsComponent = rootComponent.initializeChild(GameControls)

rootComponent.initializeChild(Environment)

class Cube extends GameComponent {
  start() {
    const geometry = new THREE.BoxGeometry()

    const material = new THREE.MeshPhysicalMaterial({
      color: 0x00dd00,
      metalness: 0,
      roughness: 0.5,
      clearcoat: 0.75,
    })

    this.cube = new THREE.Mesh(geometry, material)
    this.cube.castShadow = true
    this.scene.add(this.cube)
  }

  update(deltaTime) {
    this.cube.rotation.x += 2 * deltaTime
    this.cube.rotation.y += 2 * deltaTime
  }
}

rootComponent.initializeChild(Cube)

rootComponent.abstractStart()

let previousTime = performance.now()

function updateLoop() {
  const time = performance.now()
  const deltaTime = (time - previousTime) / 1000

  if (controlsComponent.isLocked)
    rootComponent.abstractUpdate(deltaTime)

  previousTime = time

  renderer.render(scene, camera)
  requestAnimationFrame(updateLoop)
}

updateLoop()
