const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
require("dotenv").config({ path: "./.env" });

const deps = require("./package.json").dependencies;

const { REMOTE, REMOTE_TOPBAR, REMOTE_WEB_COMPONENTS, REMOTE_STANDALONE_MFE } = process.env;

module.exports = {
  mode: "production",
  entry: {
    host: path.resolve(__dirname, "./src/index.js"),
  },
  output: {
    filename: "[name].bundle.[hash].js",
    path: path.resolve(__dirname, "./dist"),
    publicPath: REMOTE,
  },
  resolve: {
    extensions: [".jsx", ".js", ".json"],
    alias: {
      components: path.resolve(__dirname, "src/components"),
      pages: path.resolve(__dirname, "src/pages"),
      context: path.resolve(__dirname, "src/context"),
    },
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
    minimize: true,
    // splitChunks: true,
    chunkIds: 'named',
    //splitChunks: false
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
          // {
          //   loader: "css-loader",
          //   options: {
          //     // url: false
          //   },
          // },
        ],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: "asset/inline",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // filename: "[name].css",
      filename: "[name].[contenthash].css",
      chunkFilename: 'chunk-[id].css',
    }),
    new ModuleFederationPlugin({
      // name of remote, beware name collisions
      name: "host_remote",
      // name of bundle (this will be splitted from main bundle)
      filename: "remoteEntry.js",
      remotes: {
        ReactComponents: `topbar_remote@${REMOTE_TOPBAR}/remoteEntry.js`,
        WebComponents: `wc_system@${REMOTE_WEB_COMPONENTS}/remoteEntry.js`,
        StandaloneMFE: `WCDemo@${REMOTE_STANDALONE_MFE}/remoteEntry.js`,
      },
      //  exposed "remotes" for other apps to see, they will be imported under "remotes" with this format: name@location
      exposes: {},
      shared: {
        react: {
          singleton: true,
          eager: true,
          requiredVersion: deps["react"],
        },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: deps["react-dom"],
        },
        "react-router-dom": {
          singleton: true,
          eager: true,
          requiredVersion: deps["react-router-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      // chunks: ["host"],
      templateParameters: {
        assetsUrl: `${REMOTE_WEB_COMPONENTS}`
      },
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public" }, path.resolve(__dirname, "./public")],
    }),
  ],
};
