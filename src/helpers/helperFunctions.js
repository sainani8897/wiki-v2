exports.pluck = (arr, key) => arr.map(i => i[key])

exports.convertToSlug = (slug) => slug.toLowerCase()
  .replace(/ /g, '-')
  .replace(/[^\w-]+/g, '')
