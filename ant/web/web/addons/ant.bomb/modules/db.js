//  数据库结构
module.exports = function(db) {
    return {
        plugin: db.init('bomb_plugin', {
            user: db.objId('user'),     //  所属用户
            name: String,               //  插件名称
            desc: String,               //  插件简介
            coin: Number,               //  出售金币
            code: Object,               //  代码对象{client:'',server:''}
            public: Boolean,            //  是否出售
            verify: Boolean,            //  是否审核,
            buys: Array,                //  购买者
            ctime: Number,                //  创建时间
            utime: Number,                //  更新时间
        }),
        project: db.init('bomb_project', {
            user: db.objId('user'),     //  所属用户
            name: String,               //  项目名称
            pid: Number,                //  项目ID
            desc: String,               //  项目简介
            code: String,               //  项目代码
            ctime: Number,              //  创建时间
            utime: Number,              //  更新时间
        }),
        hosts: db.init('bomb_hosts', {
            user: db.objId('user'),             //  所属用户
            project: db.objId('bomb_project'),  //  所属项目
            ip: String,                         //  IP地址
            ua: String,                         //  UA信息
            referer: String,                    //  来源地址
            sid: String,                        //  socket.id
            addr: String,                       //  物理地址
            data: String,                       //  保存数据
            online: Boolean,                    //  是否在线
            ctime: Number,                        //  连接时间
            utime: Number,                        //  断开时间
        })
    }
}