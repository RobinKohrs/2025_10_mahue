// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true

// Understanding trailingSlash
// The trailingSlash: 'always' option changes the names of the built output
// for each route from /route-name.html to /route-name/index.html. This works
// better for some servers because typically if you navigate to /route-name/
// most web servers will look for an index.html file in the /route-name/ folder.
// In my experience, you typically want to enable this by setting the following
// in your src/routes/+layout.js:
export const trailingSlash = 'never'
// changed it to 'never', this leads to routes being created as .../route.html which works fine on our bucket
