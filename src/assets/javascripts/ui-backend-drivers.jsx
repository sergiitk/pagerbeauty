// ------- Imports -------------------------------------------------------------

import React from 'react';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyFetchNotFoundUiError, PagerBeautyFetchUiError } from './ui-errors';

// ------- getDisplayName -----------------------------------------------------

/**
 * HOC wrapped class display name helper
 *
 * See https://reactjs.org/docs/higher-order-components.html
 */
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// ------- withAjaxBackend -----------------------------------------------------

// HOC
export function withAjaxBackend({
  WrappedComponent,
  endpoint,
  pollIntervalSeconds = 30,
  authenticationStrategy = false,
}) {
  // AJAX backend driver
  class WithAjaxBackend extends React.Component {
    static async fetchData(url) {
      const headers = new Headers();
      // See https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
      const requestInit = {
        method: 'GET',
        headers,
        cache: 'no-cache',
      };

      // Delegate authentication to the caller.
      if (authenticationStrategy) {
        authenticationStrategy(requestInit);
      }

      const fetchRequest = new Request(url, requestInit);

      const response = await fetch(fetchRequest);
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

    async poll(url) {
      const { isFetching } = this.state;
      if (isFetching) {
        // Another fetch is in progress, so skip this one.
        return false;
      }
      // Indicate start fetching
      this.setState({ isFetching: true });

      try {
        const data = await WithAjaxBackend.fetchData(url);

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
      return true;
    }

    render() {
      const { isLoaded, isFetching, data, error } = this.state;
      return (
        <WrappedComponent
          isLoaded={isLoaded}
          isFetching={isFetching}
          data={data}
          error={error}
          {...this.props} // eslint-disable-line react/jsx-props-no-spreading
        />
      );
    }
  }

  // Convention: Wrap the Display Name for Easy Debugging
  // See https://reactjs.org/docs/higher-order-components.html
  const displayName = getDisplayName(WrappedComponent);
  WithAjaxBackend.displayName = `WithAjaxBackend(${displayName})`;
  return WithAjaxBackend;
}

// ------- End -----------------------------------------------------------------
