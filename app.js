var sharedWebWorker = new Worker('web-worker.js?' + Date.now());

var intervalCall, sortedCollection, intervalDictionary = {};

function gernerateRandomNumber(count) {
  var result = []
  for (var i = 0; i < count; i++) {
    result.push(Math.random())
  }
  return result
}

state = {
  startIndex: 0,
  endIndex: 500,
  collection: gernerateRandomNumber(100000),
  totalTimeTaken: 0
}

function createIntervalInstance(timer) {
  return setInterval(() => {
    var randomNumber = Math.random()
    sharedWebWorker.postMessage({ trigger: 'INTERVAL', value: randomNumber });
    intervalDictionary[randomNumber] = { starTime: performance.now() }
  }, timer)
}

function sortClick() {
  sharedWebWorker.postMessage({ trigger: 'SET_STATE', state: state })
  sharedWebWorker.postMessage({ trigger: 'SORT', state: state })
  intervalCall = createIntervalInstance(intervalInput.value)
  stopTimerButton.disabled = false
  intervalInput.disabled = true
  sortButton.disabled = true
}

window.onload = function () {
  var sortButton = document.getElementById('sort-click'),
    intervalInput = document.getElementById('interval'),
    stopTimerButton = document.getElementById('stop-timer'),
    status = document.getElementById('status')
  sortButton.addEventListener('click', sortClick)

  function stopTimer () {
    if (intervalCall) {
      clearInterval(intervalCall)
      intervalCall = null
      stopTimerButton.disabled = true
      state.pause = false
    }
  } 

  stopTimerButton.addEventListener('click', stopTimer)

  intervalInput.addEventListener('keyup', function intervalKeyup({ target: { value } }) {
    sortButton.disabled = !value
  })

  function addLog(message, className) {
    var li = document.createElement('li')
    li.className = (className || 'list-group-item') + ' ' + 'highlight'
    li.innerHTML = message
    status.appendChild(li)
    status.scrollTop = status.scrollHeight;
  }

  sharedWebWorker.addEventListener('message', function ({ data: { trigger, message, state, value } }) {
    switch (trigger) {
      case 'SORTED':
        var sortButton = document.getElementById('sort-click')
        var intervalInput = document.getElementById('interval')
        intervalInput.disabled = false
        sortButton.disabled = false
        stopTimer();
        window.sortedCollection = state.collection
        addLog(message, 'alert alert-success')
        break;
      case 'MESSAGE_PROCESSED':
        var message = `Time taken to process message ${performance.now() - intervalDictionary[value].starTime} ms`
        addLog(message)
        break;
      case 'LOGS':
        addLog(message)
        break;
    }
  }, false);
}

