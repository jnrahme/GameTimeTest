# Security Policy

This is a take-home mobile app implementation, not a production GameTime system.
Still, security reports are welcome when they identify a real risk in the sample
app, dependency setup, repository configuration, or documentation.

## Supported Version

The `main` branch is the supported branch.

## Reporting a Vulnerability

Please open a private report through GitHub security advisories if available, or
contact the repository owner directly. Include:

- A concise description of the issue.
- Steps to reproduce or a proof of concept.
- Affected files, dependencies, or configuration.
- Expected impact and any recommended remediation.

## Scope

In scope:

- Dependency vulnerabilities.
- Secret handling mistakes.
- Unsafe sharing, calendar, or platform integration behavior.
- CI or repository configuration issues that could expose sensitive data.

Out of scope:

- Attacks against mocked data that has no production backing service.
- Social engineering.
- Denial-of-service testing against GitHub or third-party services.

No secrets, production credentials, or customer data should be committed to this
repository.
