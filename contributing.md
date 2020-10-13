# Work Mode and Process for Claims & Credentials: Presentation Exchange 
Addendum to the Claims and Credentials Working Group charter for the
Presentation Exchange specification.

## Repository

### Maintainers 
Maintainers handle the repository management as described in the
Work Mode and Process (below).

### Maintainer selection
Maintainers must be Working Group Participants, and be selected by Working Group 
Participants via consensus. At least 3 maintainers must be to be active at any 
given time. Maintainers *MUST* have different organizational affiliations to
represent the diversity of the Working Group (i.e., no two maintainers may work
for the same company, organization, or project).

## Work Mode and Process

### Process Summary
The following is a summary of the process used by the Claims and Credentials
Working Group for the Presentation Exchange Specification. Greater detail may
be found below.
1. The group determines the version number of the next release of the
  specification.
1. The group triages repository issues into two categories:
   1. Issues that should be resolved before the next version of the
     specification is published, or
   1. Issues that may be part of some future version.
1. After all issues for a particular version have been addressed, the working
  group votes whether to change thw status of that version and begin the
  publication process.
1. If the group does not achieve consensus to change the status, they should
  identity a specific set of additional issues that must be addressed in order
  to reach agreement.

### Process Detail

#### Specification Formatting Requirements
* 80-char fixed-width columns (aka "hard wraps") are required by this
specification.

#### Specification Versioning 
The Working Group determines the version number of the next release of the
specification. Version numbers for the specification indicate the relationship
of the specification to previous versions according to the guidelines of the
[Semantic Versioning Specification](https://semver.org). 

#### Issue triage
Issue triage occurs during spec drafting meetings to determine which version of
the specification should resolve a particular issue (e.g., the next version or
some future version). Triage should roughly follow these guiding principles:
1. Consensus should be easy - this means that if any group participant feels
  strongly that an issue should be included in the next version of the
  specification, then it should be included, otherwise it may be included in
  some future version.
1. An expectation of doing - this means that any group participant who feels
  strongly that an issue should be included in the next version of the
  specification should also be the one to propose concrete changes and work to
  bring the group to consensus about the changes.

#### Specification Status and Publishing
In addition to a version number, the specification has a status:
1. `Pre-Draft` - The status of the specification is `Pre-Draft` until changed by
  the Working Group.
1. `Draft` - This status indicates the specification is ready for feedback from
  other decentralized identity-related and -adjacent communities. Ideally, these
  inputs will lead to issues for consensual/deliberative resolution. Further
  validation and improvement of the specification should be done via
  implementation and testing. Once the Working Group approves a version of the
  specification as a `Draft Deliverable` (i.e. it has been given `Draft`
  status), the `Draft Deliverable` becomes the basis for all work going forward
  on that version (in accordance with the DIF Charter Deliverable Development
  Process).
1. `Working Group Approved` - Once the Working Group has refined the `Draft
  Deliverable` and believes it has addressed all pertinent issues, it may
  progress the `Draft Deliverable` to `Working Group Approved` status (in
  accordance with the DIF Charter Deliverable Development Process). 
  
A specification with the `Working Group Approved` status indicates that all of
the following conditions are met: 
   * There is quality code that demonstrates the concepts it describes.
   * There are test vectors which may be used to test implementations.
   * There are no outstanding issues that the Working Group Participants
     consider substantive.
   * There are at least 2 conforming implementations, at least 1 of which
     originated outside of the Working Group. 

##### Changing Status
The vote to change the status of a version of the specification may occur during
a spec drafting meeting, or during a regular Working Group meeting. At least 48
hours notice must be given to group participants in advance of a meeting during
which a vote will be held. This notice should be sent via the Working Group
mailing list.

The decision to change the status must be made by the consensus of the group. If
there are group participants who object to the change, they must provide a set
of issues to be addressed before the change should be made. If a supermajority
(as determined by the Working Group chairs) of group participants disagrees with
the set of additional issues, a decision to change the status to `Draft` may
proceed, but changing the specification status to `Working Group Approved`
requires the consensus of the group.

At the time the Working Group decides to change the specification status to
`Working Group Approved`, it must also determine the publication location and
the terms under which the specification is made available (see below).

##### Publishing the Specification (in accordance with the DIF Charter Deliverable Development Process)
Upon a `Draft` deliverable reaching `Working Group Approved` status, the
Executive Director or his/her designee will present that `Working Group
Approved` deliverable to the Steering Committee for Approval. Upon Approval by
the Steering Committee, the deliverable will be designated an `Approved
Deliverable`.

Upon the designation of a deliverable as an `Approved Deliverable`, the
Executive Director will publish the `Approved Deliverable` in a manner agreed
upon by the Working Group Participants (i.e., Project Participant only location,
publicly available location, Project maintained website, Project member website,
etc.). The publication of an `Approved Deliverable` in a publicly accessible
manner must include the terms under which the `Approved Deliverable` and/or
source code is being made available under, as set forth in the applicable
Working Group Charter.

### Work Mode
The work mode for the Presentation Exchange Specification covers the following:

1. Work and Meetings
1. Pull Requests
1. Issues
1. Objections

#### Work and Meetings
The primary work of writing the Presentation Exchange Specification occurs
outside of regular meetings and consists of activities on GitHub, namely
raising PRs and issues, commenting on issues, reviewing PRs, and working toward
consensus about PRs and issues.

A weekly spec drafting meeting will be held. The meeting time may be used to:
1. Triage and assign a group member to take the lead on new issues.
1. Move forward issues and PRs that require group discussion.
1. Merge PRs and close issues if consensus is reached to do so by group
  participants.
1. Vote on publishing a version of the specification.
  
#### Pull requests
Pull requests fall into roughly two categories:
1. PRs which are substantive. Example include PRs that restructure the document,
  add to or modify normative spec language, or otherwise materially change the
  specification. These PRs should be associated with GitHub issues. They should
  only be merged after a minimum of two approving reviews by group participants
  (in addition to the PR author), and only after a review period of 7 days (to
  allow time for objections). If a decision to merge the PR finds consensus
  during the weekly spec drafting meeting, then the PR may be merged before the
  end of the review period. 
1. PRs which are not substantive. Examples include PRs that improve wording,
  clarify diagrams, update hyperlinks, fix spelling and punctuation, or which
  adjust the specification publishing tooling, etc. These PRs may be merged
  after a minimum of two approving reviews by group participants.

#### Issues
Issues may be raised by anyone, but are triaged and assigned to group
participants. The assigned group participant is expected to take the lead in
resolving the issue, whether by inviting discussion, proposing solutions, or
raising PRs which address the issue, and may be called upon during spec drafting
meetings to provide a status update for the issue.

#### Objections
We strive for consensus in group decisions. During spec drafting meetings, and
through GitHub issues, PRs, and conversation, group participants will have
opportunity to share opinions, concerns, and proposals. The points of view of
all participants should be carefully considered, and objections should be taken
seriously.

The work mode and process described here strives to allow ample opportunity for
an engaged group participant to make their views known. However, there may be
times when group participants are unable to take part in a decision. Any group
participant who objects to a decision reached by the consensus of the working
group should raise an issue outlining their objection within 7 days of the
group's decision. The Working Group can then discuss the objection during
subsequent spec drafting meetings. 
