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
  state.startIndex = ++i
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

self.addEventListener('message', function ({ data: { state, trigger, value } }) {
  switch (trigger) {
    case 'SET_STATE':
      setState(state)
      break
    // For first sort, `SORT` event will get fired
    case 'SORT':
      var firstSortEvent = setInterval(function () {
        if (!self._state.pause) {
          applySort(self._state)
          var futureEndIndex = self._state.endIndex + 1000
          self._state.endIndex = futureEndIndex
        } else {
          // Calculate range in intial period
          self._state.range = self._state.startIndex - 1
          clearInterval(firstSortEvent)
          addLogAndContinueSorting(self._state)
        }
      }, 100)
      break
    case 'SORTING':
      if (self._state.collection.length > (self._state.startIndex - 1)) {
        self._state.pause = false
        var futureEndIndex = self._state.endIndex + self._state.range
        self._state.endIndex = futureEndIndex <= self._state.collection.length ? futureEndIndex : self._state.collection.length
        applySort(self._state)
        addLogAndContinueSorting(self._state)
      } else {
        self.postMessage({ trigger: 'LOGS', state: self._state })
        self.postMessage({ trigger: 'SORTED' })
        console.log('Completed', state)
      }
      break
    case 'INTERVAL':
      self._state.pause = true
      console.log(self._state)
      if (self._state.collection) self._state.collection.push(value)
      break
  }
}, false);