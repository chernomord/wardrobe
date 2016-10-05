let items = []
const saveItems = () => {
  window.localStorage.setItem('storedLooks', JSON.stringify(items))
}

const looks = {
  /**
   * Return saved looks
   * @returns {Array} - saved looks
   */
  get: () => {
    if (items.length > 0) return items
    let storedLooks = window.localStorage.getItem('storedLooks')
    if (storedLooks) {
      items.length = 0
      items = JSON.parse(storedLooks)
      console.log(items)
    }
    return items
  },
  /**
   * Add new look to collection and save it
   * @param newLook {Object}
   */
  add: function (newLook) {
    /**
     * Check if collection has identical item already
     * @param look {Object}
     * @param storedLooks {Array}
     * @returns {boolean}
     */
    const noEquals = (look, storedLooks) => {
      let noEqual = true
      for (let i = 0; i < storedLooks.length; ++i) {
        if (JSON.stringify(storedLooks[i].look) === JSON.stringify(look)) {
          noEqual = false
          break
        }
      }
      return noEqual
    }
    /**
     * Get maximal number for a list of stored looks, needed for name increment
     * @returns {Number}
     */
    const maxNum = () => {
      let maxNum = 1
      for (let i = 0; i < items.length; ++i) {
        let curName = parseInt(items[i].name, 10)
        if (curName >= maxNum) maxNum = curName + 1
      }
      return maxNum
    }
    if (newLook.main !== 'empty' && noEquals(newLook, items)) {
      let lookToStore = {}
      lookToStore.name = maxNum()
      lookToStore.look = Object.assign({}, newLook)
      items.push(lookToStore)
      saveItems()
    }
  },
  /**
   * Delete look from looks by index
   * @param idx {Number}
   */
  delete: function (idx) {
    items.splice(idx, 1)
    saveItems()
  }
}

export default looks
