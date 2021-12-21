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
