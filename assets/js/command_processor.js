var command_whoami = function(arguments, flags) {
  return "Hi there. My name is Denis. I am actually a really cool person. And I made this website, which is really cool";
};

var command_whatisthis = function(arguments, flags) {
  return "This is some site I made";
};

var command_whyisthissocool = function(arguments, flags) {
  return "Just because it is dude!";
};

var command_howcanibecool = function(arguments, flags) {
  return "I don't know, just be a cooler guy"
};

var commandToResponse = {
  "whoami": command_whoami,
  "whatisthis": command_whatisthis,
  "whyisthissocool": command_whyisthissocool,
  "howcanibecool": command_howcanibecool,
};

var getResponseFunction = function(command) {
  if (command in commandToResponse) {
    return commandToResponse[command];
  }
  else {
    return function() {
      return "No command '" + command + "' found."
    };
  }
};