async function load(){
    try {
      const res = await fetch("/sales");
      const data = await res.json();
      let html = "";
      data.forEach((s, i) => {
        html += `<tr><td style="color:var(--muted)">${i+1}</td><td><strong>${s.title}</strong></td><td style="color:var(--terracotta);font-weight:700">₹${s.price}</td><td style="color:var(--muted)">${new Date(s.date).toLocaleDateString('en-IN',{year:'numeric',month:'short',day:'numeric'})}</td></tr>`;
      });
      document.getElementById("sales").innerHTML = html || '<tr><td colspan="4" style="text-align:center;padding:30px;color:var(--muted)">No sales recorded yet.</td></tr>';
    } catch(e) {
      document.getElementById("sales").innerHTML = '<tr><td colspan="4" style="text-align:center;padding:30px;color:var(--muted)">Connect to backend to load sales.</td></tr>';
    }
  }
  
  function exportCSV(){
    fetch("/sales").then(res=>res.json()).then(data=>{
      let csv = "Title,Price,Date\n";
      data.forEach(s => { csv += `${s.title},${s.price},${s.date}\n`; });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], {type:"text/csv"}));
      a.download = "sales_report.csv"; a.click();
    }).catch(()=>alert("Unable to export: no backend connected."));
  }
  
  load();
  