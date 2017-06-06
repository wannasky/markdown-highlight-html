var hljs = require('highlight.js');
var Entities = require('html-entities').XmlEntities;
var entities = new Entities();
var alias = require('./highlight.json');

//highlight配置
hljs.configure({
    classPrefix: ''
});

function highlight(str, lang) {
    var firstLine = 1;
    var data = buildHighlight(str, lang);
    var lines = data.value.split('\n');
    if(lines.length && lines[lines.length - 1] === ''){
        lines = lines.slice(0,lines.length - 1);
    }
    var numbers = '', content = '', result = '', line;

    for(var i=0,len=lines.length;i<len;i++){
        line = lines[i];
        numbers += '<div class="line">' + (firstLine + i) + '</div>';
        content += '<div class="line">';
        content += line + '</div>';
    }

    result += '<figure class="highlight' + (data.language ? ' ' + data.language : '') + '">';
    result += '<table><tr>';
    result += '<td class="gutter"><pre>' + numbers + '</pre></td>';
    result += '<td class="code"><pre>' + content + '</pre></td>';
    result += '</tr></table></figure>';
    return result;
}

//判断语言
function tryLanguage(lang) {
    if (hljs.getLanguage(lang)) return true;
    if (!alias.aliases[lang]) return false;
    loadLanguage(alias.aliases[lang]);
    return true;
}

//高亮处理
function tryHighlight(str, lang) {
    try {
        return hljs.highlight(lang, str);
    } catch (err) {
        return;
    }
}

//编译高亮html
function buildHighlight(str, lang) {
    var result = {
        value: entities.encode(str),
        language: lang.toLowerCase()
    };
    if (result.language === 'plain') {
        return result;
    }
    if (!tryLanguage(result.language)) {
        result.language = 'plain';
        return result;
    }
    return tryHighlight(str, result.language) || result;
}

module.exports = highlight;

