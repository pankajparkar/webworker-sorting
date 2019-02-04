var sharedWebWorker = new Worker('shared-web-worker.js');

function createIntervalInstance (fn, timer) {
  return setInterval(fn, timer)
}

window.onload = function () {
  var sortButton = document.getElementById('sort-click'),
    intervalInput = document.getElementById('interval'),
    intervalCall;
debugger
  sortButton.addEventListener('click', function sortClick() {
    worker.postMessage({trigger: 'SORT'});
    intervalInput.disabled = true
    sortButton.disabled = true
    intervalCall = createIntervalInstance(() => {
      // TODO: send value to webworker
      var randomNumber = Math.random()
      worker.pause = true
      worker.postMessage({trigger: 'INTERVAL', values: randomNumber})
      // worker.terminate();
    }, 500)
  })

  intervalInput.addEventListener('keyup', function intervalKeyup({target: {value}}) {
    sortButton.disabled = !value
  })

  worker.addEventListener('message', function({ data: {trigger, values}}) {
    switch (trigger) {
      case 'SORTED':
        var sortButton = document.getElementById('sort-click')
        var intervalInput = document.getElementById('interval')
        intervalInput.disabled = false
        sortButton.disabled = false
        clearInterval(intervalCall)
        intervalCall = null
        break;
      default:
        break;
    }
  }, false);
}

