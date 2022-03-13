var Tree = function(root) {
  var self = this;

  this.root = root;
  this.currentNode = root;

  /**
   * Returns the name of the current directory.
   */
  this.currentDirectory = function() {
    var name = "";
    var parts = [];
    var currentTraversalNode = self.currentNode;
    while (currentTraversalNode) {
      parts.push(currentTraversalNode.name);
      currentTraversalNode = currentTraversalNode.parent;
    }
    parts = parts.reverse();
    return parts.join("/");
  };

  /**
   * Changes the current node of the tree. Returns whether or not
   * the change was successful. Changing back to the same directory
   * counts as a success.
   *
   * @param path a list of directory names
   */
  this.changeDirectory = function(path) {
    var savedCurrentNode = self.currentNode;
    // keep going through the path to update the current node
    var i;
    for (i = 0; i < path.length; i++) {
      // handle ~ for when i = 0
      if (i == 0 && path[i] == "~") {
        self.currentNode = self.root;
        continue;
      }
      // handle .
      if (path[i] == ".") {
        continue;
      }
      // handle ..
      if (path[i] == "..") {
        // only change if parent exists
        if (self.currentNode.parent) {
          self.currentNode = self.currentNode.parent;
        }
        continue;
      }
      // find a matching child
      var found = false;
      for (var j = 0; j < self.currentNode.children.length; j++) {
        var child = self.currentNode.children[j];
        if (child.name == path[i] && !child.actualFile) {
          // set to current directory and continue outer loop
          self.currentNode = child;
          found = true;
          break;
        }
      }
      // if no match at this point, then we did not succeed at traversing the path
      if (!found) {
        self.currentNode = savedCurrentNode;
        return false;
      }
    }
    return true;
  };

  /**
   * List the files and directories a directory. Returns a list of
   * the names if successful, otherwise null
   *
   * @param path a list of node names
   */
  this.listFiles = function(path) {
    var savedCurrentNode = self.currentNode;
    var isDirectory = self.changeDirectory(path);
    if (isDirectory) {
      var fileNames = self.currentNode.children.map(child => child.name);
      var isDirectoryList = self.currentNode.children.map(child => !child.actualFile);
      self.currentNode = savedCurrentNode;
      return [ fileNames, isDirectoryList ];
    }
    self.currentNode = savedCurrentNode;
    return null;
  };

  this.getFile = function(path) {
    var savedCurrentNode = self.currentNode;
    var isDirectory = self.changeDirectory(path.slice(0, path.length-1));
    if (isDirectory) {
      var fileName = path[path.length-1];
      for (var i = 0; i < self.currentNode.children.length; i++) {
        var child = self.currentNode.children[i];
        if (child.name == fileName && child.actualFile) {
          var fileData = {
            alias: path.join("/"),
            actualFile: child.actualFile,
            htmlID: child.htmlID,
            linkID: child.linkID,
          };
          self.currentNode = savedCurrentNode;
          return fileData;
        }
      }
    }
    self.currentNode = savedCurrentNode;
    return null;
  };

  return this;
};

var TreeNode = function(name, actualFile=null, htmlID=null, linkID=null) {
  var self = this;

  this.parent = null;
  this.name = name;
  this.actualFile = actualFile;
  this.htmlID = htmlID; // only used to ID the html when opening the file
  this.linkID = linkID; // only used to get the ID of the corresponding link, if it exists
  this.children = [];

  this.addChild = function(node) {
    if (self.actualFile) {
      return; // should not be able to add a child to a file node
    }
    node.parent = self;
    self.children.push(node);
  };
};

// hard-code this tree (cause we don't have a real file system anyway)

// first level
var root = new TreeNode("~");
DIRECTORY_TREE = new Tree(root);

// second level
var projectsDir = new TreeNode("projects");
var aboutMeFile = new TreeNode("aboutme.html", "assets/res/aboutme_partial.html", "aboutme", "aboutme-link");
var projectsFile = new TreeNode("projects.html", "assets/res/projects_partial.html", "projects", "projects-link");

root.addChild(projectsDir);
root.addChild(aboutMeFile);
root.addChild(projectsFile);

// third level
var starlogoFile = new TreeNode("starlogo.html", "assets/res/starlogo_partial.html", "starlogo");

projectsDir.addChild(starlogoFile);