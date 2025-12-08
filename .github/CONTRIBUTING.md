# Contributing to PetHive 🐾

First off, thank you for considering contributing to PetHive! It's people like you that make PetHive such a great platform.

## 🎯 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible using our bug report template.

### ✨ Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Use our feature request template and provide:
- Clear description of the feature
- Why this feature would be useful
- Possible implementation approaches

### 🔧 Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request** using our PR template

## 🚀 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/pethive.git
cd pethive

# Install dependencies
npm run install-all

# Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# Set up database
cd server
npx prisma generate
npx prisma db push
npm run seed
cd ..

# Start development servers
npm run dev
```

## 📝 Coding Standards

### JavaScript/React
- Use ES6+ features
- Follow functional programming principles
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### Code Style
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add trailing commas in objects/arrays

### Commits
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new product filter
fix: resolve cart calculation bug
docs: update README with new setup steps
style: format code with prettier
refactor: simplify authentication logic
test: add unit tests for cart service
chore: update dependencies
```

## 🧪 Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 📚 Documentation

- Update README.md if you change functionality
- Add JSDoc comments for functions
- Update API documentation for new endpoints
- Include screenshots for UI changes

## 🔍 Code Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be acknowledged!

## 🎨 Design Guidelines

- Follow existing UI/UX patterns
- Ensure responsive design (mobile-first)
- Use TailwindCSS utilities
- Maintain accessibility standards (ARIA labels)
- Test on multiple browsers

## 🌳 Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

## 📋 Checklist Before Submitting PR

- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex code sections
- [ ] Updated documentation
- [ ] No new warnings or errors
- [ ] Added/updated tests
- [ ] All tests pass
- [ ] Tested on multiple browsers
- [ ] Mobile responsive (if UI changes)

## 🤔 Questions?

Feel free to:
- Open a discussion on GitHub
- Ask in pull request comments
- Contact maintainers at [ADMIN_EMAIL_PLACEHOLDER]

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to PetHive! 🐾**
