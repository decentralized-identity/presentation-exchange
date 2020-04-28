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

## Requirements

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

## `Presentation Definition`

Presentation Definitions are objects generate to articulate what proofs an entity requires to make a decision about an interaction with a Subject. Presentation Definitions are composed of inputs, which describe the forms and details of the proofs they require, and and optional set of selection rules, to allow Subjects flexibility in cases where many different types of proofs may satisfy an input requirement.

::: example Presentation Definition - all features exercised
```json
{
  "submission_requirements": [
    {
      "requirement": "bank_info",
      "rule": "all",
      "from": ["A"]
    },
    {
      "requirement": "citizenship_proof",
      "rule": "pick",
      "count": 1,
      "from": ["B"]
    }
  ],
  "input_descriptors": [
    {
      "group": ["A"],
      "schema": {
        "context": "https://acme-bank.org/checking_account.json",
        "type": "Accounts"
      },
      "constraints": {
        "issuers": ["did:bankmethod:123"],
        "fields": [
          {
            "path": "$.accounts",
            "jsonSchema": {
              "type": "array",
              "maxLength": 5
            }
          },
          {
            "path": "$.accounts[0]",
            "startsWith": "DE"
          },
          //  {
          //    "path": "$.accounts[0]",
          //    "startsWith": "US"
          //  },
          {
            "path": "$.accounts[6]",
            "startsWith": "US"
          }
        ]
      }
    },
    {
      "group": ["A"],
      "schema": {
        "context": "https://trusty-bank.org/savings_account.json",
        "type": "Accts"
      },
      "constraints": {
        "issuers": ["did:bankmethod:456"],
        "fields": [{
          "path": "$.routing",
          "type": "string",
          "maxLength": 9
        }]
      }
    },
    {
      "group": ["A"],
      "schema": {
        "context": "https://example.org/examples/degree.json",
        "type": "JsonSchemaValidator2018"
      },
      "constraints": {
        "issuers": ["self-issued"],
        "fields": [{
          "path": "$.first_name",
          "maxLength": 17
        }]
      }
    },
    {
      "group": ["B"],
      "schema": {
        "context": "https://eu.com/claims/DriversLicense",
        "type": "EUDriversLicense"
      },
      "constraints": {
        "issuers": ["did:foo:gov1", "did:bar:gov2"],
        "fields": [{
          "path": "$.dob",
          "circuit": "> 21"
        }]
      }
    },
    {
      "group": ["B"],
      "schema": {
        "context": "hub://did:foo:123/Collections/schema.us.gov",
        "type": "Passport"
      },
      "constraints": {
        "issuers": ["did:foo:gov1"],
        "fields": [{
          "path": "$.dob",
          "circuit": "> 21"
        }]
      }
    }
  ]
}
```
:::

### Top-Level Properties

The following properties are defined for use at the top-level of the resource - all other properties that are not defined below MUST be ignored:

- `submission_requirements` - The resource MUST contain this property, and its value MUST be an array of Submission Requirement Rule objects.
- `input_descriptors` - The resource MUST contain this property, and its value MUST be an array of Input Descriptor objects

### Submission Requirement Rules

A _Presentation Definition_ MAY include _Submission Requirement Rules_, which are objects that define what combinations of inputs must be submitted to comply with the requirements an Issuer/Verifier has for proceeding in a flow (e.g. credential issuance). _Submission Requirement Rules_ introduce a set of rule types and mapping instructions a User Agent can ingest to present requirement optionality to the user, and subsequently submit inputs in a way that maps back to the rules the verifying party has asserted (via a `Proof Submission` object). The following section defines the format for _Submission Requirement Rules_ objects and the selection syntax verifying parties can use to specify which combinations of inputs are acceptable.

::: example Basic Submission Requirement Rule
```json
"submission_requirements": [
  {
    "name": "bank_info",
    "rule": "all",
    "from": ["A"]
  },
  {
    "name": "citizenship_proof",
    "rule": "pick",
    "count": 1,
    "from": ["B"]
  }
]
```
:::

#### `pick` rule

#### `all` rule

### Input Descriptors

Input Descriptors are objects used to describe the proofs an entity requires of a Subject before they will proceed with an interaction. These descriptor objects are classified by type, which are defined below:

#### `data` Input Descriptor

::: example Input Descriptor - Data
```json
"input_descriptors": [
  {
    "type": "data",
    "group": ["A"],
    "field": "routing_number",
    "value": {
      "type": "string",
      "maxLength": 9
    }
  }
]
```
:::

#### `credential` Input Descriptor

::: example Input Descriptor - Signed Credential
```json
"input_descriptors": [
  {
    "type": "credential",
    "group": ["B"],
    "field": "drivers_license",
    "schema": "https://eu.com/claims/DriversLicense",
    "constraints": {
      "issuers": ["did:foo:gov1", "did:bar:gov2"]
    }
  }
]
```
:::


## `Presentation Submission`

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
      "requirement": ["bank_info"],
      "field": "routing_number",
      "map": {
        "data_path": "$.verifiableCredential.[0].credentialSubject.address"
      }
    },
    {
      "requirement": ["bank_info"],
      "field": "account_number",
      "map": {
        "data_path": "$.verifiableCredential.[0].credentialSubject.account"
      }
    },
    {
      "requirement": ["citizenship_proof"],
      "field": "drivers_license",
      "map": {
        "data_path": "$.verifiableCredential.[1]"
      }
    }
  ],
  "verifiableCredential": [
    { // DECODED JWT PAYLOAD, ASSUME THIS WILL BE A BIG UGLY OBJECT
      "vc": {
        "@context": "https://www.w3.org/2018/credentials/v1",
        "type": ["PresentationSubmissionRawData"],
        "credentialSubject": {
          "routing": "4fe73c65v",
          "account": "123543565654"
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