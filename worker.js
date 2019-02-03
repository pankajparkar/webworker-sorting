
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

self.addEventListener('message', function ({ data: { type } }) {
  switch (type) {
    case 'SORT':
      // Make function call
      var t0 = performance.now();
      var collection = gernerateRandomNumber(100000)
      var result = insertionSort(collection)
      var t1 = performance.now();
      console.log(result, t1 - t0)
      self.postMessage({type: 'SORTED', values: result})
      break
    default:
      break;
  }
}, false);