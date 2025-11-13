export function downloadImage(url, name = 'image.png') {
	const a = document.createElement('a')
	a.href = url
	a.download = name
	a.click()

  a.remove()
}
