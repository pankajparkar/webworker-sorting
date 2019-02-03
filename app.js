var worker = new Worker('worker.js');

worker.addEventListener('message', function({ data: {type, values}}) {
  switch (type) {
    case 'SORTED':
      var sortButton = document.getElementById('sort-click')
      var intervalInput = document.getElementById('interval')
      intervalInput.disabled = false
      sortButton.disabled = false
      break;
    default:
      break;
  }
}, false);

function createIntervalInstance (fn, timer) {
  return setInterval(fn, timer)
}

window.onload = function () {
  var sortButton = document.getElementById('sort-click'),
    intervalInput = document.getElementById('interval'),
    intervalCall;
  sortButton.addEventListener('click', function sortClick() {
    worker.postMessage({type: 'SORT'});
    intervalInput.disabled = true
    sortButton.disabled = true
    intervalCall = createIntervalInstance(() => {
      // TODO: send value to webworker
      // get out put back and print it on screen
    }, 500)
  })
  intervalInput.addEventListener('keyup', function intervalKeyup({target: {value}}) {
    sortButton.disabled = !value
  })
}

