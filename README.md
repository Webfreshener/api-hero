API Hero
=============
Portable OpenAPI REST Client with Observable Data Models

[Online Developer Documentation](https://webfreshener.github.io/api-hero/)
 
### Goals 
 * Simplify setup and maintenance of API Connectors in the App Layer 
 * Be framework agnostic and portable across frameworks and environments 
 * Provide observable and validating data models for all data i/o

### Table of Contents

**[Installation Instructions](#installation-instructions)**

**[Usage Example](#usage-example)**

**[Developer Guide](#developer-guide)**

#### Installation Instructions
```
$ npm i api-hero 
```

#### Usage Example 

The example below defines a single API Client 

```
// OpenAPI spec for our service 
const schema = {
    namespaces: {
        "HelloWorld": {
            name: "hello",
            schema: ... embed or $ref openapi spec here ... 
        },
    },
};

// initialize and make _hero.HelloWorld accessable
const _hero = ApiHero.init(_nsSchema);


// create a new instance of a `pets` item
const _pet = _hero.HelloWorld.pets.new({
    type: "dog",
    price: 123.00,
})

// initialize an observer that will perform a REST `save`
// ... whenever the model changes
const _petSub = _pet.subscribe({
    next: (pet) => _pet.save(),
    error: (e) => console.log(e),
});

// this will log an error because `price` requires a number
_pet.model.price = "160.00";

// this will validate and be saved to the server
_pet.model.price = 160.00;

// will output {id:n,type:"dog",price:160.00}
// `id` was assigned by `save` operation on model change
console.log(`${_pet}`);

```

## Developer Guide

### Initializer
Initializes ApiHero 

| Method        | Arguments | Description  |
|:--------------|:----------|:-------|
| ApiHero.init | config: object | returns 

Usage Example:
```
const _hero = ApiHero.init({namespaces:[]});
```

### ApiHero Model 
Initializes ApiHero 

| Method        | Arguments | Description  |
|:--------------|:----------|:-------|
| addNamespace | object | returns 
| errors |  | returns array of schema validation errors
| namespaces |  | getter returns array of namespace ids
| {namespace_id} | | each OpenApi schema is assigned a getter that returns the API `namespace`

Usage Example:
```
const _hero = ApiHero.init({namespaces:[{
    pets: {... pets openapi schema ...},
}]});

// output of list of namespaces: "pets"
console.log(`${_hero.namespaces}`);

// output JSON-Schema for the namespace
console.log(JSON.stringify(_hero.pets.schema, null, 2);
```


## Trait Mixins ####
Traits are assigned to Namespace Elements based on the available REST Operations for the element's `path`


#### Creatable Trait
Elements that have a `post` operation creatable 

| Method        | Arguments | Description  |
|:--------------|:----------|:-------|
| newModel | data: object | creates new model instance for schema at path
| create | data: object, immediate: bool | creates new model, applies it to collection and if immediate is true saves to server

Usage Example:
```

```


#### Deletable Trait
Elements that have a `delete` operation are deletable 

| Method        | Arguments | Description  |
|:--------------|:----------|:-------|
| destroy | | sends `delete` request to server

Usage Example:
```

```


#### Fetchable Trait
Elements that have a `get` operation are fetchable

| Method        | Arguments | Description  |
|:--------------|:----------|:-------|
| fetch |  |
| fetchById |  |

Usage Example:
```

```


#### Listable Trait
Elements that have a `get` operation and return an array are listable 

| Method        | Arguments | Description  |
|:--------------|:----------|:-------|
| getModels | | returns curretly loaded models
| setModels | data: array[object] | sets models directly onto collection
| add | data: object | sets single model into collection
| at | idx: number | retrieved model at given index
| findById | id: string or number | retrieves loaded model with given id
| reset | clears loaded models from collection (client side only)
| valueOf | | returns native value of data
| toString | | returns stringified version of data
| toJSON | | returns data as JSON object

Usage Example:
```

```


#### Savable Trait
Elements that have a `post` or `put` operation are savable 

| Method        | Arguments | Description  |
|:--------------|:----------|:-------|
| save | params: object | performs `post` or `put` to save models to server


**Save Params Object** 

Usage Example:
```

```


#### Updatable Trait
Elements that have a `put` operation are updatable 

| Method        | Arguments | Description  |
|:--------------|:----------|:-------|
| update | data: object |

Usage Example:
```

```

### Element Mixins

#### Collection Mixin 
Elements that constitute an `array` are models 

| Method        | Arguments | Description  |
|:--------------|:----------|:-------|
| validate | data | performs validation of data against schema for path
| valueOf | | returns native value of data
| toString | | returns stringified version of data
| toJSON | | returns data as JSON object

Usage Example:
```

```

##### Model Mixin 
Elements that constitute an `object` are models 

| Method        | Arguments | Description  |
|:--------------|:----------|:-------|
| valueOf | | returns native value of data
| toString | | returns stringified version of data
| toJSON | | returns data as JSON object
Usage Example:
```

```
