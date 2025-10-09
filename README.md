# Countdown Numbers Game Solver

A TypeScript solver for the Countdown numbers game.

## The Game

In the Countdown numbers game, you are given six integers and a target number. Using basic arithmetic operations (+, -, *, /), combine the six numbers to reach the target. Each number can only be used once, and all intermediate results must be positive integers.

## Website

A beautiful web interface is available in the `website/` directory, built with TypeScript and Vite.

**🌐 Live Demo:** The website is automatically deployed to [my website](https://johnsy.com/countdown/).

Features:
- Green-on-black display for the target
- Six blue number cards for input
- Keyboard navigation with Tab and Enter
- Solution display with step-by-step calculations
- Solutions grouped by number of steps (fewest first)
- Intermediate results highlighted with yellow background
- Responsive design for mobile and desktop

### Running the Website

```bash
pnpm run dev      # Start development server
pnpm run build    # Build for production
pnpm run preview  # Preview production build
```

## Development

### Setup

```bash
pnpm install
```

### Running Tests

```bash
pnpm test              # Run tests once
pnpm run test:watch    # Run tests in watch mode
pnpm run test:coverage # Run tests with coverage report
```

### Code Quality

```bash
pnpm run type-check    # Check TypeScript types
pnpm run lint          # Run ESLint
pnpm run format        # Format code with Prettier
pnpm run format:check  # Check if code is formatted
pnpm run precommit     # Run all checks (format, lint, type-check, test)
```

## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **CI Workflow**: Runs on all pushes and pull requests
  - Format checking with Prettier
  - Linting with ESLint
  - Type checking with TypeScript
  - Test suite with Vitest

- **Publish Workflow**: Deploys to GitHub Pages on main branch
  - Runs all precommit checks
  - Builds production website
  - Automatically deploys to gh-pages

- **Dependabot**: Keeps dependencies up to date
  - Weekly updates for npm packages and GitHub Actions
  - Groups minor and patch updates
  - Auto-merges when CI passes

## License

MIT


