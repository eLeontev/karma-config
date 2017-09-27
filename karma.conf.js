var path = require('path')

module.exports = function(config) {
    const webpackConfig = {

        devtool: 'source-map',

        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: path.resolve(__dirname, 'node_modules'),
                    include: [
                        path.join(__dirname, 'app'),
                    ],
                    query: {
                        presets: ['airbnb']
                    }
                }
            ]
        },
    }

    config.set({
        basePath: '',

        frameworks: ['jasmine'],

        files: ['./app/app.spec.js'],

        preprocessors: {
            './app/app.js': ['webpack', 'sourcemap'],
            './app/app.spec.js': ['webpack', 'sourcemap'],
        },

        port: 9876,

        autoWatch: true,

        browsers: ['Chrome'],

        webpack: webpackConfig,

        webpackServer: {
            noInfo: true
        },

        plugins: [
            'karma-webpack',
            'karma-jasmine',
            'karma-sourcemap-loader',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher'
        ],

        babelPreprocessor: {
            options: {
                presets: ['airbnb']
            }
        },
    })
}