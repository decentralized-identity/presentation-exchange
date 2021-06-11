import { Ace } from 'ace-builds';

declare enum ValueUpdateMode {
    start = "start",
    end = "end",
    select = "select"
}
/**
 * Custom element Ace code editor
 */
declare class AceEditor extends HTMLElement {
    private static _observedAttributes;
    private _editor?;
    get editor(): Ace.Editor | undefined;
    get version(): {
        [key: string]: string;
    };
    value?: string;
    mode?: string;
    theme?: string;
    tabSize?: number;
    readonly?: boolean;
    softTabs?: boolean;
    wrap?: boolean;
    valueUpdateMode?: ValueUpdateMode;
    hideActiveLineHighlight?: boolean;
    hideGutter?: boolean;
    hideGutterLineHighlight?: boolean;
    hidePrintMargin?: boolean;
    basePath?: string;
    static get observedAttributes(): string[];
    /**
     * Registers an attribute to be observed.
     *
     * @param name Attribute name to observe.
     * @internal
     */
    addObservedAttribute(name: string): void;
    private dispatch;
    private initializeEditor;
    private appendStyles;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string): void;
    notifyPropertyChanged(name: string): void;
    resize(): void;
    private handleChange;
    private handleBlur;
}
interface AceEditor {
    addEventListener(type: 'change', listener: (event: CustomEvent<string>) => void): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: 'change', listener: (event: CustomEvent<string>) => void): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

export default AceEditor;
