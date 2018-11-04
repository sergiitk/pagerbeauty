'use strict';

const e = React.createElement;

class SchedulesList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e('ul', {});
  }
}

class SchedulesListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(
      'li',
      { },
      this.props.scheduleName
    );
  }
}
