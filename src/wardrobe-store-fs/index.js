import {Promise} from 'es6-promise'
import pica from './pica'
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
  new Promise((resolve, reject) => {
    let MAX_HEIGHT = 500
    const image = new Image()
    image.src = src
    let canvas = document.createElement('canvas')
    image.onload = () => {
      if (image.height > MAX_HEIGHT) {
        image.width *= MAX_HEIGHT / image.height
        image.height = MAX_HEIGHT
      }
      canvas.width = image.width
      canvas.height = image.height
      pica.resizeCanvas(image, canvas, {
        quality: 2,
        alpha: true,
        unsharpAmount: 50,
        unsharpRadius: 0.51,
        unsharpThreshold: 75,
        transferable: true
      }, err => {
        if (err) {
          console.log(err)
          reject(err)
          return
        }
        canvas.toBlob(blob => {
          resolve(blob)
        }, 'image/jpeg', 0.90)
      })
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
  return WARDROBE.slice(0)
}

fsStore.delete = (uid) => (
  new Promise((resolve, reject) => {
    if (_fs) {
      _fs.root.getFile(uid, {create: false}, fileEntry => {
        fileEntry.remove(() => {
          let found = false
          for (let i = 0; i < WARDROBE.length; ++i) {
            if (WARDROBE[i].uid === uid) {
              console.log(WARDROBE[i].uid, uid)
              WARDROBE.splice(i, 1)
              found = true
              saveWD()
              resolve(fsStore.getAllItems())
            }
          }
          if (!found) reject(new Error('Нарушена целостность данных!'))
          console.log('File removed.')
        }, error => {
          reject(new Error('Не получилось удалить фотографию...' + error.message))
        })
      }, () => {
        reject(new Error('Рассеянный стал, файл потерял по пути. Повтори будь ласка!'))
      })
    } else {
      fsStore.init().then(() => {
        fsStore.delete(uid)
      }, error => {
        reject(new Error('Попробуй еще раз, но в Google Chrome' + error.message))
      })
    }
  })
)

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
      reject(new Error('Картиночку не забываем, пожалуйста'))
      return
    }
    if (!type) {
      reject(new Error('А что за вещичка? Пальтишко али сапожки?'))
      return
    }
    if (!name) name = file.name
    if (file.size > megabytes(12)) {
      reject(new Error('Мне бы файл поменьше, поперхнулся я. Дай на 11 мегабайт хотя бы, а?'))
      return
    }
    // Проверка на уникальность
    for (let i = 0; i < WARDROBE.length; ++i) {
      console.log(WARDROBE[i].uid)
      if (WARDROBE[i].uid === file.name) {
        reject(new Error('Такая вещичка уже есть!'))
        return
      }
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
              uid: name,
              fileURL: url,
              season: season,
              type: type
            })
            saveWD()
            resolve(url)
          }
          fileWriter.onerror = e => {
            reject(new Error('Что-то пошло совсем не по плану... ' + e.toString()))
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
        reject(new Error('Рассеянный стал, файл потерял по пути. Повтори будь ласка!'))
      })
    } else {
      fsStore.init().then(() => {
        fsStore.add(file, season, type, name)
      }, error => {
        reject(new Error('Попробуй еще раз, но в Google Chrome. ' + error.toString()))
      })
    }
  })
)
