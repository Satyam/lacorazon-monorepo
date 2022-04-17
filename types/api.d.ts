import './global';
declare global {
  type OptionsType = Record<string, number | string | boolean>;

  type ApiReply<T> = Promise<{ data: T } | { error: number; data: string }>;

  type ApiRequest<Id, Data, Opts = OptionsType> = {
    service: string;
    op: string;
    options?: Opts;
  } & (Id extends undefined ? {} : { id: ID }) &
    (Data extends undefined ? {} : { data: Data });

  type RequestTransformer<IN> = {
    [key in keyof Partial<IN>]: (
      outVal: IN[key],
      key: keyof IN,
      row: IN
    ) => VALUE;
  };

  type ReplyTransformer<OUT> = {
    [key in keyof Partial<ArrayElementType<OUT>>]: (
      inVal: VALUE,
      key: keyof ArrayElementType<OUT>,
      row: Record<string, VALUE>
    ) => ArrayElementType<OUT>[key];
  };
}

export {};
