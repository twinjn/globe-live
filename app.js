*{box-sizing:border-box}
:root{--bg:#0f172a;--panel:#111827;--text:#e5e7eb;--muted:#9ca3af;--accent:#3b82f6;--soft:#1f2937}
html,body{height:100%}
body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif}
.wrap{max-width:1100px;margin:0 auto;padding:16px}
header{display:flex;flex-direction:column;gap:8px;margin-bottom:10px}
h1{margin:0;font-size:1.5rem}
.muted{color:var(--muted)}
.controls{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.controls button{background:var(--accent);color:#fff;border:none;border-radius:10px;padding:8px 12px;cursor:pointer}
.controls button:hover{filter:brightness(1.1)}
.controls select{background:#0b1220;color:var(--text);border:1px solid #334155;border-radius:10px;padding:8px}
.small{font-size:.9rem;color:var(--muted)}
main{display:grid;grid-template-columns:1fr 280px;gap:12px;align-items:stretch}

/* WICHTIG  sichere hoehe fuer Handy */
#globe{
  height:70vh;
  min-height:420px;
  background:var(--panel);
  border-radius:14px;
  position:relative;
  overflow:hidden;
}
#info{background:var(--panel);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px}
#details{font-size:.95rem;line-height:1.4}
footer{margin-top:10px;color:var(--muted);font-size:.9rem}

@media (max-width: 900px){
  main{grid-template-columns:1fr}
  #globe{height:60vh;min-height:360px}
}