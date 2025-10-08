import { render, screen } from '@testing-library/react-native';
import {
  Animated,
  LayoutAnimation as RNLayoutAnimation,
  Text,
} from 'react-native';
import { Collapsible } from './collapsible';

describe('Collapsible', () => {
  // Make Animated.timing synchronous & spyable
  let timingSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();

    timingSpy = jest.spyOn(Animated, 'timing').mockReturnValue({
      start: (cb?: (result?: { finished: boolean }) => void) =>
        cb?.({ finished: true }),
      stop: jest.fn(),
      reset: jest.fn(),
    } as unknown as Animated.CompositeAnimation);

    jest
      .spyOn(RNLayoutAnimation, 'configureNext')
      .mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders children when open=true and triggers fade-in', () => {
    render(
      <Collapsible open testID="collapsible">
        <Text testID="content">Hello</Text>
      </Collapsible>,
    );

    expect(screen.getByTestId('content')).toBeTruthy();
    // Animated toValue should be 1 for open=true
    expect(timingSpy).toHaveBeenCalled();
    expect(timingSpy.mock.calls[0][0]).toEqual(
      expect.objectContaining({ toValue: 1, useNativeDriver: true }),
    );
    expect(RNLayoutAnimation.configureNext).toHaveBeenCalled();
  });

  it('keeps children mounted when closing if keepMounted=true (default) and fades out', () => {
    const { rerender } = render(
      <Collapsible open>
        <Text testID="content">Hello</Text>
      </Collapsible>,
    );

    // Close it
    rerender(
      <Collapsible open={false}>
        <Text testID="content">Hello</Text>
      </Collapsible>,
    );

    // Still in the tree
    expect(screen.getByTestId('content')).toBeTruthy();

    // Fade out toValue should be 0
    const lastCall = timingSpy.mock.calls.at(-1);
    expect(lastCall?.[0]).toEqual(expect.objectContaining({ toValue: 0 }));
    expect(RNLayoutAnimation.configureNext).toHaveBeenCalled();
  });

  it('unmounts children when closed and keepMounted=false', () => {
    render(
      <Collapsible open={false} keepMounted={false}>
        <Text testID="content">Hello</Text>
      </Collapsible>,
    );

    expect(screen.queryByTestId('content')).toBeNull();
  });
});
