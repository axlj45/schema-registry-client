export enum SchemaRegistryErrors {
  InternalServerError = '50001',
  OperationTimedOut = '50002',
  ForwardRequestFailure = '50003',
  SchemaNotFound = '40403',
  SubjectNotFound = '40401',
  VersionNotFound = '40402',
  InvalidAvroSchema = '42201',
  InvalidVersion = '42202',
  InvalidCompatibilityLevel = '42203'
}
