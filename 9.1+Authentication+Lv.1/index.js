import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "1124",
  port : 5433
})

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  try {

    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", 
      [username])
    if (checkResult.rows.length > 0){
      console.log("User already exist. Consider signing in.")
      // console.log(result.rows)
      
    }else{
      const result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2)",
        [username, password])
      res.render("secrets.ejs");
    }
    

    
  } catch (error) {
    console.log(error);
  }

});

app.post("/login", async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1",[username]);

    if (result.rows.length > 0){

      const user = result.rows[0]
      const storedPassword = user.password
      if (user.password === storedPassword){

       
        console.log(user)
        res.render("secrets.ejs");
      }else{
        console.log('Wrong password.')
        res.redirect("/login");
      }
      
    }else{
      console.log("User not found.")
    }
  } catch (error) {
    console.log("Error fetching user", error);
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
