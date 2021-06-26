---
title:  "Micro Implementation of Micro-Services"
date:   2021-06-26 08-00-00 
classes: wide
permalink: "/micro-implementation-of-microservices/"
excerpt: "Do you actually need micro-services? Yes, but No."
---
Do you actually need micro-services? Yes, but No. You don't need to refactor your entire application into smaller services unless you feel pain to add or update a small change to your monolith application. 

### MicroServices
According to [IBM](https://www.ibm.com/cloud/learn/microservices#:~:text=Microservices%20(or%20microservices%20architecture)%20are,These%20services%20typically),

*"Microservices (or microservices architecture) are a cloud native architectural approach in which a single application is composed of many loosely coupled and independently deployable smaller components, or services."*

Microservices have their own technology stack, inclusive of database and data management model, and communicate with one another over a combination of REST APIs. It enables to update code more easily, so adding new features to application is a lot easier. Moreover, different technology stack and language can be used for different components, which helps in building a fast and efficient application.

### Micro Implementation
In the following section, let us see how we can build a prototype of auth and CRUD server in two different language and still make them communicate with eachother. [Flask](https://flask.palletsprojects.com/en/2.0.x/), a micro-web framework in python and [expressJS](https://expressjs.com/), minimalist web framwork for nodeJS are used for authentication and CRUD server respectively.

### Auth server
Create a virtual environment and install `Flask`, `Flask-JWT-Extended`. Now, create a python file, lets give it a name as `authServer.py`. For the sake of simplicity, create a key, value pairs to hold username and password. An api for login is then created that returns json-web-token using the installed JWT library if the provided credential is valid. This token can be used in CRUD server to get the identity of the user.

**Note**: Flask-JWT-Extended is configured with the same secret-key to be used in CRUD server jwt configuration. The better approach to this will be to declare it as an environment variable.

{% highlight python%}
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "super-secret"  # Same Secret to be used in express server
jwt = JWTManager(app)

# Sample Database
Users = {
    "jack": {
        "password": "jack_password"
    },
    "robert": {
        "password": "robert_password"
    },
    "lina": {
        "password": "lina_password"
    }
}

@app.route("/api/login", methods=['POST'])
def login():
    username = request.json.get("username")
    password = request.json.get("password") 

    if username in Users and Users[username]["password"] == password:
        identity = {
            "name": username
        }
        access_token = create_access_token(identity=identity)
        return jsonify(access_token=access_token, auth=True)
    else:
        return jsonify({"msg": "Bad username and password"}), 401  
{% endhighlight %}

### CRUD server
Create a directory, initialize it with `npm` and install `express` and `jsonwebtoken`. Now, create a file, say `crudServer.js`. An api is created to return the posts by the logged-in user. To know the identity of the requested user, lets create a `middleware` that verifies the token passed and returns the identity.

{% highlight javascript %}
const postsList =[
    {
        "title":"jack post",
        "author":"jack"
    },
    {
        "title":"robert Post",
        "author":"robert"
    },
    {
        "title":"lina Post",
        "author":"lina"
    },
    {
        "title":"jack Second post",
        "author":"jack"
    },
    {
        "title":"robert Second Post",
        "author":"robert"
    },
    {
        "title":"lina Second Post",
        "author":"lina"
    }
]

app.get("/api/posts", authenticateToken, (req, res)=>{
    res.json(postsList.filter(post => post.author == req.user.name))
})

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token =  authHeader && authHeader.split(" ")[1]
    
    if(token == null) return res.sendStatus(403)

    jwt.verify(token, "super-secret", (err, user)=>{    // secret key is used same as in the authServer
        if(err) return res.sendStatus(403)
        req.user = user.sub
        next()
    })
}
{% endhighlight %}

Now lets run both the file and send a login request to the flask-auth server.

![POST_REQUEST](/assets/images/micro-microservices/post_request.png)

The token inside the purple rectangle verifies the user is valid and now this token can be used in CRUD server to get the post by this user. Lets now send a GET request to CRUD server with the received token in authorization header.

![GET_REQUEST](/assets/images/micro-microservices/get_request.png)

We see the posts by the requested user is returned as a response. So, this way you can implement Auth and CRUD server in two different language and can even use two different stack to make it more efficient. 

The complete code for Auth and CRUD server can be found here: [AuthServer](https://gist.github.com/samiptimalsena/a177a099556d95a2dbeda6c97249d4ee), [CRUDServer](https://gist.github.com/samiptimalsena/382778fae08e8e6d4bc6aecde6e154aa)