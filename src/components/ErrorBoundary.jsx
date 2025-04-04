import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError 
      ? <div className="p-4 text-red-500">Widget failed to load</div>
      : this.props.children;
  }
}