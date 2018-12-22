// ------- Imports -------------------------------------------------------------

import PropTypes from 'prop-types';
import React from 'react';

// ------- StatusIndicatorView -------------------------------------------------

export class StatusIndicatorView extends React.Component {
  render() {
    // type: error, warning, success
    // blink: slow, fast
    const { type, blink, title } = this.props;

    const classes = ['status_indicator'];
    classes.push(type || 'success');
    if (blink) {
      classes.push(`blink-${blink}`);
    }
    return <span className={classes.join(' ')} title={title} />;
  }
}

StatusIndicatorView.propTypes = {
  type: PropTypes.oneOf(['error', 'warning', 'success']),
  blink: PropTypes.oneOf(['slow', 'fast']),
  title: PropTypes.string,
};

StatusIndicatorView.defaultProps = {
  type: 'success',
  blink: null,
  title: null,
};

// ------- End -----------------------------------------------------------------
