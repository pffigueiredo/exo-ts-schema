# Exograph TS Primitives

This package provides a set of unofficial TypeScript utilities for creating an Exograph schema.

### Primitives

- Uuid
- LocalDateTime
- LocalDate
- Int
- String
- Boolean
- Array<Type>
- Decorate<Type, Options>
- Set<Type>
- ExoIsEqual<Type>

### Composites

- ExoContext
- ExoType
- ExoPostgres

### Example of Usage

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

type AuthUserContext = ExoContext<{
  authUserId: Decorate<
    Uuid,
    {
      query: 'getAuthUserId';
    }
  >;
}>;

type AuthContext = ExoContext<{
  clerkId: Decorate<
    String,
    {
      jwt: 'sub';
    }
  >;
  role: Decorate<
    String,
    {
      jwt: true;
    }
  >;
  email: Decorate<
    String,
    {
      jwt: true;
    }
  >;
  firstName: Decorate<
    String,
    {
      jwt: true;
    }
  >;
  lastName: Decorate<
    String,
    {
      jwt: true;
    }
  >;
}>;

type Concert = ExoType<
  {
    id: Decorate<
      Uuid,
      {
        pk: true;
        defaultValue: Uuid;
      }
    >;
    title: Decorate<
      String,
      {
        index: true;
      }
    >;
    description: String;
    memberPrice: Int;
    nonMemberPrice: Int;
    venue: Venue;
    ticketLink: Decorate<
      String,
      {
        optional: true;
      }
    >;
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

type Venue = ExoType<
  {
    id: Decorate<
      Uuid,
      {
        pk: true;
        defaultValue: Uuid;
      }
    >;
    name: Decorate<
      String,
      {
        index: true;
      }
    >;
    street: String;
    city: String;
    state: String;
    zip: String;
    concerts: Set<Concert>;
    publish: Boolean;
  },
  {
    access: {
      query:
        | ExoIsEqual<Venue['publish'], true>
        | ExoIsEqual<AuthContext['role'], 'admin'>;
      mutation: ExoIsEqual<AuthContext['role'], 'admin'>;
    };
  }
>;

type Membership = ExoType<
  {
    id: Decorate<
      Uuid,
      {
        pk: true;
        defaultValue: Uuid;
      }
    >;
    authUser: Decorate<
      AuthUser,
      {
        index: true;
      }
    >;
    spouseFirstName: Decorate<
      String,
      {
        index: true;
      }
    >;
    spouseLastName: Decorate<
      String,
      {
        index: true;
      }
    >;
    spouseEmail: Decorate<
      String,
      {
        optional: true;
      }
    >;
    expiry: Decorate<
      LocalDate,
      {
        index: true;
        access: {
          query: true;
          mutation: ExoIsEqual<AuthContext['role'], 'admin'>;
        };
      }
    >;
    type: Decorate<
      String,
      {
        index: true;
        access: {
          query: true;
          mutation: ExoIsEqual<AuthContext['role'], 'admin'>;
        };
      }
    >;
    payments: Set<Payment>;
  },
  {
    access: {
      query: ExoIsEqual<AuthContext['role'], 'admin'>;
      mutation: ExoIsEqual<AuthContext['role'], 'admin'>;
      delete: ExoIsEqual<AuthContext['role'], 'admin'>;
    };
  }
>;

type Rsvp = ExoType<
  {
    id: Decorate<
      Uuid,
      {
        pk: true;
        defaultValue: Uuid;
      }
    >;
    email: Decorate<
      String,
      {
        unique: 'concert_email';
      }
    >;
    concert: Decorate<
      Concert,
      {
        unique: 'concert_email';
      }
    >;
    numTickets: Int;
  },
  {
    access: {
      query: ExoIsEqual<AuthContext['role'], 'admin'>;
      mutation: ExoIsEqual<AuthContext['role'], 'admin'>;
      delete: ExoIsEqual<AuthContext['role'], 'admin'>;
    };
  }
>;

type Notification = ExoType<
  {
    id: Decorate<
      Uuid,
      {
        pk: true;
        defaultValue: Uuid;
      }
    >;
    concert: Decorate<
      Concert,
      {
        optional: true;
      }
    >;
    subject: Decorate<
      String,
      {
        index: true;
      }
    >;
    message: String;
    postMessage: String;
  },
  {
    access: {
      query: ExoIsEqual<AuthContext['role'], 'admin'>;
    };
  }
>;

type Advisory = ExoType<
  {
    id: Decorate<
      Uuid,
      {
        pk: true;
        defaultValue: Uuid;
      }
    >;
    level: Decorate<String>;
    message: Decorate<String>;
    footer: Decorate<String, { optional: true }>;
  },
  {
    access: {
      query: true;
      mutation: ExoIsEqual<AuthContext['role'], 'admin'>;
    };
    plural: 'advisories';
  }
>;

type AuthUser = ExoType<
  {
    id: Decorate<
      Uuid,
      {
        pk: true;
        defaultValue: Uuid;
      }
    >;
    clerkId: Decorate<
      String,
      {
        unique: true;
      }
    >;
    email: Decorate<
      String,
      {
        unique: true;
      }
    >;
    firstName: Decorate<
      String,
      {
        index: true;
      }
    >;
    lastName: Decorate<
      String,
      {
        index: true;
      }
    >;
    membership: Membership;
  },
  {
    access: {
      query:
        | ExoIsEqual<AuthUser['clerkId'], AuthContext['clerkId']>
        | ExoIsEqual<AuthContext['role'], 'admin'>;
      mutation: ExoIsEqual<AuthContext['role'], 'admin'>;
    };
  }
>;

type Payment = ExoType<
  {
    id: Decorate<
      Uuid,
      {
        pk: true;
        defaultValue: Uuid;
      }
    >;
    membership: Membership;
    date: LocalDate;
    note: String;
    infoOnly: Boolean;
  },
  {
    access: {
      query: ExoIsEqual<AuthContext['role'], 'admin'>;
      create: ExoIsEqual<AuthContext['role'], 'admin'>;
      delete: false;
      update: false;
    };
  }
>;

type Artist = ExoType<
  {
    id: Decorate<
      Uuid,
      {
        pk: true;
        defaultValue: Uuid;
      }
    >;
    title: Decorate<String, { optional: true }>;
    name: Decorate<String, { index: true }>;
    bio: Decorate<String, { optional: true }>;
    photoUrl: Decorate<String, { optional: true }>;
    youtubeVideoIds: Decorate<Array<String>, { optional: true }>;
    instruments: Decorate<Array<String>>;
    publish: Decorate<Boolean, { index: true }>;
    artistConcerts: Set<ConcertArtist>;
  },
  {
    access: {
      query:
        | ExoIsEqual<Artist['publish'], true>
        | ExoIsEqual<AuthContext['role'], 'admin'>;
      mutation: ExoIsEqual<AuthContext['role'], 'admin'>;
    };
  }
>;

type ConcertArtist = ExoType<
  {
    id: Decorate<
      Uuid,
      {
        pk: true;
        defaultValue: Uuid;
      }
    >;
    concert: Concert;
    artist: Artist;
    isMain: Decorate<Boolean>;
    rank: Int;
    instrument: String;
  },
  {
    access: {
      query: true;
      mutation: ExoIsEqual<AuthContext['role'], 'admin'>;
    };
  }
>;

export declare const exoSchema: ExoPostgres<
  [Concert, Venue, Membership, Rsvp, Notification, Advisory, AuthUser]
>;
```

Results in the following schema 👇:

```exograph
context AuthContext {
  @jwt("sub") clerkId: String?
  @jwt role: String
  @jwt email: String
  @jwt firstName: String
  @jwt lastName: String
}

context AuthUserContext {
  @query("getAuthUserId") authUserId: Uuid
}

@postgres
module Concertmodule {
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
    @index publish: Boolean
    rsvps: Set<Rsvp>?
    notifications: Set<Notification>?
    concertArtists: Set<ConcertArtist>
  }

  @access(query=self.publish || AuthContext.role == "admin", mutation=AuthContext.role == "admin")
  type Venue {
    @pk id: Uuid = generate_uuid()
    @index name: String
    street: String
    city: String
    state: String
    zip: String
    concerts: Set<Concert>?
    @index publish: Boolean
  }

  @access(query=self.publish || AuthContext.role == "admin", mutation=AuthContext.role == "admin")
  type Artist {
    @pk id: Uuid = generate_uuid()
    title: String?
    @index name: String
    bio: String?
    photoUrl: String?
    youtubeVideoIds: Array<String>?
    instruments: Array<String>
    @index publish: Boolean
    artistConcerts: Set<ConcertArtist>?
  }

  @access(query=true, mutation=AuthContext.role == "admin")
  type ConcertArtist {
    @pk id: Uuid = generate_uuid()
    concert: Concert
    artist: Artist
    @index isMain: Boolean
    rank: Int
    instrument: String
  }

  @access(AuthContext.role == "admin")
  type Subscription {
    @pk id: Uuid = generate_uuid()
    @unique email: String
    group: String
  }

  @access(query=AuthContext.role == "admin" || self.authUser.id == AuthUserContext.authUserId,
          mutation=AuthContext.role == "admin" || self.authUser.id == AuthUserContext.authUserId,
          delete=AuthContext.role == "admin")
  type Membership {
    @pk id: Uuid = generate_uuid()
    @unique authUser: AuthUser
    @index spouseFirstName: String?
    @index spouseLastName: String?
    spouseEmail: String?

    @index
    @access(query=true, mutation=AuthContext.role == "admin")
    expiry: LocalDate?

    @index
    @access(query=true, mutation=AuthContext.role == "admin", create=true)
    type: String
    payments: Set<Payment>?
  }

  @access(AuthContext.role == "admin")
  type Rsvp {
    @pk id: Uuid = generate_uuid()
    @unique("concert_email") email: String
    @unique("concert_email") concert: Concert
    numTickets: Int
  }

  @access(AuthContext.role == "admin")
  type Notification {
    @pk id: Uuid = generate_uuid()
    concert: Concert?
    @index subject: String
    message: String
    postMessage: String
  }

  @access(query=true, mutation=AuthContext.role == "admin")
  @plural("advisories")
  type Advisory {
    @pk id: Uuid = generate_uuid()
    level: String
    message: String
    footer: String?
  }

  @access(query=self.clerkId == AuthContext.clerkId || AuthContext.role == "admin", mutation=AuthContext.role == "admin")
  type AuthUser {
    @pk id: Uuid = generate_uuid()
    @unique clerkId: String?
    @unique email: String?
    @index firstName: String?
    @index lastName: String?
    membership: Membership?
  }

  @access(query=AuthContext.role == "admin", create=AuthContext.role == "admin", delete=false, update=false)
  type Payment {
    @pk id: Uuid = generate_uuid()
    membership: Membership
    date: LocalDate
    note: String
    infoOnly: Boolean = false
  }
}
```
