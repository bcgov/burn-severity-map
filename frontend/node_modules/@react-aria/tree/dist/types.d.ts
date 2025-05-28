import { AriaGridListOptions, AriaGridListProps, GridListProps, AriaGridListItemOptions, GridListItemAria } from "@react-aria/gridlist";
import { DOMAttributes, KeyboardDelegate, RefObject, FocusableElement, Node } from "@react-types/shared";
import { TreeState } from "@react-stately/tree";
import { AriaButtonProps } from "@react-types/button";
export function useTree(): {};
export interface TreeGridListProps<T> extends GridListProps<T> {
}
export interface AriaTreeGridListProps<T> extends Omit<AriaGridListProps<T>, 'keyboardNavigationBehavior'> {
}
export interface AriaTreeGridListOptions<T> extends Omit<AriaGridListOptions<T>, 'children' | 'shouldFocusWrap'> {
    /**
     * An optional keyboard delegate implementation for type to select,
     * to override the default.
     */
    keyboardDelegate?: KeyboardDelegate;
}
export interface TreeGridListAria {
    /** Props for the treegrid element. */
    gridProps: DOMAttributes;
}
/**
 * Provides the behavior and accessibility implementation for a single column treegrid component with interactive children.
 * A tree grid provides users with a way to navigate nested hierarchical information.
 * @param props - Props for the treegrid.
 * @param state - State for the treegrid, as returned by `useTreeState`.
 * @param ref - The ref attached to the treegrid element.
 */
export function useTreeGridList<T>(props: AriaTreeGridListOptions<T>, state: TreeState<T>, ref: RefObject<HTMLElement | null>): TreeGridListAria;
export interface AriaTreeGridListItemOptions extends Omit<AriaGridListItemOptions, 'isVirtualized'> {
    /** An object representing the treegrid item. Contains all the relevant information that makes up the treegrid row. */
    node: Node<unknown>;
}
export interface TreeGridListItemAria extends GridListItemAria {
    /** Props for the tree grid row element. */
    rowProps: DOMAttributes;
    /** Props for the tree grid cell element within the tree grid list row. */
    gridCellProps: DOMAttributes;
    /** Props for the tree grid row description element, if any. */
    descriptionProps: DOMAttributes;
    /** Props for the tree grid row expand button. */
    expandButtonProps: AriaButtonProps;
}
/**
 * Provides the behavior and accessibility implementation for a row in a tree grid list.
 * @param props - Props for the row.
 * @param state - State of the parent list, as returned by `useTreeState`.
 * @param ref - The ref attached to the row element.
 */
export function useTreeGridListItem<T>(props: AriaTreeGridListItemOptions, state: TreeState<T>, ref: RefObject<FocusableElement | null>): TreeGridListItemAria;

//# sourceMappingURL=types.d.ts.map
