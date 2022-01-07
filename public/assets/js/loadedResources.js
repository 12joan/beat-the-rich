import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import { OBJLoader } from '../../vendor/js/three.js/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '../../vendor/js/three.js/examples/jsm/loaders/MTLLoader.js'
import { GLTFLoader } from '../../vendor/js/three.js/examples/jsm/loaders/GLTFLoader.js'

const loadWithLoader = (loader, url) => new Promise((resolve, reject) => loader.load(url, resolve, () => {}, reject))
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

const RESOURCE_PROMISES = {
  'shovel.obj': loadOBJ('/assets/models/shovel.obj', '/assets/materials/shovel.mtl'),
  'player.glb': loadGLTF('/assets/models/player.glb'),
  'stone.png': loadWithType(THREE.TextureLoader, '/assets/textures/stone.png'),
  'box.obj': loadOBJ('/assets/models/box.obj', '/assets/materials/box.mtl'),
  'jeff.obj': loadOBJ('/assets/models/jeff.obj', '/assets/materials/jeff.mtl'),
  'rocket.obj': loadOBJ('/assets/models/rocket.obj', '/assets/materials/rocket.mtl'),
  'space_background.vert': loadWithType(THREE.FileLoader, '/assets/shaders/space_background/space_background.vert'),
  'space_background.frag': loadWithType(THREE.FileLoader, '/assets/shaders/space_background/space_background.frag'),
  'star.png': loadWithType(THREE.TextureLoader, '/assets/sprites/star.png'),
  'sun.png': loadWithType(THREE.TextureLoader, '/assets/sprites/sun.png'),
}

const resources = {}

const loadResources = async () => {
  for (const key of Object.keys(RESOURCE_PROMISES)) {
    resources[key] = await RESOURCE_PROMISES[key]
  }

  return resources
}

const getResource = key => resources[key]

export { loadResources, getResource }
