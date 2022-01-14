/* In Three.js, certain types of object need to be disposed of when no longer
 * in use. This class, which is used internally by GameComponent, keeps track
 * of these objects and the correct means of disposing of them.
 */

class CleanUpHelper {
  registeredObjects = []

  add(obj, cleanUpMethod) {
    this.registeredObjects.push({ obj, cleanUpMethod })
  }

  cleanUp() {
    this.registeredObjects.forEach(({ obj, cleanUpMethod }) => {
      switch (typeof cleanUpMethod) {
        case 'string':
          obj[cleanUpMethod]()
          break

        case 'function':
          cleanUpMethod(obj)
          break

        default:
          throw new Error(`Unexpected cleanUpMethod: ${cleanUpMethod}`)
      }
    })
  }
}

export default CleanUpHelper
