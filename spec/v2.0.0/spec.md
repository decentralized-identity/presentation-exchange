Presentation Exchange 2.0.0
==================

**Specification Status:** DIF Ratified Specification

**Latest Draft:**
  [identity.foundation/presentation-exchange](https://identity.foundation/presentation-exchange)
<!-- -->
**Editors:**
~ [Daniel Buchner](https://www.linkedin.com/in/dbuchner/) (Block)
~ [Brent Zundel](https://www.linkedin.com/in/bzundel/) (Evernym)
~ [Martin Riedel](https://www.linkedin.com/in/rado0x54/) (Consensys Mesh)
~ [Kim Hamilton Duffy](https://www.linkedin.com/in/kimdhamilton/) (Centre Consortium)

**Contributors:**
~ [Daniel McGrogan](www.linkedin.com/in/dtmcgrogan) (Workday)
~ [Gabe Cohen](https://www.linkedin.com/in/cohengabe/) (Block)
~ [Orie Steele](https://www.linkedin.com/in/or13b/) (Transmute)
~ [Wayne Chang](https://www.linkedin.com/in/waynebuilds/) (Spruce)
~ [David Chadwick](https://www.linkedin.com/in/davidwchadwick/) (Crossword Cybersecurity)
~ [Jace Hensley](https://www.linkedin.com/in/jacehensley/) (Bloom)
~ [Niels Klomp](https://www.linkedin.com/in/niels-klomp/) (Sphereon)
~ [Andor Kesselman](https://www.linkedin.com/in/henosisknot/) (Benri)

**Participate:**
~ [GitHub repo](https://github.com/decentralized-identity/presentation-exchange)
~ [File a bug](https://github.com/decentralized-identity/presentation-exchange/issues)
~ [Commit history](https://github.com/decentralized-identity/presentation-exchange/commits/main)

------------------------------------

## Abstract

A common activity between peers in identity systems that feature the ability to
generate self-asserted and third-party issued [[ref:Claims]] is the demand and
submission of proofs from a [[ref:Holder]] to a [[ref:Verifier]]. This flow
implicitly requires the [[ref:Holder]] and [[ref:Verifier]] have a mechanism to
facilitate the two primary steps in a proving exchange: a way for
[[ref:Verifiers]] to describe proof requirements, and for [[ref:Holders]] to
describe submissions of proof which align with those requirements.

To address these needs, this Presentation Exchange specification codifies a
[[ref:Presentation Definition]] data format [[ref:Verifiers]] can use to
articulate proof requirements, and a [[ref:Presentation Submission]] data format
[[ref:Holders]] can use to describe proofs submitted in accordance with them.

This specification is designed to be both [[ref:Claim]] format and transport
envelope agnostic,as long as the format can be serialized as JSON. This means
an implementer can use
[JSON Web Tokens (JWTs)](https://tools.ietf.org/html/rfc7519),
[Verifiable Credentials (VCs)](https://www.w3.org/TR/vc-data-model/),
[JWT-VCs](https://www.w3.org/TR/vc-data-model/#json-web-token-extensions),
or any other JSON [[ref:Claim]] format, and convey them via
[Open ID Connect](https://openid.net/connect/),
[DIDComm](https://identity.foundation/didcomm-messaging/spec/),
[Credential Handler API](https://w3c-ccg.github.io/credential-handler-api/),
or any other transport envelope. The goal of this flexible format- and
transport-agnostic mechanism is to enable unified procedures and code, thereby
reducing potentially redundant code and processing requirements.

This specification does not define transport protocols, specific endpoints, or
other means for conveying the formatted objects it codifies, but encourages
other specifications and projects that do define such mechanisms to utilize
these data formats within their flows.

## Status of This Document

Presentation Exchange v2.0.0 is a _DIF RATIFIED_ specification developed within
the Decentralized Identity Foundation (DIF). It incorporates requirements and
learnings from related work of many active industry players into a shared
specification that meets the collective needs of the community.

## Terminology

[[def:Claim, Claims]]
~ An assertion made about a [[ref:Subject]]. Used as an umbrella term for
Credential, Assertion, Attestation, etc.

[[def:Conformant Consumer, Conformant Consumers]]
~ An entity that follows the specified processing rules to consume a
[[ref:Presentation Definition]] or [[ref:Presentation Submission]] that conforms
to this specification.

[[def:Conformant Producer]]
~ An entity that produces a [[ref:Presentation Definition]] or
[[ref:Presentation Submission]] that conforms to this specification.

[[def:Embed Locations]]
~ Embed Locations are the specific paths and indexes per [[ref:Embed Target]]
where the [[ref:Verifier]] can expect to find the [[ref:Presentation
Submission]]. See [Embed Locations](#embed-locations).

[[def:Embed Target, Embed Targets]]
~ Embed Targets are data formats used in messaging protocols that may be used
to transport a [[ref:Presentation Submission]]. See
[Embed Targets](#embed-targets).

[[def:Feature, Features]]
~ Features enable [[ref:Verifiers]] to express, and [[ref:Holders]] to support,
extended functionality (relative to the base objects) by defining one or more
properties on one or more objects. 


[[def:Holder, Holders]]
~ Holders are entities that submit proofs to [[ref:Verifiers]] to satisfy the
requirements described in a [[ref:Presentation Definition]]. A Holder is a
[[ref:Conformant Consumer]] of a [[ref:Presentation Definition]] and a
[[ref:Conformant Producer]] of a [[ref:Presentation Submission]].

[[def:Holder Binding]]
~ Holder Bindings are requirements of a certain type of relationship between
the [[ref:Holder]] and the [[ref:Claims]] within the [[ref:Presentation
Submission]]. See [Holder Binding](#holder-and-subject-binding).

[[def:Decentralized Web Node, DWN]]
~ Some examples refer to an unfamiliar query protocol, `dwn://`, as a way of
storing and querying schemata and other resources. While orthogonal to this
specification and not yet on a standards track, the concept of "decentralized web nodes"
proposes an architecture that may be of interest or utility to implementers of
 this specification. For more information, see the draft specification
hosted at the decentralized identity foundation
[here](https://identity.foundation/decentralized-web-node/spec/)

[[def:Input Descriptor, Input Descriptors]]
~ Input Descriptors are used by a Verifier to describe the information required
of a [[ref:Holder]] before an interaction can proceed. See
[Input Descriptor](#input-descriptor).

[[def:Input Descriptor Object, Input Descriptor Objects]]
~ Input Descriptors Objects are populated with properties describing what type
of input data/[[ref:Claim]], or sub-fields thereof, are required for submission
to the [[ref:Verifier]]. See
[Input Descriptor Object](#input-descriptor-object).

[[def:Link Secrets]]
~ Link Secrets are values held by the [[ref:Holder]] but hidden from other
parties. They are typically incorporated into cryptographic signatures used in
claims to demonstrate correlation while preventing replay attacks. An Issuer
may ascertain that a Holder possesses a link secret without its disclosure.
See [Link Secrets](#link-secrets).

[[def:Presentation Definition]]
~ Presentation Definitions are objects that articulate what proofs a Verifier
requires. These help the Verifier to decide how or whether to interact with a
[[ref:Holder]]. Presentation Definitions are composed of inputs, which describe
the forms and details of the proofs they require, and optional sets of
selection rules, to allow Holders flexibility in cases where many different
types of proofs may satisfy an input requirement. See
[Presentation Definition](#presentation-definition).

[[def:Presentation Request]]
~ Presentation Requests are transport mechanisms for [[ref:Presentation
Definitions]].  Presentation Requests can take multiple shapes, using a variety
of protocols and signature schemes not refined in this specification. They are
sent by a [[ref:Verifier]] to a [[ref:Holder]]. Defining Presentation Requests
is outside the scope of this specification. See
[Presentation Request](#presentation-request).

[[def:Presentation Submission]]
~ Presentation Submissions are objects embedded within target claim negotiation
formats that unify the presentation of proofs to a [[ref:Verifier]] in
accordance with the requirements a [[ref:Verifier]] specified in a
[[ref:Presentation Definition]]. See
[Presentation Submission](#presentation-submission).

[[def:Subject, Subjects]]
~ Subjects are the entities about which [[ref:Claims]] are made. The Subject may
not be the same entity as the [[ref:Holder]]

[[def:Submission Requirement, Submission Requirements]]
~ Submission Requirements are objects that define what combinations of inputs
must be submitted to comply with the requirements a [[ref:Verifier]] has for
proceeding in a flow (e.g. credential issuance, allowing entry, accepting an
application). See [Submission Requirements](#submission-requirements).

[[def:Submission Requirement Object, Submission Requirement Objects]]
~ Submission Requirement Objects describe valid combinations of inputs in a
[[ref:Presentation Submission]]. See
[Submission Requirement Objects](#submission-requirement-objects).

[[def:Submission Requirement Rule, Submission Requirement Rules]]
~ Submission Requirement Rules describe combinatorial rules within a
[[ref:Submission Requirement Object]] when processing inputs. They may be
nested. See [Submission Requirement Rules](#submission-requirement-rules).

[[def:Verifier, Verifiers]]
~ Verifiers are entities that define what proofs they require from a
[[ref:Holder]] (via a [[ref:Presentation Definition]]) in order to proceed with
an interaction. A Verifier is a [[ref:Conformant Producer]] of a
[[ref:Presentation Definition]] and a [[ref:Conformant Consumer]] of a
[[ref:Presentation Submission]].

## Structure of this Document
This document has two primary sections: In the first, there is a model for defining the set of information a relying party would like to have presented, and in the second, there is a model for showing that the submitted presentation meets the related definition.
Each of these sections begins by defining a base set of properties considered essential for core uses of the model, then describes additional feature sets that expand upon the base to allow more complex uses.
Objects are defined such that they may be used on their own or extended through
[[ref:Features]] defined subsequently in the spec. A [[ref:Feature]] must
declare if it has dependencies on other [[ref:Features]].

A [[ref:Feature]] enables [[ref:Verifiers]] to express, and [[ref:Holders]]
to support, extended functionality (relative to the base objects) by defining
one or more properties on one or more objects.

[[ref:Conformant Consumers]] are not required to support [[ref:Features]].
A [[ref:Conformant Producer]] using [[ref:Features]] that a [[ref:Conformant Consumer]] does not support, might result in a [[ref:Presentation Submission]] that can be rejected by a [[ref:Verifier]]. This is especially the case when a feature introduces additional constraints on the [[ref:Input Descriptor Object]], like for instance the [Relational Constraint Feature](#relational-constraint-feature), where the `subject_is_issuer` property could be used by a [[ref:Verifier]] to require that certain inputs be _self_attested_. Depending on the [[ref:Verifier]] implementation a submission which is not self attested might be rejected, because the [[ref:Holder]] is not aware of the requirement the [[ref:Feature]] introduced.

A [[ref:Conformant Producer]] and [[ref:Conformant Consumer]] implementation may wish to use [[ref:Feature]] detection techniques for [[ref:Features]] it does not support. Producing an error might be appropriate for certain unsupported [[ref:Features]], preventing submitting inappropriate or too much data, which might result in an error being produced by another [[Conformant Consumer]] implementation.

Examples in this document use the [Verifiable Credentials Data Model](https://www.w3.org/TR/vc-data-model/) and the [Decentralized  Identifiers (DIDs)](https://www.w3.org/TR/did-core/) formats for illustrative purposes only; this specification is intended to support any JSON-serializable [[ref:Claim]] format.

## Presentation Definition

[[ref:Presentation Definitions]] are objects that articulate what proofs a
[[ref:Verifier]] requires. These help the [[ref:Verifier]] to decide how or
whether to interact with a [[ref:Holder]]. [[ref:Presentation Definitions]] are
composed of inputs, which describe the forms and details of the proofs they
require, and optional sets of selection rules, to allow [[ref:Holders]]
flexibility in cases where different types of proofs may satisfy an input
requirement.


<tab-panels selected-index="0">

<nav>
  <button type="button">Minimal Example</button>
  <button type="button">Filter By Credential Type</button>
  <button type="button">Two Filters</button>
</nav>

<section>

::: example Presentation Definition - Minimal Example
```json
[[insert ./test/v2.0.0/presentation-definition/minimal_example.json]]
```
:::

</section>

<section>

::: example Presentation Definition - Filter By Credential Type
```json
[[insert: ./test/v2.0.0/presentation-definition/pd_filter.json]]
```
:::

</section>

<section>

::: example Presentation Definition - Two Filters
```json
[[insert: ./test/v2.0.0/presentation-definition/pd_filter2.json]]
```
:::

</section>

</tab-panels>


The following properties are for use at the top-level of a
[[ref:Presentation Definition]]. Any properties that are not defined below MUST
be ignored, unless otherwise specified by a [[ref:Feature]];

- `id` - The [[ref:Presentation Definition]] ****MUST**** contain an `id`
  property. The value of this property ****MUST**** be a string. The string
  ****SHOULD**** provide a unique ID for the desired context. For example, a
  [UUID](https://tools.ietf.org/html/rfc4122) such as `32f54163-7166-48f1-93d8-f
  f217bdb0653` could provide an ID that is unique in a global context, while a
  simple string such as `my_presentation_definition_1` could be suitably unique
  in a local context.
- `input_descriptors` - The [[ref:Presentation Definition]]  ****MUST****
  contain an `input_descriptors` property. Its value ****MUST**** be an array of
  [[ref:Input Descriptor Objects]], the composition of which are described in
  the [`Input Descriptors`](#input-descriptors) section below.

  All inputs listed in the `input_descriptors` array are required for submission,
  unless otherwise specified by a [[ref:Feature]].

- `name` - The [[ref:Presentation Definition]] ****MAY**** contain a `name`
  property. If present, its value ****SHOULD**** be a human-friendly string
  intended to constitute a distinctive designation of the
  [[ref:Presentation Definition]].
- `purpose` - The [[ref:Presentation Definition]] ****MAY**** contain a
  `purpose` property. If present, its value ****MUST**** be a string that
  describes the purpose for which the [[ref:Presentation Definition]]'s inputs
  are being used for.
- The [[ref:Presentation Definition]] ****MAY**** include a `format` property.
  Some envelope transport protocols may include the value of this property in
  other locations and use different property names (See the [Format Embed Locations](#)
  section for details), but regardless of whether it resides at the default
  location (the `format` property of the `presentation_definition` object), the
  value ****MUST**** be an object with one or more properties matching the registered
  [Claim Format Designations](#claim-format-designations) (e.g., `jwt`, `jwt_vc`,
  `jwt_vp`, etc.). The properties inform the [[ref:Holder]] of the [[ref:Claim]]
  format configurations the [[ref:Verifier]] can process. The value for each
  claim format property ****MUST**** be an object composed as
  follows:
    - The object ****MUST**** include a format-specific property (i.e., `alg`,
      `proof_type`) that expresses which algorithms the [[ref:Verifier]]
      supports for the format. Its value ****MUST**** be an array of one or more
      format-specific algorithmic identifier references, as noted in the
      [Claim Format Designations](#claim-format-designations) section.

      An illustrative example containing all of the formats in use by the
      specifying implementers at time of writing (also reflected in the provided
      JSON Schema) is as follows::

```json
[[insert: ./test/v2.0.0/presentation-definition/format_example.json]]
```

::: note
  Including purpose information should not be confused with consent to process 
  personal data NOR taken as a substitute for an, e.g., GDPR-conformant expression of 
  "purpose"; instead, it should be thought of as purely informative to the user.
  Implementers are encouraged to do a proper review of applicable regulatory
  requirements around consent and purpose disclosures. 
  The DIF Claims & Credentials WG Data Agreement work item is developing a 
  supplemental specification to aid in compliance with privacy regulations (GDPR, CCPA, etc.),
  and a method for creating immutable records of consent records (data agreements) 
  for using personal data.
:::


### Input Descriptor

[[ref:Input Descriptors]] are objects used to describe the information a
[[ref:Verifier]] requires of a [[ref:Holder]]. All [[ref:Input Descriptors]]
****MUST**** be satisfied, unless otherwise specified by a [[ref:Feature]].

[[ref: Input Descriptor Objects]] contain an identifier and may contain constraints on data values, and an explanation why
 a certain item or set of data is being requested.

#### Input Descriptor Object

The following properties are for use at the top-level of a
[[ref: Input Descriptor Objects]]. Any properties that are not defined below MUST
be ignored, unless otherwise specified by a [[ref:Feature]];

- The [[ref:Input Descriptor Object]] ****MUST**** contain an `id` property.
  The value of the `id` property ****MUST**** be a string that does not
  conflict with the `id` of another [[ref:Input Descriptor Object]] in the same
  [[ref:Presentation Definition]].
- The [[ref:Input Descriptor Object]] ****MAY**** contain a `name` property. If
  present, its value ****SHOULD**** be a human-friendly name that describes what
  the target schema represents.
- The [[ref:Input Descriptor Object]] ****MAY**** contain a `purpose` property.
  If present, its value ****MUST**** be a string that describes the purpose for
  which the [[ref:Claim]]'s data is being requested.
- The [[ref:Input Descriptor Object]] ****MAY**** contain a `format` property.
  If present, its value ****MUST**** be an object with one or more properties
  matching the registered [Claim Format Designations](#claim-format-designations)
  (e.g., `jwt`, `jwt_vc`, `jwt_vp`, etc.). This `format` property is identical in
  value signature to the top-level `format` object, but can be used to specifically
  constrain submission of a single input to a subset of formats or algorithms.
- The [[ref:Input Descriptor Object]] ****MUST**** contain a `constraints`
property. Its value ****MUST**** be an object composed of _at least one_
of the following properties, unless otherwise specified by a [[ref:Feature]]:
    - The _constraints object_ ****MAY**** contain a `fields` property. Fields
    ****SHALL**** be processed forward from 0-index, so if a [[ref:Verifier]]
    desires to reduce processing by checking the most defining characteristics
    of a credential (e.g the type or schema of a credential) implementers
    ****SHOULD**** order these field checks before all others to ensure
    earliest termination of evaluation. If the `fields` property is present,
    its value ****MUST**** be an array of objects composed as follows, unless
    otherwise specified by a feature:
        - The _fields object_ ****MUST**** contain a `path` property. The value
          of this property ****MUST**** be an array of one or more
          [JSONPath](https://goessner.net/articles/JsonPath/) string
          expressions (as defined in the
          [JSONPath Syntax Definition](#jsonpath-syntax-definition) section)
          that select a target value from the input. The array ****MUST****
          be evaluated from 0-index forward, breaking as soon as a _Field
          Query Result_ is found (as described in
          [Input Evaluation](#input-evaluation)), which will be used for the
          rest of the entry's evaluation. The ability to declare multiple
          expressions in this way allows the [[ref:Verifier]] to account for
          format differences - for example: normalizing the differences in
          structure between JSON-LD/JWT-based
          [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) and
          vanilla JSON Web Tokens (JWTs) [[spec:rfc7519]].
        - The _fields object_ ****MAY**** contain an `id` property. If present,
          its value ****MUST**** be a string that is unique from every other
          field object's `id` property, including those contained in other
          [[ref:Input Descriptor Objects]].
        - The _fields object_ ****MAY**** contain a `purpose` property. If
          present, its value ****MUST**** be a string that describes the purpose
          for which the field is being requested.
        - The _fields object_ ****MAY**** contain a `name` property. If
          present, its value ****MUST**** be a string, and ****SHOULD**** be a
          human-friendly name that describes what the target field represents.
        - The _fields object_ ****MAY**** contain a `filter` property, and if
          present its value ****MUST**** be a
          [JSON Schema](https://json-schema.org/specification.html) descriptor
          used to filter against the values returned from evaluation of the
          [JSONPath](https://goessner.net/articles/JsonPath/) string
          expressions in the `path` array.
        - The _fields object_ ****MAY**** contain an `optional` property. The value
          of this property ****MUST**** be a boolean, wherein `true` indicates the 
          field is optional, and `false` or non-presence of the property indicates 
          the field is required. Even when the `optional` property is present, the value 
          located at the indicated `path` of the field ****MUST**** validate against 
          the JSON Schema `filter`, if a `filter` is present.
          :::note IDO Filter
          Remember a valid JSON Schema ****MAY**** contain [additional keywords](https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-01#section-6.4) (e.g., `formatMinimum` and `formatMaximum`) that require extensions to handle properly.

          A [[ref: Holder]] ****SHOULD**** be able to gracefully handle additional properties, even if this just means ignoring the added keywords.
          :::
    - The _constraints object_ ****MAY**** contain a `limit_disclosure`
      property. If present, its value ****MUST**** be one of the following strings:
        - `required` - This indicates that the [[ref:Conformant Consumer]]
          ****MUST**** limit submitted fields to those listed in the `fields`
          array (if present). [[ref:Conformant Consumers]] are not required to
          implement support for this value, but they ****MUST**** understand
          this value sufficiently to return nothing (or cease the interaction
          with the [[ref:Verifier]]) if they do not implement it.
        - `preferred` - This indicates that the [[ref:Conformant Consumer]]
          ****SHOULD**** limit submitted fields to those listed in the `fields`
          array (if present).

      Omission of the `limit_disclosure` property indicates the
      [[ref:Conformant Consumer]] ****MAY**** submit a response that contains
      more than the data described in the `fields` array.


### Presentation Request

A [[ref:Presentation Request]] is any transport mechanism used to send a
[[ref:Presentation Definition]] from a [[ref:Verifier]] to a [[ref:Holder]]. A
wide variety of transport mechanisms or [[ref:Claim]] exchange protocols may be
used to send [[ref:Presentation Definitions]]. This specification does not
define [[ref:Presentation Requests]] and is designed to be agnostic to them.
Please note, however, that different use cases, supported signature schemes,
protocols, and threat models may require a [[ref:Presentation Request]]to have
certain properties. Some of these are expressed below:
- Signature verification -  Strongly identifying the entity making a request via
  a [[ref:presentation definition]] is outside the scope of this specification,
  however a [[ref:Holder]] may wish to have assurances as to the provenance,
  identity, or status of a [[ref:Presentation Definition]]. In this case, a
  [[ref:Presentation Request]] that uses digital signatures may be required.
- Replay protection - Some presentation protocols may require that presentations
  be unique, i.e., it should be possible for a [[ref:Verifier]] to detect if a
  presentation has been used before. Other protocols may require that a
  presentation be bound to a particular communication exchange or session. In
  these cases, a [[ref:Presentation Request]] that provides a `domain`,
  `challenge`, or `nonce` value may be required.


## Presentation Submission

[[ref:Presentation Submissions]] are objects embedded within target
[[ref:Claim]] negotiation formats that express how the inputs presented as
proofs to a [[ref:Verifier]] are provided in accordance with the requirements
specified in a [[ref:Presentation Definition]]. Embedded
[[ref:Presentation Submission]] objects ****MUST**** be located within target
data format as the value of a `presentation_submission` property, which is
composed and embedded as follows:

- The `presentation_submission` object ****MUST**** be included at the
  top-level of an Embed Target, or in the specific location described in the
  [Embed Locations table](#embed-locations) in the [Embed Target](#embed-target)
  section below.
- The `presentation_submission` object ****MUST**** contain an `id` property.
  The value of this property ****MUST**** be a unique identifier, such as a
  [UUID](https://tools.ietf.org/html/rfc4122).
- The `presentation_submission` object ****MUST**** contain a `definition_id`
  property. The value of this property ****MUST**** be the `id` value of a valid
  [[ref:Presentation Definition]].
- The `presentation_submission` object ****MUST**** include a `descriptor_map`
  property. The value of this property ****MUST**** be an array of
  _Input Descriptor Mapping Objects_, composed as follows:
    - The `descriptor_map` object ****MUST**** include an `id` property. The
      value of this property ****MUST**** be a string that matches the `id`
      property of the [[ref:Input Descriptor]] in the
      [[ref:Presentation Definition]] that this [[ref:Presentation Submission]]
      is related to.
    - The `descriptor_map` object ****MUST**** include a `format` property. The
      value of this property ****MUST**** be a string that matches one of the
      [Claim Format Designation](#claim-format-designations). This denotes the
      data format of the [[ref:Claim]].
    - The `descriptor_map` object ****MUST**** include a `path` property. The
      value of this property ****MUST**** be a
      [JSONPath](https://goessner.net/articles/JsonPath/) string expression. The
      `path` property indicates the [[ref:Claim]] submitted in relation to the
      identified [[ref:Input Descriptor]], when executed against the top-level
      of the object the [[ref:Presentation Submission]] is embedded within.
    - The object ****MAY**** include a `path_nested` object to indicate the
      presence of a multi-[[ref:Claim]] envelope format. This means the
      [[ref:Claim]] indicated is to be decoded separately from its parent
      enclosure.
      + The format of a `path_nested` object mirrors that of a `descriptor_map`
        property. The nesting may be any number of levels deep. The `id`
        property ****MUST**** be the same for each level of nesting.
      + The `path` property inside each `path_nested` property provides a
        _relative path_ within a given nested value.

::: example Basic Presentation Submission object
```json
{
  // NOTE: VP, OIDC, DIDComm, or CHAPI outer wrapper properties would be here.

  "presentation_submission": {
    "id": "a30e3b91-fb77-4d22-95fa-871689c322e2",
    "definition_id": "32f54163-7166-48f1-93d8-ff217bdb0653",
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
  }

}
```
:::

### Processing of Submission Entries

To process the _Submission Entries_ of a Presentation Submission, use the following process:

1. For each _Submission Entry_ in the `descriptor_map` array:
   1. Execute the `path` field's [JSONPath](https://goessner.net/articles/JsonPath/)
      expression string on the
      [_Current Traversal Object_](#current-traversal-object){id="current-traversal-object"},
      or if none is designated, the top level of the _Embed Target_.
   2. Decode and parse the value returned from
      [JSONPath](https://goessner.net/articles/JsonPath/) execution in
      accordance with the [Claim Format Designation](#claim-format-designations)
      specified in the object's `format` property. If the value parses and
      validates in accordance with the
      [Claim Format Designation](#claim-format-designations) specified, let the
      resulting object be the
      [_Current Traversal Object_](#current-traversal-object)
   3. If the `path_nested` property is present, process the _Nested Submission Traversal Object_
      value using the process described in Step 1.
2. If parsing of the _Submission Entry_ (and any _Nested Submission Traversal Objects_ present
    within it) produces a valid result, process it as the submission against the
   [[ref:Input Descriptor]] indicated by the `id` property of the containing
   _Input Descriptor Mapping Object_.

****Example Nested Submission****

```json
[[insert: ./test/v2.0.0/presentation-submission/nested_submission_example.json]]
```

### Limited Disclosure Submissions

For all [[ref:Claims]] submitted in relation to [[ref:Input Descriptor Objects]]
that include a `constraints` object with a `limit_disclosure` property set to
the string value `required`, ensure that the data submitted is limited to the
entries specified in the `fields` property of the `constraints` object. If the
`fields` property ****is not**** present, or contains zero _field objects_, the
submission ****SHOULD NOT**** include any data from the [[ref:Claim]]. For
example, a [[ref:Verifier]] may simply want to know whether a [[ref:Holder]] has
a valid, signed [[ref:Claim]] of a particular type, without disclosing any of
the data it contains.

### Validation of Claims

Once a [[ref:Claim]] has been ingested via a [[ref:Presentation Submission]],
any validation beyond the process of evaluation defined by the
[Input Evaluation](#input-evaluation) section is outside the scope of
Presentation Exchange. Verification of signatures and other cryptographic proofs
are a function of the given [[ref:Claim]] format, and should be evaluated in
accordance with the given [[ref:Claim]] format's standardized processing steps.
Additional verification of [[ref:Claim]] data or subsequent validation required
by a given [[ref:Verifier]] are left to the [[ref:Verifier]]'s systems, code and
business processes to define and execute.

During validation, each [[ref:Input Descriptor]] Object ****MUST**** only refer
to a single discrete container within a [[ref:Presentation Submission]], such
that all checks refer to properties within the same container and are protected
by the same digital signature, if the container format supports digital
signatures. Examples of discrete container formats include a single Verifiable
Credential within a Verifiable Presentation as defined in
[W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/), OpenID
Connect Tokens, and JSON Web Tokens. This is to ensure that related
requirements, for example, "given name" and "family name" within the same
_Input Descriptor Object_ also come from the same container.

### Embed Targets

The following section details where the _Presentation Submission_ is to be
embedded within a target data structure, as well as how to formulate the
[JSONPath](https://goessner.net/articles/JsonPath/) expressions to select the
[[ref:Claims]] within the target data structure.

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


## Features

### Submission Requirement Feature

The Submission Requirement Feature introduces extensions enabling
[[ref:Verifiers]] to express what combinations of inputs must be submitted to
comply with its requirements for proceeding in a flow (e.g. credential
issuance, allowing entry, accepting an application).

<tab-panels selected-index="0">

<nav>
  <button type="button">Single Group Example</button>
  <button type="button">Multi-Group Example</button>
</nav>


<section>

::: example Presentation Definition - Single Group Example
```json
[[insert: ./test/v2.0.0/presentation-definition/single_group_example.json]]
```
:::

</section>

<section>

::: example Presentation Definition - Multi-Group Example
```json
[[insert: ./test/v2.0.0/presentation-definition/multi_group_example.json]]
```
:::

</section>

</tab-panels>

#### Presentation Definition Extensions

The Submission Requirement [[ref:Feature]] extends the [[ref:Presentation Definition]]
object to add a `submission_requirements` property.

When using this [[ref:Feature]]:
- `submission_requirements` - The [[ref:Presentation Definition]] ****MAY****
  contain a `submission_requirements` property. If present, its value
  ****MUST**** be an object conforming to the [[ref:Submission Requirement]]
  format described in the [`Submission Requirement`](#submission-requirement)
  section below.

  The `submission_requirements` property defines which [[ref:Input Descriptors]]
  are required for submission, overriding the default input evaluation behavior,
  in which all [[ref:Input Descriptors]] are required.


#### Input Descriptor Extensions

<tab-panels selected-index="0">

<nav>
  <button type="button">Sample Descriptor</button>
  <button type="button">Descriptor for ID Tokens</button>
</nav>

<section>

::: example
```json
[[insert: ./test/v2.0.0/presentation-definition/input_descriptors_example.json]]
```
:::

</section>

<section>

::: example
```json
[[insert: ./test/v2.0.0/presentation-definition/input_descriptor_id_tokens_example.json]]
```

</section>

</tab-panels>

The Submission Requirement [[ref:Feature]] extends the [[ref:Input Descriptor Object]]
to add a `group` property.

When using this [[ref:Feature]]:

- The [[ref:Input Descriptor Object]] ****MAY**** contain a `group` property. If
  present, its value ****MUST**** match one of the grouping strings listed in
  the `from` values of a [[ref:Submission Requirement Rule]] object.

#### Submission Requirements

[[ref:Presentation Definitions]] ****MAY**** include
[[ref:Submission Requirements]] which define what combinations of inputs a
[[ref:Holder]] must submit to comply with the requirements of a
[[ref:Verifier]].

[[ref:Submission Requirements]] introduce a set of rule types and mapping
instructions a [[ref:Conformant Consumer]] can ingest to present requirement
optionality to the user, and subsequently submit inputs in a way that maps back
to the rules the [[ref:Verifier]] has asserted.

The following section defines the format for [[ref:Submission Requirements]]
and the selection syntax [[ref:Verifiers]] can use to specify which combinations
of inputs are acceptable.

If present, all [[ref:Submission Requirements]] ****MUST**** be satisfied, and
all `input_descriptors` ****MUST**** be grouped. Any unused
[ref:Input Descriptors]] that remain after satisfying all
[[ref:Submission Requirements]] ****MUST**** be ignored.

::: example Submission Requirement
```json
[[insert: ./test/v2.0.0/submission-requirements/example.json ]]
```
:::

##### Submission Requirement Objects

[[ref:Submission Requirement Objects]] are JSON objects constructed as follows:

- A [[ref:Submission Requirement Object]] ****MUST**** contain a `rule`
  property. The value of this property ****MUST**** be a string that matches one
  of the [[ref:Submission Requirement Rules]] values listed in the section
  below.
- A [[ref:Submission Requirement Object]] ****MUST**** contain either a
  `from` or `from_nested` property. If both properties are present, the
  implementation ***MUST*** produce an error. The values of the `from` and
  `from_nested` properties are defined as follows:
    - `from` - The value of the `from` property ****MUST**** be a `group` string
      matching one of the `group` strings specified for one or more
      [[ref:Input Descriptor Objects]].
    - `from_nested` - The value of the `from_nested` property ****MUST**** be an
      array [[ref:Submission Requirement Objects]].
- The [[ref:Submission Requirement Object]]  ****MAY**** contain a `name`
  property. If present, its value ****MUST**** be a string. The string
  ****MAY**** be used by a consuming User Agent to display the general name of
  the requirement set to a user.
- The [[ref:Submission Requirement Objects]] ****MAY**** contain a `purpose`
  property. If present, its value ****MUST**** be a string that describes the
  purpose for which the submission is being requested.
- The [[ref:Submission Requirement Objects]] ****MAY**** contain additional
  properties as required by certain [[ref:Submission Requirement Rules]]. For
  example, `count`, `min`, and `max` may be present with a `pick` rule.

##### Submission Requirement Rules

[[ref:Submission Requirement Rules]] are used within
[[ref:Submission Requirement Objects]] to describe the specific combinatorial
rules that must be applied to submit a particular subset of requested inputs. The
specified [[ref:Submission Requirement Rule]] determines the behavior of the
corresponding `from` or `from_nested` property, as described below. A conformant
implementation ****MUST**** support the following rules:

##### `all` rule

For an `all` rule [[ref:Submission Requirement Object]]:

- The value of the `rule` property ****MUST**** be the string "all".
- The following behavior is required for the `from` or `from_nested` property:
  - `from` - All [[ref:Input Descriptors]] matching the `group` string of the
    `from` value ****MUST**** be submitted to the [[ref:Verifier]].
  - `from_nested` - All [[ref:Submission Requirement Objects]] specified in the
    `from_nested` array must be satisfied by the inputs submitted to the
    [[ref:Verifier]].

::: example Submission Requirement, all, group
```json
[[insert: ./test/v2.0.0/submission-requirements/all_example.json]]
```
:::

##### `pick` rule

For a `pick` rule [[ref:Submission Requirement Object]]:

- The value of the `rule` property ****MUST**** be the string "pick".
- The [[ref:Submission Requirement Object]] ****MAY**** contain a `count`
  property. If present, its value ****MUST**** be an integer greater than zero.
  This indicates the number of [[ref:input Descriptors]] or
  [[ref:Submission Requirement Objects]] to be submitted.
- The [[ref:Submission Requirement Object]] ****MAY**** contain a `min`
  property. If present, its value ****MUST**** be an integer greater than or
  equal to zero. This indicates the minimum number of [[ref:input Descriptors]]
  or [[ref:Submission Requirement Objects]] to be submitted.
- The [[ref:Submission Requirement Object]] ****MAY**** contain a `max`
  property. If present, its value ****MUST**** be an integer greater than zero
  and, if also present, greater than the value of the `min` property. This
  indicates the maximum number of [[ref:input Descriptors]] or
  [[ref:Submission Requirement Objects]] to be submitted.
- The following behavior is required for the `from` or `from_nested` property:
    - `from` - The specified number of [[ref:Input Descriptors]] matching the
      `group` string of the `from` value ****MUST**** be submitted to the
      [[ref:Verifier]].
    - `from_nested` - The specified number of
      [[ref:Submission Requirement Objects]] in the `from_nested` array must be
      satisfied by the inputs submitted to the [[ref:Verifier]].

If [[ref:Submission Requirement Object]] has a `from` property, this directs the
[[ref:Conformant Consumer]] to submit inputs from the set of
[[ref:Input Descriptors]] with a matching `group` string. In the first example
that follows, the [[ref:Submission Requirement]] requests a single input from
[[ref:Input Descriptor]] group `"B"`. In the second example, the
[[ref:Submission Requirement]] requests from 2 to 4 inputs from
[[ref:Input Descriptor]] group `"B"`.

::: example Submission Requirement, pick, group
```json
[[insert: ./test/v2.0.0/submission-requirements/pick_1_example.json]]
```
:::

::: example Submission Requirement, pick, min/max
```json
[[insert: ./test/v2.0.0/submission-requirements/pick_2_example.json]]
```
:::

If the [[ref:Submission Requirement Object]] has a `from_nested` property, this
directs the [[ref:Conformant Consumer]] to submit inputs such that the number of
satisfied [[ref:Submission Requirement Objects]] matches the number requested.
In the following example, the `from_nested` property contains an array of
[[ref:Submission Requirement Objects]] which requests either all members
from group `"A"` or two members from group `"B"`:

::: example Submission Requirement, pick, nested
```json
[[insert: ./test/v2.0.0/submission-requirements/pick_3_example.json]]
```
:::

##### Property Values and Evaluation

The following property value and evaluation guidelines summarize many of the
processing-related rules above:
- The `rule` property value may be either `"all"` or `"pick"`, and a conformant
  implementation ****MUST**** produce an error if an unknown `rule` value is
  present.
- The [[ref:Submission Requirement Object]] ****MUST**** contain a `from`
   property or a `from_nested` property, not both. If present their values must
   be a string or an array, respectively. If any of these conditions are not
   met, a conformant implementation ****MUST**** produce an error.
- A conformant implementation could use the following algorithm To determine
  whether a [[ref:Submission Requirement]] is satisfied:
  - If the `rule` is `"all"`, then the [[ref:Submission Requirement]]
    ****MUST**** contain a `from` property or a `from_nested` property, and of
    whichever are present, all inputs from the `from` group string or the
    `from_nested` [[ref:Submission Requirements]] array ****MUST**** be
    submitted or satisfied, respectively.
  - If the `rule` is `"pick"`, then the [[ref:Submission Requirement]]
    ****MUST**** contain a `from` property or a `from_nested` property, and of
    whichever are present, they must be evaluated as follows:
    - if a `count` property is present, the number of inputs submitted, or
      nested [[ref:Submission Requirements]] satisfied, ****MUST**** be exactly
      equal to the value of `count` property.
    - if a `min` property is present, the number of inputs submitted, or
      nested [[ref:Submission Requirements]] satisfied, ****MUST**** be equal to
      or greater than the value of the `min` property.
    - if a `max` property is present, the number of inputs submitted, or
      nested [[ref:Submission Requirements]] satisfied, ****MUST**** be equal to
      or less than the value of the `max` property.


### Predicate Feature

The predicate [[ref:Feature]] introduces properties enabling [[ref:Verifier]]
to request that [[ref:Holder]] apply a predicate and return the result.

#### Applying a predicate

The predicate [[ref:Feature]] extends the [[ref:Input Descriptor Object]]
`constraints.fields` object to add a `predicate` property.

When using this [[ref:Feature]], the _fields object_ ****MAY**** contain a
[`predicate` property](#predicate-property). If the `predicate` property is
present, the `filter` property ****MUST**** also be present.

:::note The inclusion of the `predicate` property indicates that the
[[ref:Holder]] returns a boolean, rather than a value returned from evaluation
of the [JSONPath](https://goessner.net/articles/JsonPath/) string
expressions in the `path` array. The boolean returned is the result
of using the `filter` property's
[JSON Schema](https://json-schema.org/specification.html)
descriptors against the evaluated value. Exclusion of the `predicate`
property indicates that the [[ref:Conformant Consumer]] returns the value
returned from evaluation of the
[JSONPath](https://goessner.net/articles/JsonPath/) string
expressions in the `path` array.
:::

The value of `predicate` ****MUST**** be one of the following strings:
- `required` - This indicates that the returned value ****MUST****
  be the boolean result of applying the value of the `filter`
  property to the result of evaluating the `path` property.
  :::note Using a value of `required` for the `predicate` property
  may severely limit the responses a [[ref:Holder]] may be able to
  make. Many signature schemes do not support deriving predicates,
  even those signature schemes which are otherwise ZKP-capable. A
  [[ref:Verifier]] should be sure they support such schemes, and
  have high confidence they are also supported by the
  [[ref:Holder]], before indicating predicate responses are
  required.:::
- `preferred` - This indicates that the returned value
  ****SHOULD**** be the boolean result of applying the value of the
  `filter` property to the result of evaluating the `path` property.

If the `predicate` property is not present, a [[ref:Conformant Consumer]]
****MUST NOT**** return derived predicate values.

If the [`predicate` property](#predicate-filters) is present, the set of JSON Schema
descriptors which comprise the value of the `filter` property
****MUST**** be restricted according to the desired predicate
operation, as follows:
  - To express the following range proofs, use the JSON Schema
    [numeric range](https://json-schema.org/understanding-json-schema/reference/numeric.html#range)
    properties:
      - `greater-than` - Use the `exclusiveMinimum` descriptor. For
        example, to request a proof that an attribute is greater than
        10000, use the following as the value of the `filter` object:
        ```json
        {
          "type": "number",
          "exclusiveMinimum": 10000,
        }
        ```
      - `less-than` - Use the `exclusiveMaximum` descriptor. For
        example, to request a proof that an attribute is less than 85,
        use the following as the value of the `filter` object:
        ```json
        {
          "type": "number",
          "exclusiveMaximum": 85,
        }
        ```
      - `greater-than or equal-to` - Use the `minimum` descriptor. For
        example, to request a proof that an attribute is greater than or
        equal to 18, use the following as the value of the `filter`
        object:
        ```json
        {
          "type": "number",
          "minimum": 18,
        }
        ```
      - `less-than or equal-to` - Use the `maximum` descriptor. For
        example, to request a proof that an attribute is less than or
        equal to 65536, use the following as the value of the `filter`
        object:
        ```json
        {
          "type": "number",
          "maximum": 65536,
        }
        ```
  - to express the following equality proofs, use the JSON Schema
    `const` descriptor:
      - `equal-to` - Use the `const` descriptor. For example to
        request proof that an attribute has the value "Chad", use the
        following as the value of the `filter` object:
        ```json
        {
          "const": "Chad"
        }
        ```
      - `not equal-to` - Use the `const` descriptor with the `not`
        operator. For example, to request proof that an attribute does
        not have the value "Karen", use the following as the value of
        the `filter` object:
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
        rainbow colors, use the following as the value of the `filter`
        object:
        ```json
        {
          "type": "string",
          "enum": ["red", "yellow", "blue"]
        }
        ```
      - `not-in-set` - Use the `enum` descriptor with the `not`
        operator. For example, to request proof that an attribute is
        not contained in the set of primary colors, use the following
        as the value of the `filter` object:
        ```json
        {
          "not": {
            "enum": ["red", "yellow", "blue"]
          }
        }
        ```

At this time, additional predicate operations are not supported.


### Relational Constraint Feature

The Relational Constraint [[ref:Feature]] extends the [[ref:Input Descriptor Object]]
`constraints` object with additional properties.

When using this [[ref:Feature]]:
- The _constraints object_ ****MAY**** contain a `subject_is_issuer`
  property. If present, its value ****MUST**** be one of the following
  strings:
    - `required` - This indicates the [[ref:Conformant Consumer]]
      ****MUST**** submit a response that has been _self-attested_, i.e., the
      [[ref:Claim]] used in the presentation was 'issued' by the
      [[Ref:Subject]] of the [[ref:Claim]]. Consuming apps should be aware that 
      the requirements of the [[ref:Input Descriptor]] can be fulfilled via the 
      capture of user-entered data for _self-attested_ submission, and make an 
      effort to expose the means to do so when possible.
    - `preferred` - This indicates it is ****RECOMMENDED**** that the
      [[ref:Conformant Consumer]] submit a response that has been
      _self-attested_, i.e., the [[ref:Claim]] used in the presentation was
      'issued' by the [[Ref:Subject]] of the [[ref:Claim]]. When set to 
      `preferred`, this property can also act as a prompt for consuming apps 
      to initiate capture of user-entered data for _self-attested_ submission.
  :::note
  The `subject_is_issuer` property could be used by a [[ref:Verifier]] to
  require that certain inputs be _self_attested_. For example, a college
  application [[ref:Presentation Definition]] might contain an
  [[ref:Input Descriptor]] for an essay submission. In this case, the
  [[ref:Verifier]] would be able to require that the essay be provided by
  the same [[Ref:Subject]] as any other [[ref:Claims]] in the presented
  application.
  :::
  :::note
  The `subject_is_issuer` property can be used by [[ref:Verifiers]] as a way  
  enable the submission of user-entered data to fulfill the requirements of an 
  [[ref:Input Descriptor]]. Consuming apps ****should**** provide a means for 
  users to enter the data required by an [[ref:Input Descriptor]] that has its 
  `subject_is_issuer` property set to either `required` or `preferred`. An example 
  of this would be a user agent wallet app providing a form generated using the 
  JSON Schema `filter` objects present in the `fields` of an [[ref:Input Descriptor]] 
  that are subsequently packaged up in accordance with the structure the 
  [[ref:Input Descriptor]] defines for submission as _self-attested_ data.
  :::
- The _constraints object_ ****MAY**** contain an `is_holder` property. If
  present, its value ****MUST**** be an array of objects composed as
  follows:
    - The _is-holder object_ ****MUST**** contain a `field_id` property. The
      value of this property ****MUST**** be an array of strings, with each
      string matching the string value from a _field object_'s `id`
      property. This identifies the attribute whose [[Ref:Subject]] is of
      concern to the [[ref:Verifier]].
    - The _is-holder object_ ****MUST**** contain a `directive` property.
      The value of this property ****MUST****  be one of the following
      strings:
        - `required` - This indicates that the [[ref:Conformant Consumer]]
          ****MUST**** include proof that the [[ref:Subject]] of each
          attribute identified by a value in the `field_id` array is the
          same as the entity submitting the response.
        - `preferred` - This indicates that it is ****RECOMMENDED**** that
          the [[ref:Conformant Consumer]] include proof that the [[Ref:Subject]]
          of each attribute identified by a value in the `field_id` array is
          the same as the entity submitting the response.

  The `is_holder` property would be used by a [[ref:Verifier]] to require
  that certain inputs be provided by a certain [[Ref:Subject]]. For example,
  an identity verification [[ref:Presentation Definition]] might contain an
  [[ref:Input Descriptor]] for a birthdate from a birth certificate. Using
  `is_holder`, the [[ref:Verifier]] would be able to require that the
  [[ref:Holder]] of the birth certificate [[ref:Claim]] is the same as the
  [[Ref:Subject]] of the birthdate attribute. This is especially useful in
  cases where a [[ref:Claim]] may have multiple [[Ref:Subjects]].

  For more information about techniques used to prove binding to a
  [[ref:Holder]], please see [_Holder Binding_](#holder-binding).
- The _constraints object_ ****MAY**** contain a `same_subject` property. If
  present, its value ****MUST**** be an array of objects composed as
  follows:
    - The _same-subject object_ ****MUST**** contain a `field_id` property.
      The value of this property ****MUST**** be an array of strings, with
      each string matching the string value from a _field object_'s `id`
      property. This identifies the attributes whose [[Ref:Subject]] is of
      concern to the [[ref:Verifier]]. It is important to note that the
      attributes whose [[Ref:Subject]] is of concern to the [[ref:Verifier]]
      ****MAY**** be identified in the _field object_ of a different
      [[ref:Input Descriptor Object]].
    - The _same-subject object_ ****MUST**** contain a `directive` property.
      The value of this property ****MUST****  be one of the following
      strings:
        - `required` - This indicates that the [[ref:Conformant Consumer]]
          ****MUST**** include proof that the [[ref:Subject]] of each
          attribute identified by a value in the `field_id` array is the
          same as the [[ref:Subject]] of the attributes identified by the
          other values in the `field_id` array.
        - `preferred` - This indicates that it is ****RECOMMENDED**** that
          the [[ref:Conformant Consumer]] include proof that the [[Ref:Subject]]
          of each attribute identified by a value in the `field_id` array is
          the same as the [[Ref:Subject]] of the attributes identified by
          the other values in the `field_id` array.


  The `same_subject` property would be used by a [[ref:Verifier]] to require
  that certain provided inputs be about the same [[Ref:Subject]]. For
  example, a [[ref:Presentation Definition]] might contain an
  [[ref:Input Descriptor]] which calls for a street address from a driver
  license [[ref:Claim]] and another [[ref:Input Descriptor]] which calls
  for a name from a birth certificate [[ref:Claim]]. Using the
  `same_subject` property, [[ref:Verifier]] would be able to require that
  the [[Ref:Subject]] of the street address attribute [[ref:Claim]] is the
  same as the [[Ref:Subject]] of the name attribute.


### Credential Status Constraint Feature

- The _constraints object_ ****MAY**** contain a `statuses` property. If
present, its value ****MUST**** be an object that includes one or more of
the following status properties:
   - `active` - A credential is active if it is not revoked, expired,
     suspended, or in any type of deactivated state.
   - `suspended` - A credential is suspended if the Issuer has published an
     explicit signal that the credential is in an inactive state and
     ****should not**** currently be relied upon, but may become active
     again in the future.
   - `revoked` - A credential is revoked if the Issuer has published an
     explicit signal that the credential in question ****should not**** be
     relied upon going forward as an accurate reflection of the Issuer's
     statements about the [[Ref:Subject]] within the scope of the
     credential.

The values of all status properties are objects, composed as follows:
  - _status objects_ ****MUST**** include a `directive` property, and its
    value ****MUST**** be one of the following strings:
      - `required` - the credential ****MUST**** be of the specified
        status.
      - `allowed` - the credential ****MAY**** be of the specified status.
      - `disallowed` - the credential ****MUST NOT**** be of the specified
        status.
  - _status objects_ ****MAY**** include a `type` property, and its value
    ****SHOULD**** express one or more methods by which a credential's status is
    represented. The property is intended to align with the `type` field
    in the `credentialStatus` property in the [VC Data Model](https://www.w3.org/TR/vc-data-model/#status).

    ```json
      "statuses": {
        "active": {
          "directive": "required"  // other values: "allowed", "disallowed"
        },
        "suspended": {
          "directive": "allowed",
          "type": ["CredentialStatusList2017"]
        },
        "revoked": {...}
      }
    ```
  ::: note
  There is no assumed direct mapping between these values and a
  corresponding status object in the underlying credentials. On the
  contrary, the encoding and decoding of a credential status (which may
  include fetching remote status information or cryptographic operations) is
  an implementation detail which takes place at a lower layer of abstraction
  and in accordance with the supported verifiable credential formats and
  presentation protocols.
  :::


### JSON-LD Framing Feature

The JSON-LD Framing [[ref:Feature]] extends [[ref:Presentation Definition]] to support
extended with the JSON-LD document framing.

When using this [[ref:Feature]]:

- `frame` - The [[ref:Presentation Definition]] ****MAY**** contain a `frame`
  property. If present, its value ****MUST**** be a
  [JSON LD Framing Document](https://w3c.github.io/json-ld-framing/) object.

### Retention Feature

The Retention [[ref:Feature]] extends the [[ref:Input Descriptor Object]]'s _field_ 
object, allowing a Verifier to indicate it will retain the submitted value for the
specific field.  It is currently presented to support mDL systems, and may be deprecated in the
 future or moved to a separate specification for more robust mDL interoperability at a later time.

A [[ref:Conformant Consumer]] ****MUST NOT**** retain any data, including digests, signatures,
and derived data received, except for claims from the [[ref:Presentation Submission]] descriptors
for which the accompanying [[ref:Input Descriptor Object]]'s _field_ `intent_to_retain`
property was set to true.

Retain is defined as: “to store for a period longer than necessary to conduct the
exchange between [[ref:Holder]] and [[ref:Verifier]] in realtime”.

When using this [[ref:Feature]]:
- `intent_to_retain` - The _fields_ object inside an [[ref:Input Descriptor Object]] ****MAY****
 contain an `intent_to_retain` property.
 If present, its value ****MUST**** be a boolean that indicates the [[ref:Verifier]]
 intends to retain the [[ref:Claim]]'s data being requested.
  

## Input Evaluation

A conformant consumer of a [[ref:Presentation Definition]] must filter inputs they
hold (signed [[ref:Claims]], raw data, etc.) to determine whether they possess
the inputs requested by the [[ref:Verifier]]. A conformant consumer of a
[[ref:Presentation Definition]] ****MUST**** use the following process to
validate whether or not its candidate inputs meet the requirements it describes:

For each [[ref:Input Descriptor]] in the `input_descriptors` array of a
[[ref:Presentation Definition]], a conformant consumer compares each
candidate input (JWT, Verifiable Credential, etc.) it holds to determine whether
there is a match.

For each candidate input:
  1. If the `constraints` property of the [[ref:Input Descriptor]] is present,
     and it contains a `fields` property with one or more _fields objects_,
     evaluate each _fields object_ against the candidate input as described
     in the following subsequence.

     Accept the candidate input if every _fields object_ yields a _Field Query
     Result_; else, reject.
     1. For each [JSONPath](https://goessner.net/articles/JsonPath/) expression
        in the `path` array (incrementing from the 0-index), evaluate the
        JSONPath expression against the candidate input and repeat the
        following subsequence on the result.

        Repeat until a _Field Query Result_ is found, or the `path` array
        elements are exhausted:
        1. If the result returned no JSONPath match, skip to the next
          `path` array element.
        2. Else, evaluate the first JSONPath match (_candidate_) as follows:
           1. If the _fields object_ has no `filter`, or if _candidate_
              validates against the
              [JSON Schema](https://json-schema.org/specification.html)
              descriptor specified in `filter`, then:
              ::: note
              **Predicate Feature Only**

              If the _fields object_ has a `predicate`, set _Field Query Result_ to
              the boolean value resulting from evaluating the _Field Query Result_ against
              the [JSON Schema](https://json-schema.org/specification.html) descriptor value
              of the `filter` property.

              Else
              :::
              - set _Field Query Result_ to be _candidate_
           2. Else, skip to the next `path` array element.
        3. If no value is located for any of the specified `path` queries, and 
           the _fields object_ ****DOES NOT**** contain the `optional` property 
           or it is set to `false`, reject the field as invalid. If no value is 
           located  for any of the specified `path` queries and the _fields object_ 
           ****DOES**** contain the `optional` property set to the value `true`, 
           treat the field as valid and proceed to the next _fields object_.
  2. If all of the previous validation steps are successful mark the 
     candidate input as a match for use in a [[ref:Presentation Submission]].
      ::: note
      **Submission Requirement Feature Only**

      If present at the top level of the [[ref:Input Descriptor]], keep a
      relative reference to the `group` values the input is designated for.
      :::

 3. If the `constraints` property of the [[ref:Input Descriptor]] is present,
     and it contains a `limit_disclosure` property set to the string value
     `required`, ensure that any subsequent submission of data in relation to the
     candidate input is limited to the entries specified in the `fields`
     property. If the `fields` property ****is not**** present, or contains zero
     _field objects_, submission ****SHOULD NOT**** include any [[ref:Claim]]
     data from the [[ref:Claim]]. For example, a [[ref:Verifier]] may simply
     want to know a [[ref:Holder]] has a valid, signed [[ref:Claims]] of a
     particular type, without disclosing any of the data it contains.

 ::: note
 **Relational Constraint Feature Only**

  4. If the `constraints` property of the [[ref:Input Descriptor]] is present,
     and it contains a `subject_is_issuer` property set to the value `required`,
     ensure that any submission of data in relation to the candidate input is
     fulfilled using a _self_attested_ [[ref:Claim]].
  5. If the `constraints` property of the [[ref:Input Descriptor]] is present,
     and it contains an `is_holder` property, ensure that for each object in the
     array, any submission of data in relation to the candidate input is
     fulfilled by the [[Ref:Subject]] of the attributes so identified by the
     strings in the `field_id` array.
  6. If the `constraints` property of the [[ref:Input Descriptor]] is present,
     and it contains a `same_subject` property, ensure that for each object in
     the array, all of the attributes so identified by the strings in the
     `field_id` array are about the same [[Ref:Subject]].

 :::

### Expired and Revoked Data

Certain types of [[ref:Claims]] have concepts of _expiration_ and _revocation_.
_Expiration_ is mechanism used to communicate a time after which a [[ref:Claim]]
will no longer be valid. _Revocation_ is a mechanism used by an issuer to
express the status of a [[ref:Claim]] after issuance. Different [[ref:Claim]]
specifications handle these concepts in different ways.

[[ref:Presentation Definitions]] have a need to specify whether expired,
revoked, or [[ref:Claims]] of other statuses can be accepted. For [[ref:Claims]]
that have simple status properties,
[Input Descriptor Filters](#input-descriptor-objects) JSON Schema can be used to
specify acceptable criteria.

The first example below demonstrates _expiry_ using the [VC Data Model's
 `expirationDate` property](https://w3c.github.io/vc-data-model/#expiration-0).
The second example below demonstrates _revocation_, or more generally,
_credential status_ using the
[VC Data Model's `credentialStatus` property](https://w3c.github.io/vc-data-model/#status-0).
Using the syntax provided in the example, a [[ref:Verifier]] will have all
requisite information to resolve the status of a [[ref:Claim]].

<tab-panels selected-index="0">

<nav>
  <button type="button">Verifiable Credential Expiration</button>
  <button type="button">Verifiable Credential Revocation Status</button>
</nav>

<section>

::: example Drivers License Expiration
```json
[[insert: ./test/v2.0.0/presentation-definition/VC_expiration_example.json]]
```
:::

</section>

<section>

::: example Drivers License Revocation
```json
[[insert: ./test/v2.0.0/presentation-definition/VC_revocation_example.json]]
```
:::
</section>

</tab-panel>

### Holder and Subject Binding
[[ref:Claims]] often rely on proofs of [[ref:Holder]] or [[ref:Subject]] binding
for their validity. A [[ref:Verifier]] may wish to determine that a particular
[[ref:Claim]], or set of [[ref:Claims]] is bound to a particular [[ref:Holder]]
or [[ref:Subject]]. This can help the [[ref:Verifier]] to determine the
legitimacy of the presented proofs.

Some mechanisms which enable proof of [[ref:Holder]] binding are described
below. These include proof of identifier control, proof the [[ref:Holder]] knows
a secret value, and biometrics. An [[ref:Issuer]] can make proofs of
[[ref:Holder]] binding possible by including [[ref:Holder]] information either
in the [[ref:Claim]] or the [[ref:Claim]] signature.

Some examples of [[ref:Subject]] binding include matching the [[ref:Subject]] of
one [[ref:Claim]] with that of another, or matching the [[ref:Subject]] of a
[[ref:Claim]] with the [[ref:Holder]].

#### Proof of Identifier Control
A number of [[ref:Claim]] types include an identifier for the [[ref:Claim]]
[[Ref:Subject]]. A [[ref:Verifier]] may wish to ascertain that one of the
[[Ref:Subject]] identified in the [[ref:Claim]] is the one submitting the proof,
or has consented to the proof submission. A [[ref:Claim]] may also include an
identifier for the [[ref:Holder]], independent of the [[Ref:Subject]]
identifiers.

One mechanism for providing such proofs is the use of a [[ref:DID]] as the
identifier for the [[ref:Claim]] [[Ref:Subject]] or [[ref:Holder]]. DIDs enable
an entity to provide a cryptographic proof of control of the identifier, usually
through a demonstration that the [[ref:DID]] Controller knows some secret value,
such as a private key.

The [[ref:Holder]] or [[ref:Subject]] can demonstrate this proof of control when
the [[ref:Claim]] is presented. In addition to verifying the authenticity and
origin of the [[ref:Claim]] itself, a [[ref:Verifier]] can verify that the
[[ref:Holder]] or [[ref:Subject]] of the [[ref:Claim]] still controls the
identifier.

#### Link Secrets
Some [[ref:Claim]] signatures support the inclusion of [[ref:Holder]]-provided
secrets that become incorporated into the signature, but remain hidden from the
[[ref:Claim]] issuer. One common use of this capability is to bind the
[[ref:Claim]] to the [[ref:Holder]]. This is sometimes called a _link secret_.

Just as with proof of control of an identifier, link secret proofs demonstrate
that the [[ref:Holder]] knows some secret value. Upon presentation to a
[[ref:Verifier]], the [[ref:Holder]] demonstrates knowledge of the secret
without revealing it. The [[ref:Verifier]] can verify that the [[ref:Holder]]
knows the link secret, and that the link secret is contained in the
[[ref:Claim]] signature. The [[ref:Holder]] can provide this proof for each
presented [[ref:Claim]], thereby linking them together.

#### Biometrics
This type of [[ref:Holder]] binding, instead of relying on demonstrating
knowledge of some secret value, relies on the evaluation of biometric data.
There are a number of mechanisms for safely embedding biometric information in a
[[ref:Claim]] such that only a person who can confirm the biometric may present
the [[ref:Claim]].

## Claim Format Designations

Within the _Presentation Exchange_ specification, there are numerous sections
where [[ref:Verifiers]] and [[ref:Holders]] convey what [[ref:Claim]] format 
variants they can receive or are submitting. These formats are codified by
abbreviation tags which are defined in a separate 
[registry](https://identity.foundation/claim-format-registry/#registry) also 
hosted at the DIF, and maintained by the same authors as this specification. 
The registry includes JSON Schema documents, which are referenced in schemas
defined in this specification. To add abbreviations for a claim format supported
 by a working implementation, please follow 
 [these instructions](https://identity.foundation/claim-format-registry/#structure-of-the-registry)
and open a PR to open a pull request at the 
[registry repository](https://github.com/decentralized-identity/claim-format-registry/).  
This registry is not meant to be exhaustive nor 
restrictive; an implementation that supports additional claim formats can still
be considered fully conformant.

## JSON Schemas

### Vocabulary Definition

The _Presentation Exchange_ specification adopts and defines the following JSON
Schema data format and processing variant, which implementers ****MUST****
support for evaluation of the portions of the _Presentation Exchange_
specification that call for JSON Schema validation:
https://tools.ietf.org/html/draft-handrews-json-schema-02

### Presentation Definition (in an envelope)

```json
[[insert: ./schemas/v2.0.0/presentation-definition-envelope.json]]
```

### Presentation Definition (plain object)

```json
[[insert: ./schemas/v2.0.0/presentation-definition.json]]
```

### Input Descriptor

```json
[[insert: ./schemas/v2.0.0/input-descriptor.json]]
```

### Presentation Submission

```json
[[insert: ./schemas/v2.0.0/presentation-submission.json]]
```

### Submission Requirement

```json
[[insert: ./schemas/v2.0.0/submission-requirement.json]]
```

### Submission Requirements

```json
[[insert: ./schemas/v2.0.0/submission-requirements.json]]
```

### Format Declaration

Defined in the [Claim Format Registry](https://identity.foundation/claim-format-registry/#schemas)

## JSONPath Syntax Definition

The _Presentation Exchange_ specification adopts and defines the following
syntax from the JSONPath object query language, which implementers ****MUST****
support for evaluation of the portions of the _Presentation Exchange_
specification that call for JSONPath expression execution.

JSONPath              | Description
----------------------|------------
`$`                   | The root object/element
`@`                   | The current object/element
`.`                   | Child member operator
`..`	                | Recursive descendant operator; JSONPath borrows this syntax from E4X
`*`	                  | Wildcard matching all objects/elements regardless their names
`[]`	                | Subscript operator
`[,]`	                | Union operator for alternate names or array indices as a set
`[start:end:step]`    | Array slice operator borrowed from ES4 / Python
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
`$.store.book[*].author`      | The authors of all books in the store
`$..author`                   | All authors
`$.store.*`                   | All things in store, which are some books and a red bicycle
`$.store..price`              | The price of everything in the store
`$..book[2]`                  | The third book
`$..book[(@.length-1)]`       | The last book via script subscript
`$..book[-1:]`                | The last book via slice
`$..book[0,1]`                | The first two books via subscript union
`$..book[:2]`                 | The first two books via subscript array slice
`$..book[?(@.isbn)]`          | Filter all books with isbn number
`$..book[?(@.price<10)]`      | Filter all books cheaper than 10
`$..book[?(@.price==8.95)]`   | Filter all books that cost 8.95
`$..book[?(@.price<30 && @.category=="fiction")]`        | Filter all fiction books cheaper than 30
`$..*`                        | All members of JSON structure

## Normative References

[[def: OIDC]]
~ [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html). Jones, M., Bradley, J., and N. Sakimura. Status: Approved Specification

[[def: Linked Data Proof, Linked Data Proofs]]
~ [Data Integrity 1.0](https://w3c-ccg.github.io/data-integrity-spec/). Dave Longley, Manu Sporny. 2022-03. Status: Draft Community Group Report.

[[spec]]

## Informative References

[[def: CHAPI, Credential Handler API]]
~ [W3C Credential Handler API 1.0](https://w3c-ccg.github.io/credential-handler-api/). Dave Longley, Manu Sporny. 2020-2-19. Status: Draft Community Group Report.

[[def: DIDComm]]
~ [DIF DIDComm Messaging](https://github.com/decentralized-identity/didcomm-messaging). Daniel Hardman, Sam Curren. Status: Working Group Draft.

## Appendix

### What is new
The summary and details below highlight the differences between V1 and V2 of this specification. 

Summary of changes:
- Introduction of [[ref:Features]].
- Introduction of [Status Constraint](#Status-Constraint-Feature).
- Introduction of [Retention](#Retention-Feature).
- Introduction of [JSON-LD Framing](#JSON--LD-Framing-Feature).
- Introduction of an `optional` property for the _fields object_.
- Removal of `schema` property from [[ref:Input Descriptor Objects]].
- Input Descriptor `format` was moved to an external registry and can be restrained.
- Input Descriptor `constraint` property has been made mandatory.
- More concise language for consumers and producers.

#### Features
[[ref:Features]] enable [[ref:Verifiers]] to express, and [[ref:Holders]] to support,
extended functionality (relative to the base objects) by defining one or more
properties on one or more objects. Features themselves are optional, but they can express mandatory properties and objects. 
The spec has been rearranged and several [[ref:Features]] are introduced like for instance the [Predicate](#Predicate-Feature), [Relational Constraint](#Relational-Constraint-Feature), [Credential Status Constraint](#Credential-Status-Constraint-Feature)
In the previous versions most of these [[ref:Features]] were part of the spec that any [[ref:Conformant Producer]] or [[ref:Conformant Consumer]] had to implement.

#### Status Constraint Feature
The [Status Constraint Feature](#Status-Constraint-Feature) allows to put active, revoked or expired constraint on the statuses of [[ref:Verifiable Credentials]]. The `type` property allows _status objects_ to express which credential status types from the [VC Data Model](https://www.w3.org/TR/vc-data-model/#status) are supported.

#### Retention Feature
The [Retention feature](#Retention-Feature) indicates whether the Verifier intents to retain the Claim's data being requested.

#### JSON-LD Framing Feature
The [[ref:Presentation Definition]] now may contain a `frame` property which must be a [JSON LD Framing Document](https://w3c.github.io/json-ld-framing/) object to allow for selective disclosure using frames.

#### Introduction of an optional property for the fields object
The _fields object_ of an [[ref:Input Descriptor Object]] may now contain an `optional` property, indicating optionality of the field.

#### Removal of schema property from Input Descriptor Objects
Previously an [[ref:Input Descriptor Object]] had a `schema` property that contained an array of URIs for [[ref:Claim]] schema's. It introduced ambiguity and was the source of confusion. It has been replaced with a `fields` property in the _constraints object_ of the [[ref:Input Descriptor Object]], allowing for a more expressive approach to restrict to certain types for instance.
As a result, the support for hashlinks has also been removed from the specification, as these could be used as URIs in the `schema` property previously.

#### Input Descriptor Format was moved to an external registry and can be restrained
Previously the [[ref:Verifiable Credential]] and [[ref:Verifiable Presentation]] formats, like `jwt`, `jwt_vp`, `ldp_vc` were listed in the specification. They have been moved to an external [registry](https://identity.foundation/claim-format-registry/schemas/presentation-definition-claim-format-designations.json) to allow for future extension without the need to update the specification. See [Claim Format Designations](#Claim-Format-Designations) for more information.
Also the [[ref:Input Descriptor Object]] now may contain a `format` property, next to the toplevel `format` property, to constrain a submission of a single object to a subset of formats.

#### The Input Descriptor constraint property has been made mandatory
The [[ref:Input Descriptor Object]] now must contain a `constraints` property, where it was optional before. Given other optional fields, omission of the `constraints` property could potentially lead to an [[ref:Input Descriptor Object]] that didn't express anything actionable anymore. 

#### More concise language for consumers and producers
Language around consumers and producers of [[def:Presentation Definition]] and [[def:Presentation Submission]] objects has been made more concise to prevent confusion. 

#### `name` and `description` properties added to the spec.
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
[[insert: ./test/v2.0.0/presentation-submission/appendix_VP_example.json]]
```
:::

</section>

<section>

::: example Presentation Submission with OIDC JWT
```json
[[insert: ./test/v2.0.0/presentation-submission/appendix_OIDC_example.json]]
```
:::

</section>

<section>

::: example Presentation Submission using CHAPI
```json
[[insert: ./test/v2.0.0/presentation-submission/appendix_CHAPI_example.json]]
```

</section>

<section>

::: example Presentation Submission using DIDComm
```json
[[insert: ./test/v2.0.0/presentation-submission/appendix_DIDComm_example.json]]
```
:::

</section>

</tab-panels>

### Developer Resources

#### JSONPath implementations

- **Node.js**
    - https://www.npmjs.com/package/jsonpath
    - https://www.npmjs.com/package/jsonpath-plus (Ships its own TS types and have newer updates)
- **Java**
    - https://github.com/json-path/JsonPath
- **Kotlin**
    - https://github.com/codeniko/JsonPathKt
- **Python**
    - https://github.com/kennknowles/python-jsonpath-rw
- **Go**
    - https://github.com/PaesslerAG/jsonpath

#### JSON Schema implementations

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

### IANA Considerations

#### JSON Web Token Claims Registration

This specification registers the [[ref:Claims]] in section [Registry Contents]()
in the IANA JSON Web Token [[ref:Claims]] registry defined in
[RFC 751 JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519).

##### Registry Contents

Presentation Definition | Values
------------------------|------------
Claim Name: | `presentation_definition`
Claim Description: | Presentation Definition
Change Controller: | DIF Claims & Credentials - Working Group - https://github.com/decentralized-identity/claims-credentials/blob/main/CODEOWNERS
Specification Document(s): | Section 5 of this document


Presentation Submission | Values
------------------------|------------
Claim Name: | `presentation_submission`
Claim Description: | Presentation Submission
Change Controller: | DIF Claims & Credentials - Working Group - https://github.com/decentralized-identity/claims-credentials/blob/main/CODEOWNERS
Specification Document(s): | Section 6 of this document
