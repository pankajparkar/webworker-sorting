self._state = {}
function insertionSort (state) {
  var collection = state.collection,
    startIndex = state.startIndex
  outerloop: for (var i = startIndex; i < collection.length; i++) {
    var currentValue = collection[i]
    for (var j = i - 1; j > -1 && collection[j] > currentValue; j--) {
      collection[j + 1] = collection[j]
    }
    collection[j + 1] = currentValue
    if (self._state.pause) {
      break outerloop
    }
  }
  self._state.startIndex = ++i
}

function setState (state) {
  self._state = state
}

function applySort(state) {
  var t0 = performance.now();
  insertionSort(state)
  var t1 = performance.now()
  state.totalTimeTaken += t1 - t0
  // setTimeout(() => self.postMessage({trigger: 'UI', state: state}))
  self.postMessage({trigger: 'UI', state: state})
}

self.addEventListener('message', function ({ data: {state, trigger, value} }) {
  switch (trigger) {
    case 'SET_COLLECTION':
      setState(state)
      break
    case 'SORTING':
      // setTimeout(function () {
        applySort(self._state)
        while (state.collection.length >= self._state.startIndex) {
          self._state.pause = false
          applySort(self._state)
        }
        self.postMessage({trigger: 'SORTED'})
        console.log('Completed', state)
      // })
      break
    case 'INTERVAL':
      self._state.pause = true
      console.log(self._state)
      if(self._state.collection) self._state.collection.push(value)
      break
    default:
      break;
  }
}, false);