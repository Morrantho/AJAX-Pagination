let regName = document.getElementById("regName");
let regEmail = document.getElementById("regEmail");
let userTable = document.getElementById("users");

let name = document.getElementById("name");
let from = document.getElementById("from");
let to   = document.getElementById("to");

window.onload=()=>{
	fetch("/users")
	.then(data=>data.json())
	.then(data=>{

		for(let d in data){
			let row = document.createElement("tr");

			let id = document.createElement("td");
			id.innerHTML = data[d].id;

			let name = document.createElement("name");
			name.innerHTML = data[d].name;

			let createdAt = document.createElement("td");
			createdAt.innerHTML = data[d].createdAt;

			let email = document.createElement("td");
			email.innerHTML = data[d].email;

			row.appendChild(id);
			row.appendChild(name);
			row.appendChild(createdAt);
			row.appendChild(email);

			userTable.appendChild(row);
		}


	})
	.catch(err=>console.log(err));
}

function search(){
	if(from.value.length > 0 && to.value.length > 0){
		console.log("SHOULD SEARCH");
	
		postData("/users/search",{
			name:name.value,
			from:from.value,
			to:to.value
		})
		.then(data=>{
			console.log("SEARCH DATA",data);
		})
		.catch(err=>console.log(err));
	}
}

function register(){
	if(regName.value.length > 0 && regEmail.value.length > 0){
		console.log("SHOULD POST");

		postData("/users/new",{
			name:regName.value,
			email:regEmail.value
		})
		.then(data=>{
			let tr = document.createElement("tr");
			let id = document.createElement("td");
			id.innerHTML = data.id;
			let name = document.createElement("td");
			name.innerHTML = data.name;
			let createdAt = document.createElement("td");
			createdAt.innerHTML = data.createdAt;
			let email = document.createElement("td");
			email.innerHTML = data.email;			

			tr.appendChild(id);
			tr.appendChild(name);
			tr.appendChild(createdAt);
			tr.appendChild(email);

			userTable.appendChild(tr);

			regName.value  = "";
			regEmail.value = "";
		})
		.catch(err=>console.log(err));
	}
}

function postData(url, data) {
  // Default options are marked with *
  return fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // *manual, follow, error
    referrer: 'no-referrer', // *client, no-referrer
  })
  .then(response => response.json()) // parses response to JSON
}