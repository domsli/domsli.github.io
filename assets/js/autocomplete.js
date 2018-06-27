var getAutocompleteSuggestions = function(fullCommand) {
  var groups = fullCommand.split(/\s+/);
  for (var i = 0; i < groups.length; i++) {
    var s = groups[i];
    // we have found our first non-empty character
    if (s != "") {
      // it also is the last group, so we autocomplete with it as a command
      if (i == groups.length - 1) {
        var commands = Object.keys(commandToResponse);
        commands = commands.filter(function(command) {
          // keep those whose prefix is s
          return command.substring(0, s.length) == s;
        });
        return commands;
      }
      // it is not the last group, so we get the last group and autocomplete 
      // with it as a file/directory
      else {
        s = groups[groups.length - 1];
        var path = s.split(/\/+/);
        var last = path[path.length-1];
        // get the files/directories in the sub-path (path - 1)
        var subpath = path.slice(0, path.length-1)
        var fnsAndIsDirectoryList = DIRECTORY_TREE.listFiles(subpath);
        // if there are no files, then no suggestions
        if (!fnsAndIsDirectoryList) {
          return [];
        }
        // if there are files, then we filter for those with correct prefixes
        else {
          var fns = fnsAndIsDirectoryList[0];
          fns = fns.filter(function(fn) {
            return fn.substring(0, last.length) == last;
          });
          return fns;
        }
      }
    }
  }
  // did not find non-empty, so just return commands
  return Object.keys(commandToResponse);
};