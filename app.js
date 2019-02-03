var worker = new Worker('worker.js');

worker.addEventListener('message', function({ data: {type, values}}) {
  switch (type) {
    case 'SORTED':
      console.log(values)
      break;
    default:
      break;
  }
}, false);

window.onload = function () {
  var sortButton = document.getElementById('sort-click')
  sortButton.addEventListener('click', function sortClick(event) {
    worker.postMessage({type: 'SORT'});
  })
}
