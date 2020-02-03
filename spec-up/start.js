
const gulp = require('gulp');
const fs = require('fs-extra');
const pkg = require('pkg-dir');
const globby = require('globby');

function getRelativePrefix(location){
  return (location.match(/[a-zA-Z0-9-\._]+/g) || []).map(() => '../').join('');
}

/* FILE DISCOVERY & CHANGE WATCHING */

let init = new Promise(async (resolve, reject) => {
  var projectPath = await pkg(__dirname);
  var moduleLocation = __dirname.replace(projectPath, ''); 
  var rootRelativePrefix = getRelativePrefix(moduleLocation);
  (await globby(['./**/spec.md', `!./node_modules`])).forEach(match => {
    let path = match.replace('/spec.md', '');
    fs.readFile(path + '/spec.json', function(err, data) {
      if (err) return reject(err);
      let config = JSON.parse(data);
          config.path = path;
          config.rootRelativePrefix = rootRelativePrefix;
          config.assetRelativePrefix = getRelativePrefix(config.output_path || path);
      gulp.watch(
        [path + '/**/*', '!' + path + '/index.html'],
        { ignoreInitial: false },
        render.bind(null, config)
      )
    });
  });

});

/* RENDERING */

var toc;
var noticeTypes = {
  note: 1,
  issue: 1,
  example: 1,
  warning: 1
};
var noticeParser = {
  validate: function(params) {
    let matches = params.match(/(\w+)\s?(.*)?/);
    if (matches && noticeTypes[matches[1]]) return matches[1];
  },
  render: function (tokens, idx) {
    let matches = tokens[idx].info.match(/(\w+)\s?(.*)?/);
    if (matches && tokens[idx].nesting === 1) {
      let type = matches[1];
      let id = (matches[2] ? matches[2].trim().replace(/\s/g , '-').toLowerCase() : type + '-' + noticeTypes[type]++);
      return `<div id="${id}" class="notice ${type}"><a class="notice-link" href="#${id}"></a>`;
    }
    else return '</div>\n';
  }
};

const containers = require('markdown-it-container');
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
})
  .use(require('markdown-it-abbr'))
  .use(require('markdown-it-attrs'))
  .use(require('markdown-it-chart').default)
  .use(containers, 'notice', noticeParser)
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-icons').default, 'font-awesome')
  .use(require('markdown-it-ins'))
  .use(require('markdown-it-latex').default)
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-mermaid').default)
  .use(require('markdown-it-multimd-table'), {
    multiline:  true,
    rowspan:    true,
    headerless: true
  })
  .use(require('markdown-it-prism'), { plugins: ['copy-to-clipboard'] })
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'))
  .use(require('markdown-it-task-lists'))
  .use(require('markdown-it-toc-and-anchor').default, {
    tocClassName: 'toc',
    tocFirstLevel: 2,
    tocLastLevel: 4,
    tocCallback: (md, tokens, html) => toc = html,
    anchorLinkSymbol: '§',
    anchorClassName: 'toc-anchor'
  })

async function render(config) {
  console.log('Rendering: ' + config.title);
  return new Promise((resolve, reject) => {
    fs.readFile(config.path + '/spec.md', 'utf8', async function(err, doc) {
      if (err) return reject(err);
      var features = (({ source, logo }) => ({ source, logo }))(config);
      var basePath = config.output_path || config.assetRelativePrefix;
      var svg = '';
      try {
        svg = await fs.readFile('./spec-up/icons.svg', 'utf8');
      }
      catch (e) {
        console.log(e);
      }

      fs.writeFile(basePath + 'index.html', `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

            <title>${config.title}</title>
            <link href="${basePath}spec-up/css/custom-elements.css" rel="stylesheet">
            <link href="${basePath}spec-up/css/prism.css" rel="stylesheet">
            <link href="${basePath}spec-up/css/chart.css" rel="stylesheet">
            <link href="${basePath}spec-up/css/font-awesome.css" rel="stylesheet">
            <link href="${basePath}spec-up/css/index.css" rel="stylesheet">
            <script src="${basePath}spec-up/js/custom-elements.js"></script>
          </head>
          <body features="${Object.keys(features).join(' ')}">
            
            ${svg}

            <main>

              <header id="header" class="panel-header">
                <span id="toc_toggle" panel-toggle="toc">
                  <svg><use xlink:href="#nested_list"></use></svg>
                </span>
                <a id="logo" href="${config.logo_link ? config.logo_link : '#_'}">
                  <img src="${config.logo}" />
                </a>
                <span issue-count animate panel-toggle="repo_issues">
                  <svg><use xlink:href="#github"></use></svg>
                </span>
              </header>

              <article id="content">
                ${md.render(doc)}
              </article>    

            </main>

            <slide-panels id="slidepanels">
              <slide-panel id="repo_issues" options="right">
                <header class="panel-header">
                  <span>
                    <svg><use xlink:href="#github"></use></svg>
                    <span issue-count></span>
                  </span>
                  <span class="repo-issue-toggle" panel-toggle="repo_issues">✕</span>
                </header>
                <ul id="repo_issue_list"></ul>
              </slide-panel>

              <slide-panel id="toc">
                <header class="panel-header">
                  <span>Table of Contents</span>
                  <span panel-toggle="toc">✕</span>
                </header>
                <div id="toc_list">
                  ${toc}
                </div>
              </slide-panel>
              
            </slide-panels>

          </body>
          <script>window.specConfig = ${JSON.stringify(config)}</script>
          <script src="${basePath}spec-up/js/markdown-it.js"></script>
          <script src="${basePath}spec-up/js/prism.js" data-manual></script>
          <script src="${basePath}spec-up/js/mermaid.js"></script>
          <script src="${basePath}spec-up/js/chart.js"></script>
          <script src="${basePath}spec-up/js/index.js"></script>
        </html>
      `, function(err, data){
        if (err) reject(err);
        else resolve();
      }); 
    });
  });
}

// Mermaid CDN version: https://cdn.jsdelivr.net/npm/mermaid@8.4.5/dist/mermaid.min.js