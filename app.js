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

function gernerateRandomNumber(count) {
  var result = []
  for (var i = 0; i < count; i++) {
    // TODO: generate whole number instead
    result.push(Math.random())
  }
  return result
}

window.onload = function () {
  var sortButton = document.getElementById('sort-click')
  sortButton.addEventListener('click', function sortClick(event) {
    var t0 = performance.now();
    var collection = gernerateRandomNumber(100000)
    var result = insertionSort(collection)
    var t1 = performance.now();
    document.write('result ' + t0 + '--' + t1)
  })
}
