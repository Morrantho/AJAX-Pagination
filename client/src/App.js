import React, { Component } from 'react';
import './App.css';

class App extends Component{
    componentDidMount(){this.init();}

    constructor(props){
        super(props);
    
        this.state={
            users:[],
            userData:[],
            oldUserData:[],

            user:{
                name:"",
                email:""
            },

            query:{
                name:"",
                from:"",
                to:""
            },

            links:[],
            limit:10,
        };
    }

    postData(url, data) {
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

    paginate(e){
        if(e.target.value < 10 || e.target.value > 100){return;}
        let limit    = e.target.value;
        let oldUserData = this.state.oldUserData;
        let userData = oldUserData;
        let pages    = Math.ceil(oldUserData.length/limit);
        let links    = [];
        this.setState({limit:limit});

        for(let i=0,j=10;i<pages;i++,j+=10){
            links[i] = (
                <div key={"link"+i}>
                    <button id={j} onClick={(e)=>this.filter(e)}>{j} /</button>
                </div>
            );
        }

        userData = userData.slice(0,limit);

        this.setState({
            links:links,
            userData:userData
        });
    }

    filter(e){
        let oldUserData = this.state.oldUserData.slice() // shallow copy;
        let id = e.target.id;

        if(id === "10"){
            oldUserData = oldUserData.splice(0,this.state.limit);
        }else{
            oldUserData = oldUserData.splice(id,id+this.state.limit);
        }

        this.setState({
            userData:oldUserData
        });
    }

    init(){
        fetch("http://localhost:8080/users")
        .then(data=>data.json())
        .then(data=>{
            let users = JSON.parse(JSON.stringify(data));

            this.setState({
                users:users
            });

            for(let user in data){
                data[user] = (
                    <tr key={data[user].id}>
                        <td>{data[user].id}</td>
                        <td>{data[user].name}</td>
                        <td>{data[user].createdAt}</td>
                        <td>{data[user].email}</td>
                    </tr>
                );
            }

            this.setState({
                userData:data,
                oldUserData:data
            });
        })
        .catch(err=>console.log(err));
    }

    registerForm(e){
        let user = this.state.user;
        user[e.target.id] = e.target.value;
        this.setState({user:user});
    }

    register(e){
        e.preventDefault();
        this.postData("http://localhost:8080/users/new",this.state.user)
        .then(data=>{
            data = (
                <tr key={data.id}>
                    <td>{data.id}</td>
                    <td>{data.name}</td>
                    <td>{data.createdAt}</td>
                    <td>{data.email}</td>
                </tr>
            );

            let userData = this.state.userData;
            userData.push(data);

            this.setState({
                user:{
                    name:"",
                    email:""
                },
                userData:userData
            });
        })
        .catch(err=>console.log(err));
    }

    search(e){
        let query = this.state.query;
        query[e.target.id.substring(1)] = e.target.value;
        this.setState({query:query});

        if(this.state.query.name 
            && this.state.query.from 
            && this.state.query.to){

            let users = this.state.users.slice(0); // shallow copy
            let userData = [];

            for(let user in users){
                let u = users[user];
                let createdAt = new Date(u.createdAt).getTime();
            
                let name = this.state.query.name;
                let from = new Date(this.state.query.from).getTime();
                let to = new Date(this.state.query.to).getTime();

                if(from <= createdAt && to >= createdAt){
                    if(u.name.includes(name)){
                        userData.push(
                            (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.createdAt}</td>
                                    <td>{u.email}</td>
                                </tr>
                            )
                        );
                    }
                }
            }

            this.setState({
                userData:userData,
                oldUserData:userData
            });
        }

        if(this.state.query.name.length < 1 
            && this.state.query.from 
            && this.state.query.to){
            let users = this.state.users.slice(0); // shallow copy
            let userData = [];

            for(let user in users){
                let u = users[user];
                let createdAt = new Date(u.createdAt).getTime();
            
                let from = new Date(this.state.query.from).getTime();
                let to = new Date(this.state.query.to).getTime();

                if(from <= createdAt && to >= createdAt){
                    userData.push(
                        (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.createdAt}</td>
                                <td>{u.email}</td>
                            </tr>
                        )
                    );
                }
            }
            this.setState({
                userData:userData
            });            
        }
    }

    render() {
        return (
            <div className="App">
                <form className="search">
                    Name:<input id="qname" type="text" onChange={(e)=>{this.search(e);}} />
                    From:<input id="qfrom" type="date" onChange={(e)=>{this.search(e);}} />
                    To:<input id="qto" type="date" onChange={(e)=>{this.search(e);}} />
                    Results Per Page:<input min="10" max="100" id="limit" step="10" type="number" onChange={(e)=>{this.paginate(e);}} />
                </form>

                {this.state.links}

                <hr></hr>

                <table border="1">
                    <thead>
                        <tr>
                            <th>id:</th>
                            <th>name:</th>
                            <th>createdAt:</th>
                            <th>email:</th>
                        </tr>
                    </thead>

                    <tbody className="users">
                        {this.state.userData}
                    </tbody>
                </table>

                <hr></hr>

                <form className="register" onSubmit={(e)=>{this.register(e);}} >
                    <p>Name:<input id="name" type="text" onChange={(e)=>{this.registerForm(e);}} /></p>
                    <p>Email:<input id="email" type="text" onChange={(e)=>{this.registerForm(e);}} /></p>

                    <input type="submit" value="Register" />
                </form>
            </div>
        );
    }
}

export default App;
