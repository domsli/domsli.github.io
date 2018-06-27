var command_touch = function(arguments, flags) {
  return "Permission denied: no write access.";
};

var command_mkdir = function(arguments, flags) {
  return "Permission denied: no write access.";
};

var command_clear = function(arguments, flags) {
  $("#terminal").empty();
  return "";
};

var command_ls = function(arguments, flags) {
  var relativePath = (arguments.length > 0) ? arguments[0] : ".";
  relativePath = relativePath.replace(/\/+$/, "");
  var splitPath = relativePath.split(/\/+/);
  var fnsAndIsDirectoryList = DIRECTORY_TREE.listFiles(splitPath);
  var fns = fnsAndIsDirectoryList[0];
  var isDirectoryList = fnsAndIsDirectoryList[1];
  if (fns) {
    var resp = "";
    for (var i = 0; i < fns.length; i++) {
      if (i != 0) {
        resp += "<br>";
      }
      var isDirectory = isDirectoryList[i];
      var fn = fns[i];
      if (isDirectory) {
        resp += "<span style='color:#00FFFF;font-weight:bold;'>" + fn + "/" + "</span>"
      }
      else {
        resp += "<span style=';'>" + fn + "</span>";
      }
    }
    return resp;
  }
  else {
    return relativePath + ": Not a directory"
  }
};

var command_cd = function(arguments, flags) {
  if (arguments.length == 0) {
    return "";
  }
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

var command_open = function(arguments, flags) {
  var relativePath = arguments[0];
  relativePath = relativePath.replace(/\/+$/, "");
  var splitPath = relativePath.split(/\/+/);
  var fileData = DIRECTORY_TREE.getFile(splitPath);
  if (!fileData) {
    return "Could not open file: " + relativePath;
  }
  var alias = fileData.alias; // should really be the same as relativePath
  if (alias.length > 4 && alias.substring(alias.length-4) == ".pdf") {
    return openPDF(fileData);
  }
  else if (alias.length > 5 && alias.substring(alias.length-5) == ".html") {
    return openHTML(fileData);
  }
  return "Could not open file: " + alias;
};

var loadingTextFile = false;

var openHTML = function(fileData) {
  if ($("#" + fileData.htmlID).length) {
    // already open, so just return a response saying that
    return fileData.alias + " is already open.";
  }
  else {
    // clean up the existing open viewer
    if ($(".ui-view").length) {
      closeViewerOnlyWithoutResizingTerminal();
    }
    // Make sure to disallow the user from loading the projects at the same time
    if (loadingTextFile) {
      return "Currently loading a file already...";
    }
    loadingTextFile = true;
    $.ajax({
      type: 'GET',
      url: fileData.actualFile,
      dataType: 'text',
      success: function(text) {
        // clean up existing opened viewer
        if ($(".ui-view").length) {
          closeViewerOnlyWithoutResizingTerminal();
        }
        // create the viewer
        var htmlElem = $(text);
        htmlElem.attr("id", fileData.htmlID);
        htmlElem.addClass("col-1-2 ui-view html-view");
        $(".grid").append(htmlElem);
        $("#terminal").addClass("col-1-2");
        // set the link as selected
        setLinkAsSelected($("#" + fileData.linkID));
        loadingTextFile = false;
      },
      error: function(err) {
        loadingTextFile = false;
      }
    });
    return "";
  }
};

var openPDF = function(fileData) {
  if ($("#" + fileData.htmlID).length) {
    // already open, so just return a response saying that
    return fileData.alias + " is already open.";
  }
  else {
    // clean up the existing open viewer
    if ($(".ui-view").length) {
      closeViewerOnlyWithoutResizingTerminal();
    }
    // load the PDF to HTML
    $(".grid").append(
      "<object id='" + fileData.htmlID + "' class='col-1-2 ui-view' data='" + 
        fileData.actualFile + "' type='application/pdf' width='100%'' height='100%'>" +
        "<p>It appears you dont have a PDF plugin for this browser." +
        " No biggie... you can <a href='resume.pdf'>click here to" +
        "download the PDF file.</a></p>" +
      "</object>")
    // shrink the terminal
    $("#terminal").addClass("col-1-2");
    // Set the link as selected if it exists
    if (fileData.linkID) {
      setLinkAsSelected($("#" + fileData.linkID));
    }
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

var command_contact = function(arguments, flags) {
  return "You can reach me via:" + "<br>" +
    "<a href='mailto:denisli268@gmail.com' target='_top'>&emsp;email</a>" + "<br>" +
    "<a href='https://github.com/domsli' target='_blank'>&emsp;github</a>"
};

var commandToResponse = {
  "touch": command_touch,
  "mkdir": command_mkdir,
  "open": command_open,
  "clear": command_clear,
  "ls": command_ls,
  "cd": command_cd,
  "whoami": command_whoami,
  "greeting": command_greeting,
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