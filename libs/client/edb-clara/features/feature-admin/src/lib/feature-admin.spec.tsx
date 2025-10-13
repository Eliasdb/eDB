import React from 'react';
import { render } from '@testing-library/react-native';
import FeatureAdmin from './feature-admin';

describe('FeatureAdmin', () => {
  it('should render successfully', () => {
    const { root } = render(<FeatureAdmin />);
    expect(root).toBeTruthy();
  });
});
