import { Component } from 'react';
import { Button } from './Button.jsx';

export class AppDataErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-4 text-center">
          <h1 className="text-lg font-bold text-neutral-text">Could not load demo data</h1>
          <p className="max-w-md text-sm text-neutral-text-muted">
            The officials dashboard failed to initialize mock data. Try refreshing the page. If this continues, clear site data for this origin and sign in again.
          </p>
          <p className="max-w-lg truncate font-mono text-xs text-alert-critical-text">{error.message}</p>
          <Button type="button" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
