// apps/mobile/jest.setup.ts
import '@testing-library/jest-native/extend-expect';

// use the global `jest` that Jest provides
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
// If you use RNGH:
// import 'react-native-gesture-handler/jestSetup';
