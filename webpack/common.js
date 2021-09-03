const path = require( 'path' );
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: path.resolve(__dirname, '../src/index.ts'),
    externals: [nodeExternals()],
    module:{
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ],
    },
    output: {
        path: path.resolve( __dirname, '../build' ),
        filename: 'main.js',
    },

    plugins: [],

    resolve: {
        extensions: [ '.ts', '.js' ],
        alias: {
            "@abstract": path.resolve(__dirname, '../src/abstract'),
            "@helpers": path.resolve(__dirname, '../src/helpers'),
            "@managers": path.resolve(__dirname, '../src/managers'),
            "@resources": path.resolve(__dirname, '../src/resources'),
            "@services": path.resolve(__dirname, '../src/services')
        }
    },

    target: "node"
}