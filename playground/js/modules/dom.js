
const createProps = {
  attributes: (node, attr) => { for (let z in attr) node.setAttribute(z, attr[z]) }
};

var DOM = {
  ready: new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', e => resolve(e));
  }),
  create(tag, props = {}){
    let node = document.createElement(tag);
    for (let z in props) {
      if (createProps[z]) createProps[z](node, props[z]);
      else typeof node[z] === 'function' ? node[z](props[z]) : node[z] = props[z];
    }
    return node;
  },
  debounce: (fn, ms = 100, args = []) => {
    fn._throttleArgs = args;
    fn._throttleTimeout = fn._throttleTimeout || setTimeout(() => {
      fn(...fn._throttleArgs);
      delete fn._throttleArgs;
      delete fn._throttleTimeout;
    }, ms);
  },
  skipAnimationFrame: fn => requestAnimationFrame(() => requestAnimationFrame(fn)),
  fireEvent(node, type, options = {}){
    return node.dispatchEvent(new CustomEvent(type, Object.assign({
      bubbles: true
    }, options)))
  },
  delegateEvent(type, selector, fn, options = {}){
    let listener = e => {
      let match = e.target.closest(selector);
      if (match) fn(e, match);
    }
    (options.container || document).addEventListener(type, listener, options);
    return listener;
  },
  setOptions(node, options = {}){
    ((node.getAttribute('options') || '').match(/[^\s]+/ig) || []).forEach(option => {
      options[option] = true;
    });
    return node.options = options;
  },
  popup(url, options = {}){
    // Fixes dual-screen position                             Most browsers      Firefox
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined   ? window.screenTop  : window.screenY;

    const w = window.innerWidth || document.documentElement.clientWidth || screen.width;
    const h = window.innerHeight || document.documentElement.clientHeight || screen.height;

    const width = options.width || 500;
    const height = options.height || 650;
    const zoom = w / window.screen.availWidth;
    const popup = window.open(url, options.title || '', `    
      width=${width / zoom}, 
      height=${height / zoom}, 
      top=${(h - height) / 2 / zoom + dualScreenTop}, 
      left=${(w - width) / 2 / zoom + dualScreenLeft},
      status=no,scrollbars=no,toolbar=no,menubar=no,location=no,resizable=no
    `);

    if (options.closeOnBlur) {
      popup.addEventListener('blur', e => popup.close())
    }

    if (options.onBeforeUnload) {
      popup.addEventListener('beforeunload', options.onBeforeUnload)
    }

    popup.invocationData = options.invocationData;
    popup.focus();

    return popup;
  }
}

globalThis.DOM = DOM;

export { DOM };
