# nk-js-util
Simple library for JS, bower plugin

Parsing MVC based url into object containing params and respective values and also having is passed url is mathing to MVC basic url or not.

``` javascript
var parsedData = $NK.parseUrl('/:category/:id', '/books/24');
console.log(parsedData); // { IsMatch: true, Params: { category: "books", id: 24 }}
```


Another component is Encoding and Decoding of JSON data inorder to reduce size of JSON. As we know we store Data in JSON format as below

``` javascript
var data = [{"Id":0,"Name":"Jason Bourne"},{"Id":1,"Name":"Tony Stark"},{"Id":2,"Name":"Winter Soldier"}];
```

If we see above data, we are repeating "Id" and "Name" properties repeatedly in every object.If our data is 10 records, good enough to trasnfer data between client and server
What If that data is more than 10K records , it would be waste of data transfering between client and server, now a days everything is JSON,in client server, between servers.

So, by using encoding component, we can reduce the JSON data into smaller sizes and send to server or decoding response coming from Server.

``` javascript
var encodedData = $NK.encodeData([ {"Id": 1, "Name": "Murali", "IsStudent": false}, { "Id": 2, "IsStudent": null}]);
console.log('encoded Data : ', encodedData); // { Properties: ["Id", "Name", "IsStudent"], Data: [[1, "Murali", false],[2, null, null]]
```



PS: For encoding/decoding use npm-module [nk-node-util](https://www.npmjs.com/package/nk-node-util) for server side encoding/decoding