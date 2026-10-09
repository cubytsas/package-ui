import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  InputHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  SelectHTMLAttributes,
  SVGProps,
  TextareaHTMLAttributes,
} from "react";
import type { IconName } from "./index.js";

export type { IconName };
export { cx } from "./index.js";

/** Icon name from the built-in set, or any custom React node. */
export type IconSlot = IconName | ReactNode;

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type Tone = "info" | "success" | "warning" | "danger";

export declare function Icon(
  props: { name: IconName; size?: number } & Omit<SVGProps<SVGSVGElement>, "name">,
): ReactElement | null;

export declare function Spinner(props: {
  size?: number;
  /** Accessible label. Without it the spinner is decorative. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}): ReactElement;

type LinkProps = {
  /** Renders an `<a>` and routes clicks through `@cubyt/navigation`. */
  href?: string;
  external?: boolean;
  replace?: boolean;
  newTab?: boolean;
};

export type ButtonProps = LinkProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "onClick" | "href"> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    block?: boolean;
    loading?: boolean;
    icon?: IconSlot;
    iconEnd?: IconSlot;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  };

export declare function Button(props: ButtonProps): ReactElement;

export declare function IconButton(
  props: {
    icon: IconSlot;
    /** Required accessible label (also used as tooltip). */
    label: string;
    variant?: "ghost" | "overlay";
    size?: "md" | "lg";
  } & ButtonHTMLAttributes<HTMLButtonElement>,
): ReactElement;

export type FieldControlProps = {
  id: string;
  required?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

export declare function Field(props: {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  id?: string;
  className?: string;
  children: ReactElement | ((props: FieldControlProps) => ReactNode);
}): ReactElement;

export declare function Input(
  props: InputHTMLAttributes<HTMLInputElement> & {
    mono?: boolean;
    icon?: IconSlot;
    ref?: React.Ref<HTMLInputElement>;
  },
): ReactElement;

export declare function Textarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ref?: React.Ref<HTMLTextAreaElement>;
  },
): ReactElement;

export declare function Select(
  props: SelectHTMLAttributes<HTMLSelectElement> & {
    ref?: React.Ref<HTMLSelectElement>;
  },
): ReactElement;

export type DropdownOption<T extends string = string> = {
  value: T;
  label: ReactNode;
  disabled?: boolean;
};

export declare function DropdownSelect<T extends string = string>(
  props: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> & {
    value?: T;
    options: DropdownOption<T>[];
    onChange?: (value: T, option: DropdownOption<T>) => void;
    ariaLabel?: string;
    placeholder?: ReactNode;
    variant?: "plain" | "outlined";
    placement?: "auto" | "top" | "bottom";
    align?: "start" | "end";
    triggerClassName?: string;
    menuClassName?: string;
    optionClassName?: string;
    container?: Element | DocumentFragment | null;
  },
): ReactElement;

export declare function Tooltip(props: {
  label: string;
  children: ReactElement;
  className?: string;
  placement?: "auto" | "top" | "bottom";
}): ReactElement;

export declare function MenuPanel(props: HTMLAttributes<HTMLDivElement>): ReactElement;

export declare function MenuOption(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    selected?: boolean;
    ref?: React.Ref<HTMLButtonElement>;
  },
): ReactElement;

export type ChipOption<T extends string = string> = {
  value: T;
  label: ReactNode;
  icon?: IconSlot;
  disabled?: boolean;
};

export declare function ChipGroup<T extends string = string>(
  props:
    | {
        options: ChipOption<T>[];
        multiple?: false;
        value?: T;
        onChange?: (value: T) => void;
        label?: string;
        className?: string;
      }
    | {
        options: ChipOption<T>[];
        multiple: true;
        value?: T[];
        onChange?: (value: T[]) => void;
        label?: string;
        className?: string;
      },
): ReactElement;

export declare function Notice(props: {
  tone?: Tone;
  title?: ReactNode;
  /** Custom icon, or `false` to hide it. */
  icon?: IconSlot | false;
  className?: string;
  children?: ReactNode;
}): ReactElement;

export declare function EmptyState(props: {
  icon?: IconSlot | false;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}): ReactElement;

export type KeyValueItem = {
  key?: string;
  label: ReactNode;
  value: ReactNode;
  mono?: boolean;
};

export declare function KeyValue(props: {
  items: KeyValueItem[];
  className?: string;
}): ReactElement;

export declare function CodeBlock(props: {
  value: string;
  label?: ReactNode;
  /** Hide the value until clicked. */
  masked?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  revealLabel?: string;
  hideLabel?: string;
  onCopy?: (value: string) => void;
  className?: string;
}): ReactElement;

export declare function ListItem(
  props: LinkProps & {
    icon?: IconSlot;
    label: ReactNode;
    description?: ReactNode;
    trailing?: ReactNode;
    tone?: "danger";
    selected?: boolean;
    active?: boolean;
    disabled?: boolean;
    role?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    className?: string;
    id?: string;
    tabIndex?: number;
  },
): ReactElement;

export declare function Progress(props: {
  value?: number;
  max?: number;
  label?: string;
  indeterminate?: boolean;
  className?: string;
}): ReactElement;

export declare function Kbd(props: { children: ReactNode }): ReactElement;
