var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest()
xhr.open('GET', 'https://kinopoiskapiunofficial.tech/api/v2.1/films/452973', false)
xhr.setRequestHeader("User-Agent", "Request-promise")
xhr.setRequestHeader("X-API-KEY", "635b82ed-9445-41ee-8360-b5efdad83d43")
xhr.send()
console.log('sent')
console.log(JSON.parse(xhr.responseText).data.description)