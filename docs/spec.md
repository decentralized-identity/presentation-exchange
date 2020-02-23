Proof Presentation
==================

**Specification Status:** Strawman

**Latest Draft:**
  [identity.foundation/proof-presentation](https://identity.foundation/proof-presentation)

**Editors:**
~ [Daniel Buchner](https://www.linkedin.com/in/dbuchner/) (Microsoft)
~ [Brent Zundel](https://www.linkedin.com/in/bzundel/) (Evernym)
<!-- -->
**Participate:**
~ [GitHub repo](https://github.com/decentralized-identity/proof-presentation)
~ [File a bug](https://github.com/decentralized-identity/proof-presentation/issues)
~ [Commit history](https://github.com/decentralized-identity/proof-presentation/commits/master)

------------------------------------

## Abstract

A common activity between peers in identity systems that feature the ability to generate self-asserted and third-party issued claims is the demand and submission of proofs from a Subject to a Verifier. This flow implicitly requires the Subject and Verifier have a known mechanism to facilitate the two primary steps in a proofing exchange: the way Verifiers define the proof requirements, and how Subjects must encode submissions of proof to align with those requirements.

To address these needs, this Proof Presentation specification codifies the `Proof Definition` data format Verifiers can use to articulate proof requirements, as well as the `Proof Submission` data format Subjects can use to submit proofs in accordance with them.

This specification does not endeavor to define transport protocols, specific endpoints, or other means for conveying the formatted objects it codifies herein, but it is encouraged that others specifications and projects that do define such mechanisms utilize these data formats within their flows.

## Status of This Document

Proof Presentation is a draft specification being developed within the Decentralized Identity Foundation (DIF), and being designed to incorporate the requirements and learnings from related work of the most active industry players into a shared specification that meets the collective needs of the community. This spec will be updated to reflect relevant changes, and participants are encouraged to actively engage on GitHub (see above) and other mediums (e.g. DIF) where this work is being done.

## Terminology

Term | Definition
:--- | :---------
Decentralized Identifier (DID) | Unique ID string and PKI metadata document format for describing the cryptographic keys and other fundamental PKI values linked to a unique, user-controlled, self-sovereign identifier in a target system (i.e. blockchain, distributed ledger).
Subject | The entity that submits proofs to a Verifier to satisfy the requirements described in a Proof Definition
Verifier | The entity that defines what proofs they require from a Subject (via a Proof Definition) in order to proceed with an interaction.

## `Proof Definition`

Proof Definitions are objects generate to articulate what proofs an entity requires to make a decision about an interaction with a Subject. Proof Definitions are composed of inputs, which describe the forms and details of the proofs they require, and and optional set of selection rules, to allow Subjects flexibility in cases where many different types of proofs may satisfy an input requirement.

::: example Proof Definition - all features exercised
```json
{
  "input_selection": [
    {
      "rule": "all",
      "from": ["A"]
    },
    {
      "rule": "pick",
      "count": 1,
      "from": ["B"]
    }
  ],
  "input_descriptors": [
    {
      "type": "data",
      "group": ["A"],
      "field": "routing_number",
      "value": {
          "type": "string",
          "maxLength": 9
      }
    },
    {
      "type": "data",
      "group": ["A"],
      "field": "account_number",
      "value": {
        "type": "integer",
        "maxLength": 17,
        "required": true
      }
    },
    {
      "type": "idtoken",
      "group": ["A"],
      "redirect": "https://acmebank.com/oauth",
      "parameters": {
        "client_id": "dhfiuhsdre",
        "scope": "openid+profile"
      }
    },
    {
      "type": "vc",
      "group": ["B"],
      "schema": "https://eu.com/claims/IDCard",
      "constraints": {
        "issuers": ["did:foo:gov1", "did:bar:gov2"]
      }
    },
    {
      "type": "vc",
      "group": ["B"],
      "schema": "hub://did:foo:123/Collections/schema.us.gov/Passport",
      "constraints": {
        "issuers": ["did:foo:gov1", "did:bar:gov2"]
      }  
    }
  ]
}
```
:::

### Top-Level Properties

The following properties are defined for use at the top-level of the resource - all other properties that are not defined below MUST be ignored:

- `input_selection` - The resource MUST contain this property, and its value MUST be an array of Input Selection Rule objects.
- `input_descriptors` - The resource MUST contain this property, and its value MUST be an array of Input Descriptor objects

### Input Selection Rules

Within the `input_selection` array, a Credential Manifest MAY include Input Selection Rule objects that define what combinations of inputs an Issuer will accept for credential issuance evaluation. The following section defines the format for Input Selection Rule objects and the selection syntax Issuers can use to specify which combinations of inputs are acceptable.

::: example Basic input selection rule
```json
"input_selection": [
  {
    "rule": "all",
    "from": ["A"]
  }
]
```
:::

```json
"input_selection": [
  {
    "rule": "all",
    "from": ["A"]
  },

  // Mongo syntax
  { "group": "A" }

  {
    "rule": "pick",
    "count": 1,
    "from": ["B"]
  }

  { "group": "$elemMatch": "B",  }

]
```

### Input Descriptors

Input Descriptors are objects used to describe the proofs an entity requires of a Subject before they will proceed with an interaction. These descriptor objects are classified by type, which are defined below:

#### `data` Input Descriptor

::: example Input Descriptor - Data
```json
"input_descriptors": [
  {
    "type": "data",
    "group": ["A"],
    "field": "credit_card_number",
    "value": {
      "type": "integer",
      "maximum": 9999999999999999
    }
  }
]
```
:::

#### `vc` Input Descriptor

::: example Input Descriptor - Verifiable Credential
```json
"input_descriptors": [
  {
    "type": "vc",
    "group": ["B"],
    "schema": "https://eu.com/claims/IDCard",
    "constraints": {
      "issuers": ["did:foo:gov1", "did:bar:gov2"]
    }
  }
]
```
:::

#### `idtoken` Input Descriptor


### Input Selection Rules

To enable Verifying entities to encode optionality into their Proof Definition requirements, the Proof Definition includes a section where Verifiers can encode Input Selection Rules. These rules convey what combinations of proof inputs are acceptable to fulfill their processing requirements. Input Selection Rules introduce a set of rule types that provide different ways for Verifiers to instruct a Subject's User Agent to present optionality and how matching inputs should be submitted (via a `Proof Submission`) to satisfy their requirements. 

#### `pick` rule

#### `all` rule


## `Proof Submission`


::: example Proof Submission - all features exercised
```json
{
  "input_submissions": [
    {
      "group": "A",
      "proof": {...}
    },
    {
      "group": "A",
      "proof": {...}
    },
    {
      "group": "A",
      "proof": {...}
    },
    {
      "group": "B",
      "proof": {...}
    }
  ]
}
```
:::