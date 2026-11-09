'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';
import {ArrowLeft, ArrowRight, ArrowUpRight, List, Plus, X} from 'lucide-react';
import EmphasizedText, {type TextEmphasis} from './emphasized-text';
import type {Project, ResearchFigure, ResearchSection, ResearchTable} from './data';

function Process({steps}:{steps:{title:string;detail?:string}[]}) {
  return <ol className="research-process">{steps.map((step,index)=><li key={step.title}>
    <span className="process-number">{String(index+1).padStart(2,'0')}</span>
    <b>{step.title}</b>{step.detail&&<span>{step.detail}</span>}
    {index<steps.length-1&&<ArrowRight className="process-arrow" size={16} aria-hidden="true"/>}
  </li>)}</ol>;
}

function ResearchDiagram({kind}:{kind:NonNullable<ResearchSection['diagram']>}) {
  if(kind==='dvqa-training') return <figure className="research-diagram">
    <figcaption><span>MODEL TRAINING</span><b>한국어 문서 이해 모델 학습</b></figcaption>
    <div className="training-lane"><span>SFT</span><Process steps={[
      {title:'문서 학습 데이터',detail:'이미지 · 질문 · 답변 · instruction'},
      {title:'8B MLLM 학습',detail:'한국어 Document VQA'},
      {title:'SFT 모델',detail:'질문에 대한 답변 생성'},
    ]}/></div>
    <div className="training-lane"><span>DPO</span><Process steps={[
      {title:'답변 후보 생성',detail:'SFT 모델의 복수 출력'},
      {title:'선호 쌍 구성',detail:'GPT API로 rejected 선별 · 의미 중복 제외'},
      {title:'LoRA DPO',detail:'LoRA 파라미터 업데이트'},
    ]}/></div>
    <p>답변의 정답 학습에 선호 학습을 더해 문서 질의응답 모델을 개선했습니다.</p>
  </figure>;
  if(kind==='retrieval-training') return <figure className="research-diagram">
    <figcaption><span>RETRIEVAL TRAINING</span><b>검색 헤드의 2단계 대조 학습</b></figcaption>
    <div className="retrieval-stages">
      <div><span>STAGE 01</span><h5>다른 문서 사이의 구분</h5><p>질문과 쌍을 이루는 문서: positive<br/>다른 문서: negative</p></div>
      <ArrowRight size={20} aria-hidden="true"/>
      <div><span>STAGE 02</span><h5>같은 문서 안의 페이지 구분</h5><p>정답이 포함된 페이지: positive<br/>같은 문서의 다른 페이지: hard negative</p></div>
    </div>
    <div className="diagram-learning-note"><b>MLLM 백본 고정</b><span>InfoNCE</span><b>Retrieval head 학습</b></div>
  </figure>;
  if(kind==='dvqa-inference') return <figure className="research-diagram">
    <figcaption><span>INFERENCE</span><b>학습한 모델로 검색부터 답변까지</b></figcaption>
    <Process steps={[
      {title:'PDF + 질문',detail:'여러 페이지의 문서 이미지'},
      {title:'관련 페이지 검색',detail:'MLLM + retrieval head'},
      {title:'근거 페이지 선택',detail:'질문과 관련된 시각 정보'},
      {title:'답변 생성',detail:'선택한 페이지 + 질문'},
    ]}/>
  </figure>;
  if(kind==='data-validation') return <figure className="research-diagram">
    <figcaption><span>CONDITIONAL VALIDATION</span><b>판단 원인에 따른 재검증</b></figcaption>
    <Process steps={[
      {title:'초기 검증',detail:'클래스 · 라벨 적합성'},
      {title:'추가 확인 분기',detail:'판단이 어려운 사례 선별'},
      {title:'원인별 정보 보완',detail:'이미지 품질 보완 · 참조 샘플'},
      {title:'재평가',detail:'통과 · 반려 · 사람 검토'},
    ]}/>
    <p>과거 검수 체인의 개발 흐름. 현행 모델의 실행 구성과 구분해 설명합니다.</p>
  </figure>;
  return <figure className="research-diagram">
    <figcaption><span>INFERENCE PIPELINE</span><b>추론 효율을 고려한 MLLM 서빙</b></figcaption>
    <Process steps={[
      {title:'데이터 입력',detail:'이미지 · 객체 크롭'},
      {title:'LangChain',detail:'단계별 요청 · 병렬 작업'},
      {title:'vLLM 추론 서버',detail:'27B MLLM · thinking'},
      {title:'결과 취합',detail:'자동 판정 · 사람 리뷰'},
    ]}/>
    <div className="diagram-learning-note"><span>MTP</span><span>동일 입력 prefix의 KV cache 재사용</span></div>
  </figure>;
}

function QuantitativeTable({table}:{table:ResearchTable}) {
  return <figure className="research-table-figure">
    <div className="table-scroll" role="region" aria-label={table.title} tabIndex={0}>
      <table className="research-table">
        <caption>{table.title}</caption>
        <thead><tr>{table.columns.map((column,i)=><th key={`${column}-${i}`} scope="col">{column}</th>)}</tr></thead>
        <tbody>{table.rows.map((row,i)=><tr key={i} className={row.highlight?'proposed-row':undefined}>
          {row.cells.map((cell,j)=>j===0?<th key={j} scope="row">{cell}</th>:<td key={j}>{cell}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
    <figcaption>{table.note}</figcaption>
  </figure>;
}

function Figure({figure,onZoom}:{figure:ResearchFigure;onZoom:(src:string,caption:string)=>void}) {
  return <figure className="research-figure">
    <button className="figure-expand" onClick={()=>onZoom(figure.src,figure.caption)} aria-label={`${figure.caption} 크게 보기`}>
      <img src={figure.src} alt={figure.caption} loading="lazy"/>
      <span><Plus size={16}/> 크게 보기</span>
    </button>
    <figcaption>{figure.caption}</figcaption>
  </figure>;
}

function Subsection({section,onZoom,id,emphasis}:{emphasis?:TextEmphasis;id:string;section:ResearchSection;onZoom:(src:string,caption:string)=>void}) {
  return <section className="research-subsection" id={id}>
    <h4>{section.title}</h4>
    <div className="research-prose">{section.body.map((p,i)=><p key={i}><EmphasizedText text={p} emphasis={emphasis}/></p>)}</div>
    {section.diagram&&<ResearchDiagram kind={section.diagram}/>}
    {section.figures&&<div className={section.figureLayout==='pair'?'research-figure-pair':undefined}>{section.figures.map(figure=><Figure key={figure.src} figure={figure} onZoom={onZoom}/>)}</div>}
    {section.table&&<QuantitativeTable table={section.table}/>}
    {section.placeholder&&<aside className="research-placeholder"><span>삽입 예정</span><b>{section.placeholder.title}</b><p>{section.placeholder.description}</p></aside>}
  </section>;
}

export default function ProjectDetail({project,onClose,onZoom,hero,previous,next,onNavigate}:{previous?:Project;next?:Project;onNavigate:(project:Project)=>void;project:Project;onClose:()=>void;onZoom:(src:string,caption:string)=>void;hero?:ReactNode}) {
  const ref=useRef<HTMLDialogElement>(null);
  const [active,setActive]=useState('overview');
  const [tocOpen,setTocOpen]=useState(false);
  useEffect(()=>{
    const dialog=ref.current;
    dialog?.showModal();
    const prev=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return()=>{document.body.style.overflow=prev;};
  },[]);
  const method=project.sections?.filter(s=>s.group==='method')??[];
  const evaluation=project.sections?.filter(s=>s.group==='evaluation')??[];
  const contents=[
    {id:'overview',label:'연구 개요',level:0},
    {id:'contribution',label:'본인 기여',level:0},
    {id:'problem',label:'문제와 목표',level:0},
    {id:'method',label:'방법과 학습 과정',level:0},
    ...method.map(s=>({id:s.id,label:s.title,level:1})),
    {id:'evaluation',label:'실험과 해석',level:0},
    ...evaluation.map(s=>({id:s.id,label:s.title,level:1})),
    {id:'outcome',label:'결과물',level:0},
  ];
  useEffect(()=>{
    const dialog=ref.current;
    if(!dialog)return;
    const update=()=>{
      const headings=Array.from(dialog.querySelectorAll<HTMLElement>('[data-research-heading], .research-block, .research-subsection'));
      const top=dialog.getBoundingClientRect().top+(window.innerWidth<=820?132:101);
      let current='overview';
      for(const heading of headings){
        if(heading.getBoundingClientRect().top<=top)current=heading.id.replace(`detail-${project.id}-`,'');
      }
      setActive(current);
    };
    dialog.addEventListener('scroll',update,{passive:true});
    update();
    return()=>dialog.removeEventListener('scroll',update);
  },[project.id]);
  const jump=(id:string)=>{
    setTocOpen(false);
    requestAnimationFrame(()=>{
    const target=document.getElementById(`detail-${project.id}-${id}`);
    if(target&&ref.current){
      const dialog=ref.current;
      const top=dialog.scrollTop+target.getBoundingClientRect().top-dialog.getBoundingClientRect().top-(window.innerWidth<=820?116:85);
      dialog.scrollTo({top,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    }
    setActive(id);
    });
  };
  return <dialog ref={ref} className="detail-dialog research-detail" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}} aria-labelledby="detail-title">
    <div className="detail-top"><span>PROJECT {project.no} / {project.kind}</span>
      <div className="research-project-nav">
        <button disabled={!previous} onClick={()=>previous&&onNavigate(previous)} aria-label={previous?`이전 연구: ${previous.title}`:'이전 연구 없음'} title={previous?.title}><ArrowLeft size={17}/><span>이전 연구</span></button>
        <button disabled={!next} onClick={()=>next&&onNavigate(next)} aria-label={next?`다음 연구: ${next.title}`:'다음 연구 없음'} title={next?.title}><span>다음 연구</span><ArrowRight size={17}/></button>
        <button onClick={onClose} aria-label="프로젝트 상세 닫기"><X size={22}/></button>
      </div>
    </div>
    <div className="research-layout">
      <aside className="research-contents">
        <button className="research-contents-toggle" aria-expanded={tocOpen} aria-controls="research-contents-list" onClick={()=>setTocOpen(!tocOpen)}><List size={17}/><span>목차 · {contents.find(c=>c.id===active)?.label}</span><span>{tocOpen?'−':'+'}</span></button>
        <nav id="research-contents-list" className={`research-contents-list ${tocOpen?'is-open':''}`} aria-label="연구 제목 및 소제목 목차">
          <p>CONTENTS</p>
          {contents.map(item=><button key={item.id} className={`${item.level?'is-subsection':''} ${active===item.id?'is-current':''}`} aria-current={active===item.id?'location':undefined} onClick={()=>jump(item.id)}>{item.label}</button>)}
        </nav>
      </aside>
    <div className="detail-content">
      <div className="detail-meta">{project.org}<span>{project.period}</span></div>
      <div id={`detail-${project.id}-overview`} data-research-heading><h2 id="detail-title">{project.title}</h2></div>
      <p className="detail-english">{project.english}</p>
      <p className="detail-lead"><EmphasizedText text={project.summary??project.description} emphasis={project.emphasis}/></p>
      <div className="detail-tags">{project.stack.map(t=><span key={t}>{t}</span>)}</div>
      {project.links&&project.links.length>0&&<div className="research-links">{project.links.map(link=><a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={15}/></a>)}</div>}
      {hero&&<div className="research-hero">{hero}<p className="figure-caption">입력 이미지와 제안 방법의 실제 분할 결과를 비교할 수 있습니다.</p></div>}
      <section className="research-block" id={`detail-${project.id}-contribution`}>
        <header><span>01 / CONTRIBUTION</span><h3>본인 기여</h3></header>
        <p className="research-role">{project.role}</p>
        {project.contributions?.length?<ul className="research-contributions">{project.contributions.map(p=><li key={p}><EmphasizedText text={p} emphasis={project.emphasis}/></li>)}</ul>:null}
      </section>
      <section className="research-block" id={`detail-${project.id}-problem`}>
        <header><span>02 / CONTEXT</span><h3>문제와 목표</h3></header>
        <div className="research-prose"><p><EmphasizedText text={project.problem} emphasis={project.emphasis}/></p>{project.objective&&<p className="research-objective"><EmphasizedText text={project.objective} emphasis={project.emphasis}/></p>}</div>
      </section>
      <section className="research-block" id={`detail-${project.id}-method`}>
        <header><span>03 / METHOD</span><h3>방법과 학습 과정</h3></header>
        {method.length?method.map(section=><Subsection key={section.id} id={`detail-${project.id}-${section.id}`} section={section} emphasis={project.emphasis} onZoom={onZoom}/>):<ol className="research-contributions">{project.approach.map(p=><li key={p}><EmphasizedText text={p} emphasis={project.emphasis}/></li>)}</ol>}
      </section>
      <section className="research-block" id={`detail-${project.id}-evaluation`}>
        <header><span>04 / EVALUATION</span><h3>실험과 해석</h3></header>
        <div className="detail-results research-metrics"><div>{project.results.map(r=><article key={r.label}><strong>{r.value}</strong><b>{r.label}</b><p>{r.note}</p></article>)}</div></div>
        {evaluation.map(section=><Subsection key={section.id} id={`detail-${project.id}-${section.id}`} section={section} emphasis={project.emphasis} onZoom={onZoom}/>)}
        {!project.sections&&project.figures.map(figure=><Figure key={figure.src} figure={figure} onZoom={onZoom}/>)}
      </section>
      <section className="research-block research-outcome" id={`detail-${project.id}-outcome`}>
        <header><span>05 / OUTCOME</span><h3>결과물</h3></header>
        <p><EmphasizedText text={project.outcome??project.results.map(r=>`${r.label}: ${r.value}`).join(' · ')} emphasis={project.emphasis}/></p>
        {project.links&&project.links.length>0&&<div className="research-links">{project.links.map(link=><a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={15}/></a>)}</div>}
      </section>
      {project.sourceNote&&<p className="source-note">{project.sourceNote}</p>}
      <button className="detail-done" onClick={onClose}>프로젝트 목록으로 <ArrowRight size={16}/></button>
    </div>
    </div>
  </dialog>;
}
