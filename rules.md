# Cursor AI Development Rules - Nigerian Agro Marketplace

## Testing Requirements
- Write Jest tests for every new component or endpoint
- Include unit tests for utility functions
- Add integration tests for API routes
- Test mobile responsiveness on components
- Include accessibility tests using @testing-library

## Code Structure Constraints
- Maximum 200 lines per component file
- Extract complex logic into custom hooks
- Use TypeScript interfaces for all props and API responses
- Follow Next.js 14 app router conventions strictly
- Keep API routes under 100 lines each

## Supabase Specific Rules
- Always use typed Supabase client queries
- Implement RLS policies for every table operation
- Use Supabase real-time subscriptions efficiently (unsubscribe on cleanup)
- Handle Supabase errors explicitly, don't use generic try-catch
- Use Supabase storage with proper file size limits (max 5MB for images)

## Mobile-First Constraints
- Every component must work on 320px width minimum
- Use touch-friendly button sizes (minimum 44px)
- Implement loading states for slow connections (show within 100ms)
- Add skeleton screens instead of spinners
- Optimize images automatically (next/image with quality=75)

## Nigerian Context Requirements
- Use Naira (₦) symbol consistently, format with commas
- Include Nigerian phone number validation (+234)
- Support major Nigerian crops only: Rice, Maize, Cassava, Yam, Plantain, Cocoa, Palm Oil
- Use Nigerian states and LGAs from predefined list
- Default to Lagos timezone (WAT)

## Performance Restrictions
- Bundle size per page must stay under 500KB
- API responses under 3 seconds
- Images compressed to under 500KB before upload
- Maximum 5 API calls per page load
- Use React.memo() for expensive components

## Security Requirements
- Never log sensitive data (passwords, tokens, personal info)
- Validate all user inputs on both client and server
- Use environment variables for all secrets
- Implement rate limiting on API routes (10 requests/minute per user)
- Sanitize user-generated content before display

## Code Quality Rules
- Use descriptive variable names (no single letters except for loops)
- Add JSDoc comments for complex functions
- Use consistent error handling patterns
- Implement proper loading and error states for all async operations
- Follow consistent file naming: kebab-case for components, camelCase for functions

## UI/UX Constraints
- Use shadcn/ui components only, no custom CSS components
- Stick to defined color palette (green/orange agricultural theme)
- Maximum 3 levels of nested components
- Include proper ARIA labels for accessibility
- Use consistent spacing scale (4px, 8px, 16px, 24px, 32px)

## API Design Rules
- REST endpoints only, follow RESTful conventions
- Maximum 3 parameters per GET request
- Use proper HTTP status codes
- Return consistent error response format
- Include request/response TypeScript types

## Database Interaction Rules
- Use Supabase query builder, avoid raw SQL unless necessary
- Implement pagination for lists over 20 items
- Use database transactions for related operations
- Index all commonly queried columns
- Soft delete records instead of hard delete

## File Organization Rules
- Components in /components folder with subfolders by feature
- API routes in /app/api with descriptive names
- Types in /types folder with feature-based files
- Utils in /lib folder, maximum 5 functions per file
- Constants in /constants folder

## Deployment Constraints
- All environment variables documented in .env.example
- Include proper error boundaries for production
- Add monitoring for critical user paths
- Use proper SEO meta tags for public pages
- Implement proper 404 and error pages

## Nigerian Specific Technical Rules
- Test on slow 2G connections (use Chrome DevTools)
- Support offline functionality for core features
- Use SMS for critical notifications (payment confirmations)
- Include Hausa, Igbo, Yoruba language support placeholders
- Optimize for Android devices (70% of Nigerian mobile users)

## Development Workflow Rules
- Create feature branch for each major component
- Write commit messages in present tense
- Include screenshot for UI changes in PR description
- Test on mobile device before marking feature complete
- Update documentation for new API endpoints

## Don'ts - Never Do These
- Don't install additional UI libraries beyond shadcn/ui
- Don't use external state management (Redux, Zustand) - use React state
- Don't create custom hooks without tests
- Don't hardcode API endpoints - use environment variables
- Don't skip error handling for async operations
- Don't create components over 200 lines
- Don't use any/unknown TypeScript types
- Don't implement features without mobile consideration first

## Performance Monitoring
- Add console.time() for operations over 100ms
- Monitor Supabase query performance
- Track Core Web Vitals metrics
- Alert if bundle size increases over 10%
- Monitor API response times

## Quality Gates
- All tests must pass before commit
- TypeScript strict mode must pass
- ESLint warnings must be under 5 per file
- Lighthouse score above 90 for mobile
- No console.log in production code

## Emergency Constraints
- If build fails, revert immediately
- If tests break, fix before adding new features
- If Supabase quota exceeded, implement caching immediately
- If mobile performance drops below acceptable, pause feature development