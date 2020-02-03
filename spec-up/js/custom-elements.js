
customElements.define('slide-panels', class SidePanels extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }
  constructor() {
    super();
    
    this.addEventListener('pointerup', e => {
      if (e.target === this) this.close();
    })
  }
  get active (){
    return this.getAttribute('open');
  }
  toggle(panel){
    this.active === panel ? this.close() : this.open(panel)
  }
  open (panel){
    this.setAttribute('open', panel);
  }
  close (){
    this.removeAttribute('open');
  }
  attributeChangedCallback(attr, last, current) {
    switch(attr) {
      case 'open': for (let child of this.children) {
        if (child.id === current) child.setAttribute('open', '');
        else child.removeAttribute('open', '');
      }
      break;
    }
  }
});

customElements.define('slide-panel', class SidePanel extends HTMLElement {
  static get observedAttributes() {
    return ['gap'];
  }
  attributeChangedCallback(attr, last, current) {
    switch(attr) {
      case 'gap': this.style.setProperty('--gap', current);
    }
  }
});

customElements.define('detail-box', class DetailBox extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }
  constructor() {
    super();   
    this.addEventListener('transitionend', e => {
      // if (e.target === this && this.offsetHeight === 0) {
      //   this.style.height = null;
      // }
    })
  }
  toggle(){
    this.toggleAttribute('open');
  }
  attributeChangedCallback(attr, last, current) {
    switch(attr) {
      case 'open':
        // if (this.offsetHeight === 0) {

        // }
    }
  }
  
});

