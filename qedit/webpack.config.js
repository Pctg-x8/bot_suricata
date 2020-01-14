const path = require("path");

const mainMod = {
    mode: "development",
    entry: "./src/main.ts",
    target: "electron-main",
    node: {
        __dirname: false,
        __filename: false
    },
    output: {
        filename: "main.js",
        path: path.join(__dirname, "dist")
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    },
    module: {
        rules: [
            { test: /.tsx?$/, loader: "ts-loader" }
        ]
    }
};
const renderMod = {
    mode: "development",
    entry: "./src/render.tsx",
    target: "electron-renderer",
    output: {
        filename: "render.js",
        path: path.join(__dirname, "dist")
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".sass"]
    },
    module: {
        rules: [
            { test: /.tsx?$/, loader: "ts-loader" },
            { test: /.sass$/, loader: ["style-loader", "css-loader", "sass-loader"] }
        ]
    }
};

module.exports = [mainMod, renderMod];
