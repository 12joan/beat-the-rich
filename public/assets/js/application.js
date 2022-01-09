import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import { loadResources } from './loadedResources.js'
import GameLogic from './gameLogic.js'

(async () => {
  await loadResources()

  const canvas = document.querySelector('#game-canvas')
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.001, 1000)

  const audioListener = new THREE.AudioListener()
  camera.add(audioListener)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.localClippingEnabled = true

  const updateRendererSize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  }

  window.addEventListener('resize', updateRendererSize)
  updateRendererSize()

  const rootComponent = new GameLogic({ scene, camera, renderer, canvas, audioListener })
  rootComponent.abstractStart()

  const controls = rootComponent.find('Controls')
  const menuController = rootComponent.find('Menus')

  menuController.setMenu('main-menu', () => {
    menuController.setMenu('level-1', () => {
      controls.lock()
    })
  })

  const onFocus = () => {
    menuController.setMenu('none')

    canvas.classList.remove('blur')
    document.querySelector('#game-overlay-hud').classList.remove('blur')
  }

  const onBlur = () => {
    if (menuController.currentMenu === 'none')
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
})()
