const fs = require('fs');
const assert = require('assert');
const ajv = require('ajv');

/**
 * https://github.com/decentralized-identity/presentation-exchange/pull/18/files#diff-9308a2575ae14de31b25f4459ecfc604R57
 *
 * from dhh1128:
 * 	how do we express boolean options? I can see how we do the trivial ones
 * 	(pick any N out of M). But that's not what I'm asking about. When I
 * 	applied for citizenship for my daughter, I had to present any 2 proofs
 * 	from category A, and any 1 proof from category B, OR I had to present 3
 * 	or more proofs from category B. I don't see a way to model that
 * 	real-world use case. It think that's because we imagine the rules to
 * 	only exist *within* a single requirement, never across requirements.
 * 	And we don't imagine arbitrary combinations of booleans.
 *
 * reponse here:
 * 	we will support all of the above except for the "or more" specifier for
 * 	now. The "or more" specifier can be implemented as a new rule as
 * 	necessary.
 **/

describe('Submission Requirement', function () {
  describe('JSON Schema', function () {
    it('should validate the example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + '/schema.json'));
      const data = JSON.parse(fs.readFileSync(__dirname + '/example.json'));
      const jv = new ajv({allErrors: true});
      const validate = jv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });

    it('should validate the all example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + '/schema.json'));
      const data = JSON.parse(fs.readFileSync(__dirname + '/all_example.json'));
      const jv = new ajv({allErrors: true});
      const validate = jv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });

    it('should validate the pick 1 example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + '/schema.json'));
      const data = JSON.parse(fs.readFileSync(__dirname + '/pick_1_example.json'));
      const jv = new ajv({allErrors: true});
      const validate = jv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });

    it('should validate the pick 2 example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + '/schema.json'));
      const data = JSON.parse(fs.readFileSync(__dirname + '/pick_2_example.json'));
      const jv = new ajv({allErrors: true});
      const validate = jv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });

    it('should validate the pick 3 example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + '/schema.json'));
      const data = JSON.parse(fs.readFileSync(__dirname + '/pick_3_example.json'));
      const jv = new ajv({allErrors: true});
      const validate = jv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });
  });
});
