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

::: example Presentation Definition - all features exercised
```json

{
  "submission_requirements": [
    {
      "name": "Banking Information",
      "purpose": "We need to know if you have an established banking history.",
      "rule": {
        "type": "pick",
        "count": 1,
        "from": ["A"]
      }
    },
    {
      "name": "Employment Information",
      "purpose": "We need to know that you are currently employed.",
      "rule": {
        "type": "all",
        "from": ["B"]
      }
    },
    {
      "name": "Citizenship Information",
      "rule": {
        "type": "pick",
        "count": 1,
        "from": ["C"]
      }
    }
  ],
  "input_descriptors": [
    {
      "id": "banking_input_1",
      "group": ["A"],
      "schema": {
        "uri": "https://bank-standards.com/customer.json",
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
            "path": ["$.account[*].id"],
            "purpose": "We need your bank account number for processing purposes",
            "filter": {
              "type": "string",
              "minLength": 10,
              "maxLength": 12
            }
          },
          {
            "path": ["$.account[*].route"],
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
        "uri": "https://bank-schemas.org/accounts.json",
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
            "path": ["$.credentialSubject.account[*].id", "$.vc.credentialSubject.account[*].id"],
            "purpose": "We need your bank account number for processing purposes",
            "filter": {
              "type": "string",
              "minLength": 10,
              "maxLength": 12
            }
          },
          {
            "path": ["$.credentialSubject.account[*].route", "$.vc.credentialSubject.account[*].route"],
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
        "uri": "https://business-standards.org/schemas/employment-history.json",
        "name": "Employment History",
        "purpose": "We need your bank and account information."
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
        "uri": "https://eu.com/claims/DriversLicense.json",
        "name": "EU Driver's License"
      },
      "constraints": {
        "issuers": ["did:example:gov1", "did:example:gov2"],
        "fields": [
          {
            "path": ["$.dob"],
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
        "uri": "hub://did:foo:123/Collections/schema.us.gov/passport.json",
        "name": "US Passport"
      },
      "constraints": {
        "issuers": ["did:foo:gov3"],
        "fields": [
          {
            "path": ["$.birth_date"],
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
```
:::

The following properties are defined for use at the top-level of the resource - all other properties that are not defined below MUST be ignored:

- `submission_requirements` - The resource ****MAY**** contain this property, and if present, its value ****MUST**** be an array of Submission Requirement Rule objects. If not present, all inputs listed in the `input_descriptor` array are required for submission. The composition of values under this property are described in the [`Submission Requirements`](#submission-requirements) section below.
- `input_descriptors` - The resource ****MUST**** contain this property, and its value ****MUST**** be an array of Input Descriptor objects. If no `submission_requirements` are present, all inputs listed in the `input_descriptor` array are required for submission. The composition of values under this property are described in the [`Input Descriptors`](#input-descriptors) section below.

### Submission Requirements

_Presentation Definitions_ ****MAY**** include _Submission Requirements_, which are objects that define what combinations of inputs must be submitted to comply with the requirements an Issuer/Verifier has for proceeding in a flow (e.g. credential issuance). _Submission Requirements_ introduce a set of rule types and mapping instructions a User Agent can ingest to present requirement optionality to the user, and subsequently submit inputs in a way that maps back to the rules the verifying party has asserted (via a `Proof Submission` object). The following section defines the format for _Submission Requirement_ objects and the selection syntax verifying parties can use to specify which combinations of inputs are acceptable.

::: example Submission Requirement Rules
```json
"submission_requirements": [
  {
    "name": "Banking Information",
    "purpose": "We need to know if you have an established banking history.",
    "rule": {
      "type": "pick",
      "count": 1,
      "from": ["A"]
    }
  },
  {
    "name": "Employment Information",
    "purpose": "We need to know that you are currently employed.",
    "rule": {
      "type": "all",
      "from": ["B"]
    }
  },
  {
    "name": "Citizenship Information",
    "rule": {
      "type": "pick",
      "count": 1,
      "from": ["C"]
    }
  }
]
```
:::

#### Requirement Objects

_Requirement Objects_ describe what combinations of inputs will satisfy Verifier requires for evaluation in a subsequent [Presentation Submission](#presentation-submission). _Requirement Objects_ are JSON objects constructed as follows:

1. The object ****MUST**** contain a `rule` property, and its value ****MUST**** be an object matching one of the [Requirement Rules](#requirement-rules) listed in the section below.
2. The object ****MAY**** contain a `name` property, and if present, its value ****MUST**** be a string of the creator's choosing, which ****MAY**** be used by a consuming User Agent to display the general name of the requirement set to a user.
2. The object ****MAY**** contain a `purpose` property, and if present, its value ****MUST**** be a string that describes the purpose for which the specified requirement is being asserted.

#### Requirement Rules

[_Requirement Rules_](#requirement-rules){id="requirement-rules"} are used within _Requirement Objects_ to describe the specific combinatorial rule that must be applied to submit a particular subset of required inputs. An implementation ****MUST**** support the following standard types:

##### `all` rule

Directs the consumer of the _Presentation Definition_ to submit all members of the matching `group` strings found in the _Requirement Object's_ `from` property. Rule objects of the type `all` type are constructed as follows:

  ```json
  "rule": {
    "type": "all",
    "from": ["A"]
  }
  ```
  - The object ****MUST**** contain a `type` property, and its value ****MUST**** be the string `all`.
  - The object ****MUST**** contain a `from` property, and its value ****MUST**** be an array that contain at least one group string matching one or more of the _Input Descriptor Objects_ in the `input_descriptors` array.


##### `pick` rule

Directs the consumer of the _Presentation Definition_ to submit a specified number of members from each of the matching `group` strings found in the _Requirement Object's_ `from` property. In the example below, the consuming entity would be required to submit one input from the `B` group and one input from the `C` group. Rule objects of the `pick` type are constructed as follows:

  ```json
  "rule": {
    "type": "pick",
    "count": 1,
    "from": ["B", "C"]
  }
  ```
  - The object ****MUST**** contain a `type` property, and its value ****MUST**** be the string `pick`.
  - The object ****MUST**** contain a `count` property, and its value ****MUST**** be an integer.
  - The object ****MUST**** contain a `from` property, and its value ****MUST**** be an array that contain at least one group string matching one or more of the _Input Descriptor Objects_ in the `input_descriptors` array.

### Input Descriptors

_Input Descriptors_ are objects used to describe the proofing inputs a Verifier requires of a Subject before they will proceed with an interaction. _Input Descriptor_ objects contain a schema URI that links to the schema if the required input data, constrains on data values, and an explanation of why a certain set or item of data is being requested:

::: example Input Descriptor - Data
```json
"input_descriptors": [
  {
    "id": "banking_input_1",
    "group": ["A"],
    "schema": {
      "uri": "https://bank-standards.com/customer.json",
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
          "path": ["$.credentialSubject.account[*].id", "$.vc.credentialSubject.account[*].id"],
          "purpose": "We need your bank account number for processing purposes",
          "filter": {
            "type": "string",
            "minLength": 10,
            "maxLength": 12
          }
        },
        {
          "path": ["$.credentialSubject.account[*].route", "$.vc.credentialSubject.account[*].route"],
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

#### Input Descriptor Objects

_Input Descriptors_ are objects that describe what type of input data/credential, or sub-fields thereof, is required for submission to the Verifier. _Input Descriptor_ objects are composed as follows:

  - The object ****MUST**** contain an `id` property, and if present, its value ****MUST**** be a unique identifying string that does not conflict with the `id` of another _Input Descriptor_ in the same _Presentation Definition_ object.
  - The object ****MAY**** contain a `group` property, and if present, its value ****MUST**** match one of the grouping strings listed the `from` values of a [_Requirement Rule Object_](#requirement-rule-objects).
  - The object ****MUST**** contain a `schema` property, and its value ****MUST**** be an object composed as follows:
      - The object ****MUST**** contain a `uri` property, and its value ****MUST**** be the valid URI string of the schema for the target data/credential type.
      - The object ****MAY**** contain a `name` property, and if present its value ****SHOULD**** be a human-friendly name that describes what the target schema represents.
      - The object ****MAY**** contain a `purpose` property, and if present its value ****MUST**** be a string that describes the purpose for which the schema's data is being requested.
  - The object ****MAY**** contain a `constraints` property, and its value ****MUST**** be an object composed as follows: 
      - The object ****MAY**** contain a `fields` property, and its value ****MUST**** be an array of [_Input Descriptor Field Entry_](#input-descriptor-field-entry) objects, each being composed as follows:
          - The object ****MUST**** contain a `path` property, and its value ****MUST**** be an array of one or more [JSONPath](https://goessner.net/articles/JsonPath/) string expressions, specifically this variant of JSONPath: https://www.npmjs.com/package/jsonpath, that select some subset of values from the target input. The array ****MUST**** be evaluated from 0-index forward, and the first expressions to return a value will be used for the rest of the entry's evaluation. The ability to declare multiple expressions this way allows the Verifier to account for format differences - for example: normalizing the differences in structure between JSON-LD/JWT-based [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) and vanilla [JSON Web Tokens](https://tools.ietf.org/html/rfc7797) (JWTs).
          - The object ****MAY**** contain a `purpose` property, and if present its value ****MUST**** be a string that describes the purpose for which the field is being requested.
          - The object ****MAY**** contain a `filter` property, and if present its value ****MUST**** be [JSON Schema](https://json-schema.org/specification.html) descriptor used to filter against the values returned from evaluation of the [JSONPath](https://goessner.net/articles/JsonPath/) string expressions in the `path` array.

### Input Evaluation

A consumer of a _Presentation Definition_ must filter inputs they hold (signed credentials, raw data, etc.) to determine whether they possess the inputs required to fulfill the demands of the Verifying party. A consumer of a _Presentation Definition_ ****SHOULD**** use the following process to validate whether or not its candidate inputs meet the requirements it describes:

1. For each _Input Descriptor_ in the `input_descriptors` array of a _Presentation Definition_, a User Agent ****should**** compare each candidate input it holds to determine whether there is a match. Evaluate each candidate input as follows:
    1. The schema of the candidate input ****must**** match the _Input Descriptor_ `schema` object `uri` value exactly. If they are exactly equal, proceed, if they are not exactly equal, skip to the next candidate input.
    2. If the `constraints` property of the _Input Descriptor_ is present, and it contains a `fields` property with one or more [_Input Descriptor Field Entries_](#input-descriptor-field-entry), evaluate each against the candidate input as follows:
        1. Iterate the _Input Descriptor_ `path` array of [JSONPath](https://goessner.net/articles/JsonPath/) string expressions from 0-index, executing each expression against the candidate input. Cease iteration at the first expression that returns a matching _Field Query Result_ and use the result for the rest of the field's evaluation. If no result is returned for any of the expressions, skip to the next candidate input.
        2. If the `filter` property of the field entry is present, validate the _Field Query Result_ from the step above against the [JSON Schema](https://json-schema.org/specification.html) descriptor value. If the result is valid, proceed iterating the rest of the `fields` entries.
    3. If all of the previous validation steps are successful, mark the candidate input as a match for use in a _Presentation Submission_, and if present at the top level of the _Input Descriptor_, keep a relative reference to the `group` values the input is designated for.

## Presentation Submission

> NOTE: ensure all the entries in the `verifiableCredential` array are valid VCs

::: example Presentation Submission - all features exercised
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
  "presentation_submission": [
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
  ],
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
    }
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


## Transport Integrations

### CHAPI

The [credential handler api (CHAPI)](https://w3c-ccg.github.io/credential-handler-api/) allows a web page to request data from a browser, and for a wallet to fulfill that request.

This is commonly used for requesting and presenting verifiable credentials.

See also the [vp-request-spec](https://digitalbazaar.github.io/vp-request-spec/).

Here is an example of a request:

::: Example Presentation Definition using CHAPI
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

Here is an example of a response:

::: Example Presentation Submission using CHAPI
```json
{
  "type": "web",
  "dataType": "VerifiablePresentation",
  "data": {
    // Presentation Submission goes here
  }
}
```
:::


## Appendix

### Goals & Requirements

The `Presentation Definition` data format should satisfy the following requirements:

1. A `Presentation Definition` allows for a static definition. That means it is not necessarely required to be dynamically created by a party upon request.
2. A `Presentation Definition` should *generally* not have a limited TTL or be restricted to a single interaction. It should a long-lived format that, for example, search indexers could pickup in order to understand service requirements.
3. A `Presentation Definition` allows to specifiy a combination of selection criteria that meet the requirements. A `Presentation Definition` can meet any combination of the requirements given.
4. A `Presentation Definition` can request verifiable (signed) information as well as unsigned information (TBD).
5. A `Presentation Definition` allows for the inclusive definition of an input selection, but not an exclusive on. (e.g. A and/or B. but not A but not B).

The `Presentation Submission` data format should satisfy the following requirements:

1. A `Presentation Submission` is the submission of a W3C Verifiable Presentation of extended capabilities to reference an earlier `Presentation Definition`.
2. A `Presentation Submission` supports the direct reference to an `input descriptor` of a `Presentation Definition`. ("I represent value XY, e.g. a verifiable Bank Account")
3. A `Presentation Submission` supports the direct reference to an `input selector` of a `Presentation Definition` ("I satisfy condition A and B")