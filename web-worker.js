self._state = {}
function insertionSort (state) {
  var collection = state.collection,
    startIndex = state.startIndex,
    endIndex = state.endIndex
  outerloop: for (var i = startIndex; i < endIndex; i++) {
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

function setState (state) {
  self._state = state
}

function applySort(state) {
  var t0 = performance.now();
  insertionSort(state)
  var t1 = performance.now()
  state.totalTimeTaken += t1 - t0
  self.postMessage({trigger: 'UI', state: state})
  //self.postMessage({trigger: 'UI', state: state})
}

self.addEventListener('message', function ({ data: {state, trigger, value} }) {
  switch (trigger) {
    case 'SET_COLLECTION':
      setState(state)
      break
    case 'SORTING':
      if (self._state.collection.length > (self._state.startIndex - 1)) {
        self._state.pause = false
        var futureEndIndex = self._state.endIndex + 10000
        self._state.endIndex = futureEndIndex <= self._state.collection.length ? futureEndIndex: self._state.collection.length
        applySort(self._state)
      } else {
        self.postMessage({trigger: 'SORTED'})
        console.log('Completed', state)
      }
      break
    case 'INTERVAL':
      self._state.pause = true
      console.log(self._state)
      if(self._state.collection) self._state.collection.push(value)
      break
  }
}, false);