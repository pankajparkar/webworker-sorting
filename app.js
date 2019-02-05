var sharedWebWorker = new Worker('web-worker.js?'+Date.now());
// var sortWebworker = new Worker('sort-web-worker.js?'+Date.now());

var intervalCall;
 
function gernerateRandomNumber(count) {
  var result = []
  for (var i = 0; i < count; i++) {
    // TODO: generate whole number instead
    result.push(Math.random())
  }
  return result
}

state = {
  startIndex: 0,
  endIndex: 1000,
  collection: gernerateRandomNumber(100000),
  totalTimeTaken: 0,
  range: 1000,
  pause: false
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
    status = document.getElementById('status')
  sortButton.addEventListener('click', function sortClick() {
    sharedWebWorker.postMessage({trigger: 'SET_STATE', state: state})
    sharedWebWorker.postMessage({trigger: 'SORT', state: state})
    intervalCall = createIntervalInstance(intervalInput.value)
    intervalInput.disabled = true
    sortButton.disabled = true
  })

  intervalInput.addEventListener('keyup', function intervalKeyup({target: {value}}) {
    sortButton.disabled = !value
  })

  function addLog (state) {
    var li = document.createElement('li')
    li.className = 'list-group-item'
    li.innerHTML = 'Till now only '+ state.startIndex + ' element has been started, and time taken '+ state.totalTimeTaken + 'ms'
    status.appendChild(li)
  }

  sharedWebWorker.addEventListener('message', function({ data: {trigger, state}}) {
    switch (trigger) {
      case 'SORTED':
        var sortButton = document.getElementById('sort-click')
        var intervalInput = document.getElementById('interval')
        intervalInput.disabled = false
        sortButton.disabled = false
        clearInterval(intervalCall)
        intervalCall = null
        alert('Sorting completed within '+ state.totalTimeTaken + ' ms')
        break;
      case 'LOGS':
        addLog(state)
        break;
      case 'SORTING':
        sharedWebWorker.postMessage({trigger: 'SORTING'})
        break;
    }
  }, false);
}

