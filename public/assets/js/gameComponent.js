import CleanUpHelper from './cleanUpHelper.js'

/* All parts of the game, both tangible and intangible, are game components.
 * The GameComponent abstract class provides the helper methods necessary to
 * organise the component tree, including initialising child components,
 * ensuring start and update get called on the child components, etc.
 */

class GameComponent {
  tags = []

  // If a component is inactive, neither it nor its children receive update events
  active = true

  // Keep track of objects needing to be disposed of when the component is destroyed
  cleanUpHelper = new CleanUpHelper()

  constructor({ parentComponent = undefined, scene, camera, renderer, canvas, audioListener }) {
    // Track parent and children
    this.parentComponent = parentComponent
    this.children = []

    // Make sure each component has access to these key constants
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.canvas = canvas
    this.audioListener = audioListener
  }

  /* The abstract start and update functions are called on the root component
   * and propagated down the tree. The component class may override start and
   * update to add behaviour.
   */
  abstractStart() {
    this.start()
  }

  start() {}

  abstractUpdate(deltaTime) {
    if (this.active) {
      this.update(deltaTime)
      this.children.forEach(child => child.abstractUpdate(deltaTime))
    }
  }

  update(deltaTime) {}

  // Helper methods

  // Instantiate a new component and add it as a child
  initializeChild(klass, options = {}) {
    return this.addChild(new klass({
      parentComponent: this,
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      canvas: this.canvas,
      audioListener: this.audioListener,
      ...options
    }))
  }

  addChild(child) {
    this.children.push(child)
    child.abstractStart()
    return child
  }

  removeChild(child) {
    this.children = this.children.filter(x => x !== child)
  }

  // Completely remove a component and its children from the game
  destroy() {
    this.children.forEach(child => child.destroy())
    this.cleanUpHelper.cleanUp()
    this.teardown()

    if (this.parentComponent !== undefined)
      this.parentComponent.removeChild(this)
  }

  // Components can override teardown to perform further clean-up operations before destroy
  teardown() {}

  // Register an object with the CleanUpHelper
  requiresCleanup(obj, cleanUpMethod) {
    this.cleanUpHelper.add(obj, cleanUpMethod)
    return obj
  }

  objectRequiresCleanup(obj) {
    return this.requiresCleanup(obj, this.scene.remove.bind(this.scene))
  }

  /* Find a component by its tag. Delegates to the parent component if it
   * exists. When the root component is reached, begin recursively searching
   * child components for a matching tag.
   */
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

  resetObject(object) {
    object.position.set(0, 0, 0)
    object.rotation.set(0, 0, 0)
    return object
  }
}

export default GameComponent
