const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpaack = require('webpack')
// const ExtractPlugin = require('extract-text-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development'

const config = {
    target: 'web',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.[hash:8].js',
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
            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader',
            //         'css-loader'
            //     ]
            // },
            // {
            //     test: /\.styl/,
            //     use: [
            //         'style-loader',
            //         'css-loader',
            //         {
            //             loader: 'postcss-loader',
            //             options: {
            //                 sourceMap: true // stylus-loader会自动生成sourceMap，postcss也可以生成sourceMap，当前面有处理器生成了，postcss可以帮我们直接使用前面的sourceMap，提高编译效率
            //             }
            //         },
            //         'stylus-loader'
            //     ]
            // },
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
        new CleanWebpackPlugin(),
        new webpaack.DefinePlugin({
           'process.env': {
               NODE_ENV: isDev ? '"development"' : '"production"'
           } 
        }),
        new VueLoaderPlugin(),
        new HTMLPlugin(),
         //new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        })
    ]
}


if (isDev) {
    config.module.rules.push({
        test: /\.styl/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            'stylus-loader'
        ]
    })
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
} else {
    // config.entry = {
    //     app: path.join(__dirname, 'src/index.js'),
    //     vendor: ['vue']
    // }
    config.output.filename = '[name].[chunkhash:8].js'
    // config.module.rules.push({
    //     test: /\.styl/,
    //     use: ExtractPlugin.extract({
    //         fallback: 'style-loader',
    //         use: [
    //             'css-loader',
    //         {
    //             loader: 'postcss-loader',
    //             options: {
    //                 sourceMap: true
    //             }
    //         },
    //         'stylus-loader'
    //         ]
    //     })
    // })
    config.module.rules.push(
        //css预处理器，使用模块化的方式写css代码
        //stylus-loader专门用来处理stylus文件，处理完成后变成css文件，交给css-loader.webpack的loader就是这样一级一级向上传递，每一层loader只处理自己关心的部分
        {
            test: /\.styl/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        // you can specify a publicPath here
                        // by default it uses publicPath in webpackOptions.output
                        publicPath: './',
                        hmr: process.env.NODE_ENV === 'development',
                    },
                },
                'css-loader',
                { 
                    loader: 'postcss-loader', 
                    options: { sourceMap: true } 
                },
                'stylus-loader'
            ]
        },
    );
    // config.plugins.push(
    //     new ExtractPlugin('styles.[contentHash:8].css')
    // )
    config.plugins.push(
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // all options are optional
          filename: 'styles.[chunkhash].[name].css',
          chunkFilename: '[id].css',
          ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        // new webpaack.optimize.CommonsChunkPlugin({
        //     name: 'vendor'
        // })
        // new webpaack.optimize.CommonsChunkPlugin({
        //     name: 'runtime'
        // })
      );
}

module.exports = config