require(["../../global.config"], function() {
    require(["jquery", 'dropzone'], function ($) {
        var allfile = [];
        $(document).ready(function() {
            Dropzone.autoDiscover = false;
            $(function() {
                var myDropzone = new Dropzone("#my-dropzone", {
                    acceptedFiles: ".png,.jpg",
                    dictInvalidFileType: "上传失败!只可以上传.png|.jpg文件."
                });

                myDropzone.on("success", function (file) {

                    var rep = JSON.parse(file.xhr.response);
                    if (file.status === "error" || rep.status !== "1") {
                        var node, _i, _len, _ref, _results;
                        var message = rep.msg; // modify it to your error message
                        file.previewElement.classList.add("dz-error");
                        _ref = file.previewElement.querySelectorAll("[data-dz-errormessage]");
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            node = _ref[_i];
                            _results.push(node.textContent = message);
                        }
                        return _results;
                    }
                    allfile.push({ originname: file.name, uploadname: rep.msg });
                });


                //按顺序插入
                myDropzone.on("queuecomplete", function() {
                    if (allfile.length === 0)
                        return false;
                    var $pfilename = $(".dz-filename"); 
                    for (var j = 0; j < $pfilename.length; j++) {
                        for (var i = 0, len = allfile.length; i < len; i++) {
                            var afile = allfile[i];
                            var originname = afile.originname.toString();
                            if ($($pfilename[j]).text() === originname) {
                                var str = "<img style=\"display:block\" src=\"" + afile.uploadname.toString() + "\"/>";
                                parent.$.cbuilder.append(str);
                                break;
                            }
                        }
                    }
                    parent.$.fancybox.close();
                    allfile = [];
                });
            });
        });
    });
});
