import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }
  
  render() {
    {/* @ts-ignore */}
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {/* @ts-ignore */}
            {this.state.error && this.state.error.toString()}
            <br />
            {/* @ts-ignore */}
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    {/* @ts-ignore */}
    return this.props.children;
  }  
}
