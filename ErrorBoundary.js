// ErrorBoundary.js
import React, { Component } from 'react';
import { View, Text } from 'react-native';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // You can log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <View>
          <Text>Error occurred. Please try again.</Text>
          {/* You can also add a button to reload or navigate back */}
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
