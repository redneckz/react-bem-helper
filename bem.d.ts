interface CSSModule {
    [className: string]: string;
}

interface DOMAttrs {
    id?: string;
    className?: string;
    style?: { [key: string]: string };
    tabIndex?: string;
    type?: string;
    name?: string;
    value?: string;
    checked?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    accept?: string;
    autoComplete?: 'on' | 'off';
    autoFocus?: boolean;
    required?: boolean;
    htmlFor?: string;
    label?: string;
    title?: string;
    rows?: number;
    role?: string;
    lang?: string;
    inputmode?: string;
    list?: string;
    max?: string | number;
    maxLength?: string | number;
    min?: string | number;
    minLength?: string | number;
    multiple?: boolean;
    step?: string | number;
    pattern?: string;
    placeholder?: string;
    spellcheck?: boolean;
    width?: string | number;
    height?: string | number;
    onClick?: React.MouseEventHandler;
    onDoubleClick?: React.MouseEventHandler;
    onMouseDown?: React.MouseEventHandler;
    onMouseMove?: React.MouseEventHandler;
    onMouseUp?: React.MouseEventHandler;
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    onMouseOver?: React.MouseEventHandler;
    onMouseOut?: React.MouseEventHandler;
    onDrag?: React.DragEventHandler;
    onDragEnd?: React.DragEventHandler;
    onDragEnter?: React.DragEventHandler;
    onDragExit?: React.DragEventHandler;
    onDragLeave?: React.DragEventHandler;
    onDragOver?: React.DragEventHandler;
    onDragStart?: React.DragEventHandler;
    onDrop?: React.DragEventHandler;
    onKeyDown?: React.KeyboardEventHandler;
    onKeyPress?: React.KeyboardEventHandler;
    onKeyUp?: React.KeyboardEventHandler;
    onChange?: React.ChangeEventHandler;
    onInput?: (event: React.SyntheticEvent<any>) => any;
    onInvalid?: (event: React.SyntheticEvent<any>) => any;
    onSubmit?: (event: React.SyntheticEvent<any>) => any;
    onTouchStart?: React.TouchEventHandler;
    onTouchMove?: React.TouchEventHandler;
    onTouchEnd?: React.TouchEventHandler;
    onTouchCancel?: React.TouchEventHandler;
    onFocus?: React.FocusEventHandler;
    onBlur?: React.FocusEventHandler;
    onScroll?: React.UIEventHandler;
    onWheel?: React.WheelEventHandler;
    onSelect?: (event: React.SyntheticEvent<any>) => any;
}

type Component<A> = React.ComponentType<A>;

type DOMComponent<Attrs = {}> = Component<Attrs & DOMAttrs>;

interface BEMEntityProps {
    className?: string;
    'data-modifiers'?: string | void;
}

interface BEMFactory {
    // block HOC
    <BlockType extends string | React.ComponentType<any>>(
        component: BlockType,
    ): BlockType extends string ? DOMComponent : BlockType;
    // element
    [elementName: string]: <
        ElementType extends string | React.ComponentType<any>
    >(
        component: ElementType,
    ) => ElementType extends string ? DOMComponent : ElementType;
}

interface BlockContext {
    name: string;
    styles: CSSModule | void;
}

type UnaryFn<A, R> = (a: A) => R;

type HOC<A, R> = UnaryFn<string | Component<A>, Component<R>>;

type Diff<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

type BEMEntityHOC<Props> = HOC<Props, Diff<Props, BEMEntityProps>>;

type ModifiersMap<Props> = (props: Props, blockModifiers?: string[]) => any;

type ModifierPredicate = (modifiers: string[]) => boolean;

declare module '@redneckz/react-bem-helper' {
    export function createBlockContext(
        name: string,
        styles?: CSSModule | void,
    ): BlockContext;
    export function block(
        context: BlockContext,
    ): <Props extends { className?: string }>(
        modifiersMap?: (props: Props) => any,
    ) => BEMEntityHOC<Props>;
    export function element(
        context: BlockContext,
    ): <
        Props extends {
            className?: string;
            modifiersMap?: ModifiersMap<Props>;
            options?: { styles?: CSSModule };
        }
    >(
        modifiersMap?: (props: Props) => any,
    ) => BEMEntityHOC<Props>;
    export function transparent<Props>(
        map: ModifiersMap<Props>,
    ): ModifiersMap<Props>;
    export function modifier<Props extends { 'data-modifiers'?: string }>(
        predicate: ModifierPredicate,
        ModifiedComponent: string | Component<Props>,
    ): Component<Props>;
    export function BEM(styles: { [key: string]: string }): BEMFactory;
    export function pick<T extends {}>(
        keys?: string[],
    ): (obj?: T) => { [P in keyof T]: T[P] };
    export function capitalize(str?: unknown): string;
    export function decapitalize(str?: unknown): string;
    export function kebabCase(str?: unknown): string;
    export function kebabToCamelCase(str?: unknown): string;
    export function classNamesList(
        styles?: CSSModule,
    ): <T>(...args: T[]) => string[];
    export function tag(
        tagName: string,
    ): <Attrs extends {}>(attrs?: Attrs) => DOMComponent<Attrs>;
    export function div<Attrs extends {}>(attrs?: Attrs): DOMComponent<Attrs>;
    export function span<Attrs extends {}>(attrs?: Attrs): DOMComponent<Attrs>;
    export function form<Attrs extends {}>(attrs?: Attrs): DOMComponent<Attrs>;
    export function button<Attrs extends {}>(
        attrs?: Attrs,
    ): DOMComponent<Attrs>;
    export function input<Attrs extends {}>(attrs?: Attrs): DOMComponent<Attrs>;
    export function label<Attrs extends {}>(attrs?: Attrs): DOMComponent<Attrs>;
    export function textarea<Attrs extends {}>(
        attrs?: Attrs,
    ): DOMComponent<Attrs>;
    export function is(mod: string): (modifiersList: string[]) => boolean;
    export function startsWith(
        prefix: string,
    ): (modifiersList: string[]) => boolean;
    export function and(
        ...predicates: ModifierPredicate[],
    ): (modifiersList: string[]) => boolean;
    export function or(
        ...predicates: ModifierPredicate[],
    ): (modifiersList: string[]) => boolean;
    export function not(
        predicate: ModifierPredicate,
    ): (modifiersList: string[]) => boolean;
}
