import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import HUD from './hud.js'
import Level1 from './level1.js'

const canvas = document.querySelector('#game-canvas')
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000)
camera.position.set(0, 1, 15)

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.localClippingEnabled = true

const rootComponent = new GameComponent({ scene, camera, renderer, canvas })
rootComponent.initializeChild(HUD)
rootComponent.initializeChild(Level1)
rootComponent.abstractStart()

let previousTime = performance.now()
let upToDate = false

function updateLoop() {
  const time = performance.now()
  const deltaTime = (time - previousTime) / 1000

  if (rootComponent.find('Controls')?.isLocked) {
    rootComponent.abstractUpdate(deltaTime)
    upToDate = false
  }

  previousTime = time

  if (!upToDate) {
    renderer.render(scene, camera)
    upToDate = true
  }

  requestAnimationFrame(updateLoop)
}

updateLoop()
