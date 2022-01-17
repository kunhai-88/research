const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");

const DEBUG = process.env.mode !== "production";

const autoprefixerConfig = {
  browsers: [
    "ie_mob >= 10",
    "ff >= 30",
    "chrome >= 34",
    "safari >= 7",
    "opera >= 23",
    "ios >= 7",
    "android >= 2.3",
    "bb >= 10"
  ]
};

const plugins = [
  new CleanWebpackPlugin(),
  new CopyPlugin([
    {
      from: path.resolve(__dirname, "./public"),
      to: path.resolve(__dirname, "./dist")
    }
  ]),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "./src/index.html"),
    hash: true
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin()
];

if (DEBUG) {
  plugins.push(
    new webpack.SourceMapDevToolPlugin({
      filename: "[name].js.map"
    })
  );
  
}
// plugins.push(new BundleAnalyzerPlugin());

const cssLoaderWithModule = {
  importLoaders: 1,
  modules: true,
  localIdentName: DEBUG ? "[name]_[local]--[hash:base64:5]" : "[hash:base64:5]",
  sourceMap: DEBUG
};

const cssLoaderWithoutModule = {
  sourceMap: DEBUG
};

const postcssLoader = {
  loader: "postcss-loader",
  options: {
    ident: "postcss",
    sourceMap: DEBUG,
    plugins: () => [autoprefixer(autoprefixerConfig)]
  }
};

const config = {
  entry: {
    app: [path.resolve(__dirname, "./src/index.js")]
  },

  node: {
    __filename: true,
    __dirname: true,
    module: "empty",
    net: "empty",
    fs: "empty"
  },

  output: {
    path: path.resolve(__dirname, "./dist"),
    // publicPath: "/",
    filename: "[name].[hash].bundle.js",
    chunkFilename: "[name].[hash].bundle.js",
    globalObject: "this"
  },
  optimization: {
    runtimeChunk: {
      name: "manifest"
    },
    minimizer: [new UglifyJsPlugin(), new OptimizeCSSAssetsPlugin({})]
  },

  cache: DEBUG,
  devtool: DEBUG ? "inline-source-map" : false,
  devServer: {
    contentBase: [path.resolve(__dirname, "./dist")],
    inline: true,
    compress: true,
    port: 8000,
    hotOnly: true,
    open: true,
    historyApiFallback: true
  },
  mode: process.env.mode,
  resolve: {
    extensions: [".js", ".less"],
    alias: {
      src: path.resolve(__dirname, "./src"),
      static: path.resolve(__dirname, "./static")
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: ["@babel/preset-react", "@babel/preset-env"],
              plugins: [
                "transform-class-properties",
                ["@babel/plugin-proposal-decorators", { legacy: true }]
              ]
            }
          }
        ]
      },
      {
        test: /[^_]\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
            options: cssLoaderWithModule
          },
          postcssLoader,
          {
            loader: "less-loader", // compiles Less to CSS
            options: { javascriptEnabled: true }
          }
        ]
      },
      {
        test: /_\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
            options: cssLoaderWithoutModule
          },
          postcssLoader,
          {
            loader: "less-loader", // compiles Less to CSS
            options: { javascriptEnabled: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          "css-loader"
        ]
      },
      {
        test: /\.(png|jpg|jpeg|svg)/,
        use: "url-loader"
      },
      {
        test: /\.(woff|eot|ttf)/,
        use: "url-loader"
      },
      {
        test: /\.(xlsx?|pdf)/,
        use: "file-loader"
      }
    ]
  },

  plugins,
  profile: true
};

module.exports = config;
