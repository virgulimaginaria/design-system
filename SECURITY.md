# Security policy

## Reporting a vulnerability

**Do not report security issues in public GitHub issues, discussions or pull requests.**

Report them privately through GitHub's private vulnerability reporting: go to the repository's **Security** tab and choose **Report a vulnerability**. Only the maintainers can see the report.

If that option is not available, private vulnerability reporting has not been enabled yet (maintainers: _Settings → Security → Private vulnerability reporting → Enable_). In that case, open a public issue that says only that you have a security report and asks the maintainers for a private channel, without any details of the problem.

This also applies if you find something that should never have been published in this public repository, such as a credential or personal data: report it privately so it can be revoked and removed from the history.

## Scope

This repository contains front-end UI packages (`@virgulimaginaria/ui`, `@virgulimaginaria/design-tokens`) and their documentation site. Relevant reports include, for example, cross-site scripting through component APIs, vulnerable dependencies shipped to consumers, or leaked sensitive information.

## Supported versions

Security fixes are released for the latest published minor version of each package.
