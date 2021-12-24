import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import { OBJLoader } from '../../vendor/js/three.js/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '../../vendor/js/three.js/examples/jsm/loaders/MTLLoader.js'

const loadWithLoader = (loader, url) => new Promise((resolve, reject) => loader.load(url, resolve, () => {}, reject))
const loadWithType = (klass, url) => loadWithLoader(new klass(), url)

const loadModel = (objUrl, mtlUrl) => {
  const mtlLoader = new MTLLoader()
  mtlLoader.setMaterialOptions({ side: THREE.DoubleSide })

  return loadWithLoader(mtlLoader, mtlUrl).then(materialCreator => {
    const objLoader = new OBJLoader()
    objLoader.setMaterials(materialCreator)

    return loadWithLoader(objLoader, objUrl)
  })
}

const RESOURCE_PROMISES = {
  'box.obj': loadModel('/assets/models/box.obj', '/assets/materials/box.mtl'),
  'jeff.obj': loadModel('/assets/models/jeff.obj', '/assets/materials/jeff.mtl'),
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
