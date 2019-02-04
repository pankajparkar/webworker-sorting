var terminate = self.terminate,
  collection,
  totalTimeTaken = 0,
  startIndex = 0;
self.test = false

function insertionSort(collection, startIndex = 0) {
  for (var i = startIndex; i < collection.length; i++) {
    let currentValue = collection[i]
    for (var j = i - 1; j > -1 && collection[j] > currentValue; j--) {
      collection[j + 1] = collection[j]
    }
    collection[j + 1] = currentValue
    if (self.pause) {
      startIndex = ++i
      console.log('Paused', i)
      break
    }
  }
  console.log(i)
  return startIndex
}

function gernerateRandomNumber(count) {
  var result = []
  for (var i = 0; i < count; i++) {
    // TODO: generate whole number instead
    result.push(Math.random())
  }
  return result
}

self.addEventListener('message', function ({ data: { trigger } }) {
  switch (trigger) {
    case 'SORT':
      var t0 = performance.now();
      collection = gernerateRandomNumber(100000)
      insertionSort(collection, startIndex)
      var t1 = performance.now()
      totalTimeTaken += t1 - t0
      self.postMessage({ trigger: 'SORTED', values: result })
      break
    case 'INTERVAL':
      console.log('inreval fired', startIndex)
      self.postMessage({ trigger: 'INTERVAL', values: [] })
      break
    default:
      break;
  }
}, false);