import { x as head } from "../../chunks/index.js";
function _layout($$renderer, $$props) {
  let { children } = $$props;
  head($$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Gaza Namenslisten</title>`);
    });
  });
  $$renderer.push(`<div id="dj-app"><main>`);
  children($$renderer);
  $$renderer.push(`<!----></main></div>`);
}
export {
  _layout as default
};
