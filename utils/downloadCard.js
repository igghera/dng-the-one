import snapdom from '@zumer/snapdom'
import { gsap } from 'gsap'

export async function downloadCard(source, bg, data) {
  if (!['download', 'engagement', 'experience'].includes(source)) return console.error('Invalid source')
  if (Number(bg) < 0 || Number(bg) > 3) return console.error('Invalid background:', bg)

  const gender = data.get('shape')

  const cardPath = `/images/download-cards/${source}/0${bg + 1}_${gender}.webp`

  const image = new Image()
  image.addEventListener('load', async () => {
    const html = createHTML(image, data)
    document.body.appendChild(html)

    const target = document.getElementById('download-card-holder')

    await gsap.delayedCall(0.5, () => {})

    const snap = await snapdom(target)

    await snap.download({
      fast: false,
      format: 'png',
      filename: `the-one-card-${Date.now()}`,
      scale: 1,
    })

    target.remove()
  }, { once: true })

  image.src = cardPath
}

function createHTML(image, data) {
  const { naturalWidth: width, naturalHeight: height } = image
  const fragment = document.createDocumentFragment()

  // Create the main wrapper
  const holder = document.createElement('div')
  holder.style.setProperty('--width', `${width}px`)
  holder.style.setProperty('--height', `${height}px`)
  holder.className = 'download-card-holder'
  holder.setAttribute('id', 'download-card-holder')

  image.className = 'bg'
  holder.appendChild(image)

  const content = document.createElement('div')
  content.className = 'content'
  holder.appendChild(content)

  const preTitle = document.createElement('span')
  preTitle.className = 'pre-title'
  preTitle.textContent = data.get('pre-title')
  content.appendChild(preTitle)

  const title = document.createElement('span')
  title.className = 'title | golden-text'
  Object.assign(title.style, {
    animationPlayState: 'paused',
  })
  title.textContent = data.get('auraFull').title
  content.appendChild(title)

  const copy = document.createElement('span')
  copy.className = 'copy | text-gold-light'
  copy.textContent = data.get('auraFull')[data.get('shape')].desc
  content.appendChild(copy)

  const subContent = document.createElement('div')
  subContent.className = 'sub-content'
  holder.appendChild(subContent)

  const subContentTitle = document.createElement('span')
  subContentTitle.className = 'sub-content-title'
  subContentTitle.textContent = data.get('sub-content-title')
  subContent.appendChild(subContentTitle)

  const subContentCopy = document.createElement('span')
  subContentCopy.className = 'sub-content-copy'
  subContent.appendChild(subContentCopy)

  const subContentCopy01 = document.createElement('span')
  subContentCopy01.className = 'golden-text'
  subContentCopy01.textContent = data.get('auraFull')[data.get('shape')].fragrance.title
  subContentCopy.appendChild(subContentCopy01)

  const subContentCopy02 = document.createElement('span')
  subContentCopy02.textContent = data.get('auraFull')[data.get('shape')].fragrance.sub_title
  subContentCopy.appendChild(subContentCopy02)

  const picture = document.createElement('picture')
  picture.className = 'sub-content-image'
  subContent.appendChild(picture)

  const img = document.createElement('img')
  img.alt = data.get('auraFull')[data.get('shape')].fragrance.title
  img.src = data.get('imageSrc')
  picture.appendChild(img)

  fragment.appendChild(holder)

  return fragment
}
