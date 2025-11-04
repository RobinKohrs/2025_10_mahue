import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.DR5cnY7S.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/W6cPcTdz.js","_app/immutable/chunks/Dn-j4MIw.js","_app/immutable/chunks/CTCIHv8p.js"];
export const stylesheets = ["_app/immutable/assets/2.U1om2X9C.css"];
export const fonts = [];
