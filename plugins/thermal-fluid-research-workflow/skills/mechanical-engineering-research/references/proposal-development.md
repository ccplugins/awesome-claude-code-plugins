# Federal Research Proposal Development

Use this reference for DOE EPSCoR, NSF, NASA, National Laboratory partnership proposals, pre-application expansion, review-criteria response, and ready-to-submit technical narratives in mechanical engineering, thermal-fluid systems, power electronics, reliability, diagnostics, and AI/ML-enabled research.

## Core Principle

Build the proposal around the solicitation, the review criteria, and the investigators' own intellectual work. A strong proposal is not a long technical essay. It is a controlled argument that establishes importance, synthesizes the state of the art, identifies gaps, states objectives and hypotheses, explains methods, substantiates feasibility with preliminary results, defines measurable success, and proves that the team and collaboration can execute the work.

Use AI only as proposal-development support. Preserve the investigators' scientific direction, original technical content, preliminary results, and final responsibility. If the solicitation requires AI disclosure, flag the requirement and suggest wording for institutional review.

## Solicitation-First Workflow

1. Read the solicitation before drafting.
   - Extract deadline, page limits, font/margin rules, required sections, required attachments, eligibility rules, budget restrictions, National Lab rules, data-management requirements, AI-disclosure language, and review criteria.
   - If a specific PDF or NOFO is provided, use it as the controlling source rather than generic grant-writing advice.
   - Track whether references, appendices, biosketches, current and pending support, budget justification, data management plans, letters, and optional attachments have separate page limits.

2. Build a compliance checklist.
   - Include narrative page limit and formatting.
   - Include all collaborator documents, letters, institutional commitments, and data-management attachments.
   - Note budget restrictions such as whether National Laboratory partners may receive funds.
   - Identify who must provide biosketches, current and pending support, collaborator/affiliation information, senior/key-personnel documents, facilities/equipment descriptions, and letters of commitment.

3. Map the proposal to review criteria.
   - Treat review criteria as questions that the proposal must answer explicitly.
   - For DOE-style criteria, cover scientific/technical merit, method/approach, personnel/resources, budget reasonableness, data management, and likelihood of collaboration success.
   - Add subsection-level sentences that make the answers visible without turning the narrative into a checklist.

4. Use pre-application feedback as design input.
   - Preserve encouraged directions from the pre-application.
   - Expand the scientific foundation, methods, preliminary results, milestones, and collaboration plan.
   - Do not simply inflate the pre-application; convert it into a full argument with literature, figures, methods, risks, and metrics.

## Narrative Architecture

When the solicitation suggests Background/Introduction, Project Objectives, and Proposed Research and Methods, follow that structure unless the user explicitly chooses another one.

### 1. Background/Introduction

This section should explain importance, relevance, and literature context. It should not become a preliminary-results dump.

Use this flow:

1. Establish why the problem matters for DOE, NSF, NASA, industry, safety, resilience, energy efficiency, reliability, or fundamental science.
2. Review the state of the art by mechanism, method, or system class.
3. Cite seminal work, recent state-of-the-art papers, high-impact reviews, standards, and team-relevant papers.
4. Identify gaps that remain after the literature is fairly represented.
5. Explain why the gaps persist: coupled physics, missing diagnostics, scale mismatch, difficult measurements, limited models, lack of benchmark data, weak transferability, or insufficient collaboration access.
6. End with the opportunity that the proposed project will address.

For mature fields, target a selective and balanced reference set rather than every paper found. For a full DOE-style narrative, a working development draft may use 50-60 references, then compress the in-text review for page limits and move references to the required appendix if allowed.

### 2. Project Objectives

Use one overall goal when multiple objectives are interdependent.

Pattern:

- **Overall goal:** Establish what the project will create, validate, or discover.
- **Objective 1:** Experimental or observational characterization.
- **Objective 2:** Theory, modeling, mechanism interpretation, or computational framework.
- **Objective 3:** Predictive tool, design rule, diagnostic method, validation, or translational outcome.

Keep objectives concise. Avoid burying task descriptions, milestones, and preliminary results in this section. Objectives should map clearly to thrusts or aims in the research plan.

### 3. Proposed Research and Methods

This section should identify hypotheses, methods to test them, and integration of experiments with theory, modeling, computation, or data science.

Start with:

- Central hypothesis or scientific premise.
- Thrust-level hypotheses when useful.
- Explanation of how experiments, theory/modeling, computation, and data analytics interact.

For each thrust or aim, include:

- Objective.
- Hypothesis tested.
- Tasks.
- Methods for each task.
- Preliminary data that demonstrates feasibility and expertise.
- Expected outcomes.
- Quantifiable completion and success metrics.
- Risks and alternatives, especially for weak signals, noisy data, uncertain labels, failed hardware, or modeling mismatch.

Do not isolate preliminary results in a long standalone section unless the solicitation asks for it. In most research narratives, preliminary results are strongest when embedded under the task they justify. For each preliminary result, state what capability it proves and what remaining question motivates the proposed work.

## Literature Review Strategy For Proposals

Use the literature review to make a case, not to show that many papers were found.

Cover four categories:

1. **Seminal sources:** papers, standards, textbooks, or reports that established the mechanism, diagnostic method, model, or governing concept.
2. **High-impact reviews or most-cited papers:** sources that define the current state of the field and accepted challenges.
3. **Most-recent work:** papers from the last 1-3 years, especially where the field is moving quickly.
4. **Team publications:** PI, Co-PI, collaborator, and National Lab papers that demonstrate expertise directly related to the work plan.

When the user provides Google Scholar profiles or publication lists:

- Use them to identify team publications, but verify final citation details through publisher pages, university pages, lab repositories, DOI records, OSTI, NSF public access, or other stable sources.
- Cite team papers strategically where they substantiate capability: prior hardware, modeling, sensing, datasets, algorithms, facilities, standards experience, or National Lab relevance.
- Avoid overciting the team at the expense of field-leading external experts.

For a proposal on physics-informed acoustic diagnostics for power electronics reliability, organize literature around mechanisms:

- Wide-bandgap/SiC power electronics, packaging, and reliability.
- Partial discharge physics, standards, and nonconventional detection.
- Acoustic emission sensing for PD, source localization, propagation, and limitations.
- Thermal management, direct cooling, dielectric fluids, two-phase cooling, and electrical reliability.
- Acoustic sensing and AI/ML for boiling, condensation, bubble dynamics, and phase-change diagnostics.
- Physics-informed machine learning, transferability, uncertainty, and health-state estimation.

The gap should follow naturally: existing work does not yet connect mechanism-labeled acoustic signatures to coupled electrical, thermal, mechanical, and cooling degradation in compact grid-relevant power electronics with synchronized reference data and transfer-tested diagnostics.

## Preliminary Results Integration

For each thrust, use preliminary results to answer three reviewer questions:

1. Why is the proposed work plausible?
2. What expertise, hardware, data, or analysis capability does the team already have?
3. What remains unknown enough to justify the new research?

Good preliminary-result placement:

- A PD/acoustic-camera result belongs in a discharge-characterization task.
- A PDIV spectral-analysis result belongs in a task about distinguishing PD from artifacts.
- A SiC junction-temperature ML result belongs in thermal/package health monitoring or multimodal diagnostics.
- A boiling, hydrophone, bubble, or dielectric-fluid result belongs in cooling-instability acoustics.
- A flow-boiling/condensation acoustic ML result belongs in physics-informed acoustic feature extraction and diagnostic transferability.

Write preliminary-results paragraphs in this pattern:

1. State the result and conditions.
2. State the measured outcome or performance.
3. Explain what capability it demonstrates.
4. Identify the limitation or unanswered question.
5. Connect directly to the proposed task.

## Figures In Proposal Narratives

Use figures as evidence, not decoration.

Figures should:

- Show preliminary data, testbeds, mechanism maps, workflow diagrams, or milestones.
- Be embedded near the text that uses them.
- Have captions that state the result, relevance, and proposed-work connection.
- Be legible at final page size.
- Avoid vague stock imagery or purely atmospheric visuals.

For a 15-page narrative, use a small number of high-value figures. Candidate figure types include:

- Preliminary PD/acoustic localization and hydrophone/bubble results.
- SiC module thermal-state estimation result.
- Immersion-cooling boiling and dielectric-strength result.
- AE phase-change or condensation diagnostic result.
- Spectral AE PDIV processing result.
- Integrated experiment-model-ML workflow diagram.
- Four-year timeline and milestone table.

## Quantifiable Milestones

Milestones should allow reviewers and program managers to evaluate completion and success. Avoid vague milestones such as "develop model" or "analyze data" without metrics.

Examples of measurable metrics:

- Number of source-class datasets.
- Number of geometries, operating conditions, repeats, or coupled-stressor cases.
- Synchronization accuracy, sampling rate, signal-to-noise threshold, calibration completion, or metadata completeness.
- Agreement between predicted and observed trend direction.
- Error metrics such as MAE, MAPE, RMSE, R2, classification accuracy, macro-F1, precision/recall, or uncertainty calibration.
- Improvement relative to a baseline, such as amplitude-threshold AE detection.
- Transfer performance across geometry, sensor placement, coolant condition, or operating regime.
- Number of student trainees, technical meetings, manuscripts, datasets, code packages, or National Lab reviews.

For each year, define major activities and quantifiable milestones. Include a final end-to-end demonstration with clear success criteria.

## National Lab And Collaboration Planning

For National Lab partnership proposals:

- Clarify whether National Lab collaborators are senior/key personnel or unfunded collaborators based on solicitation definitions and their substantive intellectual role.
- If they design experiments, interpret data, mentor students, or shape the research plan, assume they may need senior/key-personnel-style documents unless the solicitation or program officer says otherwise.
- Identify required documents: letters of commitment, biosketches, current and pending support, collaborator/affiliation information, facilities descriptions, and institutional approvals.
- Check whether funds can flow to the National Lab. Some EPSCoR lab-partnership programs do not fund labs directly.
- Describe collaboration mechanics: meeting cadence, student mentoring, milestone reviews, facility or expertise access, data-sharing boundaries, and how lab feedback changes the work plan.

Letters should be specific. A strong National Lab letter confirms the collaborator's role, expertise, commitment of time or engagement, student mentoring, technical review plan, and alignment with DOE mission needs. A strong institutional or jurisdiction commitment letter confirms institutional support, cost share or resources if applicable, facilities, administrative support, and commitment to building EPSCoR capacity.

If a jurisdiction letter is unclear, distinguish among:

- University institutional commitment.
- State EPSCoR jurisdiction or committee commitment.
- Department/college commitment.
- National Lab letter of commitment.

Ask the research office or program officer when the solicitation language is ambiguous.

## Ready-To-Submit Polish

Before calling a proposal ready:

- Confirm the narrative follows the solicitation's required or suggested structure.
- Replace bullet-heavy draft text with complete sentences and continuous paragraphs, except where tables or milestone lists are more effective.
- Ensure every objective has tasks, methods, preliminary basis, expected outcomes, risks, and measurable metrics.
- Cite references in the text and include a complete reference list in the correct appendix or section.
- Embed figures and verify captions, numbering, and cross-references.
- Check that the literature review is comprehensive enough to identify gaps, but compressed enough for page limits.
- Make review-criteria answers visible throughout the proposal.
- Verify senior/key-personnel documents, letters, DMSP, budget justification, facilities, and institutional commitment.
- Check page length with final formatting, not markdown word count.
- Flag AI-disclosure requirements for institutional review.

## Common Iteration Pattern

A practical proposal-development sequence is:

1. Answer compliance and collaborator-document questions.
2. Expand the pre-application into a full narrative.
3. Integrate preliminary results from prior proposals, manuscripts, reports, and figures.
4. Align the draft to review criteria.
5. Convert the outline into the solicitation's required section architecture.
6. Add hypotheses, task-level methods, and experiment-model-computation integration.
7. Replace vague milestones with quantitative success metrics.
8. Add references and figure placeholders.
9. Expand the literature review with seminal, most-cited, recent, and team-specific papers.
10. Compress and polish for final page limits and submission formatting.

At each iteration, preserve prior drafts with versioned filenames when feasible so the user can compare structure and content choices.
