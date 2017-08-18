//  数据库结构
module.exports = function(db) {
    return db.init('blog',
    {
        user: db.objId('user'), //  所属用户
        title: String,          //  蚁记标题
        category: String,       //  蚁记分类
        content: String,        //  博客内容
        desc: String,           //  蚁记简介
        ctime: Date,            //  创建时间
        utime: Date,            //  更新时间
        public: Boolean,        //  是否分享
        verify: Boolean,        //  是否审核
        view: Number,           //  浏览次数
    })
}