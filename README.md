## Git
```bash
git clone https://github.com/jcarrizalez/test_ar_react_js.git;
```

## Configuration

Configura las variables de entorno a usar como dirección de la API, entre otras.
```bash
test_ar_react_js/
├── .env
```
Puerto por defecto: PORT=8881
```bash
test_ar_react_js/
├── package.json
```
## Installation

```bash
$ npm install; 
```
## Execute

```bash
$ npm run local
```

## Build

```bash
$ npm run build-production
```
## Structure

```bash
test_ar_react_js/
├── .env
├── README.md
├── package.json
├── public/
│   ├── manifest.json
│   ├── index.html
│   └── ...
└── src
    ├── assets
    │   ├── css
    │   │   └── ...
    │   ├── scss
    │   │   └── ...
    │   └── main.scss
    │
    ├── components
    │   ├── ...js
    │   ├── Books.js
    │   ├── Search.js
    │   ├── Content.js
    │   ├── BookTitle.js
    │   └── BookReader.js
    │
    ├── ...js
    ├── index.js
    ├── Router.js
    └── services.js

```