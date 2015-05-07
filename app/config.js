require.config({
  paths: {
    d3: '../scripts/d3',
    crossfilter: '../scripts/crossfilter',
  },
  shim: {
    'crossfilter': {
      deps: [],
      exports: 'crossfilter'
    }
  }
});
