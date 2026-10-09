# CurveScope Project History and Prior-Work Disclosure

**Prepared:** 2026-10-09  
**Purpose:** Evidence-based history note for the Crypto World's Fair submission. This document records what the available project evidence establishes; it does not determine facts that require owner confirmation.

## Scope and method

Inspected the current project directory, its local Git history and reflog, project-local documentation and files, and available file timestamps. No Git remote is configured. No project-local backup, editor-history, swap, temporary, or log files were found in the searched file set. The conversation records earlier CurveScope work phases, but do not provide trustworthy dates for those activities. No unrelated user directories, personal shell history, credentials, or secrets were inspected.

Git commit dates establish when the current local commits were recorded. They do **not** establish when the project or code was first created. Filesystem timestamps are supporting clues only: they can reflect copying, extraction, synchronization, or later edits.

## Dated timeline

| Date/time | Finding | Evidence | Confidence / limit |
|---|---|---|---|
| 2026-09-14 | The Crypto World's Fair sprint began. | The [official hackathon rules](https://colosseum.com/legal/Crypto%20World's%20Fair%20Hackathon%20Rules.pdf) state the sprint start date. The [official Fall 2026 hackathon page](https://colosseum.com/hackathon?year=fall2026) says work predating the sprint may exist but must be disclosed and judging focuses on sprint-period work. | High for the event date and stated rule; says nothing about CurveScope's development date. |
| Before 2026-09-14 | No CurveScope implementation, prototype, or reused project component could be confirmed from the available project-local records. | Current Git history has no commits before October 9; no local remote, project-local backup/history/log files, or prior snapshot were located in the inspected workspace. Prior phases mentioned in the conversation have no reliable dates. | **Unknown, not evidence of absence.** The inspected records are incomplete and the first Git commit is not a start date. |
| 2026-10-09 15:14:27 +07:00 | The current project snapshot was first recorded in this local Git history as an initial submission-package commit (58 files; 12,708 insertions). | Commit `cc62c2d871a3bcfc7818af2ae039af26879882dd`; local `git log` and reflog. | High for commit contents/date. No inference about how long the snapshot had existed or how much work predates it. |
| 2026-10-09 15:19:12 +07:00 | A follow-up commit corrected claims and finalized submission notes. | Commit `108e6ca78ac4c99cdc336cffd577dcbd6f56f78d`, subject “Correct claims and finalize submission notes.” | High for the recorded commit; subject is a summary, not independent proof of every detail changed. |
| 2026-10-09 15:20:27 +07:00 | A follow-up commit prevented generated recipe ID collisions. | Commit `40f5ae858ee2f787892db4a93e1a2357492b5511`, subject “Prevent generated recipe ID collisions.” | High for the recorded commit; commit subject describes the change at a high level. |
| 2026-10-09 07:06–08:19 UTC (supporting clue) | Representative current files have filesystem timestamps on this date. For example, `src/main.tsx`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, and `README.md` show creation time 07:06:11Z; `docs/PROTOCOL_AUDIT.md` shows creation 07:33:20Z and modification 08:19:57Z. | `CreationTimeUtc` and `LastWriteTimeUtc` queried directly from those workspace files. | Low for development chronology. The clustered timestamps may reflect import/copying and cannot establish original authorship or creation. |

The three commits above are the original repository's `master` history as recorded before privacy preparation. Their identifiers refer to that original history; changing email metadata creates different commit identifiers in the separate public proposal.

## Public-history preparation (local proposal only)

The separate local public proposal rewrites the author and committer email fields for the same three commits to the owner's supplied GitHub no-reply address and changes the author and committer display names to the owner-approved handle `roxy4798`. The handle was confirmed against the public GitHub account ID and the documented no-reply address format; the signed-in account settings page itself was not accessible in the browser. Commit trees, messages, and dates are preserved. The original repository history, including its original metadata, is retained in a local backup and is not included in the proposal copy. The proposal has not been published or pushed, and its audit corrections remain uncommitted pending owner review. Attribution for those later audit corrections remains an owner decision.

## Evidence categories

### Confirmed before 2026-09-14

No CurveScope-related work before the sprint is confirmed by the available records. This means **unverified**, not “none.” The current evidence cannot establish whether an earlier prototype, design, code module, or asset existed elsewhere.

### Confirmed on or after 2026-09-14

The local commits listed in the timeline prove that a CurveScope snapshot and two follow-up changes were recorded on October 9, 2026. They do not prove that the work began on that date. The repository snapshot includes the application, documentation, configuration, and assets present at the time of that commit.

### Pre-existing or reused code and assets

No CurveScope code component can be confirmed as reused from a pre-September 14 CurveScope project. However, `src/assets/react.svg` is byte-for-byte identical by SHA-256 to the same-path asset in the official Vite React starter template as checked on October 9, 2026. This confirms the asset content matches third-party starter content, but does not establish when or how it entered this workspace. The repository also contains React/Vite scaffold-like configuration; its origin and timing are unverified. `src/assets/vite.svg` did not match the same-path SVG in the current official Vite React template at the time of comparison. `src/assets/hero.png`, `public/favicon.svg`, and `public/icons.svg` have unresolved provenance and rights. Installed libraries and SDKs are third-party dependencies; their presence does not establish reuse of an earlier CurveScope project.

### Uncertain dates and origins

- The actual start date of CurveScope development.
- Whether an earlier CurveScope prototype, design, source repository, or related project exists outside this workspace.
- Whether any current application code, text, visual design, or asset predates September 14, 2026, and, if so, its scope and author.
- The origin, licensing, and intended use of the hero image and any other non-scaffold artwork.
- Whether the React/Vite scaffold files were generated for this workspace, copied from another project, or modified from an earlier prototype.
- The dates and authorship of work discussed in earlier project phases; the conversation history available here does not establish those dates.

## Draft prior-work disclosure

> CurveScope's development history before September 14, 2026 has not been established from the records currently available to the project. The earliest recoverable original local Git history is an October 9, 2026 commit that records the then-existing 58-file application and documentation snapshot; this is not asserted as the project start date. The current workspace includes React/Vite scaffold-like files, third-party dependencies, a `src/assets/react.svg` whose contents match the official Vite React starter template, and artwork whose dates or origins are unverified. The matching SVG does not establish when it was copied into this project. I cannot currently confirm whether CurveScope code, designs, or other assets were created before the sprint or reused from earlier CurveScope work. I will update this disclosure with any verified prior-work details before submission.

This is a factual **draft**, not a completed eligibility determination. The owner should resolve the questions below and amend it before submitting. If no prior work is confirmed after checking the relevant records, state that conclusion only with an accurate description of what was checked; do not derive it solely from this repository's initial commit.

## Owner questions to resolve

1. When did CurveScope work first begin, including sketches, requirements, design, prototypes, or code?
2. Was any code, design, text, dataset, or asset from another project or an earlier CurveScope version reused? If yes, identify it, its original date/source, author, and how it was reused.
3. Were any current files prepared before September 14, 2026? In particular, what are the origins and usage rights for `src/assets/hero.png` and any non-scaffold artwork?
4. Were there prior repositories, backups, editor histories, exports, or collaborator copies that can establish dates? If so, which are project records that can be checked without searching unrelated personal data?
5. Who contributed to any pre-sprint work, and what scope of that work should be disclosed under the official submission rules?
6. The owner approved `roxy4798` as the display name for the three preserved commits. How should the owner attribute the later audit corrections made in this proposal?

## What the available records cannot establish

The current workspace and its short local Git history do not provide a reliable project inception date or a complete provenance trail. File timestamps are not proof of original creation. There is no configured remote from which to inspect hosted branches or earlier commit history. No project-local backup or editor-history record was found in the searched files. Without owner-provided facts or relevant project-specific records, it is not possible to determine whether pre-sprint work existed or was reused. This note therefore makes no “no prior work” claim.

## Official references

- [Crypto World's Fair Hackathon Rules (official PDF)](https://colosseum.com/legal/Crypto%20World's%20Fair%20Hackathon%20Rules.pdf)
- [Colosseum Fall 2026 hackathon page and FAQ](https://colosseum.com/hackathon?year=fall2026)
