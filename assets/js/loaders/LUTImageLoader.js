import { LUTImageLoader as THREELUTImageLoader } from 'three/addons/loaders/LUTImageLoader'

export class LUTImageLoader {
  constructor(manager) {
    this.loader = new THREELUTImageLoader()
  }

  /**
   * Load a single texture or an array of textures.
   *
   * @param {String|String[]} resources Single URL or array of URLs of the texture(s) to load.
   * @returns CompressedTexture|CompressedTexture[]
   */
  async load(resources) {
    if (Array.isArray(resources)) {
      const promises = resources.map(url => this.#loadTexture(url))
      return await Promise.all(promises)
    } else {
      return await this.#loadTexture(resources)
    }
  }

  /**
   * Load a single texture.
   *
   * @param {String} url The URL of the texture to load
   * @returns Promise
   */
  #loadTexture(url) {
    return new Promise(resolve => {
      this.loader.load(url, texture => {
        resolve(texture)
      })
    })
  }
}
