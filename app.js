var sharedWebWorker = new Worker('web-worker.js?'+Date.now());

var intervalCall;
 
function gernerateRandomNumber(count) {
  var result = []
  for (var i = 0; i < count; i++) {
    result.push(Math.random())
  }
  return result
}

state = {
  startIndex: 0,
  endIndex: 1000,
  collection: gernerateRandomNumber(100000),
  totalTimeTaken: 0
}

function createIntervalInstance (timer) {
  return setInterval(() => {
    // TODO: send value to webworker
    var randomNumber = Math.random()
    sharedWebWorker.postMessage({trigger: 'INTERVAL', value: randomNumber});
  }, timer)
}

window.onload = function () {
  var sortButton = document.getElementById('sort-click'),
    intervalInput = document.getElementById('interval'),
    stopTimerButton = document.getElementById('stop-timer'),
    status = document.getElementById('status')
  sortButton.addEventListener('click', function sortClick() {
    sharedWebWorker.postMessage({trigger: 'SET_STATE', state: state})
    sharedWebWorker.postMessage({trigger: 'SORT', state: state})
    intervalCall = createIntervalInstance(intervalInput.value)
    stopTimerButton.disabled = false
    intervalInput.disabled = true
    sortButton.disabled = true
  })

  stopTimerButton.addEventListener('click', function () {
    if (intervalCall){
      clearInterval(intervalCall)
      intervalCall = null
      stopTimerButton.disabled = true
      state.pause = false
    }
  })

  intervalInput.addEventListener('keyup', function intervalKeyup({target: {value}}) {
    sortButton.disabled = !value
  })

  function addLog (message) {
    var li = document.createElement('li')
    li.className = 'list-group-item'
    li.innerHTML = message
    status.appendChild(li)
  }

  sharedWebWorker.addEventListener('message', function({ data: {trigger, message, state}}) {
    switch (trigger) {
      case 'SORTED':
        var sortButton = document.getElementById('sort-click')
        var intervalInput = document.getElementById('interval')
        intervalInput.disabled = false
        sortButton.disabled = false
        if (intervalCall){
          clearInterval(intervalCall)
          intervalCall = null
          stopTimerButton.disabled = true
        }
        addLog(message)
        break;
      case 'LOGS':
        addLog(message)
        break;
      // case 'SORTING':
      //   sharedWebWorker.postMessage({trigger: 'SORTING'})
      //   break;
    }
  }, false);
}

