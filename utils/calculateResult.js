export function calculateResult(q1, q2, q3, allAuras, allProducts) {
  const productImagesPaths = new Map()
  productImagesPaths.set('FEMALE_EDP', '/images/products/FEMALE_EDP.webp')
  productImagesPaths.set('FEMALE_EDPI', '/images/products/FEMALE_EDPI.webp')
  productImagesPaths.set('FEMALE_GOLD_EDPI', '/images/products/FEMALE_GOLD_EDPI.webp')
  productImagesPaths.set('MALE_EDP', '/images/products/MALE_EDP.webp')
  productImagesPaths.set('MALE_EDT', '/images/products/MALE_EDT.webp')
  productImagesPaths.set('MALE_GOLD_EDPI', '/images/products/MALE_GOLD_EDPI.webp')
  productImagesPaths.set('MALE_PARFUM', '/images/products/MALE_PARFUM.webp')

  let result = new Map()

  if (q1 === 3 && q2 === 2 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', allAuras[0])
    result.set('product', allProducts[0])
  }

  if (q1 === 2 && q2 === 1 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDPI'))
    result.set('aura', allAuras[1])
    result.set('product', allProducts[1])
  }

  if (q1 === 1 && q2 === 3 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', allAuras[2])
    result.set('product', allProducts[0])
  }

  if (q1 === 0 && q2 === 0 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_GOLD_EDPI'))
    result.set('aura', allAuras[3])
    result.set('product', allProducts[2])
  }

  if (q1 === 3 && q2 === 2 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_EDP'))
    result.set('aura', allAuras[0])
    result.set('product', allProducts[3])
  }

  if (q1 === 2 && q2 === 1 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_PARFUM'))
    result.set('aura', allAuras[1])
    result.set('product', allProducts[6])
  }

  if (q1 === 1 && q2 === 3 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_EDT'))
    result.set('aura', allAuras[2])
    result.set('product', allProducts[4])
  }

  if (q1 === 0 && q2 === 0 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_GOLD_EDPI'))
    result.set('aura', allAuras[3])
    result.set('product', allProducts[5])
  }

  return {
    q1,
    q2,
    q3,
    result,
  }
}
