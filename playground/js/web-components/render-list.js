
import { DOM } from '../modules/dom.js';
import { Data } from '/js/modules/data.js';
import { Storage } from '/js/modules/storage.js';

class RenderList extends HTMLElement {
  constructor (options = {}) {
    super();
    DOM.setOptions(this, options);
    this.storageBucket = options.storageBucket;
    if (options.autoload) this.load();
  }
  async renderItem(item, options = {}){
    let node = document.createElement('li');
        node.innerHTML = item;
    return node;
  }
  async renderItems(items, options = {}){
    let frag = document.createDocumentFragment();
    return Promise.all(
      items.map(item => this.renderItem(item, options))
    ).then(nodes => nodes.reduce((frag, node) => {
      frag.appendChild(node);
      return frag;
    }, frag));
  }
  async renderList(options = {}){
    let list = document.createElement('ul');
        list.setAttribute('render-list-container', '');
        list.appendChild(await this.renderItems(this.items, options));
    return list;
  }
  async load (options = {}){
    let items = !options.data || typeof options.data === 'string' ? await Storage.getAll(options.data || this.storageBucket) : data;
    if (!items) {
      this.setAttribute('empty', '');
      return;
    };
    this.items = Array.isArray(items) ? items : Object.values(items);
    let list = this.querySelector('[render-list-container]');
    let _list = await this.renderList(options);
    this.items.length ? this.removeAttribute('empty') : this.setAttribute('empty', '');
    list ? list.replaceWith(_list) : this.prepend(_list);
  }
  async add (item){
    let items = Array.isArray(item) ? item : arguments.length ? Array.from(arguments) : [item];
    this.items = (this.items || []).concat(items);
    let list = this.querySelector('[render-list-container]');
    this.items.length ? this.removeAttribute('empty') : this.setAttribute('empty', '');
    if (list) list.appendChild(await this.renderItems(items, { state: 'add' }));
    else this.prepend(await this.renderList());
  }
};

  class PersonaList extends RenderList {
    constructor (options = {}) {
      options.storageBucket = 'personas';
      super(options);
    }
    async renderList(options = {}){
      let list = await super.renderList(options);
          list.setAttribute('list', 'block');
      return list;
    }
    async renderItem(persona, options = {}) {
      let node = document.createElement('li');
          node.setAttribute('persona-id', persona.id);
          if (options.state) node.setAttribute('persona-state', options.state);
          node.innerHTML = `<i class="${persona.icon}"></i><h3>${persona.name}</h3>`;
      return node;
    }
  };
  customElements.define('persona-list', PersonaList);


  class ConnectionList extends RenderList {
    constructor (options = {}) {
      options.storageBucket = 'connections';
      super(options);
    }
    async renderList(){
      let table = document.createElement('table');
          table.setAttribute('render-list-container', '');
          table.innerHTML = `<thead>
                               <tr>
                                 <th>Connection</th><th>DID</th>
                               </tr>
                             </thead>
                             <tbody></tbody>`;
          table.lastElementChild.appendChild(await this.renderItems(this.items));
      return table;
    }
    async renderItem(cxn, options = {}) {
      let tr = document.createElement('tr');
          tr.setAttribute('connection-id', cxn.id);
          if (options.state) tr.setAttribute('connection-state', options.state);
          tr.innerHTML = `<td>${cxn.id}</td><td>${cxn.did || ''}</td>`;
      return tr;
    }
    
  };
  customElements.define('connection-list', ConnectionList);


  class AppList extends RenderList {
    constructor (options = {}) {
      options.storageBucket = 'apps';
      super(options);
    }
  };
  customElements.define('app-list', AppList);
  
  class DataBrowser extends RenderList {
    constructor (options = {}) {
      options.storageBucket = 'data';
      super(options);
    }
    async renderItem(item, options = {}) {
      let node = await Data.renderDataView(item.data, 'listItem', { inflate: true });
      if (node) {
        node.firstElementChild.setAttribute('data-object-id', item.id);
      }
      else{
        node = document.createElement('li');
        node.setAttribute('data-object-id', item.id);
        node.textContent = item.id + ' - type: ' + item.type;
      }
      return node;
    }
    async renderList(options = {}){
      let list = await super.renderList(options);
          list.setAttribute('list', 'rows');
      return list;
    }
  };
  customElements.define('data-browser', DataBrowser);

export {
  RenderList,
  PersonaList,
  ConnectionList
};