
var fs, path, yamlFront, md, util, moment, readDir, sortBy;

fs        = require('fs');
path      = require('path');
yamlFront = require('yaml-front-matter');
md = require("node-markdown").Markdown;
util    = require ("util");
moment  = require ("moment");
readDir = require('readdir');
sortBy = require('sort-by');

module.exports = function(opts) {
  var WebriqRootsExtension, folder, jsonoutput;
  opts || (opts = {});
  folder = opts.folder || ['*/**.md'];
  jsonoutput = opts.jsonoutput || "data/tipuesearch_content.json";
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

          _url = roots.replace(files);

          // console.log(_url);

          output = yamlFront.loadFront(filesArray[i]);




          // console.log(output);

          this.items = function(banner, title, shortdesc, writer, tags, date, url){
            this.banner = banner;
            this.title = title;
            this.text  = shortdesc;
            this.writer  = writer;
            this.tags   = tags;
            this.date   = date;
            this.url   = url;

          }

          var itemObject = new this.items (output.banner, output.title, output.shortdesc, output.writer, output.categories, output.date, _url.replace(".html", ""));



          pages.push(itemObject)


          pages.sort(sortBy('-date', 'DESC'));


          result.pages = pages;



        } // end of for loop



        roots.stat(jsonoutput, function(err, stat){
          if (err == null){
            roots.open(jsonoutput, 'r+', function(err, fd){
              if (err){
                return roots.callError('Error Openning File', err);
              }
              roots.read(fd, buf, 0, buf.length, 0, function(err, bytes){
                if (err){
                  return roots.callError('Error Reading', err);
                }
                else{
                  roots.writeFile(jsonoutput, JSON.stringify(result), 'utf8', roots.callback);
                }

              }) // end roots.read
            })

          }
          else if(err.code == 'ENOENT') {
            roots.writeFile(jsonoutput, JSON.stringify(result), 'utf8', roots.callback);
          }

          else {
            return roots.callError('Some other error: ', err.code);
          }


        }) // end fs stat



    }

    WebriqRootsExtension.prototype.replace = function(fileurl){
      return fileurl.replace(/\.[^\.]+$/, '.html');

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
