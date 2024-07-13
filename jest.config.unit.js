const config = require('./jest.config');

module.exports = {
  ...config,
  testRegex: '.unit-spec.ts$',
  setupFilesAfterEnv: ['<rootDir>/test/unit/jest.setup.ts'],
  coveragePathIgnorePatterns: [
    "src/infra/persistence/typeorm/entities/*",
    "src/infra/web/nestjs/pedidos/dto/*"
  ]
};
