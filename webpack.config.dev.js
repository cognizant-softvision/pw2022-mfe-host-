const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
require("dotenv").config({ path: "./.env" });

const deps = require("./package.json").dependencies;

const { 
  PORT, 
  REMOTE_TOPBAR,
  REMOTE_WEB_COMPONENTS,
  REMOTE_STANDALONE_MFE,
  LOCAL_TOPBAR,
  LOCAL_WEB_COMPONENTS,
  LOCAL_STANDALONE_MFE,
} = process.env;


module.exports = {
  mode: "development",
  entry: {
    host: path.resolve(__dirname, "./src/index.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./dist"),
    publicPath: `http://localhost:${PORT}/`,
  },
  resolve: {
    extensions: [".jsx", ".js", ".json"],
    alias: {
      components: path.resolve(__dirname, "src/components"),
      pages: path.resolve(__dirname, "src/pages"),
      context: path.resolve(__dirname, "src/context"),
    },
  },
  devServer: {
    port: PORT,
    static: {
      directory: path.resolve(__dirname, "./dist"),
    },
    historyApiFallback: true,
    devMiddleware: {
      index: "index.html",
      writeToDisk: true,
    },
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
        use: ["style-loader", {
          loader: "css-loader",
          options: {
            // url: false
          }
        }],
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
    new ModuleFederationPlugin({
      // name of remote, beware name collisions
      name: "host_remote",
      // name of bundle (this will be splitted from main bundle)
      filename: "remoteEntry.js",
      remotes: {
        // remotes should follow this sintax: {{RemoteWhateverNameYouWant}}: "{{NameOnRemoteWebpack}}@http://localhost:3001/{{filenameOnRemotesWebpack}}.js", i.e.:
        // Remote: "AwesesomeRemote@http://localhost:3002/remoteEntry.js",
        ReactComponents: `topbar_remote@${LOCAL_TOPBAR || REMOTE_TOPBAR}/remoteEntry.js`,
        WebComponents: `wc_system@${LOCAL_WEB_COMPONENTS || REMOTE_WEB_COMPONENTS}/remoteEntry.js`,
        StandaloneMFE: `WCDemo@${LOCAL_STANDALONE_MFE || REMOTE_STANDALONE_MFE}/remoteEntry.js`
      },
      //  exposed "remotes" for other apps to see, they will be imported under "remotes" with this format: name@location
      exposes: {},
      shared: 
      // {...deps}
      {
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
        assetsUrl: `${LOCAL_WEB_COMPONENTS || REMOTE_WEB_COMPONENTS}`,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public" }, path.resolve(__dirname, './public')],
    }),
  ],
};
