//
// Auras
//
// 0 - Elegant
// 1 - Warm
// 2 - Discrete
// 3 - Bold

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
    result.set('aura', auras[3]) // Bold
    result.set('auraFull', aurasFull[3]) // Bold
    result.set('product', products[5])
    result.set('shape', 'male')
  }

  // Fallback product - Women
  if (q3 === 1 || q3 === 2) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_GOLD_EDPI'))
    result.set('aura', auras[3]) // Bold
    result.set('auraFull', aurasFull[3]) // Bold
    result.set('product', products[2])
    result.set('shape', 'female')
  }

  // The One EDP - Women
  if (q1 === 0 && q2 === 2 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[0]) // Elegant
    result.set('auraFull', aurasFull[0]) // Elegant
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  // The One EDPI - Women
  if (q1 === 3 && q2 === 1 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDPI'))
    result.set('aura', auras[1]) // Warm
    result.set('auraFull', aurasFull[1]) // Warm
    result.set('product', products[1])
    result.set('shape', 'female')
  }

  // The One GOLD EDP - Women
  if (q1 === 2 && q2 === 3 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[2]) // Discrete
    result.set('auraFull', aurasFull[2]) // Discrete
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  // The One GOLD EDPI - Women
  if (q1 === 1 && q2 === 0 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_GOLD_EDPI'))
    result.set('aura', auras[3]) // Bold
    result.set('auraFull', aurasFull[3]) // Bold
    result.set('product', products[2])
    result.set('shape', 'female')
  }

  // The One EDP - Men
  if (q1 === 0 && q2 === 2 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_EDP'))
    result.set('aura', auras[0]) // Elegant
    result.set('auraFull', aurasFull[0]) // Elegant
    result.set('product', products[3])
    result.set('shape', 'male')
  }

  // The One PARFUM - Men
  if (q1 === 3 && q2 === 1 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_PARFUM'))
    result.set('aura', auras[1]) // Warm
    result.set('auraFull', aurasFull[1]) // Warm
    result.set('product', products[6])
    result.set('shape', 'male')
  }

  // The One EDT - Men
  if (q1 === 2 && q2 === 3 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_EDT'))
    result.set('aura', auras[2]) // Discrete
    result.set('auraFull', aurasFull[2]) // Discrete
    result.set('product', products[4])
    result.set('shape', 'male')
  }

  // The One GOLD EDPI - Men
  if (q1 === 1 && q2 === 0 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_GOLD_EDPI'))
    result.set('aura', auras[3]) // Bold
    result.set('auraFull', aurasFull[3]) // Bold
    result.set('product', products[5])
    result.set('shape', 'male')
  }

  // ===== MISSING CONDITIONS START (EQUALLY DISTRIBUTED) =====
  // Original conditions already cover specific combinations
  // Distributing remaining combinations equally across all products/auras
  // Note: q2 has 3 possible values (0, 1, 2), but original code uses q2 === 3 which we keep as-is

  // === WOMEN PRODUCTS - Remaining combinations (excluding already covered) ===

  // The One EDP - Women (Elegant) - Additional combinations
  if (q1 === 0 && q2 === 0 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[0]) // Elegant
    result.set('auraFull', aurasFull[0]) // Elegant
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  if (q1 === 0 && q2 === 1 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[0]) // Elegant
    result.set('auraFull', aurasFull[0]) // Elegant
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  if (q1 === 1 && q2 === 1 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[0]) // Elegant
    result.set('auraFull', aurasFull[0]) // Elegant
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  if (q1 === 1 && q2 === 2 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[0]) // Elegant
    result.set('auraFull', aurasFull[0]) // Elegant
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  if (q1 === 2 && q2 === 0 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[0]) // Elegant
    result.set('auraFull', aurasFull[0]) // Elegant
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  if (q1 === 2 && q2 === 1 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[0]) // Elegant
    result.set('auraFull', aurasFull[0]) // Elegant
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  // The One EDPI - Women (Warm) - Additional combinations
  if (q1 === 2 && q2 === 2 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDPI'))
    result.set('aura', auras[1]) // Warm
    result.set('auraFull', aurasFull[1]) // Warm
    result.set('product', products[1])
    result.set('shape', 'female')
  }

  if (q1 === 3 && q2 === 0 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDPI'))
    result.set('aura', auras[1]) // Warm
    result.set('auraFull', aurasFull[1]) // Warm
    result.set('product', products[1])
    result.set('shape', 'female')
  }

  if (q1 === 3 && q2 === 2 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDPI'))
    result.set('aura', auras[1]) // Warm
    result.set('auraFull', aurasFull[1]) // Warm
    result.set('product', products[1])
    result.set('shape', 'female')
  }

  if (q1 === 0 && q2 === 0 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDPI'))
    result.set('aura', auras[1]) // Warm
    result.set('auraFull', aurasFull[1]) // Warm
    result.set('product', products[1])
    result.set('shape', 'female')
  }

  if (q1 === 0 && q2 === 1 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDPI'))
    result.set('aura', auras[1]) // Warm
    result.set('auraFull', aurasFull[1]) // Warm
    result.set('product', products[1])
    result.set('shape', 'female')
  }

  if (q1 === 1 && q2 === 0 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDPI'))
    result.set('aura', auras[1]) // Warm
    result.set('auraFull', aurasFull[1]) // Warm
    result.set('product', products[1])
    result.set('shape', 'female')
  }

  // The One EDP - Women (Discrete) - Additional combinations
  if (q1 === 0 && q2 === 1 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[2]) // Discrete
    result.set('auraFull', aurasFull[2]) // Discrete
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  if (q1 === 1 && q2 === 1 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[2]) // Discrete
    result.set('auraFull', aurasFull[2]) // Discrete
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  if (q1 === 1 && q2 === 2 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[2]) // Discrete
    result.set('auraFull', aurasFull[2]) // Discrete
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  if (q1 === 2 && q2 === 0 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[2]) // Discrete
    result.set('auraFull', aurasFull[2]) // Discrete
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  if (q1 === 2 && q2 === 1 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[2]) // Discrete
    result.set('auraFull', aurasFull[2]) // Discrete
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  if (q1 === 2 && q2 === 2 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_EDP'))
    result.set('aura', auras[2]) // Discrete
    result.set('auraFull', aurasFull[2]) // Discrete
    result.set('product', products[0])
    result.set('shape', 'female')
  }

  // The One GOLD EDPI - Women (Bold) - Additional combinations
  if (q1 === 0 && q2 === 1 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_GOLD_EDPI'))
    result.set('aura', auras[3]) // Bold
    result.set('auraFull', aurasFull[3]) // Bold
    result.set('product', products[2])
    result.set('shape', 'female')
  }

  if (q1 === 1 && q2 === 1 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_GOLD_EDPI'))
    result.set('aura', auras[3]) // Bold
    result.set('auraFull', aurasFull[3]) // Bold
    result.set('product', products[2])
    result.set('shape', 'female')
  }

  if (q1 === 1 && q2 === 2 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_GOLD_EDPI'))
    result.set('aura', auras[3]) // Bold
    result.set('auraFull', aurasFull[3]) // Bold
    result.set('product', products[2])
    result.set('shape', 'female')
  }

  if (q1 === 2 && q2 === 0 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_GOLD_EDPI'))
    result.set('aura', auras[3]) // Bold
    result.set('auraFull', aurasFull[3]) // Bold
    result.set('product', products[2])
    result.set('shape', 'female')
  }

  if (q1 === 3 && q2 === 0 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_GOLD_EDPI'))
    result.set('aura', auras[3]) // Bold
    result.set('auraFull', aurasFull[3]) // Bold
    result.set('product', products[2])
    result.set('shape', 'female')
  }

  if (q1 === 3 && q2 === 2 && (q3 === 1 || q3 === 2)) {
    result.set('imageSrc', productImagesPaths.get('FEMALE_GOLD_EDPI'))
    result.set('aura', auras[3]) // Bold
    result.set('auraFull', aurasFull[3]) // Bold
    result.set('product', products[2])
    result.set('shape', 'female')
  }

  // === MEN PRODUCTS - Remaining combinations ===

  // The One EDP - Men (Elegant) - Additional combinations
  if (q1 === 0 && q2 === 0 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_EDP'))
    result.set('aura', auras[0]) // Elegant
    result.set('auraFull', aurasFull[0]) // Elegant
    result.set('product', products[3])
    result.set('shape', 'male')
  }

  if (q1 === 0 && q2 === 1 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_EDP'))
    result.set('aura', auras[0]) // Elegant
    result.set('auraFull', aurasFull[0]) // Elegant
    result.set('product', products[3])
    result.set('shape', 'male')
  }

  // The One PARFUM - Men (Warm) - Additional combinations
  if (q1 === 1 && q2 === 1 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_PARFUM'))
    result.set('aura', auras[1]) // Warm
    result.set('auraFull', aurasFull[1]) // Warm
    result.set('product', products[6])
    result.set('shape', 'male')
  }

  if (q1 === 1 && q2 === 2 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_PARFUM'))
    result.set('aura', auras[1]) // Warm
    result.set('auraFull', aurasFull[1]) // Warm
    result.set('product', products[6])
    result.set('shape', 'male')
  }

  // The One EDT - Men (Discrete) - Additional combinations
  if (q1 === 2 && q2 === 0 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_EDT'))
    result.set('aura', auras[2]) // Discrete
    result.set('auraFull', aurasFull[2]) // Discrete
    result.set('product', products[4])
    result.set('shape', 'male')
  }

  if (q1 === 2 && q2 === 1 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_EDT'))
    result.set('aura', auras[2]) // Discrete
    result.set('auraFull', aurasFull[2]) // Discrete
    result.set('product', products[4])
    result.set('shape', 'male')
  }

  if (q1 === 2 && q2 === 2 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_EDT'))
    result.set('aura', auras[2]) // Discrete
    result.set('auraFull', aurasFull[2]) // Discrete
    result.set('product', products[4])
    result.set('shape', 'male')
  }

  // The One GOLD EDPI - Men (Bold) - Additional combinations
  if (q1 === 3 && q2 === 0 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_GOLD_EDPI'))
    result.set('aura', auras[3]) // Bold
    result.set('auraFull', aurasFull[3]) // Bold
    result.set('product', products[5])
    result.set('shape', 'male')
  }

  if (q1 === 3 && q2 === 1 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_GOLD_EDPI'))
    result.set('aura', auras[3]) // Bold
    result.set('auraFull', aurasFull[3]) // Bold
    result.set('product', products[5])
    result.set('shape', 'male')
  }

  if (q1 === 3 && q2 === 2 && q3 === 0) {
    result.set('imageSrc', productImagesPaths.get('MALE_GOLD_EDPI'))
    result.set('aura', auras[3]) // Bold
    result.set('auraFull', aurasFull[3]) // Bold
    result.set('product', products[5])
    result.set('shape', 'male')
  }

  // ===== MISSING CONDITIONS END =====

  const response = {
    q1,
    q2,
    q3,
    result,
  }

  console.log(response)

  return response
}
