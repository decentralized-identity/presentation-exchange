# Presentation Exchange / Credential Manifest joint calls

[![hackmd-github-sync-badge](https://hackmd.io/mA8G4iRsT4OkWC4cs8SMhg/badge)](https://hackmd.io/mA8G4iRsT4OkWC4cs8SMhg)

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