// ------- Imports -------------------------------------------------------------

import React from 'react';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyHttpNotFoundUiError } from './ui-errors';

// ------- OnCallLoaderView ----------------------------------------------------

// HOC
export function withAjaxBackend(WrappedComponent, endpoint) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      // this.handleChange = this.handleChange.bind(this);
      this.state = {
        isLoading: true,
        data: null,
        error: null,
      };
    }

    componentDidMount() {
      fetch(endpoint)
        .then((response) => {
          if (!response.ok) {
              throw new PagerBeautyHttpNotFoundUiError(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          this.setState({ isLoading: false, data });
        })
        .catch((error) => {
          this.setState({ isLoading: false, error });
        })
    }

    render() {
      const { error, isLoading, data } = this.state;

      if (isLoading) {
        return <WrappedComponent isLoading={isLoading} {...this.props} />;
      }

      if (error) {
        return <WrappedComponent error={error} {...this.props} />;
      }

      return <WrappedComponent data={data} {...this.props} />;
    }
  };
}

// ------- End -----------------------------------------------------------------
