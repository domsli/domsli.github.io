var typing = function(elem) {
  var text = elem.innerHTML;
  numChars = 3;
  progress = 0;
  elem.innerHTML = '';
  var timeout = 30;
  var helper = function() {
    var stopPoint = Math.min(text.length, progress + numChars);
    for (var i = progress; i < stopPoint; i++) {
      elem.innerHTML += text[i];
      progress++;
    }
    if (progress != text.length) {
      setTimeout(helper, timeout)
    }
  };
  setTimeout(helper, timeout);
};