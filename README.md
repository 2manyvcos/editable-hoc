# Editable HOC

## Example

```js
import withChanges from 'editable-hoc';

export default withChanges(InnerComponent);
```

## Definition

```ts
function withChanges(
  InnerComponent: ReactComponent, // the HOC's inner child component
  compareValues: fn(a, b) => boolean // optional function to compare two values for equality (defaults to the identity operator)
)
```

## Usage

The component is readonly, if neither onChange nor onChangeComplete are being passed.
If value is anything but `undefined`, the component is controlled (use `null` or similar for empty values).
onChange is called on every single change.
onChangeComplete is only called on change completion (e.g. enter pressed or similar).

| Prop             | Description                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| value            | controlled value                                                                                                                      |
| originalValue    | if controlled: editable value (e.g. for usage with onChangeComplete)                                                                  |
|                  | if uncontrolled: specifies the unchanged (original) value, which is used to tell the inner component if it is currently being changed |
| onChange         | callback for controlled usage                                                                                                         |
| onChangeComplete | callback for uncontrolled usage - only get's called when the change is complete (can be also used combined with onChange)             |
| …otherProps      | all other props are passed to the inner component                                                                                     |

## Inner props (passed to InnerComponent)

Inner components should always be controlled!
They should only be displayed as being changeable, when they are editable.
If you only want to disable a field, pass an extra prop (disabled).
The callbacks are always being passed down, even if the component is not editable.
However, they are noops in this situation.

| Prop             | Description                                                         |
| ---------------- | ------------------------------------------------------------------- |
| value            | current value                                                       |
| isEditable       | whether the component is editable or not                            |
| isChanged        | whether the component is currently being edited                     |
| onChange         | callback for changes                                                |
| onChangeComplete | callback for completing the changes (e.g. enter pressed or similar) |
| onChangeCanceled | callback for canceling the changes (e.g. escape pressed or similar) |
