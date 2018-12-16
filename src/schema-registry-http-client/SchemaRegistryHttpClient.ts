import { IHttpClient } from '../http-client';
import { ISchemaRegistryHttpClient } from './ISchemaRegistryHttpClient';
import { CompatibilityType, IConfigurationResult, ISchemaRegistryError, ISchemaResult } from './models';
import { ISchemaRequest } from './models/ISchemaRequest';

export class SchemaRegistryHttpClient implements ISchemaRegistryHttpClient {
  constructor(private httpClient: IHttpClient) {
    httpClient.addHeader("Accept", "application/vnd.schemaregistry.v1+json, application/vnd.schemaregistry+json, application/json");
  }

  public async isCompatible(targetSubjectName: string, targetSubjectVersion: string, sourceSchema: ISchemaRequest): Promise<boolean> {
    const resource = `/compatibility/subjects/${targetSubjectName}/versions/${targetSubjectVersion}`;

    try {
      const result = await this.httpClient
        .post<ISchemaRequest, { is_compatible: boolean }>(resource, sourceSchema);
      return result.data.is_compatible;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async isCompatibleAgainstLatest(targetSubjectName: string, sourceSchema: ISchemaRequest): Promise<boolean> {
    return this.isCompatible(targetSubjectName, 'latest', sourceSchema);
  }

  public async getSchemaById(id: number): Promise<ISchemaRequest> {
    const resource = `/schemas/ids/${id}`

    try {
      const result = await this.httpClient.get<ISchemaRequest>(resource);
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async getSubjects(): Promise<string[]> {
    const resource = '/subjects';

    try {
      const result = await this.httpClient.get<string[]>(resource);
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async getSubjectVersions(subjectName: string): Promise<number[]> {
    const resource = `/subjects/${subjectName}/versions`;

    try {
      const result = await this.httpClient.get<number[]>(resource);
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async deleteSubject(subjectName: string): Promise<number[]> {
    const resource = `/subjects/${subjectName}`;
    try {
      const result = await this.httpClient.delete<number[]>(resource);;
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async deleteSchemaBySubjectVersion(subjectName: string, versionIdentifier: number): Promise<number> {
    const resource = `/subjects/${subjectName}/versions/${versionIdentifier}`;

    try {
      const result = await this.httpClient.delete<number>(resource);
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async getSchemaInfoBySubjectVersion(subjectName: string, versionIdentifier: number | string): Promise<ISchemaResult> {
    const resource = `/subjects/${subjectName}/versions/${versionIdentifier}`;

    try {
      const result = await this.httpClient.get<ISchemaResult>(resource);
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async getLatestSchemaInfoBySubject(subjectName: string): Promise<ISchemaResult> {
    return this.getSchemaInfoBySubjectVersion(subjectName, 'latest');
  }

  public async getSchemaBySubjectVersion(subjectName: string, versionIdentifier: number | string): Promise<object> {
    const resource = `/subjects/${subjectName}/versions/${versionIdentifier}/schema`;

    try {
      const result = await this.httpClient.get<object>(resource);
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async getLatestSchemaBySubject(subjectName: string): Promise<object> {
    return this.getSchemaBySubjectVersion(subjectName, 'latest');
  }

  public async createSchema(subjectName: string, schema: ISchemaRequest): Promise<ISchemaResult> {
    const resource = `/subjects/${subjectName}/versions`;

    try {
      const result = await this.httpClient
        .post<ISchemaRequest, ISchemaResult>(resource, schema);;
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async schemaExists(subjectName: string, schema: ISchemaRequest): Promise<ISchemaResult> {
    const resource = `/subjects/${subjectName}`;

    try {
      const result = await this.httpClient
        .post<ISchemaRequest, ISchemaResult>(resource, schema);;
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async setGlobalCompatiblity(compatibility: CompatibilityType): Promise<IConfigurationResult> {
    const resource = '/config'

    try {
      const result = await this.httpClient
        .put<IConfigurationResult, IConfigurationResult>(resource, { compatibility });
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async getConfiguration(): Promise<IConfigurationResult> {
    const resource = '/config';

    try {
      const result = await this.httpClient.get<IConfigurationResult>(resource);;
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async setSubjectCompatibility(subjectName: string, compatibility: CompatibilityType): Promise<IConfigurationResult> {
    const resource = `/config/${subjectName}`;

    try {
      const result = await this.httpClient
        .put<IConfigurationResult, IConfigurationResult>(resource, { compatibility });
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  public async getSubjectConfiguration(subjectName: string): Promise<IConfigurationResult> {
    const resource = `/config/${subjectName}`;

    try {
      const result = await this.httpClient
        .get<IConfigurationResult>(resource);
      return result.data;
    }
    catch (ex) {
      throw this.toSchemaRegistryError(ex);
    }
  }

  private toSchemaRegistryError(error: any): ISchemaRegistryError {
    const result: ISchemaRegistryError = {
      errorCode: error.response.data.error_code,
      httpStatusCode: error.response.status,
      message: error.response.data.message
    }
    return result;
  }
}
