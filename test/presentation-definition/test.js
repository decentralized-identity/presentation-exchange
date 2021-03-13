const fs = require('fs');
const assert = require('assert');
const ajv = require('ajv');


describe('Presentation Definition', function () {
  describe('JSON Schema', function () {
    it('should validate the basic example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + '/schema.json'));
      const data = JSON.parse(fs.readFileSync(__dirname + '/basic_example.json'));
      const jv = new ajv({allErrors: true, $data: true});
      const validate = jv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });

    it('should validate the single group example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + '/schema.json'));
      const data = JSON.parse(fs.readFileSync(__dirname + '/single_group_example.json'));
      const jv = new ajv({allErrors: true, $data: true});
      const validate = jv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });

    it('should validate the multi group example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + '/schema.json'));
      const data = JSON.parse(fs.readFileSync(__dirname + '/multi_group_example.json'));
      const jv = new ajv({allErrors: true, $data: true});
      const validate = jv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });

    it('should validate the format example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + '/schema.json'));
      const data = JSON.parse(fs.readFileSync(__dirname + '/format_example.json'));
      const jv = new ajv({allErrors: true, $data: true});
      const validate = jv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });

    it('should validate the input description sample example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + '/schema.json'));
      const data = JSON.parse(fs.readFileSync(__dirname + '/input_descriptors_example.json'));
      const jv = new ajv({allErrors: true, $data: true});
      const validate = jv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });

    it('should validate the input description id tokens example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + '/schema.json'));
      const data = JSON.parse(fs.readFileSync(__dirname + '/input_descriptor_id_tokens_example.json'));
      const jv = new ajv({allErrors: true, $data: true});
      const validate = jv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });

    it('should validate the VC expiration example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + '/schema.json'));
      const data = JSON.parse(fs.readFileSync(__dirname + '/VC_expiration_example.json'));
      const jv = new ajv({allErrors: true, $data: true});
      const validate = jv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });

    it('should validate the VC revocation example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + '/schema.json'));
      const data = JSON.parse(fs.readFileSync(__dirname + '/VC_revocation_example.json'));
      const jv = new ajv({allErrors: true, $data: true});
      const validate = jv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });
  });
});
