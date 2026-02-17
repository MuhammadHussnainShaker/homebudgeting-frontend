# homebudgeting-frontend

Simple home budgeting app to plan monthly budgets and track incomes, savings, monthly expenses, daily expenses. Built with the MERN stack.

## Testing

This project uses [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/react) for testing. The test suite includes comprehensive unit and integration tests covering:

- **Core Business Logic**: Calculation utilities, state management helpers
- **Services**: Firebase client initialization and authentication
- **UI Components**: Error messages, loading spinners, forms
- **Page Components**: All major pages (Home, Dashboard, MonthlyExpenses, DailyExpenses, etc.)
- **Auth Flow**: Login, Signup, Password Reset, Email Verification
- **Utility Functions**: Keyboard handlers, date manipulations, list operations

### Running Tests

#### Run all tests once (CI mode)
```bash
bun run test:run
```

#### Run tests in watch mode (development)
```bash
bun run test
```

#### Run specific test files
```bash
bun run test:run src/utils/calculations.test.js
```

#### Run tests with coverage
```bash
bun run test -- --coverage
```

### Test Structure

Tests are colocated with their implementation files:
- Component tests: `src/components/**/*.test.jsx`
- Page tests: `src/pages/**/*.test.jsx`
- Utility tests: `src/utils/**/*.test.js`
- Service tests: `src/services/**/*.test.js`

### Test Configuration

- **Test Framework**: Vitest 4.0.18
- **Testing Library**: @testing-library/react 16.3.2
- **Test Environment**: jsdom 27.4.0
- **Setup File**: `src/tests/setup.jsx` (Firebase mocks, global config)
- **Config File**: `vitest.config.js`

### Writing New Tests

When adding new features, follow these patterns:

1. **Component Tests**: Test rendering, user interactions, and edge cases
2. **Utility Tests**: Test pure functions with various inputs including edge cases
3. **Integration Tests**: Test component interactions and data flow
4. **Mock External Dependencies**: Firebase, API calls, browser APIs

Example test structure:
```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles user interaction', () => {
    render(<MyComponent />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Result')).toBeInTheDocument()
  })
})
```

### Current Test Coverage

- **Test Files**: 44 files
- **Total Tests**: 214 tests
- **Coverage Areas**:
  - ✅ Core utilities (calculations, list state, keyboard handlers)
  - ✅ Firebase service configuration
  - ✅ UI components (error messages, loading states)
  - ✅ Auth components (login, signup, password reset, email verification)
  - ✅ All page components
  - ✅ Data management (CRUD operations for expenses, incomes, savings)
  - ✅ Store management (Zustand stores)

### Notes

- Some pre-existing test failures exist in auth component tests due to Firebase UI mocking complexity
- Tests use mocked Firebase services to avoid requiring real Firebase credentials
- All new features should include corresponding tests
