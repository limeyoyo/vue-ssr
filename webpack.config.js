const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpaack = require('webpack')

const isDev = process.env.NODE_ENV === 'development'

const config = {
    target: 'web',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.styl/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true // stylus-loader会自动生成sourceMap，postcss也可以生成sourceMap，当前面有处理器生成了，postcss可以帮我们直接使用前面的sourceMap，提高编译效率
                        }
                    },
                    'stylus-loader'
                ]
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpaack.DefinePlugin({
           'process.env': {
               NODE_ENV: isDev ? '"development"' : '"production"'
           } 
        }),
        new VueLoaderPlugin(),
        new HTMLPlugin()
    ]
}


if (isDev) {
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = {
        port: 8000,
        host: '0.0.0.0',
        overlay: {
            errors: true
        },
        hot: true
        // open: true,
        // historyFallback: {

        // }
    }
    config.plugins.push(
        new webpaack.HotModuleReplacementPlugin(),
        new webpaack.NoEmitOnErrorsPlugin()
    )
}

module.exports = config