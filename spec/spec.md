Presentation Exchange
==================

**Specification Status:** Strawman

**Latest Draft:**
  [identity.foundation/presentation-exchange](https://identity.foundation/presentation-exchange)
<!-- -->
**Editors:**
~ [Daniel Buchner](https://www.linkedin.com/in/dbuchner/) (Microsoft)
~ [Brent Zundel](https://www.linkedin.com/in/bzundel/) (Evernym)
~ [Martin Riedel](https://www.linkedin.com/in/rado0x54/) (Civic Technologies)

**Contributors:**
~ [Gabe Cohen](https://www.linkedin.com/in/cohengabe/) (Workday)
~ [Orie Steele](https://www.linkedin.com/in/or13b/) (Transmute)
~ [Wayne Chang](https://www.linkedin.com/in/waynebuilds/) (Spruce)

**Participate:**
~ [GitHub repo](https://github.com/decentralized-identity/presentation-exchange)
~ [File a bug](https://github.com/decentralized-identity/presentation-exchange/issues)
~ [Commit history](https://github.com/decentralized-identity/presentation-exchange/commits/master)

------------------------------------

## Abstract

A common activity between peers in identity systems that feature the ability to generate self-asserted and third-party issued claims is the demand and submission of proofs from a Subject to a Verifier. This flow implicitly requires the Subject and Verifier have a known mechanism to facilitate the two primary steps in a proofing exchange: the way Verifiers define the proof requirements, and how Subjects must encode submissions of proof to align with those requirements.

To address these needs, this Presentation Exchange specification codifies the `Presentation Definition` data format Verifiers can use to articulate proof requirements, as well as the `Presentation Submission` data format Subjects can use to submit proofs in accordance with them.

This specification does not endeavor to define transport protocols, specific endpoints, or other means for conveying the formatted objects it codifies herein, but it is encouraged that others specifications and projects that do define such mechanisms utilize these data formats within their flows.

## Status of This Document

Presentation Exchange is a draft specification being developed within the Decentralized Identity Foundation (DIF), and being designed to incorporate the requirements and learnings from related work of the most active industry players into a shared specification that meets the collective needs of the community. This spec will be updated to reflect relevant changes, and participants are encouraged to actively engage on GitHub (see above) and other mediums (e.g. DIF) where this work is being done.

## Terminology

Term | Definition
:--- | :---------
Decentralized Identifier (DID) | Unique ID string and PKI metadata document format for describing the cryptographic keys and other fundamental PKI values linked to a unique, user-controlled, self-sovereign identifier in a target system (i.e. blockchain, distributed ledger).
Subject | The entity that submits proofs to a Verifier to satisfy the requirements described in a Presentation Definition
Verifier | The entity that defines what proofs they require from a Subject (via a Presentation Definition) in order to proceed with an interaction.

## Presentation Definition

Presentation Definitions are objects generate to articulate what proofs an entity requires to make a decision about an interaction with a Subject. Presentation Definitions are composed of inputs, which describe the forms and details of the proofs they require, and and optional set of selection rules, to allow Subjects flexibility in cases where many different types of proofs may satisfy an input requirement.


<tab-panels selected-index="0">

<nav>
  <button type="button">Basic Example</button>
  <button type="button">Single Group Example</button>
  <button type="button">Multi-Group Example</button>
</nav>

<section>

::: example Presentation Definition - Basic Example
```json
{
  // VP, OIDC, DIDComms, or CHAPI outer wrapper

  "presentation_definition": {
    "input_descriptors": [
      {
        "id": "banking_input",
        "schema": {
          "uri": ["https://bank-standards.com/customer.json"],
          "name": "Bank Account Information",
          "purpose": "We need your bank and account information."
        },
        "constraints": {
          "limit_disclosure": true,
          "fields": [
            {
              "path": ["$.issuer", "$.vc.issuer", "$.iss"],
              "purpose": "The credential must be from one of the specified issuers",
              "filter": {
                "type": "string",
                "pattern": "did:example:123|did:example:456"
              }
            }
          ]
        }
      },
      {
        "id": "citizenship_input",
        "schema": {
          "uri": ["hub://did:foo:123/Collections/schema.us.gov/passport.json"],
          "name": "US Passport"
        },
        "constraints": {
          "fields": [
            {
              "path": ["$.credentialSubject.birth_date", "$.vc.credentialSubject.birth_date", "$.birth_date"],
              "filter": {
                "type": "date",
                "minimum": "1999-5-16"
              }
            }
          ]
        }
      }
    ]
  }
}
```

</section>

<section>

::: example Presentation Definition - Single Group Example
```json
{
  // VP, OIDC, DIDComms, or CHAPI outer wrapper

  "presentation_definition": {
    "submission_requirements": [{
      "name": "Citizenship Information",
      "rule": "pick",
      "count": 1,
      "from": "A"
    }],
    "input_descriptors": [
      {
        "id": "citizenship_input_1",
        "group": ["A"],
        "schema": {
          "uri": ["https://eu.com/claims/DriversLicense.json"],
          "name": "EU Driver's License"
        },
        "constraints": {
          "fields": [
            {
              "path": ["$.issuer", "$.vc.issuer", "$.iss"],
              "purpose": "The credential must be from one of the specified issuers",
              "filter": {
                "type": "string",
                "pattern": "did:example:gov1|did:example:gov2"
              }
            },
            {
              "path": ["$.credentialSubject.dob", "$.vc.credentialSubject.dob", "$.dob"],
              "filter": {
                "type": "date",
                "minimum": "1999-5-16"
              }
            }
          ]
        }
      },
      {
        "id": "citizenship_input_2",
        "group": ["A"],
        "schema": {
          "uri": ["hub://did:foo:123/Collections/schema.us.gov/passport.json"],
          "name": "US Passport"
        },
        "constraints": {
          "fields": [
            {
              "path": ["$.credentialSubject.birth_date", "$.vc.credentialSubject.birth_date", "$.birth_date"],
              "filter": {
                "type": "date",
                "minimum": "1999-5-16"
              }
            }
          ]
        }
      }
    ]
  }
}
```

</section>

<section>

::: example Presentation Definition - Multi-Group Example
```json
{
  // VP, OIDC, DIDComms, or CHAPI outer wrapper
  
  "presentation_definition": {
    "submission_requirements": [
      {
        "name": "Banking Information",
        "purpose": "We need to know if you have an established banking history.",
        "rule": "pick",
        "count": 1,
        "from": "A"
      },
      {
        "name": "Employment Information",
        "purpose": "We need to know that you are currently employed.",
        "rule": "all",
        "from": "B"
      },
      {
        "name": "Citizenship Information",
        "rule": "pick",
        "count": 1,
        "from": "C"
      }
    ],
    "input_descriptors": [
      {
        "id": "banking_input_1",
        "group": ["A"],
        "schema": {
          "uri": ["https://bank-standards.com/customer.json"],
          "name": "Bank Account Information",
          "purpose": "We need your bank and account information."
        },
        "constraints": {
          "limit_disclosure": true,
          "fields": [
            {
              "path": ["$.issuer", "$.vc.issuer", "$.iss"],
              "purpose": "The credential must be from one of the specified issuers",
              "filter": {
                "type": "string",
                "pattern": "did:example:123|did:example:456"
              }
            },
            {
              "path": ["$.credentialSubject.account[*].account_number", "$.vc.credentialSubject.account[*].account_number", "$.account[*].account_number"],
              "purpose": "We need your bank account number for processing purposes",
              "filter": {
                "type": "string",
                "minLength": 10,
                "maxLength": 12
              }
            },
            {
              "path": ["$.credentialSubject.account[*].routing_number", "$.vc.credentialSubject.account[*].routing_number", "$.account[*].routing_number"],
              "purpose": "You must have an account with a German, US, or Japanese bank account",
              "filter": {
                "type": "string",
                "pattern": "^DE|^US|^JP"
              }
            }
          ]
        }
      },
      {
        "id": "banking_input_2",
        "group": ["A"],
        "schema": {
          "uri": [
            "https://bank-schemas.org/1.0.0/accounts.json",
            "https://bank-schemas.org/2.0.0/accounts.json"
          ],
          "name": "Bank Account Information",
          "purpose": "We need your bank and account information."
        },
        "constraints": {
          "fields": [
            {
              "path": ["$.issuer", "$.vc.issuer", "$.iss"],
              "purpose": "The credential must be from one of the specified issuers",
              "filter": {
                "type": "string",
                "pattern": "did:example:123|did:example:456"
              }
            },
            { 
              "path": ["$.credentialSubject.account[*].id", "$.vc.credentialSubject.account[*].id", "$.account[*].id"],
              "purpose": "We need your bank account number for processing purposes",
              "filter": {
                "type": "string",
                "minLength": 10,
                "maxLength": 12
              }
            },
            {
              "path": ["$.credentialSubject.account[*].route", "$.vc.credentialSubject.account[*].route", "$.account[*].route"],
              "purpose": "You must have an account with a German, US, or Japanese bank account",
              "filter": {
                "type": "string",
                "pattern": "^DE|^US|^JP"
              }
            }
          ]
        }
      },
      {
        "id": "employment_input",
        "group": ["B"],
        "schema": {
          "uri": ["https://business-standards.org/schemas/employment-history.json"],
          "name": "Employment History",
          "purpose": "We need to know your work history."
        },
        "constraints": {
          "fields": [
            {
              "path": ["$.jobs[*].active"],
              "filter": {
                "type": "boolean",
                "pattern": "true"
              }
            }
          ]
        }
      },
      {
        "id": "citizenship_input_1",
        "group": ["C"],
        "schema": {
          "uri": ["https://eu.com/claims/DriversLicense.json"],
          "name": "EU Driver's License"
        },
        "constraints": {
          "fields": [
            {
              "path": ["$.issuer", "$.vc.issuer", "$.iss"],
              "purpose": "The credential must be from one of the specified issuers",
              "filter": {
                "type": "string",
                "pattern": "did:example:gov1|did:example:gov2"
              }
            },
            {
              "path": ["$.credentialSubject.dob", "$.vc.credentialSubject.dob", "$.dob"],
              "filter": {
                "type": "date",
                "minimum": "1999-5-16"
              }
            }
          ]
        }
      },
      {
        "id": "citizenship_input_2",
        "group": ["C"],
        "schema": {
          "uri": ["hub://did:foo:123/Collections/schema.us.gov/passport.json"],
          "name": "US Passport"
        },
        "constraints": {
          "fields": [
            {
              "path": ["$.credentialSubject.birth_date", "$.vc.credentialSubject.birth_date", "$.birth_date"],
              "filter": {
                "type": "date",
                "minimum": "1999-5-16"
              }
            }
          ]
        }
      },
    ]
  }
}
```
:::

</section>

</tab-panels>

The following properties are defined for use at the top-level of the resource - all other properties that are not defined below MUST be ignored:

- `name` - The resource ****MAY**** contain this property, and if present its value ****SHOULD**** be a human-friendly name that describes what the Presentation Definition pertains to.
- `purpose` - The resource ****MAY**** contain this property, and if present its value ****MUST**** be a string that describes the purpose for which the Presentation Definition's inputs are being requested.
- `submission_requirement` - The resource ****MAY**** contain this property,
  and if present, its value ****MUST**** conform to the Submission Requirement
  Format. If not present, all inputs listed in the `input_descriptor` array are
  required for submission. The format for this property is described in the
  [`Submission Requirement`](#submission-requirement) section below.
- `input_descriptors` - The resource ****MUST**** contain this property, and
  its value ****MUST**** be an array of Input Descriptor objects. If no
  `submission_requirement` is present, all inputs listed in the
  `input_descriptor` array are required for submission. The composition of
  values under this property are described in the [`Input
  Descriptors`](#input-descriptors) section below.

### Submission Requirements

_Presentation Definitions_ ****MAY**** include one or more _Submission Requirements_,
which define combinations of inputs that satisfy an Issuer or Verifier's
conditions, such as the satisfaction of prerequisite proofs before issuance 
of a credential. _Submission Requirements_ can be interpreted by a 
User Agent as instructions on how to present requirement optionality to the 
user and submit a valid combination of inputs back to the Verifier via a _Proof Submission_ 
object. The following section defines the format for the _Submission Requirement_ 
object and the selection syntax used to specify valid input combinations.

All members of the `submission_requirements` array ****MUST**** be satisfied.

::: example Submission Requirement
```json
  "submission_requirements": [
    {
      "name": "Banking Information",
      "purpose": "We need to know if you have an established banking history.",
      "rule": "pick",
      "count": 1,
      "from": "A"
    },
    {
      "name": "Employment Information",
      "purpose": "We need to know that you are currently employed.",
      "rule": "all",
      "from": "B"
    }
    {
      "name": "Citizenship Information",
      "rule": "pick",
      "count": 1,
      "from_nested": [
        {
          "name": "United States Citizenship Proofs",
          "purpose": "We need you to prove you are a US citizen.",
          "rule": "all",
          "from": "C"
        },
        {
          "name": "European Union Citizenship Proofs",
          "purpose": "We need you to prove you are a citizen of a EU country.",
          "rule": "all",
          "from": "D"
        }
      ]
    }
  ]
```
:::

#### Submission Requirement Objects

_Submission Requirement Objects_ describe combinations of inputs that ****must**** be submitted 
via a [Presentation Submission](#presentation-submission) to satisfy Verifier demands. 
_Submission Requirement Objects_ are JSON objects constructed as follows:

1. The object  ****MUST**** contain a `rule` property, and its value
   ****MUST**** be a string matching one of the [Submission Requirement
   Rules](#submission-requirement-rules) values listed in the section below.
2. The object ****MUST**** contain either a `from` 'or `from_nested` property. 
  If both properties are present, the implementation ***MUST*** produce an 
  error. The values of the `from` and `from_nested` properties are defined as follows:
    - `from` - the value of the `from` property ****must**** be a `group` string 
    matching one of the `group` strings specified for one or more _Input Descriptor_ objects.
    - `from_nested` - an array of nested _Submission Requirement Objects_.
3. The object  ****MAY**** contain a `name` property, and if present, its value
   ****MUST**** be a string which ****MAY**** be
   used by a consuming User Agent to display the general name of the
   requirement set to a user.
4. The object ****MAY**** contain a `purpose` property and, if present, its
   value ****MUST**** be a string that describes the purpose for which the
   specified requirement is being asserted.
5. The object ****MAY**** contain additional properties as required by
   [Submission Requirement Rules](#submission-requirement-rules), such as
   `count`, `min`, and `max` for the `"pick"` rule.

#### Submission Requirement Rules

[_Submission Requirement Rules_](#submission-requirement-rules){id="requirement-rules"} are used within
_Submission Requirement Objects_ to describe the specific combinatorial rule
that must be applied to submit a particular subset of required inputs. Rules
are selected by populating the `rule` property with the corresponding string.
An implementation ****MUST**** support the following standard types:

##### `all` rule

- The object ****must**** contain a `rule` property, and its value ****MUST**** be the string `"all"`.
- The object ****MUST**** contain either a `from` or `from_nested` property, 
  which behave as follows when used in an `all` rule:
    - `from` - when used within an `all` rule, every _Input Descriptor_ matching
      the group string of the `from` value must be submitted to the Verifier.
    - `from_nested` - when used within an `all` rule, all the _Submission Requirement Objects_ 
      specified in the `from_nested` array must be satisfied by the inputs submitted in a 
      subsequent [Presentation Submission](#presentation-submission).

::: example Submission Requirement, all, group
  ```json
  "submission_requirements": [
    {
      "name": "Submission of educational transcripts",
      "purpose": "We need all your educational transcripts to process your application",
      "rule": "all",
      "from": "A"
    }
  ]
  ```
:::

##### `pick` rule

- The _Submission Requirement_ object's `rule` property ****MUST**** contain
  the string value `"pick"`.
- The _Submission Requirement_ object ****MAY**** contain a `count` property,
  and if present, its value ****MUST**** be an integer greater than zero.
- The _Submission Requirement_ object ****MAY**** contain a `min` property,
  and if present, its value ****MUST**** be an integer greater than or equal to zero.
- The _Submission Requirement_ object ****MAY**** contain a `max` property,
  and if present, its value ****MUST**** be an integer greater than zero, and, if 
  also present, greater than the value of the `min` property.
- The _Submission Requirement_ object ****MUST**** contain either a `from` property 
  or a `from_nested` property, and of whichever are present, all inputs from the 
  `from` group string specified or _Submission Requirements_ in the `from_nested` array 
  ****MUST**** be submitted or satisfied.


If the `from` property contains a `group` string, it directs the consumer of
the _Presentation Definition_ to submit all members of the matching `group`
string. In the following example, the `from` property contains a `group`
string to require a single member of group `"B"`:

::: example Submission Requirement, pick, group
  ```json
  "submission_requirements": [
    {
      "name": "Citizenship Proof",
      "purpose": "We need to confirm you are a citizen of one of the following countries",
      "rule": "pick",
      "count": 1,
      "from": "B"
    }
  ]
  ```
:::

::: example Submission Requirement, pick, min/max
  ```json
  "submission_requirements": [
    {
      "name": "Citizenship Proof",
      "purpose": "We need to confirm you are a citizen of one of the following countries",
      "rule": "pick",
      "min": 2,
      "max": 4,
      "from": "B"
    }
  ]
  ```
:::

If the `from` property contains an array of nested _Submission Requirement_
objects, it directs the consumer of the _Presentation Definition_ to submit
members such that the number of satisfied _Submission Requirement_ objects is
exactly `count`. In the following example, the `from` property contains an
array of nested _Submission Requirement_ objects to require either all members
from group `"A"` or two members from group `"B"`:

::: example Submission Requirement, pick, nested
  ```json
  "submission_requirements": [
    {
      "name": "Confirm banking relationship or employment and residence proofs",
      "purpose": "Submit your bank statement or proofs of employment and residence to process your loan",
      "rule": "pick",
      "count": 1,
      "from_nested": [
        { "rule": "all", "from": "A" },
        { "rule": "pick", "count": 2, "from": "B" }
      ]
    }
  ]
  ```
:::

#### JSON Schema
The following JSON Schema Draft 7 definition summarizes many of the
format-related rules above:

  ```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "submission_requirements": {
      "type": "object",
      "oneOf": [
        {
          "required": ["rule", "from"],
          "properties": {
            "name": { "type": "string" },
            "purpose": { "type": "string" },
            "rule": { "type": "string" },
            "count": { "type": "integer", "minimum": 1 },
            "from": { "type": "string" }
          }
        },
        {
          "required": ["rule", "from"],
          "properties": {
            "name": { "type": "string" },
            "purpose": { "type": "string" },
            "rule": { "type": "string" },
            "count": { "type": "integer", "minimum": 1 },
            "from": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/submission_requirements"
              }
            }
          }
        }
      ]
    }
  },
  "type": "object",
  "properties": {
    "submission_requirements": {
      "$ref": "#/definitions/submission_requirements"
    }
  }
}
  ```

#### Property Values and Evaluation
The following property value and evaluation guidelines summarize many of the
processing-related rules above:
1. The `rule` property value may be either `"all"` or `"pick"`, and the implementation 
  ****MUST**** produce an error if an unknown `rule` value is present.
2. The _Submission Requirement_  ****MUST**** contain a `from` property or a `from_nested` 
  property, not both, and if present their values must be a string or an array, respectively. 
  If any of these conditions are not met, the implementation ****MUST**** produce an error.
3. To determine whether a _Submission Requirement_ is satisfied, used the following algorithm:
    - If the `rule` is `"all"`, then the _Submission Requirement_ MUST contain a `from` property 
      or a `from_nested` property, and of whichever are present, all inputs from the 
      `from` group string specified or _Submission Requirements_ in the `from_nested` array 
      ****MUST**** be submitted or satisfied, respectively.
    - If the `rule` is `"pick"`, then the _Submission Requirement_ MUST contain a `from` property 
      or a `from_nested` property, and of whichever are present, they must be evaluated as follows:
        - if a `count` property is present, the number of inputs submitted, or nested 
          _Submission Requirements_ satisfied, ****MUST**** be exactly equal to the value of `count` property.
        - if a `min` property is present, the number of inputs submitted, or nested 
          _Submission Requirements_ satisfied, ****MUST**** be equal to or greater than the value of the `min` property.
        - if a `max` property is present, the number of inputs submitted, or nested 
          _Submission Requirements_ satisfied, ****MUST**** be equal to or less than the value of the `max` property.

### Input Descriptors

_Input Descriptors_ are objects used to describe the proofing inputs a Verifier requires
of a Subject before they will proceed with an interaction. _Input Descriptor Objects_
contain a schema URI that links to the schema of the required input data, constraints
on data values, and an explanation why a certain item or set of data is being requested:

<tab-panels selected-index="0">

<nav>
  <button type="button">Sample Descriptor</button>
  <button type="button">Descriptor for ID Tokens</button>
</nav>

<section>

::: example
```json
"input_descriptors": [
  {
    "id": "banking_input_1",
    "group": ["A"],
    "schema": {
      "uri": [
        "https://bank-schemas.org/1.0.0/accounts.json",
        "https://bank-schemas.org/2.0.0/accounts.json"
      ],
      "name": "Bank Account Information",
      "purpose": "We need your bank and account information."
    },
    "constraints": {
      "fields": [
        {
          "path": ["$.issuer", "$.vc.issuer", "$.iss"],
          "purpose": "The credential must be from one of the specified issuers",
          "filter": {
            "type": "string",
            "pattern": "did:example:123|did:example:456"
          }
        },
        { 
          "path": ["$.credentialSubject.account[*].id", "$.vc.credentialSubject.account[*].id", "$.account[*].id"],
          "purpose": "We need your bank account number for processing purposes",
          "filter": {
            "type": "string",
            "minLength": 10,
            "maxLength": 12
          }
        },
        {
          "path": ["$.credentialSubject.account[*].route", "$.vc.credentialSubject.account[*].route", "$.account[*].route"],
          "purpose": "You must have an account with a German, US, or Japanese bank account",
          "filter": {
            "type": "string",
            "pattern": "^DE|^US|^JP"
          }
        }
      ]
    }
  }
]
```
:::

</section>

<section>

::: example
```json
{
  "id": "employment_input_xyz_gov",
  "group": ["B"],
  "schema": {
    "uri": ["https://login.idp.com/xyz.gov/.well-known/openid-configuration"],
    "name": "Verify XYZ Government Employment",
    "purpose": "We need to know if you currently work at an agency in the XYZ government",
    "metadata": {
      "client_id": "40be4fb5-7f3a-470b-aa37-66ed43821bd7",
      "redirect_uri": "https://tokens.xyz.gov/verify"
    }
  },
  "constraints": {
    "fields": [
      {
        "path": ["$.status"],
        "filter": {
          "type": "string",
          "pattern": "active"
        }
      }
    ]
  }
}
```

</section>

</tab-panel>

#### Input Descriptor Objects

_Input Descriptors_ are objects that describe what type of input data/credential, or sub-fields thereof, is required for submission to the Verifier. _Input Descriptor Objects_ are composed as follows:

  - The object ****MUST**** contain an `id` property. The value of the `id` property ****MUST**** be a unique identifying string that does not conflict with the `id` of another _Input Descriptor_ in the same _Presentation Definition_ object.
  - The object ****MAY**** contain a `group` property, and if present, its value ****MUST**** match one of the grouping strings listed the `from` values of a [_Requirement Rule Object_](#requirement-rule-objects).
  - The object ****MUST**** contain a `schema` property, and its value ****MUST**** be an object composed as follows:
      - The object ****MUST**** contain a `uri` property, and its value ****MUST**** be an array consisting of one or more valid URI strings for the acceptable credential schemas. A common use of multiple entries in the `uri` array is when multiple versions of a credential schema exist and you wish to express support for submission of more than one version.
      - The object ****MAY**** contain a `name` property, and if present its value ****SHOULD**** be a human-friendly name that describes what the target schema represents.
      - The object ****MAY**** contain a `purpose` property, and if present its value ****MUST**** be a string that describes the purpose for which the credential's data is being requested.
      - The object ****MAY**** contain a `metadata` property, and if present its value ****MUST**** be an object with metadata properties that describe any information specific to the acquisition, formulation, or details of the credential in question.
  - The object ****MAY**** contain a `constraints` property, and its value ****MUST**** be an object composed as follows: 
      - The object ****MAY**** contain a `limit_disclosure` property, and if present its value ****MUST**** be a boolean value. Setting the property to `true` indicates that the processing entity ****SHOULD NOT**** submit any fields beyond those listed in the `fields` array (if present). Setting the property to `false`, or omitting the property, indicates the processing entity ****MAY**** submit a response that contains more than the data described in the `fields` array.
      - The object ****MAY**** contain a `fields` property, and its value ****MUST**** be an array of [_Input Descriptor Field Entry_](#input-descriptor-field-entry) objects, each being composed as follows:
          - The object ****MUST**** contain a `path` property, and its value ****MUST**** be an array of one or more [JSONPath](https://goessner.net/articles/JsonPath/) string expressions, specifically this variant of JSONPath: https://www.npmjs.com/package/jsonpath, that select some subset of values from the target input. The array ****MUST**** be evaluated from 0-index forward, and the first expressions to return a value will be used for the rest of the entry's evaluation. The ability to declare multiple expressions this way allows the Verifier to account for format differences - for example: normalizing the differences in structure between JSON-LD/JWT-based [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) and vanilla [JSON Web Tokens](https://tools.ietf.org/html/rfc7797) (JWTs).
          - The object ****MAY**** contain a `purpose` property, and if present its value ****MUST**** be a string that describes the purpose for which the field is being requested.
          - The object ****MAY**** contain a `filter` property, and if present its value ****MUST**** be [JSON Schema](https://json-schema.org/specification.html) descriptor used to filter against the values returned from evaluation of the [JSONPath](https://goessner.net/articles/JsonPath/) string expressions in the `path` array.

### Input Evaluation

A consumer of a _Presentation Definition_ must filter inputs they hold (signed credentials, raw data, etc.) to determine whether they possess the inputs required to fulfill the demands of the Verifying party. A consumer of a _Presentation Definition_ ****SHOULD**** use the following process to validate whether or not its candidate inputs meet the requirements it describes:

For each _Input Descriptor_ in the `input_descriptors` array of a _Presentation Definition_, a User Agent ****should**** compare each candidate input (JWT, Verifiable Credential, etc.) it holds to determine whether there is a match. Evaluate each candidate input as follows:
  1. The candidate input ****must**** match one of the _Input Descriptor_ `schema` object `uri` values. If one of the values is an exact match, proceed, if there are no exact matches, skip to the next candidate input.
  2. If the `constraints` property of the _Input Descriptor_ is present and it contains a `fields` property with one or more [_Input Descriptor Field Entries_](#input-descriptor-field-entry), evaluate each against the candidate input as follows:
      1. Iterate the _Input Descriptor_ `path` array of [JSONPath](https://goessner.net/articles/JsonPath/) string expressions from 0-index, executing each expression against the candidate input. Cease iteration at the first expression that returns a matching _Field Query Result_ and use the result for the rest of the field's evaluation. If no result is returned for any of the expressions, skip to the next candidate input.
      2. If the `filter` property of the field entry is present, validate the _Field Query Result_ from the step above against the [JSON Schema](https://json-schema.org/specification.html) descriptor value.
      3. If the result is valid, proceed iterating the rest of the `fields` entries.
  3. If all of the previous validation steps are successful, mark the candidate input as a match for use in a _Presentation Submission_, and if present at the top level of the _Input Descriptor_, keep a relative reference to the `group` values the input is designated for.
  4. If the `constraints` property of the _Input Descriptor_ is present and it contains a `limit_disclosure` property set to the boolean value `true`, ensure that any subsequent submission of data in relation to the candidate input is limited to the entries specified in the `fields` property. If the `fields` property ****is not**** present, or contains zero [_Input Descriptor Field Entries_](#input-descriptor-field-entry), submission ****SHOULD NOT**** include any claim data from the credential. (for example: a Verifier may simply want to know a Subject has a valid, signed credential of a particular type, without disclosing any of the data it contains)

::: note
The above evaluation process assumes the User Agent will test each candidate input (JWT, Verifiable Credential, etc.) it holds to determine if it meets the criteria for inclusion in submission. Any additional testing of a candidate input for a schema match beyond comparison of the schema `uri` (e.g. specific requirements or details expressed in schema `metadata`) is at the discretion of the implementer.
:::

## Presentation Submission

_Presentation Submissions_ are objects embedded within target credential negotiation formats that unify the presentation of proofs to a Verifier in accordance with the requirements a Verifier specified in a _Presentation Definition_. Embedded _Presentation Submission_ objects ****MUST**** be located within target data format as a `presentation_submission` property, which are composed as follows:

  - The object ****MUST**** include a `descriptor_map` property, and its value ****MUST**** be an array of _Input Descriptor Mapping Objects_, each being composed as follows:
      - The object ****MUST**** include an `id` property, and its value ****MUST**** be a string matching the `id` property of the _Input Descriptor_ in the _Presentation Definition_ the submission is related to.
      - The object ****MUST**** include a `path` property, and its value ****MUST**** be a [JSONPath](https://goessner.net/articles/JsonPath/) string expression that selects the credential to be submit in relation to the identified _Input Descriptor_ identified, when executed against the top-level of the object the _Presentation Submission_ is embedded within.

If for all credentials submitted in relation to [_Input Descriptor Objects_](#input-descriptor-objects) that include a `constraints` object with a `limit_disclosure` property set to the boolean value `true`, ensure that the data submitted is limited to the entries specified in the `fields` property of the `constraints` object. If the `fields` property ****is not**** present, or contains zero [_Input Descriptor Field Entries_](#input-descriptor-field-entry), the submission ****SHOULD NOT**** include any claim data from the credential. (for example: a Verifier may simply want to know a Subject has a valid, signed credential of a particular type, without disclosing any of the data it contains).

### Embed Targets

The following section details where the _Presentation Submission_ is to be embedded within a target data structure, as well as how to formulate the [JSONPath](https://goessner.net/articles/JsonPath/) expressions to select the credentials within the target data structure.

<tab-panels selected-index="0">

<nav>
  <button type="button">Verifiable Presentation</button>
  <button type="button">Open ID Connect</button>
  <button type="button">CHAPI</button>
  <button type="button">DIDComms</button>
</nav>

<section>

::: example Presentation Submission - Verifiable Presentation
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://identity.foundation/presentation-exchange/submission/v1"
  ],
  "type": [
    "VerifiablePresentation",
    "PresentationSubmission"
  ],
  "presentation_submission": {
    "descriptor_map": [
      {
        "id": "banking_input_2",
        "path": "$.verifiableCredential.[0]"
      },
      {
        "id": "employment_input",
        "path": "$.verifiableCredential.[1]"
      },
      {
        "id": "citizenship_input_1",
        "path": "$.verifiableCredential.[2]"
      }
    ]
  },
  "verifiableCredential": [
    { // DECODED JWT PAYLOAD, ASSUME THIS WILL BE A BIG UGLY OBJECT
      "vc": {
        "@context": "https://www.w3.org/2018/credentials/v1",
        "id": "https://eu.com/claims/DriversLicense",
        "type": ["EUDriversLicense"],
        "issuer": "did:example:123",
        "issuanceDate": "2010-01-01T19:73:24Z",
        "credentialSubject": {
          "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
          "accounts": [
            {
              "id": "1234567890",
              "route": "DE-9876543210"
            },
            {
              "id": "2457913570",
              "route": "DE-0753197542"
            }
          ]
        }
      }
    },
    {
      "@context": "https://www.w3.org/2018/credentials/v1",
      "id": "https://eu.com/claims/DriversLicense",
      "type": ["EUDriversLicense"],
      "issuer": "did:foo:123",
      "issuanceDate": "2010-01-01T19:73:24Z",
      "credentialSubject": {
        "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
        "license": {
          "number": "34DGE352",
          "dob": "07/13/80"
        }
      },
      "proof": {
        "type": "EcdsaSecp256k1VerificationKey2019",
        "created": "2017-06-18T21:19:10Z",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "https://example.edu/issuers/keys/1",
        "jws": "..."
      }
    },
    {
      "@context": "https://www.w3.org/2018/credentials/v1",
      "id": "https://eu.com/claims/DriversLicense",
      "type": ["EUDriversLicense"],
      "issuer": "did:foo:123",
      "issuanceDate": "2010-01-01T19:73:24Z",
      "credentialSubject": {
        "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
        "license": {
          "number": "34DGE352",
          "dob": "07/13/80"
        }
      },
      "proof": {
        "type": "RsaSignature2018",
        "created": "2017-06-18T21:19:10Z",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "https://example.edu/issuers/keys/1",
        "jws": "..."
      }
    }
  ],

  "proof": {
    "type": "RsaSignature2018",
    "created": "2018-09-14T21:19:10Z",
    "proofPurpose": "authentication",
    "verificationMethod": "did:example:ebfeb1f712ebc6f1c276e12ec21#keys-1",
    "challenge": "1f44d55f-f161-4938-a659-f8026467f126",
    "domain": "4jt78h47fh47",
    "jws": "...",
  }
}
```
:::

</section>

<section>

::: example Presentation Submission with OIDC JWT
```json
{
  "iss": "https://self-issued.me",
  "sub": "248289761001",
  "preferred_username": "superman445",
  "presentation_submission": {
    "descriptor_map": [
      {
        "id": "banking_input_2",
        "path": "$._claim_sources.banking_input_2.JWT"
      },
      {
        "id": "employment_input",
        "path": "$._claim_sources.employment_input.VC_JWT"
      },
      {
        "id": "citizenship_input_1",
        "path": "$._claim_sources.citizenship_input_1.VC"
      }
    ]
  },
  "_claim_names": {
    "verified_claims": [
      "banking_input_2",
      "employment_input",
      "citizenship_input_1"
    ]
  },
  "_claim_sources": {
    "banking_input_2": {
      "JWT": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwcz
      ovL3NlcnZlci5vdGhlcm9wLmNvbSIsInN1YiI6ImU4MTQ4NjAzLTg5MzQtNDI0N
      S04MjViLWMxMDhiOGI2Yjk0NSIsInZlcmlmaWVkX2NsYWltcyI6eyJ2ZXJpZmlj
      YXRpb24iOnsidHJ1c3RfZnJhbWV3b3JrIjoiaWFsX2V4YW1wbGVfZ29sZCJ9LCJ
      jbGFpbXMiOnsiZ2l2ZW5fbmFtZSI6Ik1heCIsImZhbWlseV9uYW1lIjoiTWVpZX
      IiLCJiaXJ0aGRhdGUiOiIxOTU2LTAxLTI4In19fQ.FArlPUtUVn95HCExePlWJQ
      6ctVfVpQyeSbe3xkH9MH1QJjnk5GVbBW0qe1b7R3lE-8iVv__0mhRTUI5lcFhLj
      oGjDS8zgWSarVsEEjwBK7WD3r9cEw6ZAhfEkhHL9eqAaED2rhhDbHD5dZWXkJCu
      XIcn65g6rryiBanxlXK0ZmcK4fD9HV9MFduk0LRG_p4yocMaFvVkqawat5NV9QQ
      3ij7UBr3G7A4FojcKEkoJKScdGoozir8m5XD83Sn45_79nCcgWSnCX2QTukL8Ny
      wIItu_K48cjHiAGXXSzydDm_ccGCe0sY-Ai2-iFFuQo2PtfuK2SqPPmAZJxEFrF
      oLY4g"
    },
    "employment_input": {
      "VC_JWT": { // DECODED JWT PAYLOAD, ASSUME THIS WILL BE A BIG UGLY OBJECT
        "vc": {
          "@context": "https://www.w3.org/2018/credentials/v1",
          "id": "https://eu.com/claims/DriversLicense",
          "type": ["EUDriversLicense"],
          "issuer": "did:example:123",
          "issuanceDate": "2010-01-01T19:73:24Z",
          "credentialSubject": {
            "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
            "accounts": [
              {
                "id": "1234567890",
                "route": "DE-9876543210"
              },
              {
                "id": "2457913570",
                "route": "DE-0753197542"
              }
            ]
          }
        }
      }
    },
    "citizenship_input_1": {
      "VC": {
        "@context": "https://www.w3.org/2018/credentials/v1",
        "id": "https://eu.com/claims/DriversLicense",
        "type": ["EUDriversLicense"],
        "issuer": "did:foo:123",
        "issuanceDate": "2010-01-01T19:73:24Z",
        "credentialSubject": {
          "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
          "license": {
            "number": "34DGE352",
            "dob": "07/13/80"
          }
        },
        "proof": {
          "type": "EcdsaSecp256k1VerificationKey2019",
          "created": "2017-06-18T21:19:10Z",
          "proofPurpose": "assertionMethod",
          "verificationMethod": "https://example.edu/issuers/keys/1",
          "jws": "..."
        }
      }
    }
  }
}
```
:::

</section>

<section>

::: example Presentation Submission using CHAPI
```json
{
  "type": "web",
  "dataType": "VerifiablePresentation",
  "data": {
    // Presentation Submission goes here
  }
}
```

</section>

<section>

::: example Presentation Submission using CHAPI
```json
{
  "???": "???"
}
```
:::

</section>

### JSON Schema
The following JSON Schema Draft 7 definition summarizes the rules above:

  ```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Presentation Submission",
  "type": "object",
  "properties": {
    "presentation_submission": {
      "type": "object",
      "properties": {
        "descriptor_map": {
          "type": "array",
          "items": { "$ref": "#/definitions/descriptor" }
        }
      },
      "required": ["descriptor_map"],
      "additionalProperties": false
    }
  },
  "definitions": {
    "descriptor": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "path": { "type": "string" }
      },
      "required": ["id", "path"],
      "additionalProperties": false
    }
  },
  "required": ["presentation_submission"],
  "additionalProperties": false
}
  ```

</tab-panels>

## JSON Schema Vocabulary Definition

The _Presentation Exchange_ specification adopts and defines the following JSON Schema data format and processing variant, which implementers ****MUST**** support for evaluation of the portions of the _Presentation Exchange_ specification that call for JSON Schema validation: https://tools.ietf.org/html/draft-handrews-json-schema-02


## JSONPath Syntax Definition

The _Presentation Exchange_ specification adopts and defines the following syntax from the JSONPath object query language, which implementers ****MUST**** support for evaluation of the portions of the _Presentation Exchange_ specification that call for JSONPath expression execution.

JSONPath              | Description
----------------------|------------
` $`                  | The root object/element
` @`                  | The current object/element
`.`                   | Child member operator
`..`	                | Recursive descendant operator; JSONPath borrows this syntax from E4X
`*`	                  | Wildcard matching all objects/elements regardless their names
`[]`	                | Subscript operator
`[,]`	                | Union operator for alternate names or array indices as a set
`[start:end:step]` | Array slice operator borrowed from ES4 / Python
`?()`                 | Applies a filter (script) expression via static evaluation
`()`	                | Script expression via static evaluation 

**Example JSON Object**

```javascript
{
  "store": {
    "book": [ 
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      }, {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      }, {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      }, {
         "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}
```

**Example JSONPath Expressions**

JSONPath                      | Description
------------------------------|------------
`$.store.book[*].author`       | The authors of all books in the store
`$..author`                     | All authors
`$.store.*`                    | All things in store, which are some books and a red bicycle
`$.store..price`                | The price of everything in the store
`$..book[2]`                    | The third book
`$..book[(@.length-1)]`         | The last book via script subscript
`$..book[-1:]`                  | The last book via slice
`$..book[0,1]`                  | The first two books via subscript union
`$..book[:2]`                  | The first two books via subscript array slice
`$..book[?(@.isbn)]`            | Filter all books with isbn number
`$..book[?(@.price<10)]`        | Filter all books cheaper than 10
`$..book[?(@.price==8.95)]`        | Filter all books that cost 8.95
`$..book[?(@.price<30 && @.category=="fiction")]`        | Filter all fiction books cheaper than 30
`$..*`                         | All members of JSON structure


## Transport Integrations

### CHAPI

The [credential handler api (CHAPI)](https://w3c-ccg.github.io/credential-handler-api/) allows a web page to request data from a browser, and for a wallet to fulfill that request. This is commonly used for requesting and presenting verifiable credentials.

See also the [vp-request-spec](https://digitalbazaar.github.io/vp-request-spec/).

Here is an example of a request:

::: example Presentation Definition using CHAPI
```json
{
  "query": [
    {
      "type": "PresentationDefinitionQuery",
      "presentationDefinitionQuery": [
        // Presentation Definition goes here.
      ]
    }
  ]
}
```
:::

## Appendix

### Developer Resources

#### JSONPath

- **Node.js**
    - https://www.npmjs.com/package/jsonpath
- **JAVA**
    - https://github.com/json-path/JsonPath
- **Kotlin**
    - https://github.com/codeniko/JsonPathKt
- **Python**
    - https://github.com/kennknowles/python-jsonpath-rw
- **Go**
    - https://github.com/PaesslerAG/jsonpath

#### JSON Schema

- **Node.js**
    - https://www.npmjs.com/package/ajv
    - https://www.npmjs.com/package/json-schema
- **JAVA**
    - https://github.com/ssilverman/snowy-json
    - https://github.com/leadpony/justify
- **.NET**
    - https://github.com/gregsdennis/Manatee.Json
- **Kotlin**
    - https://github.com/worldturner/medeia-validator
- **Python**
    - https://github.com/Julian/jsonschema
    - https://github.com/horejsek/python-fastjsonschema
- **Rust**
    - https://github.com/Stranger6667/jsonschema-rs
- **Go**
    - https://github.com/xeipuuv/gojsonschema
