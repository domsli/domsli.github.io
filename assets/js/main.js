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
          finishedIntro = true;
        }
      });
  }
  showIntro();
});

// Global variables
var terminalElem = null;
var currentCursorElem = null;
var currentCommandPromptElem = null;
var finishedIntro = false;

var introSequenceCommands = [
  "greeting",
  "contact",
];

var processCommand = function(command, arguments, flags) {
  // get response from command 
  var response = getResponseFunction(command)(arguments, flags);
  // create a response element
  var responseElem = createResponseElem(response);
  terminalElem.append(responseElem);
  // make the current command prompt no longer editable
  unsetAsUserEditableCommandPrompt();
  // create another prompt
  var currentDir = DIRECTORY_TREE.currentDirectory() 
  currentCommandPromptElem = createCommandPromptElem("visitor@domsli.github.io:" + currentDir + "$");
  terminalElem.append(currentCommandPromptElem);
  // set it as editable
  setAsUserEditableCommandPrompt();
};

var clickLink = function(link_id, filePath) {
  var linkElem = $("#" + link_id);
  if (linkElem.hasClass("selected-link")) {
    doUserTriggeredAutomaticCommandSequence("closeviewer");
  }
  else {
    doUserTriggeredAutomaticCommandSequence("open", [filePath,]);
  }
};

var doUserTriggeredAutomaticCommandSequence = function(command, arguments, flags) {
  if (!finishedIntro) {
    // show popup warning to let the user know they cannot do anything
    var stopIntroElem = $("#stop-intro");
    stopIntroElem.show();
    setTimeout(function() {
      stopIntroElem.fadeOut("slow");
    }, 100);
    // do not let the user do anything if intro not finished
    return;
  }
  var commandElem = currentCommandPromptElem.children(".command").first();
  var argumentString = arguments ? " " + arguments.join(" ") : "";
  commandElem.html(command + argumentString);
  processCommand(command, arguments, flags);
};

var currentSavedCommand = null; // command saved when flipping through history
var commandHistoryIndex = -1; // index starts from the end of the history buffer (e.g. 0 means last element)
var commandHistory = [];
var consecutiveTabbedTimesWithMultipleSuggestions = 0;
var setAsUserEditableCommandPrompt = function() {
  var commandElem = currentCommandPromptElem.children(".command").first();
  commandElem.attr("contenteditable", "true");
  commandElem.attr("spellcheck", "false");
  commandElem.on("paste", function() {
    // handle parsing the command(s) in case there are newlines
  });
  commandElem.on("keypress", function(e) {
    if ((e.keyCode == 10 || e.keyCode == 13)) { // enter
      e.preventDefault();
      var fullCommand = commandElem.html();
      // update history
      commandHistory.push(fullCommand); // push the version with &nbsp; so we can just replace html
      commandHistoryIndex = -1;
      currentSavedCommand = null;
      // process the command
      fullCommand = fullCommand.replace(/&nbsp;/gi, " "); // replace since html() converts space to &nbsp sometimes
      fullCommand = $.trim(fullCommand);
      var args = fullCommand.split(/\s+/);
      var command = args[0];
      var arguments = args.slice(1);
      processCommand(command, arguments);
      // update tabbing info
      consecutiveTabbedTimesWithMultipleSuggestions = 0;
    }
  });
  commandElem.on("keydown", function(e) {
    if (e.keyCode == 9) { // tab
      e.preventDefault();
      var fullCommand = commandElem.html();
      fullCommand = fullCommand.replace(/&nbsp;/gi, " "); // replace since html() converts space to &nbsp sometimes
      // don't trim the spaces, we care about them here
      var suggestions = getAutocompleteSuggestions(fullCommand);
      // no suggestions means we should do nothing
      if (suggestions.length == 0) {
        consecutiveTabbedTimesWithMultipleSuggestions = 0;
      }
      // one suggestion means we should apply the suggestion
      else if (suggestions.length == 1) {
        consecutiveTabbedTimesWithMultipleSuggestions = 0;
        var suggestion = suggestions[0];
        var newFullCommand;
        // if the last character is a space, then we just append the suggestion on
        if (fullCommand[fullCommand.length-1] == " ") {
          newFullCommand = fullCommand + suggestion + "&nbsp";
        }
        // if the last character is not a space, then we replace it with the suggestion
        else {
          // get substring of full command without the last word
          var i;
          for (i = fullCommand.length-1; i >= 0; i--) {
            if (fullCommand[i] == " " || fullCommand[i] == "/") break;
          }
          newFullCommand = fullCommand.substring(0, i+1).replace(/ /gi, "&nbsp;") + suggestion + "&nbsp;";
        }
        // set the new command
        commandElem.html(newFullCommand);
        placeCaretAtEnd(commandElem[0]); // [0] to get HTML DOM element from JQuery Object
      }
      // many suggestions means that we should list them out
      else {
        consecutiveTabbedTimesWithMultipleSuggestions++;
        // only tabbed once
        if (consecutiveTabbedTimesWithMultipleSuggestions == 1) {
          // get the last word
          var lastWord = getLastWordInFullCommand(fullCommand);
          // update to largest prefix, if possible
          var largestPrefix = getLargestPrefix(suggestions);
          // no update if the prefix is the last word
          if (largestPrefix == lastWord) {
            // no-op
          }
          // there is an update if the prefix is not same as last word
          else {
            // update the command
            newFullCommand = fullCommand.substring(0, fullCommand.length - lastWord.length).replace(/ /gi, "&nbsp;") + largestPrefix;
            commandElem.html(newFullCommand);
            placeCaretAtEnd(commandElem[0]);
            // reset tabbed times
            consecutiveTabbedTimesWithMultipleSuggestions = 0;
          }
        }
        // more than once, so show suggestions
        else {
          // unset this command prompt as editable
          unsetAsUserEditableCommandPrompt();
          // create a response with the list of suggestions
          var suggestionsResp = suggestions.join("<br>");
          var responseElem = createResponseElem(suggestionsResp);
          terminalElem.append(responseElem);
          // create another prompt
          var currentDir = DIRECTORY_TREE.currentDirectory();
          currentCommandPromptElem = createCommandPromptElem("visitor@domsli.github.io:" + currentDir + "$");
          terminalElem.append(currentCommandPromptElem);
          // set it as editable
          var newCommandElem = currentCommandPromptElem.children(".command").first();
          fullCommand = fullCommand.replace(/ /gi, "&nbsp;"); // spaces are not shown in html, so we need to change it to nbsp;
          newCommandElem.html(fullCommand);
          setAsUserEditableCommandPrompt(); // this will also place the caret at the end
        }
      }
    }
    else if (e.keyCode == 38) { // up arrow
      e.preventDefault();
      if (commandHistoryIndex >= commandHistory.length - 1) {
        // no-op
      }
      else { // index is in a range where you can still fetch more history
        commandHistoryIndex++;
        if (commandHistoryIndex == 0) {
          currentSavedCommand = commandElem.html(); // directly save the html, so we don't need to process it later
        }
        updateCommandElemWithCommandAtHistoryIndex(commandElem);
      }
      consecutiveTabbedTimesWithMultipleSuggestions = 0;
    }
    else if (e.keyCode == 40) { // down arrow
      e.preventDefault();
      if (commandHistoryIndex < 0) {
        // no-op
      }
      else { // index is in a range where you can get more recent history
        commandHistoryIndex--;
        if (commandHistoryIndex == -1) {
          commandElem.html(currentSavedCommand);
          placeCaretAtEnd(commandElem[0]);
        }
        else {
          updateCommandElemWithCommandAtHistoryIndex(commandElem);
        }
      }
      consecutiveTabbedTimesWithMultipleSuggestions = 0;
    }
    else {
      consecutiveTabbedTimesWithMultipleSuggestions = 0;
    }
  });
  placeCaretAtEnd(commandElem[0]);
};

var updateCommandElemWithCommandAtHistoryIndex = function(commandElem) {
  var fullCommand = commandHistory[commandHistory.length-1-commandHistoryIndex];
  commandElem.html(fullCommand);
  placeCaretAtEnd(commandElem[0]);
};

var getLastWordInFullCommand = function(fullCommand) {
  var i;
  for (i = fullCommand.length-1; i >= 0; i--) {
    if (fullCommand[i] == " " || fullCommand[i] == "/") break;
  }
  return fullCommand.substring(i+1);
};

var getLargestPrefix = function(words) {
  var largestMatchIndex = -1;
  var index = 0;
  while (true) {
    var ch = words[0][index];
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (word.length <= i) {
        return word.substring(0, largestMatchIndex+1);
      }
      else {
        if (word[index] != ch) {
          return word.substring(0, largestMatchIndex+1);
        }
      }
    }
    largestMatchIndex = index;
    index++;
  }
  // should not get here
};

/* https://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser */
// Note that el should be an HTML DOM element, not a JQuery object
var placeCaretAtEnd = function(el) {
  el.focus();
  if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof document.body.createTextRange != "undefined") {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
}

var unsetAsUserEditableCommandPrompt = function() {
  var commandElem = currentCommandPromptElem.children(".command").first();
  commandElem.removeAttr("contenteditable");
  commandElem.removeAttr("spellcheck");
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