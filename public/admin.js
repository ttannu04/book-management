const form=document.getElementById("form")

form.onsubmit=async e=>{

e.preventDefault()

const data=new FormData(form)

await fetch("/add-book",{
method:"POST",
body:data
})

load()

}

async function load(){

const res=await fetch("/books")
const books=await res.json()

let html=""

books.forEach(b=>{

html+=`
<tr>
<td><img src="/uploads/${b.image}" width="40"></td>
<td>${b.title}</td>
<td>${b.author}</td>
<td>${b.category}</td>
<td>${b.price}</td>
<td><button onclick="del(${b.id})">Delete</button></td>
</tr>
`

})

document.getElementById("books").innerHTML=html

}

function del(id){

fetch("/delete-book/"+id,{
method:"DELETE"
}).then(load)

}

load()