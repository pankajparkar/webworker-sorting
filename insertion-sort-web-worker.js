function insertionSort (state) {
  var collection = state.collection,
    startIndex = state.startIndex
  outerloop: for (var i = startIndex; i < collection.length; i++) {
    var currentValue = collection[i]
    for (var j = i - 1; j > -1 && collection[j] > currentValue; j--) {
      collection[j + 1] = collection[j]
    }
    collection[j + 1] = currentValue
    if (state.pause) {
      break outerloop
    }
  }
  state.startIndex = ++i
}

function applySort(state) {
  var t0 = performance.now();
  insertionSort(state)
  var t1 = performance.now()
  state.totalTimeTaken += t1 - t0
  self.postMessage({trigger: 'UI', state: state})
}

self.addEventListener('message', function ({ data: {state, trigger} }) {
  switch (trigger) {
    case 'SORTING':
      applySort(state)
      while (state.collection.length >= state.startIndex) {
        state.pause = false
        applySort(state)
      }
      console.log('Completed')
      break
    default:
      break;
  }
}, false);