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
  return "I don't know, just be a cooler guy";
};

var command_aboutme = function(arguments, flags) {
  return "[...some stuff about me...]";
};

var command_viewresume = function(arguments, flags) {
  // load the PDF to HTML
  $(".grid").append(
    "<object class='col-1-2' data='https://upload.wikimedia.org/wikipedia/commons/c/cc/Resume.pdf' type='application/pdf' width='100%'' height='100%'>" +
      "<p>It appears you dont have a PDF plugin for this browser." +
      " No biggie... you can <a href='resume.pdf'>click here to" +
      "download the PDF file.</a></p>" +
    "</object>")
  $("#terminal").addClass("col-1-2");
  return "";
};

var command_viewprojects = function(arguments, flags) {
  return "[...display some projects...]";
};

var command_contacthost = function(arguments, flags) {
  return "School: denisli@mit.edu<br>Personal: denisli268@gmail.com";
};

var commandToResponse = {
  "whoami": command_whoami,
  "whatisthis": command_whatisthis,
  "whyisthissocool": command_whyisthissocool,
  "howcanibecool": command_howcanibecool,
  "aboutme": command_aboutme,
  "viewresume": command_viewresume,
  "viewprojects": command_viewprojects,
  "contacthost": command_contacthost,
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