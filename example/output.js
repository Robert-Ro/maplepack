;(function (modules) {
  const require = (id) => {
    const { factory, map } = modules[id]
    const localeRequire = (requireDeclartionName) => require(map[requireDeclartionName])
    const module = { exports: {} }
    factory(module.exports, localeRequire)
    return module.exports
  }
  require('15318717-d2f0-48ea-801c-6d67d4779d54')
})({
  '15318717-d2f0-48ea-801c-6d67d4779d54': {
    factory: (exports, require) => {
      'use strict'

      var _square = _interopRequireDefault(require('./square.js'))

      var _circle = _interopRequireDefault(require('./circle.js'))

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj }
      }

      console.log('Area of square: ', (0, _square['default'])(5))
      console.log('Area of circle', (0, _circle['default'])(5))
    },
    map: {
      './square.js': 'cfb67bd0-57c3-4678-9798-71785a893201',
      './circle.js': '390664db-c5b2-484f-a3aa-300ed8dfab80',
    },
  },
  'cfb67bd0-57c3-4678-9798-71785a893201': {
    factory: (exports, require) => {
      'use strict'

      Object.defineProperty(exports, '__esModule', {
        value: true,
      })
      exports['default'] = area

      function area(side) {
        return side * side
      }
    },
    map: {},
  },
  '390664db-c5b2-484f-a3aa-300ed8dfab80': {
    factory: (exports, require) => {
      'use strict'

      Object.defineProperty(exports, '__esModule', {
        value: true,
      })
      exports['default'] = area
      var PI = 3.141

      function area(radius) {
        return PI * radius * radius
      }
    },
    map: {},
  },
})
