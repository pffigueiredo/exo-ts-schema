declare module 'exo-primitives' {
  export type Uuid = string;
  export type LocalDateTime = string;
  export type LocalDate = string;
  export type Int = number;
  export type String = string;
  export type Boolean = boolean;
  export type Array<T> = T[];
  export type Set<T> = T[];

  export type Decorate<
    T,
    Options extends {
      defaultValue?: T;
      pk?: true;
      index?: true;
      optional?: true;
      unique?: true | string;
      jwt?: true | string;
      query?: string;
      access?: Access;
    } = {}
  > = {
    type: T;
    options: Options;
  };

  export type Access = {
    query?: boolean;
    mutation?: boolean;
    delete?: boolean;
    create?: boolean;
    boolean?: boolean;
  };

  export type ExoPrimitive =
    | Uuid
    | LocalDateTime
    | LocalDate
    | Int
    | String
    | Boolean
    | Array<any>
    | Decorate<any, any>
    | Set<any>;
}

declare module 'exo-types' {
  import { Access, ExoPrimitive } from 'exo-primitives';

  export type ExoIsEqual<A, B> = A extends B
    ? B extends A
      ? true
      : false
    : false;

  export type ExoContext<T extends Record<string, ExoPrimitive>> = T;

  export type ExoType<
    T extends Record<string, ExoPrimitive | ExoType<any, any>>,
    Options extends {
      access?: Access;
      plural?: string;
    }
  > = T & { __exoOptions: Options };

  export type ExoPostgres<T extends Array<ExoType<any, any>>> = T;

  export * from 'exo-primitives';
}
