// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

const isProduction = process.env.NODE_ENV === 'production';

const stylesHandler = 'style-loader';

const config = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // Ensure output filename is specified
    clean: true, // Optional: clears dist folder before builds
    publicPath:'/',
  },
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    proxy: [
      {
        context: ['/pg-bs'],
        target: 'http://localhost:8000',
        changeOrigin: true,
        pathRewrite: { '^/pg-bs': '' },
      },
      {
        context: ['/analysis'],
        target: 'http://localhost:5000',
        changeOrigin: true,
        pathRewrite: { '^/analysis': '' },
      },
      {
        context: ['/api'],
        target: 'http://localhost:8000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      }

    ],
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),

    // Replace build-time env so `process.env.X` never reaches the browser bundle
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || (isProduction ? 'production' : 'development')),
      'process.env.REACT_APP_BASE_URL': JSON.stringify(process.env.REACT_APP_BASE_URL || ''),
      // Prefer "path" for callback; your code builds the full URL from window.location.origin
      'process.env.REACT_APP_AUTH_CALLBACK_PATH': JSON.stringify(process.env.REACT_APP_AUTH_CALLBACK_PATH || '/callback'),
    }),

    // Provide a tiny `process` polyfill for dependencies that still reference it at runtime
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    // Explicit fallback for `process` (Webpack 5 removed auto-polyfills)
    fallback: {
      process: require.resolve('process/browser'),
    },

  },
  devtool: isProduction ? 'source-map' : 'eval-source-map',
};

module.exports = () => {
  config.mode = isProduction ? 'production' : 'development';
  return config;
};
