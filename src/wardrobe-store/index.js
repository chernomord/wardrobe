import { Promise } from 'es6-promise'
import fsStore from '../wardrobe-store-fs'

const store = {}
const items = {
  wardrobe: [],
  accessories: []
}

/**
 * Returns promise for wardrobe data request
 * @returns {Promise}
 */
store.loadWardrobe = function () {
  return new Promise(function (resolve, reject) {
    items.wardrobe = []
    items.accessories = []
    let rawData = fsStore.getAllItems()
    // lets sort it out
    rawData.forEach(item => {
      switch (item.type.value) {
      case 'bag':
      case 'scarf':
      case 'waistcoat':
      case 'hat':
        if (!items.accessories.hasOwnProperty(item.type.value)) items.accessories[item.type.value] = []
        items.accessories[item.type.value].push(item)
        break
      default:
        if (!items.wardrobe.hasOwnProperty(item.type.value)) items.wardrobe[item.type.value] = []
        items.wardrobe[item.type.value].push(item)
        break
      }
    })
    console.log(items)
    resolve(items)
  })
}

/**
 * Generate look from wardrobe data
 * @param {Object} wardrobe - wardrobe object
 * @param {Object} accessories - accessories object
 * @param {String} weather - season indication
 * @returns {Object}
 */
store.generateLook = function (wardrobe, accessories, weather) {
  /**
   * Filter wardrobe objects according to weather field values
   * @param wardrobeObj
   * @returns {{}}
   */
  const filterWardrobe = (wardrobeObj) => {
    let filtered = {}
    Object.getOwnPropertyNames(wardrobeObj).forEach(group => {
      if (group !== '__ob__') {
        filtered[group] = []
        wardrobeObj[group].forEach(item => {
          if (weather === 'any') {
            filtered[group].push(item)
          } else {
            for (let i = 0; i < item.season.length; ++i) {
              if (item.season[i].value === weather) {
                filtered[group].push(item)
                break
              }
            }
          }
        })
        if (filtered[group].length < 1) {
          delete filtered[group]
        }
      }
    })
    console.log(filtered)
    return filtered
  }
  /**
   * Returns decision between two string inputs
   * @param grp1 {string}
   * @param grp2 {string}
   * @returns {string}
   */
  const decideOppGroups = (grp1, grp2) => {
    let decision = [grp1, grp2]
    return decision[Math.round(Math.random())]
  }
  let look = {
    main: {},
    accessories: {}
  }
  let filteredWardrobe = filterWardrobe(wardrobe)
  let filteredAccessories = filterWardrobe(accessories)
  let excludeGroup = decideOppGroups('bottom', 'dress')
  Object.getOwnPropertyNames(filteredWardrobe).forEach(val => {
    if (val !== '__ob__' && val !== excludeGroup) {
      let index = Math.round(Math.random() * (filteredWardrobe[val].length - 1))
      look.main[val] = filteredWardrobe[val][index]
    }
  })
  Object.getOwnPropertyNames(filteredAccessories).forEach(val => {
    let decide = Math.random() - 0.5
    if (decide > 0 && val !== '__ob__') {
      let index = Math.round(Math.random() * (filteredAccessories[val].length - 1))
      look.accessories[val] = filteredAccessories[val][index]
    }
  })
  return {
    main: Object.assign({}, look.main),
    accessories: Object.assign({}, look.accessories)
  }
}

export default store
