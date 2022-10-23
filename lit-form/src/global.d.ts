type VALUE = string | number | boolean | Date;
type AnyRow = Record<string, VALUE>;

declare global {
  interface HTMLElementEventMap {
    [FORM_SUBMIT_EVENT]: FormSubmitEvent;
    [FORM_CHANGED_EVENT]: FormChangedEvent;
    [INPUT_CHANGED_EVENT]: InputChangedEvent<VALUE>;
    [INPUT_RENDERED_EVENT]: InputRenderedEvent;
  }
}

type FieldData = Record<string, VALUE | undefined>;
type DirtyFields = Record<string, boolean>;
