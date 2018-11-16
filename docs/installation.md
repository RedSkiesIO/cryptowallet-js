# Installation

## Direct Download / CDN

https://unpkg.com/cryptowallet-js/dist/cryptowallet-js

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/cryptowallet-js@0.0.1/dist/cryptowallet-js.js
 
Include cryptowallet-js after Vue and it will install itself automatically:

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/cryptowallet-js/dist/cryptowallet-js.js"></script>
```

## NPM

```sh
$ npm install cryptowallet-js
```

## Yarn

```sh
$ yarn add cryptowallet-js
```

When used with a module system, you must explicitly install the `cryptowallet-js` via `Vue.use()`:

```javascript
import Vue from 'vue'
import VuexOrmLokijs from 'cryptowallet-js'

Vue.use(VuexOrmLokijs)
```

You don't need to do this when using global script tags.

## Dev Build

You will have to clone directly from GitHub and build `cryptowallet-js` yourself if
you want to use the latest dev build.

```sh
$ git clone https://github.com/nsh-core/cryptowallet-js.git node_modules/cryptowallet-js
$ cd node_modules/cryptowallet-js
$ npm install
$ npm run build
```

