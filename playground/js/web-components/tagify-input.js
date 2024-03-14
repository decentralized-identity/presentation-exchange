
import '../modules/dom.js';

var TagifyInput = globalThis.TagifyInput = class TagifyInput extends HTMLElement {
  static get observedAttributes() {
    return ['mode'];
  }
  constructor(options = {}) {
    super();
    this.options = options;
    let input = this.firstElementChild;
    if (!input || input.tagName !== 'INPUT') this.innerHTML = `<input />`;
    new Tagify(this.firstElementChild, options.tagify || {
      mode: this.getAttribute('mode') || null
    });
  }
  get value(){
    return this?.firstElementChild?.value;
  }
};

customElements.define('tagify-input', TagifyInput)

export { TagifyInput };