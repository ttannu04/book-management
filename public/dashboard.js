/* =========================
   LOAD DASHBOARD DATA
========================= */

function loadDashboard(){

   fetch("/dashboard")
   
   .then(res => res.json())
   
   .then(data => {
   
   document.getElementById("sales").innerText = data.sales
   document.getElementById("monthSales").innerText = data.monthSales
   document.getElementById("revenue").innerText = "₹" + data.revenue
   
   })
   
   .catch(err => {
   console.log("Dashboard error:", err)
   })
   
   }
   
   
   /* =========================
      LOAD BOOK REQUESTS
   ========================= */
   
   function loadRequests(){
   
   fetch("/requests")
   
   .then(res => res.json())
   
   .then(data => {
   
   let list = document.getElementById("requests")
   
   list.innerHTML = ""
   
   if(data.length === 0){
   
   let li = document.createElement("li")
   li.innerText = "No book requests yet"
   
   list.appendChild(li)
   
   return
   }
   
   data.forEach(r => {
   
   let li = document.createElement("li")
   
   li.innerText = r.title + " - " + r.author
   
   list.appendChild(li)
   
   })
   
   })
   
   .catch(err => {
   console.log("Request error:", err)
   })
   
   }
   
   
   /* =========================
      LOAD SALES CHART
   ========================= */
   
   function loadChart(){
   
   fetch("/sales")
   
   .then(res => res.json())
   
   .then(data => {
   
   let labels = []
   let values = []
   
   data.forEach(s => {
   
   labels.push(s.title)
   values.push(s.price)
   
   })
   
   const ctx = document.getElementById("salesChart")
   
   if(!ctx) return
   
   new Chart(ctx, {
   
   type: "bar",
   
   data: {
   
   labels: labels,
   
   datasets: [{
   
   label: "Book Sales ₹",
   
   data: values
   
   }]
   
   }
   
   })
   
   })
   
   .catch(err => {
   console.log("Chart error:", err)
   })
   
   }
   
   
   /* =========================
      AUTO REFRESH DASHBOARD
   ========================= */
   
   function startAutoRefresh(){
   
   setInterval(() => {
   
   loadDashboard()
   loadRequests()
   
   }, 30000)
   
   }
   
   
   /* =========================
      INITIALIZE DASHBOARD
   ========================= */
   
   document.addEventListener("DOMContentLoaded", () => {
   
   loadDashboard()
   loadRequests()
   loadChart()
   startAutoRefresh()
   
   })