# Kovift Website Conversation Summary

## Background

Kovift is being positioned as a premium, enterprise-ready technology partner focused on AI, data, cloud, and product engineering.

TaskLab was an earlier venture owned by the founder and colleagues. The two existing projects may therefore be truthfully adapted for Kovift, while using distinct wording and presentation.

## Decisions

- Use TaskLab's conversion-first information hierarchy as inspiration.
- Keep Kovift's own premium, dark, technical visual identity.
- Make delivered work the main trust-building section on the homepage.
- Place selected work immediately after the short introduction and credibility signals.
- Use concise, original descriptions rather than copying TaskLab's wording.
- Remove confidentiality and anonymisation language from public homepage and case-study content.
- Keep the existing Snowflake and KubeShift case-study pages linked from the homepage.

## Recommended Homepage Structure

1. Navigation
2. Hero with a clear promise and primary CTA
3. Credibility signals and short introduction
4. Selected Work / Products We Have Shipped
5. Practical entry paths for prospective clients
6. Services
7. How we work
8. Technology capabilities
9. Founder team
10. Frequently asked questions
11. Final contact CTA

## Homepage Direction

### Hero

Updated positioning:

> Turn complex systems into business momentum.

Suggested actions:

- Start a project
- View our work

### Selected Work

This should be presented as a prominent trust section, not as a minor portfolio block.

Suggested section heading:

> Products and systems we have shipped.

Suggested supporting text:

> Real AI, data, cloud and product work built to solve operational problems.

### Featured Project 1

Category: Automated warehouse migration

Title: Informatica -> Snowflake Migration

Include:

- A short business-outcome description
- Relevant technology tags
- A prominent View case study link
- An optional Discuss a similar project CTA

### Featured Project 2

Category: Cloud-native application modernisation

Title: Project KubeShift

Include:

- A short business-outcome description
- Relevant technology tags
- A prominent View case study link
- An optional Discuss a similar project CTA

### Service Entry Paths

- Make your data usable
- Automate repetitive work with AI
- Build the product you need

### Services

- AI Solutions
- Data Engineering and Migration
- Web, Mobile and Product Engineering
- Cloud and DevOps

### Process

Discover -> Shape -> Build -> Improve

The process should communicate clear scope, regular communication, delivery, and handover.

### Technology Capabilities

Group technologies instead of presenting an undifferentiated logo wall:

- AI and automation
- Data platforms
- Cloud and DevOps
- Product engineering

### Team

- Krishan - Data and AI
- Shivam - AI and DevOps
- Joe - Data and Product Development

### FAQ Topics

- Can Kovift work globally?
- Do clients need an internal technical team?
- How do projects start?
- Who owns the final product?
- Can Kovift modernise existing systems?

### Final CTA

Suggested direction:

> Have a complex problem worth solving?

Provide clear contact options such as email, WhatsApp, and a contact form.

## Visual Direction

- Near-black or deep navy navigation and hero areas
- Off-white or light neutral content sections for contrast
- Electric orange as the primary action accent
- Large editorial typography with a distinctive font choice
- Real project imagery as the visual centre of the work section
- Restrained animation focused on page-load and section reveals
- Fewer decorative graphics and more emphasis on proof, outcomes, and clarity
- Responsive layouts that work cleanly on desktop and mobile

## Existing Implementation Status

The homepage was restructured to include:

- A stronger conversion-led hero
- Credibility metrics
- Early featured work
- Capability groups
- Technology stack content
- FAQs
- Stronger enquiry prompts

The homepage and styling files were edited. The existing Snowflake and KubeShift case-study pages remain part of the site flow.

## Validation To Complete

Before deployment, verify:

- `git diff --check`
- `node --check script.js`
- Every local `href` and `src` reference in `index.html` resolves
- The homepage links correctly to both case studies
- The work section is visibly prominent and clearly labelled
- Desktop and mobile layouts do not overlap or overflow
- The production deployment completes successfully

## Deployment Note

A previous deployment was associated with commit `5f8bea8`. The later homepage restructuring still needs its final deployment and verification after the interrupted session.
