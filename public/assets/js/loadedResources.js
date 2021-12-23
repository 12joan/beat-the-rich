import * as THREE from '../../vendor/js/three.js/build/three.module.js'

const load = (klass, url) => new Promise((resolve, reject) =>
  (new klass()).load(url, resolve, () => {}, reject)
)

const RESOURCE_PROMISES = {
  'space_background.vert': load(THREE.FileLoader, '/assets/shaders/space_background/space_background.vert'),
  'space_background.frag': load(THREE.FileLoader, '/assets/shaders/space_background/space_background.frag'),
  'star.png': load(THREE.TextureLoader, '/assets/sprites/star.png'),
  'sun.png': load(THREE.TextureLoader, '/assets/sprites/sun.png'),
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
