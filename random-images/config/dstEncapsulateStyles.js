import postcssPrefixSelector from 'postcss-prefix-selector'

/**
 * @param {string} [prefix]
 */
export default function dstEncapsulateStyles(prefix = '.dst-dj') {
	return postcssPrefixSelector({
		prefix,
		transform: function (prefix, selector, prefixedSelector) {
			if (selector.startsWith('html') || selector.startsWith('body')) {
				return selector.replace(/^html|^body/, prefix)
			}
			return prefixedSelector
		}
	})
}
