/// <reference types="vite/client" />
export type ResearchFigure = {src:string;caption:string};
export type ResearchTable = {
 title:string;columns:string[];rows:{cells:string[];highlight?:boolean}[];note:string;
};
export type ResearchSection = {
 id:string;title:string;group:'method'|'evaluation';body:string[];
 figures?:ResearchFigure[];figureLayout?:'pair';table?:ResearchTable;
 diagram?:'dvqa-training'|'retrieval-training'|'dvqa-inference'|'data-validation'|'data-inference';
 placeholder?:{title:string;description:string};
};
export type Project = {
 emphasis?:{strong?:string[];accent?:string[]};
 id:string;no:string;title:string;english:string;org:string;period:string;description:string;tags:string[];metric:string;metricLabel:string;kind:string;image:string;caption:string;
 role:string;problem:string;approach:string[];results:{value:string;label:string;note:string}[];figures:{src:string;caption:string}[];stack:string[];
 summary?:string;contributions?:string[];objective?:string;sections?:ResearchSection[];
 links?:{label:string;url:string}[];outcome?:string;sourceNote?:string;
 thumbnail?:ResearchFigure;
};

// 화면 문구와 프로젝트 내용은 content 폴더에서 수정합니다.
import project0 from '../content/projects/aesthetic-captioning.json';
import project1 from '../content/projects/data-pipeline.json';
import project2 from '../content/projects/document-vqa.json';
import project3 from '../content/projects/efficient-enhancement.json';
import project4 from '../content/projects/guided-super-resolution.json';
import project5 from '../content/projects/open-vocabulary.json';
const projectFiles = {project0, project1, project2, project3, project4, project5} as unknown as Record<string, Project>;
import publicationContent from '../content/publications.json';
import profileContent from '../content/profile.json';
import awardContent from '../content/awards.json';

export const projects: Project[] = Object.values(projectFiles).sort((a, b) => a.no.localeCompare(b.no));
export const publications = publicationContent;
export const profile = profileContent;
export const awards = awardContent;
export const filters = ['전체', 'MLLM', 'Computer Vision', ...new Set(projects.flatMap(project => project.tags).filter(tag => !['MLLM', 'Computer Vision'].includes(tag)))];
