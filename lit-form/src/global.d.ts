type VALUE = string | number | boolean | Date;
type AnyRow = Record<string, VALUE>;

declare global {
  interface HTMLElementEventMap {
    [FORM_SUBMIT_EVENT]: FormSubmit;
    [FORM_CHANGED_EVENT]: FormChanged;
    [INPUT_CHANGED_EVENT]: InputChanged<VALUE>;
  }
}

type FieldData = Record<string, VALUE | undefined>;
type DirtyFields = Record<string, boolean>;
