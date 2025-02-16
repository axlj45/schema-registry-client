# schema-registry-client
Schema registry client for Confluent's Avro Schema Registry.

[![Build](https://github.com/axlj45/schema-registry-client/actions/workflows/build.yml/badge.svg)](https://github.com/axlj45/schema-registry-client/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/axlj45/schema-registry-client/branch/master/graph/badge.svg)](https://codecov.io/gh/axlj45/schema-registry-client)

## Usage

```bash
npm install --save schema-registry-client
```


### Create Schema

```ts
import { SchemaRegistryClient } from './SchemaRegistryClient';

const schemaRegistry = SchemaRegistryClient.create('http://localhost:8081');

interface IData {
  first: string;
  last: string;
  age: number;
}

const schema = {
  "name": "SerializationTest",
  "namespace": "com.example",
  "type": "record",
  "fields": [
    { "name": "first", "type": ["null", "string"] },
    { "name": "last", "type": "string" },
    { "name": "age", "type": ["null", "int"] },
  ]
};

schemaRegistry
  .createSchema('subjectName', schema)
  .then((schemaInfo)=> { console.log(`Created schema: ${schemaInfo.subject} with id: ${schemaInfo.id}`) })
```

### Serialize JSON

```ts
import { SchemaRegistryClient } from './SchemaRegistryClient';

const schemaRegistry = SchemaRegistryClient.create('http://localhost:8081');

interface IData {
  first: string;
  last: string;
  age: number;
}

const data: IData = {
  'age': 60,
  'first': 'firstName',
  'last': 'lastName',
}

schemaRegistry
  .encodeBySubject(data, 'subjectName')
  .then(schemaRegistryAvroBuffer => console.log(schemaRegistryAvroBuffer))
```

### Deserialize JSON


```ts
import { SchemaRegistryClient } from './SchemaRegistryClient';

const schemaRegistry = SchemaRegistryClient.create('http://localhost:8081');

interface IData {
  first: string;
  last: string;
  age: number;
}

const buffer = /* consume message buffer from kafka */

schemaRegistry
  .decode<IData>(buffer)
  .then(data => {
    console.log(`First Name: ${data.first}
    Last Name: ${data.last}
    Age: ${data.age}`)
  })
```

## Future Development

* Support schema registry multiserver configuration
