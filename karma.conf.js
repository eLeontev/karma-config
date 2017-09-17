var webpackConfig = {
    module: {
        rules: [ {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [ 'es2015' ]
                }
            }
        }]
    },

    // inline-source-map works wrong
    devtool: 'eval-source-map', 
}

var karmaConfig = {
    frameworks: ['jasmine'],
    
    files: [
        './app/app.spec.js',
    ],

    plugins: [
        'karma-jasmine',
        'karma-webpack',
        'karma-chrome-launcher',
        'karma-sourcemap-loader',
    ],

    webpack: webpackConfig,

    preprocessors: {
        './app/app.spec.js': [ 'webpack', 'sourcemap' ],
    },

    browsers: [ 'Chrome' ],

    autoWatch: false,
}

module.exports = function(config) {
    config.set(karmaConfig)
}
