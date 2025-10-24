import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.GOAFGZaw.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/BYQggJ5G.js","_app/immutable/chunks/ClaBONAP.js","_app/immutable/chunks/DAMqwEVp.js"];
export const stylesheets = ["_app/immutable/assets/2.CyFQ74mH.css"];
export const fonts = [];
