// ------- Imports -------------------------------------------------------------

import React from 'react';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyFetchNotFoundUiError, PagerBeautyFetchUiError } from './ui-errors';

// ------- withAjaxBackend -----------------------------------------------------

// HOC
export function withAjaxBackend({
  WrappedComponent,
  endpoint,
  pollIntervalSeconds=30,
}) {
  // Return wrapped component
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        // Initial data is loaded successful
        isLoaded: false,
        // Fetching is in progress
        isFetching: false,
        data: null,
        error: null,
      };
      this.intervalId = false;
    }

    async componentDidMount() {
      // First load
      await this.poll(endpoint);

      // And start polling every pollIntervalSeconds;
      const pollIntervalMs = pollIntervalSeconds * 1000;
      this.intervalId = setInterval(() => this.poll(endpoint), pollIntervalMs);
    }

    componentWillUnmount() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }

    async poll(endpoint) {
      if (this.state.isFetching) {
        // Another fetch is in progress, so skip this one.
        return false;
      }
      // Indicate start fetching
      this.setState({ isFetching: true });

      try {
        const data = await this.fetchData(endpoint);

        // Got data, update state.
        this.setState({
          // First data load is complete
          isLoaded: true,
          // No longer fetching
          isFetching: false,
          // Data is loaded successfully, therefore reset errors
          error: null,
          data,
        });
      } catch (error) {
        // Got error, update state
        this.setState({
          // No longer fetching
          isFetching: false,
          // Got error. However, data is not update
          // in case a view still wants to show it.
          error,
        });
      }
    }

    async fetchData(endpoint) {
      const response = await fetch(endpoint);
      if (!response.ok) {
        if (response.status === 404) {
          throw new PagerBeautyFetchNotFoundUiError(
            response.status,
            response.statusText,
          );
        } else {
          throw new PagerBeautyFetchUiError(
            response.status,
            response.statusText,
          );
        }
      }
      return response.json();
    }

    render() {
      const { isLoaded, isFetching, data, error } = this.state;
      return (
        <WrappedComponent
          isLoaded={isLoaded}
          isFetching={isFetching}
          data={data}
          error={error}
          {...this.props}
        />
      );
    }
  };
}

// ------- End -----------------------------------------------------------------
