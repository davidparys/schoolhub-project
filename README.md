# School Hub - Students & Classes Management

A production-ready Single Page Application (SPA) built with Quasar.dev for managing students and classes. Features real-time data synchronization with Supabase backend, modern CI/CD pipeline, and automated translations.

![CI/CD Status](https://github.com/davidparys/quasar/actions/workflows/ci.yml/badge.svg)
![Security](https://github.com/davidparys/quasar/actions/workflows/codeql.yml/badge.svg)
![Translation Status](https://github.com/davidparys/quasar/actions/workflows/i18n-translate.yml/badge.svg)

## ✨ Features

### Core Functionality
- **Student Management**: Add, edit, delete students with validation
- **Class Management**: Add, edit, delete classes with detailed information
- **Class Assignments**: Assign/remove students from classes with batch operations
- **Real-time Data**: Supabase integration with optimistic updates
- **Search & Filter**: Quick search across students and classes

### Developer Experience
- **TypeScript**: Full type safety across frontend and backend
- **Automated Testing**: ESLint, TypeScript checks on every PR
- **Automated Translations**: AI-powered i18n with OpenAI integration
- **Performance Monitoring**: Lighthouse audits on every deployment
- **Security Scanning**: CodeQL and dependency vulnerability checks
- **Auto-merge**: Dependabot PRs for minor/patch updates

### Production Features
- **Responsive Design**: Mobile-first approach with Quasar components
- **Multi-language**: English and Polish with automated translation workflow
- **Modern UI**: Material Design 3 components with accessibility
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Lazy loading, code splitting, and caching strategies

## Tech Stack

- **Frontend**: Quasar.dev (Vue 3, TypeScript)
- **State Management**: Pinia with Pinia Colada for API caching
- **Backend**: Supabase (PostgreSQL)
- **Styling**: SCSS with Quasar variables
- **Internationalization**: Vue i18n

## Setup

### Prerequisites

- Node.js (v18 or higher)
- Yarn or npm
- Supabase account

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Update your environment variables with your Supabase URL and anon key

### Installation

```bash
# Install dependencies
yarn install

# Fill database with sample data
yarn fill-db

# Start development server
yarn dev
```

## Database Schema

The application uses three main tables:

- **students**: Student information (id, first_name, last_name)
- **classes**: Class information (id, name, description)
- **class_assignments**: Many-to-many relationship between students and classes

## API Endpoints

The application provides REST API functionality through Supabase:

### Students
- `GET /students` - Get all students
- `POST /students` - Create new student
- `PATCH /students/:id` - Update student
- `DELETE /students/:id` - Delete student

### Classes
- `GET /classes` - Get all classes
- `POST /classes` - Create new class
- `PATCH /classes/:id` - Update class
- `DELETE /classes/:id` - Delete class

### Assignments
- `POST /class_assignments` - Assign student to class
- `DELETE /class_assignments` - Remove student from class

## 🚀 CI/CD Pipeline

This project includes a comprehensive CI/CD pipeline with:

### Automated Workflows
- **Pull Request Checks**: ESLint, TypeScript, and build verification
- **Security Scanning**: CodeQL analysis and dependency audits  
- **Performance Monitoring**: Lighthouse audits with performance budgets
- **Auto-Translation**: OpenAI-powered i18n translation on content changes
- **Auto-Deployment**: Staging and production deployments with preview environments
- **Dependency Management**: Automated Dependabot PRs with smart auto-merge

### Quality Gates
- ✅ All PRs must pass linting and type checking
- ✅ Security vulnerabilities automatically detected
- ✅ Performance regressions caught early
- ✅ Translations updated automatically
- ✅ Dependencies kept up-to-date

## 📜 Scripts

```bash
# Development
yarn dev                 # Start development server
yarn type-check          # Run TypeScript type checking
yarn lint                # Run ESLint
yarn lint:fix            # Fix ESLint issues automatically
yarn format              # Format code with Prettier
yarn format:check        # Check code formatting

# Production
yarn build               # Build for production

# Database
yarn fill-db             # Fill database with sample data

# Testing (when implemented)
yarn test                # Run unit tests
yarn test:e2e            # Run end-to-end tests
```

## Project Structure

```
src/
├── components/          # Reusable Vue components
├── composables/        # Pinia Colada API composables
├── layouts/            # App layouts
├── pages/              # Page components
├── services/           # API services and Supabase client
├── stores/             # Pinia stores
├── i18n/               # Internationalization files
└── css/                # Global styles
```

## Features in Detail

### Data Management
- **Pinia Colada**: Automatic caching and background refetching
- **Real-time Updates**: Optimistic updates with error handling
- **Offline Support**: Cached data available when offline

### UI/UX
- **Material Design**: Consistent Quasar components
- **Responsive**: Mobile-first design
- **Loading States**: Proper feedback during async operations
- **Error Handling**: User-friendly error messages

### Internationalization
- **Multi-language**: English and Polish support
- **Dynamic Switching**: Change language on the fly
- **Localized Messages**: All UI text is translatable

## Data Filler

To populate your database with sample data, run:

```bash
yarn fill-db
```

This will create:
- 15 sample students with Polish names
- 10 sample classes in various subjects
- Random class assignments for each student

## 🌍 Automated Translation Workflow

This project features automated i18n translation using OpenAI:

### How it Works
1. **Edit source language**: Make changes to `src/i18n/en-US.json`
2. **Automatic translation**: Push to main/develop triggers translation workflow
3. **AI translation**: OpenAI GPT-4 translates to Polish with context awareness
4. **Auto-commit**: Translated files are automatically committed back

### Configuration
Set up the following GitHub secrets:
- `OPENAI_API_KEY`: Your OpenAI API key for translations

### Supported Languages
- English (en-US) - Source language
- Polish (pl) - Auto-translated

## 🔧 Setup for Development

### Required Secrets
For full CI/CD functionality, configure these GitHub secrets:

```bash
# Translation
OPENAI_API_KEY=sk-...                    # OpenAI API for translations

# Deployment (optional)
NETLIFY_AUTH_TOKEN=netlify-token         # Netlify deployment
NETLIFY_SITE_ID=netlify-site-id          # Netlify site ID
NETLIFY_STAGING_SITE_ID=staging-site-id  # Netlify staging site

# Notifications (optional)  
SLACK_WEBHOOK_URL=https://hooks.slack... # Slack notifications
LHCI_GITHUB_APP_TOKEN=github-token      # Lighthouse CI
```

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Quick Start
1. Fork the repository
2. Create a feature branch (`git checkout -b feat/new-feature`) 
3. Make your changes following our coding standards
4. Ensure all checks pass (`yarn lint`, `yarn type-check`)
5. Create a Pull Request using our template

### Commit Convention
Use conventional commits:
```bash
feat: add student search functionality
fix: resolve class assignment bug  
docs: update API documentation
chore: update dependencies
```

## License

This project is licensed under the MIT License.