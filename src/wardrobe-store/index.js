import { Promise } from 'es6-promise'

const store = {}
const items = {
  wardrobe: {},
  accessories: {}
}

/**
 * Returns promise for wardrobe data request
 * @returns {Promise}
 */
store.loadWardrobe = function () {
  return new Promise(function (resolve, reject) {
    let request = new XMLHttpRequest()
    request.open('GET', 'static/wardrobe.json', true)
    request.onreadystatechange = () => { // (3)
      if (request.readyState !== 4) return
      if (request.status === 200) {
        let data = JSON.parse(request.responseText)
        items.accessories = data.accessories
        delete data.accessories
        items.wardrobe = data
        resolve(items)
      } else {
        reject(Error('Data didn\'t load successfully; error code:' + request.statusText))
      }
    }
    request.send()
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
            filtered[group].push(item['path'])
          } else if (item.weather.indexOf(weather) > -1 || item.weather.indexOf('any') > -1) {
            filtered[group].push(item['path'])
          }
        })
        if (filtered[group].length < 1) {
          delete filtered[group]
        }
      }
    })
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
