function insertionSort(collection, startIndex) {
  for (var i = startIndex; i < collection.length; i++) {
    let currentValue = collection[i]
    for (var j = i - 1; j > -1 && collection[j] > currentValue; j--) {
      collection[j + 1] = collection[j]
    }
    collection[j + 1] = currentValue
  }
  return collection
}