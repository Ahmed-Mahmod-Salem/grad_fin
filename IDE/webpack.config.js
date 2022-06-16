const path = require("path");
const NodemonPlugin = require('nodemon-webpack-plugin');
module.exports = 
{
    mode: "development",
    devtool: false,
    entry: "client/src/index.js",
    stats: 'errors-only', //Don't want to keep seeing warnings
    output: 
    {
        filename: "main.js",
        path: path.resolve(__dirname,"client/dist")
    },
    resolve:{
      preferRelative: true, //Makes sure we avoid using ./ when using require or import. This way we can use src/index.js instead of ./src/index.js
    },
    experiments: {
        topLevelAwait: true,
      },
      plugins: [
        new NodemonPlugin({ 
          script: "server/server.js", 
          watch: path.resolve('./'),}), // Dong
      ],
      
    }
