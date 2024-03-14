var defaultParams = {
  tab : '    ',
  spaceBeforeColon : ' ',
  spaceAfterColon : ' ',
  spaceAfterComma : ' ',
  spaceInsideObject : ' ',
  spaceInsideArray : '',
  shouldExpand : function(obj, level, index) {
      return JSON.stringify(obj).length > 25;
  }
}

function stringify(object, params, level, index) {
  if (!level) {
      var fullParams = {};
      Object.keys(defaultParams).forEach(function(key) {
          fullParams[key] = (params && key in params)? params[key] : defaultParams[key];
      });
      params = fullParams;
      object = JSON.parse(JSON.stringify(object));
      level = 0;
  }

  if (typeof object !== 'object' || object === null) return JSON.stringify(object);

  var isArray = Array.isArray(object),
      bra = isArray? '[' : '{',
      ket = isArray? ']' : '}';

  if (!Object.keys(object).length) return bra + ket;

  var hasExpandedChildren = false,
      children = (isArray? object : Object.keys(object)).reduce(function(children, item, itemIndex) {
          if (!isArray) {
              itemIndex = item;
              item = object[item];
          }
          if (!hasExpandedChildren && typeof item === 'object' && item !== null && params.shouldExpand(item, level + 1, itemIndex)) {
              hasExpandedChildren = true;
          }
          children[itemIndex] = stringify(item, params, level + 1, itemIndex);
          return children;
      }, isArray? [] : {}),
      shouldExpand = hasExpandedChildren || params.shouldExpand(object, level, index),
      indent = new Array(level + 1).join(params.tab),
      spaceInside = shouldExpand?
          '\n' + indent :
          params['spaceInside' + (isArray? 'Array' : 'Object')],
      joiner = shouldExpand?
          ',\n' + indent + params.tab :
          ',' + params.spaceAfterComma;

  if (!isArray) {
      children = Object.keys(children).reduce(function(res, key) {
          return res.concat(JSON.stringify(key) + params.spaceBeforeColon + ':' + params.spaceAfterColon + children[key]);
      }, []);
  }

  return bra + spaceInside + (shouldExpand? params.tab : '') + children.join(joiner) + spaceInside + ket;
}

if (typeof module == 'object' && typeof module.exports == 'object') {
  module.exports = stringify;
} else if (typeof define == 'function') {
  define(function() { return stringify; });
} else { 
  globalThis.jsonPrint = stringify;
}