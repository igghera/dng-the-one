export function calculateResult(q1, q2, q3, auras, products, aurasFull) {
  const productImagesPaths = new Map()
  productImagesPaths.set('FEMALE_EDP', '/images/products/FEMALE_EDP.webp')
  productImagesPaths.set('FEMALE_EDPI', '/images/products/FEMALE_EDPI.webp')
  productImagesPaths.set('FEMALE_GOLD_EDPI', '/images/products/FEMALE_GOLD_EDPI.webp')
  productImagesPaths.set('MALE_EDP', '/images/products/MALE_EDP.webp')
  productImagesPaths.set('MALE_EDT', '/images/products/MALE_EDT.webp')
  productImagesPaths.set('MALE_GOLD_EDPI', '/images/products/MALE_GOLD_EDPI.webp')
  productImagesPaths.set('MALE_PARFUM', '/images/products/MALE_PARFUM.webp')

  let result = new Map()

  // Fallback product - Men
  if (q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_GOLD_EDPI'))
    result.set('aura', auras[3])
    result.set('auraFull', aurasFull[3])
    result.set('product', products[5])
    result.set('shape', 'male')
  }

  // Fallback product - Women
  if (q3 === 1 || q3 === 2) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_GOLD_EDPI'))
    result.set('aura', auras[3])
    result.set('auraFull', aurasFull[3])
    result.set('product', products[2])
    result.set('shape', 'female')
  }

  if (q1 === 3 && q2 === 2 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[0])
    result.set('auraFull', aurasFull[0])
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  if (q1 === 2 && q2 === 1 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDPI'))
    result.set('aura', auras[1])
    result.set('auraFull', aurasFull[1])
    result.set('product', products[1])
    result.set('shape', 'female')
  }

  if (q1 === 1 && q2 === 3 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[2])
    result.set('auraFull', aurasFull[2])
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  if (q1 === 0 && q2 === 0 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_GOLD_EDPI'))
    result.set('aura', auras[3])
    result.set('auraFull', aurasFull[3])
    result.set('product', products[2])
    result.set('shape', 'female')
  }

  if (q1 === 3 && q2 === 2 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_EDP'))
    result.set('aura', auras[0])
    result.set('auraFull', aurasFull[0])
    result.set('product', products[3])
    result.set('shape', 'male')
  }

  if (q1 === 2 && q2 === 1 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_PARFUM'))
    result.set('aura', auras[1])
    result.set('auraFull', aurasFull[1])
    result.set('product', products[6])
    result.set('shape', 'male')
  }

  if (q1 === 1 && q2 === 3 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_EDT'))
    result.set('aura', auras[2])
    result.set('auraFull', aurasFull[2])
    result.set('product', products[4])
    result.set('shape', 'male')
  }

  if (q1 === 0 && q2 === 0 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_GOLD_EDPI'))
    result.set('aura', auras[3])
    result.set('auraFull', aurasFull[3])
    result.set('product', products[5])
    result.set('shape', 'male')
  }

  const response = {
    q1,
    q2,
    q3,
    result,
  }

  console.log(response)

  return response
}
