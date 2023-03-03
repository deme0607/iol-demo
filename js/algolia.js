const searchClient = algoliasearch('GPJ5WFKVPJ', '17367d0030647003e11fd7e0ac5f8e34');

const search = instantsearch({
  indexName: 'iol_demo',
  searchClient,
});

const { searchBox, hits } = instantsearch.widgets;
const { connectHits, connectInfiniteHits } = instantsearch.connectors;

const formatTimestamp = (ms) => {
  const sec  = Math.floor((ms / 1000) % 60);
  const min  = Math.floor((ms / 1000 / 60) % 60);
  const hour = Math.floor((ms / 1000 / 60 / 60) % 24);
  return [
    hour.toString().padStart(2, "0"),
    min.toString().padStart(2, "0"),
    sec.toString().padStart(2, "0"),
  ].join(":");
}

const resultTableHeader = `
  <tr>
    <th>Episode</th>
    <th>Time</th>
    <th>Speaker</th>
    <th>Content</th>
  </tr>
`;

// TODO: Dynamic link for episodes
const renderRow = (item) => {
  return `
    <tr>
      <td><a href="${BASE_URL}/episode/2022-08-28">${item.episode}</a></td>
      <td>${formatTimestamp(item.start_time)}</td>
      <td>${item.speaker}</td>
      <td>${instantsearch.highlight({attribute: 'content', hit: item})}</td>
    </tr>
  `;
};

const renderHits = (renderArgs, isFirstRender) => {
  const { hits, widgetParams } = renderArgs;
  const { container } = widgetParams;

  document.querySelector(container).innerHTML = `
    <table>
      ${resultTableHeader}
      ${hits.map(renderRow).join('')}
    </table>
  `;
};

let lastRenderArgs;

const renderInfiniteHits = (renderArgs, isFirstRender) => {
  const { hits, showMore, widgetParams } = renderArgs;
  const { container } = widgetParams;

  lastRenderArgs = renderArgs;

  if (isFirstRender) {
    const sentinel = document.createElement('div');
    const c = document.querySelector(container);

    c.innerHTML = `
      <table id="search-hits-results">
        ${resultTableHeader}
      </table>
    `;

    c.appendChild(sentinel);

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !lastRenderArgs.isLastPage) {
          showMore();
        }
      });
    });

    observer.observe(sentinel);

    return;
  }

  document.getElementById('search-hits-results').innerHTML = hits.map(renderRow).join('');
};

window.addEventListener('load', () => {
  search.addWidgets([
    searchBox({
      container: '#search-box',
    }),

    connectInfiniteHits(renderInfiniteHits)({
      container: '#search-hits',
    }),
  ]);

  search.start();
})

