import type {ReactNode} from 'react';

export type TextEmphasis = {strong?:string[];accent?:string[]};

// Editorially selected literal phrases keep the original copy and qualifications intact.
export default function EmphasizedText({text,emphasis}:{text:string;emphasis?:TextEmphasis}) {
  if(!emphasis)return text;
  const phrases=[
    ...(emphasis.accent??[]).map(text=>({text,accent:true})),
    ...(emphasis.strong??[]).map(text=>({text,accent:false})),
  ];
  const parts:ReactNode[]=[];
  let cursor=0;
  while(cursor<text.length){
    let match:{text:string;accent:boolean;at:number}|undefined;
    for(const phrase of phrases){
      if(!phrase.text)continue;
      const at=text.indexOf(phrase.text,cursor);
      if(at>=0&&(!match||at<match.at||(at===match.at&&phrase.text.length>match.text.length))){
        match={...phrase,at};
      }
    }
    if(!match){parts.push(text.slice(cursor));break;}
    if(match.at>cursor)parts.push(text.slice(cursor,match.at));
    parts.push(<strong key={match.at} className={match.accent?'text-emphasis is-accent':'text-emphasis'}>{match.text}</strong>);
    cursor=match.at+match.text.length;
  }
  return <>{parts}</>;
}
