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
  if ($("#resume").length) {
    // resume already exists, so just return a response saying that it is open
    return "Resume is already open."
  }
  else {
    // load the PDF to HTML
    $(".grid").append(
      "<object id='resume' class='col-1-2 ui-view' data='https://upload.wikimedia.org/wikipedia/commons/c/cc/Resume.pdf' type='application/pdf' width='100%'' height='100%'>" +
        "<p>It appears you dont have a PDF plugin for this browser." +
        " No biggie... you can <a href='resume.pdf'>click here to" +
        "download the PDF file.</a></p>" +
      "</object>")
    $("#terminal").addClass("col-1-2");
    // Set the resume link as selected
    setLinkAsSelected($("#resume-link"));
    return "";
  }
};

var command_closeviewer = function(arguments, flags) {
  if ($(".ui-view").length) {
    // close the viewer
    $(".ui-view").remove();
    $("#terminal").removeClass("col-1-2");
    // deselect the link if it exists
    if ($(".selected-link").length) {
      unsetSelected();
    }
    return "";
  }
  else {
    return "There is no viewer to close.";
  }
}

var loadingProjects = false;

var command_viewprojects = function(arguments, flags) {
  if ($("#projects").length) {
    return "Projects is already open.";
  }
  // Make sure to disallow the user from loading the projects at the same time
  if (loadingProjects) {
    return "Currently loading the project...";
  }
  loadingProjects = true;
  $.ajax({
    type: 'GET',
    url: 'assets/res/projects_partial.html',
    dataType: 'text',
    success: function(text) {
      // create the viewer
      var projectsElem = $(text);
      projectsElem.attr("id", "projects");
      projectsElem.addClass("col-1-2 ui-view html-view");
      $(".grid").append(projectsElem);
      $("#terminal").addClass("col-1-2");
      // set the link as selected
      setLinkAsSelected($("#projects-link"));
      loadingProjects = false;
    },
  });
  return "";
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
  "closeviewer": command_closeviewer,
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

var setLinkAsSelected = function(linkElem) {
  linkElem.addClass("selected-link");
  var closeButtonHtmlString = "<img class='close-button' src='assets/res/close_symbol.png' style='position:absolute; top: 5px; right: 5px; height:20px;'/>";
  linkElem.html(linkElem.html() + closeButtonHtmlString);
};

var unsetSelected = function() {
  $(".selected-link img").remove();
  $(".selected-link").removeClass("selected-link");
};