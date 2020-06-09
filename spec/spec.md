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

A common activity between peers in identity systems that feature the ability to generate self-asserted and third-party issued claims is the demand and submission of proofs from a Prover (Holder) to a Verifier. This flow implicitly requires the Holder and Verifier have a known mechanism to facilitate the two primary steps in a proving exchange: the way Verifiers define the proof requirements, and how Provers must encode submissions of proof to align with those requirements.

To address these needs, this Presentation Exchange specification codifies the `Presentation Definition` data format Verifiers can use to articulate proof requirements, as well as the `Presentation Submission` data format Provers can use to submit proofs in accordance with them.

This specification does not endeavor to define transport protocols, specific endpoints, or other means for conveying the formatted objects it codifies, but it is encouraged that others specifications and projects that do define such mechanisms utilize these data formats within their flows.

## Status of This Document

Presentation Exchange is a draft specification being developed within the Decentralized Identity Foundation (DIF), and being designed to incorporate the requirements and learnings from related work of the most active industry players into a shared specification that meets the collective needs of the community. This spec will be updated to reflect relevant changes, and participants are encouraged to actively engage on GitHub (see above) and other mediums (e.g. DIF) where this work is being done.

## Terminology

Term | Definition
:--- | :---------
Decentralized Identifier (DID) | Unique ID string and PKI metadata document format for describing the cryptographic keys and other fundamental PKI values linked to a unique, user-controlled, self-sovereign identifier in a target system (i.e. blockchain, distributed ledger).
Prover | The entity that submits proofs to a Verifier to satisfy the requirements described in a Presentation Definition
Verifier | The entity that defines what proofs they require from a Prover (via a Presentation Definition) in order to proceed with an interaction.

## Presentation Definition

Presentation Definitions articulate what proofs Verifier requires. Often, but not always, they help the Verifier decide how or whether to interact with a Prover. Presentation Definitions are composed of inputs, which describe the forms and details of the proofs they require, and and optional set of selection rules, to allow Subjects flexibility in cases where many different types of proofs may satisfy an input requirement.

::: example Presentation Definition - all features exercised
```jsonc

{
    // TODO: The presentation definition MUST include a nonce. If it doesn't,
    // anybody can replay the bytes they eventually receive, pretending to
    // be the Prover. This is an absolute security requirement.

    // TODO: how do we express boolean options? I can see how we do the trivial
    // ones (pick any N out of M). But that's not what I'm asking about. When 
    // I applied for citizenship for my daughter, I had to present any
    // 2 proofs from category A, and any 1 proof from category B, OR I had
    // to present 3 or more proofs from category B. I don't see a way to model
    // that real-world use case. It think that's because we imagine the rules to only exist *within* a single requirement, never across requirements. And we don't imagine arbitrary combinations of booleans.
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
        // TODO: how do we say that the prover must have a certain relationship to
        // the credential subject (e.g., BE the one and only subject, but
        // also things like "be the secondary account holder" or be the
        // father on the birth certificate?
        "fields": [
          {
            "path": ["$.issuer", "$.vc.issuer", "$.iss"],
            // TODO: we need a way to do more than specify an allow list.
            // We must also support "accredited by issuer X" and also
            // "certified by a particular governance framework" (follow the
            // 'issue-edu' example in the Sample Data Structure section of
            // Aries RFC 0430. https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0430-machine-readable-governance-frameworks/README.md#sample-data-structure
            "purpose": "The credential must be from one of the specified issuers",
            "filter": {
              "type": "string",
              "pattern": "did:example:123|did:example:456"
            }
          },
          {
            // TODO: we can't just list paths in VC JSON this way; we have
            // to link them to schemas ("if schema A, then path A.x;
            // if schema B, then path B.y"). Otherwise we create
            // possible paths that can be exploited to surprising effect.
            "path": ["$.credentialSubject.account[*].account_number", "$.vc.credentialSubject.account[*].account_number"],
            "purpose": "We need your bank account number for processing purposes",
            // TODO: how do we express filters on a per-schema basis, such
            // that length must be between 10 and 12 for schema A, and
            // between 12 and 14, with hyphens, for schema B?
            "filter": {
              "type": "string",
              "minLength": 10,
              "maxLength": 12
            }
          },
          {
            "path": ["$.credentialSubject.account[*].routing_number", "$.vc.credentialSubject.account[*].routing_number"],
            "purpose": "You must have an account with a German, US, or Japanese bank account",
            "filter": {
              "type": "string",
              "pattern": "^DE|^US|^JP"
            }
          }
          // TODO: how do you express zero-knowledge predicate requirements?
        ]
      }
    },
    // TODO: how do you require that banking input 1 and banking
    // input 2 both have the same credential subject (e.g., same
    // primary account holder)?
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
            "path": ["$.dob"],
            "filter": {
              "type": "date",
              // TODO: I changed this to "maximum" because I assume you
              // want to express a minimum age. If not, switch back to minimum.
              "maximum": "1999-5-16"
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
              "maximum": "1999-5-16"
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

_Presentation Definitions_ ****MAY**** include _Submission Requirements_, which are objects that define what combinations of inputs must be submitted to comply with the requirements a Verifier has for proceeding in a flow (e.g. credential issuance, allowing entry, accepting an application). _Submission Requirements_ introduce a set of rule types and mapping instructions a User Agent can ingest to present requirement optionality to the user, and subsequently submit inputs in a way that maps back to the rules the verifying party has asserted (via a `Proof Submission` object). The following section defines the format for _Submission Requirement_ objects and the selection syntax verifying parties can use to specify which combinations of inputs are acceptable.

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
2. The object ****MAY**** contain a `name` property, and if present, its value ****MUST**** be a string of the creator's choosing, which ****MAY**** be used by a consuming User Agent to display the general name of the requirement set to a user. TODO: needs localization support, or else the usefulness is severely curtailed.
2. The object ****MAY**** contain a `purpose` property, and if present, its value ****MUST**** be a string that describes the purpose for which the specified requirement is being asserted. TODO: needs localization support, or else the usefulness is severely curtailed.

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

TODO: eliminate "proofing". Identity proofing means something quite different from what we're talking about here. We should be using the word "proving".

_Input Descriptors_ are objects used to describe the proving inputs a Verifier requires of a Prover before they will proceed with an interaction. _Input Descriptor_ objects contain a schema URI that links to the schema if the required input data, constrains on data values, and an explanation of why a certain set or item of data is being requested:

::: example Input Descriptor - Data
```jsonc
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
    // TODO: As imagined here, "constraints" tells which credentials have fields
    // with acceptable values, but NOT which fields from thos credentials will actually
    // be disclosed. Thus, there is no support here for selective disclosure.
    // We must have such support before this spec is usable. Perhaps a sibling
    // to "constraints" named disclosed, that simply lists all the fields to disclose?
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

  - The object ****MUST**** contain an `id` property, and if present, its value ****MUST**** be a unique identifying string that does not conflict with the `id` of another _Input Descriptor_ in the same _Presentation Definition_ object. TODO: explain why this matters, if it really does.
  - The object ****MAY**** contain a `group` property, and if present, its value ****MUST**** match one of the grouping strings listed the `from` values of a [_Requirement Rule Object_](#requirement-rule-objects).
  - The object ****MUST**** contain a `schema` property, and its value ****MUST**** be an object composed as follows:
      - The object ****MUST**** contain a `uri` property, and its value ****MUST**** be an array consisting of one or more valid URI strings for the acceptable credential schemas. A common use of multiple entries in the `uri` array is when multiple versions of a credential schema exist and you wish to express support for submission of more than one version.
      - The object ****MAY**** contain a `name` property, and if present its value ****SHOULD**** be a human-friendly name that describes what the target schema represents.
      - The object ****MAY**** contain a `purpose` property, and if present its value ****MUST**** be a string that describes the purpose for which the schema's data is being requested.
  - The object ****MAY**** contain a `constraints` property, and its value ****MUST**** be an object composed as follows: 
      - The object ****MAY**** contain a `fields` property, and its value ****MUST**** be an array of [_Input Descriptor Field Entry_](#input-descriptor-field-entry) objects, each being composed as follows:
          - The object ****MUST**** contain a `path` property, and its value ****MUST**** be an array of one or more [JSONPath](https://goessner.net/articles/JsonPath/) string expressions, specifically this variant of JSONPath: https://www.npmjs.com/package/jsonpath, (TODO: confirm that that variant is supported in something besides node.js) that select some subset of values from the target input. The array ****MUST**** be evaluated from 0-index forward, and the first expressions to return a value will be used for the rest of the entry's evaluation. The ability to declare multiple expressions this way allows the Verifier to account for format differences - for example: normalizing the differences in structure between JSON-LD/JWT-based [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) and vanilla [JSON Web Tokens](https://tools.ietf.org/html/rfc7797) (JWTs).
          - The object ****MAY**** contain a `purpose` property, and if present its value ****MUST**** be a string that describes the purpose for which the field is being requested.
          - The object ****MAY**** contain a `filter` property, and if present its value ****MUST**** be [JSON Schema](https://json-schema.org/specification.html) descriptor used to filter against the values returned from evaluation of the [JSONPath](https://goessner.net/articles/JsonPath/) string expressions in the `path` array.
          
TODO: Presumably a request for input that has no constraints is allowed to be self-attested -- but sometimes this isn't good enough. How do I say, "As a university verifying your study habits, I explicitly DON'T want an attestation from your high school guidance counselor; I want you to tell me what you think about yourself?"

TODO: How do I express that all the credentials must be held by a single prover, as opposed to Alice presenting a composite proof where Bob provided one of the credentials, and she provided the other?

TODO: How do I require that the prover demonstrate a binding to the credential using a biometric?
          
TODO: A demand for proof should be able to include terms of service that the verifier commits to upon receipt of the data. We don't need to define that in great detail. I know that TOS was a rat hole in VC spec work. But we need to allow for it, or else the spec is unusable in many situations.
          
TODO: a demand for data should often be nonrepudiable and therefore must be signable by the Verifier. How do we do that?

### Input Evaluation

A consumer of a _Presentation Definition_ must filter inputs they hold (signed credentials, raw data, etc.) to determine whether they possess the inputs required to fulfill the demands of the Verifying party. A consumer of a _Presentation Definition_ ****SHOULD**** use the following process to validate whether or not its candidate inputs meet the requirements it describes:

1. For each _Input Descriptor_ in the `input_descriptors` array of a _Presentation Definition_, a User Agent ****should**** compare each candidate input it holds to determine whether there is a match. Evaluate each candidate input as follows:
    1. The schema of the candidate input ****must**** match one of the _Input Descriptor_ `schema` object `uri` values exactly. If the scheme is a hashlink or a similar value that points to immutable content, this means the content of the schema, not just the URI from which it is downloaded, must also match. If one of the values is an exact match, proceed, if there are no exact matches, skip to the next candidate input.
    2. If the `constraints` property of the _Input Descriptor_ is present, and it contains a `fields` property with one or more [_Input Descriptor Field Entries_](#input-descriptor-field-entry), evaluate each against the candidate input as follows:
        1. Iterate the _Input Descriptor_ `path` array of [JSONPath](https://goessner.net/articles/JsonPath/) string expressions from 0-index, executing each expression against the candidate input. Cease iteration at the first expression that returns a matching _Field Query Result_ and use the result for the rest of the field's evaluation. (TODO: unwind this advice to cease. A prover might have reasons to compute all the possible variations and pick the "best" one on the basis of which one is cheaper to present (has less fees associated), which one is more private, which credential they previously used with this verifier, etc. Stopping after the first match is not the business of the data format and is none of the verifier's business. Their requirements just way what is acceptable, not how it's computed.) If no result is returned for any of the expressions, skip to the next candidate input. (TODO: how do I match a field where the field must have a particular value for "@type" IN ADDITION to having a particular path? This is how I would require that a multi-subject cred have particular data for subject A, and different data for subject B, as with a birth certificate...) 
        2. If the `filter` property of the field entry is present, validate the _Field Query Result_ from the step above against the [JSON Schema](https://json-schema.org/specification.html) descriptor value. If the result is valid, proceed iterating the rest of the `fields` entries.
    3. If all of the previous validation steps are successful, mark the candidate input as a match for use in a _Presentation Submission_, and if present at the top level of the _Input Descriptor_, keep a relative reference to the `group` values the input is designated for.

## Presentation Submission

> NOTE: ensure all the entries in the `verifiableCredential` array are valid VCs

::: example Presentation Submission - all features exercised
```jsonc
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
    // TODO: MUST include nonce from Verifier, signed by Prover.
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

### Embedded Presentation Submission Object

_Presentation Submissions_ are objects embedded within target credential negotiation formats that unify the presentation of proofs to a Verifier in accordance with the requirements a Verifier specified in a _Presentation Definition_. Embedded _Presentation Submission_ objects ****MUST**** be located within target data format as a `presentation_submission` property, which are composed as follows:

  - The object ****MUST**** include a `descriptor_map` property, and its value ****MUST**** be an array of _Input Descriptor Mapping Objects_, each being composed as follows:
      - The object ****MUST**** include an `id` property, and its value ****MUST**** be a string matching the `id` property of the _Input Descriptor_ in the _Presentation Definition_ the submission is related to.
      - The object ****MUST**** include a `path` property, and its value ****MUST**** be a [JSONPath](https://goessner.net/articles/JsonPath/) string expression that selects the credential to be submit in relation to the identified _Input Descriptor_ identified, when executed against the top-level of the object the _Presentation Submission_ is embedded within.


### Embed Targets

The following section details where the _Presentation Submission_ is to be embedded within a target data structure, as well as how to formulate the [JSONPath](https://goessner.net/articles/JsonPath/) expressions to select the credentials within the target data structure.

#### OIDC

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

#### DIDComm

DIDComm is lower level than the problem domain of this spec. It allows transmission of arbitrary content, so it is capable of carrying the data formats described here, in the same way you could transmit the format over TCP.

What's required in a DIDComm-based approach to communication is a higher-level protocol that explains the steps in the "dance" of proving something. This is the subject of Aries RFC 0037. That protocol, or future DIDComm based protocols like it, could be used to send a proof request (what is here called a "presentation definition") and receive a verifiable presentation (which could be wrapped in the presentation submission described here). The protocol is deliberately defined to be data format agnostic, so it is directly usable with this data format without modifying either doc.

TODO: I recommend that you draw a distinction between the definition of a presentation (here called a "presentation definition", very appropriately) and the request for such a presentation. It seems quite likely to me that presentation definitions will be standardized and published. For example, there might be a standard presentation definition that captures the requirements of people applying for citizenship in a given country. Once defined, the actual interactions where proofs are demanded need not define them again; they might just refer to them. Thus, it is possible to REQUEST a presentation without DEFINING it, by simply refering to a previously published DEFINITION. This is why the Aries protocol describes the challenge for proof as a "request", not a "definition" -- a request could include an inlined definition, or simply refer to one that's external to the request.

...

#### CHAPI

...


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

Here is an example of a response:

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