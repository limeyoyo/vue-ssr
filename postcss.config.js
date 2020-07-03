const autoprefixer = require('autoprefixer')

module.exports = {
    plugins: [
        autoprefixer() // 需要加浏览器前缀的css属性，autoprefixer自动加前缀去处理
    ]
}