import { Package, Duration } from './schema';

describe('Package Schema', () => {
  it('should be defined', () => {
    expect(new Package()).toBeDefined();
    expect(new Duration()).toBeDefined();
  });
});
