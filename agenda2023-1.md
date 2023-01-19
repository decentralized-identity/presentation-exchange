# Presentation Exchange / Credential Manifest joint calls

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

## January 12, 2023

### CM

- @bumblefudge finished the editorial review! to evaluate next week. 

### PE
- Nagging about blog post

### Wallet Rendering

Thierry (Talao) joined to inform the WR spec.
* Align with the presentation (Display Attribute) in SIOPv2 
* Question: Why split from CM?
  * Answer: Split out separation of concern 
* 2 Wallets: Used for both wallets. 
* Needed a category attribute. Some credential clustering required. 
* User friendly wallet a required. At the moment, not sufficient renders. 
* Juan: 
  * web3 industry favors thin layers. VC handled by storage dApp. 
  * https://chainagnostic.org/CAIPs/caip-169 : mentions CM and PE. 
* Daniel:
  * Juan's reference point provides useful vision for a multi-purpose wallet render. 

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
