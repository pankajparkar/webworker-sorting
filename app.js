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

window.onload = function () {
  var sortButton = document.getElementById('sort-click')
  var intervalInput = document.getElementById('interval')
  sortButton.addEventListener('click', function sortClick() {
    worker.postMessage({type: 'SORT'});
    intervalInput.disabled = true
    sortButton.disabled = true
  })
  intervalInput.addEventListener('keyup', function intervalKeyup({target: {value}}) {
    sortButton.disabled = !value
  })
}

