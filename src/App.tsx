import { useState } from "react";
import questionsData from "./data/questions.json";

interface Q { id:number; topic:string; question:string; options:string[]; correct:number; explanation:string; exam?:string; }
type Sec = "p1"|"p2"|"p3";
type Scr = "home"|"topics"|"exams"|"quiz"|"results";

const T:Record<string,string> = {
  vat_lieu:"Vật liệu & Kim loại học", xu_ly_be_mat:"Xử lý bề mặt", duc:"Công nghệ Đúc",
  gia_cong_ap_luc:"Gia công áp lực", han:"Công nghệ Hàn", cat_got:"Gia công cắt gọt",
  may_cong_cu:"Máy công cụ", dung_sai:"Dung sai & Đo lường", tu_dong_hoa:"Tự động hóa & CNC",
  gia_cong_dac_biet:"Gia công đặc biệt",
};
const TI:Record<string,string> = {
  vat_lieu:"🔬", xu_ly_be_mat:"🛡️", duc:"🏭", gia_cong_ap_luc:"⚙️", han:"🔥",
  cat_got:"🔪", may_cong_cu:"🏗️", dung_sai:"📐", tu_dong_hoa:"🤖", gia_cong_dac_biet:"✨",
};
const EN:Record<string,string> = {
  "20172":"Kỳ 20172 (2017-2018 HK2)",
  "546105":"Mã đề 546105",
  "502106":"Mã đề 502106",
  "536103":"Mã đề 536103",
  "512102":"Mã đề 512102",
  "006":"Đề số 006",
  "007":"Đề số 007",
  "extra":"Đề thi tổng hợp",
};

const allQ = questionsData as Q[];
const p1Q = allQ.filter(q=>q.id<=300);
const p2Q = allQ.filter(q=>q.id>300&&q.id<=400);
const p3Q = allQ.filter(q=>q.id>400);
const OL = ["A","B","C","D","E"];

function tm(sec:Sec) {
  const qs = sec==="p1"?p1Q:sec==="p2"?p2Q:p3Q;
  const m:Record<string,Q[]> = {};
  for(const q of qs){ if(!m[q.topic]) m[q.topic]=[]; m[q.topic].push(q); }
  return m;
}
function em() {
  const m:Record<string,Q[]> = {};
  for(const q of p3Q){ const e=q.exam||"unknown"; if(!m[e]) m[e]=[]; m[e].push(q); }
  return m;
}

export default function App() {
  const [scr,setScr] = useState<Scr>("home");
  const [sec,setSec] = useState<Sec>("p1");
  const [qzQ,setQzQ] = useState<Q[]>([]);
  const [qzN,setQzN] = useState("");
  const [fS,setFS] = useState(0);
  const [fT,setFT] = useState(0);
  const [fA,setFA] = useState<(number|null)[]>([]);
  const [ci,setCI] = useState(0);
  const [sa,setSA] = useState<number|null>(null);
  const [sr,setSR] = useState(false);
  const [sc,setSC] = useState(0);
  const [ua,setUA] = useState<(number|null)[]>([]);
  const [sw,setSW] = useState(false);

  const goHome = ()=>setScr("home");
  const selSec = (s:Sec)=>{ setSec(s); setScr(s==="p3"?"exams":"topics"); };
  const startQuiz = (qs:Q[],name:string,shuffle=true)=>{
    const sh=shuffle?[...qs].sort(()=>Math.random()-.5):[...qs];
    setQzQ(sh);setQzN(name);setCI(0);setSA(null);setSR(false);setSC(0);
    setUA(new Array(sh.length).fill(null));setScr("quiz");setSW(false);
  };
  const selTopic = (t:string)=>{
    const qs=(sec==="p1"?p1Q:sec==="p2"?p2Q:p3Q).filter(q=>q.topic===t);
    startQuiz(qs,T[t]||t);
  };
  const selAll = ()=>{
    const qs=sec==="p1"?p1Q:sec==="p2"?p2Q:p3Q;
    const n=sec==="p1"?"Tất cả (300 câu)":sec==="p2"?"Tất cả (Câu hỏi tổng hợp)":"Tất cả đề thi";
    startQuiz(qs,n);
  };
  const selExam = (e:string)=>{
    const qs=p3Q.filter(q=>q.exam===e);
    startQuiz(qs,EN[e]||("Đề thi "+e),false);
  };

  const Hdr = ()=>(
    <header className="hdr"><div className="ctn hdr-in">
      <button className="logo" onClick={goHome}>CNCK</button>
      <div className="sep"/><span className="sub">Ôn tập Công nghệ Cơ khí Cơ bản</span>
    </div></header>
  );

  // HOME
  if(scr==="home") return <>
    <Hdr/>
    <div className="ctn">
      <div className="ht">
        <h1>Ôn tập Công nghệ Cơ khí Cơ bản</h1>
        <p>PGS. TS. Vũ Đình Toại - Trường Cơ khí, ĐHBK Hà Nội</p>
        <p>{allQ.length} câu hỏi trắc nghiệm</p>
      </div>
      <div className="g2">
        <button className="sc" onClick={()=>selSec("p1")}>
          <div className="sh"><div className="sn sn1">1</div>
          <div><div className="st">300 câu trắc nghiệm</div><div className="ss">Ngân hàng câu hỏi có giải đáp</div></div></div>
          <div className="tags">{Object.entries(tm("p1")).map(([t,qs])=><span key={t} className="tag">{T[t]||t} ({qs.length})</span>)}</div>
          <div className="sl sl1">{p1Q.length} câu →</div>
        </button>
        <button className="sc" onClick={()=>selSec("p2")}>
          <div className="sh"><div className="sn sn2">2</div>
          <div><div className="st">Câu hỏi tổng hợp</div><div className="ss">Bổ sung từ bài giảng</div></div></div>
          <div className="tags">{Object.entries(tm("p2")).map(([t,qs])=><span key={t} className="tag">{T[t]||t} ({qs.length})</span>)}</div>
          <div className="sl sl2">{p2Q.length} câu →</div>
        </button>
        <button className="sc" onClick={()=>selSec("p3")}>
          <div className="sh"><div className="sn sn3">3</div>
          <div><div className="st">Đề thi các năm</div><div className="ss">Luyện đề thi thực tế</div></div></div>
          <div className="tags">{Object.entries(em()).map(([e,qs])=><span key={e} className="tag">{EN[e]||e} ({qs.length})</span>)}</div>
          <div className="sl sl3">{p3Q.length} câu →</div>
        </button>
      </div>
      <div className="ov"><h3>Tổng quan chủ đề</h3>
        <div className="ovg">{Object.entries(T).map(([k,n])=>{
          const c=allQ.filter(q=>q.topic===k).length;
          if(!c)return null;
          return <div key={k} className="ovi"><div className="ovik">{TI[k]||"📚"}</div>
          <div className="ovin">{n}</div><div className="ovic">{c} câu</div></div>;
        })}</div>
      </div>
    </div>
    <div className="ft">Dựa trên bài giảng PGS. TS. Vũ Đình Toại - ĐHBK Hà Nội</div>
  </>;

  // TOPICS (Part 1 & 2)
  if(scr==="topics") {
    const mp=tm(sec); const tot=sec==="p1"?p1Q.length:p2Q.length;
    return <>
      <Hdr/>
      <div className="ctn" style={{paddingTop:24,paddingBottom:32}}>
        <button className="bb" onClick={goHome}>← Quay lại</button>
        <div className="pt">{sec==="p1"?"Phần 1: 300 câu trắc nghiệm":"Phần 2: Câu hỏi tổng hợp"}</div>
        <div className="ps">Chọn chủ đề hoặc làm tất cả</div>
        <button className="ab" onClick={selAll}>Làm tất cả ({tot} câu)</button>
        <div className="tg">{Object.entries(mp).sort((a,b)=>b[1].length-a[1].length).map(([t,qs])=>
          <button key={t} className="tc" onClick={()=>selTopic(t)}>
            <span className="ti">{TI[t]||"📚"}</span>
            <div style={{flex:1}}><div className="tn">{T[t]||t}</div><div className="tcc">{qs.length} câu</div></div>
            <span className="ta">→</span>
          </button>
        )}</div>
      </div>
    </>;
  }

  // EXAMS (Part 3)
  if(scr==="exams") {
    const mp=em();
    return <>
      <Hdr/>
      <div className="ctn" style={{paddingTop:24,paddingBottom:32}}>
        <button className="bb" onClick={goHome}>← Quay lại</button>
        <div className="pt">Phần 3: Đề thi các năm</div>
        <div className="ps">Chọn đề thi để luyện</div>
        <button className="ab" onClick={selAll}>Làm tất cả ({p3Q.length} câu)</button>
        <div className="tg">{Object.entries(mp).map(([e,qs])=>
          <button key={e} className="tc" onClick={()=>selExam(e)}>
            <span className="ti">📝</span>
            <div style={{flex:1}}><div className="tn">{EN[e]||("Đề thi "+e)}</div><div className="tcc">{qs.length} câu</div></div>
            <span className="ta">→</span>
          </button>
        )}</div>
      </div>
    </>;
  }

  // QUIZ
  if(scr==="quiz") {
    const q=qzQ[ci]; const prog=((ci+1)/qzQ.length)*100;
    const hSel=(idx:number)=>{
      if(sr)return; setSA(idx);setSR(true);
      const na=[...ua];na[ci]=idx;setUA(na);
      if(idx===q.correct)setSC(s=>s+1);
    };
    const hNext=()=>{
      if(ci<qzQ.length-1){setCI(i=>i+1);setSA(null);setSR(false);}
      else{setFS(sc);setFT(qzQ.length);setFA(ua);setScr("results");}
    };
    return <>
      <Hdr/>
      <div className="ctn" style={{paddingTop:24,paddingBottom:32,maxWidth:720}}>
        <div className="qt">
          <button className="bb" onClick={()=>setScr(sec==="p3"?"exams":"topics")}>← Thoát</button>
          <div className="sd"><span className="sdn">{sc}</span> đúng / {ci+(sr?1:0)} đã làm</div>
        </div>
        <div className="pw">
          <div className="pi"><span>{qzN}</span><span>Câu {ci+1}/{qzQ.length}</span></div>
          <div className="pb"><div className="pf" style={{width:`${prog}%`}}/></div>
        </div>
        <div className="qc">
          <div className="qi">Câu {q.id}</div>
          <div className="qtx">{q.question}</div>
          <div className="opts">{q.options.map((opt,idx)=>{
            let c="opt",l="ol";
            if(sr){c+=" dis";if(idx===q.correct){c+=" cor";l+=" cl";}else if(idx===sa){c+=" wrg";l+=" wl";}}
            return <div key={idx} className={c} onClick={()=>hSel(idx)}>
              <span className={l}>{OL[idx]}</span><span className="ot">{opt}</span>
            </div>;
          })}</div>
        </div>
        {sr&&<div className={`ex ${sa===q.correct?"eok":"eno"}`}>
          <div className="eh"><span>{sa===q.correct?"✅":"❌"}</span><span>{sa===q.correct?"Chính xác!":"Sai rồi!"}</span></div>
          <p>{q.explanation}</p>
        </div>}
        {sr&&<button className="nb" onClick={hNext}>{ci<qzQ.length-1?"Câu tiếp theo →":"Xem kết quả"}</button>}
      </div>
    </>;
  }

  // RESULTS
  const pct=Math.round((fS/fT)*100);
  const wQ=qzQ.filter((_,i)=>fA[i]!==_.correct);
  let grade="",gc="";
  if(pct>=90){grade="Xuất sắc";gc="gok";}
  else if(pct>=70){grade="Khá";gc="ggd";}
  else if(pct>=50){grade="Trung bình";gc="gmd";}
  else{grade="Cần ôn thêm";gc="gbd";}

  return <>
    <Hdr/>
    <div className="ctn" style={{paddingTop:24,paddingBottom:32,maxWidth:720}}>
      <button className="bb" onClick={()=>setScr(sec==="p3"?"exams":"topics")}>← Quay lại</button>
      <div className="rc">
        <div className="rp">{pct}%</div>
        <div className={`rg ${gc}`}>{grade}</div>
        <div className="rd">{fS}/{fT} câu đúng — {qzN}</div>
        <div className="rs">
          <div><div className="rsn g">{fS}</div><div className="rsl">Đúng</div></div>
          <div><div className="rsn r">{fT-fS}</div><div className="rsl">Sai</div></div>
        </div>
        <div className="rbs">
          <button className="rb1" onClick={()=>startQuiz(qzQ,qzN)}>Làm lại</button>
          {wQ.length>0&&<button className="rb2" onClick={()=>setSW(!sw)}>{sw?"Ẩn":"Xem"} câu sai ({wQ.length})</button>}
        </div>
      </div>
      {sw&&<div className="wl">
        <h3 style={{fontWeight:700,fontSize:18,marginBottom:8}}>Các câu trả lời sai:</h3>
        {wQ.map(q=>{const qi=qzQ.indexOf(q);const uans=fA[qi];
          return <div key={q.id} className="wi">
            <div className="qi">Câu {q.id}</div>
            <div className="wq">{q.question}</div>
            <div className="wos">{q.options.map((o,i)=>
              <div key={i} className={`wo ${i===q.correct?"wc":i===uans?"ww":"wn"}`}>
                <b style={{width:20}}>{OL[i]}.</b> {o}{i===q.correct?" ✅":""}{i===uans&&i!==q.correct?" ❌":""}
              </div>
            )}</div>
            <div className="we">{q.explanation}</div>
          </div>;
        })}
      </div>}
    </div>
  </>;
}
