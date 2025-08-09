// phpcs:ignoreFile
/**
 * @popperjs/core v2.11.8 - MIT License
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Popper = {}));
}(this, (function (exports) { 'use strict';

  function getWindow(node) {
    if (node == null) {
      return window;
    }

    if (node.toString() !== '[object Window]') {
      var ownerDocument = node.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView || window : window;
    }

    return node;
  }

  function isElement(node) {
    var OwnElement = getWindow(node).Element;
    return node instanceof OwnElement || node instanceof Element;
  }

  function isHTMLElement(node) {
    var OwnElement = getWindow(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
  }

  function isShadowRoot(node) {
    // IE 11 has no ShadowRoot
    if (typeof ShadowRoot === 'undefined') {
      return false;
    }

    var OwnElement = getWindow(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
  }

  var max = Math.max;
  var min = Math.min;
  var round = Math.round;

  function getUAString() {
    var uaData = navigator.userAgentData;

    if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
      return uaData.brands.map(function (item) {
        return item.brand + "/" + item.version;
      }).join(' ');
    }

    return navigator.userAgent;
  }

  function isLayoutViewport() {
    return !/^((?!chrome|android).)*safari/i.test(getUAString());
  }

  function getBoundingClientRect(element, includeScale, isFixedStrategy) {
    if (includeScale === void 0) {
      includeScale = false;
    }

    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }

    var clientRect = element.getBoundingClientRect();
    var scaleX = 1;
    var scaleY = 1;

    if (includeScale && isHTMLElement(element)) {
      scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
      scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
    }

    var _ref = isElement(element) ? getWindow(element) : window,
        visualViewport = _ref.visualViewport;

    var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
    var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
    var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
    var width = clientRect.width / scaleX;
    var height = clientRect.height / scaleY;
    return {
      width: width,
      height: height,
      top: y,
      right: x + width,
      bottom: y + height,
      left: x,
      x: x,
      y: y
    };
  }

  function getWindowScroll(node) {
    var win = getWindow(node);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
      scrollLeft: scrollLeft,
      scrollTop: scrollTop
    };
  }

  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }

  function getNodeScroll(node) {
    if (node === getWindow(node) || !isHTMLElement(node)) {
      return getWindowScroll(node);
    } else {
      return getHTMLElementScroll(node);
    }
  }

  function getNodeName(element) {
    return element ? (element.nodeName || '').toLowerCase() : null;
  }

  function getDocumentElement(element) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
    element.document) || window.document).documentElement;
  }

  function getWindowScrollBarX(element) {
    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    // Popper 1 is broken in this case and never had a bug report so let's assume
    // it's not an issue. I don't think anyone ever specifies width on <html>
    // anyway.
    // Browsers where the left scrollbar doesn't cause an issue report `0` for
    // this (e.g. Edge 2019, IE11, Safari)
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
  }

  function getComputedStyle(element) {
    return getWindow(element).getComputedStyle(element);
  }

  function isScrollParent(element) {
    // Firefox wants us to check `-x` and `-y` variations as well
    var _getComputedStyle = getComputedStyle(element),
        overflow = _getComputedStyle.overflow,
        overflowX = _getComputedStyle.overflowX,
        overflowY = _getComputedStyle.overflowY;

    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }

  function isElementScaled(element) {
    var rect = element.getBoundingClientRect();
    var scaleX = round(rect.width) / element.offsetWidth || 1;
    var scaleY = round(rect.height) / element.offsetHeight || 1;
    return scaleX !== 1 || scaleY !== 1;
  } // Returns the composite rect of an element relative to its offsetParent.
  // Composite means it takes into account transforms as well as layout.


  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }

    var isOffsetParentAnElement = isHTMLElement(offsetParent);
    var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
    var documentElement = getDocumentElement(offsetParent);
    var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    var offsets = {
      x: 0,
      y: 0
    };

    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
      isScrollParent(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }

      if (isHTMLElement(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent, true);
        offsets.x += offsetParent.clientLeft;
        offsets.y += offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }

    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }

  // means it doesn't take into account transforms.

  function getLayoutRect(element) {
    var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
    // Fixes https://github.com/popperjs/popper-core/issues/1223

    var width = element.offsetWidth;
    var height = element.offsetHeight;

    if (Math.abs(clientRect.width - width) <= 1) {
      width = clientRect.width;
    }

    if (Math.abs(clientRect.height - height) <= 1) {
      height = clientRect.height;
    }

    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: width,
      height: height
    };
  }

  function getParentNode(element) {
    if (getNodeName(element) === 'html') {
      return element;
    }

    return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
      // $FlowFixMe[incompatible-return]
      // $FlowFixMe[prop-missing]
      element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
      element.parentNode || ( // DOM Element detected
      isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
      getDocumentElement(element) // fallback

    );
  }

  function getScrollParent(node) {
    if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return node.ownerDocument.body;
    }

    if (isHTMLElement(node) && isScrollParent(node)) {
      return node;
    }

    return getScrollParent(getParentNode(node));
  }

  /*
  given a DOM element, return the list of all scroll parents, up the list of ancesors
  until we get to the top window object. This list is what we attach scroll listeners
  to, because if any of these parent elements scroll, we'll need to re-calculate the
  reference element's position.
  */

  function listScrollParents(element, list) {
    var _element$ownerDocumen;

    if (list === void 0) {
      list = [];
    }

    var scrollParent = getScrollParent(element);
    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
    var win = getWindow(scrollParent);
    var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)));
  }

  function isTableElement(element) {
    return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
  }

  function getTrueOffsetParent(element) {
    if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
    getComputedStyle(element).position === 'fixed') {
      return null;
    }

    return element.offsetParent;
  } // `.offsetParent` reports `null` for fixed elements, while absolute elements
  // return the containing block


  function getContainingBlock(element) {
    var isFirefox = /firefox/i.test(getUAString());
    var isIE = /Trident/i.test(getUAString());

    if (isIE && isHTMLElement(element)) {
      // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
      var elementCss = getComputedStyle(element);

      if (elementCss.position === 'fixed') {
        return null;
      }
    }

    var currentNode = getParentNode(element);

    if (isShadowRoot(currentNode)) {
      currentNode = currentNode.host;
    }

    while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
      var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
      // create a containing block.
      // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

      if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
        return currentNode;
      } else {
        currentNode = currentNode.parentNode;
      }
    }

    return null;
  } // Gets the closest ancestor positioned element. Handles some edge cases,
  // such as table ancestors and cross browser bugs.


  function getOffsetParent(element) {
    var window = getWindow(element);
    var offsetParent = getTrueOffsetParent(element);

    while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
      offsetParent = getTrueOffsetParent(offsetParent);
    }

    if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
      return window;
    }

    return offsetParent || getContainingBlock(element) || window;
  }

  var top = 'top';
  var bottom = 'bottom';
  var right = 'right';
  var left = 'left';
  var auto = 'auto';
  var basePlacements = [top, bottom, right, left];
  var start = 'start';
  var end = 'end';
  var clippingParents = 'clippingParents';
  var viewport = 'viewport';
  var popper = 'popper';
  var reference = 'reference';
  var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
    return acc.concat([placement + "-" + start, placement + "-" + end]);
  }, []);
  var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
    return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
  }, []); // modifiers that need to read the DOM

  var beforeRead = 'beforeRead';
  var read = 'read';
  var afterRead = 'afterRead'; // pure-logic modifiers

  var beforeMain = 'beforeMain';
  var main = 'main';
  var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

  var beforeWrite = 'beforeWrite';
  var write = 'write';
  var afterWrite = 'afterWrite';
  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

  function order(modifiers) {
    var map = new Map();
    var visited = new Set();
    var result = [];
    modifiers.forEach(function (modifier) {
      map.set(modifier.name, modifier);
    }); // On visiting object, check for its dependencies and visit them recursively

    function sort(modifier) {
      visited.add(modifier.name);
      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
      requires.forEach(function (dep) {
        if (!visited.has(dep)) {
          var depModifier = map.get(dep);

          if (depModifier) {
            sort(depModifier);
          }
        }
      });
      result.push(modifier);
    }

    modifiers.forEach(function (modifier) {
      if (!visited.has(modifier.name)) {
        // check for visited object
        sort(modifier);
      }
    });
    return result;
  }

  function orderModifiers(modifiers) {
    // order based on dependencies
    var orderedModifiers = order(modifiers); // order based on phase

    return modifierPhases.reduce(function (acc, phase) {
      return acc.concat(orderedModifiers.filter(function (modifier) {
        return modifier.phase === phase;
      }));
    }, []);
  }

  function debounce(fn) {
    var pending;
    return function () {
      if (!pending) {
        pending = new Promise(function (resolve) {
          Promise.resolve().then(function () {
            pending = undefined;
            resolve(fn());
          });
        });
      }

      return pending;
    };
  }

  function mergeByName(modifiers) {
    var merged = modifiers.reduce(function (merged, current) {
      var existing = merged[current.name];
      merged[current.name] = existing ? Object.assign({}, existing, current, {
        options: Object.assign({}, existing.options, current.options),
        data: Object.assign({}, existing.data, current.data)
      }) : current;
      return merged;
    }, {}); // IE11 does not support Object.values

    return Object.keys(merged).map(function (key) {
      return merged[key];
    });
  }

  function getViewportRect(element, strategy) {
    var win = getWindow(element);
    var html = getDocumentElement(element);
    var visualViewport = win.visualViewport;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var x = 0;
    var y = 0;

    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      var layoutViewport = isLayoutViewport();

      if (layoutViewport || !layoutViewport && strategy === 'fixed') {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }

    return {
      width: width,
      height: height,
      x: x + getWindowScrollBarX(element),
      y: y
    };
  }

  // of the `<html>` and `<body>` rect bounds if horizontally scrollable

  function getDocumentRect(element) {
    var _element$ownerDocumen;

    var html = getDocumentElement(element);
    var winScroll = getWindowScroll(element);
    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
    var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
    var y = -winScroll.scrollTop;

    if (getComputedStyle(body || html).direction === 'rtl') {
      x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
    }

    return {
      width: width,
      height: height,
      x: x,
      y: y
    };
  }

  function contains(parent, child) {
    var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

    if (parent.contains(child)) {
      return true;
    } // then fallback to custom implementation with Shadow DOM support
    else if (rootNode && isShadowRoot(rootNode)) {
        var next = child;

        do {
          if (next && parent.isSameNode(next)) {
            return true;
          } // $FlowFixMe[prop-missing]: need a better way to handle this...


          next = next.parentNode || next.host;
        } while (next);
      } // Give up, the result is false


    return false;
  }

  function rectToClientRect(rect) {
    return Object.assign({}, rect, {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    });
  }

  function getInnerBoundingClientRect(element, strategy) {
    var rect = getBoundingClientRect(element, false, strategy === 'fixed');
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
  }

  function getClientRectFromMixedType(element, clippingParent, strategy) {
    return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
  } // A "clipping parent" is an overflowable container with the characteristic of
  // clipping (or hiding) overflowing elements with a position different from
  // `initial`


  function getClippingParents(element) {
    var clippingParents = listScrollParents(getParentNode(element));
    var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
    var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

    if (!isElement(clipperElement)) {
      return [];
    } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


    return clippingParents.filter(function (clippingParent) {
      return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
    });
  } // Gets the maximum area that the element is visible in due to any number of
  // clipping parents


  function getClippingRect(element, boundary, rootBoundary, strategy) {
    var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
    var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
    var firstClippingParent = clippingParents[0];
    var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
      var rect = getClientRectFromMixedType(element, clippingParent, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromMixedType(element, firstClippingParent, strategy));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
  }

  function getBasePlacement(placement) {
    return placement.split('-')[0];
  }

  function getVariation(placement) {
    return placement.split('-')[1];
  }

  function getMainAxisFromPlacement(placement) {
    return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
  }

  function computeOffsets(_ref) {
    var reference = _ref.reference,
        element = _ref.element,
        placement = _ref.placement;
    var basePlacement = placement ? getBasePlacement(placement) : null;
    var variation = placement ? getVariation(placement) : null;
    var commonX = reference.x + reference.width / 2 - element.width / 2;
    var commonY = reference.y + reference.height / 2 - element.height / 2;
    var offsets;

    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference.y - element.height
        };
        break;

      case bottom:
        offsets = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;

      case right:
        offsets = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;

      case left:
        offsets = {
          x: reference.x - element.width,
          y: commonY
        };
        break;

      default:
        offsets = {
          x: reference.x,
          y: reference.y
        };
    }

    var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

    if (mainAxis != null) {
      var len = mainAxis === 'y' ? 'height' : 'width';

      switch (variation) {
        case start:
          offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
          break;

        case end:
          offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
          break;
      }
    }

    return offsets;
  }

  function getFreshSideObject() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }

  function mergePaddingObject(paddingObject) {
    return Object.assign({}, getFreshSideObject(), paddingObject);
  }

  function expandToHashMap(value, keys) {
    return keys.reduce(function (hashMap, key) {
      hashMap[key] = value;
      return hashMap;
    }, {});
  }

  function detectOverflow(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        _options$placement = _options.placement,
        placement = _options$placement === void 0 ? state.placement : _options$placement,
        _options$strategy = _options.strategy,
        strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
        _options$boundary = _options.boundary,
        boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
        _options$rootBoundary = _options.rootBoundary,
        rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
        _options$elementConte = _options.elementContext,
        elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
        _options$altBoundary = _options.altBoundary,
        altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
        _options$padding = _options.padding,
        padding = _options$padding === void 0 ? 0 : _options$padding;
    var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    var altContext = elementContext === popper ? reference : popper;
    var popperRect = state.rects.popper;
    var element = state.elements[altBoundary ? altContext : elementContext];
    var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
    var referenceClientRect = getBoundingClientRect(state.elements.reference);
    var popperOffsets = computeOffsets({
      reference: referenceClientRect,
      element: popperRect,
      strategy: 'absolute',
      placement: placement
    });
    var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
    var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
    // 0 or negative = within the clipping rect

    var overflowOffsets = {
      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
      bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
      left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
      right: elementClientRect.right - clippingClientRect.right + paddingObject.right
    };
    var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

    if (elementContext === popper && offsetData) {
      var offset = offsetData[placement];
      Object.keys(overflowOffsets).forEach(function (key) {
        var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
        var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
        overflowOffsets[key] += offset[axis] * multiply;
      });
    }

    return overflowOffsets;
  }

  var DEFAULT_OPTIONS = {
    placement: 'bottom',
    modifiers: [],
    strategy: 'absolute'
  };

  function areValidElements() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return !args.some(function (element) {
      return !(element && typeof element.getBoundingClientRect === 'function');
    });
  }

  function popperGenerator(generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }

    var _generatorOptions = generatorOptions,
        _generatorOptions$def = _generatorOptions.defaultModifiers,
        defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
        _generatorOptions$def2 = _generatorOptions.defaultOptions,
        defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper(reference, popper, options) {
      if (options === void 0) {
        options = defaultOptions;
      }

      var state = {
        placement: 'bottom',
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
        modifiersData: {},
        elements: {
          reference: reference,
          popper: popper
        },
        attributes: {},
        styles: {}
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance = {
        state: state,
        setOptions: function setOptions(setOptionsAction) {
          var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
          cleanupModifierEffects();
          state.options = Object.assign({}, defaultOptions, state.options, options);
          state.scrollParents = {
            reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
            popper: listScrollParents(popper)
          }; // Orders the modifiers based on their dependencies and `phase`
          // properties

          var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

          state.orderedModifiers = orderedModifiers.filter(function (m) {
            return m.enabled;
          });
          runModifierEffects();
          return instance.update();
        },
        // Sync update – it will always be executed, even if not necessary. This
        // is useful for low frequency updates where sync behavior simplifies the
        // logic.
        // For high frequency updates (e.g. `resize` and `scroll` events), always
        // prefer the async Popper#update method
        forceUpdate: function forceUpdate() {
          if (isDestroyed) {
            return;
          }

          var _state$elements = state.elements,
              reference = _state$elements.reference,
              popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
          // anymore

          if (!areValidElements(reference, popper)) {
            return;
          } // Store the reference and popper rects to be read by modifiers


          state.rects = {
            reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
            popper: getLayoutRect(popper)
          }; // Modifiers have the ability to reset the current update cycle. The
          // most common use case for this is the `flip` modifier changing the
          // placement, which then needs to re-run all the modifiers, because the
          // logic was previously ran for the previous placement and is therefore
          // stale/incorrect

          state.reset = false;
          state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
          // is filled with the initial data specified by the modifier. This means
          // it doesn't persist and is fresh on each update.
          // To ensure persistent data, use `${name}#persistent`

          state.orderedModifiers.forEach(function (modifier) {
            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
          });

          for (var index = 0; index < state.orderedModifiers.length; index++) {
            if (state.reset === true) {
              state.reset = false;
              index = -1;
              continue;
            }

            var _state$orderedModifie = state.orderedModifiers[index],
                fn = _state$orderedModifie.fn,
                _state$orderedModifie2 = _state$orderedModifie.options,
                _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                name = _state$orderedModifie.name;

            if (typeof fn === 'function') {
              state = fn({
                state: state,
                options: _options,
                name: name,
                instance: instance
              }) || state;
            }
          }
        },
        // Async and optimistically optimized update – it will not be executed if
        // not necessary (debounced to run at most once-per-tick)
        update: debounce(function () {
          return new Promise(function (resolve) {
            instance.forceUpdate();
            resolve(state);
          });
        }),
        destroy: function destroy() {
          cleanupModifierEffects();
          isDestroyed = true;
        }
      };

      if (!areValidElements(reference, popper)) {
        return instance;
      }

      instance.setOptions(options).then(function (state) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state);
        }
      }); // Modifiers have the ability to execute arbitrary code before the first
      // update cycle runs. They will be executed in the same order as the update
      // cycle. This is useful when a modifier adds some persistent data that
      // other modifiers need to use, but the modifier is run after the dependent
      // one.

      function runModifierEffects() {
        state.orderedModifiers.forEach(function (_ref) {
          var name = _ref.name,
              _ref$options = _ref.options,
              options = _ref$options === void 0 ? {} : _ref$options,
              effect = _ref.effect;

          if (typeof effect === 'function') {
            var cleanupFn = effect({
              state: state,
              name: name,
              instance: instance,
              options: options
            });

            var noopFn = function noopFn() {};

            effectCleanupFns.push(cleanupFn || noopFn);
          }
        });
      }

      function cleanupModifierEffects() {
        effectCleanupFns.forEach(function (fn) {
          return fn();
        });
        effectCleanupFns = [];
      }

      return instance;
    };
  }

  var passive = {
    passive: true
  };

  function effect$2(_ref) {
    var state = _ref.state,
        instance = _ref.instance,
        options = _ref.options;
    var _options$scroll = options.scroll,
        scroll = _options$scroll === void 0 ? true : _options$scroll,
        _options$resize = options.resize,
        resize = _options$resize === void 0 ? true : _options$resize;
    var window = getWindow(state.elements.popper);
    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.addEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.addEventListener('resize', instance.update, passive);
    }

    return function () {
      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.removeEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.removeEventListener('resize', instance.update, passive);
      }
    };
  } // eslint-disable-next-line import/no-unused-modules


  var eventListeners = {
    name: 'eventListeners',
    enabled: true,
    phase: 'write',
    fn: function fn() {},
    effect: effect$2,
    data: {}
  };

  function popperOffsets(_ref) {
    var state = _ref.state,
        name = _ref.name;
    // Offsets are the actual position the popper needs to have to be
    // properly positioned near its reference element
    // This is the most basic placement, and will be adjusted by
    // the modifiers in the next step
    state.modifiersData[name] = computeOffsets({
      reference: state.rects.reference,
      element: state.rects.popper,
      strategy: 'absolute',
      placement: state.placement
    });
  } // eslint-disable-next-line import/no-unused-modules


  var popperOffsets$1 = {
    name: 'popperOffsets',
    enabled: true,
    phase: 'read',
    fn: popperOffsets,
    data: {}
  };

  var unsetSides = {
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto'
  }; // Round the offsets to the nearest suitable subpixel based on the DPR.
  // Zooming can change the DPR, but it seems to report a value that will
  // cleanly divide the values into the appropriate subpixels.

  function roundOffsetsByDPR(_ref, win) {
    var x = _ref.x,
        y = _ref.y;
    var dpr = win.devicePixelRatio || 1;
    return {
      x: round(x * dpr) / dpr || 0,
      y: round(y * dpr) / dpr || 0
    };
  }

  function mapToStyles(_ref2) {
    var _Object$assign2;

    var popper = _ref2.popper,
        popperRect = _ref2.popperRect,
        placement = _ref2.placement,
        variation = _ref2.variation,
        offsets = _ref2.offsets,
        position = _ref2.position,
        gpuAcceleration = _ref2.gpuAcceleration,
        adaptive = _ref2.adaptive,
        roundOffsets = _ref2.roundOffsets,
        isFixed = _ref2.isFixed;
    var _offsets$x = offsets.x,
        x = _offsets$x === void 0 ? 0 : _offsets$x,
        _offsets$y = offsets.y,
        y = _offsets$y === void 0 ? 0 : _offsets$y;

    var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
      x: x,
      y: y
    }) : {
      x: x,
      y: y
    };

    x = _ref3.x;
    y = _ref3.y;
    var hasX = offsets.hasOwnProperty('x');
    var hasY = offsets.hasOwnProperty('y');
    var sideX = left;
    var sideY = top;
    var win = window;

    if (adaptive) {
      var offsetParent = getOffsetParent(popper);
      var heightProp = 'clientHeight';
      var widthProp = 'clientWidth';

      if (offsetParent === getWindow(popper)) {
        offsetParent = getDocumentElement(popper);

        if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
          heightProp = 'scrollHeight';
          widthProp = 'scrollWidth';
        }
      } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


      offsetParent = offsetParent;

      if (placement === top || (placement === left || placement === right) && variation === end) {
        sideY = bottom;
        var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
        offsetParent[heightProp];
        y -= offsetY - popperRect.height;
        y *= gpuAcceleration ? 1 : -1;
      }

      if (placement === left || (placement === top || placement === bottom) && variation === end) {
        sideX = right;
        var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
        offsetParent[widthProp];
        x -= offsetX - popperRect.width;
        x *= gpuAcceleration ? 1 : -1;
      }
    }

    var commonStyles = Object.assign({
      position: position
    }, adaptive && unsetSides);

    var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
      x: x,
      y: y
    }, getWindow(popper)) : {
      x: x,
      y: y
    };

    x = _ref4.x;
    y = _ref4.y;

    if (gpuAcceleration) {
      var _Object$assign;

      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
    }

    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
  }

  function computeStyles(_ref5) {
    var state = _ref5.state,
        options = _ref5.options;
    var _options$gpuAccelerat = options.gpuAcceleration,
        gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
        _options$adaptive = options.adaptive,
        adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
        _options$roundOffsets = options.roundOffsets,
        roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
    var commonStyles = {
      placement: getBasePlacement(state.placement),
      variation: getVariation(state.placement),
      popper: state.elements.popper,
      popperRect: state.rects.popper,
      gpuAcceleration: gpuAcceleration,
      isFixed: state.options.strategy === 'fixed'
    };

    if (state.modifiersData.popperOffsets != null) {
      state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive: adaptive,
        roundOffsets: roundOffsets
      })));
    }

    if (state.modifiersData.arrow != null) {
      state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        position: 'absolute',
        adaptive: false,
        roundOffsets: roundOffsets
      })));
    }

    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-placement': state.placement
    });
  } // eslint-disable-next-line import/no-unused-modules


  var computeStyles$1 = {
    name: 'computeStyles',
    enabled: true,
    phase: 'beforeWrite',
    fn: computeStyles,
    data: {}
  };

  // and applies them to the HTMLElements such as popper and arrow

  function applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach(function (name) {
      var style = state.styles[name] || {};
      var attributes = state.attributes[name] || {};
      var element = state.elements[name]; // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      } // Flow doesn't support to extend this property, but it's the most
      // effective way to apply styles to an HTMLElement
      // $FlowFixMe[cannot-write]


      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (name) {
        var value = attributes[name];

        if (value === false) {
          element.removeAttribute(name);
        } else {
          element.setAttribute(name, value === true ? '' : value);
        }
      });
    });
  }

  function effect$1(_ref2) {
    var state = _ref2.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: '0',
        top: '0',
        margin: '0'
      },
      arrow: {
        position: 'absolute'
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;

    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }

    return function () {
      Object.keys(state.elements).forEach(function (name) {
        var element = state.elements[name];
        var attributes = state.attributes[name] || {};
        var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

        var style = styleProperties.reduce(function (style, property) {
          style[property] = '';
          return style;
        }, {}); // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        }

        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (attribute) {
          element.removeAttribute(attribute);
        });
      });
    };
  } // eslint-disable-next-line import/no-unused-modules


  var applyStyles$1 = {
    name: 'applyStyles',
    enabled: true,
    phase: 'write',
    fn: applyStyles,
    effect: effect$1,
    requires: ['computeStyles']
  };

  function distanceAndSkiddingToXY(placement, rects, offset) {
    var basePlacement = getBasePlacement(placement);
    var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

    var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
      placement: placement
    })) : offset,
        skidding = _ref[0],
        distance = _ref[1];

    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [left, right].indexOf(basePlacement) >= 0 ? {
      x: distance,
      y: skidding
    } : {
      x: skidding,
      y: distance
    };
  }

  function offset(_ref2) {
    var state = _ref2.state,
        options = _ref2.options,
        name = _ref2.name;
    var _options$offset = options.offset,
        offset = _options$offset === void 0 ? [0, 0] : _options$offset;
    var data = placements.reduce(function (acc, placement) {
      acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
      return acc;
    }, {});
    var _data$state$placement = data[state.placement],
        x = _data$state$placement.x,
        y = _data$state$placement.y;

    if (state.modifiersData.popperOffsets != null) {
      state.modifiersData.popperOffsets.x += x;
      state.modifiersData.popperOffsets.y += y;
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules


  var offset$1 = {
    name: 'offset',
    enabled: true,
    phase: 'main',
    requires: ['popperOffsets'],
    fn: offset
  };

  var hash$1 = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
  };
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash$1[matched];
    });
  }

  var hash = {
    start: 'end',
    end: 'start'
  };
  function getOppositeVariationPlacement(placement) {
    return placement.replace(/start|end/g, function (matched) {
      return hash[matched];
    });
  }

  function computeAutoPlacement(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        placement = _options.placement,
        boundary = _options.boundary,
        rootBoundary = _options.rootBoundary,
        padding = _options.padding,
        flipVariations = _options.flipVariations,
        _options$allowedAutoP = _options.allowedAutoPlacements,
        allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
    var variation = getVariation(placement);
    var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
      return getVariation(placement) === variation;
    }) : basePlacements;
    var allowedPlacements = placements$1.filter(function (placement) {
      return allowedAutoPlacements.indexOf(placement) >= 0;
    });

    if (allowedPlacements.length === 0) {
      allowedPlacements = placements$1;
    } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


    var overflows = allowedPlacements.reduce(function (acc, placement) {
      acc[placement] = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding
      })[getBasePlacement(placement)];
      return acc;
    }, {});
    return Object.keys(overflows).sort(function (a, b) {
      return overflows[a] - overflows[b];
    });
  }

  function getExpandedFallbackPlacements(placement) {
    if (getBasePlacement(placement) === auto) {
      return [];
    }

    var oppositePlacement = getOppositePlacement(placement);
    return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
  }

  function flip(_ref) {
    var state = _ref.state,
        options = _ref.options,
        name = _ref.name;

    if (state.modifiersData[name]._skip) {
      return;
    }

    var _options$mainAxis = options.mainAxis,
        checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
        _options$altAxis = options.altAxis,
        checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
        specifiedFallbackPlacements = options.fallbackPlacements,
        padding = options.padding,
        boundary = options.boundary,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        _options$flipVariatio = options.flipVariations,
        flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
        allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state.options.placement;
    var basePlacement = getBasePlacement(preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
    var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
      return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        flipVariations: flipVariations,
        allowedAutoPlacements: allowedAutoPlacements
      }) : placement);
    }, []);
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var checksMap = new Map();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements[0];

    for (var i = 0; i < placements.length; i++) {
      var placement = placements[i];

      var _basePlacement = getBasePlacement(placement);

      var isStartVariation = getVariation(placement) === start;
      var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
      var len = isVertical ? 'width' : 'height';
      var overflow = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        altBoundary: altBoundary,
        padding: padding
      });
      var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

      if (referenceRect[len] > popperRect[len]) {
        mainVariationSide = getOppositePlacement(mainVariationSide);
      }

      var altVariationSide = getOppositePlacement(mainVariationSide);
      var checks = [];

      if (checkMainAxis) {
        checks.push(overflow[_basePlacement] <= 0);
      }

      if (checkAltAxis) {
        checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
      }

      if (checks.every(function (check) {
        return check;
      })) {
        firstFittingPlacement = placement;
        makeFallbackChecks = false;
        break;
      }

      checksMap.set(placement, checks);
    }

    if (makeFallbackChecks) {
      // `2` may be desired in some cases – research later
      var numberOfChecks = flipVariations ? 3 : 1;

      var _loop = function _loop(_i) {
        var fittingPlacement = placements.find(function (placement) {
          var checks = checksMap.get(placement);

          if (checks) {
            return checks.slice(0, _i).every(function (check) {
              return check;
            });
          }
        });

        if (fittingPlacement) {
          firstFittingPlacement = fittingPlacement;
          return "break";
        }
      };

      for (var _i = numberOfChecks; _i > 0; _i--) {
        var _ret = _loop(_i);

        if (_ret === "break") break;
      }
    }

    if (state.placement !== firstFittingPlacement) {
      state.modifiersData[name]._skip = true;
      state.placement = firstFittingPlacement;
      state.reset = true;
    }
  } // eslint-disable-next-line import/no-unused-modules


  var flip$1 = {
    name: 'flip',
    enabled: true,
    phase: 'main',
    fn: flip,
    requiresIfExists: ['offset'],
    data: {
      _skip: false
    }
  };

  function getAltAxis(axis) {
    return axis === 'x' ? 'y' : 'x';
  }

  function within(min$1, value, max$1) {
    return max(min$1, min(value, max$1));
  }
  function withinMaxClamp(min, value, max) {
    var v = within(min, value, max);
    return v > max ? max : v;
  }

  function preventOverflow(_ref) {
    var state = _ref.state,
        options = _ref.options,
        name = _ref.name;
    var _options$mainAxis = options.mainAxis,
        checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
        _options$altAxis = options.altAxis,
        checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
        boundary = options.boundary,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        padding = options.padding,
        _options$tether = options.tether,
        tether = _options$tether === void 0 ? true : _options$tether,
        _options$tetherOffset = options.tetherOffset,
        tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
    var overflow = detectOverflow(state, {
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      altBoundary: altBoundary
    });
    var basePlacement = getBasePlacement(state.placement);
    var variation = getVariation(state.placement);
    var isBasePlacement = !variation;
    var mainAxis = getMainAxisFromPlacement(basePlacement);
    var altAxis = getAltAxis(mainAxis);
    var popperOffsets = state.modifiersData.popperOffsets;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
      placement: state.placement
    })) : tetherOffset;
    var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
      mainAxis: tetherOffsetValue,
      altAxis: tetherOffsetValue
    } : Object.assign({
      mainAxis: 0,
      altAxis: 0
    }, tetherOffsetValue);
    var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
    var data = {
      x: 0,
      y: 0
    };

    if (!popperOffsets) {
      return;
    }

    if (checkMainAxis) {
      var _offsetModifierState$;

      var mainSide = mainAxis === 'y' ? top : left;
      var altSide = mainAxis === 'y' ? bottom : right;
      var len = mainAxis === 'y' ? 'height' : 'width';
      var offset = popperOffsets[mainAxis];
      var min$1 = offset + overflow[mainSide];
      var max$1 = offset - overflow[altSide];
      var additive = tether ? -popperRect[len] / 2 : 0;
      var minLen = variation === start ? referenceRect[len] : popperRect[len];
      var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
      // outside the reference bounds

      var arrowElement = state.elements.arrow;
      var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
        width: 0,
        height: 0
      };
      var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
      var arrowPaddingMin = arrowPaddingObject[mainSide];
      var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
      // to include its full size in the calculation. If the reference is small
      // and near the edge of a boundary, the popper can overflow even if the
      // reference is not overflowing as well (e.g. virtual elements with no
      // width or height)

      var arrowLen = within(0, referenceRect[len], arrowRect[len]);
      var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
      var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
      var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
      var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
      var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
      var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
      var tetherMax = offset + maxOffset - offsetModifierValue;
      var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
      popperOffsets[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset;
    }

    if (checkAltAxis) {
      var _offsetModifierState$2;

      var _mainSide = mainAxis === 'x' ? top : left;

      var _altSide = mainAxis === 'x' ? bottom : right;

      var _offset = popperOffsets[altAxis];

      var _len = altAxis === 'y' ? 'height' : 'width';

      var _min = _offset + overflow[_mainSide];

      var _max = _offset - overflow[_altSide];

      var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

      var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

      var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

      var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

      var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

      popperOffsets[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules


  var preventOverflow$1 = {
    name: 'preventOverflow',
    enabled: true,
    phase: 'main',
    fn: preventOverflow,
    requiresIfExists: ['offset']
  };

  var toPaddingObject = function toPaddingObject(padding, state) {
    padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
      placement: state.placement
    })) : padding;
    return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  };

  function arrow(_ref) {
    var _state$modifiersData$;

    var state = _ref.state,
        name = _ref.name,
        options = _ref.options;
    var arrowElement = state.elements.arrow;
    var popperOffsets = state.modifiersData.popperOffsets;
    var basePlacement = getBasePlacement(state.placement);
    var axis = getMainAxisFromPlacement(basePlacement);
    var isVertical = [left, right].indexOf(basePlacement) >= 0;
    var len = isVertical ? 'height' : 'width';

    if (!arrowElement || !popperOffsets) {
      return;
    }

    var paddingObject = toPaddingObject(options.padding, state);
    var arrowRect = getLayoutRect(arrowElement);
    var minProp = axis === 'y' ? top : left;
    var maxProp = axis === 'y' ? bottom : right;
    var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
    var startDiff = popperOffsets[axis] - state.rects.reference[axis];
    var arrowOffsetParent = getOffsetParent(arrowElement);
    var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
    var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
    // outside of the popper bounds

    var min = paddingObject[minProp];
    var max = clientSize - arrowRect[len] - paddingObject[maxProp];
    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    var offset = within(min, center, max); // Prevents breaking syntax highlighting...

    var axisProp = axis;
    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
  }

  function effect(_ref2) {
    var state = _ref2.state,
        options = _ref2.options;
    var _options$element = options.element,
        arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

    if (arrowElement == null) {
      return;
    } // CSS selector


    if (typeof arrowElement === 'string') {
      arrowElement = state.elements.popper.querySelector(arrowElement);

      if (!arrowElement) {
        return;
      }
    }

    if (!contains(state.elements.popper, arrowElement)) {
      return;
    }

    state.elements.arrow = arrowElement;
  } // eslint-disable-next-line import/no-unused-modules


  var arrow$1 = {
    name: 'arrow',
    enabled: true,
    phase: 'main',
    fn: arrow,
    effect: effect,
    requires: ['popperOffsets'],
    requiresIfExists: ['preventOverflow']
  };

  function getSideOffsets(overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) {
      preventedOffsets = {
        x: 0,
        y: 0
      };
    }

    return {
      top: overflow.top - rect.height - preventedOffsets.y,
      right: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      left: overflow.left - rect.width - preventedOffsets.x
    };
  }

  function isAnySideFullyClipped(overflow) {
    return [top, right, bottom, left].some(function (side) {
      return overflow[side] >= 0;
    });
  }

  function hide(_ref) {
    var state = _ref.state,
        name = _ref.name;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var preventedOffsets = state.modifiersData.preventOverflow;
    var referenceOverflow = detectOverflow(state, {
      elementContext: 'reference'
    });
    var popperAltOverflow = detectOverflow(state, {
      altBoundary: true
    });
    var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
    var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
    var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
    var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
    state.modifiersData[name] = {
      referenceClippingOffsets: referenceClippingOffsets,
      popperEscapeOffsets: popperEscapeOffsets,
      isReferenceHidden: isReferenceHidden,
      hasPopperEscaped: hasPopperEscaped
    };
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-reference-hidden': isReferenceHidden,
      'data-popper-escaped': hasPopperEscaped
    });
  } // eslint-disable-next-line import/no-unused-modules


  var hide$1 = {
    name: 'hide',
    enabled: true,
    phase: 'main',
    requiresIfExists: ['preventOverflow'],
    fn: hide
  };

  var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
  var createPopper$1 = /*#__PURE__*/popperGenerator({
    defaultModifiers: defaultModifiers$1
  }); // eslint-disable-next-line import/no-unused-modules

  var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
  var createPopper = /*#__PURE__*/popperGenerator({
    defaultModifiers: defaultModifiers
  }); // eslint-disable-next-line import/no-unused-modules

  exports.applyStyles = applyStyles$1;
  exports.arrow = arrow$1;
  exports.computeStyles = computeStyles$1;
  exports.createPopper = createPopper;
  exports.createPopperLite = createPopper$1;
  exports.defaultModifiers = defaultModifiers;
  exports.detectOverflow = detectOverflow;
  exports.eventListeners = eventListeners;
  exports.flip = flip$1;
  exports.hide = hide$1;
  exports.offset = offset$1;
  exports.popperGenerator = popperGenerator;
  exports.popperOffsets = popperOffsets$1;
  exports.preventOverflow = preventOverflow$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


document.addEventListener('DOMContentLoaded', () => {
/**
 * @file
 * Skip to target utility.
 */

function CivicThemeSkipToTarget(el) {
  this.el = el;
  this.targetId = this.el.getAttribute('href');

  if (this.targetId) {
    this.targetEl = document.querySelector(this.targetId);

    this.el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      this.targetEl.setAttribute('tabindex', '1');
      this.targetEl.focus();
      this.targetEl.scrollIntoView(true);
      this.targetEl.setAttribute('tabindex', '-1');
    });
  }
}

document.querySelectorAll('[data-skip-to-target]').forEach((el) => {
  new CivicThemeSkipToTarget(el);
});

/**
 * @file
 * Scrollspy component.
 *
 * Adds '.ct-scrollspy-scrolled' class to an element whose
 * data-scrollspy-offset attribute's value is more than a vertical window
 * scroll.
 */
function CivicThemeScrollspy(el) {
  if (el.getAttribute('data-scrollspy') === 'true' || this.el) {
    return;
  }

  this.el = el;
  this.offset = this.el.hasAttribute('data-scrollspy-offset') ? this.el.getAttribute('data-scrollspy-offset') : null;

  document.addEventListener('scroll', CivicThemeScrollspy.prototype.scrollEvent.bind(this));

  // Mark as initialized.
  this.el.setAttribute('data-scrollspy', 'true');
}

/**
 * Event handler for the scroll.
 */
CivicThemeScrollspy.prototype.scrollEvent = function () {
  if (window.scrollY > this.offset) {
    this.el.classList.add('ct-scrollspy-scrolled');
  } else {
    this.el.classList.remove('ct-scrollspy-scrolled');
  }
};

document.querySelectorAll('[data-scrollspy]').forEach((el) => {
  new CivicThemeScrollspy(el);
});

/**
 * @file
 * Responsive component.
 *
 * Emits a 'ct-responsive' event on breakpoint change allowing
 * components to delay initialisation by providing 'data-responsive' attribute
 * with an operator and breakpoint name.
 *
 * For example: a component with `data-responsive=">=m"` attribute will
 * delay its initialisation to happen only when current screen size is equal
 * or more than medium ('m') breakpoint.
 */
function CivicThemeResponsive() {
  const queries = this.getMediaQueries();
  for (const breakpoint in queries) {
    const query = queries[breakpoint];
    // Store matched media queries in global scope as this component is a
    // singleton.
    window.civicthemeResponsive = window.civicthemeResponsive || {};
    // Only proceed if this query was not processed previously.
    if (!(query in window.civicthemeResponsive)) {
      window.civicthemeResponsive[query] = window.matchMedia(query);
      // Support for Safari 13.
      const hasEventListener = (window.civicthemeResponsive[query].addEventListener !== undefined);
      if (hasEventListener) {
        window.civicthemeResponsive[query]
          .addEventListener('change', this.mediaQueryChange.bind(this, breakpoint));
      } else {
        window.civicthemeResponsive[query]
          .addListener(this.mediaQueryChange.bind(this, breakpoint));
      }
    }
    // Call event handler on init.
    this.mediaQueryChange(breakpoint, { matches: window.civicthemeResponsive[query].matches });
  }
}

/**
 * Breakpoints map.
 */
CivicThemeResponsive.prototype.breakpoints = {
  xxs: '0px',
  xs: '368px',
  s: '576px',
  m: '768px',
  l: '992px',
  xl: '1280px',
  xxl: '1440px',
};

/**
 * Get an object of media queries.
 *
 * @return object
 *   Keys are breakpoint names, and values a media queries.
 */
CivicThemeResponsive.prototype.getMediaQueries = function () {
  const queries = {};

  const firstBp = Object.keys(this.breakpoints)[0];
  let lastBp = firstBp;
  for (const breakpoint in this.breakpoints) {
    if (breakpoint === firstBp) {
      continue;
    }
    const min = this.breakpoints[lastBp];
    const max = `${Math.max(parseFloat(this.breakpoints[breakpoint]) - 0.02, 0)}px`;
    if (lastBp === firstBp) {
      queries[lastBp] = `screen and (max-width: ${max})`;
    } else {
      queries[lastBp] = `screen and (min-width: ${min}) and (max-width: ${max})`;
    }
    lastBp = breakpoint;
  }
  queries[lastBp] = `screen and (min-width: ${this.breakpoints[lastBp]})`;

  return queries;
};

/**
 * Event handler for the media query change event.
 *
 * @param {string} breakpoint
 *   The breakpoint name for which this event was fired.
 * @param {Event} evt
 *   The media query change event.
 */
CivicThemeResponsive.prototype.mediaQueryChange = function (breakpoint, evt) {
  if (!evt.matches) {
    return;
  }
  // Fire a custom event that other components can subscribe to.
  window.dispatchEvent(new CustomEvent('ct-responsive', {
    bubbles: true,
    detail: {
      breakpoint,
      evaluate: CivicThemeResponsive.prototype.evaluate,
    },
  }));
};

/**
 * Evaluate breakpoint expression and attach or detach component.
 *
 * @param {string} breakpointExpr
 *   The breakpoint expression.
 * @param {object} func
 *   Function or class constructor.
 * @param {object} el
 *   Element to be passed to the constructor.
 *
 * @return {*}
 *   Attached object or false if expression did not match.
 */
CivicThemeResponsive.prototype.evaluate = function (breakpointExpr, func, el) {
  if (CivicThemeResponsive.prototype.matchExpr(breakpointExpr, this.breakpoint)) {
    // eslint-disable-next-line new-cap
    return new func(el);
  }
  if (typeof func.prototype.destroy !== 'undefined') {
    func.prototype.destroy(el);
    return true;
  }
  return false;
};

/**
 * Match breakpoint expression to the passed breakpoint.
 *
 * Used by the listeners to decide when to respond to a query.
 *
 * @param {string} breakpointExpr
 *   The breakpoint expression. E.g. '>=m', '<s' etc.
 *   Supported operators are: <, >, =, >=, <=, <>. Defaults to '>='.
 *   Breakpoint names are matched to the
 *   CivicThemeResponsive.prototype.breakpoints.
 *
 * @param {string} breakpoint
 *   Currently active breakpoint.
 *
 * @return {boolean}
 *   True if expression matches current breakppint, false otherwise.
 */
CivicThemeResponsive.prototype.matchExpr = function (breakpointExpr, breakpoint) {
  const names = Object.keys(CivicThemeResponsive.prototype.breakpoints);
  // Parse breakpoint expression into name and operator.
  const regex = `^(<|>|=|>=|<=|<>)?(${names.join('|')})$`;
  const matches = breakpointExpr.match(new RegExp(regex, 'i'));

  // If not matched (malformed expression) or not exactly expected number of
  // matches - consider as a non-match.
  if (!matches || matches.length < 2 || matches.length > 3) {
    return false;
  }

  // Can be with or without an operator, i.e. '>=m' or 'm'.
  const parsedOperator = matches[1] || '>=';
  const parsedBreakpoint = matches[2];

  const compFunctions = {
    '>': (parsed, current) => names.indexOf(current) > names.indexOf(parsed),
    '>=': (parsed, current) => names.indexOf(current) >= names.indexOf(parsed),
    '<': (parsed, current) => names.indexOf(current) < names.indexOf(parsed),
    '<=': (parsed, current) => names.indexOf(current) <= names.indexOf(parsed),
    '<>': (parsed, current) => names.indexOf(current) !== names.indexOf(parsed),
    '=': (parsed, current) => names.indexOf(current) === names.indexOf(parsed),
  };

  return compFunctions[parsedOperator](parsedBreakpoint, breakpoint);
};

if (document.querySelectorAll('[data-responsive]').length) {
  // CivicThemeResponsive needs to run after all ct-responisve
  // event listeners have been added.
  // Delay the execution until after other components have been initialized.
  // Using setTimeout as an interim solution because:
  // - DOMContentLoad won't work on prod-site due to being double wrapped in a
  //   DOMLoad event.
  // - window 'load' event won't work on storybook as it's not called per
  //   component page change.
  setTimeout(() => {
    // Init if there is at least a single component with data-responsive
    // attribute on the page.
    new CivicThemeResponsive();
  }, 10);
}

/**
 * @file
 * Platform utility.
 */

function CivicThemePlatform(el) {
  function iOS() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
  }

  if (iOS()) {
    el.dataset.platform = 'ios';
  }
}

document.querySelectorAll('[data-platform]').forEach((el) => {
  new CivicThemePlatform(el);
});

/**
 * CivicTheme Layout component.
 */

function CivicThemeLayout(el) {
  this.el = el;
  this.grid = el.querySelector(':scope > .ct-layout__inner');
  const gridStyle = getComputedStyle(this.grid);

  if (gridStyle.gridTemplateRows === 'masonry' || this.grid.hasAttribute('data-masonry')) {
    return;
  }

  this.grid.setAttribute('data-masonry', true);

  this.stl = this.grid.querySelector(':scope > .ct-layout__sidebar_top_left');
  this.str = this.grid.querySelector(':scope > .ct-layout__sidebar_top_right');
  this.sbl = this.grid.querySelector(':scope > .ct-layout__sidebar_bottom_left');
  this.sbr = this.grid.querySelector(':scope > .ct-layout__sidebar_bottom_right');

  // Only enable masonry if all 4 elements are present.
  if (this.stl && this.str && this.sbl && this.sbr) {
    // Prepare redraw variables.
    this.gap = parseFloat(gridStyle.gridRowGap);
    // Items include all children of the grid, not just the 4 sidebar regions.
    this.items = Array.from(this.grid.children);
    this.height = 0;

    // Listen for redraw events.
    this.resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        this.masonryRedraw();
      });
    });

    // Observe all children of the grid items rather than the items themselves:
    // this allows us to detect changes in the height of the children rather
    // tnan of the grid items as their height will not change when children
    // combined heights is less than a single grid row height.
    this.items.forEach((item) => {
      Array.from(item.children).forEach((child) => {
        this.resizeObserver.observe(child);
      });
    });

    this.masonryRedraw();
  }
}

/**
 * Position element in relation to it's above element.
 */
CivicThemeLayout.prototype.masonryPositionElement = function (el, aboveEl, gap) {
  const aboveChildIdx = aboveEl.children.length - 1;
  const aboveChild = (aboveChildIdx >= 0) ? aboveEl.children[aboveChildIdx] : null;
  const aboveBottom = aboveChild ? aboveChild.getBoundingClientRect().bottom : aboveEl.getBoundingClientRect().top;
  const currentTop = el.getBoundingClientRect().top;
  el.style.marginTop = `${aboveBottom + gap - currentTop}px`;
};

/**
 * Reposition grid elements.
 */
CivicThemeLayout.prototype.masonryRedraw = function () {
  // Calculate the new height of all children.
  //
  // Although masonry layout is applied only if the element has the
  // CSS variable --js-masonry-enabled set and we could have check for this
  // variable to preserve height reclaulation, this variable can be assigned
  // within a specific media query. Therefore, we need to calculate the height
  // in case --js-masonry-enabled is assigned to the element after the viewport
  // has been resized.
  const newHeight = this.items.reduce((totalHeight, item) => {
    const childrenHeight = Array.from(item.children).reduce((childTotal, child) => childTotal + child.getBoundingClientRect().height, 0);
    return totalHeight + childrenHeight;
  }, 0);

  // Proceed only if the height has changed.
  if (newHeight !== this.height) {
    this.height = newHeight;

    // Clear existing positioning.
    this.sbl.style.removeProperty('margin-top');
    this.sbr.style.removeProperty('margin-top');

    // Set new position (if masonry css has been applied).
    if (getComputedStyle(this.grid).getPropertyValue('--js-masonry-enabled')) {
      this.masonryPositionElement(this.sbl, this.stl, this.gap);
      this.masonryPositionElement(this.sbr, this.str, this.gap);
    }
  }
};

document.querySelectorAll('.ct-layout').forEach((layout) => {
  // eslint-disable-next-line no-new
  new CivicThemeLayout(layout);
});

/**
 * @file
 * Flyout component.
 *
 * Allows introducing "fly out" behaviour to a block-level HTML element on the
 * page by adding data attributes to elements. The component does not provide
 * any styles, except for z-index configuration and direction transformations.
 *
 * Also, provides a trigger to close a single (currently opened) panel and
 * another trigger to close all open panels.
 */
function CivicThemeFlyout(el) {
  if (el.getAttribute('data-flyout') === 'true' || this.el) {
    return;
  }

  // Find all open triggers.
  const openTriggers = document.querySelectorAll('[data-flyout-open-trigger]');
  if (!openTriggers.length) {
    return;
  }

  // Find an open trigger.
  this.openTrigger = this.findOpenTrigger(openTriggers, el);
  if (!this.openTrigger) {
    return;
  }

  this.el = el;

  // Find "close trigger", but only search among triggers that are not a part
  // of descendant flyouts.
  this.closeTriggers = Array.from(this.el.querySelectorAll('[data-flyout-close-trigger]'));
  this.closeTriggers = this.closeTriggers.filter((item) => (item.closest('[data-flyout]') === this.el));

  this.closeAllTriggers = Array.from(this.el.querySelectorAll('[data-flyout-close-all-trigger]'));
  this.closeAllTriggers = this.closeAllTriggers.filter((item) => (item.closest('[data-flyout]') === this.el));
  this.panel = this.el.querySelector('[data-flyout-panel]');
  this.el.expanded = this.el.hasAttribute('data-flyout-expanded');
  this.duration = this.el.hasAttribute('data-flyout-duration') ? parseInt(this.el.getAttribute('data-flyout-duration'), 10) : 500;
  this.focusTargets = this.el.hasAttribute('data-flyout-focus') ? this.el.getAttribute('data-flyout-focus').split(',').filter((i) => i) : [];

  // Add event listener to element.
  if (this.openTrigger) {
    this.openTrigger.addEventListener('click', this.clickEvent.bind(this));
    this.openTrigger.expand = true;
  }

  if (this.closeTriggers) {
    this.closeTriggers.forEach((trigger) => {
      trigger.addEventListener('click', this.clickEvent.bind(this));
      trigger.expand = false;
    });
  }

  if (this.closeAllTriggers) {
    this.closeAllTriggers.forEach((trigger) => {
      trigger.addEventListener('click', this.closeAllTriggerClickEvent.bind(this));
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      const flyoutElements = document.querySelectorAll('[data-flyout]');
      flyoutElements.forEach((flyout) => {
        const focusableElements = flyout.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        if (document.activeElement === lastFocusable && !event.shiftKey) {
          event.preventDefault();
          firstFocusable.focus();
        } else if (document.activeElement === firstFocusable && event.shiftKey) {
          event.preventDefault();
          lastFocusable.focus();
        }
      });
    }
  });

  // Mark as initialized.
  this.el.setAttribute('data-flyout', 'true');
}

/**
 * Find open trigger for the given flyout among provided triggers.
 */
CivicThemeFlyout.prototype.findOpenTrigger = function (triggers, el) {
  // Find a trigger for the current flyout.
  for (const i in triggers) {
    if (Object.prototype.hasOwnProperty.call(triggers, i)) {
      if (triggers[i].hasAttribute('data-flyout-target')) {
        const found = document.querySelector(triggers[i].getAttribute('data-flyout-target'));
        if (found === el) {
          return triggers[i];
        }
      } else if (triggers[i].nextElementSibling && triggers[i].nextElementSibling.hasAttribute('data-flyout')) {
        // Try to get from the next element.
        const found = triggers[i].nextElementSibling;
        if (found === el) {
          return triggers[i];
        }
      }
    }
  }
  return null;
};

/**
 * Click event handler to toggle flyout state.
 */
CivicThemeFlyout.prototype.clickEvent = function (e) {
  e.stopPropagation();
  if (e.target.hasAttribute('data-flyout-trigger-allow-default') !== true) {
    e.preventDefault();
  }

  return e.currentTarget.expand ? this.expand() : this.collapse();
};

/**
 * Event handler to close all flyout components.
 */
CivicThemeFlyout.prototype.closeAllTriggerClickEvent = function (e) {
  e.stopPropagation();
  if (e.target.hasAttribute('data-flyout-trigger-allow-default') !== true) {
    e.preventDefault();
  }

  // Collapse all panels.
  document.querySelectorAll('[data-flyout-expanded]').forEach((flyout) => {
    flyout.removeAttribute('data-flyout-expanded');
  });
  document.querySelectorAll('[data-flyout-panel]').forEach((panel) => {
    panel.setAttribute('aria-hidden', true);
    const duration = panel.parentNode.hasAttribute('data-flyout-duration') ? parseInt(panel.parentNode.getAttribute('data-flyout-duration'), 10) : 500;
    setTimeout(() => {
      panel.style.visibility = null;
      document.body.style.overflow = null;
    }, duration);
  });
  document.querySelectorAll('[data-flyout-open-trigger]').forEach((trigger) => {
    trigger.setAttribute('aria-expanded', false);
  });

  if (this.focusTargets) {
    // Focus on the first trigger.
    setTimeout(() => {
      document.querySelector('[data-flyout-open-trigger]').focus();
    }, this.duration);
  }
};

/**
 * Expand flyout.
 */
CivicThemeFlyout.prototype.expand = function () {
  this.el.expanded = true;
  this.openTrigger.setAttribute('aria-expanded', true);
  this.panel.style.visibility = 'visible';

  // Add required classes.
  this.el.setAttribute('data-flyout-expanded', true);
  this.panel.setAttribute('aria-hidden', false);
  document.body.style.overflow = 'hidden';

  if (this.focusTargets) {
    // Focus on the first available target or close button.
    const focusTargets = [
      ...this.focusTargets,
      '[data-flyout-close-trigger]',
      '[data-flyout-close-all-trigger]',
    ];

    for (let i = 0; i < focusTargets.length; i++) {
      let focusElements = Array.from(this.panel.querySelectorAll(focusTargets[i]));
      // Filter to only focus points found in this panel.
      focusElements = focusElements.filter((el) => (el.closest('[data-flyout-panel]') === this.panel));
      if (focusElements.length > 0) {
        setTimeout(() => focusElements[0].focus(), this.duration);
        break;
      }
    }
  }
};

/**
 * Collapse flyout.
 */
CivicThemeFlyout.prototype.collapse = function () {
  this.el.expanded = false;
  this.openTrigger.setAttribute('aria-expanded', false);
  this.el.removeAttribute('data-flyout-expanded');
  this.panel.setAttribute('aria-hidden', true);
  setTimeout(() => {
    this.panel.style.visibility = null;
    document.body.style.overflow = null;
    if (this.focusTargets) {
      this.openTrigger.focus();
    }
  }, this.duration);
};

// Initialize CivicThemeFlyout on every element.
document.querySelectorAll('[data-flyout]').forEach((flyout) => {
  // eslint-disable-next-line no-new
  new CivicThemeFlyout(flyout);
});

/**
 * @file
 * Collapsible component.
 *
 * Attaches to markup with 'data-collapsible' attribute.
 * Available attributes:
 * - data-collapsible-trigger - trigger for the collapsible. If not provided,
 *   then the first descendant will be used.
 * - data-collapsible-panel - panel for the collapsible. If not provided,
 *   then the second descendant will be used.
 * - data-collapsible-collapsed - indicate that a starting state is collapsed.
 * - data-collapsible-duration - duration in milliseconds. Defaults to 500.
 * - data-collapsible-group-enabled-breakpoint - enable grouping at breakpoint.
 *   Needs 'data-responsive' attribute.
 */
function CivicThemeCollapsible(el) {
  // Use "data-collapsible"'s attribute value to identify if this component was
  // already initialised.
  if (el.getAttribute('data-collapsible') === 'true' || this.el) {
    return;
  }

  const trigger = this.getTrigger(el);
  const panel = this.getPanel(el);

  // Exit early if trigger or panel were not found.
  if (!trigger || !panel) {
    return;
  }

  this.el = el;
  this.trigger = trigger;
  this.panel = panel;
  this.collapsed = this.isCollapsed(el);
  this.duration = this.el.hasAttribute('data-collapsible-duration') ? this.el.getAttribute('data-collapsible-duration') : 500;
  this.group = this.el.hasAttribute('data-collapsible-group') ? this.el.getAttribute('data-collapsible-group') : null;
  this.icon = '<svg class="ct-icon" width="24" height="24" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.6072 8.38619C18.3583 8.13884 18.0217 8 17.6709 8C17.32 8 16.9834 8.13884 16.7346 8.38619L11.9668 13.0876L7.26542 8.38619C7.01659 8.13884 6.67999 8 6.32913 8C5.97827 8 5.64167 8.13884 5.39284 8.38619C5.26836 8.50965 5.16956 8.65654 5.10214 8.81838C5.03471 8.98022 5 9.1538 5 9.32912C5 9.50445 5.03471 9.67803 5.10214 9.83987C5.16956 10.0017 5.26836 10.1486 5.39284 10.2721L11.0239 15.9031C11.1473 16.0276 11.2942 16.1264 11.4561 16.1938C11.6179 16.2612 11.7915 16.2959 11.9668 16.2959C12.1421 16.2959 12.3157 16.2612 12.4775 16.1938C12.6394 16.1264 12.7863 16.0276 12.9097 15.9031L18.6072 10.2721C18.7316 10.1486 18.8304 10.0017 18.8979 9.83987C18.9653 9.67803 19 9.50445 19 9.32912C19 9.1538 18.9653 8.98022 18.8979 8.81838C18.8304 8.65654 18.7316 8.50965 18.6072 8.38619Z" /></svg>';
  this.iconGroupEnabled = this.el.hasAttribute('data-collapsible-icon-group');

  // Make sure that both trigger and a panel have required attributes set.
  this.trigger.setAttribute('data-collapsible-trigger', '');
  this.panel.setAttribute('data-collapsible-panel', '');

  if (!this.panel.hasAttribute('data-collapsible-trigger-no-icon') && !this.trigger.querySelector('.ct-collapsible__icon')) {
    const iconEl = this.htmlToElement(this.icon);
    iconEl.classList.add('ct-collapsible__icon');
    // If multiple words - use last word and icon grouping.
    if (this.iconGroupEnabled) {
      const wrapText = (text) => `<span class="ct-text-icon__text">${text}</span>`;
      const text = this.trigger.innerText.trim();
      const lastWordIndex = text.lastIndexOf(' ');
      const lastWord = lastWordIndex >= 0 ? text.substring(lastWordIndex + 1) : text;
      const firstWords = lastWordIndex >= 0 ? text.substring(0, lastWordIndex + 1) : '';
      const iconGroupEl = this.htmlToElement(`<span class="ct-text-icon__group">${wrapText(lastWord)} </span>`);
      iconGroupEl.append(iconEl);
      this.trigger.innerHTML = wrapText(firstWords);
      this.trigger.append(iconGroupEl);
    } else {
      this.trigger.append(iconEl);
    }
  }

  // Attach event listener.
  this.trigger.addEventListener('click', this.clickEvent.bind(this));
  this.trigger.addEventListener('keydown', this.keydownEvent.bind(this.trigger));
  this.trigger.addEventListener('focusout', this.focusoutEvent.bind(this));
  this.panel.addEventListener('click', (e) => e.stopPropagation());
  this.panel.addEventListener('focusout', this.focusoutEvent.bind(this));

  // Set components to their collapsed / expanded state.
  if (this.collapsed) {
    this.setCollapsedState.call(this);
  } else {
    this.setExpandedState.call(this);
  }

  this.el.addEventListener('ct.collapsible.collapse', (evt) => {
    // For some cases (like group collapse) - the animation should be disabled.
    const animate = (evt.detail && evt.detail.animate);
    const isCloseAllEvent = (evt.detail && evt.detail.closeAll);
    if ((isCloseAllEvent && this.isGroupsEnabled) || !isCloseAllEvent) {
      this.collapse(animate, evt);
    }
  });

  this.el.addEventListener('ct.collapsible.expand', () => {
    this.expand(true);
  });

  this.el.addEventListener('ct.collapsible.toggle', () => {
    if (this.isCollapsed(this.el)) {
      this.el.dispatchEvent(new CustomEvent('ct.collapsible.expand', { bubbles: true }));
    } else {
      this.el.dispatchEvent(new CustomEvent('ct.collapsible.collapse', { bubbles: true, detail: { animate: true } }));
    }
  });

  // Attach global keydown event listener to allow closing all collapsibles.
  document.addEventListener('keydown', CivicThemeCollapsible.prototype.keydownEvent);
  document.addEventListener('click', CivicThemeCollapsible.prototype.collapseAllGroups);

  // Responsive Collapsible Group.
  this.isGroupsEnabled = true;
  this.groupEnabledBreakpoint = this.el.getAttribute('data-collapsible-group-enabled-breakpoint');
  if (this.groupEnabledBreakpoint) {
    window.addEventListener('ct-responsive', (evt) => {
      const evaluationResult = evt.detail.evaluate(this.groupEnabledBreakpoint, () => {
        // Is within breakpoint.
        this.isGroupsEnabled = true;
      });
      if (evaluationResult === false) {
        // Not within breakpoint.
        this.isGroupsEnabled = false;
      }
    }, false);
  }

  // Mark as initialized.
  this.el.setAttribute('data-collapsible', 'true');
}

/**
 * Destroy an instance.
 */
CivicThemeCollapsible.prototype.destroy = function (el) {
  if (el.getAttribute('data-collapsible') !== 'true' || !this.el) {
    return;
  }
  const trigger = el.querySelector('[data-collapsible-trigger]') || el.firstElementChild;
  const panel = el.querySelector('[data-collapsible-panel]') || el.firstElementChild.nextElementSibling;

  // Exit early if trigger or panel were not found.
  if (!trigger || !panel) {
    return;
  }

  this.el = el;
  this.trigger = trigger;
  this.panel = panel;

  // Remove any attached event listeners.
  // eslint-disable-next-line no-self-assign
  this.trigger.outerHTML = this.trigger.outerHTML;
  // Remove inline overrides.
  this.panel.style.height = '';
  this.panel.style.overflow = '';

  this.trigger.removeAttribute('aria-expanded');
  this.panel.removeAttribute('aria-hidden');

  // Mark as non-initialized.
  this.el.setAttribute('data-collapsible', '');

  delete this.el;
  delete this.trigger;
  delete this.panel;
  delete this.collapsed;
  delete this.duration;
  delete this.group;
};

/**
 * Click event handler.
 */
CivicThemeCollapsible.prototype.clickEvent = function (e) {
  e.stopPropagation();
  e.preventDefault();
  e.stopImmediatePropagation();

  if (this.group) {
    this.closeGroup(this.group);
  }

  if (this.collapsed) {
    this.el.dispatchEvent(new CustomEvent('ct.collapsible.expand', { bubbles: true }));
  } else {
    this.el.dispatchEvent(new CustomEvent('ct.collapsible.collapse', { bubbles: true, detail: { animate: true } }));
  }
};

/**
 * Focusout event handler.
 */
CivicThemeCollapsible.prototype.focusoutEvent = function (e) {
  // Close when trigger or panel leaves a focus, but only for grouped ones.
  if (
    e.relatedTarget
    && !this.panel.contains(e.relatedTarget)
    && !this.trigger.contains(e.relatedTarget)
    && this.group
    && this.isGroupsEnabled
  ) {
    e.target.dispatchEvent(new CustomEvent('ct.collapsible.collapse', { bubbles: true }));
  }
};

/**
 * React on pressed keys.
 */
CivicThemeCollapsible.prototype.keydownEvent = function (e) {
  if (!/(32|27|37|38|39|40)/.test(e.which) || e.altKey || e.ctrlKey || e.metaKey || /input|textarea|select|object/i.test(e.target.tagName)) {
    return;
  }

  e.stopPropagation();

  // ESC.
  if (e.which === 27) {
    CivicThemeCollapsible.prototype.collapseAllGroups();
    return;
  }

  if (this !== document) {
    if ((e.which === 38 || e.which === 40 || e.which === 32) && !e.shiftKey) {
      e.preventDefault();
    }
    // Up or Left.
    if ((e.which === 38 || e.which === 37) && !e.shiftKey) {
      this.dispatchEvent(new CustomEvent('ct.collapsible.collapse', { bubbles: true, detail: { animate: true, keydown: true } }));
      return;
    }
    // Down or Right.
    if ((e.which === 40 || e.which === 39) && !e.shiftKey) {
      this.dispatchEvent(new CustomEvent('ct.collapsible.expand', { bubbles: true }));
    }

    // Space.
    if (e.which === 32) {
      e.target.click();
    }
  }
};

/**
 * Close "other" instances in the group.
 */
CivicThemeCollapsible.prototype.closeGroup = function (group) {
  if (this.isGroupsEnabled) {
    const currentEl = this.el;
    // eslint-disable-next-line prefer-template
    document.querySelectorAll('[data-collapsible-group=' + group + ']:not([data-collapsible-collapsed])').forEach((el) => {
      if (el !== currentEl) {
        el.dispatchEvent(new CustomEvent('ct.collapsible.collapse', { bubbles: true, detail: { closeGroup: true } }));
      }
    });
  }
};

/**
 * Close all grouped instances on the page.
 */
CivicThemeCollapsible.prototype.collapseAllGroups = function () {
  document.querySelectorAll('[data-collapsible-group]').forEach((el) => {
    el.dispatchEvent(new CustomEvent('ct.collapsible.collapse', { bubbles: true, detail: { closeAll: true } }));
  });
};

/**
 * Set elements to their collapsed state.
 */
CivicThemeCollapsible.prototype.setCollapsedState = function () {
  this.panel.style.transition = '';
  this.panel.style.overflow = 'hidden';
  this.panel.style.display = 'none';
  this.el.setAttribute('data-collapsible-collapsed', '');
  this.trigger.setAttribute('data-collapsible-trigger-collapsed', '');
  this.panel.setAttribute('aria-hidden', true);
  this.trigger.setAttribute('aria-expanded', false);
  this.collapsed = true;
};

/**
 * Collapse panel.
 *
 * @param {boolean} animate
 *   Flag to collapse with animation.
 */
CivicThemeCollapsible.prototype.collapse = function (animate, evt) {
  const t = this;

  if (this.isCollapsed(t.el)) {
    return;
  }

  if (evt && evt.target) {
    if (evt.detail && evt.detail.keydown && !evt.detail.closeGroup) {
      if (evt.target.closest('[data-collapsible="true"]') !== t.el) {
        return;
      }
    } else if (evt.currentTarget !== t.el || evt.target !== t.el) {
      return;
    }
  }

  const onTransitionEnd = function () {
    // Remove the event listener straight away.
    // eslint-disable-next-line no-caller, no-restricted-properties
    t.panel.removeEventListener('transitionend', onTransitionEnd);
    // Remove progress state.
    t.el.removeAttribute('data-collapsible-collapsing');
    t.trigger.removeAttribute('data-collapsible-trigger-collapsing');
    // Set all required attributes.
    t.setCollapsedState.call(t);
  };

  if (animate && t.duration > 0) {
    // Support already set transitions.
    const transition = t.panel.style.transition || `height ${t.duration}ms ease-out`;
    // Reset transition and set overflow before animation starts.
    t.panel.style.transition = '';
    t.panel.style.overflow = 'hidden';
    // Get height before animation starts.
    const h = t.panel.scrollHeight;
    requestAnimationFrame(() => {
      // Prepare for animation by setting initial values.
      t.panel.style.transition = transition;
      t.panel.style.height = `${h}px`;
      // Set progress state.
      t.el.setAttribute('data-collapsible-collapsing', '');
      t.trigger.setAttribute('data-collapsible-trigger-collapsing', '');
      requestAnimationFrame(() => {
        // Register an event listener to fire at the end of the transition.
        t.panel.addEventListener('transitionend', onTransitionEnd);
        // Finally, change the height, triggering the transition.
        t.panel.style.height = '0px';
      });
    });
  } else {
    // Store current transition before it will be reset.
    const transition = t.panel.style;
    t.setCollapsedState.call(t);
    // Restore transition.
    t.panel.style.transition = transition;
  }
};

/**
 * Set elements to their expanded state.
 */
CivicThemeCollapsible.prototype.setExpandedState = function () {
  this.panel.style.transition = '';
  this.panel.style.overflow = '';
  this.panel.style.height = '';
  this.panel.style.display = '';
  this.panel.setAttribute('aria-hidden', false);
  this.trigger.setAttribute('aria-expanded', true);
  this.el.removeAttribute('data-collapsible-collapsed');
  this.trigger.removeAttribute('data-collapsible-trigger-collapsed');
  this.collapsed = false;
};

/**
 * Expand panel.
 *
 * @param {boolean} animate
 *   Flag to expand with animation.
 */
CivicThemeCollapsible.prototype.expand = function (animate) {
  const t = this;

  if (!this.isCollapsed(t.el)) {
    return;
  }

  const onTransitionEnd = function () {
    // Remove the event listener straight away.
    // eslint-disable-next-line no-caller, no-restricted-properties
    t.panel.removeEventListener('transitionend', onTransitionEnd);
    // Set all required attributes.
    t.setExpandedState.call(t);
    // Remove progress state.
    t.el.removeAttribute('data-collapsible-collapsing');
    t.trigger.removeAttribute('data-collapsible-trigger-collapsing');
  };

  if (animate && t.duration > 0) {
    // Get height before animation starts.
    t.panel.style.display = '';
    t.panel.style.height = '';
    const h = t.panel.scrollHeight;

    // Set progress state.
    t.el.setAttribute('data-collapsible-collapsing', '');
    t.trigger.setAttribute('data-collapsible-trigger-collapsing', '');
    t.panel.style.height = '0px';
    requestAnimationFrame(() => {
      // Prepare for animation by setting initial values.
      t.panel.style.transition = t.panel.style.transition || `height ${t.duration}ms ease-out`;

      requestAnimationFrame(() => {
        // Register an event listener to fire at the end of the transition.
        t.panel.addEventListener('transitionend', onTransitionEnd);
        // Finally, change the height, triggering the transition.
        t.panel.style.height = `${h}px`;
      });
    });
  } else {
    const transition = t.panel.style;
    t.setExpandedState.call(t);
    t.panel.style.transition = transition;
  }
};

/**
 * Check if the collapsible is collapsed.
 */
CivicThemeCollapsible.prototype.isCollapsed = function (el) {
  return el.hasAttribute('data-collapsible-collapsed');
};

/**
 * Get trigger element.
 */
CivicThemeCollapsible.prototype.getTrigger = function (el) {
  return el.querySelector('[data-collapsible-trigger]') || el.firstElementChild || null;
};

/**
 * Get panel element.
 */
CivicThemeCollapsible.prototype.getPanel = function (el) {
  let panelEl = el.querySelector('[data-collapsible-panel]');
  if (!panelEl) {
    const triggerEl = this.getTrigger(el);
    if (triggerEl) {
      panelEl = triggerEl.nextElementSibling;
    }
  }
  return panelEl;
};

/**
 * Convert HTML to a DOM element.
 */
CivicThemeCollapsible.prototype.htmlToElement = function (html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
};

document.querySelectorAll('[data-collapsible]').forEach((el) => {
  // Delay initialisation if should be responsive.
  const breakpointExpr = el.getAttribute('data-responsive');
  if (breakpointExpr) {
    window.addEventListener('ct-responsive', (evt) => {
      evt.detail.evaluate(breakpointExpr, CivicThemeCollapsible, el);
    }, false);
    return;
  }

  new CivicThemeCollapsible(el);
});

});