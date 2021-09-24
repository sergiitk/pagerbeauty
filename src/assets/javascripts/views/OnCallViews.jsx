// ------- Imports -------------------------------------------------------------

import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React from 'react';

// ------- Internal imports ----------------------------------------------------

import { OnCall } from '../../../models/OnCall';
import { Incident } from '../../../models/Incident';
import { PagerBeautyFetchNotFoundUiError } from '../ui-errors';
import { StatusIndicatorView } from './StatusIndicatorView';

// ------- OnCallView ----------------------------------------------------------

export class OnCallView extends React.Component {
  render() {
    const { isLoaded, data, error, isFetching } = this.props;

    const is404 = error instanceof PagerBeautyFetchNotFoundUiError;

    // Handle cases prior to first successful data load.
    if (!isLoaded && !is404) {
      if (error) {
        // Data hasn't been loaded even once, got an error.
        return <span>{`Loading error: ${error.message}`}</span>;
      }
      // Still loading.
      return <span>Loading...</span>;
    }

    // Not first load:
    // Ignore errors and show stale content after first successful data load.
    // 404s should reset content
    // @todo: update report errors

    let onCall;
    let userInfo;

    let state;
    if (!is404) {
      onCall = new OnCall(data);
      userInfo = {
        name: onCall.userName,
        url: onCall.userURL,
        avatar: onCall.userAvatarSized(),
      };
      state = onCall.incident ? 'active_incident' : 'normal';
    } else {
      state = 'not_found';
    }

    // Resolve what to show on status row.
    let statusRow;
    switch (state) {
      case 'not_found':
        statusRow = <OnCallStatusRowView />;
        break;
      case 'active_incident':
        statusRow = (
          <OnCallStatusRowView>
            <OnCallIncidentRowView incident={onCall.incident} />
          </OnCallStatusRowView>
        );
        break;
      default:
        statusRow = (
          <OnCallStatusRowView>
            <OnCallDatesRowView onCall={onCall} />
          </OnCallStatusRowView>
        );
    }

    return (
      <div className={`schedule state_${state}`}>
        { /* Header */ }
        <OnCallScheduleRowView filled>
          <span>ON CALL</span>
          <OnCallStatusIndicatorView error={error} isFetching={isFetching} />
        </OnCallScheduleRowView>

        { /* Schedule name */ }
        {state !== 'not_found' && (
          <OnCallScheduleRowView>
            <a href={onCall.schedule.url} className="schedule_name" target="_blank" rel="noreferrer">{onCall.schedule.name}</a>
          </OnCallScheduleRowView>
        )}

        { /* User info */ }
        <OnCallScheduleRowView equalSpacing>
          <OnCallUserInfoView userInfo={userInfo} />
        </OnCallScheduleRowView>
        {state !== 'not_found' && (
          <OnCallUserExtraContactsView contactMethods={onCall.contactMethods} />
        )}

        { /* Status row */ }
        {statusRow}

        { /* End */ }
      </div>
    );
  }
}

OnCallView.propTypes = {
  isLoaded: PropTypes.bool,
  isFetching: PropTypes.bool,
  data: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  error: PropTypes.instanceOf(Error),
};

OnCallView.defaultProps = {
  isLoaded: false,
  isFetching: false,
  data: null,
  error: null,
};

// ------- OnCallScheduleRowView -----------------------------------------------

export class OnCallScheduleRowView extends React.Component {
  render() {
    const { equalSpacing, filled, statusRow, children } = this.props;
    const classes = ['schedule_row'];
    if (equalSpacing) {
      classes.push('equal_spacing');
    }
    if (filled) {
      classes.push('filled_row');
    }
    if (statusRow) {
      classes.push('status_row');
    }
    return <div className={classes.join(' ')}>{children}</div>;
  }
}

OnCallScheduleRowView.propTypes = {
  equalSpacing: PropTypes.bool,
  filled: PropTypes.bool,
  statusRow: PropTypes.bool,
  children: PropTypes.node,
};

OnCallScheduleRowView.defaultProps = {
  equalSpacing: false,
  filled: false,
  statusRow: false,
  children: null,
};

// ------- OnCallStatusRowView -------------------------------------------------

export class OnCallStatusRowView extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <OnCallScheduleRowView filled equalSpacing statusRow>
        {children}
      </OnCallScheduleRowView>
    );
  }
}

OnCallStatusRowView.propTypes = {
  children: PropTypes.node,
};

OnCallStatusRowView.defaultProps = {
  children: null,
};

// ------- OnCallStatusIndicatorView -------------------------------------------

export class OnCallStatusIndicatorView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBlinking: false,
    };
    this.timeoutId = false;
  }

  componentDidUpdate(prevProps) {
    // Blink for next 3 seconds when swithcing state
    const { isFetching } = this.props;
    if (!prevProps.isFetching && isFetching) {
      this.registerBlink();
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  registerBlink() {
    // Blink for 3 seconds
    const { isBlinking } = this.state;
    if (isBlinking) {
      return;
    }
    this.setState({ isBlinking: true });
    this.timeoutId = setTimeout(() => {
      this.setState({ isBlinking: false });
    }, 2000);
  }

  render() {
    const { error } = this.props;
    const { isBlinking } = this.state;

    let type = 'success';
    let blink = null;
    if (error instanceof PagerBeautyFetchNotFoundUiError) {
      // No one on call.
      type = 'error';
      blink = 'slow';
    } else if (error) {
      // All errors
      type = 'warning';
      blink = 'fast';
    } else {
      // Success
      type = 'success';
      // Blink on success in post-render componentDidUpdate.
      if (isBlinking) {
        blink = 'fast';
      }
    }

    let title = 'OK';
    if (error) {
      title = error.message || error.toString();
    }

    return <StatusIndicatorView type={type} blink={blink} title={title} />;
  }
}

OnCallStatusIndicatorView.propTypes = {
  isFetching: PropTypes.bool,
  error: PropTypes.instanceOf(Error),
};

OnCallStatusIndicatorView.defaultProps = {
  isFetching: false,
  error: null,
};

// ------- OnCallUserExtraInfoView --------------------------------------------------

export class OnCallUserExtraContactsView extends React.Component {
  render() {
    const { contactMethods } = this.props;
    const phoneMethod = contactMethods.find((cm) => cm.type === 'phone_contact_method');
    if (phoneMethod) {
      return (
        <>
          <div className="user_phone">
            Phone(
            {phoneMethod.summary}
            ):
            {' '}
            {phoneMethod.address}
          </div>
        </>
      );
    }
    return false;
  }
}

OnCallUserExtraContactsView.propTypes = {
  contactMethods: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    summary: PropTypes.string,
    address: PropTypes.string,
  })),
};

OnCallUserExtraContactsView.defaultProps = {
  contactMethods: [],
};

// ------- OnCallUserInfoView --------------------------------------------------

export class OnCallUserInfoView extends React.Component {
  render() {
    const { userInfo } = this.props;
    return (
      <>
        <div className="user_avatar">
          {userInfo ? (
            <a href={userInfo.url} target="_blank" rel="noreferrer"><img src={userInfo.avatar} alt={userInfo.name} /></a>
          ) : (
            <img src="https://www.gravatar.com/avatar/0?s=2048&amp;d=mp" alt="Generic avatar" />
          )}
        </div>
        <div className={`user_name ${!userInfo ? 'error' : ''}`}>
          {userInfo ? (
            <a href={userInfo.url} target="_blank" rel="noreferrer">{userInfo.name}</a>
          ) : (
            'No one is on call'
          )}
        </div>
      </>
    );
  }
}

OnCallUserInfoView.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
    avatar: PropTypes.string,
  }),
};

OnCallUserInfoView.defaultProps = {
  userInfo: null,
};

// ------- OnCallDatesRowView -----------------------------------------------

export class OnCallDatesRowView extends React.Component {
  render() {
    const { onCall } = this.props;
    const fromDate = (
      <OnCallDateRowView
        className="date_start"
        label="From"
        date={onCall.dateStart}
        timezone={onCall.schedule.timezone}
      />
    );

    // dateEnd is null when there's only one user on schedule.
    let toDate = null;
    if (onCall.dateEnd.isValid) {
      toDate = (
        <OnCallDateRowView
          className="date_end"
          label="To"
          date={onCall.dateEnd}
          timezone={onCall.schedule.timezone}
        />
      );
    }

    return (
      <>
        {fromDate}
        {toDate}
      </>
    );
  }
}

OnCallDatesRowView.propTypes = {
  onCall: PropTypes.instanceOf(OnCall).isRequired,
};

// ------- OnCallDateTimeView --------------------------------------------------

export class OnCallDateRowView extends React.Component {
  render() {
    const { date, timezone, className, label } = this.props;

    return (
      <div className={`date ${className}`}>
        <span>{`${label}: `}</span>
        <OnCallDateTimeView date={date} timezone={timezone} />
      </div>
    );
  }
}

OnCallDateRowView.propTypes = {
  date: PropTypes.instanceOf(DateTime).isRequired,
  timezone: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
};

OnCallDateRowView.defaultProps = {
  timezone: null,
  className: '',
  label: '',
};

// ------- OnCallIncidentRowView -----------------------------------------------

export class OnCallIncidentRowView extends React.Component {
  render() {
    const { incident, className } = this.props;
    return (
      <div className={`incident ${className}`}>
        <div className="incident_summary">
          <span>{`Incident ${incident.status}: `}</span>
          <a href={incident.url} target="_blank" rel="noreferrer">{incident.title}</a>
        </div>
        <div className="incident_service">
          <span>Service: </span>
          <a href={incident.serviceUrl} target="_blank" rel="noreferrer">{incident.serviceName}</a>
        </div>
      </div>
    );
  }
}

OnCallIncidentRowView.propTypes = {
  incident: PropTypes.instanceOf(Incident).isRequired,
  className: PropTypes.string,
};

OnCallIncidentRowView.defaultProps = {
  className: '',
};

// ------- OnCallDateTimeView --------------------------------------------------

export class OnCallDateTimeView extends React.Component {
  render() {
    const { date, timezone } = this.props;
    let dateInTz = date;

    const urlParams = new URLSearchParams(window.location.search);
    const tzOverride = urlParams.get('timezone');

    if (tzOverride) {
      dateInTz = date.setZone(tzOverride.replace(' ', '+'));
    } else if (timezone) {
      dateInTz = date.setZone(timezone);
    }

    if (!dateInTz.isValid) {
      return (
        <>
          <span className="date_weekday">Incorrect Timezone</span>
        </>
      );
    }

    return (
      <>
        <span className="date_weekday">{`${dateInTz.toFormat('EEEE')}, `}</span>
        <span className="date_date">{`${dateInTz.toFormat('MMM dd')} `}</span>
        <span className="date_time">{dateInTz.toFormat('t')}</span>
      </>
    );
  }
}

OnCallDateTimeView.propTypes = {
  date: PropTypes.instanceOf(DateTime).isRequired,
  timezone: PropTypes.string,
};

OnCallDateTimeView.defaultProps = {
  timezone: null,
};

// ------- End -----------------------------------------------------------------
