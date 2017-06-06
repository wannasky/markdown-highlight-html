var MarkdownIt = require('markdown-it');
var hljs = require('highlight.js');
var highlight = require('./highlight');

var markdown = new MarkdownIt({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return highlight(str,lang);
            } catch (__) {}
        }
        return '';
    }
});

module.exports = markdown;
