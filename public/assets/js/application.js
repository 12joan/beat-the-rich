import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import { loadResources } from './loadedResources.js'
import GameLogic from './gameLogic.js'

await loadResources()

const canvas = document.querySelector('#game-canvas')
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.localClippingEnabled = true

const rootComponent = new GameLogic({ scene, camera, renderer, canvas })
rootComponent.abstractStart()

const controls = rootComponent.find('Controls')
const menuController = rootComponent.find('Menus')

menuController.setMenu('main-menu', controls.lock.bind(controls))

const onFocus = () => {
  menuController.setMenu('none')

  canvas.classList.remove('blur')
  document.querySelector('#game-overlay-hud').classList.remove('blur')
}

const onBlur = () => {
  menuController.setMenu('pause-menu', controls.lock.bind(controls))

  canvas.classList.add('blur')
  document.querySelector('#game-overlay-hud').classList.add('blur')
}

let previousTime = performance.now()
let upToDate = false
let wasLocked = false

function updateLoop() {
  const time = performance.now()
  const deltaTime = (time - previousTime) / 1000

  if (controls.isLocked) {
    rootComponent.abstractUpdate(deltaTime)
    upToDate = false
    if (!wasLocked) onFocus()
  } else {
    if (wasLocked) onBlur()
  }

  previousTime = time
  wasLocked = controls.isLocked

  if (!upToDate) {
    renderer.render(scene, camera)
    upToDate = true
  }

  requestAnimationFrame(updateLoop)
}

updateLoop()
