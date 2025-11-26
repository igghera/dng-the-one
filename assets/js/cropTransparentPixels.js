export function cropTransparentPixels(canvas, options = {}, download = true) {
  const {
    padding = 10,
    inset = 0,
    filename = 'cropped-image.png'
  } = options

  const ctx = canvas.getContext('2d')

  // Calculate the scan area with inset
  const scanLeft = inset
  const scanTop = inset
  const scanRight = canvas.width - inset
  const scanBottom = canvas.height - inset
  const scanWidth = scanRight - scanLeft
  const scanHeight = scanBottom - scanTop

  const imageData = ctx.getImageData(scanLeft, scanTop, scanWidth, scanHeight)
  const pixels = imageData.data

  let minX = scanWidth
  let minY = scanHeight
  let maxX = 0
  let maxY = 0

  // Find the bounding box of non-transparent pixels within scan area
  for (let y = 0; y < scanHeight; y++) {
    for (let x = 0; x < scanWidth; x++) {
      const index = (y * scanWidth + x) * 4
      const alpha = pixels[index + 3]

      if (alpha > 0) {  // Non-transparent pixel
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }
  }

  // Adjust coordinates back to original canvas space
  minX += scanLeft
  minY += scanTop
  maxX += scanLeft
  maxY += scanTop

  // Add padding
  minX = Math.max(0, minX - padding)
  minY = Math.max(0, minY - padding)
  maxX = Math.min(canvas.width - 1, maxX + padding)
  maxY = Math.min(canvas.height - 1, maxY + padding)

  // Create cropped canvas
  const croppedWidth = maxX - minX + 1
  const croppedHeight = maxY - minY + 1
  const croppedCanvas = document.createElement('canvas')
  croppedCanvas.width = croppedWidth
  croppedCanvas.height = croppedHeight

  const croppedCtx = croppedCanvas.getContext('2d')
  croppedCtx.drawImage(
    canvas,
    minX, minY, croppedWidth, croppedHeight,
    0, 0, croppedWidth, croppedHeight
  )

  if (download) {
    // Download the image
    croppedCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()

      // Clean up
      URL.revokeObjectURL(url)
    }, 'image/png')
  } else {
    // Return a Promise that resolves with the blob
    return new Promise((resolve) => {
      croppedCanvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/png')
    })
  }
}
