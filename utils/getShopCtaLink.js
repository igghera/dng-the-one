const links = new Map()

links.set('MALE_EDP', {
  notino: {
    italy: 'https://www.notino.it/dolce-gabbana/the-one-for-men-eau-de-parfum-eau-de-parfum-per-uomo/p-7114437',
    uk: 'https://www.notino.co.uk/dolce-gabbana/the-one-for-men-eau-de-parfum-eau-de-parfum-for-men/p-7114437'
  }
})

links.set('MALE_GOLD_EDPI', {
  notino: {
    italy: 'https://www.notino.it/dolcegabbana/the-one-pour-homme-gold-eau-de-parfum-per-uomo/p-6924202',
    uk: 'https://www.notino.co.uk/dolcegabbana/the-one-pour-homme-gold-eau-de-parfum-for-men/p-6924202'
  }
})

links.set('MALE_EDT', {
  notino: {
    italy: 'https://www.notino.it/dolce-gabbana/the-one-for-men-eau-de-toilette-per-uomo/p-3060',
    uk: 'https://www.notino.co.uk/dolce-gabbana/the-one-for-men-eau-de-toilette-for-men/p-3060'
  }
})

links.set('MALE_PARFUM', {
  notino: {
    italy: 'https://www.notino.it/dolce-gabbana/the-one-for-men-parfum-profumo-per-uomo/p-7114434',
    uk: 'https://www.notino.co.uk/dolce-gabbana/the-one-for-men-parfum-perfume-for-men/p-7114434'
  }
})

links.set('FEMALE_EDPI', {
  notino: {
    italy: 'https://www.notino.it/dolce-gabbana/the-one-eau-de-parfum-intense-eau-de-parfum-intense-da-donna/p-7114440',
    uk: 'https://www.notino.co.uk/dolce-gabbana/the-one-eau-de-parfum-intense-intense-eau-de-parfum-for-women/p-7114440'
  }
})

links.set('FEMALE_GOLD_EDPI', {
  notino: {
    italy: 'https://www.notino.it/dolcegabbana/the-one-gold-intense-eau-de-parfum-da-donna/p-6924478',
    uk: 'https://www.notino.co.uk/dolcegabbana/the-one-gold-intense-eau-de-parfum-for-women/p-6924478'
  }
})

links.set('FEMALE_EDP', {
  notino: {
    italy: 'https://www.notino.it/dolce-gabbana/the-one-eau-de-parfum-per-donna/p-3070',
    uk: 'https://www.notino.co.uk/dolce-gabbana/the-one-eau-de-parfum-for-women/p-3070'
  }
})

export function getShopCtaLink(productId, ref, country = 'italy') {
  if (!!!productId) return '#'
  if (!!!ref) return '#'

  console.log(`getShopCtaLink(productId: ${productId}, ref: ${ref}, country: ${country})`)
  // console.log(links.get(productId)[ref][country])

  return links.get(productId)[ref][country]
}
