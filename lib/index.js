var fs = require('fs');
var path = require('path');
var markdown = require('./markdown');

var template = {};
template.common = fs.readFileSync('templates/common.html').toString();


function build(file, outputdir) {
    if(path.extname(file) === '.md'){
        var md = markdown.render(fs.readFileSync(file).toString());
        fs.writeFileSync(path.join(outputdir,getDir(file)).replace('.md','.html'),generateHtml('common',md));
    }
}

function generateHtml(templateName,md) {
    return template[templateName].replace('@markdown',md);
}

function getDir(file) {
    var index = file.indexOf(path.sep);
    if(index === -1){
        file = '';
    }else{
        file = file.slice(index,file.length);
    }
    return file;
}

function copySource(outputdir) {
    loop('./source',outputdir,function (file) {
        fs.writeFileSync(path.join(outputdir,getDir(file)),fs.readFileSync(file))
    })
}

function loop(file, outputdir, parse) {
    var stat = fs.lstatSync(file);
    if(stat.isDirectory()){
        var dir = getDir(file);
        if(!fs.existsSync(path.join(outputdir,dir))){
            fs.mkdirSync(path.join(outputdir,dir));
        }
        fs.readdirSync(file).forEach(function (fileName) {
            loop(path.join(file,fileName),outputdir,parse);
        });
    }else{
        if(parse){
            parse(file);
        }else{
            build(file,outputdir);
        }
    }
}

//编译
markdown.build = function (file, outputdir) {
    copySource(outputdir);
    loop(file,outputdir);
}

module.exports = markdown;