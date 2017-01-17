module.exports = function (config) {
  config.set({
    basePath: '',
    port: 9090,
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['coverage', 'html', 'bamboo', 'mocha'],
    browsers: ['PhantomJS'],
    logLevel: config.LOG_ERROR,
    singleRun: true,
    autoWatch: false,
    preprocessors: {
      'demo/src/**/*.js': ['coverage'],
      'test/mocks/**/*.json': ['json_fixtures']
    },
    mochaReporter: {
      colors: {
        warning: 'orange',
        success: 'green',
        error: 'red',
        info: 'blue'
      },
      symbols: {
        success: '.',
        warning: '!',
        error: 'x',
        info: '#'
      }
    },
    jsonReporter: {
      stdout: true,
      outputFile: 'reports/karma/report.json'
    },
    htmlReporter: {
      outputDir: 'reports/karma',
      subdir: '.',
      namedFiles: true,
      focusOnFailures: false,
      reportName: 'report'
    },
    coverageReporter: {
      type: 'json-summary',
      dir: 'reports/istanbul/',
      file: 'report.json',
      subdir: '.'
    },
    bambooReporter: {
      filename: 'reports/karma/mocha.style.json'
    },
    client: {
      mocha: {
        ui: 'bdd'
      }
    },
    jsonFixturesPreprocessor: {
      stripPrefix: 'test/mocks/',
      variableName: '__mocks__',
      camelizeFilenames: false,
      prependPrefix: ''
    },
    files: [
      'node_modules/promise-polyfill/promise.js',
      'vendor/lodash/lodash.js',
      'vendor/angular/angular.js',
      'demo/build/scripts.js',
      'vendor/angular-mocks/angular-mocks.js',
      'demo/build/templates.js',
      'demo/src/main.js',
      'demo/src/*.js',
      'demo/src/**/*.js',
      'test/overrides/*.js',
      'test/mocks/**/*.json',
      'demo/test/test_suite.js'
    ]
  });
};
