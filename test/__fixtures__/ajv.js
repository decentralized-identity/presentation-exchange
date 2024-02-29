const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const schemas = {
  "https://identity.foundation/claim-format-registry/schemas/presentation-definition-claim-format-designations.json": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Presentation Definition Claim Format Designations",
    "type": "object",
    "additionalProperties": false,
    "patternProperties": {
      "^jwt$|^jwt_vc$|^jwt_vp$": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "alg": {
            "type": "array",
            "minItems": 1,
            "items": { "type": "string" }
          }
        }
      },
      "^ldp_vc$|^ldp_vp$|^ldp$": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "proof_type": {
            "type": "array",
            "minItems": 1,
            "items": { "type": "string" }
          }
        }
      }
    }
  },
  "https://identity.foundation/claim-format-registry/schemas/presentation-submission-claim-format-designations.json": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Presentation Submission Claim Format Designations",
    "type": "object",
    "definitions": {
      "format": {
        "type": "string",
        "enum": ["jwt", "jwt_vc", "jwt_vp", "ldp", "ldp_vc", "ldp_vp"]
      }
    }
  }
}

const ajv = addFormats(new Ajv({allErrors: true}));

Object.keys(schemas).forEach((uri) => ajv.addSchema(schemas[uri], uri))

module.exports = ajv
