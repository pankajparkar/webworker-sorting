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
  state.startIndex = i++
}

function setState(state) {
  self._state = state
}

function applySort(state) {
  var t0 = performance.now();
  insertionSort(state)
  var t1 = performance.now()
  self._state.totalTimeTaken += t1 - t0
}

function calculateStartAndEndIndex(state) {
  state.startIndex = state.endIndex
  var futureEndIndex = state.endIndex + 100
  state.endIndex = futureEndIndex <= state.collection.length ? futureEndIndex : state.collection.length
  return state
}

function sorting(state) {
  var sort = setInterval(function () {
    if (state.collection.length > state.startIndex + 1) {
      state.pause = false
      if (! state.pause) {
        applySort(state)
        calculateStartAndEndIndex(state)
      } else {
        clearInterval(sort)
        sorting(state)
      }
    } else {
      clearInterval(sort)
      self.postMessage({ trigger: 'SORTED', message: `Time taken to complete sorting is ${state.totalTimeTaken} ms`, state })
    }
  }, 2)
}

self.addEventListener('message', function ({ data: { state, trigger, value } }) {
  switch (trigger) {
    case 'SET_STATE':
      setState(state)
      break
    case 'SORT':
      sorting(self._state)
      break
    case 'INTERVAL':
      self._state.pause = true
      self._state.collection.push(value)
      self.postMessage({ trigger: 'MESSAGE_PROCESSED', state: state, value: value })
      break
  }
}, false);