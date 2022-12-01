# Presentation Exchange / Credential Manifest joint calls

[![hackmd-github-sync-badge](https://hackmd.io/mA8G4iRsT4OkWC4cs8SMhg/badge)](https://hackmd.io/mA8G4iRsT4OkWC4cs8SMhg)

**Note: if this document looks out of date on github, click the hackmd badge above to see the current non-archival draft in hackmd.**

(DIF Claims and Credentials WG)

## Code Owners

PE Editors
- Daniel Buchner (Microsoft)
- Brent Zundel (Avast)
- Martin Riedel (Consensys Mesh)
- Kim Hamilton Duffy (Centre Consortium)

CM Editors
- Daniel Buchner (Microsoft)
- Brent Zundel (Evernym)
- Jace Hensley (Bloom)
- Daniel McGrogan (Workday)

## Useful links

- [PE](https://identity.foundation/presentation-exchange/) & [CM](https://identity.foundation/credential-manifest/)

## Roadmapping Q1 2023 and beyond

## 8 Dec 2022
- Agenda:
    - Roadmapping discussion (populate the above!)
    - Credential Manifest PRs and Issues
    - Wallet Rendering - any progress?
    - PresEx - Anything new?

## 1 Dec 2022 

- Rejuvenating the Common Agenda of PresEx and Friends (you are here) 
    - Andor: Feedback/documentation requested here: [PR#380](https://github.com/decentralized-identity/presentation-exchange/issues/380)

### CredMan
- [Kim's editorial PR to set up context](https://github.com/decentralized-identity/credential-manifest/pull/135)
    - editorial change-requests welcome, hard to word long sentences.
    - Brent: "consumer" seems off - I think agent is confused in that section
    - Gabe: I left a comment on "processing" rather than "constructing" - might be part of same confusion
    - Next steps: People will leave change-requests, Kim will update/refine for merge at next meeting
- [Issue #132](https://github.com/decentralized-identity/credential-manifest/issue/132)
    - Brent: Urgent for v1? I say yes... (tagged)
- [Issue #133](https://github.com/decentralized-identity/credential-manifest/issues/133)
    - lots of discussion in thread - seems multi-stage process is a major scoping question (maybe vNext, tho?)
    - Brent: V1? Do we need an implementation guide for v1?
- [Issue #123](https://github.com/decentralized-identity/credential-manifest/issues/123)
    - danielB - i swear I did this already-- maybe never pushed?
- [Issue #125](https://github.com/decentralized-identity/credential-manifest/issues/125)
- [Issue #132](https://github.com/decentralized-identity/credential-manifest/issues/132)
    - Gabe --> Neal can handle this one - assigned!
- V1 ready soon? 
    - editorial pass issue assigned to Juan

### Wallet Rendering
- [Issue #26](https://github.com/decentralized-identity/wallet-rendering/issues/26)
    - ongoing
    - Andor: Relevant to OWF? 
- Andor: Some issues assigned to me -- timeline in sight?
    - Brent: Not urgent but WR will be priority #1 after CM v1 (since it depends on WR optionally in one section), so appreciated if soonish

### v2 Blog Post
- Kim already wrote a detailed outline - any objections or send to 

### PresEx
- Dependabot PRs
- Timeline questions
    - Andor: I'd like a v3 timeline/goals issue - does v3 have concrete goals? do we need an implementation guide first? etc
        - Brent: I'm happy to let PresEx sit while we gather goals and feature requests
        - Daniel, Gabe: Don't start v3 the day after v2 is shipped; I wanna focus on adoption


## 28 April 2022 - CANCELLED FOR IIW

##  21 April 2022 

- Jan from Data Agreements will join to discuss [PE#307](https://github.com/decentralized-identity/presentation-exchange/issues/307)
- internationalization

##  14 April 2022 

- Happy Easter, all who observe!
- PR309 discussion
    - Daniel took action-item to do editorial pass clarifying some assumptions around PS object and where it could be generated if not passed (and at what risk/footguns)
- PresEx v2 - when to call it?
    - immediately after IIW to give one last chance for feedback
- Wallet-Rendering
- Major design questions
    - /.well-known/
        - DW: How OIDC thinks about bootstrap situation where holder comes to verifier clueless; how to give "hints" of what's needed? (i.e. CM equivalent)
        - DW: I'm not sure there can be a 1:1 equivalence, I think OIDC flows won't map neatly to CM in my view, although our thinking on this is early
    - Daniel: how do we signal to wallets some assumptions about accepted issuers, registries, filtering, beyond just schemas and crypto? 
        - Daniel: how do they know where to go for the credentials they'll need?
        - Kim: [3 Vs](https://github.com/w3c-ccg/vc-api/blob/main/verification.md)
        - DW: OIDFederation spec: intermediate and/or root authority vouching for another's data (-->directed graph towards 1 or more authorities), i.e. "i'll trust anyone licensed by my accredition board OR EUROPE'S"
        - DW: Example of student credentials-- you can tell them where to go, but sometimes the answer is "it's a hard road"
        - DW: 1-to-many ratio of issuers to verifiers - hopefully issuers that verifiers point to are familiar, not totally out of left field
            - daniel: sure, for govt strong credential use-cases, but i'm thinking of a wide range of usecases including ones where there are thousands of issuers...
    - Daniel: I think going deeper in this (in a cross-community way )

##  7 April 2022 

- CCG VC-API implementers polled, none implementing PresEx, all implementing 
    - [VC-API issue about PresEx within VPR](https://github.com/w3c-ccg/vc-api/issues/174#issuecomment-1089314082)
- reports from OIDC/ABConnect group
    - credential manifest rejected in leiu of something simpler
        - issuer-suggested display properties was, in particular, unpopular (but that was pulled out?)
        - Jace: id and schema are only required properties!

## 17 Feb

PresEx
- PRs: nothing major to discuss on PE side
    - Kristina's PR about decoupling seems overtaken by events; closed but invited her to re-open a new PR after some discussion
    - David's profile PR overtaken by Kim's massive reorg PR
- PE#280: filter by `schema` not working (hard to debug without Torsten on the call; requested an example monorepo in-thread for a future call)
- CM#68: blocked by cutting stable version (straw man? starting point?) for WR; assigned to Jace
- WR#7: deep dive on JSON-Schema typing images versus images as subset of URI-formatted (-prefixed?) blobs; biblio left in the issue, next steps deferred until after WR 

## 10 Feb

??

## 3 Feb 

?? 

## 27 January


- Discuss [Kim's PR](https://github.com/decentralized-identity/presentation-exchange/pull/287)
    - DavidC: how does a RP tag a feature as critical?
        - Daniel: How can a wallet know what it doesn't know?
        - DavidC: a wallet just needs to parse a "critical" flag in/on a features/discovery object (at least, by analogy to x509 )
        - Daniel: I see this through the CSS versioning/upgrade-path analogy;
        - DavidC: wallet gives all requirements, possibly more; is there a corner case where RP really can't receive extra?
            - Jace: But RP has to check what they get anyways, in case of bad-actor or bad wallet!
            - medical record use-case; limit-disclosure might be CRITICAL for medical use-cases
        - DavidC: maybe leave open a tracking issue for now, because the general direction seems to work i just want to return to critical-features at a later date
    - Daniel: What if `limit_disclosure` isn't moved to an optional feature? what if it stays in the main profile with additional non-normative language around "required" flag?
        - DavidC: If required is a MUST, then a conformant wallet wouldn't return too much, it would return nothing (except maybe without user confirmation?)


- Jace - wallet rendering spec breakout to new time?
    - Daniel: what about going back to 50/50
    - Kristina: +1 to 50/50
    - Juan: Overflow/"topic call" format for both halves of the call? I'll send out a poll
    - 

## 20 Jan

oops, dog ate our homework

## 13 January

- Wallet Rendering:
    - https://github.com/decentralized-identity/wallet-rendering/issues/4
        - We also need to support more display types, like a base64 jpeg in the VC or a PDF stored in the VC
    - https://github.com/decentralized-identity/wallet-rendering/issues/5
    - https://github.com/decentralized-identity/wallet-rendering/issues/6
        - ETL (extract, transform, load) style eval maybe
- going through open PRs
    - [hackmd agenda link](https://github.com/decentralized-identity/presentation-exchange/pull/282) - small suggestion
    - [add format to input_descriprot](https://github.com/decentralized-identity/presentation-exchange/pull/279) - merging
    - [fix json schema](https://github.com/decentralized-identity/presentation-exchange/pull/200) - closing / stale
    - [profile](https://github.com/decentralized-identity/presentation-exchange/pull/275) - discussion below
- Profile:
    - ability to mark layers as "critical" as the requester, the requester can say you may have to support X but you have to support Y. If the wallet doesn't understand the layer marked critical then it sends nothing back
    - discussed the [layering](https://github.com/decentralized-identity/presentation-exchange/issues/283) of features
    - 

## 06 January

Agenda:
- discussing this profile [PR](https://github.com/decentralized-identity/presentation-exchange/pull/275)
    - input_descriptor MAY or MUST NOT include "format" property?
        - OIDC doesn't care about the "format" because that's handled by the protocol
        - There may be people who want to use this simple profile but also wants the format (because they aren't using OIDC)
        - If the profile is about "Credentials" (not VCs) "format" doesn't matter because the "Credential" format is agnostic of it's proof format (jwt vs LD)
    - Do we want layers to help mitigate against fragmentation?
        - What would this look like?
        - Base layers with things added on top
- talked about how the wallet displays credential data to the user with CM 
- [Layering Issue](https://github.com/decentralized-identity/presentation-exchange/issues/283)
    - constraints: field is the only one that's specific to a single Input Descriptor but the others spaned across multiple
    - submission_requiremnts: not needed in base layer?
        - Will take up a tiny minority at the start but as time goes on will start being more important
        - Discussing how to add layers, should you be able to add fields to nested/already existing objects in a new layer
        - The web (css and html) handle layers / living specs gracefully without failing/crashing (ex: when transition was added to css)
        - 

## 16 December

Agenda:
- profiles - how many will there be?
    - David: SIOP <> [my proposed profile](https://github.com/decentralized-identity/presentation-exchange/discussions/269)
        - issuer = subject a valid constraint?
        - backstory: OIDC4VP currently mandates full PE, while Niels and I have been trying to find a subset profile that would be enough for OIDC4VP, at least in v1.0
    - "weakly-implementable properties" = phrase of the year
- not a true spec for jsonpath
    - https://github.com/decentralized-identity/presentation-exchange/issues/278
    - we hate this and we'll come back to it

## 9 December

?

## 2 December 

Agenda:
- [David's Minimalist Profile in the Discussions](https://github.com/decentralized-identity/presentation-exchange/discussions/269)

## 25 November - TurkeyDay Holiday

## 18 November - More PE, less CM
- David Chadwick- Presentation Exchange and VC data model issues
    - ambiguity around iss/issuer and other cross-representation redundancies - "Orie does both, I do only one"
    - see VC issue [#832](https://github.com/w3c/vc-data-model/issues/832)
- 230 and other outstanding PRs for v2
    - mostly Daniel B
- David Chadwick - limited profile should live where? upload?
    - Jace: GH [Discussions](https://github.com/decentralized-identity/presentation-exchange/discussions
) probably best
    - Brent: TSC is currently discussing profiles, so how this work item relates to a profile is a little TBD-- let's discuss in Discussions in the meantime (and remind us to address in future PE/CM calls!)