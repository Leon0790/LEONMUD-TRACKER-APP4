const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

// SMS notification after login
app.post("/loginSMS",(req,res)=>{

console.log("Teacher logged in. SMS should be sent.")

res.json({
message:"SMS notification triggered"
})

})

// MPESA payment prompt endpoint
app.post("/pay",(req,res)=>{

console.log("MPESA payment requested")

res.json({
message:"MPESA prompt sent to phone"
})

})

app.listen(5000,()=>{
console.log("Backend running on port 5000")
})
