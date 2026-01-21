const API = "https://short-api.up.railway.app";

document.getElementById("form").onsubmit = async e => {
  e.preventDefault();
  await fetch(API + "/api/shorten", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      slug: slug.value,
      original: original.value
    })
  });
  load();
  e.target.reset();
};

async function load(){
  const r = await fetch(API + "/api/urls");
  const d = await r.json();
  table.innerHTML = "";
  d.forEach(x=>{
    table.innerHTML += `
      <tr>
        <td>${x.slug}</td>
        <td><a href="/short/slugs/${x.slug}/" target="_blank">
        https://yanuar-moga.github.io/short/${x.slug}
        </a></td>
      </tr>`;
  });
}
load();
