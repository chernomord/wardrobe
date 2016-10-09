import { Promise } from 'es6-promise'

const fsStore = {}
export default fsStore

const megabytes = (value = 50) => (1024 * 1024 * value)
const saveWD = () => {
  window.localStorage.setItem('wd_fs', JSON.stringify(WARDROBE))
}
const loadWD = () => (JSON.parse(window.localStorage.getItem('wd_fs')))
/**
 * Resize and compress input blob image returning blob again
 * @param src {*}
 * @returns {Promise}
 */
const resize = src => (
  new Promise((resolve) => {
    let MAX_HEIGHT = 500
    const image = new Image()
    image.onload = () => {
      let canvas = document.createElement('canvas')
      if (image.height > MAX_HEIGHT) {
        image.width *= MAX_HEIGHT / image.height
        image.height = MAX_HEIGHT
      }
      let ctx = canvas.getContext('2d')
      // ctx.mozImageSmoothingEnabled = true
      // ctx.webkitImageSmoothingEnabled = true
      // ctx.msImageSmoothingEnabled = true
      ctx.imageSmoothingEnabled = true
      // ctx.clearRect(0, 0, canvas.width, canvas.height)
      canvas.width = image.width
      canvas.height = image.height
      ctx.drawImage(image, 0, 0, image.width, image.height)
      canvas.toBlob(blob => {
        resolve(blob)
      }, 'image/jpeg', 0.90)
    }
    image.src = src
  })
)

const WARDROBE = loadWD() || []
let _fs = null

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem

/**
 * Init filesystem
 */
fsStore.init = () => (
  new Promise((resolve, reject) => {
    navigator.webkitPersistentStorage.requestQuota(megabytes(), grantedBytes => {
      console.log('Замусолили ', grantedBytes, 'байт. Спасибо, на всю жизнь хватит теперь!')
      window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, (filesystem) => {
        _fs = filesystem
        resolve('Opened file system: ' + _fs.name)
      }, error => {
        reject('Палундра! Мне нужно твое разрешение на сохранение файлов! ' + error.message)
      })
    })
  })
)
fsStore.getAllItems = () => {
  return Object.assign({}, WARDROBE)
}

/**
 * Adding file to local filesystem from File input
 * @param name {String} - name of the file
 * @param file {File} - file object
 * @param season {Object} - season
 * @param type {Object} - item type
 * @returns {Promise} - return promise of url string
 */
fsStore.add = (file, season, type, name = null) => (
  new Promise((resolve, reject) => {
    let url = null
    // validate data
    if (!file) {
      reject('Картиночку не забываем, пожалуйста')
      return
    }
    if (!type) {
      reject('А что за вещичка? Тип подскажи')
      return
    }
    if (!name) name = file.name
    if (file.size > megabytes(12)) {
      reject('Мне бы файл поменьше, подавился я. Дай на 11 мегабайт хотя бы, а?')
      return
    }
    if (_fs) {
      _fs.root.getFile(name, {create: true, exclusive: false}, fileEntry => {
        // noinspection JSUnresolvedFunction
        fileEntry.createWriter(fileWriter => {
          fileWriter.onwriteend = () => {
            console.log('Write completed.')
            fileEntry.getMetadata(function (metadata) {
              console.log(metadata) // or do something more useful with it...
            })
            url = fileEntry.toURL()
            WARDROBE.push({
              fileURL: url,
              season: season,
              type: type
            })
            saveWD()
            resolve(url)
          }
          fileWriter.onerror = e => {
            reject('Что-то пошло совсем не по плану... ' + e.toString())
          }
          let fr = new FileReader()
          fr.onload = e => {
            resize(e.target.result).then(newblob => {
              console.dir(newblob)
              fileWriter.write(newblob)
            }).catch(reject)
          }
          fr.onerror = reject
          fr.readAsDataURL(file)
        })
      }, () => {
        reject('Рассеянный стал, файл потерял по пути. Повтори будь ласка!')
      })
    } else {
      fsStore.init().then(() => {
        fsStore.add(file, season, type, name)
      }, error => {
        reject(error)
      })
    }
  })
)
