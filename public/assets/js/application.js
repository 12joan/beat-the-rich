import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import { loadResources, getResource } from './loadedResources.js'
import GameLogic from './gameLogic.js'

/* This file performs all necessary setup for the game and performs the update
 * loop. The GameComponent abstract class is used to create a tree of game
 * components, which is used to share information and synchronise updates
 * throughout the game.
 *
 * The GameLogic component is the root of this tree, and is the go-to place to
 * begin understanding the code.
 *
 * For a deeper understanding of how the game component tree works internally,
 * take a look at the GameComponent class itself.
 */

// Wait for the load game button to be clicked
document.querySelector('#loading button').addEventListener('click', async () => {
  const loadingIndicator = document.querySelector('#loading')

  // Preload all resources used by the game
  await loadResources(progress => {
    loadingIndicator.innerText = `Loading... ${Math.floor(progress * 100)}%`
  })

  loadingIndicator.remove()

  // Three.js setup
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

  // Initialise game component tree
  const rootComponent = new GameLogic({ scene, camera, renderer, canvas, audioListener })
  rootComponent.abstractStart()

  const controls = rootComponent.find('Controls')
  const menuController = rootComponent.find('Menus')
  const musicController = rootComponent.find('Music')

  // Manage main menu and music
  musicController.playSong(getResource('main-menu-theme.mp3'))

  menuController.setMenu('main-menu', () => {
    musicController.playSong(getResource('battle-theme.mp3'))

    menuController.setMenu('level-1', () => {
      controls.lock()
    })
  })

  // Logic to switch between menus and the game
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

  // Track time between updates
  let previousTime = performance.now()

  // Track whether the game has been updated since last draw
  let upToDate = false

  let wasLocked = false

  const updateLoop = () => {
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
})
