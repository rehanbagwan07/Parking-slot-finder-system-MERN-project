import { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as api from "./api";

// ═══════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#060810;--s1:#0c0e1a;--s2:#131526;--s3:#1a1d32;
  --bd:#22254a;--bd2:#2d3160;
  --acc:#ff6b2b;--acc2:#1e90ff;--acc3:#ffd700;
  --grn:#00c97a;--red:#ff3c55;--orn:#ff9800;
  --txt:#eef0ff;--mu:#7b7fa8;--mu2:#a8acd0;
  --fd:'Rajdhani',sans-serif;--fb:'Nunito',sans-serif;--fm:'JetBrains Mono',monospace;
  --r:10px;--r2:16px;--r3:22px;
}
body{background:var(--bg);color:var(--txt);font-family:var(--fb);min-height:100vh;overflow-x:hidden}
button{font-family:var(--fb);cursor:pointer;outline:none}
input,select{font-family:var(--fb)}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:var(--s1)}
::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:3px}
.app{display:flex;min-height:100vh}

/* ── SIDEBAR ── */
.sb{width:240px;min-width:240px;background:var(--s1);border-right:1px solid var(--bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:100;overflow:hidden}
.sb-brand{padding:18px 16px 14px;border-bottom:1px solid var(--bd);display:flex;align-items:center;gap:12px}
.sb-brand-icon{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--acc),#ff9500);display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 0 20px rgba(255,107,43,.35);flex-shrink:0}
.sb-city{font-family:var(--fd);font-size:11px;letter-spacing:2px;color:var(--acc);text-transform:uppercase;font-weight:600}
.sb-app{font-family:var(--fd);font-size:20px;font-weight:700;letter-spacing:1px;line-height:1.1}
.sb-ver{font-size:10px;color:var(--mu);font-family:var(--fm);letter-spacing:1px}
.sb-nav{flex:1;padding:12px 10px;overflow-y:auto;display:flex;flex-direction:column;gap:2px}
.sb-sec{font-family:var(--fm);font-size:9px;letter-spacing:2px;color:var(--mu);text-transform:uppercase;padding:12px 10px 4px}
.sb-btn{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:var(--r);border:none;background:transparent;color:var(--mu2);font-size:13.5px;font-weight:600;text-align:left;width:100%;transition:all .15s}
.sb-btn:hover{background:var(--s2);color:var(--txt)}
.sb-btn.act{background:rgba(255,107,43,.12);color:var(--acc);border:1px solid rgba(255,107,43,.2)}
.sb-btn .ic{font-size:18px;flex-shrink:0}
.sb-bdg{margin-left:auto;background:var(--acc);color:#fff;border-radius:10px;padding:1px 7px;font-size:10px;font-weight:700}
.sb-live{padding:8px 10px;display:flex;flex-direction:column;gap:4px}
.sb-loc-row{display:flex;justify-content:space-between;align-items:center;padding:6px 10px;border-radius:8px;cursor:pointer;transition:background .15s}
.sb-loc-row:hover{background:var(--s2)}
.sb-loc-name{font-size:11px;color:var(--mu2);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px}
.sb-loc-cnt{font-family:var(--fm);font-size:11px;font-weight:600}
.sb-bar{height:3px;background:var(--s3);border-radius:2px;overflow:hidden;margin-top:3px;margin-left:10px;margin-right:10px}
.sb-bar-fill{height:100%;border-radius:2px;transition:width .7s}
.sb-user{padding:13px 14px;border-top:1px solid var(--bd);display:flex;align-items:center;gap:10px}
.sb-av{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--acc),#ff9500);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;color:#fff;flex-shrink:0}
.sb-uname{font-size:13px;font-weight:700}
.sb-urole{font-size:10px;color:var(--mu);font-family:var(--fm)}
.logout-btn{margin-left:auto;padding:4px 10px;border-radius:6px;border:1px solid var(--bd);background:transparent;color:var(--mu);font-size:11px;transition:all .15s;font-family:var(--fm)}
.logout-btn:hover{border-color:var(--red);color:var(--red)}

/* ── MAIN ── */
.main{margin-left:240px;flex:1;display:flex;flex-direction:column;min-height:100vh}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:13px 26px;border-bottom:1px solid var(--bd);background:rgba(12,14,26,.88);backdrop-filter:blur(14px);position:sticky;top:0;z-index:50}
.topbar-l{display:flex;align-items:center;gap:14px}
.pg-tag{font-family:var(--fm);font-size:10px;letter-spacing:2px;color:var(--acc);background:rgba(255,107,43,.08);border:1px solid rgba(255,107,43,.2);padding:3px 10px;border-radius:20px;text-transform:uppercase}
.pg-title{font-family:var(--fd);font-size:22px;font-weight:700;letter-spacing:.5px}
.topbar-r{display:flex;align-items:center;gap:10px}
.live-pill{display:flex;align-items:center;gap:6px;background:rgba(0,201,122,.07);border:1px solid rgba(0,201,122,.22);border-radius:20px;padding:5px 12px;font-size:11px;font-family:var(--fm);color:var(--grn)}
.live-dot{width:7px;height:7px;border-radius:50%;background:var(--grn);animation:blink 1.5s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.clk{font-family:var(--fm);font-size:12px;color:var(--mu2);background:var(--s2);border:1px solid var(--bd);padding:5px 12px;border-radius:6px}
.content{padding:22px 26px;flex:1}

/* ── STATS ── */
.stats-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:13px;margin-bottom:24px}
.stat{background:var(--s1);border:1px solid var(--bd);border-radius:var(--r2);padding:17px;position:relative;overflow:hidden;transition:transform .2s}
.stat:hover{transform:translateY(-2px)}
.stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.stat.co::before{background:var(--acc)}.stat.cb::before{background:var(--acc2)}.stat.cg::before{background:var(--grn)}.stat.ca::before{background:var(--orn)}.stat.cr::before{background:var(--red)}.stat.cy::before{background:var(--acc3)}
.stat-lbl{font-size:10px;font-family:var(--fm);letter-spacing:1.5px;color:var(--mu);text-transform:uppercase;margin-bottom:9px}
.stat-val{font-family:var(--fd);font-size:36px;font-weight:700;line-height:1;margin-bottom:4px}
.stat.co .stat-val{color:var(--acc)}.stat.cb .stat-val{color:var(--acc2)}.stat.cg .stat-val{color:var(--grn)}.stat.ca .stat-val{color:var(--orn)}.stat.cr .stat-val{color:var(--red)}.stat.cy .stat-val{color:var(--acc3)}
.stat-sub{font-size:11px;color:var(--mu)}

/* ── MAP ── */
.map-box{background:var(--s1);border:1px solid var(--bd);border-radius:var(--r2);overflow:hidden;margin-bottom:22px}
.map-hdr{display:flex;align-items:center;justify-content:space-between;padding:13px 18px;border-bottom:1px solid var(--bd)}
.map-title{font-family:var(--fd);font-size:16px;font-weight:700;display:flex;align-items:center;gap:8px;letter-spacing:.5px}
.map-body{position:relative;overflow:hidden}
.map-svg{width:100%;height:100%;display:block}
/* SVG road layers */
.r-highway{stroke:#1f2245;stroke-width:18;stroke-linecap:round}
.r-main{stroke:#181b38;stroke-width:12;stroke-linecap:round}
.r-local{stroke:#141630;stroke-width:7;stroke-linecap:round}
.r-label{fill:#2e3260;font-family:'JetBrains Mono',monospace;font-size:9px}
.m-grid{stroke:rgba(30,32,60,.5);stroke-width:.5}
.m-bldg{fill:rgba(20,22,44,.85);stroke:rgba(38,42,80,.6);stroke-width:.8}
.m-park-area{fill:rgba(0,201,122,.06);stroke:rgba(0,201,122,.15);stroke-width:1}
.m-water{fill:rgba(30,100,180,.12);stroke:rgba(30,100,180,.25);stroke-width:1}
.map-legend{position:absolute;bottom:12px;left:12px;background:rgba(6,8,16,.88);backdrop-filter:blur(10px);border:1px solid var(--bd);border-radius:10px;padding:10px 14px}
.leg-row{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--mu2);font-family:var(--fm);margin-bottom:4px}
.leg-row:last-child{margin:0}
.leg-dot{width:10px;height:10px;border-radius:50%}
.loc-track{position:absolute;bottom:12px;right:12px;background:rgba(6,8,16,.88);backdrop-filter:blur(10px);border:1px solid var(--bd);border-radius:10px;padding:10px 14px;font-size:11px;font-family:var(--fm);color:var(--mu2);max-width:200px}
.map-popup{position:absolute;background:var(--s1);border:1px solid var(--bd2);border-radius:var(--r2);padding:14px;min-width:215px;z-index:20;box-shadow:0 12px 40px rgba(0,0,0,.6);animation:popIn .15s ease;pointer-events:none}
@keyframes popIn{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
.pu-name{font-family:var(--fd);font-size:16px;font-weight:700;margin-bottom:2px;letter-spacing:.3px}
.pu-type{font-size:10px;color:var(--acc);font-family:var(--fm);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px}
.pu-addr{font-size:11px;color:var(--mu);margin-bottom:10px}
.pu-row{display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px}
.pu-btn{width:100%;margin-top:10px;padding:8px;border-radius:8px;border:none;background:var(--acc);color:#fff;font-weight:700;font-size:13px;pointer-events:all;cursor:pointer;font-family:var(--fb);transition:all .15s}
.pu-btn:hover{background:#e55a1f}

/* ── LOCATION CARDS ── */
.loc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(275px,1fr));gap:14px;margin-bottom:22px}
.loc-card{background:var(--s1);border:1px solid var(--bd);border-radius:var(--r2);padding:18px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.loc-card::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:var(--lc,var(--bd))}
.loc-card:hover{border-color:var(--acc);transform:translateY(-2px);box-shadow:0 8px 28px rgba(255,107,43,.1)}
.loc-card.sel{border-color:var(--acc);box-shadow:0 0 0 1px var(--acc)}
.lc-type-badge{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-family:var(--fm);letter-spacing:1px;text-transform:uppercase;color:var(--mu);background:var(--s2);border:1px solid var(--bd);border-radius:4px;padding:2px 7px;margin-bottom:9px}
.lc-name{font-family:var(--fd);font-size:17px;font-weight:700;letter-spacing:.3px;margin-bottom:4px}
.lc-addr{font-size:12px;color:var(--mu);margin-bottom:12px}
.lc-meta{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px;align-items:center}
.tag{font-size:11px;font-family:var(--fm);padding:3px 9px;border-radius:5px;border:1px solid var(--bd);color:var(--mu2)}
.avail-chip{font-size:11px;font-family:var(--fm);font-weight:600;padding:3px 9px;border-radius:5px}
.lc-bar-lbl{display:flex;justify-content:space-between;font-size:11px;color:var(--mu);margin-bottom:5px;font-family:var(--fm)}
.lc-bar{height:5px;background:var(--s3);border-radius:3px;overflow:hidden}
.lc-bar-fill{height:100%;border-radius:3px;transition:width .6s}
.lc-dist{font-size:11px;font-family:var(--fm);color:var(--acc2);background:rgba(30,144,255,.1);border:1px solid rgba(30,144,255,.2);padding:2px 8px;border-radius:4px}

/* ── SLOTS ── */
.slot-panel{background:var(--s1);border:1px solid var(--bd);border-radius:var(--r2);padding:20px;margin-bottom:22px}
.slot-panel-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px}
.slot-loc-name{font-family:var(--fd);font-size:20px;font-weight:700;letter-spacing:.5px;margin-bottom:4px}
.slot-loc-meta{font-size:12px;color:var(--mu);font-family:var(--fm)}
.slot-legend{display:flex;gap:14px;flex-wrap:wrap;margin-top:4px}
.sleg{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--mu2);font-family:var(--fm)}
.sleg-dot{width:12px;height:12px;border-radius:3px}
.sleg-dot.av{background:rgba(0,201,122,.7)}.sleg-dot.rs{background:rgba(255,152,0,.7)}.sleg-dot.oc{background:rgba(255,60,85,.7)}
.slots-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:9px}
.slot{aspect-ratio:1;border-radius:10px;border:2px solid transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font-family:var(--fm);font-size:13px;font-weight:600;transition:all .15s;position:relative}
.slot.av{background:rgba(0,201,122,.1);border-color:rgba(0,201,122,.35);color:var(--grn)}
.slot.av:hover{background:rgba(0,201,122,.2);border-color:var(--grn);transform:scale(1.07)}
.slot.rs{background:rgba(255,152,0,.1);border-color:rgba(255,152,0,.3);color:var(--orn);cursor:not-allowed}
.slot.oc{background:rgba(255,60,85,.1);border-color:rgba(255,60,85,.3);color:var(--red);cursor:not-allowed}
.slot.pk{background:rgba(255,107,43,.2);border-color:var(--acc);color:var(--acc);transform:scale(1.08)}
.slot-ic{font-size:18px;margin-bottom:2px}

/* ── MODAL ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(7px);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:var(--s1);border:1px solid var(--bd2);border-radius:var(--r3);padding:28px;width:100%;max-width:460px;box-shadow:0 24px 64px rgba(0,0,0,.65);animation:mIn .2s ease}
@keyframes mIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.modal-title{font-family:var(--fd);font-size:22px;font-weight:700;margin-bottom:4px;letter-spacing:.5px}
.modal-sub{font-size:12px;color:var(--mu);font-family:var(--fm);margin-bottom:22px}
.frow{margin-bottom:15px}.frow2{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:15px}
.flbl{font-size:10px;font-family:var(--fm);color:var(--mu);letter-spacing:1.5px;text-transform:uppercase;display:block;margin-bottom:6px}
.finput,.fsel{width:100%;background:var(--s2);border:1px solid var(--bd);border-radius:8px;padding:10px 14px;color:var(--txt);font-size:14px;outline:none;transition:border-color .15s}
.finput:focus,.fsel:focus{border-color:var(--acc)}
.summary{background:var(--s2);border:1px solid var(--bd);border-radius:var(--r);padding:13px;margin-bottom:18px}
.sum-row{display:flex;justify-content:space-between;font-size:13px;margin-bottom:7px;color:var(--mu2)}
.sum-row:last-child{margin:0;padding-top:8px;border-top:1px solid var(--bd);color:var(--txt);font-weight:700;font-size:14px}
.sum-val{font-family:var(--fm);color:var(--txt)}
.sum-row:last-child .sum-val{color:var(--acc3);font-size:16px}
.mact{display:flex;gap:10px}
.btn{flex:1;padding:11px;border-radius:var(--r);border:none;font-size:14px;font-weight:700;cursor:pointer;transition:all .15s;font-family:var(--fb)}
.btn-p{background:linear-gradient(135deg,var(--acc),#ff9500);color:#fff}
.btn-p:hover{opacity:.9;transform:translateY(-1px)}
.btn-s{background:var(--s2);color:var(--txt);border:1px solid var(--bd)}
.btn-s:hover{border-color:var(--acc);color:var(--acc)}
.btn-d{background:rgba(255,60,85,.12);color:var(--red);border:1px solid rgba(255,60,85,.25)}
.btn-d:hover{background:rgba(255,60,85,.22)}
.btn-sm{padding:6px 13px;font-size:12px;flex:none}
.btn-full{width:100%}

/* ── TABLE ── */
.tbl-wrap{background:var(--s1);border:1px solid var(--bd);border-radius:var(--r2);overflow:auto}
table{width:100%;border-collapse:collapse;min-width:600px}
thead{background:var(--s2)}
th{text-align:left;padding:11px 15px;font-size:10px;font-family:var(--fm);letter-spacing:1.5px;color:var(--mu);text-transform:uppercase;border-bottom:1px solid var(--bd)}
td{padding:12px 15px;font-size:13px;border-bottom:1px solid rgba(34,37,74,.5)}
tr:last-child td{border:none}
tr:hover td{background:rgba(255,255,255,.01)}
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-family:var(--fm);font-weight:600}
.b-act{background:rgba(0,201,122,.12);color:var(--grn);border:1px solid rgba(0,201,122,.22)}
.b-can{background:rgba(255,60,85,.1);color:var(--red);border:1px solid rgba(255,60,85,.2)}
.b-done{background:rgba(107,114,128,.1);color:var(--mu2);border:1px solid var(--bd)}
.chip{display:inline-block;padding:2px 8px;border-radius:5px;font-size:11px;font-family:var(--fm)}
.co{background:rgba(255,107,43,.12);color:var(--acc)}
.cb{background:rgba(30,144,255,.1);color:var(--acc2)}
.cg{background:rgba(0,201,122,.1);color:var(--grn)}
.cr{background:rgba(255,60,85,.1);color:var(--red)}
.ca{background:rgba(255,152,0,.1);color:var(--orn)}
.cy{background:rgba(255,215,0,.1);color:var(--acc3)}

/* ── AUTH ── */
.auth-pg{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;position:relative;overflow:hidden;background:var(--bg)}
.auth-bg-grad{position:absolute;inset:0;background:radial-gradient(ellipse at 20% 50%,rgba(255,107,43,.08) 0%,transparent 55%),radial-gradient(ellipse at 80% 30%,rgba(30,144,255,.07) 0%,transparent 55%),radial-gradient(ellipse at 50% 90%,rgba(0,201,122,.05) 0%,transparent 50%)}
.auth-dots{position:absolute;inset:0;background-image:radial-gradient(rgba(34,37,74,.7) 1px,transparent 1px);background-size:26px 26px}
.auth-card{position:relative;background:var(--s1);border:1px solid var(--bd2);border-radius:var(--r3);padding:38px;width:100%;max-width:420px;box-shadow:0 32px 80px rgba(0,0,0,.55)}
.auth-brand{text-align:center;margin-bottom:28px}
.auth-ic{width:62px;height:62px;border-radius:18px;margin:0 auto 14px;background:linear-gradient(135deg,var(--acc),#ff9500);display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 0 32px rgba(255,107,43,.3)}
.auth-city{font-family:var(--fm);font-size:11px;letter-spacing:3px;color:var(--acc);text-transform:uppercase;margin-bottom:4px}
.auth-name{font-family:var(--fd);font-size:30px;font-weight:700;letter-spacing:1px}
.auth-sub{font-size:11px;color:var(--mu);font-family:var(--fm);letter-spacing:2px;text-transform:uppercase;margin-top:3px}
.auth-tabs{display:flex;background:var(--s2);border-radius:var(--r);padding:4px;margin-bottom:22px;gap:4px}
.auth-tab{flex:1;padding:9px;border-radius:8px;border:none;background:transparent;color:var(--mu2);font-size:13px;font-weight:700;cursor:pointer;transition:all .15s;font-family:var(--fb)}
.auth-tab.act{background:var(--s1);color:var(--txt);box-shadow:0 1px 6px rgba(0,0,0,.4)}
.ferr{background:rgba(255,60,85,.1);border:1px solid rgba(255,60,85,.25);border-radius:var(--r);padding:10px 14px;font-size:13px;color:var(--red);margin-bottom:15px}
.demo-hint{text-align:center;margin-top:13px;font-size:11px;color:var(--mu);font-family:var(--fm)}

/* ── MISC ── */
.sh{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.sh-title{font-family:var(--fd);font-size:18px;font-weight:700;flex-shrink:0;letter-spacing:.5px}
.sh-line{flex:1;height:1px;background:var(--bd)}
.fbar{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center}
.fc{padding:6px 14px;border-radius:20px;border:1px solid var(--bd);background:transparent;color:var(--mu2);font-size:12px;font-family:var(--fm);cursor:pointer;transition:all .15s}
.fc:hover,.fc.act{border-color:var(--acc);color:var(--acc);background:rgba(255,107,43,.08)}
.srch{background:var(--s1);border:1px solid var(--bd);border-radius:7px;padding:7px 12px;color:var(--txt);font-family:var(--fm);font-size:12px;outline:none;width:195px;transition:border-color .15s}
.srch:focus{border-color:var(--acc)}
.toast-wrap{position:fixed;bottom:22px;right:22px;z-index:999;display:flex;flex-direction:column;gap:8px}
.toast{background:var(--s1);border:1px solid var(--bd);border-radius:var(--r);padding:11px 16px;font-size:13px;box-shadow:0 8px 32px rgba(0,0,0,.4);animation:tIn .22s ease;min-width:240px;display:flex;align-items:center;gap:9px}
.toast.ok{border-left:3px solid var(--grn)}.toast.err{border-left:3px solid var(--red)}.toast.warn{border-left:3px solid var(--orn)}
@keyframes tIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
.empty{text-align:center;padding:52px 20px;color:var(--mu)}
.empty-ic{font-size:44px;margin-bottom:12px}
.empty-txt{font-size:15px;color:var(--mu2);margin-bottom:4px;font-weight:600}
.empty-sub{font-size:12px;font-family:var(--fm)}
.a2col{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:20px}
.acard{background:var(--s1);border:1px solid var(--bd);border-radius:var(--r2);padding:19px}
.acard-ttl{font-family:var(--fd);font-size:15px;font-weight:700;margin-bottom:15px;letter-spacing:.3px}
.divider{height:1px;background:var(--bd);margin:16px 0}
@keyframes uPulse{0%,100%{opacity:.4;r:14px}50%{opacity:.9;r:18px}}
@media(max-width:900px){.sb{display:none}.main{margin-left:0}.a2col{grid-template-columns:1fr}}
@media(max-width:580px){.content{padding:14px}.stats-row{grid-template-columns:1fr 1fr}}

/* ── LEAFLET OVERRIDES ── */
.leaflet-popup-content-wrapper { background: var(--s1) !important; color: var(--txt) !important; border: 1px solid var(--bd2); border-radius: var(--r2) !important; padding: 0 !important; box-shadow: 0 12px 40px rgba(0,0,0,.6) !important; }
.leaflet-popup-content { margin: 10px 14px !important; width: auto !important; }
.leaflet-popup-tip { background: var(--s1) !important; border-top: 1px solid var(--bd2); border-left: 1px solid var(--bd2); }
.custom-leaflet-icon { background: transparent; border: none; }
.leaflet-container { background: #111322 !important; font-family: var(--fb) !important; }
`;

// ═══════════════════════════════════════════════════════════════════
// SOLAPUR REAL PARKING LOCATIONS — 12 locations with real coords
// Center of Solapur: 17.6868°N, 75.9064°E
// ═══════════════════════════════════════════════════════════════════
let LOCS = [];

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════
const uid = () => Math.random().toString(36).slice(2,10);
const nowISO = () => new Date().toISOString();
const fmtDT = iso => new Date(iso).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"});
const fmtT  = iso => new Date(iso).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
const diffH = (a,b) => Math.max(0.5, Math.round(((new Date(b)-new Date(a))/3600000)*10)/10);
const haversine = (la1,lo1,la2,lo2) => {
  const R=6371, dLa=((la2-la1)*Math.PI)/180, dLo=((lo2-lo1)*Math.PI)/180;
  const a=Math.sin(dLa/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLo/2)**2;
  return (R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))).toFixed(1);
};
const avail = (slots,locId) => slots.filter(s=>s.locId===locId&&s.status==="available").length;
const mkSlots = (locId,total) =>
  Array.from({length:total},(_,i)=>({
    id:`${locId}-${String(i+1).padStart(2,"0")}`,
    locId, label:`S${String(i+1).padStart(2,"0")}`,
    status: Math.random()<.42?(Math.random()<.55?"reserved":"occupied"):"available",
    bookingId:null,
  }));

const getSlotColor = (slots,locId) => {
  const loc=LOCS.find(l=>l.id===locId);
  const pct=avail(slots,locId)/loc.total;
  return pct>.4?"#00c97a":pct>.15?"#ff9800":"#ff3c55";
};

// ═══════════════════════════════════════════════════════════════════
// SOLAPUR MAP (LEAFLET)
// ═══════════════════════════════════════════════════════════════════

const createCustomIcon = (color, av, isSel) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="position: relative; width: 100%; height: 100%;">
        ${isSel ? `<div style="position: absolute; bottom: 0; left: -5px; width: 50px; height: 50px; border-radius: 50%; border: 1.5px solid ${color}; opacity: 0.5; animation: uPulse 1.6s infinite;"></div>` : ''}
        <div style="position: absolute; bottom: 0; left: 12px; width: 16px; height: 6px; background: rgba(0,0,0,0.4); border-radius: 50%;"></div>
        <svg viewBox="0 0 40 40" style="width: 40px; height: 40px; position: absolute; bottom: 4px; left: 0; filter: drop-shadow(0 0 8px ${color}88);">
          <path d="M20,38 C8,24 8,10 20,4 C32,10 32,24 20,38Z" fill="${color}" opacity="0.95" />
          <text x="20" y="24" text-anchor="middle" fill="#fff" font-size="16" font-weight="800" font-family="'Rajdhani',sans-serif">P</text>
        </svg>
        <div style="position: absolute; top: 10px; right: 0; width: 18px; height: 18px; border-radius: 50%; background: ${color}; border: 2px solid var(--bg); display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 4px ${color});">
          <span style="color: #000; font-size: 10px; font-weight: 800; font-family: sans-serif;">${av}</span>
        </div>
      </div>
    `,
    iconSize: [40, 60],
    iconAnchor: [20, 60],
    popupAnchor: [0, -60],
  });
};

const userIcon = L.divIcon({
  className: 'user-leaflet-icon',
  html: `
    <div style="position: relative; display: flex; justify-content: center; align-items: center; width: 44px; height: 44px;">
      <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(255,107,43,.07); border: 1px solid rgba(255,107,43,.3);"></div>
      <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: rgba(255,107,43,.2); animation: uPulse 2s infinite;"></div>
      <div style="position: absolute; width: 14px; height: 14px; border-radius: 50%; background: var(--acc); border: 2px solid white; filter: drop-shadow(0 0 7px var(--acc));"></div>
      <div style="position: absolute; top: -16px; color: var(--acc); font-size: 10px; font-weight: 700; font-family: 'JetBrains Mono',monospace;">YOU</div>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, map.getZoom(), { animate: true });
  }, [center ? center[0] : null, center ? center[1] : null, map]);
  return null;
}

function SolapurMap({ slots, userPos, onSelect, selId }) {
  const center = [17.6868, 75.9064];
  const selLoc = selId ? LOCS.find(l => l.id === selId) : null;
  const activeCenter = selLoc ? [selLoc.lat, selLoc.lng] : center;

  return (
    <div style={{ position: "relative", height: "100%", width: "100%", zIndex: 1, borderRadius: "var(--r2)", overflow: "hidden", border: "1px solid var(--bd2)" }}>
      <MapContainer center={activeCenter} zoom={14} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        <MapController center={activeCenter} />

        {LOCS.map(loc => {
          const color = getSlotColor(slots, loc.id);
          const av = avail(slots, loc.id);
          const isSel = selId === loc.id;
          return (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={createCustomIcon(color, av, isSel)}
              eventHandlers={{
                click: () => onSelect(loc),
              }}
            >
              <Popup closeButton={false}>
                <div style={{ width: 200 }}>
                  <div className="pu-name" style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{loc.name}</div>
                  <div className="pu-type" style={{ fontSize: 10, color: "var(--acc)", fontFamily: "var(--fm)", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>{loc.type}</div>
                  <div className="pu-addr" style={{ fontSize: 11, color: "var(--mu)", marginBottom: 10 }}>📌 {loc.address}</div>
                  <div className="pu-row" style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: "var(--mu2)" }}>Available</span>
                    <span style={{ color: "var(--grn)", fontFamily: "var(--fm)", fontWeight: 700 }}>{av} / {loc.total}</span>
                  </div>
                  <div className="pu-row" style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: "var(--mu2)" }}>Rate</span>
                    <span style={{ fontFamily: "var(--fm)" }}>₹{loc.price}/hr</span>
                  </div>
                  <div className="pu-row" style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: "var(--mu2)" }}>Note</span>
                    <span style={{ fontSize: 11, color: "var(--mu2)", textAlign: "right", maxWidth: 120 }}>{loc.note}</span>
                  </div>
                  {userPos && (
                    <div className="pu-row" style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                      <span style={{ color: "var(--mu2)" }}>Distance</span>
                      <span style={{ color: "var(--acc2)", fontFamily: "var(--fm)" }}>{haversine(userPos.lat, userPos.lng, loc.lat, loc.lng)} km</span>
                    </div>
                  )}
                  <button className="pu-btn" style={{ width: "100%", marginTop: 10, padding: 8, borderRadius: 8, border: "none", background: "var(--acc)", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "var(--fb)" }} onClick={(e) => { e.stopPropagation(); onSelect(loc); }}>View Slots →</button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {userPos && (
          <Marker position={[userPos.lat, userPos.lng]} icon={userIcon} />
        )}
      </MapContainer>

      {/* Legend */}
      <div className="map-legend" style={{ zIndex: 1000, pointerEvents: "none" }}>
        <div style={{ fontFamily: "var(--fm)", fontSize: 9, letterSpacing: 2, color: "var(--mu)", textTransform: "uppercase", marginBottom: 8 }}>AVAILABILITY</div>
        <div className="leg-row"><div className="leg-dot" style={{ background: "#00c97a" }} />High (40%+)</div>
        <div className="leg-row"><div className="leg-dot" style={{ background: "#ff9800" }} />Filling Fast</div>
        <div className="leg-row"><div className="leg-dot" style={{ background: "#ff3c55" }} />Almost Full</div>
        <div className="leg-row"><div className="leg-dot" style={{ background: "var(--acc)" }} />Your Location</div>
      </div>

      {/* GPS info */}
      <div className="loc-track" style={{ zIndex: 1000, pointerEvents: "none" }}>
        {userPos
          ? <><div style={{ color: "var(--acc)", fontWeight: 700, marginBottom: 3 }}>📡 GPS Active</div><div>{userPos.lat.toFixed(4)}°N, {userPos.lng.toFixed(4)}°E</div><div style={{ marginTop: 4 }}>Solapur, Maharashtra</div></>
          : <div>📍 GPS not enabled<br /><span style={{ fontSize: 10 }}>Enable for distances</span></div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════
const DEMO_USERS=[
  {id:"u1",name:"Rahul Patil",    email:"user@solapur.in",  password:"1234",  role:"user"},
  {id:"a1",name:"Admin Deshmukh", email:"admin@solapur.in", password:"admin", role:"admin"},
];

function Auth({onLogin}){
  const [tab,setTab]=useState("login");
  const [f,setF]=useState({name:"",email:"",password:"",role:"user"});
  const [err,setErr]=useState("");
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const submit=async ()=>{
    setErr("");
    try {
      if(tab==="login"){
        const u = await api.loginUser(f.email, f.password);
        onLogin(u);
      } else {
        if(!f.name||!f.email||!f.password) return setErr("All fields required.");
        const u = await api.registerUser(f);
        onLogin(u);
      }
    } catch (e) {
      setErr(e.response?.data?.error || "An error occurred");
    }
  };
  return(
    <div className="auth-pg">
      <div className="auth-bg-grad"/><div className="auth-dots"/>
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-ic">🅿️</div>
          <div className="auth-city">Solapur City</div>
          <div className="auth-name">PARKWISE</div>
          <div className="auth-sub">Smart Parking System · MERN</div>
        </div>
        <div className="auth-tabs">
          <button className={`auth-tab ${tab==="login"?"act":""}`} onClick={()=>setTab("login")}>Login</button>
          <button className={`auth-tab ${tab==="signup"?"act":""}`} onClick={()=>setTab("signup")}>Sign Up</button>
        </div>
        {err&&<div className="ferr">⚠ {err}</div>}
        {tab==="signup"&&(
          <div className="frow"><label className="flbl">Full Name</label>
            <input className="finput" placeholder="Rahul Patil" value={f.name} onChange={e=>set("name",e.target.value)}/></div>
        )}
        <div className="frow"><label className="flbl">Email</label>
          <input className="finput" type="email" placeholder="you@solapur.in" value={f.email} onChange={e=>set("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/></div>
        <div className="frow"><label className="flbl">Password</label>
          <input className="finput" type="password" placeholder="••••••••" value={f.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/></div>
        {tab==="signup"&&(
          <div className="frow"><label className="flbl">Account Type</label>
            <select className="fsel" value={f.role} onChange={e=>set("role",e.target.value)}><option value="user">User</option><option value="admin">Admin</option></select></div>
        )}
        <button className="btn btn-p btn-full" style={{marginTop:8}} onClick={submit}>
          {tab==="login"?"Login →":"Create Account →"}
        </button>
        <div className="demo-hint">{tab==="login"?"user@solapur.in / 1234  |  admin@solapur.in / admin":"All fields required to register"}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════
function Dashboard({slots,bookings,user,userPos,onNav}){
  const total=slots.length, av=slots.filter(s=>s.status==="available").length,
        rs=slots.filter(s=>s.status==="reserved").length, oc=slots.filter(s=>s.status==="occupied").length;
  const myActive=bookings.filter(b=>b.userId===user.id&&b.status==="active");
  const rev=bookings.filter(b=>b.status!=="cancelled").reduce((a,b)=>a+b.amount,0);
  const sorted=userPos?[...LOCS].sort((a,b)=>parseFloat(haversine(userPos.lat,userPos.lng,a.lat,a.lng))-parseFloat(haversine(userPos.lat,userPos.lng,b.lat,b.lng))):LOCS;

  return(
    <div>
      <div className="stats-row">
        <div className="stat co"><div className="stat-lbl">Total Slots</div><div className="stat-val">{total}</div><div className="stat-sub">{LOCS.length} Solapur locations</div></div>
        <div className="stat cg"><div className="stat-lbl">Available</div><div className="stat-val">{av}</div><div className="stat-sub">{Math.round(av/total*100)}% free right now</div></div>
        <div className="stat ca"><div className="stat-lbl">Reserved</div><div className="stat-val">{rs}</div><div className="stat-sub">pre-booked slots</div></div>
        <div className="stat cr"><div className="stat-lbl">Occupied</div><div className="stat-val">{oc}</div><div className="stat-sub">currently in use</div></div>
        {user.role==="admin"&&<div className="stat cy"><div className="stat-lbl">Revenue</div><div className="stat-val" style={{fontSize:26}}>₹{rev}</div><div className="stat-sub">total collected</div></div>}
      </div>

      {myActive.length>0&&(
        <>
          <div className="sh"><div className="sh-title">⚡ MY ACTIVE BOOKINGS</div><div className="sh-line"/></div>
          <div className="tbl-wrap" style={{marginBottom:22}}>
            <table><thead><tr><th>Slot</th><th>Location</th><th>Vehicle</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
            <tbody>{myActive.map(b=>(
              <tr key={b.id}>
                <td><span className="chip co">{b.slotLabel}</span></td>
                <td style={{fontSize:12}}>{b.locName}</td>
                <td><span className="chip cb">{b.vehicle}</span></td>
                <td style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu2)"}}>{fmtT(b.startTime)}</td>
                <td style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu2)"}}>{fmtT(b.endTime)}</td>
                <td><span className="badge b-act">● Active</span></td>
              </tr>
            ))}</tbody></table>
          </div>
        </>
      )}

      <div className="sh"><div className="sh-title">📍 SOLAPUR PARKING LOCATIONS</div><div className="sh-line"/></div>
      <div className="loc-grid">
        {sorted.map(loc=>{
          const avN=avail(slots,loc.id),pct=Math.round(avN/loc.total*100);
          const color=pct>40?"var(--grn)":pct>15?"var(--orn)":"var(--red)";
          const d=userPos?haversine(userPos.lat,userPos.lng,loc.lat,loc.lng):null;
          return(
            <div className="loc-card" key={loc.id} style={{"--lc":loc.color}} onClick={()=>onNav("find",loc.id)}>
              <div className="lc-type-badge">{loc.type}</div>
              <div className="lc-name">{loc.name}</div>
              <div className="lc-addr">📌 {loc.address}</div>
              <div className="lc-meta">
                <span className="tag">₹{loc.price}/hr</span>
                <span className="tag">{loc.total} slots</span>
                <span className="avail-chip" style={{background:`${color}18`,color}}>{avN} free</span>
                {d&&<span className="lc-dist">📍 {d} km</span>}
              </div>
              <div className="lc-bar-lbl"><span>{loc.area}</span><span>{pct}%</span></div>
              <div className="lc-bar"><div className="lc-bar-fill" style={{width:`${pct}%`,background:color}}/></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAP PAGE
// ═══════════════════════════════════════════════════════════════════
function MapPage({slots,userPos,onNav}){
  return(
    <div>
      <div style={{background:"var(--s1)",border:"1px solid var(--bd)",borderRadius:"var(--r2)",padding:"14px 18px",marginBottom:18,display:"flex",alignItems:"center",gap:14}}>
        <div style={{fontSize:28}}>🗺️</div>
        <div>
          <div style={{fontFamily:"var(--fd)",fontSize:17,fontWeight:700,letterSpacing:.5}}>Solapur City — {LOCS.length} Parking Zones</div>
          <div style={{fontSize:12,color:"var(--mu)",fontFamily:"var(--fm)"}}>Bhuikot Fort · Siddheshwar Temple · Railway Station · Bus Stand · SMC</div>
        </div>
        <div className="live-pill" style={{marginLeft:"auto"}}><div className="live-dot"/>Live Updates</div>
      </div>

      <div className="map-box">
        <div className="map-hdr">
          <div className="map-title">🗺️ Solapur Live Parking Map</div>
          <div style={{fontSize:12,color:"var(--mu)",fontFamily:"var(--fm)"}}>Hover pin → details · Click → book</div>
        </div>
        <div className="map-body" style={{height:500}}>
          <SolapurMap slots={slots} userPos={userPos} onSelect={loc=>onNav("find",loc.id)} selId={null}/>
        </div>
      </div>

      <div className="sh"><div className="sh-title">TOP {LOCS.length} PARKING ZONES</div><div className="sh-line"/></div>
      <div className="loc-grid">
        {[...LOCS].sort((a,b)=>userPos?parseFloat(haversine(userPos.lat,userPos.lng,a.lat,a.lng))-parseFloat(haversine(userPos.lat,userPos.lng,b.lat,b.lng)):0).map(loc=>{
          const avN=avail(slots,loc.id),pct=Math.round(avN/loc.total*100);
          const color=pct>40?"var(--grn)":pct>15?"var(--orn)":"var(--red)";
          const d=userPos?haversine(userPos.lat,userPos.lng,loc.lat,loc.lng):null;
          return(
            <div className="loc-card" key={loc.id} style={{"--lc":loc.color}} onClick={()=>onNav("find",loc.id)}>
              <div className="lc-type-badge">{loc.type}</div>
              <div className="lc-name">{loc.name}</div>
              <div className="lc-addr">📌 {loc.address}</div>
              <div className="lc-meta">
                <span className="tag">₹{loc.price}/hr</span>
                <span className="avail-chip" style={{background:`${color}18`,color}}>{avN} free</span>
                {d&&<span className="lc-dist">📍 {d} km</span>}
              </div>
              <div style={{fontSize:11,color:"var(--mu)",fontStyle:"italic",marginBottom:8}}>💡 {loc.note}</div>
              <div className="lc-bar"><div className="lc-bar-fill" style={{width:`${pct}%`,background:color}}/></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FIND & BOOK
// ═══════════════════════════════════════════════════════════════════
function FindPark({slots,setSlots,bookings,setBookings,user,userPos,addToast,initLocId}){
  const [selLoc,setSelLoc]=useState(initLocId?LOCS.find(l=>l.id===initLocId):null);
  const [selSlot,setSelSlot]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const [f,setF]=useState({vehicle:"",startTime:"",endTime:""});
  const [filter,setFilter]=useState("all");

  const openBook=slot=>{
    if(slot.status!=="available") return;
    setSelSlot(slot);
    const s=new Date(Date.now()+600000),e=new Date(s.getTime()+7200000);
    setF({vehicle:"",startTime:s.toISOString().slice(0,16),endTime:e.toISOString().slice(0,16)});
    setShowModal(true);
  };
  const confirm=()=>{
    if(!f.vehicle.trim()) return addToast("Enter vehicle number","err");
    if(new Date(f.endTime)<=new Date(f.startTime)) return addToast("End time must be after start","err");
    const hrs=diffH(f.startTime,f.endTime),amt=Math.round(hrs*selLoc.price);
    const bk={userId:user.id,userName:user.name,slotId:selSlot.id,slotLabel:selSlot.label,
      locId:selLoc.id,locName:selLoc.name,locType:selLoc.type,vehicle:f.vehicle.toUpperCase(),
      startTime:f.startTime,endTime:f.endTime,hours:hrs,amount:amt,status:"active"};
    api.createBooking(bk).then(newBk => {
      setBookings(p=>[newBk,...p]);
      setSlots(p=>p.map(s=>s.id===selSlot.id?{...s,status:"reserved",bookingId:newBk.id}:s));
      setShowModal(false); setSelSlot(null);
      addToast(`✓ Slot ${selSlot.label} booked at ${selLoc.name}!`,"ok");
    }).catch(e => addToast(e.response?.data?.error || "Booking failed", "err"));
  };
  const hrs=f.startTime&&f.endTime?diffH(f.startTime,f.endTime):0;
  const est=selLoc?Math.round(hrs*selLoc.price):0;
  const locSlots=selLoc?slots.filter(s=>s.locId===selLoc.id):[];

  const TYPE_FILTERS=["all",...new Set(LOCS.map(l=>l.type))];
  const filteredLocs=LOCS.filter(l=>filter==="all"||l.type===filter);
  const sortedLocs=userPos?[...filteredLocs].sort((a,b)=>parseFloat(haversine(userPos.lat,userPos.lng,a.lat,a.lng))-parseFloat(haversine(userPos.lat,userPos.lng,b.lat,b.lng))):filteredLocs;

  return(
    <div>
      {/* Map always visible */}
      <div className="map-box">
        <div className="map-hdr">
          <div className="map-title">🗺️ Solapur Map{selLoc&&<span style={{color:"var(--mu2)",fontSize:14,fontWeight:400}}> — {selLoc.name}</span>}</div>
          {selLoc&&<button className="btn btn-s btn-sm" onClick={()=>{setSelLoc(null);setSelSlot(null);}}>← All Locations</button>}
        </div>
        <div className="map-body" style={{height:360}}>
          <SolapurMap slots={slots} userPos={userPos} onSelect={setSelLoc} selId={selLoc?.id}/>
        </div>
      </div>

      {!selLoc?(
        <>
          <div className="sh"><div className="sh-title">SELECT PARKING ZONE</div><div className="sh-line"/></div>
          {/* Type filter */}
          <div className="fbar" style={{marginBottom:16,overflowX:"auto",flexWrap:"nowrap"}}>
            <button className={`fc ${filter==="all"?"act":""}`} onClick={()=>setFilter("all")}>ALL</button>
            {["🚉 RAILWAY","🏰 HERITAGE","🛕 TEMPLE","🚌 BUS STAND","🏙️ CITY CENTRE","🏛️ CIVIC","🕌 DARGAH","🔬 SCIENCE CTR","✈️ AIRPORT","🛒 MARKET","🏭 COMMERCIAL"].map(t=>(
              <button key={t} className={`fc ${filter===t?"act":""}`} onClick={()=>setFilter(t)} style={{whiteSpace:"nowrap"}}>{t}</button>
            ))}
          </div>
          <div className="loc-grid">
            {sortedLocs.map(loc=>{
              const avN=avail(slots,loc.id),pct=Math.round(avN/loc.total*100);
              const color=pct>40?"var(--grn)":pct>15?"var(--orn)":"var(--red)";
              const d=userPos?haversine(userPos.lat,userPos.lng,loc.lat,loc.lng):null;
              return(
                <div className="loc-card" key={loc.id} style={{"--lc":loc.color}} onClick={()=>setSelLoc(loc)}>
                  <div className="lc-type-badge">{loc.type}</div>
                  <div className="lc-name">{loc.name}</div>
                  <div className="lc-addr">📌 {loc.address}</div>
                  <div className="lc-meta">
                    <span className="tag">₹{loc.price}/hr</span>
                    <span className="tag">{loc.total} slots</span>
                    <span className="avail-chip" style={{background:`${color}18`,color}}>{avN} available</span>
                    {d&&<span className="lc-dist">📍 {d} km</span>}
                  </div>
                  <div style={{fontSize:11,color:"var(--mu)",fontStyle:"italic",marginBottom:8}}>💡 {loc.note}</div>
                  <div className="lc-bar-lbl"><span>{loc.area}</span><span>{pct}%</span></div>
                  <div className="lc-bar"><div className="lc-bar-fill" style={{width:`${pct}%`,background:color}}/></div>
                </div>
              );
            })}
          </div>
        </>
      ):(
        <div className="slot-panel">
          <div className="slot-panel-hdr">
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <span style={{background:`${selLoc.color}22`,color:selLoc.color,fontFamily:"var(--fm)",fontSize:10,padding:"2px 8px",borderRadius:4,border:`1px solid ${selLoc.color}44`}}>{selLoc.type}</span>
              </div>
              <div className="slot-loc-name">{selLoc.name}</div>
              <div className="slot-loc-meta">
                📌 {selLoc.address} &nbsp;·&nbsp; ₹{selLoc.price}/hr &nbsp;·&nbsp;
                <span style={{color:"var(--grn)"}}>{avail(slots,selLoc.id)} slots free</span>
                {userPos&&<span style={{color:"var(--acc2)"}}> &nbsp;·&nbsp; 📍 {haversine(userPos.lat,userPos.lng,selLoc.lat,selLoc.lng)} km</span>}
                <br/><span style={{fontSize:11,fontStyle:"italic",color:"var(--mu)"}}>💡 {selLoc.note}</span>
              </div>
            </div>
            <div className="slot-legend">
              <div className="sleg"><div className="sleg-dot av"/>Available</div>
              <div className="sleg"><div className="sleg-dot rs"/>Reserved</div>
              <div className="sleg"><div className="sleg-dot oc"/>Occupied</div>
            </div>
          </div>
          <div className="slots-g">
            {locSlots.map(slot=>(
              <button key={slot.id}
                className={`slot ${selSlot?.id===slot.id?"pk":slot.status==="available"?"av":slot.status==="reserved"?"rs":"oc"}`}
                onClick={()=>openBook(slot)} title={`${slot.label} — ${slot.status}`}>
                <span className="slot-ic">{slot.status==="available"?"🟢":slot.status==="reserved"?"🟡":"🔴"}</span>
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {showModal&&selSlot&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">BOOK SLOT {selSlot.label}</div>
            <div className="modal-sub">{selLoc.type} · {selLoc.name} · ₹{selLoc.price}/hr</div>
            <div className="frow"><label className="flbl">Vehicle Number (MH-13)</label>
              <input className="finput" placeholder="MH13AB1234" value={f.vehicle} onChange={e=>setF(p=>({...p,vehicle:e.target.value}))} style={{textTransform:"uppercase"}}/>
            </div>
            <div className="frow2">
              <div><label className="flbl">Start Time</label><input className="finput" type="datetime-local" value={f.startTime} onChange={e=>setF(p=>({...p,startTime:e.target.value}))}/></div>
              <div><label className="flbl">End Time</label><input className="finput" type="datetime-local" value={f.endTime} onChange={e=>setF(p=>({...p,endTime:e.target.value}))}/></div>
            </div>
            <div className="summary">
              <div className="sum-row"><span>Location</span><span className="sum-val">{selLoc.name}</span></div>
              <div className="sum-row"><span>Slot</span><span className="sum-val">{selSlot.label}</span></div>
              <div className="sum-row"><span>Duration</span><span className="sum-val">{hrs} hrs</span></div>
              <div className="sum-row"><span>Rate</span><span className="sum-val">₹{selLoc.price}/hr</span></div>
              <div className="sum-row"><span>Total Payable</span><span className="sum-val">₹{est}</span></div>
            </div>
            <div className="mact">
              <button className="btn btn-s" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-p" onClick={confirm}>Confirm Booking →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MY BOOKINGS
// ═══════════════════════════════════════════════════════════════════
function MyBookings({bookings,setBookings,slots,setSlots,user,addToast}){
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const mine=bookings.filter(b=>b.userId===user.id);
  const shown=mine.filter(b=>(filter==="all"||b.status===filter)&&(!search||b.vehicle.includes(search.toUpperCase())||b.locName.toLowerCase().includes(search.toLowerCase())));
  const cancel=b=>{
    api.cancelBooking(b.id).then(() => {
      setBookings(p=>p.map(x=>x.id===b.id?{...x,status:"cancelled"}:x));
      setSlots(p=>p.map(s=>s.id===b.slotId?{...s,status:"available",bookingId:null}:s));
      addToast(`Booking ${b.slotLabel} cancelled`,"warn");
    });
  };
  return(
    <div>
      <div className="fbar">
        {["all","active","completed","cancelled"].map(f=>(
          <button key={f} className={`fc ${filter===f?"act":""}`} onClick={()=>setFilter(f)}>{f.toUpperCase()}</button>
        ))}
        <input className="srch" placeholder="Search vehicle / location…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <span style={{fontFamily:"var(--fm)",fontSize:12,color:"var(--mu)",marginLeft:"auto"}}>{shown.length} records</span>
      </div>
      {shown.length===0?(
        <div className="empty"><div className="empty-ic">🎫</div><div className="empty-txt">No bookings found</div><div className="empty-sub">Book a slot from Find Parking</div></div>
      ):(
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Slot</th><th>Type</th><th>Location</th><th>Vehicle</th><th>Start</th><th>End</th><th>Hrs</th><th>Amount</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {shown.map(b=>(
                <tr key={b.id}>
                  <td><span className="chip co">{b.slotLabel}</span></td>
                  <td style={{fontSize:11,color:"var(--mu)"}}>{b.locType||""}</td>
                  <td style={{fontSize:12}}>{b.locName}</td>
                  <td><span className="chip cb">{b.vehicle}</span></td>
                  <td style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu2)"}}>{fmtDT(b.startTime)}</td>
                  <td style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu2)"}}>{fmtDT(b.endTime)}</td>
                  <td style={{fontFamily:"var(--fm)"}}>{b.hours}h</td>
                  <td style={{fontFamily:"var(--fm)",color:"var(--acc3)",fontWeight:700}}>₹{b.amount}</td>
                  <td><span className={`badge ${b.status==="active"?"b-act":b.status==="cancelled"?"b-can":"b-done"}`}>{b.status==="active"?"● Active":b.status==="cancelled"?"✕ Cancelled":"✓ Done"}</span></td>
                  <td>{b.status==="active"&&<button className="btn btn-d btn-sm" onClick={()=>cancel(b)}>Cancel</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════
function Admin({slots,setSlots,bookings,setBookings,addToast}){
  const [filter,setFilter]=useState("all");
  const [selLoc,setSelLoc]=useState(LOCS[0].id);
  const [nL,setNL]=useState({name:"",address:"",price:"",total:"",type:"🏙️ CITY CENTRE"});
  const locSlots=slots.filter(s=>s.locId===selLoc);
  const shown=bookings.filter(b=>filter==="all"||b.status===filter);
  const rev=bookings.filter(b=>b.status!=="cancelled").reduce((a,b)=>a+b.amount,0);
  const setSlotSt=(slot,st)=>{
    api.updateSlotStatus(slot.id, st).then(() => {
      setSlots(p=>p.map(s=>s.id===slot.id?{...s,status:st}:s));
      addToast(`${slot.label} → ${st}`,"ok");
    });
  };
  const markDone=b=>{
    api.completeBooking(b.id).then(() => {
      setBookings(p=>p.map(x=>x.id===b.id?{...x,status:"completed"}:x));
      setSlots(p=>p.map(s=>s.id===b.slotId?{...s,status:"available",bookingId:null}:s));
      addToast(`Booking ${b.slotLabel} completed`,"ok");
    });
  };
  return(
    <div>
      <div className="stats-row">
        <div className="stat cy"><div className="stat-lbl">Revenue</div><div className="stat-val" style={{fontSize:26}}>₹{rev}</div><div className="stat-sub">{bookings.filter(b=>b.status!=="cancelled").length} bookings</div></div>
        <div className="stat co"><div className="stat-lbl">Active</div><div className="stat-val">{bookings.filter(b=>b.status==="active").length}</div><div className="stat-sub">live bookings</div></div>
        <div className="stat cg"><div className="stat-lbl">Slots</div><div className="stat-val">{slots.length}</div><div className="stat-sub">{LOCS.length} locations</div></div>
        <div className="stat cb"><div className="stat-lbl">Available</div><div className="stat-val">{slots.filter(s=>s.status==="available").length}</div><div className="stat-sub">free now</div></div>
      </div>
      <div className="a2col">
        <div className="acard">
          <div className="acard-ttl">🅿️ Slot Status Manager</div>
          <select className="fsel" style={{marginBottom:14}} value={selLoc} onChange={e=>setSelLoc(e.target.value)}>
            {LOCS.map(l=><option key={l.id} value={l.id}>{l.type} {l.name}</option>)}
          </select>
          <div className="slots-g" style={{gridTemplateColumns:"repeat(auto-fill,minmax(62px,1fr))"}}>
            {locSlots.map(slot=>(
              <div key={slot.id}>
                <button className={`slot ${slot.status==="available"?"av":slot.status==="reserved"?"rs":"oc"}`}
                  style={{width:"100%",cursor:"default",fontSize:11}}>
                  <span style={{fontSize:13}}>{slot.status==="available"?"🟢":slot.status==="reserved"?"🟡":"🔴"}</span>
                  {slot.label}
                </button>
                <div style={{display:"flex",gap:2,marginTop:3}}>
                  {["available","reserved","occupied"].filter(s=>s!==slot.status).map(st=>(
                    <button key={st} onClick={()=>setSlotSt(slot,st)}
                      style={{flex:1,padding:"2px 0",border:"1px solid var(--bd)",borderRadius:4,background:"var(--s2)",color:"var(--mu)",fontSize:8,cursor:"pointer",fontFamily:"var(--fm)"}}>
                      {st.slice(0,3).toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="acard" style={{marginBottom:14}}>
            <div className="acard-ttl">➕ Add Solapur Location</div>
            <div className="frow"><label className="flbl">Location Name</label><input className="finput" placeholder="Mangalwar Peth Parking" value={nL.name} onChange={e=>setNL(p=>({...p,name:e.target.value}))}/></div>
            <div className="frow"><label className="flbl">Address, Solapur</label><input className="finput" placeholder="Mangalwar Peth, Solapur" value={nL.address} onChange={e=>setNL(p=>({...p,address:e.target.value}))}/></div>
            <div className="frow2">
              <div><label className="flbl">₹/hr</label><input className="finput" type="number" placeholder="20" value={nL.price} onChange={e=>setNL(p=>({...p,price:e.target.value}))}/></div>
              <div><label className="flbl">Total Slots</label><input className="finput" type="number" placeholder="20" value={nL.total} onChange={e=>setNL(p=>({...p,total:e.target.value}))}/></div>
            </div>
            <div className="frow"><label className="flbl">Type</label>
              <select className="fsel" value={nL.type} onChange={e=>setNL(p=>({...p,type:e.target.value}))}>
                {["🏙️ CITY CENTRE","🛕 TEMPLE","🚉 RAILWAY","🚌 BUS STAND","🏰 HERITAGE","🛒 MARKET","✈️ AIRPORT","🏭 COMMERCIAL","🏛️ CIVIC","🕌 DARGAH"].map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <button className="btn btn-p btn-full" onClick={()=>{
              if(!nL.name||!nL.address||!nL.price||!nL.total) return addToast("Fill all fields","err");
              api.createLocation(nL).then(newLoc => {
                LOCS.push(newLoc);
                addToast("✓ Location saved successfully","ok");
                setNL({name:"",address:"",price:"",total:"",type:"🏙️ CITY CENTRE"});
              });
            }}>Add Location</button>
          </div>
          <div className="acard">
            <div className="acard-ttl">📊 All Zones Summary</div>
            <div style={{display:"flex",flexDirection:"column",gap:7,maxHeight:280,overflowY:"auto"}}>
              {LOCS.map(loc=>{
                const av=avail(slots,loc.id),oc=slots.filter(s=>s.locId===loc.id&&s.status==="occupied").length,rs=slots.filter(s=>s.locId===loc.id&&s.status==="reserved").length;
                const pct=Math.round(av/loc.total*100);
                const color=pct>40?"var(--grn)":pct>15?"var(--orn)":"var(--red)";
                return(
                  <div key={loc.id} style={{padding:"9px 11px",background:"var(--s2)",borderRadius:9,border:"1px solid var(--bd)",borderLeft:`3px solid ${loc.color}`}}>
                    <div style={{fontWeight:700,fontSize:12,marginBottom:6,display:"flex",justifyContent:"space-between"}}>
                      <span>{loc.name}</span><span style={{color,fontFamily:"var(--fm)",fontSize:11}}>{av}/{loc.total}</span>
                    </div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                      <span className="chip cg" style={{fontSize:10}}>{av} free</span>
                      <span className="chip ca" style={{fontSize:10}}>{rs} rsv</span>
                      <span className="chip cr" style={{fontSize:10}}>{oc} occ</span>
                      <span className="chip co" style={{fontSize:10}}>₹{loc.price}/hr</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="sh"><div className="sh-title">ALL BOOKINGS</div><div className="sh-line"/></div>
      <div className="fbar">
        {["all","active","completed","cancelled"].map(f=>(
          <button key={f} className={`fc ${filter===f?"act":""}`} onClick={()=>setFilter(f)}>{f.toUpperCase()}</button>
        ))}
        <span style={{fontFamily:"var(--fm)",fontSize:12,color:"var(--mu)",marginLeft:"auto"}}>{shown.length} records</span>
      </div>
      {shown.length===0?(
        <div className="empty"><div className="empty-ic">📋</div><div className="empty-txt">No bookings yet</div><div className="empty-sub">Bookings appear here in real-time</div></div>
      ):(
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>User</th><th>Slot</th><th>Location</th><th>Vehicle</th><th>Start</th><th>Hrs</th><th>Amt</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {shown.map(b=>(
                <tr key={b.id}>
                  <td style={{fontSize:12}}>{b.userName}</td>
                  <td><span className="chip co">{b.slotLabel}</span></td>
                  <td style={{fontSize:12}}>{b.locName}</td>
                  <td><span className="chip cb">{b.vehicle}</span></td>
                  <td style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--mu2)"}}>{fmtDT(b.startTime)}</td>
                  <td style={{fontFamily:"var(--fm)"}}>{b.hours}h</td>
                  <td style={{fontFamily:"var(--fm)",color:"var(--acc3)",fontWeight:700}}>₹{b.amount}</td>
                  <td><span className={`badge ${b.status==="active"?"b-act":b.status==="cancelled"?"b-can":"b-done"}`}>{b.status==="active"?"● Active":b.status==="cancelled"?"✕":b.status==="completed"?"✓ Done":b.status}</span></td>
                  <td>{b.status==="active"&&<button className="btn btn-s btn-sm" onClick={()=>markDone(b)}>Complete</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════


export default function App(){
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [findLocId,setFindLocId]=useState(null);
  const [slots,setSlots]=useState([]);
  const [bookings,setBookings]=useState([]);
  const [toasts,setToasts]=useState([]);
  const [userPos,setUserPos]=useState(null);
  const [time,setTime]=useState(new Date());
  const [locsLoaded,setLocsLoaded]=useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const locData = await api.fetchLocations();
        LOCS.length = 0; LOCS.push(...locData); // Update globally
        const slotsData = await api.fetchSlots();
        setSlots(slotsData);
        const bookingsData = await api.fetchBookings();
        setBookings(bookingsData);
        setLocsLoaded(true);
      } catch (e) { console.error(e); }
    };
    loadData();
  }, []);

  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t)},[]);

  useEffect(()=>{
    if(!user) return;
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        pos=>setUserPos({lat:pos.coords.latitude,lng:pos.coords.longitude}),
        ()=>setUserPos({lat:17.6868,lng:75.9064}) // Solapur center fallback
      );
    } else setUserPos({lat:17.6868,lng:75.9064});
  },[user]);

  // Live slot simulation (Socket.io equivalent) - Optional: Poll backend for updates
  useEffect(()=>{
    if(!user) return;
    const id=setInterval(async ()=>{
      try {
        const slotsData = await api.fetchSlots();
        setSlots(slotsData);
        const bookingsData = await api.fetchBookings();
        setBookings(bookingsData);
      } catch (e) {}
    },5000);
    return()=>clearInterval(id);
  },[user]);

  const addToast=useCallback((msg,type="ok")=>{
    const t={id:uid(),msg,type};
    setToasts(p=>[...p,t]);
    setTimeout(()=>setToasts(p=>p.filter(x=>x.id!==t.id)),3500);
  },[]);

  const navTo=(pg,locId=null)=>{setPage(pg);if(locId) setFindLocId(locId);};

  if(!locsLoaded) return <div style={{padding:20,color:'white'}}>Loading...</div>;
  if(!user) return(<><style>{CSS}</style><Auth onLogin={u=>{setUser(u);setPage(u.role==="admin"?"admin":"dashboard")}}/></>);

  const activeCnt=bookings.filter(b=>b.userId===user.id&&b.status==="active").length;
  const avTotal=slots.filter(s=>s.status==="available").length;

  const NAV=[
    {id:"dashboard",label:"Dashboard",ic:"📊"},
    {id:"map",label:"Solapur Map",ic:"🗺️"},
    {id:"find",label:"Find & Book",ic:"🔍"},
    {id:"bookings",label:"My Bookings",ic:"🎫",bdg:activeCnt||null},
    ...(user.role==="admin"?[{id:"admin",label:"Admin Panel",ic:"🛠️"}]:[]),
  ];
  const TITLES={dashboard:"Dashboard",map:"Solapur Live Map",find:"Find Parking",bookings:"My Bookings",admin:"Admin Panel"};

  return(
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* Sidebar */}
        <aside className="sb">
          <div className="sb-brand">
            <div className="sb-brand-icon">🅿️</div>
            <div>
              <div className="sb-city">Solapur City</div>
              <div className="sb-app">PARKWISE</div>
              <div className="sb-ver">v2.0 · MERN Stack</div>
            </div>
          </div>
          <nav className="sb-nav">
            <div className="sb-sec">Navigation</div>
            {NAV.filter(n=>n.id!=="admin").map(n=>(
              <button key={n.id} className={`sb-btn ${page===n.id?"act":""}`} onClick={()=>navTo(n.id)}>
                <span className="ic">{n.ic}</span>{n.label}
                {n.bdg&&<span className="sb-bdg">{n.bdg}</span>}
              </button>
            ))}
            {user.role==="admin"&&(
              <><div className="sb-sec">Admin</div>
              <button className={`sb-btn ${page==="admin"?"act":""}`} onClick={()=>navTo("admin")}><span className="ic">🛠️</span>Admin Panel</button></>
            )}

            <div className="sb-sec" style={{marginTop:8}}>Live Zones — {avTotal} Free</div>
            <div className="sb-live">
              {LOCS.map(loc=>{
                const avN=avail(slots,loc.id),pct=avN/loc.total;
                const color=pct>.4?"var(--grn)":pct>.15?"var(--orn)":"var(--red)";
                return(
                  <div key={loc.id} className="sb-loc-row" onClick={()=>navTo("find",loc.id)}>
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span className="sb-loc-name" title={loc.name}>{loc.name}</span>
                        <span className="sb-loc-cnt" style={{color,marginLeft:6}}>{avN}/{loc.total}</span>
                      </div>
                      <div className="sb-bar"><div className="sb-bar-fill" style={{width:`${pct*100}%`,background:color}}/></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </nav>
          <div className="sb-user">
            <div className="sb-av">{user.name[0]}</div>
            <div><div className="sb-uname">{user.name.split(" ")[0]}</div><div className="sb-urole">{user.role.toUpperCase()} · MH-13</div></div>
            <button className="logout-btn" onClick={()=>setUser(null)}>OUT</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main">
          <div className="topbar">
            <div className="topbar-l">
              <div className="pg-tag">Solapur · MH-13</div>
              <div className="pg-title">{TITLES[page]}</div>
            </div>
            <div className="topbar-r">
              {userPos&&(
                <div style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--acc)",background:"rgba(255,107,43,.08)",border:"1px solid rgba(255,107,43,.18)",padding:"4px 10px",borderRadius:6}}>
                  📡 GPS {userPos.lat.toFixed(4)}°N
                </div>
              )}
              <div className="live-pill"><div className="live-dot"/>{avTotal} slots free</div>
              <div className="clk">{time.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
            </div>
          </div>

          <div className="content">
            {page==="dashboard"&&<Dashboard slots={slots} bookings={bookings} user={user} userPos={userPos} onNav={navTo}/>}
            {page==="map"&&<MapPage slots={slots} userPos={userPos} onNav={navTo}/>}
            {page==="find"&&<FindPark slots={slots} setSlots={setSlots} bookings={bookings} setBookings={setBookings} user={user} userPos={userPos} addToast={addToast} initLocId={findLocId}/>}
            {page==="bookings"&&<MyBookings bookings={bookings} setBookings={setBookings} slots={slots} setSlots={setSlots} user={user} addToast={addToast}/>}
            {page==="admin"&&user.role==="admin"&&<Admin slots={slots} setSlots={setSlots} bookings={bookings} setBookings={setBookings} addToast={addToast}/>}
          </div>
        </main>

        {/* Toasts */}
        <div className="toast-wrap">
          {toasts.map(t=>(
            <div key={t.id} className={`toast ${t.type}`}>
              <span>{t.type==="ok"?"✅":t.type==="err"?"❌":"⚠️"}</span>{t.msg}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
