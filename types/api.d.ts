import './global';
declare global {
  type OptionsType = Record<string, number | string | boolean>;

  type OPERATION<IN> = {
    service: string;
    op: string;
    id?: ID;
    data?: IN;
    options?: OptionsType;
  };

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
