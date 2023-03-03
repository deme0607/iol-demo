const searchClient = algoliasearch('GPJ5WFKVPJ', '17367d0030647003e11fd7e0ac5f8e34');

const search = instantsearch({
  indexName: 'iol_demo',
  searchClient,
});

const { searchBox, hits } = instantsearch.widgets;
const { connectHits } = instantsearch.connectors;

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

const renderHits = (renderOptions, isFirstRender) => {
  const { hits } = renderOptions;

  document.querySelector('#search-hits').innerHTML = `
    <table>
      <tr>
        <th>Episode</th>
        <th>Time</th>
        <th>Speaker</th>
        <th>Content</th>
      </tr>
      ${hits
        .map(
          // TODO: Dynamic link for episodes
          item =>
            `<tr>
              <td><a href="${BASE_URL}/episode/2022-08-28">${item.episode}</a></td>
              <td>${formatTimestamp(item.start_time)}</td>
              <td>${item.speaker}</td>
              <td>${instantsearch.highlight({attribute: 'content', hit: item})}</td>
            </tr>`
        )
        .join('')}
    </table>
  `;
};

const customHits = connectHits(renderHits)

window.addEventListener('load', () => {
  search.addWidgets([
    searchBox({
      container: '#search-box',
    }),

    customHits(),
  ]);

  search.start();
})

