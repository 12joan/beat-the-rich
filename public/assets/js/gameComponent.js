class GameComponent {
  constructor({ scene, camera, renderer, canvas }) {
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
}

export default GameComponent
