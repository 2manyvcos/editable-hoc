import React from 'react';
import PropTypes from 'prop-types';

const withHOC = (Component, compareValues = (a, b) => a === b) => {
  class HOC extends React.Component {
    static getDerivedStateFromProps({ originalValue, keepChanges }, state) {
      const ov = originalValue === undefined ? null : originalValue;

      if (compareValues(state.initialValue, ov)) return null;

      const changes = {
        initialValue: ov,
      };

      if (!keepChanges || compareValues(state.initialValue, state.value)) {
        changes.value = ov;
      }

      return changes;
    }

    constructor(props) {
      super(props);

      const ov = props.originalValue === undefined ? null : props.originalValue;

      this.state = {
        value: ov,
        // eslint-disable-next-line react/no-unused-state
        initialValue: ov,
      };
    }

    isEditable() {
      const { onChange, onChangeComplete } = this.props;

      return typeof onChange === 'function' || typeof onChangeComplete === 'function';
    }

    notifyChange(nextValue) {
      const { onChange } = this.props;

      if (typeof onChange === 'function') {
        onChange(nextValue);
      }
    }

    handleChange(nextValue) {
      const { value } = this.props;

      if (!this.isEditable()) {
        return;
      }

      const isControlled = value !== undefined;
      const nv = nextValue === undefined ? null : nextValue;

      if (isControlled) {
        this.notifyChange(nv);
      } else {
        this.setState({ value: nv }, () => {
          this.notifyChange(nv);
        });
      }
    }

    handleChangeComplete(nextValue) {
      const { value, originalValue, onChangeComplete } = this.props;
      const { value: currentValue } = this.state;

      if (!this.isEditable()) {
        return;
      }

      const isControlled = value !== undefined;

      let v;
      if (isControlled) {
        v = value;
      } else {
        v = currentValue;
      }

      let nv;
      if (nextValue === undefined) {
        nv = v;
      } else {
        nv = nextValue;
      }

      let ov;
      if (originalValue === undefined) {
        if (isControlled) {
          ov = value;
        } else {
          ov = null;
        }
      } else {
        ov = originalValue;
      }

      if (!compareValues(v, nv)) {
        this.handleChange(nv);
      }

      if (!compareValues(ov, nv) && typeof onChangeComplete === 'function') {
        onChangeComplete(nv);
      }
    }

    handleChangeCanceled() {
      const { value, originalValue } = this.props;
      const { value: currentValue } = this.state;

      if (!this.isEditable()) {
        return;
      }

      const isControlled = value !== undefined;

      let v;
      if (isControlled) {
        v = value;
      } else {
        v = currentValue;
      }

      let nv;
      if (originalValue === undefined) {
        if (isControlled) {
          nv = value;
        } else {
          nv = null;
        }
      } else {
        nv = originalValue;
      }

      if (!compareValues(v, nv)) {
        this.handleChange(nv);
      }
    }

    render() {
      const { value, originalValue, onChange, onChangeComplete, ...props } = this.props;
      const { value: currentValue } = this.state;

      const isControlled = value !== undefined;

      let v;
      if (isControlled) {
        v = value;
      } else {
        v = currentValue;
      }

      let ov;
      if (originalValue === undefined) {
        if (isControlled) {
          ov = value;
        } else {
          ov = null;
        }
      } else {
        ov = originalValue;
      }

      return (
        <Component
          {...props}
          value={v}
          isEditable={this.isEditable()}
          isChanged={!compareValues(ov, v)}
          onChange={nextValue => this.handleChange(nextValue)}
          onChangeComplete={nextValue => this.handleChangeComplete(nextValue)}
          onChangeCanceled={() => this.handleChangeCanceled()}
        />
      );
    }
  }

  HOC.propTypes = {
    value: PropTypes.any,
    originalValue: PropTypes.any,
    onChange: PropTypes.func,
    onChangeComplete: PropTypes.func,
  };

  HOC.displayName = 'WithEditable';

  return HOC;
};

export default withHOC;
