var fs = require('fs');
var path = require('path');
var map = require('map-stream');
var vfs = require('vinyl-fs');
var markdown = require('./markdown');

var template = {};
template.common = fs.readFileSync(path.join(__dirname,'../templates/common.html')).toString();

function generateHtml(templateName,md) {
    var html = template[templateName];
    html = html.replace('{{markdown}}',md);
    return html;
}

//copy source
function copySource(outputdir) {
    vfs.src(path.join(__dirname,'../source/**'))
        .pipe(vfs.dest(outputdir))
}

//转换成html
function toHtml(file, cb) {
    var md = markdown.render(file.contents.toString());
    file.contents = new Buffer(generateHtml('common',md));
    file.extname = '.html';
    cb(null, file);
}

//编译markdown
function buildMarkdown(file, outputdir) {
    var stat = fs.lstatSync(file);
    if(stat.isDirectory()){
        vfs.src(path.join(file,'/**/*.md'))
            .pipe(map(toHtml))
            .pipe(map(function (fl, cb) {
                var relativePath = path.relative(fl.dirname,file);
                if(relativePath !== ''){
                    relativePath = relativePath + '/';
                }
                fl.contents = new Buffer(fl.contents.toString().replace('{{relativePath}}',relativePath));
                cb(null, fl)
            }))
            .pipe(vfs.dest(outputdir));
    }else{
        vfs.src(file)
            .pipe(map(toHtml))
            .pipe(vfs.dest(outputdir));
    }
}

//编译
markdown.build = function (file, outputdir) {
    copySource(outputdir);
    buildMarkdown(file,outputdir);
}

module.exports = markdown;