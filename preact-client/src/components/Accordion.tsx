import {
  h,
  ComponentChildren,
  toChildArray,
  VNode,
  cloneElement,
} from 'preact';
import { useState, useEffect } from 'preact/hooks';

type AccordionPanelProps = {
  label: string;
  name: string;
  open?: boolean;
  onToggle?: h.JSX.GenericEventHandler<HTMLDetailsElement>;
};

const signatureAccordionPanel = Symbol('AccordionPanel');
export const AccordionPanel = ({
  label,
  name,
  open,
  children,
  onToggle,
}: AccordionPanelProps & { children: ComponentChildren }) => (
  <details open={open} className="card" data-name={name} onToggle={onToggle}>
    <summary className="card-header">{label}</summary>

    <div className="card-body">{children} </div>
  </details>
);

AccordionPanel.signature = signatureAccordionPanel;

export const Accordion = ({
  mutuallyExclusive = true,
  allClose = true,
  initiallyOpen = [],
  heading = '',
  children,
}: {
  mutuallyExclusive?: boolean;
  allClose?: boolean;
  initiallyOpen?: string[];
  heading?: string;
  children: ComponentChildren;
}) => {
  const [nowOpen, setOpen] = useState<string[]>(initiallyOpen);

  const panels = toChildArray(children).filter(
    // @ts-ignore
    (p) => typeof p === 'object' && p.type.signature === signatureAccordionPanel
  ) as VNode<AccordionPanelProps>[];

  useEffect(() => {
    if (mutuallyExclusive && nowOpen.length > 1) {
      setOpen([nowOpen[0]]);
    }
    if (panels[0] && !allClose && nowOpen.length === 0) {
      setOpen([panels[0].props.name]);
    }
  }, []);

  const onToggle = (ev: MouseEvent) => {
    ev.stopPropagation();
    const panel = ev.target as HTMLDetailsElement;
    const name = panel.dataset.name ?? '';

    if (nowOpen.includes(name) === panel.open) return;
    if (nowOpen.includes(name)) {
      if (allClose || nowOpen.length > 1) {
        setOpen(nowOpen.filter((k) => k !== name));
      }
    } else if (mutuallyExclusive) {
      setOpen([name]);
    } else {
      setOpen(nowOpen.concat(name));
    }
  };

  return (
    <fieldset>
      {heading && <legend>{heading}</legend>}
      {panels.map((panel) => {
        const name = panel.props.name;
        return cloneElement(panel, {
          key: name,
          open: nowOpen.includes(name),
          onToggle,
        });
      })}
    </fieldset>
  );
};
