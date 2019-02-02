function insertionSort(collection) {
  for (var i = 0; i < collection.length; i++) {
    let currentValue = collection[i]
    for (var j = i - 1; j > -1 && collection[j] > currentValue; j--) {
      collection[j + 1] = collection[j]
    }
    collection[j + 1] = currentValue
  }
  return collection
}

window.onload = function () {
  var sortButton = document.getElementById('sort-click')
  sortButton.addEventListener('click', function sortClick(event) {
    var result = insertionSort([1, 2, 3, 4, 5, 6])
    document.write('result ' + result)
  })
}
