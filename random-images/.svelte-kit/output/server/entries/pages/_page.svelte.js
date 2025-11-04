import "clsx";
import "papaparse";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let accidents = [];
    $$renderer2.push(`<div class="dj-container svelte-1uha8ag">`);
    {
      $$renderer2.push("<!--[!-->");
      if (accidents.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p>Loading accident...</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<p>Loading data...</p>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
