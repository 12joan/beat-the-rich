class GameComponent {
  tags = []

  constructor({ parentComponent = undefined, scene, camera, renderer, canvas }) {
    this.parentComponent = parentComponent
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.canvas = canvas
    this.children = []
  }

  abstractStart() {
    this.start()
    this.children.forEach(child => child.abstractStart())
    this.started = true
  }

  start() {}

  abstractUpdate(deltaTime) {
    this.update(deltaTime)
    this.children.forEach(child => child.abstractUpdate(deltaTime))
  }

  update(deltaTime) {}

  initializeChild(klass, options = {}) {
    return this.addChild(new klass({
      parentComponent: this,
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      canvas: this.canvas,
      ...options
    }))
  }

  addChild(child) {
    this.children.push(child)

    if (this.started)
      child.start()

    return child
  }

  find(...args) {
    return this.parentComponent === undefined
      ? this.findInChildren(...args)
      : this.parentComponent.find(...args)
  }

  findInChildren(tag) {
    if (this.tags.includes(tag))
      return this

    for (const child of this.children) {
      const result = child.findInChildren(tag)
      if (result !== null)
        return result
    }

    return null
  }
}

export default GameComponent
