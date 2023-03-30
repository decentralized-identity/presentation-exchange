# Presentation Exchange / Credential Manifest joint calls

[![hackmd-github-sync-badge](https://hackmd.io/vHd4V7KnQtSDyUeGdeF7wQ/badge)](https://hackmd.io/vHd4V7KnQtSDyUeGdeF7wQ)

(DIF Claims and Credentials WG)

## Code Owners

PE Editors

- Daniel Buchner (Microsoft)
- Brent Zundel (Evernym)
- Martin Riedel (Consensys Mesh)
- Kim Hamilton Duffy (Centre Consortium)

CM Editors

- Daniel Buchner (Microsoft)
- Brent Zundel (Evernym)
- Jace Hensley (Bloom)
- Daniel McGrogan (Workday)

## Useful links

- [PE](https://identity.foundation/presentation-exchange/) & [CM](https://identity.foundation/credential-manifest/)

## March 30, 2023

Today's Presentation Exchange attendance was a bit low, presumably for end-of-quarter deadlines or what have you, so Kim and I seized the opportunity to have a 45min nerdfest on the subject of CONFORMANCE TESTING possibilities for PresEx and CredMan.  I started a spreadsheet of normative statements that can serve as a scaffold for comprehensive conformance testing (which I'm volunteering to scaffold but not DO, haha); in some future iteration of that spreadsheet, I can make it a massive markdown table and check it into the /test/ folder for each spec's repo, methinks, alongside test vectors so that implementers (or, better yet, **profilers and implementation guide authors**) will have some groundwork already done :muscle:

spreadsheet is [here](https://docs.google.com/spreadsheets/d/1h5RVm4dRpJS6576jrK9mD2t4GDP_Z3xNsPXAdSd9wAc/edit#gid=0) and the recording is [here](https://us02web.zoom.us/rec/share/SAFC6azRFfRPzDWekQ3sD1oAstGw3-Vr636I3tSZEJsF-rmTdfepp8nKtQAyApuI.fLktruCJMUzKoJXS). sadly no notes were taken but we added to an issue and compared some of our favorite examples of different kinds of conformance tests:
- that [TLS test](https://www.ssllabs.com/ssltest/analyze.html?d=google.com&s=172.217.14.110&latest) that people use for checking minutae about TLS handshake variants
- the [VC-API report card](https://w3c-ccg.github.io/vc-api-verifier-test-suite/#conformance) from W3C-CCG
- the [parser-tester](https://github.com/nst/JSONTestSuite) that tests how well different libraries implement the core JSON RFC (8259)
    + this last one might be useful for more advanced/exacting conformance testing down the road!

## March 2023

Sorry, not many notes were taken but we triaged some issues, including some implementer feedback that will inform an implementer's guide and more detailed/real-world test vectors we'll be working on in Q2!

## Feb 9, 2023

- Decision: Moving meetings to bi-weekly
- PEv2:
  - Ratification done by March.
  - Ping @Kim about the blog post
- CM
  - Juan's editor comments merged.
- WR
  - to ping @Juan around helping with https://github.com/decentralized-identity/wallet-rendering/issues/26
  - @Theirry: https://github.com/decentralized-identity/wallet-rendering/issues/27
  - @Andor: https://github.com/decentralized-identity/wallet-rendering/issues/28
  - Review: https://github.com/decentralized-identity/wallet-rendering/issues/9
  - Defer https://github.com/decentralized-identity/wallet-rendering/milestone/2

## January 19, 2023

- Presentation Exchange
  - New issues:
    - JSONPath security issues (two issues) - invite the guy to speak 2 or 3 weeks from now if he's a DIF member?
    - Kristina's issue about "all matching creds" - consensus seems to be "out of scope at this layer" but further discussion (or examples to point to of specs at higher levels) both appreciated - leaving open
- Cred Man - no news because Juan never finished his draft PR :disappointed:
- Wallet Rendering
  - issue#29 - big overhaul?
    - pros - works with JSON Forms, inherits some mental models and capabilities;
      - counterweighs constraints of WR as-is
      - not a lot of wallet providers committed to this; doesn't break that many implementations if it works for all of us!
    - cons - "cognitive overhead"
      - Thierry: seems a big lift, partic in short term!
      - Andor: commits us to good tooling in short term, doesn't work without good shared tooling
    - kim: pendulum of "we need a language" and "no let's just hardcode this special case" -
    - juan: where is TBD in all this? andor: they're aware and we've had discussions on it, this came out of TBD coordination. Still want to discuss with more of TBD audience and there's no consensus yet, but it's been brought up with them and came out of efforts alongside them.
  - [#6](https://github.com/decentralized-identity/wallet-rendering/issues/6)
    - display<>underlying value is complicated by sharing underlying values with third-parties-- easier to share VC values across parties if each can DISPLAY DIFFERENTLY the values per context
      - interaction with issue #29?
        - Andor: I'd have to check how JSON Forms handles conditional logic
      - thierry: possible use-case for this layering: conditions based on device? e.g. size of monitor, desktop/mobile, etc? HTML/CSS have one way of tackling this already...
      - prior art for degree of human-readability of data in VCs?
        - Kim: ZK-friendly folks tend towards less human-readable, optimizing for transformation (and selective disclosure); others tend towards where tooling is at today and requiring minimal transformations to display
        - Kim: Use-cases also crosscut this-- education usecases tend towards human-readability (ed creds cottage industry has historically leaned on human readability for fail-over interop & portability); KYC/Verite use cases --> crisp, simple business logic, no PII --> no human readibility needed
        - Juan: I'm renaming issue#26 cuz diff strokes for diff VCs
      - does the VC issuer want this much constraining power?
        - kim: edu use cases - lots of humans in the loop, more worried about human error and misinterpretation than tampering of the data...
        - balance of power between issuer (constraining power) and users (wallet accountability to users?)

## January 12, 2023

### CM

- @bumblefudge finished the editorial review! to evaluate next week.

### PE

- Nagging about blog post

### Wallet Rendering

Thierry (Talao) joined to inform the WR spec.

- Align with the presentation (Display Attribute) in SIOPv2
- Question: Why split from CM?
  - Answer: Split out separation of concern
- 2 Wallets: Used for both wallets.
- Needed a category attribute. Some credential clustering required.
- User friendly wallet a required. At the moment, not sufficient renders.
- Juan:
  - web3 industry favors thin layers. VC handled by storage dApp.
  - https://chainagnostic.org/CAIPs/caip-169 : mentions CM and PE.
- Daniel:
  - Juan's reference point provides useful vision for a multi-purpose wallet render.

Discussed:

https://github.com/decentralized-identity/wallet-rendering/issues/27

## January 5, 2023

### PEv2

- Lead by @Daniel McGrogan
- Split out
  [395](https://github.com/decentralized-identity/presentation-exchange/issues/395)
  into multiple tasks b/c it's so meaty. Higher priority.
  - test vectors the suite will tests
  - harness for mechanisms for the suite
  - client template to be update to suite
- Roadmap will be a good idea and help bring new people up to speed faster.
- To check in with @kim about the blog post.
- 364

### CM

- [ ] Juan to review next week the CM and pass through.

### WR : discuss more next week

- Thierry : starting to get involved with WR
- Andor: Worried that issue #4 will break things.
- Juan: This is a different type of spec to adoption
  - Is this reinventing wheel of style guides
  - This spec was supposed to be intended for the startup.
- Discussed: Cutting to v1 sooner, and but starting work on v2, which is a
  blowing up change.
- [ ] Continue this next week
