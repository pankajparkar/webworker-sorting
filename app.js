var sharedWebWorker = new Worker('shared-web-worker.js?'+Date.now());

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
  collection: gernerateRandomNumber(100000),
  totalTimeTaken: 0,
  pause: false
}

function createIntervalInstance (fn, timer) {
  return setInterval(fn, timer)
}

window.onload = function () {
  var sortButton = document.getElementById('sort-click'),
    intervalInput = document.getElementById('interval'),
    status = document.getElementById('status'),
    intervalCall;
  sortButton.addEventListener('click', function sortClick() {
    sharedWebWorker.postMessage({trigger: 'SET_COLLECTION', state: state})
    intervalCall = createIntervalInstance(() => {
      // TODO: send value to webworker
      var randomNumber = Math.random()
      sharedWebWorker.postMessage({trigger: 'INTERVAL', value: randomNumber});
    }, intervalInput.value)
    // setTimeout(() => sharedWebWorker.postMessage({trigger: 'SORTING', state: state}))
    sharedWebWorker.postMessage({trigger: 'SORTING', state: state})
    intervalInput.disabled = true
    sortButton.disabled = true
  })

  intervalInput.addEventListener('keyup', function intervalKeyup({target: {value}}) {
    sortButton.disabled = !value
  })

  sharedWebWorker.addEventListener('message', function({ data: {trigger, state}}) {
    switch (trigger) {
      case 'SORTED':
        var sortButton = document.getElementById('sort-click')
        var intervalInput = document.getElementById('interval')
        intervalInput.disabled = false
        sortButton.disabled = false
        clearInterval(intervalCall)
        intervalCall = null
        break;
      case 'UI':
        console.log('state on ui', state)
        var div = document.createElement('div')
        div.innerHTML = 'Till now only '+ state.startIndex + ' element has been started, and time taken '+ state.totalTimeTaken + 'ms'
        status.appendChild(div)
        break;
    }
  }, false);
}

