/**
 * Handles snippets.
 */


var mongoose = require('mongoose');

/**
 * Mongoose schema for a snippet.
 * @type {mongoose.Schema}
 */
var snippetSchema = new mongoose.Schema({
  date:     {type: Date, default: Date.now},
  author:   String,
  title:    String,
  content:  String
});

// Create a reverse index on date so we can sort on it quicker
snippetSchema.index({date: -1});

// Create snippet object from schema
var Snippet = mongoose.model('Snippet', snippetSchema);

/**
 * Gets all snippets, sorted in reverse order by date, then renders the snippet
 * template, writing the snippets into the template.
 *
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 */
exports.getSnippets = function(req, res) {

  // Find all snippets, sorted desc by date. Return plain JSON objects (not
  // mongoose objects) by specifying lean(true). Return all fields but content.
  Snippet.find({}, 'date author title').sort({date: -1}).lean(true).exec(function(err, snippets) {
    if (err) {
      res.send(500, 'Database Error. Could not get snippets.');
      return;
    }

    res.render('index', {
      allSnippets: snippets
    });
  });
};

/**
 * Gets the content for a specific snippet and returns as JSON.
 * Expected to be called via AJAX request.
 *
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 */
exports.getSnippetContent = function(req, res) {
  // Make sure a snippet ID was provided
  if (!req.params.snippetId) {
    res.send(400, 'Missing snippet ID');
    return;
  }

  // Get the document for the single snippet
  Snippet.findById(req.params.snippetId, 'content').lean(true).exec(function(err, snippet) {
    if (err) {
      res.send(500, 'Database Error. Could not get snippet.');
      return;
    }

    res.set('Content-Type', 'text/json');
    res.json(snippet);
  });
};

/**
 * Saves a new snippet. Expected to be called via AJAX request.
 *
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 */
exports.saveSnippet = function(req, res) {

  console.log("saveSnippet called");

  if (req.body._id) {
    var snippet = new Snippet(req.body);
    
    Snippet.modify({_id: req.body._id}, {
      '$set': {
        title:    req.body.title,
        author:   req.body.author,
        content:  req.body.content
      }
    }, function(err) {

      res.set('Content-Type', 'text/json');
      res.json({_id: req.body._id, modified: true});
    });

  } else {

    var snippet = new Snippet(req.body);

    snippet.save(function(err) {
      if (err) {
        res.send(500, 'Database Error. Could not save snippet.');
        return;
      }

      res.set('Content-Type', 'text/json');
      res.json(snippet);
    });
  }
};

