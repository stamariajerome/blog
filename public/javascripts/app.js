(function() {
function expandMessage() {
  var expandedMessage = this.previousElementSibling;
  expandedMessage.style.display = 'block';
  var postMessage = expandedMessage.previousElementSibling;
  postMessage.style.display = 'none';
  this.style.display = 'none';
}

var postMessage = document.querySelectorAll('.message');
for(i = 0; i < postMessage.length; i++) {
  postMessage[i].textContent = postMessage[i].textContent.substring(0, 50);
}

var expandedMessage = document.querySelectorAll('.expanded-message');
for(i = 0; i < expandedMessage.length; i++) {
  expandedMessage[i].style.display = 'none';
}

var viewMoreButton = document.querySelectorAll('.view-more-link');
for(i = 0; i < viewMoreButton.length; i++) {
  viewMoreButton[i].addEventListener('click', expandMessage);
}

})();
