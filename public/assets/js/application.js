import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import GameControls from './controls.js'
import GameLogic from './gameLogic.js'
import Shovel from './shovel.js'
import Environment from './environment.js'
import JeffBezos from './jeffBezos.js'

const canvas = document.querySelector('#game-canvas')
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000)
camera.position.set(0, 1, 15)

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.localClippingEnabled = true

const rootComponent = new GameComponent({ scene, camera, renderer, canvas })

const controlsComponent = rootComponent.initializeChild(GameControls)

rootComponent.initializeChild(GameLogic)
rootComponent.initializeChild(Shovel)
rootComponent.initializeChild(Environment)
rootComponent.initializeChild(JeffBezos)

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
