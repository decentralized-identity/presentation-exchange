# Addendum to C&C WG Work Item: Credential Presentation

[NON-NORMATIVE/NON-BINDING] Guidelines for Repository Process

# Working Group Repository Process

The Decentralized Identity Foundation (DIF) provides guidelines for Repository
Process that each Working Group can "fork," fine-tune, and ratify during their 
meetings. The process is designed to simplify and consolidate GitHub status 
tracking of work items managed by the Working Group. 

## Repository Process

### Repository Maintainer 
Maintainers are expected to handle the repository management as described in the
Repository Process (below).

### Repository Maintainer selection
Maintainers must be Working Group Participants selected by Working Group 
Participants via consensus. At least 3 maintainers must be to be active at any 
given time operating the Repository Process for the Working Group. Maintainers 
*MUST* have different organizational affiliations to represent the diversity of 
the Working Group (i.e., no two maintainers should work for the same company, 
organization, or project).

### Specification Formatting Requirements

* 80-char fixed-width columns (aka "hard wraps") required by this specification.

### Repository process

The Repository process is an extension of the *Deliverable Development
Process – Draft* section detailed in DIF’s Charter. The goal of this process
is to introduce a repository management processes for the work section
developed by the Working Group. 

Following the *Pre-Draft* proposal submission stage described in DIF’s Charter,
the Draft Development Process goes through a three-state lightweight lifecycle 
tracked on GitHub by the Maintainers to signal the current status of each 
section.

The three stages of the lifecycle are: 
* PROPOSED
* REFINING
* STABLE

The status of a section is given in a one-line statement `status: PROPOSED` on
GitHub. A section moves from one status to the next **when a PR is merged that
changes this statement.**

#### Merging section content in the PROPOSED state: 
Maintainers should accept it as long as it is syntactically clean and passes a 
smell test for compatibility with the scope and intent of the Working Group’s 
scope. Changes that aren’t **substantive** (improved wording, clearer diagrams,
updated hyperlinks, better spelling and punctuation) should be merged by the 
Maintainers without a need for consensus or voting. 

Changes that materially change the meaning of the section should be associated
with GitHub issues that have to be resolved in the community. 

During periods of **normal mode** development, a section should be at a 
PROPOSED status until the next working group call (regular or scheduled). 

During periods of **crunch mode** development, this may move as fast as 2 
business days. 
* At least two maintainers should still review all PRs, but change-request and 
discussion should realistically reflect **crunch mode** turnaround. Opening 
issues for REFINING stage instead of or addition to change requests is 
encouraged in case of rushed merges.
* Chairs may ask assignees to check in or progress issues daily
* Crunch-mode target state is to have PRs merged by the next meeting for any 
assigned issue.

#### Assigning section content in the REFINING state: 

When the Working Group Participants come to a consensus about the amount and 
type of content that’s appropriate. While in this state, all substantive changes 
to the section must be associated with a GitHub issue and must either be 
approved by a maintainer different from the person who raised the issue, or by 
consensus among Working Group Participants during a Working Group call. During 
the REFINING state, the Working Group will request feedback from other 
decentralized identity-related and -adjacent communities. Ideally, these inputs
will lead to issues for consensual/deliberative resolution. Further
validation and improvement of the section can/expected to be done via (code) 
implementations and testing. 

During periods of **normal mode** development, issue-linked PRs should allow up 
to 5 business day for review and change requests.  During periods of **crunch 
mode** development, this window is reduced to 2 business days. At least two 
maintainers should still review all PRs.


#### Assigning section content in the STABLE state: 

When all of the following conditions are met: 
* There is quality code that demonstrates the concepts it describes.
* There are no outstanding issues related to that section that the Working Group 
Participants consider substantive.
* The Working Group has at least 2 conformant implementations, at least 1 of
which originated outside of the Working Group 

When the WG has consensus that the above conditions have been reached, 
the section enters a final 2-week comment period if no substantive
objections are raised against the LAST-COMMENTS status. The start
of this period, intended for "last comments," should be announced
on the Working Group mailing list. If substantial discussion or change
happens, this LAST-COMMENTS phase can be extended 1 additional
week at the discretion of the chairs.

Once a section reaches STABLE status, non-substantive changes can be merged at 
maintainer discretion, however, substantive changes are generally discouraged 
except by discretion of the chairs. Even then, substantial changes should be 
discussed on a Working Group call. If resolved asynchronously via GitHub issues,
the discussion during a Working Group call may be brief.

Note:  when it comes to substantive changes, there are alternatives to the 
above, which may delay completion of the consensual work: 
1. document the change in an issue but make no change to the section
2. write an extension standard (which may break some aspects of 
original/trunk spec)
3. depreciate current version of a standard, and write a new version together
as a group or in a rechartered smaller group

Once all expected sections of the Scope reach the STABLE stage the Working 
Group commences the work carried out during the Draft stage to Working Group
Approved stage as described in DIF’s Charter.
