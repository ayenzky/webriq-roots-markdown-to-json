
var fs, path, yamlFront, md, util, moment, readDir;

fs        = require('fs');
path      = require('path');
yamlFront = require('yaml-front-matter');
md = require("node-markdown").Markdown;
util    = require ("util");
moment  = require ("moment");
readDir = require('readdir');

module.exports = function(opts) {
  var WebriqRootsExtension, folder, jsonoutput;
  opts || (opts = {});
  folder = opts.folder || ['posts/**.md'];
  jsonoutput = opts.jsonoutput || "data";
  helperName = opts.name || folder;

  return WebriqRootsExtension = (function() {

    function WebriqRootsExtension() {

        var result, roots, pages, filesArray, ctr, files, _url, output, buff;

        buf = new Buffer(1024);

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

          // console.log(_url);

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

        roots.stat(jsonoutput + '/tipuesearch_content.json', function(err, stat){
          if (err == null){
            roots.open(jsonoutput + '/tipuesearch_content.json', 'r+', function(err, fd){
              if (err){
                return roots.callError('Error Openning File', err);
              }
              roots.read(fd, buf, 0, buf.length, 0, function(err, bytes){
                if (err){
                  return roots.callError('Error Reading', err);
                }
                else{
                  roots.writeFile(jsonoutput + '/tipuesearch_content.json', JSON.stringify(result), 'utf8', roots.callback);
                }

              }) // end roots.read
            })

          }
          else if(err.code == 'ENOENT') {
            roots.writeFile(jsonoutput + '/tipuesearch_content.json', JSON.stringify(result), 'utf8', roots.callback);
          }

          else {
            return roots.callError('Some other error: ', err.code);
          }


        }) // end fs stat



    }

    WebriqRootsExtension.prototype.open = function(path, flags, callback) {
      fs.open(path, flags, callback)
    }

    WebriqRootsExtension.prototype.read = function(fd, buffer, offset, length, position, callback) {
      fs.read(fd, buffer, offset, length, position, callback)
    }

    WebriqRootsExtension.prototype.stat = function(file, callback) {
      fs.stat(file, callback);
    };

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
