# EZStore Technical Debt Report

## Main Sources of Technical Debt
- Some admin logic still relies on in-memory state rather than the database layer.
- The current auth flows are functional but need stronger session and permission handling.
- Some modules still need clearer separation between route handling, business logic, and persistence.
- Production deployment and monitoring patterns are not yet formalized.

## Impact
These issues do not block the app from running, but they will slow development, raise operational risk, and increase the cost of future features.

## Recommended Debt Reduction Plan
1. Replace remaining in-memory admin logic with Prisma-backed services.
2. Standardize shared services and repositories.
3. Add automated tests and CI checks.
4. Build observability and audit logging before adding more complex workflows.
