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
  setTimeout(() => self.postMessage({trigger: 'UI', state: state}), 16.66)
  //self.postMessage({trigger: 'UI', state: state})
}

self.addEventListener('message', function ({ data: {state, trigger, value} }) {
  switch (trigger) {
    case 'SORTING':
      if (state.collection.length > (state.startIndex - 1)) {
        console.log('SORTING_CALLED ', state.pause)
        state.pause = false
        setTimeout(_ => applySort(state), 100)
      } else {
        self.postMessage({trigger: 'SORTED'})
        console.log('Completed', state)
      }
      break
  }
}, false);