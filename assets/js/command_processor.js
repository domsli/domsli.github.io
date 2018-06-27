var command_ls = function(arguments, flags) {
  var relativePath = (arguments.length > 0) ? arguments[0] : ".";
  relativePath = relativePath.replace(/\/+$/, "");
  var splitPath = relativePath.split(/\/+/);
  var fns = DIRECTORY_TREE.listFiles(splitPath);
  if (fns) {
    return fns.join("<br>");
  }
  else {
    return relativePath + ": Not a directory"
  }
};

var command_cd = function(arguments, flags) {
  var relativePath = arguments[0];
  relativePath = relativePath.replace(/\/+$/, "");
  var splitPath = relativePath.split(/\/+/);
  var success = DIRECTORY_TREE.changeDirectory(splitPath);
  if (success) {
    return "";
  }
  else {
    return relativePath + ": Not a directory"
  }
};

var command_whoami = function(arguments, flags) {
  return "visitor";
};

var command_greeting = function(arguments, flags) {
  return "Hi there! I'm Denis. Welcome to my personal website.";
};

var loadingAboutMe = false;

var command_aboutme = function(arguments, flags) {
  if ($("#aboutme").length) {
    return "About Me is already open.";
  }
  // Make sure to disallow the user from loading the projects at the same time
  if (loadingAboutMe) {
    return "Currently loading the About Me...";
  }
  loadingAboutMe = true;
  $.ajax({
    type: 'GET',
    url: 'assets/res/aboutme_partial.html',
    dataType: 'text',
    success: function(text) {
      // clean up existing opened viewer
      if ($(".selected-link").length) {
        closeViewerOnlyWithoutResizingTerminal();
      }
      // create the viewer
      var aboutMeElem = $(text);
      aboutMeElem.attr("id", "aboutme");
      aboutMeElem.addClass("col-1-2 ui-view html-view");
      $(".grid").append(aboutMeElem);
      $("#terminal").addClass("col-1-2");
      // set the link as selected
      setLinkAsSelected($("#aboutme-link"));
      loadingAboutMe = false;
    },
  });
  return "";
};

var command_viewresume = function(arguments, flags) {
  if ($("#resume").length) {
    // resume already exists, so just return a response saying that it is open
    return "Resume is already open."
  }
  else {
    // clean up existing opened viewer
    if ($(".selected-link").length) {
      closeViewerOnlyWithoutResizingTerminal();
    }
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
    closeViewerOnlyWithoutResizingTerminal();
    $("#terminal").removeClass("col-1-2");
    return "";
  }
  else {
    return "There is no viewer to close.";
  }
}

var closeViewerOnlyWithoutResizingTerminal = function() {
  // close the viewer
  $(".ui-view").remove();
  // deselect the link if it exists
  if ($(".selected-link").length) {
    unsetSelected();
  }
  return "";
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
      // clean up existing opened viewer
      if ($(".selected-link").length) {
        closeViewerOnlyWithoutResizingTerminal();
      }
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

var command_contact = function(arguments, flags) {
  return "You can reach me via:" + "<br>" +
    "<a href='mailto:denisli268@gmail.com' target='_top'>&emsp;email</a>" + "<br>" +
    "<a href='https://github.com/domsli' target='_blank'>&emsp;github</a>"
};

var commandToResponse = {
  "ls": command_ls,
  "cd": command_cd,
  "whoami": command_whoami,
  "greeting": command_greeting,
  "aboutme": command_aboutme,
  "viewresume": command_viewresume,
  "viewprojects": command_viewprojects,
  "contact": command_contact,
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