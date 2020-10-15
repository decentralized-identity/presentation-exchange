Presentation Exchange
==================

**Specification Status:** Working Group Draft

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

A common activity between peers in identity systems that feature the ability to
generate self-asserted and third-party issued claims is the demand and
submission of proofs from a Holder to a Verifier. This flow implicitly requires
the Holder and Verifier have a known mechanism to facilitate the two primary
steps in a proving exchange: the way Verifiers define the proof requirements,
and how Holders must encode submissions of proof to align with those
requirements.

To address these needs, this Presentation Exchange specification codifies the
`Presentation Definition` data format Verifiers can use to articulate proof
requirements, as well as the `Presentation Submission` data format Holders can
use to submit proofs in accordance with them. The specification is designed to 
be both credential format and transport envelope agnostic, meaning an implementer 
can use [JSON Web Tokens (JWTs)](https://tools.ietf.org/html/rfc7519), 
[Verifiable Credentials (VCs)](https://www.w3.org/TR/vc-data-model/), 
[JWT-VCs](https://www.w3.org/TR/vc-data-model/#json-web-token-extensions), 
or any other credential format, and convey them 
via [Open ID Connect](https://openid.net/connect/), [DIDComm](https://identity.foundation/didcomm-messaging/spec/), 
[Credential Handler API](https://w3c-ccg.github.io/credential-handler-api/), 
or any other transport envelope. The goal of 
this flexible format and transport agnostic mechanism is to nullify the 
redundant handling, code, and hassle involved in presenting and satisfying 
logical requirements across formats and transport envelopes.

This specification does not endeavor to define transport protocols, specific
endpoints, or other means for conveying the formatted objects it codifies, but
encourages other specifications and projects that do define such mechanisms to
utilize these data formats within their flows.

## Status of This Document

Presentation Exchange is a draft specification under development within the
Decentralized Identity Foundation (DIF), and designed to incorporate the
requirements and learnings from related work of the most active industry players
into a shared specification that meets the collective needs of the community.
This spec is regularly updated to reflect relevant changes, and we encourage
active engagement on GitHub (see above) and other mediums (e.g. DIF) where this
work is being done.

## Terminology

[[def:Decentralized Identifiers, Decentralized Identifier, DID]]
~ Unique ID URI string and PKI metadata document format for describing the cryptographic keys and other fundamental PKI values linked to a unique, user-controlled, self-sovereign identifier in a target system (i.e. blockchain, distributed ledger).

[[def:Holder, Holders]]
~ The entity that submits proofs to a [[ref:Verifier]] to satisfy the requirements described in a Presentation Definition

[[def:Verifier, Verifiers]]
~ The entity that defines what proofs they require from a [[ref:Holder]] (via a Presentation Definition) in order to proceed with an interaction.

[[def:Presentation Definition]]
~ Presentation Definitions are objects that articulate what proofs a Verifier requires. These help the Verifier to decide how or whether to interact with a Holder. Presentation Definitions are composed of inputs, which describe the forms and details of the proofs they require, and optional sets of selection rules, to allow Holders flexibility in cases where many different types of proofs may satisfy an input requirement.

[[def:Presentation Submission]]
~ Presentation Submissions are objects embedded within target credential negotiation formats that unify the presentation of proofs to a [[ref:Verifier]] in accordance with the requirements a [[ref:Verifier]] specified in a [[ref:Presentation Definition]].

[[def:Input Descriptor, Input Descriptors]]
~ Input Descriptors are objects used to describe the information a Verifier requires of a Holder before they will proceed with an interaction. 

## Localization

To support localization, [IETF BCP 47](https://tools.ietf.org/html/bcp47) one
****MAY**** use language tags under the `locale` property in both a `Presentation
Definition` and `Presentation Submission`. If a Definition has a language tag,
so should the corresponding Submission. A Submission may have a language tag
regardless of the presence of one in the corresponding Definition.

Wrapping transports such as HTTP may choose to utlilize the `locale` property in
conjunction with the
[Accept-Language](https://tools.ietf.org/html/rfc7231#section-5.3.5) header.

<tab-panels selected-index="0">

<nav>
  <button type="button">Presentation Definition with Locale</button>
  <button type="button">Presentation Submission with Locale</button>
</nav>

<section>

::: example Presentation Definition with Locale
```json
{
  "presentation_definition": {
    "locale": "en-US",
    "input_descriptors": [{
      "id": "name_input",
      "schema": {
        "uri": ["https://name-standards.com/name.json"],
        "name": "Full Legal Name",
        "purpose": "We need your full legal name."
      }
    }]
  }
}
```

</section>

<section>

::: example Presentation Submission with Locale
```json
{
  "presentation_submission": {
    "locale": "de-DE",
    "descriptor_map": [{
      "id": "name_input",
      "path": "$.verifiableCredential[0]"
    }]
  }
}
```

</section>

</tab-panels>

## Presentation Definition

Presentation Definitions are objects that articulate what proofs a [[ref:Verifier]]
requires. These help the [[ref:Verifier]] to decide how or whether to interact with a
Holder. Presentation Definitions are composed of inputs, which describe the
forms and details of the proofs they require, and optional sets of selection
rules, to allow Holders flexibility in cases where many different types of
proofs may satisfy an input requirement.

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
  // VP, OIDC, DIDComm, or CHAPI outer wrapper

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
                "type": "string",
                "format": "date",
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
  // VP, OIDC, DIDComm, or CHAPI outer wrapper

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
                "type": "string",
                "format": "date",
                "maximum": "1999-6-15"
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
                "type": "string",
                "format": "date",
                "maximum": "1999-5-16"
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
  // VP, OIDC, DIDComm, or CHAPI outer wrapper
  
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
                "type": "string",
                "format": "date",
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
                "type": "string",
                "format": "date",
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
:::

</section>

</tab-panels>

The following properties are for use at the top-level of the resource — all
other properties that are not defined below MUST be ignored:

- `name` - The resource ****MAY**** contain this property, and if present its
  value ****SHOULD**** be a human-friendly name that describes what the
  Presentation Definition pertains to.
- `purpose` - The resource ****MAY**** contain this property, and if present its
  value ****MUST**** be a string that describes the purpose for which the
  Presentation Definition's inputs are being requested.
- The resource ****MAY**** include a `format` property, and its value 
  ****MUST**** be an object with one or more properties matching the registered 
  [Credential Format Designations](#credential-format-designations) (`jwt`, 
  `jwt_vc`, `jwt_vp`, etc.) to inform the Holder of the credential format 
  configurations the [[ref:Verifier]] can process. The value for each property included 
  ****MUST**** be an object composed as follows:
    - The object ****MAY**** include a format-specific property (i.e. `alg`, 
      `proof_type`) that expresses which algorithms the [[ref:Verifier]] supports for the 
      format, and if present, its value ****MUST**** be an array of one or more 
      of the format-specific algorithmic identifier references, as noted in the 
      [Credential Format Designations](#credential-format-designations) section.

      ```json
      {
        "presentation_definition": {
          "format": {
            "jwt": {
              "alg": ["EdDSA", "ES256K", "ES384"]
            },
            "jwt_vc": {
              "alg": ["ES256K", "ES384"]
            },
            "jwt_vp": {
              "alg": ["EdDSA", "ES256K"]
            },
            "ldp_vc": {
              "proof_type": [
                "JsonWebSignature2020",
                "Ed25519Signature2018",
                "EcdsaSecp256k1Signature2019",
                "RsaSignature2018"
              ]
            },
            "ldp_vp": {
              "proof_type": ["Ed25519Signature2018"]
            },
            "ldp": {
              "proof_type": ["RsaSignature2018"]
            }
          }
        }
      }
      ```
- `submission_requirement` - The resource ****MAY**** contain this property,
  and if present, its value ****MUST**** conform to the Submission Requirement
  Format. If not present, all inputs listed in the `input_descriptors` array are
  required for submission. The description for the format of this property is in
  the [`Submission Requirement`](#submission-requirement) section below.
- `input_descriptors` - The resource ****MUST**** contain this property, and
  its value ****MUST**** be an array of [[ref:[[ref:Input Descriptor]]]] objects. If no
  `submission_requirement` is present, all inputs listed in the
  `input_descriptors` array are required for submission. The composition of
  values under this property are described in the [`Input
  Descriptors`](#input-descriptors) section below.

### Submission Requirements

_Presentation Definitions_ ****MAY**** include _Submission Requirements_,
which are objects that define what combinations of inputs must be submitted
to comply with the requirements a [[ref:Verifier]] has for proceeding in a flow (e.g.
credential issuance, allowing entry, accepting an application).
_Submission Requirements_ introduce a set of rule types and mapping instructions
a User Agent can ingest to present requirement optionality to the user, and
subsequently submit inputs in a way that maps back to the rules the verifying
party has asserted (via a `Proof Submission` object). The following section
defines the format for _Submission Requirement_ objects, and the selection syntax
verifying parties can use to specify which combinations of inputs are acceptable.

If present, all members of the `submission_requirements` array ****MUST****
be satisfied, and all input_descriptors ****MUST**** be grouped. Any unused
input_descriptors that remain after satisfying all submission_requirements
****MUST**** be ignored.

::: example Submission Requirement
```json 12
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

_Submission Requirement Objects_ describe combinations of inputs that
****must**** be submitted via a [Presentation Submission](#presentation-submission)
to satisfy [[ref:Verifier]] demands. _Submission Requirement Objects_ are JSON objects
constructed as follows:

1. The object  ****MUST**** contain a `rule` property, and its value
   ****MUST**** be a string matching one of the [Submission Requirement
   Rules](#submission-requirement-rules) values listed in the section below.
2. The object ****MUST**** contain either a `from` 'or `from_nested` property. 
  If both properties are present, the implementation ***MUST*** produce an 
  error. The values of the `from` and `from_nested` properties are defined as
  follows:
    - `from` - the value of the `from` property ****must**** be a `group` string 
    matching one of the `group` strings specified for one or more _Input
    Descriptor_ objects.
    - `from_nested` - an array of nested _Submission Requirement Objects_.
3. The object  ****MAY**** contain a `name` property, and if present, its value
   ****MUST**** be a string which ****MAY**** be used by a consuming User Agent
   to display the general name of the requirement set to a user.
4. The object ****MAY**** contain a `purpose` property and, if present, its
   value ****MUST**** be a string that describes the purpose for which the
   specified requirement is being asserted.
5. The object ****MAY**** contain additional properties as required by
   [Submission Requirement Rules](#submission-requirement-rules), such as
   `count`, `min`, and `max` for the `"pick"` rule.

#### Submission Requirement Rules

[_Submission Requirement Rules_](#submission-requirement-rules)
{id="requirement-rules"} are used within _Submission Requirement Objects_ to
describe the specific combinatorial rule that must be applied to submit a
particular subset of required inputs. Rules are selected by populating the
`rule` property with the corresponding string. An implementation ****MUST****
support the following standard types:

##### `all` rule

- The object ****must**** contain a `rule` property, and its value ****MUST****
be the string `"all"`.
- The object ****MUST**** contain either a `from` or `from_nested` property, 
  which behave as follows when used in an `all` rule:
    - `from` - when used within an `all` rule, every [[ref:Input Descriptor]] matching
      the group string of the `from` value must be submitted to the [[ref:Verifier]].
    - `from_nested` - when used within an `all` rule, all the _Submission
    Requirement Objects_ specified in the `from_nested` array must be satisfied
    by the inputs submitted in a subsequent
    [Presentation Submission](#presentation-submission).

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
  and if present, its value ****MUST**** be an integer greater than zero, and,
  if also present, greater than the value of the `min` property.
- The _Submission Requirement_ object ****MUST**** contain either a `from`
  property or a `from_nested` property, and of whichever are present, all inputs
  from the `from` group string specified or _Submission Requirements_ in the
  `from_nested` array ****MUST**** be submitted or satisfied.

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
          "properties": {
            "name": { "type": "string" },
            "purpose": { "type": "string" },
            "rule": { "type": "string" },
            "count": { "type": "integer", "minimum": 1 },
            "from": { "type": "string" }
          },
          "required": ["rule", "from"],
          "additionalProperties": false
        },
        {
          "properties": {
            "name": { "type": "string" },
            "purpose": { "type": "string" },
            "rule": { "type": "string" },
            "count": { "type": "integer", "minimum": 1 },
            "from_nested": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/submission_requirements"
              }
            }
          },
          "required": ["rule", "from_nested"],
          "additionalProperties": false
        }
      ]
    }
  },
  "type": "object",
  "properties": {
    "submission_requirements": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/submission_requirements"
      }
    }
  },
  "required": ["submission_requirements"],
  "additionalProperties": false
}
```

#### Property Values and Evaluation
The following property value and evaluation guidelines summarize many of the
processing-related rules above:
1. The `rule` property value may be either `"all"` or `"pick"`, and the
  implementation ****MUST**** produce an error if an unknown `rule` value is
  present.
2. The _Submission Requirement_  ****MUST**** contain a `from` property or a
  `from_nested` property, not both, and if present their values must be a string
  or an array, respectively. If any of these conditions are not met, the
  implementation ****MUST**** produce an error.
3. To determine whether a _Submission Requirement_ is satisfied, used the
  following algorithm:
    - If the `rule` is `"all"`, then the _Submission Requirement_ MUST contain a
      `from` property or a `from_nested` property, and of whichever are present,
      all inputs from the `from` group string specified or _Submission
      Requirements_ in the `from_nested` array ****MUST**** be submitted or
      satisfied, respectively.
    - If the `rule` is `"pick"`, then the _Submission Requirement_ MUST contain
      a `from` property or a `from_nested` property, and of whichever are
      present, they must be evaluated as follows:
        - if a `count` property is present, the number of inputs submitted, or
          nested _Submission Requirements_ satisfied, ****MUST**** be exactly
          equal to the value of `count` property.
        - if a `min` property is present, the number of inputs submitted, or
          nested _Submission Requirements_ satisfied, ****MUST**** be equal to
          or greater than the value of the `min` property.
        - if a `max` property is present, the number of inputs submitted, or
          nested _Submission Requirements_ satisfied, ****MUST**** be equal to
          or less than the value of the `max` property.

### Input Descriptors

[[ref:Input Descriptors]] are objects used to describe the information a [[ref:Verifier]]
requires of a Holder before they will proceed with an interaction. If no 
`submission_requirement` objects are present, all `input_descriptor` objects 
****MUST**** be satisfied.

_Input Descriptor Objects_ contain a schema URI that links to the schema 
of the required input data, constraints on data values, and an explanation 
why a certain item or set of data is being requested:

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

</tab-panels>

#### Input Descriptor Objects

[[ref:Input Descriptors]] are objects that describe what type of input data/credential, 
or sub-fields thereof, is required for submission to the [[ref:Verifier]]. _Input
Descriptor Objects_ are composed as follows:

  - The object ****MUST**** contain an `id` property. The value of the `id`
    property ****MUST**** be a unique identifying string that does not conflict
    with the `id` of another [[ref:Input Descriptor]] in the same _Presentation
    Definition_ object.
  - The object ****MAY**** contain a `group` property, and if present, its value
    ****MUST**** match one of the grouping strings listed the `from` values of a
    [_Requirement Rule Object_](#requirement-rule-objects).
  - The object ****MUST**** contain a `schema` property, and its value
    ****MUST**** be an object composed as follows:
      - The object ****MUST**** contain a `uri` property, and its value
        ****MUST**** be an array consisting of one or more valid URI strings for
        the acceptable credential schemas. A common use of multiple entries in
        the `uri` array is when multiple versions of a credential schema exist
        and there is a desire to express support for more than one version. 
        This field allowing multiple URIs is not intended to be used as 
        a mechanism for including references to fundamentally different schemas, 
        and ****SHOULD NOT**** be used by the implementer this way.
      - The object ****MAY**** contain a `name` property, and if present its
        value ****SHOULD**** be a human-friendly name that describes what the
        target schema represents.
      - The object ****MAY**** contain a `purpose` property, and if present its
        value ****MUST**** be a string that describes the purpose for which the
        credential's data is being requested.
      - The object ****MAY**** contain a `metadata` property, and if present its
        value ****MUST**** be an object with metadata properties that describe
        any information specific to the acquisition, formulation, or details of
        the credential in question.
  - The object ****MAY**** contain a `constraints` property, and its value
    ****MUST**** be an object composed as follows: 
      - The object ****MAY**** contain a `limit_disclosure` property, and if
        present its value ****MUST**** be a boolean value. Setting the property
        to `true` indicates that the processing entity ****SHOULD NOT**** submit
        any fields beyond those listed in the `fields` array (if present).
        Setting the property to `false`, or omitting the property, indicates
        the processing entity ****MAY**** submit a response that contains more
        than the data described in the `fields` array.
      - The object ****MAY**** contain a `subject_is_issuer` property, and if
        present its value ****MUST**** be one of the following strings:
        - `required` - This indicates that the processing entity ****MUST****
          submit a response that has been _self-attested_, i.e., the credential
          used in the presentation has been 'issued' by the subject of the
          credential.
        - `preferred` - This indicates that it is ****RECOMMENDED**** that the
          processing entity submit a response that has been _self-attested_,
          i.e., the credential used in the presentation has been 'issued' by the
          subject of the credential.
      
        The `subject_is_issuer` property could be used by a [[ref:Verifier]] to require
        that certain inputs be _self_attested_. For example, a college
        application `presentation definition` might contain an [[ref:Input Descriptor]]
        object for an essay submission. In this case, the [[ref:Verifier]] would be able
        to require that the essay be provided by the one submits the application. 
      - The object ****MAY**** contain a `subject_is_holder` property, and if
        present its value ****MUST**** be one of the following strings:
        - `required` - This indicates that the processing entity ****MUST****
          include proof that the subject of the credential is the same as the
          entity submitting the response.
        - `preferred` - This indicates that it is ****RECOMMENDED**** that the
          processing entity include proof that the subject of the credential is
          the same as the entity submitting the response, i.e., the holder.
      
        The `subject_is_holder` property could be used by a [[ref:Verifier]] to require
        that certain inputs be provided by e subject. For example, an identity
        verification `presentation definition` might contain an _Input
        Descriptor_ object for a passport number. In this case, the [[ref:Verifier]]
        would be able to require that the passport credential was issued to the
        one who submits the identity verification. 
        
      - The object ****MAY**** contain a `fields` property, and its value
        ****MUST**** be an array of
        [_Input Descriptor Field Entry_](#input-descriptor-field-entry) objects,
        each being composed as follows:
          - The object ****MUST**** contain a `path` property, and its value
            ****MUST**** be an array of one or more
            [JSONPath](https://goessner.net/articles/JsonPath/) string
            expressions, as defined in the
            [JSONPath Syntax Definition](#jsonpath-syntax-definition) section,
            that select some subset of values from the target input. The array
            ****MUST**** be evaluated from 0-index forward, and the first
            expressions to return a value will be used for the rest of the
            entry's evaluation. The ability to declare multiple expressions this
            way allows the [[ref:Verifier]] to account for format differences - for
            example: normalizing the differences in structure between
            JSON-LD/JWT-based
            [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) and
            vanilla JSON Web Tokens (JWTs) [[spec:rfc7797]].
          - The object ****MAY**** contain a `purpose` property, and if present
            its value ****MUST**** be a string that describes the purpose for
            which the field is being requested.
          - The object ****MAY**** contain a `filter` property, and if present
            its value ****MUST**** be
            [JSON Schema](https://json-schema.org/specification.html) descriptor
            used to filter against the values returned from evaluation of the
            [JSONPath](https://goessner.net/articles/JsonPath/) string
            expressions in the `path` array.
          - The object ****MAY**** contain a `predicate` property. If the
            `predicate` property is present, the `filter` property ****MUST****
            also be present. The inclusion of the `predicate` property
            indicates that the processing entity returns a boolean, rather than
            a value returned from evaluation of the
            [JSONPath](https://goessner.net/articles/JsonPath/) string
            expressions in the `path` array. The boolean returned is the result
            of using the `filter` property's
            [JSON Schema](https://json-schema.org/specification.html)
            descriptors against the evaluated value. The value of `predicate`
            ****MUST**** be one of the following strings:
            - `required` - This indicates that the returned value ****MUST****
              be the boolean result of applying the value of the `filter`
              property to the result of evaluating the `path` property.
            - `preferred` - This indicates that the returned value
              ****SHOULD**** be the boolean result of applying the value of the
              `filter` property to the result of evaluating the `path` property.
       
            If the `predicate` property is present, the set of JSON Schema
            descriptors which comprise the value of the `filter` property
            ****MUST**** be restricted according to the desired predicate
            operation, as follows:
            - To express the following range proofs, use the JSON Schema
              [numeric range](https://json-schema.org/understanding-json-schema/reference/numeric.html#range)
              properties: 
              - `greater-than` - Use the `exclusiveMinimum` descriptor. For
                example, to request a proof that an attribute is greater than
                10000: 
                ```json             
                {
                  "type": "number",
                  "exclusiveMinimum": 10000,
                }
                ``` 
              - `less-than` - Use the `exclusiveMaximum` descriptor. For
                example, to request a proof that an attribute is less than 85: 
                ```json             
                {
                  "type": "number",
                  "exclusiveMaximum": 85,
                }
                ```
              - `greater-than or equal-to` - Use the `minimum` descriptor. For
                example, to request a proof that an attribute is greater than or
                equal to 18: 
                ```json             
                {
                  "type": "number",
                  "minimum": 18,
                }
                ``` 
              - `less-than or equal-to` - Use the `maximum` descriptor. For
                example, to request a proof that an attribute is less than or
                equal to 65536: 
                ```json             
                {
                  "type": "number",
                  "maximum": 65536,
                }
                ```
            - to express the following equality proofs, use the JSON Schema
              `const` descriptor:
              - `equal-to` - Use the `const` descriptor. For example to request
                proof that an attribute has the value "Chad":
                ```json
                {
                  "const": "Chad"
                }
                ```
              - `not equal-to` - Use the `const` descriptor with the `not`
                operator. For example, to request proof that an attribute does
                not have the value "Karen":
                ```json
                {
                  "not": {
                    "const": "Karen"
                  }
                }
                ``` 
            - to express set-membership proofs, use the JSON Schema `enum`
              descriptor: 
              - `in-set` - Use the `enum` descriptor. For example, to
                request proof that an attribute is contained in the set of
                rainbow colors:
                ```json
                {
                  "type": "string",
                  "enum": ["red", "yellow", "blue"]
                }
                ```
              - `not-in-set` - Use the `enum` descriptor with the `not`
                operator. For example, to request proof that an attribute is not
                contained in the set of primary colors:
                ```json
                {
                  "not": { 
                    "enum": ["red", "yellow", "blue"] 
                  }
                }
                ```
            
            At this time, additional predicate operations are not supported.

### Input Evaluation

A consumer of a _Presentation Definition_ must filter inputs they hold (signed
credentials, raw data, etc.) to determine whether they possess the inputs
required to fulfill the demands of the Verifying party. A consumer of a
_Presentation Definition_ ****SHOULD**** use the following process to validate
whether or not its candidate inputs meet the requirements it describes:

For each [[ref:Input Descriptor]] in the `input_descriptors` array of a _Presentation
Definition_, a User Agent ****should**** compare each candidate input (JWT,
Verifiable Credential, etc.) it holds to determine whether there is a match.
Evaluate each candidate input as follows:
  1. The schema of the candidate input ****must**** match one of the _Input
    Descriptor_ `schema` object `uri` values exactly. If the scheme is a
    hashlink or a similar value that points to immutable content, this means the
    content of the schema, not just the URI from which it is downloaded, must
    also match. If one of the values is an exact match, proceed, if there are no
    exact matches, skip to the next candidate input.
  2. If the `constraints` property of the [[ref:Input Descriptor]] is present, and it
    contains a `fields` property with one or more
    [_Input Descriptor Field Entries_](#input-descriptor-field-entry), evaluate
    each against the candidate input as follows:
      1. Iterate the [[ref:Input Descriptor]] `path` array of
        [JSONPath](https://goessner.net/articles/JsonPath/) string expressions
        from 0-index, executing each expression against the candidate input.
        Cease iteration at the first expression that returns a matching _Field
        Query Result_ and use the result for the rest of the field's evaluation.
        If no result is returned for any of the expressions, skip to the next
        candidate input.
      2. If the `filter` property of the field entry is present, validate the
        _Field Query Result_ from the step above against the
        [JSON Schema](https://json-schema.org/specification.html) descriptor value.
      3. If the `predicate` property of the field entry is present, a boolean
        value should be returned rather than the value of the _Field Query
        Result_. Calculate this boolean value by evaluating the _Field Query
        Result_ against the
        [JSON Schema](https://json-schema.org/specification.html) descriptor
        value of the `filter` property.         
      4. If the result is valid, proceed iterating the rest of the `fields` entries.
  3. If all of the previous validation steps are successful, mark the candidate
    input as a match for use in a _Presentation Submission_, and if present at
    the top level of the [[ref:Input Descriptor]], keep a relative reference to the
    `group` values the input is designated for.
  4. If the `constraints` property of the [[ref:Input Descriptor]] is present and it
    contains a `limit_disclosure` property set to the boolean value `true`,
    ensure that any subsequent submission of data in relation to the candidate
    input is limited to the entries specified in the `fields` property. If the
    `fields` property ****is not**** present, or contains zero
    [_Input Descriptor Field Entries_](#input-descriptor-field-entry),
    submission ****SHOULD NOT**** include any claim data from the credential.
    (for example: a [[ref:Verifier]] may simply want to know a Holder has a valid,
    signed credential of a particular type, without disclosing any of the
    data it contains).
  5. If the `constraints` property of the [[ref:Input Descriptor]] is present, and it
    contains a `subject_is_issuer` property set to the value `required`, ensure
    that any submission of data in relation to the candidate input is fulfilled
    using a _self_attested_ credential.
  6. If the `constraints` property of the [[ref:Input Descriptor]] is present, and it
    contains a `subject_is_holder` property set to the value `required`, ensure
    that any submission of data in relation to the candidate input is fulfilled
    by the subject of the credential

::: note
The above evaluation process assumes the User Agent will test each candidate
input (JWT, Verifiable Credential, etc.) it holds to determine if it meets the
criteria for inclusion in submission. Any additional testing of a candidate
input for a schema match beyond comparison of the schema `uri` (e.g. specific
requirements or details expressed in schema `metadata`) is at the discretion
of the implementer.
:::

#### Expired and Revoked Data

Certain types of credentials have concepts of _expiration_ and _revocation_.
_Expiration_ is mechanism normally used to communicate a time bound up until
which a credential is valid. _Revocation_ is a mechanism normally used to give
an issuer control over the status of a credential after issuance. Different
credential specifications handle these concepts in different ways. 

`Presentation Definitions` have a need to specify whether expired, revoked,
or credentials of other statuses can be accepted. For credentials that have
simple status properties [Input Descriptor Filters](#input-descriptor-objects)
JSON Schema can be used to write specify acceptable criteria.

The first example demonstrates _expiry_ using the [VC Data Model's
 `expirationDate` property](https://w3c.github.io/vc-data-model/#expiration-0).
The second demonstrates _revocation_, or more generally, _credential status_
using the [VC Data Model's `credentialStatus` property](https://w3c.github.io/vc-data-model/#status-0).
Using the syntax provided in the example a [[ref:Verifier]] will have all requisite
information to resolve the status of a credential.

<tab-panels selected-index="0">

<nav>
  <button type="button">Verifiable Credential Expiration</button>
  <button type="button">Verifiable Credential Revocation Status</button>
</nav>

<section>

::: example Drivers License Expiry
```json
{
  "id": "drivers_license_information",
  "schema": {
    "uri": ["https://yourwatchful.gov/drivers-license-schema.json"],
    "name": "Verify Valid License",
    "purpose": "We need to know you have a license valid through December.",
    "metadata": {
      "client_id": "4fb540be-3a7f-0b47-bb37-3821bd766ed4",
      "redirect_uri": "https://yourwatchful.gov/verify"
    }
  },
  "constraints": {
    "fields": [
      {
        "path": ["$.expirationDate"],
        "filter": {
          "type": "string",
          "format": "date-time",
          "min": "2020-12-31T23:59:59.000Z"
        }
      }
    ]
  }
}
```
:::

</section>

<section>

::: example Drivers License Revocation
```json
{
  "id": "drivers_license_information",
  "schema": {
    "uri": ["https://yourwatchful.gov/drivers-license-schema.json"],
    "name": "Verify Valid License",
    "purpose": "We need to know that your license has not been revoked.",
    "metadata": {
      "client_id": "4fb540be-3a7f-0b47-bb37-3821bd766ed4",
      "redirect_uri": "https://yourwatchful.gov/verify"
    }
  },
  "constraints": {
    "fields": [
      {
        "path": ["$.credentialStatus"]
      }
    ]
  }
}
```
:::
</section>

</tab-panel>

### JSON Schema

The following JSON Schema Draft 7 definition summarizes the
format-related rules above:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "filter": {
      "type": "object",
      "properties": {
        "type": { "type": "string" },
        "format": { "type": "string" },
        "pattern": { "type": "string" },
        "minimum": { "type": ["number", "string"] },
        "minLength": { "type": "integer" },
        "maxLength": { "type": "integer" },
        "exclusiveMinimum": { "type": ["number", "string"] },
        "exclusiveMaximum": { "type": ["number", "string"] },
        "maximum": { "type": ["number", "string"] },
        "const": { "type": ["number", "string"] },
        "enum": { 
          "type": "array",
          "items": { "type": ["number", "string"] }
        },
        "not": {
          "type": "object",
          "minProperties": 1
        }
      },
      "required": ["type"],
      "additionalProperties": false
    },
    "format": {
      "type": "object",
      "patternProperties": {
        "^jwt$|^jwt_vc$|^jwt_vp$": {
          "type": "object",
          "properties": {
            "alg": {
              "type": "array",
              "minItems": 1,
              "items": { "type": "string" }
            }
          },
          "required": ["alg"],
          "additionalProperties": false
        },
        "^ldp_vc$|^ldp_vp$|^ldp$": {
          "type": "object",
          "properties": {
            "proof_type": {
              "type": "array",
              "minItems": 1,
              "items": { "type": "string" }
            }
          },
          "required": ["proof_type"],
          "additionalProperties": false
        }, 
        "additionalProperties": false  
      },
      "additionalProperties": false
    },
    "submission_requirements": {
      "type": "object",
      "oneOf": [
        {
          "properties": {
            "name": { "type": "string" },
            "purpose": { "type": "string" },
            "rule": { "type": "string" },
            "count": { "type": "integer", "minimum": 1 },
            "min": { "type": "integer", "minimum": 0 },
            "max": { "type": "integer", "minimum": 0 },
            "from": { "type": "string" }
          },
          "required": ["rule", "from"],
          "additionalProperties": false
        },
        {
          "properties": {
            "name": { "type": "string" },
            "purpose": { "type": "string" },
            "rule": { "type": "string" },
            "count": { "type": "integer", "minimum": 1 },
            "min": { "type": "integer", "minimum": 0 },
            "max": { "type": "integer", "minimum": 0 },
            "from_nested": {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/submission_requirements"
              }
            }
          },
          "required": ["rule", "from_nested"],
          "additionalProperties": false
        }
      ]
    },
    "input_descriptors": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "group": {
          "type": "array",
          "items": { "type": "string" }
        },
        "schema": {
          "type": "object",
          "properties": {
            "uri": {
              "type": "array",
              "items": { "type": "string" }
            },
            "name": { "type": "string" },
            "purpose": { "type": "string" },
            "metadata": { "type": "string" }
          },
          "required": ["uri", "name"],
          "additionalProperties": false
        },
        "constraints": {
          "type": "object",
          "properties": {
            "limit_disclosure": { "type": "boolean" },
            "fields": {
              "type": "array",
              "items": { "$ref": "#/definitions/field" }
            },
            "subject_is_issuer": {
              "type": "string",
              "enum": ["required", "preferred"]
            },
            "subject_is_holder": {
              "type": "string",
              "enum": ["required", "preferred"]
            }
          },
          "additionalProperties": false
        }
      },
      "required": ["id", "schema"],
      "additionalProperties": false
    },
    "field": {
      "type": "object",
      "oneOf": [
        {
          "properties": {
            "path": {
              "type": "array",
              "items": { "type": "string" }
            },
            "purpose": { "type": "string" },
            "filter": { "$ref": "#/definitions/filter" }
          },
          "required": ["path"],
          "additionalProperties": false
        },
        {
          "properties": {
            "path": {
              "type": "array",
              "items": { "type": "string" }
            },
            "purpose": { "type": "string" },
            "filter": { "$ref": "#/definitions/filter" },
            "predicate": { 
              "type": "string",
              "enum": ["required", "preferred"]
            }
          },
          "required": ["path", "filter", "predicate"],
          "additionalProperties": false
        }
      ]
    }
  },
  "type": "object",
  "properties": {
    "presentation_definition": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "purpose": { "type": "string" },
        "locale": { "type": "string" },
        "format": { "$ref": "#/definitions/format"},
        "submission_requirements": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/submission_requirements"
          }
        },
        "input_descriptors": {
          "type": "array",
          "items": { "$ref": "#/definitions/input_descriptors" }
        }
      },
      "required": ["input_descriptors"],
      "additionalProperties": false
    }
  }
}
```

### Presentation Requests
Presentation Definitions may be sent from a [[ref:Verifier]] to a Holder using a wide
variety of transport mechanisms or credentials exchange protocols. This
specification does not define a transport mechanism for `Presentation
Definitions` (or `Presentation Request`), but does note that different use
cases, supported signature schemes, protocols, and threat models may require a
`Presentation Request` to have certain properties:
- Signature verification - A Holder may wish to have assurances as to the
  provenance, identity, or status of a `Presentation Definition`. In this case,
  a `Presentation Request` that uses digital signatures may be required. 
- `domain`, `challenge`, or `nonce` - Some presentation protocols may require
  that presentations be unique, i.e., it should be possible for a [[ref:Verifier]] to
  detect if a presentation has been used before. Other protocols may require
  that a presentation to be bound to a particular communication exchange, or
  session. In these cases, a `Presentation Request` that provides a `domain`,
  `challenge`,or `nonce` property may be required.


## Presentation Submission

_Presentation Submissions_ are objects embedded within target credential
negotiation formats that unify the presentation of proofs to a [[ref:Verifier]] in
accordance with the requirements a [[ref:Verifier]] specified in a _Presentation
Definition_. Embedded _Presentation Submission_ objects ****MUST**** be located
within target data format as a `presentation_submission` property, which are
composed and embedded as follows:

1. The `presentation_submission` object ****MUST**** be included at the top-level 
  of an Embed Target, or in the specific location described in the 
  [Embed Locations table](#embed-locations) in the [Embed Target](#embed-target) section below.
2. The object ****MUST**** include a `descriptor_map` property, and its value
  ****MUST**** be an array of _Input Descriptor Mapping Objects_, each being
  composed as follows:
    - The object ****MUST**** include an `id` property, and its value
      ****MUST**** be a string matching the `id` property of the _Input
      Descriptor_ in the _Presentation Definition_ the submission is related to.
    - The object ****MUST**** include a `format` property, and its value 
      ****MUST**** be a string value matching one of the 
      [Credential Format Designation](#credential-format-designations) (`jwt`, 
      `jwt_vc`, `jwt_vp`, `ldp_vc`, `ldp_vp`, `ldp`), to denote what data format the credential is being 
      submitted in.
    - The object ****MUST**** include a `path` property, and its value
      ****MUST**** be a [JSONPath](https://goessner.net/articles/JsonPath/)
      string expression that selects the credential to be submit in relation
      to the identified [[ref:Input Descriptor]] identified, when executed against
      the top-level of the object the _Presentation Submission_ is embedded
      within.
    - The object ****MAY**** include a `path_nested` object to specify the
      presence of a multi-credential envelope format, meaning the credential indending to be selected must be decoded separately from its parent enclosure.
      + The format of a `path_nested` object mirrors that of a `descriptor_map` property. The nesting may be any number of levels deep. The `id` property ****MUST**** be the same for each level of nesting.
      + The `path` property inside each `path_nested` property provides a _relative path_ within a given nested value.

### Processing of `path_nested` Entries

****Example Nested Submission****

```javascript
{
  "presentation_submission": {
    "descriptor_map": [
      { 
        "id": "banking_input_2",
        "format": "jwt_vp",
        "path": "$.outerCredential[0]",
        "path_nested": {
            "id": "banking_input_2",
            "format": "ldp_vc",
            "path": "$.innerCredential[1]",
            "path_nested": {
                "id": "banking_input_2",
                "format": "jwt_vc",
                "path": "$.mostInnerCredential[2]"
            }
        }
    }
  ]
}
```

When the `path_nested` property is present in a _Presentation Submission_ object, 
process as follows:

1. For each Nested Submission Traversal Object in the `path_nested` array,
   process as follows:
    a. Execute the [JSONPath](https://goessner.net/articles/JsonPath/) expression string 
      on the [_Current Traversal Object_](#current-traversal-object){id="current-traversal-object"}, or if none is designated, 
      the top level of the Embed Target.
    b. Decode and parse the value returned from [JSONPath](https://goessner.net/articles/JsonPath/) 
      execution in accordance with the [Credential Format Designation](#credential-format-designations) 
      specified in the object's `format` property. If value parses and validates in accordance 
      with the [Credential Format Designation](#credential-format-designations) specified, let 
      the resulting object be the [_Current Traversal Object_](#current-traversal-object)
    c. If present, process the next Nested Submission Traversal Object in the 
       current `path_nested` property.
2. If parsing of the Nested Submission Traversal Objects in the `path_nested`
   property produced a valid value, process it as the submission against the
   [[ref:Input Descriptor]] indicated by the  `id` property of the containing
  _Input Descriptor Mapping Object_.

### Limited Disclosure Submissions

If for all credentials submitted in relation to
[_Input Descriptor Objects_](#input-descriptor-objects) that include a
`constraints` object with a `limit_disclosure` property set to the boolean value
`true`, ensure that the data submitted is limited to the entries specified in
the `fields` property of the `constraints` object. If the `fields` property
****is not**** present, or contains zero
[_Input Descriptor Field Entries_](#input-descriptor-field-entry), the
submission ****SHOULD NOT**** include any claim data from the credential. (for
example: a Verifier may simply want to know a Holder has a valid, signed
credential of a particular type, without disclosing any of the data it contains).

### Validation of Credentials

Once a credential has been ingested via a Presentation Submission, any validation 
beyond the process of evaluation defined by the [Input Evaluation](#input-evaluation) 
section is outside the scope of Presentation Exchange. Validation of signatures 
and other cryptographic proofs are a function of a given credential format, and 
should be evaluated in accordance with a given credential format's standardized 
processing steps. Additional verification of credential data or subsequent 
validation required by a given [[ref:Verifier]] are left to the Verifier's systems, code 
and business processes to define and execute.

During validation, each Input Descriptor Object ****MUST**** refer to only a
single discrete container within a _Presentation Submission_, such that all
checks refer to properties within the same container and are protected by the
same digital signature, if the container format supports digital signatures.
Examples of discrete container formats include a single Verifiable Credential
within a Verifiable Presentation as defined in 
[W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/), OpenID
Connect Tokens, and JSON Web Tokens. This is to ensure that related
requirements, for example, "given name" and "family name" within the same
_Input Descriptor Object_ also come from the same container.

### Embed Targets

The following section details where the _Presentation Submission_ is to be
embedded within a target data structure, as well as how to formulate the
[JSONPath](https://goessner.net/articles/JsonPath/) expressions to select the
credentials within the target data structure.

#### Embed Locations

The following are the locations at which the `presentation_submission` object 
****MUST**** be embedded for known target formats. For any location besides 
the top level of the embed target, the location is described in JSONPath syntax.

Target     | Location      
---------- | --------
OpenID     | top-level 
DIDComms   | `$.presentations~attach.data.json`
VP         | top-level
CHAPI      | `$.data`

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
        "locale": {
          "type": "string"
        },
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
        "path": { "type": "string" },
        "path_nested": { 
          "type": "object",
            "$ref": "#/definitions/descriptor"
        },
        "format": { 
          "type": "string",
          "enum": ["jwt", "jwt_vc", "jwt_vp", "ldp", "ldp_vc", "ldp_vp"]
        }
      },
      "required": ["id", "path", "format"],
      "additionalProperties": false
    }
  },
  "required": ["presentation_submission"],
  "additionalProperties": false
}
```

## Credential Format Designations

Within the _Presentation Exchange_ specification, there are numerous sections 
where [[ref:Verifiers]] and Holders convey what credential variants they support and 
are submitting. The following are the normalized references used within the 
specification:

- `jwt` - the format is a JSON Web Token (JWTs) [[spec:rfc7797]] 
  that will be submitted in the form of a JWT encoded string. Expression of 
  supported algorithms in relation to this format ****MUST**** be conveyed using an `alg` property 
  paired with values that are identifiers from the 
  JSON Web Algorithms registry [[spec:RFC7518]].
- `jwt_vc`, `jwt_vp` - these formats are JSON Web Tokens (JWTs) [[spec:rfc7797]] 
  that will be submitted in the form of a JWT encoded string, and the body of the decoded 
  JWT string is defined in the JSON Web Token (JWT) [[spec:rfc7797]] section 
  of the [W3C Verifiable Credentials specification](https://www.w3.org/TR/vc-data-model/#json-web-token). 
  Expression of supported algorithms in relation to these formats ****MUST**** be conveyed using 
  an `alg` property paired with values that are identifiers from the JSON Web Algorithms registry 
  [[spec:RFC7518]].
- `ldp_vc`, `ldp_vp` - these formats are W3C Verifiable Credentials [[spec:VC-DATA MODEL]]
  that will be submitted in the form of a JSON object. Expression of supported 
  algorithms in relation to these formats ****MUST**** be conveyed using a `proof_type` property 
  paired with values that are identifiers from the 
  [Linked Data Cryptographic Suite Registry](https://w3c-ccg.github.io/ld-cryptosuite-registry/).
- `ldp` - this format is defined in the [W3C CCG Linked Data Proofs](https://w3c-ccg.github.io/ld-proofs/) 
  specification [[spec: Linked Data Proofs]], and will be submitted as objects. Expression of supported algorithms 
  in relation to these formats ****MUST**** be conveyed using a `proof_type` property 
  with values that are identifiers from the 
  [Linked Data Cryptographic Suite Registry](https://w3c-ccg.github.io/ld-cryptosuite-registry/).

## JSON Schema Vocabulary Definition

The _Presentation Exchange_ specification adopts and defines the following JSON
Schema data format and processing variant, which implementers ****MUST****
support for evaluation of the portions of the _Presentation Exchange_
specification that call for JSON Schema validation:
https://tools.ietf.org/html/draft-handrews-json-schema-02

## JSONPath Syntax Definition

The _Presentation Exchange_ specification adopts and defines the following
syntax from the JSONPath object query language, which implementers ****MUST****
support for evaluation of the portions of the _Presentation Exchange_
specification that call for JSONPath expression execution.

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

## External References

[[spec]]

## Appendix

### Embed Target Examples

<!-- #### Presentation Definitions

<tab-panels selected-index="0">

<nav>
  <button type="button">Verifiable Presentation</button>
  <button type="button">Open ID Connect</button>
  <button type="button">CHAPI</button>
  <button type="button">DIDComm</button>
</nav>

<section>

</section>

<section>

</section>

<section>

</section>

<section>

</section>

</tab-panels> -->

#### Presentation Submissions

<tab-panels selected-index="0">

<nav>
  <button type="button">Verifiable Presentation</button>
  <button type="button">Open ID Connect</button>
  <button type="button">CHAPI</button>
  <button type="button">DIDComm</button>
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
        "format": "jwt_vc",
        "path": "$.verifiableCredential[0]"
      },
      {
        "id": "employment_input",
        "format": "ldp_vc",
        "path": "$.verifiableCredential[1]"
      },
      {
        "id": "citizenship_input_1",
        "format": "ldp_vc",
        "path": "$.verifiableCredential[2]"
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
      "id": "https://business-standards.org/schemas/employment-history.json",
      "type": ["VerifiableCredential", "GenericEmploymentCredential"],
      "issuer": "did:foo:123",
      "issuanceDate": "2010-01-01T19:73:24Z",
      "credentialSubject": {
        "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
        "active": true
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
    "jws": "..."
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
        "format": "jwt",
        "path": "$._claim_sources.banking_input_2.JWT"
      },
      {
        "id": "employment_input",
        "format": "jwt_vc",
        "path": "$._claim_sources.employment_input.VC_JWT"
      },
      {
        "id": "citizenship_input_1",
        "format": "ldp_vc",
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
      "VC": {
        "@context": "https://www.w3.org/2018/credentials/v1",
        "id": "https://business-standards.org/schemas/employment-history.json",
        "type": ["VerifiableCredential", "GenericEmploymentCredential"],
        "issuer": "did:foo:123",
        "issuanceDate": "2010-01-01T19:73:24Z",
        "credentialSubject": {
          "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
          "active": true
        },
        "proof": {
          "type": "EcdsaSecp256k1VerificationKey2019",
          "created": "2017-06-18T21:19:10Z",
          "proofPurpose": "assertionMethod",
          "verificationMethod": "https://example.edu/issuers/keys/1",
          "jws": "..."
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

::: example Presentation Submission using DIDComm
```json
{
    "@type": "https://didcomm.org/present-proof/%VER/presentation",
    "@id": "f1ca8245-ab2d-4d9c-8d7d-94bf310314ef",
    "comment": "some comment",
    "formats" : [{
        "attach_id" : "2a3f1c4c-623c-44e6-b159-179048c51260",
        "format" : "dif/presentation-exchange/submission@v1.0"
    }],
    "presentations~attach": [{
        "@id": "2a3f1c4c-623c-44e6-b159-179048c51260",
        "mime-type": "application/ld+json",
        "data": {
            "json": {
              // Presentation Submission goes here
            }
        }
    }]
}
```
:::

</section>

</tab-panels>

### Developer Resources

#### JSONPath

- **Node.js**
    - https://www.npmjs.com/package/jsonpath
- **Java**
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
- **Java**
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
