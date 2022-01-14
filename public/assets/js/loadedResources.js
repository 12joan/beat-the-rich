import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import { OBJLoader } from '../../vendor/js/three.js/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '../../vendor/js/three.js/examples/jsm/loaders/MTLLoader.js'
import { GLTFLoader } from '../../vendor/js/three.js/examples/jsm/loaders/GLTFLoader.js'

let onProgress
const resourceProgressData = {}

const loadWithLoader = (loader, url) => loader.loadAsync(url, progress => {
  resourceProgressData[url] = progress

  const totalProgressData = Object.values(resourceProgressData).reduce(({ total, loaded }, progress) => ({
    total: total + progress.total,
    loaded: loaded + progress.loaded,
  }), { total: 0, loaded: 0 })

  onProgress(totalProgressData.loaded / totalProgressData.total)
})

const loadWithType = (klass, url) => loadWithLoader(new klass(), url)

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

const resources = {}

const loadResources = _onProgress => {
  onProgress = _onProgress

  const resourcePromises = []

  for (const key of Object.keys(resourcePromiseProviders)) {
    resourcePromises.push(
      resourcePromiseProviders[key]().then(value => resources[key] = value)
    )
  }

  return Promise.all(resourcePromises)
}

const getResource = key => resources[key]

export { loadResources, getResource }
