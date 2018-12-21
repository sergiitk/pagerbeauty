// ------- Imports -------------------------------------------------------------

import React from 'react';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyHttpNotFoundUiError } from './ui-errors';

// ------- withAjaxBackend -----------------------------------------------------

// HOC
export function withAjaxBackend(WrappedComponent, endpoint, pollIntervalSeconds=30) {
  // Return wrapped component
  return class extends React.Component {
    constructor(props) {
      super(props);
      // this.handleChange = this.handleChange.bind(this);
      this.state = {
        isLoading: true,
        data: null,
        error: null,
      };
      this.intervalId = false;
    }

    componentDidMount() {
      // First load
      this.loadData(endpoint);

      // And start polling every pollIntervalSeconds;
      const pollIntervalMs = pollIntervalSeconds * 1000;
      this.intervalId = setInterval(() => {
        this.loadData(endpoint);
      }, pollIntervalMs);
    }

    componentWillUnmount() {
      clearInterval(this.intervalId);
    }

    loadData() {
      fetch(endpoint)
        .then((response) => {
          if (!response.ok) {
              throw new PagerBeautyHttpNotFoundUiError(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          this.setState({ isLoading: false, error: null, data });
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
