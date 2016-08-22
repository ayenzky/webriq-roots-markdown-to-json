
var fs, path, yamlFront, md, Finder, readdir, util, moment, readdirp, readDir;

fs        = require('fs');
path      = require('path');
yamlFront = require('yaml-front-matter');
md = require("node-markdown").Markdown;
util    = require ("util");
moment  = require ("moment");
readDir = require('readdir');

module.exports = function(opts) {
  var WebriqRootsExtension, folder;
  opts || (opts = {});
  folder = opts.folder || ['posts/**.md'];
  helperName = opts.name || folder;

  return WebriqRootsExtension = (function() {

    function WebriqRootsExtension() {

        var result, roots, pages, filesArray, ctr, files, _url, output;

        roots = this;

        result = {};

        pages = [];

        this.callback = function(err){
          if (err){
            return roots.callError(err)
          }
        }

        filesArray = roots.readDir('./', folder);


        ctr = filesArray.length;

        for(var i = 0;  i < ctr; i++){

          files = filesArray[i];

          _url = files.replace(/\.[^\.]+$/, '.html');

          console.log(_url);

          output = yamlFront.loadFront(filesArray[i]);

          this.items = function(title, shortdesc, tags, url){
            this.title = title;
            this.text  = shortdesc;
            this.tags   = tags;
            this.url   = url;

          }

          var itemObject = new this.items (output.title, output.shortdesc, output.categories, _url);

          pages.push(itemObject)

          result.pages = pages;

        } // end of for loop

        roots.writeFile('data/tipuesearch_content.json', JSON.stringify(result), 'utf8', roots.callback);

    }

    WebriqRootsExtension.prototype.readDir = function(path, filter){
      return readDir.readSync(path, filter);
    };

    WebriqRootsExtension.prototype.callError = function(element) {
      return console.log('Error has been found', element);
    };


    WebriqRootsExtension.prototype.writeFile = function(file, data, option, callback){
      return fs.writeFile(file, data, 'utf8', this.callback);

    };

    return WebriqRootsExtension;

  })();
};
