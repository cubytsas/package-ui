export type IconNode = [tag: string, attributes: Record<string, string>];

export declare const icons: {
  readonly x: IconNode[];
  readonly eye: IconNode[];
  readonly "eye-off": IconNode[];
  readonly info: IconNode[];
  readonly "alert-triangle": IconNode[];
  readonly "alert-circle": IconNode[];
  readonly check: IconNode[];
  readonly "check-circle": IconNode[];
  readonly copy: IconNode[];
  readonly "chevron-left": IconNode[];
  readonly "chevron-right": IconNode[];
  readonly "arrow-right": IconNode[];
  readonly play: IconNode[];
  readonly "external-link": IconNode[];
  readonly search: IconNode[];
  readonly download: IconNode[];
  readonly trash: IconNode[];
};

export type IconName = keyof typeof icons;
export declare const iconNames: IconName[];

export type IconOptions = {
  /** Width and height in pixels. Defaults to 16. */
  size?: number;
  /** Class applied to the root `<svg>`. Defaults to `cubyt-icon`. */
  className?: string;
};

export declare function iconSvg(name: IconName, options?: IconOptions): string;
export declare function createIcon(
  name: IconName,
  options?: IconOptions,
): SVGSVGElement;

export type LinkOptions = {
  /** Destination URL. Only HTTP(S) URLs are accepted. */
  href: string;
  /** Force a full-page navigation (another Cubyt app or site). */
  external?: boolean;
  /** Replace the current history entry instead of pushing a new one. */
  replace?: boolean;
  /** Open in a new tab with `noopener,noreferrer`. */
  newTab?: boolean;
  /** Paths owned by the current SPA router. Overrides `configureLinks`. */
  isInternalRoute?: (pathname: string) => boolean;
  /** Event dispatched after an SPA navigation. Defaults to `cubyt:navigate`. */
  eventName?: string;
};

export type Action = Partial<LinkOptions> & {
  /** Runs before `href`. Return `false` to skip following `href`. */
  onClick?: (event?: unknown) => unknown;
};

export declare function configureLinks(options: {
  isInternalRoute?: (pathname: string) => boolean;
  eventName?: string;
}): void;
export declare function safeHref(
  href: string | undefined,
  base?: string,
): string | undefined;
export declare function isExternalHref(href: string): boolean;
export declare function followLink(link: LinkOptions): void;
export declare function resolveAction(
  action: Action | undefined,
  event?: unknown,
): Promise<unknown>;
export declare function isModifiedClick(event: {
  defaultPrevented?: boolean;
  button?: number;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
} | null | undefined): boolean;

export declare function cx(
  ...values: Array<string | false | null | undefined | 0>
): string;
export declare function copyText(text: string): Promise<boolean>;
