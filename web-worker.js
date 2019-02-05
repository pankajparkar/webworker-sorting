self._state = {}
function insertionSort(state) {
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
  state.startIndex = i
}

function setState(state) {
  self._state = state
}

function applySort(state) {
  var t0 = performance.now();
  insertionSort(state)
  var t1 = performance.now()
  state.totalTimeTaken += t1 - t0
}

function addLogAndContinueSorting (state) {
  self.postMessage({ trigger: 'LOGS', state: state })
  self.postMessage({ trigger: 'SORTING', state: state })
}

function calculateStartAndEndIndex (state) {
  state.startIndex = state.endIndex
  var futureEndIndex = state.endIndex + 500
  state.endIndex = futureEndIndex <= state.collection.length ? futureEndIndex : state.collection.length
  return state
}

function performSort (state) {
  var sort = setInterval(function () {
    if (!state.pause) {
      applySort(state)
      calculateStartAndEndIndex(state)
    } else {
      // Calculate range in intial period
      clearInterval(sort)
      addLogAndContinueSorting(state)
    }
  }, 5)
}

self.addEventListener('message', function ({ data: { state, trigger, value } }) {
  switch (trigger) {
    case 'SET_STATE':
      setState(state)
      break
    // For first sort, `SORT` event will get fired
    case 'SORT':
      performSort(self._state)
      break
    case 'SORTING':
      if (self._state.collection.length > self._state.startIndex + 1) {
        self._state.pause = false
        performSort(self._state)
      } else {
        self.postMessage({ trigger: 'LOGS', state: self._state })
        self.postMessage({ trigger: 'SORTED', state: self._state })
      }
      break
    case 'INTERVAL':
      self._state.pause = true
      self._state.collection.push(value)
      break
  }
}, false);