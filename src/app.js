const express = require("express");
const app = express();

// MiddleWare
const validateZip = require("./middleware/validateZip");
const getZoos = require("./utils/getZoos");

//Routes
app.get("/check/:zip",validateZip,(req,res,next) => {
  const zip = req.params.zip;
  const zoos = getZoos(zip);  
 if(zoos && zoos.length > 0){
  const message = `${zip} exists in our records.`;
  res.send(message);
 }
 else {
  const errorMessage = `${zip} does not exist in our records.`
  res.send(errorMessage);
 }
})

app.get("/zoos/all", (req, res) => {
  const isAdmin = req.query.admin === "true";
  
  if (!isAdmin) {
   return res.status(403).send("You do not have access to that route.");
  }
  
  const allZoos = getZoos();
  res.send(`All zoos: ${allZoos.join('; ')}`);
});

app.get("/zoos/:zip", validateZip, (req,res,next) =>{
  const zip = req.params.zip;
  const zoos = getZoos(zip);
  if(zoos && zoos.length === 1){
    const message = `${zip} zoos: ${zoos}`;
    res.send(message);
  }
  else if(zoos && zoos.length >1){
    const message = `${zip} zoos: ${zoos.join("; ")}`;
    res.send(message);
  }
  else {
    const errorMessage = `${zip} has no zoos.`;
    res.send(errorMessage);
  }

})


// Error handling
app.use((req, res, next) => {
  next("That route could not be found!");
});

app.use((err, req, res, next) => {
  err = err || "Internal server error!";
  res.send(err);
});

module.exports = app


