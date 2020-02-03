
function delegateEvent(type, selector, fn, container){
  return (container || document).addEventListener(type, e => {
    let node = e.target;
    let match = node.matches(selector);
    if (!match) while (node.parentElement) {
      node = node.parentElement.matches(selector) ? match = node : node.parentElement;
    }
    else if (match) fn.call(node, e, node);
  });
}

var markdown = window.markdownit();

/* Sidebar Interactions */

delegateEvent('pointerup', '[panel-toggle]', (e, delegate) => {
  slidepanels.toggle(delegate.getAttribute('panel-toggle'));
});

window.onhashchange = e => {
  slidepanels.close();
}

/* GitHub Issues */

 let source = specConfig.source;
  if (source) {
    if (source.host === 'github') {
      fetch(`https://api.github.com/repos/${ source.account + '/' + source.repo }/issues`)
        .then(response => response.json())
        .then(issues => {
          let count = issues.length;
          document.querySelectorAll('[issue-count]').forEach(node => {
            node.setAttribute('issue-count', count)
          });
          repo_issue_list.innerHTML = issues.map(issue => {
            return `<li class="repo-issue">
              <div class="repo-issue-title">
                <span class="repo-issue-number">${issue.number}</span>
                <a href="${issue.url}">${issue.title}</a>
              </div>
              <detail-box class="repo-issue-body">
                ${markdown.render(issue.body)}
              </detail-box>
            </li>`
          }).join('');
          Prism.highlightAllUnder(repo_issue_list);
        })
    }
  }


/* Mermaid Diagrams */

mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral'
});


/* Charts */

document.querySelectorAll('.chartjs').forEach(chart => {
  new Chart(chart, JSON.parse(chart.textContent));
});



