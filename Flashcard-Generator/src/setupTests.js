import "@testing-library/jest-dom";

// jsdom doesn't implement IntersectionObserver, which Framer Motion's
// `whileInView` animations use. Stub it out for the test environment.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserverStub;
