const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Function to get plugins (some conditionally for production)
const getPlugins = (devMode) => {
  const plugins = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      favicon: path.resolve(__dirname, 'public/favicon.png'),
      title: 'Webpack Boilerplate'
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })
  ];
  if (!devMode) { plugins.push(new CleanWebpackPlugin()); }
  return plugins;
};

module.exports = (env, options) => {
  const devMode = options.mode === 'development';
  return {
    output: {
      publicPath: '/static/'
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    devtool: devMode ? 'inline-source-map' : false,
    devServer: {
      contentBase: path.resolve(__dirname, 'dist')
      /* Proxy to a backend, add appropriate url and port
      proxy: {
        '**': 'http://127.0.0.1:8000/'
      }
      */
    },
    resolve: {
      alias: {
        assets: path.resolve(__dirname, 'src/assets')
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src'),
        },
        {
          test: /\.scss$/,
          include: path.resolve(__dirname, 'src'),
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]_[hash]',
              }
            },
            'sass-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        }
      ]
    },
    plugins: getPlugins(devMode)
  };
};
