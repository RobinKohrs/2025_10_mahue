
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/iframe-test" | "/patterns";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/iframe-test": Record<string, never>;
			"/patterns": Record<string, never>
		};
		Pathname(): "/" | "/iframe-test" | "/iframe-test/" | "/patterns" | "/patterns/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.DS_Store" | "/favicon.png" | "/logo.webp" | "/sample-data.csv" | "/unfaelle_mahue.csv" | "/unfaellle_mh.csv" | string & {};
	}
}