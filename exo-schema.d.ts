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
