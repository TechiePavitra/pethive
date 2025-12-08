# 📁 .github Directory

This directory contains GitHub-specific configuration files for the PetHive project.

## 📋 Contents

### 🔄 Workflows (`.github/workflows/`)
Automated CI/CD pipelines using GitHub Actions:

- **`ci.yml`** - Continuous Integration pipeline
  - Runs on push/PR to `main` and `develop` branches
  - Backend tests and linting
  - Frontend tests and build
  - Security audits
  
- **`deploy.yml`** - Deployment pipeline
  - Deploys to Vercel on push to `main`
  - Runs database migrations
  - Manual trigger available

### 📝 Issue Templates (`.github/ISSUE_TEMPLATE/`)
Standardized templates for creating issues:

- **`bug_report.md`** - Report bugs with detailed information
- **`feature_request.md`** - Suggest new features

### 🔀 Pull Request Template
- **`PULL_REQUEST_TEMPLATE.md`** - Standardized PR format with checklist

### 📚 Documentation

- **`CONTRIBUTING.md`** - Contribution guidelines
  - Development setup
  - Coding standards
  - PR process
  - Testing requirements

- **`CODE_OF_CONDUCT.md`** - Community guidelines
  - Based on Contributor Covenant 2.0
  - Enforcement policies

- **`SECURITY.md`** - Security policy
  - Vulnerability reporting process
  - Response timelines
  - Security best practices

- **`ENV_SETUP.md`** - Environment variables guide
  - Setup instructions
  - Security best practices
  - Admin credential management
  - Troubleshooting

### 🤖 Automation

- **`dependabot.yml`** - Automated dependency updates
  - Weekly updates for npm packages
  - Separate configs for server/client/root
  - GitHub Actions updates

- **`FUNDING.yml`** - Sponsorship configuration
  - GitHub Sponsors
  - Buy Me a Coffee
  - PayPal
  - Cryptocurrency

## 🚀 Quick Links

- [How to Contribute](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Environment Setup](ENV_SETUP.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## 🔧 Setup Instructions

### For Contributors

1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Follow [ENV_SETUP.md](ENV_SETUP.md) for local development
3. Review [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

### For Maintainers

1. Update `dependabot.yml` with your GitHub username
2. Configure GitHub Secrets for CI/CD:
   - `VERCEL_TOKEN` - Vercel deployment token
   - `DATABASE_URL` - Production database URL
3. Update `FUNDING.yml` with your payment links
4. Replace `[ADMIN_EMAIL_PLACEHOLDER]` in all files

## 📊 GitHub Actions Secrets Required

For the workflows to function, add these secrets in GitHub Settings → Secrets:

| Secret Name | Description | Required For |
|-------------|-------------|--------------|
| `VERCEL_TOKEN` | Vercel deployment token | deploy.yml |
| `DATABASE_URL` | Production database URL | deploy.yml |
| `SESSION_SECRET` | Session encryption key | deploy.yml |

## 🎯 Customization Checklist

- [ ] Replace `YOUR_USERNAME` in `dependabot.yml`
- [ ] Replace `YOUR_GITHUB_USERNAME` in `dependabot.yml`
- [ ] Update `FUNDING.yml` with your payment links
- [ ] Replace `[ADMIN_EMAIL_PLACEHOLDER]` in:
  - [ ] `SECURITY.md`
  - [ ] `CODE_OF_CONDUCT.md`
  - [ ] `CONTRIBUTING.md`
  - [ ] `ENV_SETUP.md`
- [ ] Configure GitHub Secrets for workflows
- [ ] Update repository URL in `CONTRIBUTING.md`

## 📖 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [GitHub Issue Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests)

---

**Last Updated**: December 2024
