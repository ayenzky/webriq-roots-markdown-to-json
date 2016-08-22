# Webriq Roots Markdown to JSON

**Note**: This markdown to JSON was meant for static searchbar `Tipuesearch`

## Installation

  *  make sure you're in your roots project directory
  *  `npm install webriq-roots-markdown-to-json --save`
  *  modify your `app.coffee` file to include the extension


   ```coffee
   roots_markdown_to_json = require 'webriq-roots-markdown-to-json'

   module.exports =
     extensions: [roots_markdown_to_json(options)]
   ```
## Example

  ````
  roots_markdown_to_json(jsonoutput: "data", folder:['posts/**.md', posts/**.md])

  ````

## Options

  * jsonoutput - output destination folder
  * folder - the directory location with `.md` files you would like to include, see example


