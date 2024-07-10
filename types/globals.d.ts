export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      businessId?: string;
    }
    membership: Record<string, string>;
    firstName?: string;
    lastName?: string;
    fullName?: string;
  }
}