'use strict';

// ------- Imports -------------------------------------------------------------

import React from 'react';

// ------- StatusIndicatorView ----------------------------------------------------------

export class StatusIndicatorView extends React.Component {
  render() {
    // type: error, warning, success
    // blink: slow, fast
    const { type, blink, title } = this.props;

    const classes = ['status_indicator'];
    classes.push(type ? type : 'success');
    if (blink) {
      classes.push(`blink-${blink}`);
    }
    return <span className={classes.join(' ')} title={title}></span>
  }
}

// ------- End -----------------------------------------------------------------
