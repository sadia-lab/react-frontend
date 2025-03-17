const webpack = require("webpack");

module.exports = {
    resolve: {
        fallback: {
            "fs": false,
            "async_hooks": false,
            "zlib": require.resolve("browserify-zlib"),
            "querystring": require.resolve("querystring-es3"),
            "path": require.resolve("path-browserify"),
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/"),
            "util": require.resolve("util/"),
            "url": require.resolve("url/"),
            "assert": require.resolve("assert/"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "os": require.resolve("os-browserify"),
            "tty": require.resolve("tty-browserify"),
            "net": require.resolve("net-browserify")
        }
    },
    devServer: {
        headers: {
            "Access-Control-Allow-Origin": "*",  // ✅ Allows API requests from any frontend
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Content-Security-Policy": "connect-src 'self' http://localhost:9090;"
        },
        proxy: {
            "/rastame/api": {
                target: "http://localhost:9090",  // ✅ Redirects API calls to backend
                secure: false,
                changeOrigin: true
            }
        }
    },
    plugins: [
        // ✅ Fix: Allows process.env usage in frontend
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env)
        }),

        // ✅ Prevents Webpack from bundling backend modules into frontend
        new webpack.IgnorePlugin({
            resourceRegExp: /^express$|^async_hooks$|^fs$/
        }),

        // ✅ Suppresses Webpack warnings about critical dependencies
        new webpack.ContextReplacementPlugin(/express\/lib/, (data) => {
            if (data.dependencies[0]) {
                delete data.dependencies[0].critical;
            }
            return data;
        })
    ]
};
