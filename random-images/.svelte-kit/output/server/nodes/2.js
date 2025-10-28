import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.BcPjHyPl.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/JciXBgO1.js","_app/immutable/chunks/C7cZYUl7.js","_app/immutable/chunks/twXSF-M_.js"];
export const stylesheets = ["_app/immutable/assets/2.Bcr-2VvN.css"];
export const fonts = [];
