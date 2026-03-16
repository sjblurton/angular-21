import { DistanceToNowPipe } from './distance-to-now.pipe';

describe('DistanceToNowPipe', () => {
  const oneHour = 60 * 60 * 1000;
  let pipe: DistanceToNowPipe;

  beforeEach(() => {
    pipe = new DistanceToNowPipe();
  });

  it('should return a non-empty string for a recent date', () => {
    const result = pipe.transform(new Date());
    expect(result.length).toBeGreaterThan(0);
  });

  it('should include "ago" suffix for a past date', () => {
    const past = new Date(Date.now() - oneHour);
    expect(pipe.transform(past)).toContain('ago');
  });

  it('should include "in" prefix for a future date', () => {
    const future = new Date(Date.now() + oneHour);
    expect(pipe.transform(future)).toMatch(/^in /);
  });
});
