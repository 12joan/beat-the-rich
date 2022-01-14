import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import { OBJLoader } from '../../vendor/js/three.js/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '../../vendor/js/three.js/examples/jsm/loaders/MTLLoader.js'
import { GLTFLoader } from '../../vendor/js/three.js/examples/jsm/loaders/GLTFLoader.js'

/* This file is responsible for preloading the assets used by the game. These
 * assets should be configured in the resourcePromiseProviders constant, which
 * maps the name of each resource to a thunk which yields a promise which
 * loads and returns the resource.
 *
 * When the loadResources function is called, all resources begin downloading
 * in parallel. The onProgress function is called repeatedly with updates
 * on how the download is progressing.
 */

let onProgress
const resourceProgressData = {}

// Loader functions

const loadWithLoader = (loader, url) => loader.loadAsync(url, progress => {
  resourceProgressData[url] = progress

  // Sum the total and loaded values of all progress data objects
  const totalProgressData = Object.values(resourceProgressData).reduce(({ total, loaded }, progress) => ({
    total: total + progress.total,
    loaded: loaded + progress.loaded,
  }), { total: 0, loaded: 0 })

  onProgress(totalProgressData.loaded / totalProgressData.total)
})

const loadWithType = (klass, url) => loadWithLoader(new klass(), url)

// Load an OBJ and a MTL file together
const loadOBJ = (objUrl, mtlUrl) => {
  const mtlLoader = new MTLLoader()
  mtlLoader.setMaterialOptions({ side: THREE.DoubleSide })

  return loadWithLoader(mtlLoader, mtlUrl).then(materialCreator => {
    const objLoader = new OBJLoader()
    objLoader.setMaterials(materialCreator)

    return loadWithLoader(objLoader, objUrl)
  })
}

const loadGLTF = gltfUrl => {
  const gltfLoader = new GLTFLoader()
  return loadWithLoader(gltfLoader, gltfUrl)
}

// Configured resources
const resourcePromiseProviders = {
  'main-menu-theme.mp3': () => loadWithType(THREE.AudioLoader, '/assets/music/main-menu-theme.mp3'),
  'battle-theme.mp3': () => loadWithType(THREE.AudioLoader, '/assets/music/battle-theme.mp3'),
  'shovel.obj': () => loadOBJ('/assets/models/shovel.obj', '/assets/materials/shovel.mtl'),
  'player.glb': () => loadGLTF('/assets/models/player.glb'),
  'coin.png': () => loadWithType(THREE.TextureLoader, '/assets/sprites/coin.png'),
  'scream.wav': () => loadWithType(THREE.AudioLoader, '/assets/sounds/scream.wav'),
  'stone.png': () => loadWithType(THREE.TextureLoader, '/assets/textures/stone.png'),
  'box.obj': () => loadOBJ('/assets/models/box.obj', '/assets/materials/box.mtl'),
  'jeff.obj': () => loadOBJ('/assets/models/jeff.obj', '/assets/materials/jeff.mtl'),
  'rocket.obj': () => loadOBJ('/assets/models/rocket.obj', '/assets/materials/rocket.mtl'),
  'space_background.vert': () => loadWithType(THREE.FileLoader, '/assets/shaders/space_background/space_background.vert'),
  'space_background.frag': () => loadWithType(THREE.FileLoader, '/assets/shaders/space_background/space_background.frag'),
  'star.png': () => loadWithType(THREE.TextureLoader, '/assets/sprites/star.png'),
  'sun.png': () => loadWithType(THREE.TextureLoader, '/assets/sprites/sun.png'),
  'ending-theme.mp3': () => loadWithType(THREE.AudioLoader, '/assets/music/ending-theme.mp3'),
}

// Loaded resources are stored here
const resources = {}

const loadResources = _onProgress => {
  onProgress = _onProgress

  const resourcePromises = []

  // Start all resources loading
  for (const key of Object.keys(resourcePromiseProviders)) {
    resourcePromises.push(
      resourcePromiseProviders[key]().then(value => resources[key] = value)
    )
  }

  // A promise that resolves when all resources have loaded
  return Promise.all(resourcePromises)
}

const getResource = key => resources[key]

export { loadResources, getResource }
