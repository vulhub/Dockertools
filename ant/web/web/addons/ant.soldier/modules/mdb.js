//  数据库结构
module.exports = function(db) {
    return db.init('soldier',
    {
        user: db.objId('user'), //    所属用户
        // buys: Number,           //    购买次数
        aid: Number,            //    兵蚁编号
        env: String,            //    运行环境
        cms: String,            //    兵蚁归类
        desc: String,           //    简单说明
        name: String,           //    兵蚁大名
        code: Object,           //    兵蚁代码
        coin: Number,           //    交易金额
        ctime: Date,            //    创建日期
        utime: Date,            //    更新时间
        style: Object,          //    列表样式
        sell: Boolean,          //    是否发布市场
        verify: Boolean,        //    是否已经审核通过
        members: Array          //    购买兵蚁用户列表
    })
}