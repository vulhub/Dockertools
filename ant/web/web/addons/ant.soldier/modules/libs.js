//  静态资源文件
module.exports = function(app, mdb, fc, path, dir) {
    //@ 发送客户端js
    app.route(path + 'client.js')
        .get(function(req, res) {
            fc.sendFile(req, res, dir + '/libs/client.min.js', true)
        })
    //@ 发送客户端css
    app.route(path + 'client.css')
        .get(function(req, res) {
            fc.sendFile(req, res, dir + '/libs/client.css', true)
        })
    //@ 发送客户端API
    app.route(path + 'api.connect.js')
        .get(function(req, res) {
            fc.sendFile(req, res, dir + '/libs/api.connect.min.js', true)
        })
    app.route(path + 'api.ui.js')
        .get(function(req, res) {
            fc.sendFile(req, res, dir + '/libs/api.ui.min.js', true)
        })
    //@ MD5.js
    app.route(path + 'md5.js')
        .get(function(req, res) {
            fc.sendFile(req, res, dir + '/libs/md5.min.js', true)
        })
}