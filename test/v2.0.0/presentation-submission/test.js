const fs = require('fs');
const assert = require('assert');
const ajv = require('../__fixtures__/ajv');


const presentationSubmissionSchema = '/../../schemas/presentation-submission.json'

describe('Presentation Submission', function () {
  describe('JSON Schema', function () {
    it('should validate the example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + presentationSubmissionSchema));
      const data = JSON.parse(fs.readFileSync(__dirname + '/example.json'));
      const validate = ajv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });

    it('should validate the nested submission example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + presentationSubmissionSchema));
      const data = JSON.parse(fs.readFileSync(__dirname + '/nested_submission_example.json'));
      const validate = ajv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });

    it('should validate the appendix VP example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + presentationSubmissionSchema));
      // Allow additional properties for this
      schema.additionalProperties = true
      const data = JSON.parse(fs.readFileSync(__dirname + '/appendix_VP_example.json'));
      const validate = ajv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });

    it('should validate the appendix OIDC example object using JSON Schema Draft 7', function () {
      const schema = JSON.parse(fs.readFileSync(__dirname + presentationSubmissionSchema));
      // Allow additional properties for this
      schema.additionalProperties = true
      const data = JSON.parse(fs.readFileSync(__dirname + '/appendix_OIDC_example.json'));
      const validate = ajv.compile(schema);
      const valid = validate(data);

      assert.equal(null, validate.errors);
      assert.equal(true, valid);
    });
  });
});
