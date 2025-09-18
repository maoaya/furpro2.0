// Mock Chart.js para Jest
module.exports = {
  Chart: {
    register: jest.fn(),
  },
};