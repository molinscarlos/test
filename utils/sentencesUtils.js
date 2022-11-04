module.exports = {
  getCats(cats) {
    let catsArray = []
    const catKeys = Object.keys(cats)
    for (const key of catKeys) {
      if (cats[key] === 1) {
        catsArray.push(key)
      }
    }
  },
}
