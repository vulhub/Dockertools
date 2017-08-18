;(function($) {
    $.fn.bindUpload = function(ok, no) {
        var _id = $(this).attr('id'),
            _url = 'http://7xietn.com1.z0.glb.clouddn.com/';
        Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: _id,
            uptoken_url: '/addons/ant.blog/uptoken',
            domain: _url,
            bucket: 'antoor',
            unique_names: true,
            max_file_size: '100mb',
            flash_swf_url: '/plupload-2.1.3/js/plupload/Moxie.swf',
            max_retries: 3,
            chunk_size: '4mb',
            auto_start: true,
            init: {
                'FilesAdded': function(up, files) {
                    // console.log('add-->', files)
                },
                'BeforeUpload': function(up, file) {
                    w2popup.lock('上传文件(' + w2utils.encodeTags(file.name) + ')中..', true);
                },
                'UploadProgress': function(up, file) {
                    // console.log('progress...')
                },
                'FileUploaded': function(up, file, info) {
                    var img = JSON.parse(info);
                    ok(file.name, _url + img.key);
                },
                'Error': function(up, err, errTip) {
                    toastr.error('文件上传失败!<br>' + errTip, 'Error');
                },
                'UploadComplete': function() {
                    w2popup.unlock();
                    toastr.success('文件上传完毕', 'Success');
                },
                'Key': function(up, file) {
                    return '';
                }
            }
        })
    }
})(jQuery);