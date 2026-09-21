let s = sessionStorage.s || "";
let ws;
const it = {};
const azul = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3H4ZM11.9996 17.656L6.0498 11.7062H10.9996V6.34229H12.9996V11.7062H17.9493L11.9996 17.656Z"></path></svg>';
const vermelho = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM9 9V15H15V9H9Z"></path></svg>';
const verde = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path></svg>';
const amarelo = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM9 9V15H11V9H9ZM13 9V15H15V9H13Z"></path></svg>';
const disco = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4.50772 2.87597C4.57028 2.37554 4.99568 2 5.5 2H18.5C19.0043 2 19.4297 2.37554 19.4923 2.87597L20.9923 14.876C20.9974 14.9171 21 14.9585 21 15V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V15C3 14.9585 3.00258 14.9171 3.00772 14.876L4.50772 2.87597ZM6.38278 4L5.13278 14H18.8672L17.6172 4H6.38278ZM19 16H5V20H19V16ZM15 17H17V19H15V17ZM13 17H11V19H13V17Z"></path></svg>';
const ic = {
  active: ["ativo", azul],
  complete: ["completo", verde],
  error: ["parado", vermelho],
  removed: ["parado", vermelho],
  paused: ["pausado", amarelo]
};
const esc = t => t.replace(/[&<>"']/g, c => "&#" + c.charCodeAt(0) + ";");
const nome = d => { const f = d.files[0]; return f.path.split("/").pop() || (f.uris[0] && f.uris[0].uri) || d.gid; };
const tam = b => +b ? (b >= 1073741824 ? (b / 1073741824).toFixed(2) + " GB" : (b / 1048576).toFixed(1) + " MB") : "?";
const call = (m, p = []) => ws.send(JSON.stringify({
  jsonrpc: "2.0", id: m, method: "aria2." + m, params: ["token:" + s, ...p]
}));
const tick = () => { call("tellActive"); call("tellWaiting", [0, 50]); call("tellStopped", [0, 20]); };
const connect = () => {
  s = t.value;
  sessionStorage.s = s;
  m.textContent = "";
  l.innerHTML = "";
  if (ws) ws.close();
  ws = new WebSocket("ws://" + location.hostname + ":6800/jsonrpc");
  ws.onopen = tick;
  ws.onmessage = e => {
    const r = JSON.parse(e.data);
    if (r.error) { m.textContent = r.error.message; a.hidden = false; x.hidden = true; }
        if (Array.isArray(r.result)) { m.textContent = ""; a.hidden = true; x.hidden = false; it[r.id] = r.result; if (!lista) { lista = true; pastas(); } }
    l.innerHTML = [...(it.tellActive || []), ...(it.tellWaiting || []), ...(it.tellStopped || [])].map(d => {
      const n = esc(nome(d));
      const p = d.totalLength > 0 ? d.completedLength / d.totalLength * 100 : 0;
      const paused = d.status === "paused";
      const stopped = ["complete", "error", "removed"].includes(d.status);
      const i = ic[d.status];
      return `<li>${n}<progress class="progress is-link is-small mb-1" max="100" value="${p}"></progress>
        <div class="inf is-flex is-justify-content-center is-align-items-center">
        ${i ? `<span class="icon ${i[0]}">${i[1]}</span>` : `<span>${d.status}</span>`}
          <span class="icon-text"><span class="icon">${disco}</span><span>${tam(d.totalLength)}</span></span>
          <span>${(d.downloadSpeed / 1048576).toFixed(2)} MB/s</span>
        ${stopped ? "" : `<button class="button ${paused ? "is-primary" : "is-warning"} is-small" onclick="call('${paused ? "unpause" : "pause"}',['${d.gid}'])">${paused ? "Retomar" : "Pausar"}</button>`}
          <button class="button is-small is-danger" onclick="perguntar('${d.gid}')">Remover</button>
        </div></li>`;
    }).join("");
  };
};
setInterval(() => { if (ws && ws.readyState === 1) tick(); }, 2000);
const add = () => { call("addUri", [[u.value], pasta.value ? { dir: pasta.value } : {}]); u.value = ""; };
const logout = () => { sessionStorage.removeItem("s"); location.reload(); };
let lista = false;
const pastas = () => fetch("/dirs.txt", { credentials: "omit", headers: { Authorization: "Basic " + btoa("aria2:" + s) } })
  .then(r => r.ok ? r.text() : "")
  .then(t => { pasta.innerHTML = t.trim().split("\n").filter(Boolean).map(p => `<option>${esc(p)}</option>`).join(""); });
const achar = gid => [...(it.tellActive || []), ...(it.tellWaiting || []), ...(it.tellStopped || [])].find(d => d.gid === gid);
let alvo;
const perguntar = gid => {
  const d = achar(gid);
  if (!d) return;
  alvo = gid;
  mn.textContent = nome(d);
  mod.classList.add("is-active");
};
const fechar = () => mod.classList.remove("is-active");
const remover = apagar => {
  const d = achar(alvo);
  fechar();
  if (!d) return;
  if (!apagar) return call(["complete", "error", "removed"].includes(d.status) ? "removeDownloadResult" : "remove", [d.gid]);
  fetch("/cgi-bin/delete", { method: "POST", body: "gid=" + d.gid + "&token=" + s })
    .then(r => r.text())
    .then(t => { if (t.trim() !== "ok") m.textContent = t; });
};
t.value = s;
if (s) connect();