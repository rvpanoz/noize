const path = require('path');
const webpack = require('webpack');
const isProd = (process.env.NODE_ENV === 'production');

function getPlugins() {
  var plugins = [];

  // Always expose NODE_ENV to webpack
  plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': process.env.NODE_ENV
    }
  }));

  plugins.push(new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery'
  }));

  // Conditionally add plugins for Production builds.
  if (isProd) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
  }

  // Conditionally add plugins for Development
  else {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return plugins;
}

module.exports = {
  context: path.resolve(__dirname, './src'),
  devtool: 'source-map',
  entry: './entry',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'app.js',
    publicPath: '/public/'
  },
  devServer: {
    open: false,
    contentBase: path.resolve(__dirname, './src')
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.scss'],
    modules: [
      path.join(__dirname, './src'),
      "node_modules"
    ],
    alias: {
      config: 'src/config',
      handlebars: 'handlebars/dist/handlebars.min.js',
      src: path.resolve(__dirname, 'src'),
      public: path.resolve(__dirname, 'src/public'),
      assets: path.resolve(__dirname, 'src/assets'),
      templates: path.resolve(__dirname, 'src/templates/'),
      schemas: path.resolve(__dirname, 'src/schemas/'),
      helpers: path.resolve(__dirname, 'src/helpers/'),
      views: path.resolve(__dirname, 'src/views/'),
      app: path.resolve(__dirname, 'src/app.js')
    }
  },
  plugins: getPlugins(),
  module: {
    rules: [
      //css and scss loaders
      {
        test: /\.css$/,
        use: [
          "style-loader", "css-loader"
        ]
      },
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      // Font Definitions
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        }]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?bypassOnDebug'
        ]
      },
      {
        test: /\.hbs$/,
        use: ['handlebars-loader']
      }
    ]
  }
}
