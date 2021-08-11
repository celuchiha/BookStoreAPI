export default {
  input: 'dist/es6/angular.js', // rollup requires ES input
  output: {
    format: 'umd',
    name: '@yellicode/angular',
    file: 'dist/bundles/angular.umd.js'
  },
  external: ['@yellicode/core', '@yellicode/typescript'] // https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency
}
