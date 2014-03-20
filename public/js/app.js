
var Controllers = (function(Controllers, allSnippets) {

  "use strict";

  /**
   * Controller for snippets list.
   */
  Controllers.Snippets = function($scope, $http) {
    // Bring the blog snippets into the scope of this controller
    $scope.snippets = allSnippets;

    /**
     * Shows the snippet at the given index by redirecting the user.
     * @param {Number} idx
     */
    $scope.showSnippet = function(snippet) {

      // If the snippet is showing, hide it. Else, if we already
      // have the snippet content, just show it
      if (snippet.show) {
        snippet.show = false;
        return;
      } else if (snippet.content) {
        snippet.show = true;
        return;
      }

      // Asynchronously get the snippet content and display it
      $http.get('/snippet/' + snippet._id).success(function(p) {
        snippet.content = p.content;
        snippet.show = true;
      });
    };
  };
  Controllers.Snippets.$inject = ['$scope','$http'];

  /**
   * Controller for snippets list.
   */
  Controllers.NewSnippet = function($scope, $http) {

    /**
     * Submits the new snippet.
     */
    $scope.submit = function(idx) {
      if (!$scope.title) {
        alert('Missing Title');
        return;
      }

      if (!$scope.author) {
        alert('Missing Author');
        return;
      }

      if (!$scope.content) {
        alert('Missing Content');
        return;
      }

      var snippet = {
        title:    $scope.title,
        author:   $scope.author,
        content:  $scope.content
      };

      // Asynchronously get the snippet content and display it
      $http.post('/snippet/save', snippet).success(function(p) {
        console.log("success in saving snippet");
        // Add new snippet to list
        allSnippets.unshift(p);

        // Reset form
        $scope.title = '';
        $scope.author = '';
        $scope.content = '';
      });
    };
  };
  Controllers.NewSnippet.$inject = ['$scope','$http'];

  return Controllers;

})(Controllers || {}, allSnippets);
