module.exports = {
	locales: {
		'/': {
			lang: 'en-US',
			title: 'VuexOrmLokijs',
			description: 'VuexOrmLokijs for Vue.js'
		}
	},
	themeConfig: {
		repo: 'nsh-core/cryptowallet-js',
		docsDir: 'docs',
		locales: {
			'/': {
				label: 'English',
				selectText: 'Languages',
				editLinkText: 'Edit this page on GitHub',
				nav: [{
					text: 'Release Notes',
					link: 'https://github.com/nsh-core/cryptowallet-js/releases'
				}],
				sidebar: [
					'/installation.md',
					'/started.md',
				]
			}
		}
	}
}

