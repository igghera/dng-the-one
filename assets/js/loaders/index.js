import { LoadingManager } from 'three/webgpu'
import { KTXLoader } from './KTXLoader'
import { TextureLoader } from './TextureLoader'

/**
 * Loading manager
 */
const manager = new LoadingManager()

manager.onProgress = (url, loaded, total) => {
  // In case the progress count is not correct, see this:
  // https://discourse.threejs.org/t/gltf-file-loaded-twice-when-loading-is-initiated-in-loadingmanager-inside-onprogress-callback/27799/2
  console.log(`Loaded ${loaded} resources out of ${total} -> ${url}`)
}

/**
 * Texture Loader
 */
export const textureLoader = new TextureLoader(manager)

/**
 * KTX Loader
 */
export const ktxLoader = new KTXLoader(manager)
