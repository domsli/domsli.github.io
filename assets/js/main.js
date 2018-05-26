var typeToCommandPrompt = function(commandPromptElem, text) {
  var commandElem = commandPromptElem.children(".command").first();
  var cursor = commandPromptElem.find("#cursor");
  commandElem.empty();
  numChars = 3;
  progress = 0;
  var timeout = 30;
  var helper = function() {
    var stopPoint = Math.min(text.length, progress + numChars);
    for (var i = progress; i < stopPoint; i++) {
      commandElem.html(commandElem.html() + text[i])
      progress++;
    }
    if (progress != text.length) {
      setTimeout(helper, timeout)
    }
    else {
      cursor.addClass("blinking");
    }
  };
  setTimeout(helper, timeout);
};