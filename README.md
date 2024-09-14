# Exograph TypeScript Schema Builder

This package provides unofficial TypeScript utilities for creating Exograph schemas with enhanced type safety and developer experience.

## Key Features

- Type-safe schema definition
- Improved IDE autocompletion
- Seamless integration with TypeScript projects

I apologize for the confusion. You're right, and I understand you want the markdown with proper code block annotations for easy copying into VSCode. Here's the full version with appropriate markdown annotations:
markdownCopy# Exograph TypeScript Schema Builder

This package provides unofficial TypeScript utilities for creating Exograph schemas with enhanced type safety and developer experience.

## Key Features

- Type-safe schema definition
- Improved IDE autocompletion
- Seamless integration with TypeScript projects

## Primitives

- Uuid
- LocalDateTime
- LocalDate
- Int
- String
- Boolean
- Array<T>
- Set<T>

## Utility Types

- Decorate<T, Options>: Add metadata to fields
- ExoIsEqual<T>: Type-safe equality checks for access control

## Composites

- ExoContext<T>: Define context objects
- ExoType<T, Options>: Define database types with access control
- ExoPostgres<T>: Define the overall schema

## Example Usage

```typescript
import type {
  Boolean,
  Decorate,
  ExoContext,
  ExoIsEqual,
  ExoPostgres,
  ExoType,
  Int,
  LocalDate,
  LocalDateTime,
  Set,
  String,
  Uuid,
} from 'exo-types';

// Define a user context with custom access properties
type AuthUserContext = ExoContext<{
  authUserId: Decorate<Uuid, { query: 'getAuthUserId' }>;
}>;

// Define a broader authentication context
type AuthContext = ExoContext<{
  clerkId: Decorate<String, { jwt: 'sub' }>;
  role: Decorate<String, { jwt: true }>;
  email: Decorate<String, { jwt: true }>;
  firstName: Decorate<String, { jwt: true }>;
  lastName: Decorate<String, { jwt: true }>;
}>;

// Define the 'Concert' type with fields and access control
type Concert = ExoType<
  {
    id: Decorate<Uuid, { pk: true; defaultValue: Uuid }>;
    title: Decorate<String, { index: true }>;
    description: String;
    memberPrice: Int;
    nonMemberPrice: Int;
    venue: Venue;
    ticketLink: Decorate<String, { optional: true }>;
    photoUrl: String;
    startTime: LocalDateTime;
    endTime: LocalDateTime;
    publish: Boolean;
    rsvps: Rsvp[];
    notifications: Notification[];
    concertArtists: ConcertArtist[];
  },
  {
    access: {
      query:
        | ExoIsEqual<Concert['publish'], true>
        | ExoIsEqual<AuthContext['role'], 'admin'>;
      mutation: ExoIsEqual<AuthContext['role'], 'admin'>;
    };
  }
>;

// Additional types, including 'Venue', 'Membership', and more...
```

This code results in an Exograph schema with complex access controls and relationships between various types.

## Generated Schema

The usage example above produces an Exograph schema with detailed access controls, relationships, and attributes. For instance, the Concert type includes fields for concert details, pricing, and access rules based on the user’s role or the concert’s publish status.

Example generated schema snippet:

```
@access(query=self.publish || AuthContext.role == "admin", mutation=AuthContext.role == "admin")
type Concert {
  @pk id: Uuid = generate_uuid()
  @index title: String
  description: String
  memberPrice: Int
  nonMemberPrice: Int
  venue: Venue
  ticketLink: String?
  photoUrl: String
  @index startTime: LocalDateTime
  @index endTime: LocalDateTime
  publish: Boolean
  rsvps: Set<Rsvp>?
  notifications: Set<Notification>?
  concertArtists: Set<ConcertArtist>
}
```
