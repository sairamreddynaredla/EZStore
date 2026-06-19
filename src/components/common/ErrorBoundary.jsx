import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log error to analytics here
    // console.error(error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // eslint-disable-next-line no-restricted-globals
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] p-6">
          <div className="max-w-xl w-full bg-white rounded-2xl shadow-md border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              An unexpected error occurred. You can retry or contact support.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={this.handleRetry}
                className="px-6 py-2 bg-orange-500 text-white rounded-full font-semibold"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
