$(document).ready(function() {
  terminalElem = $("#terminal");

  currentCommandPromptElem = createCommandPromptElem("visitor@domsli.github.io:~$");
  terminalElem.append(currentCommandPromptElem);

  // Show the introduction
  var index = 0;
  var showIntro = function() {
    command = introSequenceCommands[index];
    doAutomaticCommandSequence(command,
      function() {
        index++;
        if (index != introSequenceCommands.length) {
          // still doing the intro
          currentCursorElem.remove();
          setTimeout(showIntro, 500);
        }
        else {
          // post-intro handling
          currentCursorElem.remove();
          setAsUserEditableCommandPrompt();

          terminalElem.click(function() {
            var commandElem = currentCommandPromptElem.children(".command").first();
            commandElem.focus();
          });
        }
      });
  }
  showIntro();
});

// Global variables
var terminalElem = null;
var currentCursorElem = null;
var currentCommandPromptElem = null;

var introSequenceCommands = [
  "whoami",
  "whatisthis",
  "whyisthissocool",
  "howcanibecool"
];

var processCommand = function(command, arguments, flags) {
  // get response from command 
  var response = getResponseFunction(command)();
  // create a response element
  var responseElem = createResponseElem(response);
  terminalElem.append(responseElem);
  // make the current command prompt no longer editable
  unsetAsUserEditableCommandPrompt();
  // create another prompt
  currentCommandPromptElem = createCommandPromptElem("visitor@domsli.github.io:~$");
  terminalElem.append(currentCommandPromptElem);
  // set it as editable
  setAsUserEditableCommandPrompt();
};

var doUserTriggeredAutomaticCommandSequence = function(command, arguments, flags) {
  var commandElem = currentCommandPromptElem.children(".command").first();
  commandElem.html(command);
  processCommand(command, arguments, flags);
};

var setAsUserEditableCommandPrompt = function() {
  var commandElem = currentCommandPromptElem.children(".command").first();
  commandElem.attr("contenteditable", "true");
  commandElem.on("paste", function() {
    // handle parsing the command(s) in case there are newlines
  });
  commandElem.on("keypress", function(e) {
    if ((e.keyCode == 10 || e.keyCode == 13)) {
      e.preventDefault();
      processCommand(commandElem.html());
    }
  });
  commandElem.focus();
};

var unsetAsUserEditableCommandPrompt = function() {
  var commandElem = currentCommandPromptElem.children(".command").first();
  commandElem.removeAttr("contenteditable");
  commandElem.removeAttr("onpaste");
  commandElem.removeAttr("onkeypress")
  commandElem.focus();
};

var doAutomaticCommandSequence = function(command, callback) {
  var commandSequence = function() {
    typeToCommandPrompt(command,
      function() {
        // remove cursor
        currentCursorElem.remove();
        // get the response from the command
        var response = getResponseFunction(command)();
        // create a response element
        var responseElem = createResponseElem(response);
        terminalElem.append(responseElem);
        // create another prompt
        currentCommandPromptElem = createCommandPromptElem("visitor@domsli.github.io:~$");
        terminalElem.append(currentCommandPromptElem);
        // empty type another command
        typeToCommandPrompt("", function() {
          currentCursorElem.addClass("blinking");
          // callback
          callback();
        });
      });
  };
  commandSequence();
};

var createResponseElem = function(responseText) {
  return $("<div class='response'>" + responseText + "</div>")
};

var createCommandPromptElem = function(promptText) {
  var commandPromptElem = 
    $("<div class='command-prompt'>" +
        "<span class='prompt'>" + promptText + "</span>" +
        "<span class='command'></span>" +
      "</div>");
  return commandPromptElem;
};

var createCursorElem = function() {
  return $("<span id=\"cursor\">&boxv;</span>");
};

var typeToCommandPrompt = function(text, callback=noop) {
  var commandElem = currentCommandPromptElem.children(".command").first();
  currentCursorElem = createCursorElem();
  currentCommandPromptElem.append(currentCursorElem);
  numChars = 1;
  progress = 0;
  var timeout = 20;
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
      callback();
    }
  };
  helper();
};

var noop = function() { }