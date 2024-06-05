export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      businessId?: string;
    }
    firstName?: string;
    lastName?: string;
    fullName?: string;
  }
}