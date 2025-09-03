# Contributing to School Hub

Thank you for your interest in contributing to School Hub! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites
- Node.js 20+ 
- Yarn package manager
- Deno 1.x (for backend)

### Frontend Setup
```bash
# Clone the repository
git clone [repository-url]
cd quasar

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Deno if not already installed
curl -fsSL https://deno.land/install.sh | sh

# Start backend server
deno run --allow-all src/main.ts
```

## Code Standards

### Frontend (Vue/Quasar)
- Use TypeScript for all new code
- Follow Vue 3 Composition API patterns
- Use Pinia for state management
- Ensure components are responsive and accessible
- Add proper TypeScript types
- Use i18n for all user-facing text

### Backend (Deno)
- Use TypeScript
- Follow REST API conventions
- Implement proper error handling
- Add input validation
- Use environment variables for configuration

### Code Style
- Run `yarn lint` before committing
- Use `yarn format` to format code
- Follow existing code patterns
- Add meaningful comments for complex logic

## Testing

### Frontend Testing
```bash
# Run linting
yarn lint

# Type checking
yarn type-check

# Format checking
yarn format:check
```

### Backend Testing
```bash
cd backend
deno check src/main.ts
deno lint src/
deno fmt --check src/
```

## Pull Request Process

1. **Fork the repository** and create a feature branch
2. **Make your changes** following the code standards
3. **Add or update tests** as necessary
4. **Run all checks** locally before pushing
5. **Create a pull request** using the provided template
6. **Address review feedback** promptly

### Commit Messages
Use conventional commit format:
```
feat: add user authentication
fix: resolve student deletion bug
docs: update API documentation
chore: update dependencies
```

## Branch Naming
- `feature/description` - for new features
- `fix/description` - for bug fixes
- `chore/description` - for maintenance tasks
- `docs/description` - for documentation updates

## Translation Workflow

The project uses automated translation for i18n files:

1. **Edit only the source file**: `src/i18n/en-US.json`
2. **Translations are automatic**: Other language files are auto-translated on push to main
3. **Review translations**: Check auto-generated translations for accuracy
4. **Manual fixes**: Edit target language files directly if needed

## Issue Reporting

Use the provided issue templates:
- **Bug Report**: For reporting bugs with reproduction steps
- **Feature Request**: For proposing new features with detailed requirements

## Development Workflow

1. **Create an issue** for the feature/bug you want to work on
2. **Get assignment** or confirmation before starting work
3. **Create a branch** from `develop` 
4. **Implement changes** with proper testing
5. **Submit PR** against `develop` branch
6. **Respond to review** feedback
7. **Merge** after approval

## Getting Help

- Check existing issues and documentation first
- Create a new issue with the appropriate template
- Tag @davidparys for urgent matters

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
