


import './modules/dom.js';
import { UUID } from './modules/uuid.js';
import './modules/json-print.js';

Function.try = fn => {
  try { return fn() }
  catch(e){}
}

function parseFormats(){
  return [jwt_variants, ldp_variants].reduce((obj, variant) => {
    let variants = {};
    let proofProp = variant.getAttribute('proof-prop');
    let proofSuites = JSON.parse(variant.querySelector('input.proof-list').value || '[]').map(obj => obj.value);
    if (proofSuites.length) {
      variants = Array.from(variant.querySelectorAll('input[type="checkbox"]')).reduce((obj, input) => {
        if (input.checked) {
          obj[input.value] = { [proofProp]: proofSuites }
        }
        return obj;
      }, {});
    }
    return Object.assign(obj, variants);
  }, {});
}

let uniqueGroups = {};
function parseInputDescriptors(){
  let result = Array.from(document.querySelectorAll('.input-descriptor')).reduce((descriptors, form) => {
    let inputs = form.elements;
    let id = inputs['descriptor-id'].value;
    let schemas = inputs['schema-list'].value;
    let groups = inputs['group-list'].value; 
    if (id && schemas) {

      groups = groups ? JSON.parse(groups).map(entry => {
        let group = entry.value.toLowerCase();
        uniqueGroups[group] = true;
        return group;
      }) : undefined;

      let fields = Array.from(form.querySelectorAll('.constraint-fields')).reduce((acc, field) => {
        let paths = JSON.parse(field.querySelector('input.path-list').value || '[]').reduce((acc, item) => {
          acc.push(item.value);
          return acc;
        }, []);
        if (paths.length) {
          acc.push({
            path: paths,
            filter: Function.try(() => JSON.parse(field.querySelector('ace-editor').value) || undefined),
            predicate_proof: field.querySelector('.predicate-checkbox').checked ? 
                             field.querySelector('.predicate').value : 
                             undefined
          });
        }
        return acc;
      }, []);

      descriptors.push({
        id: id,
        name: inputs['descriptor-name'].value.trim() || undefined,
        purpose: inputs['descriptor-purpose'].value.trim() || undefined,
        groups: groups,
        schema: {
          uri: JSON.parse(schemas).map(entry => entry.value)
        },
        limit_disclosure: inputs['limit-disclosure-checkbox'].checked ? 
                          inputs['limit-disclosure'].value : 
                          undefined,
        subject_is_issuer: inputs['subject-issuer-checkbox'].checked ? 
                           inputs['subject-issuer'].value : 
                           undefined,
        constraints: fields.length ? {
                        fields: fields
                      } : undefined
      })
    }
    
    return descriptors;

  }, []);

  let options = '';
  for (let z in uniqueGroups) options += `<option value="${z}">`;
  group_list.innerHTML = options;
  return result;
}

let expandKeys = {
  constraints: true,
  fields: true,
  filter: true,
  alg: false,
  proof_type: false
};

function processDefinition(e){
  
  let formats = parseFormats();
  let descriptors = parseInputDescriptors();
  let definition = {
    id: definition_id.value.trim() || undefined,
    name: definition_name.value.trim() || undefined,
    purpose: definition_purpose.value.trim() || undefined,
    formats: Object.keys(formats).length ? formats : undefined,
    input_descriptors: descriptors.length ? descriptors : undefined
  }

  let reqs;
  if (Object.keys(uniqueGroups).length) {
    reqs = Array.from(document.querySelectorAll('.submission-requirement')).reduce((acc, form) => {
      let group = form.elements['group'].value;
      if (group) {
        let req = {
          rule: form.elements['rule-select'].value,
        };
        if (req.rule === 'pick') req.count = Number(form.elements['rule-count'].value);
        req.from = group;
        acc.push(req);
      }
      return acc;
    }, []);
  }

  definition.submission_requirements = reqs;

  presentation_definition.innerHTML = jsonPrint(definition, {
    shouldExpand: function(object, level, key) {
      let keyTest = expandKeys[key];
      if (keyTest !== undefined) return keyTest;
      if (object.path) return true;
      if (level > 2) return false;
      return true;
    }
  });

  Prism.highlightElement(presentation_definition);
}

// INITIALIZATION

definition_id.value = UUID.v4();

document.querySelectorAll('label > input[type="checkbox"]').forEach(input => {
  input.parentNode.toggleAttribute('checked', input.checked)
});

processDefinition();

// EVENTS

DOM.delegateEvent('submit', 'form.input-descriptor', e => e.preventDefault());

let debouncedProcessing = ['*', (e, node) => {
  if (e.target.tagName === 'ACE-EDITOR') {
    let editor = e.target.editor;
    let lineHeight = editor.renderer.lineHeight;
    e.target.style.height = lineHeight * editor.getSession().getDocument().getLength() + 'px';
    editor.resize();
  }
  DOM.debounce(processDefinition, 200)
}, { container: definition_panels }];

DOM.delegateEvent('input', ...debouncedProcessing);
DOM.delegateEvent('change', ...debouncedProcessing);

DOM.delegateEvent('change', 'label > input[type="checkbox"]', (e, input) => {
  input.parentNode.toggleAttribute('checked', input.checked)
});

DOM.delegateEvent('change', '.select > select', (e, select) => {
  select.parentNode.setAttribute('value', select.value);
});

DOM.delegateEvent('ready', '.constraint-fields ace-editor', (e, node) => {
  let editor = node.editor;
  editor.setOptions({
    highlightActiveLine: false,
    showFoldWidgets: false,
    fixedWidthGutter: false,
    placeholder: `{
  "type": "number",
  "minimum": 10
}`,
  })

});

add_input_descriptor.addEventListener('click', function(e) {
  this.before(input_descriptor_template.content.cloneNode(true));
});

DOM.delegateEvent('click', '.add-field', (e, node) => {
  node.before(field_template.content.cloneNode(true));
});

add_submission_requirement.addEventListener('click', function(e) {
  this.before(submission_requirement_template.content.cloneNode(true));
});


// INSTANTIATIONS

let tagifyOptions = {
  duplicates: false,
  dropdown: {
    enabled: 0,             // <- show suggestions on focus
    fuzzySearch: true,
    maxItems: 30,           // <- mixumum allowed rendered suggestions
    closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
  }
}

new Tagify(alg_list, Object.assign({
  whitelist: [
    'ES256K', 'EdDSA', 'ES256', 'ES384', 'ES512', 'PS256', 'PS384', 
    'PS512', 'RS256', 'RS384', 'RS512'
  ]
}, tagifyOptions));

new Tagify(proof_type_list, Object.assign({
  whitelist: [
    'Ed25519Signature2018',
    'RsaSignature2018',
    'EcdsaSecp256k1Signature2019',
    'JsonWebSignature2020',
    'GpgSignature2020',
    'JcsEd25519Signature2020',
    'BbsBlsSignature2020',
    'BbsBlsSignatureProof2020'
  ]
}, tagifyOptions));

// new Tagify(alg_list);



