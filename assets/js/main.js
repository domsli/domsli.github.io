$(document).ready(function() {
  terminalElem = $("#terminal");

  currentCommandPromptElem = createCommandPromptElem("visitor@domsli.github.io:~$");
  terminalElem.append(currentCommandPromptElem);

  // Show the introduction
  var index = 0;
  var showIntro = function() {
    command = introSequenceCommands[index];
    response = commandToResponse[command];
    var commandSequence = createCommandSequence(command, response,
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
          var commandElem = currentCommandPromptElem.children(".command").first();
          commandElem.attr("contenteditable", "true");
          commandElem.focus();

          terminalElem.click(function() {
            var commandElem = currentCommandPromptElem.children(".command").first();
            commandElem.focus();
          });
        }
      });
    commandSequence();
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

var commandToResponse = {
  "whoami": "Hi there. My name is Denis. I am actually a really cool person. And I made this website, which is really cool",
  "whatisthis": "This is some site I made",
  "whyisthissocool": "Just because it is dude!",
  "howcanibecool": "I don't know, just be a cooler guy",
};

var createCommandSequence = function(command, response, callback) {
  var commandSequence = function() {
    typeToCommandPrompt(command,
      function() {
        // remove cursor
        currentCursorElem.remove();
        // create response
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
  return commandSequence;
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