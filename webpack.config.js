const path = require("path");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const openBrowser = require("./scripts/openBrowser");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
    mode: isDevelopment ? "development" : "production",
    devServer: {
        open: false,
        compress: true,
        hot: true,
        historyApiFallback: true,
        port: 3000,
        onAfterSetupMiddleware: function (devServer) {
            openBrowser("http://localhost:3000");
        },
        // client: { overlay: false },
    },
    entry: {
        main: "./src/index.js",
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: path.join(__dirname, "src"),
                use: "babel-loader",
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.less$/i,
                use: [
                    // compiles Less to CSS
                    isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
                    //,
                    "css-loader",
                    "less-loader",
                ],
            },
        ],
    },
    plugins: [
        isDevelopment && new ReactRefreshPlugin(),
        new HtmlWebpackPlugin({
            filename: "./index.html",
            template: "./public/index.html",
        }),
        !isDevelopment && new MiniCssExtractPlugin({}),
    ].filter(Boolean),
    resolve: {
        extensions: [".js", ".jsx"],
    },
    optimization: {
        minimizer: [!isDevelopment && new CssMinimizerPlugin()].filter(Boolean),
    },
};
