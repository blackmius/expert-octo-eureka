import WindiCSS from 'vite-plugin-windicss'

export default {
	plugins: [WindiCSS({
		scan: {
			dirs: ['.'], // all files in the cwd
			fileExtensions: ['js'], // also enabled scanning for js/ts
		},
		preflight: { enableAll: true }
	})]
}