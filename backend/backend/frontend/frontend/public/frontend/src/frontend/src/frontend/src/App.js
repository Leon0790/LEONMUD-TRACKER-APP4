import React,{useState} from "react"
import * as XLSX from "xlsx"
import {saveAs} from "file-saver"

const subjects=[
"Mathematics",
"English",
"Science",
"Kiswahili"
]

export default function App(){

const [page,setPage]=useState("login")
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")

const [learners,setLearners]=useState([])
const [name,setName]=useState("")

function createAccount(){

localStorage.setItem("teacher",
JSON.stringify({email,password}))

alert("Account created")
setPage("login")

}

function login(){

const saved=JSON.parse(localStorage.getItem("teacher"))

if(saved && saved.email===email && saved.password===password){

setPage("dashboard")

// SEND SMS LOGIN ALERT
fetch("http://localhost:5000/loginSMS",{
method:"POST"
})

}else{

alert("Wrong login")

}

}

function addLearner(){

setLearners([...learners,{name,marks:{}}])
setName("")

}

function updateMark(student,subject,value){

setLearners(prev=>prev.map(l=>{

if(l.name!==student) return l

return{
...l,
marks:{
...l.marks,
[subject]:value
}
}

}))

}

// MPESA PAYMENT
async function payAccess(){

await fetch("http://localhost:5000/pay",{
method:"POST"
})

alert("Check phone for MPESA prompt")

}

function exportExcel(){

const data=learners.map(l=>{

let row={Name:l.name}

subjects.forEach(s=>{
row[s]=l.marks[s]||""
})

return row

})

const ws=XLSX.utils.json_to_sheet(data)
const wb=XLSX.utils.book_new()

XLSX.utils.book_append_sheet(wb,ws,"Marks")

const buffer=XLSX.write(wb,{bookType:"xlsx",type:"array"})

const blob=new Blob([buffer])

saveAs(blob,"LEONMUD_Marklist.xlsx")

}

if(page==="login") return(

<div>

<h1>LEONMUD Tracker</h1>

<input
placeholder="Email"
onChange={e=>setEmail(e.target.value)}
/>

<br/>

<input
type="password"
placeholder="Password"
onChange={e=>setPassword(e.target.value)}
/>

<br/>

<button onClick={login}>
Login
</button>

<button onClick={()=>setPage("create")}>
Create Account
</button>

</div>

)

if(page==="create") return(

<div>

<h2>Create Account</h2>

<input
placeholder="Email"
onChange={e=>setEmail(e.target.value)}
/>

<br/>

<input
type="password"
placeholder="Password"
onChange={e=>setPassword(e.target.value)}
/>

<br/>

<button onClick={createAccount}>
Create
</button>

</div>

)

return(

<div>

<h1>LEONMUD Dashboard</h1>

<button onClick={payAccess}>
Pay Access via MPESA
</button>

<button onClick={exportExcel}>
Download Marklist
</button>

<h2>Add Learner</h2>

<input
value={name}
onChange={e=>setName(e.target.value)}
placeholder="Learner name"
/>

<button onClick={addLearner}>
Add
</button>

<table>

<thead>

<tr>

<th>Name</th>

{subjects.map(s=>
<th key={s}>{s}</th>
)}

</tr>

</thead>

<tbody>

{learners.map(l=>

<tr key={l.name}>

<td>{l.name}</td>

{subjects.map(s=>

<td key={s}>

<input
type="number"
onChange={e=>updateMark(l.name,s,e.target.value)}
style={{width:60}}
/>

</td>

)}

</tr>

)}

</tbody>

</table>

</div>

)

}
