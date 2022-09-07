// https://stackoverflow.com/questions/73612295/how-to-declare-in-typescript-a-dictionary-of-generic-in-the-ts-sense-functions?noredirect=1#comment129991838_73612295

type ID = string;
type VALUE = string | number | boolean | Date;
type AnyRow = Record<string, VALUE>;

// Default types for Id, In and Out
type DefaultId = ID | undefined;
type DefaultIn = AnyRow | undefined;
// Listings always return an array, even if an empty one, never undefined.
// Reads might return a row or undefined. Tried with `null` as well, to no avail.
type DefaultOut = AnyRow[] | (AnyRow | undefined);

// A handler might receive an Id or not, and it might accept (In) and return (Out) various responses
// I simplified a couple of things because they didn't affect my issue.
// - the return is actually a Promise.
// - There is actually a third input, a series of options,
//   such as, sort order, field to sort by, page to select
export type Handler<
  Id extends DefaultId,
  In extends DefaultIn,
  Out extends DefaultOut
> = (params: { id: Id; data: In }) => Out;

// A collection of handlers will have them keyed by a string
export type Handlers = Record<string, Handler<any, any, any>>;

// Given a series of handlers, `createDispatcher` will return
// a function that when called with the key to a handler and
// an object with the id and data
// returns whatever that keyed function returns, if anything.
export const createDispatcher =
  (handlers: Handlers) =>
  (fnName: string, requestData: { id: DefaultId; data: DefaultIn }) =>
    handlers[fnName](requestData);

// These are the types for a typical CRUD series of handlers, plus list
// They represent the most common combinations of inputs and outputs.
type Resolvers<T extends AnyRow> = {
  list: Handler<undefined, undefined, T[] | undefined>;
  create: Handler<undefined, T, T>;
  read: Handler<ID, undefined, T | undefined>;
  update: Handler<ID, T, T>;
  delete: Handler<ID, undefined, undefined>;
};

// The type of data we are handling in this example (absurdly simplyfied)
type Data = { a: number };

// This is the implementation of the handlers
// The conditional expression on `id` is just so it doesn't complain
// about not being used.  Whatever they do, is not really relevant.
const handlers: Resolvers<Data> = {
  list: () => [{ a: 1 }, { a: 2 }],
  read: ({ id }) => (id ? { a: 1 } : { a: 2 }),
  create: ({ data }) => data,
  update: ({ id, data }) => (id ? data : data),
  delete: ({ id }) => (id ? undefined : undefined),
};

// And here I create the actual dispatcher for the Data above
// with the text of the error shown below
export const dataDispatcher = createDispatcher(handlers);
//                                             ^^^^^^^^
// Argument of type 'Resolvers<Data>' is not assignable to parameter of type 'Handlers'.
//   Property 'list' is incompatible with index signature.
//     Type 'Handler<undefined, undefined, Data[] | undefined>' is not assignable to type 'Handler<DefaultId, DefaultIn, DefaultOut>'.
//       Type 'DefaultId' is not assignable to type 'undefined'.
//         Type 'string' is not assignable to type 'undefined'.
