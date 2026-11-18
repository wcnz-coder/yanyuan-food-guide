const fs = require('node:fs/promises');
const path = require('node:path');
const {build} = require('esbuild');
const root=path.resolve(__dirname,'..');
(async()=>{
  const src=await fs.readFile(path.join(root,'src','yanyuan.canvas.tsx'),'utf8');
  const skin=await fs.readFile(path.join(root,'src','paper-theme.css'),'utf8');
  const notes=(await fs.readFile(path.join(root,'assets','yanyuan-notes.woff2'))).toString('base64');
  const reading=(await fs.readFile(path.join(root,'assets','yanyuan-reading.woff2'))).toString('base64');
  const license=async name=>(await fs.readFile(path.join(root,'assets',name),'utf8')).replace(/[ \t]+$/gm,'').replace(/-->/g,'--&gt;');
  const notesLicense=await license('OFL-YanyuanNotes.txt');
  const readingLicense=await license('OFL-YanyuanReading.txt');
  const face=(name,encoded)=>'@font-face{font-family:"'+name+'";src:url(data:font/woff2;base64,'+encoded+') format("woff2");font-style:normal;font-weight:400;font-display:swap}';
  const typeStyle=face('Yanyuan Notes',notes)+'\n'+face('Yanyuan Reading',reading);
  const avatar=src.includes('__YANYUAN_AUTHOR_AVATAR__')?'data:image/jpeg;base64,'+(await fs.readFile(path.join(root,'assets','author-avatar.jpg'))).toString('base64'):'';
  const result=await build({
    absWorkingDir:root, stdin:{contents:"import React from 'react';import {createRoot} from 'react-dom/client';import App from './src/yanyuan.canvas.tsx';createRoot(document.querySelector('#root')).render(React.createElement(App));",resolveDir:root,loader:'jsx'},
    bundle:true, minify:true, write:false, jsx:'automatic',legalComments:'inline',target:'es2020',
    define:{'process.env.NODE_ENV':'"production"'},
    plugins:[{name:'standalone',setup(b){
      b.onLoad({filter:/yanyuan\.canvas\.tsx$/},()=>({contents:src
        .replace('__YANYUAN_AUTHOR_AVATAR__',avatar)
        .replace('"--hero-size":"24px"','"--hero-size":"clamp(49px, 7.5vw, 106px)"')
        .replace('"--section-size":"23px"','"--section-size":"clamp(25px, 3.4vw, 38px)"')
        .replace('"--feature-size":"19px"','"--feature-size":"clamp(19px, 2.65vw, 30px)"')
        .replace('"--card-size":"19px"','"--card-size":"22px"'),loader:'tsx'}));
      b.onResolve({filter:/^cursor\/canvas$/},()=>({path:'canvas',namespace:'standalone'}));
      b.onLoad({filter:/.*/,namespace:'standalone'},()=>({resolveDir:root,loader:'js',contents:`
        import {useEffect,useState} from 'react';
        export {useMemo,useState} from 'react';
        const t={bg:{editor:'#fbf7e9',elevated:'#fffdf7'},text:{primary:'#292734',secondary:'#5b5360',onAccent:'#fff9ef'},stroke:{primary:'#ded1ba'},fill:{secondary:'#f5ebd8'},accent:{primary:'#963e32',control:'#963e32'}};
        export const useHostTheme=()=>t;
        export function useCanvasState(key,fallback){const [value,setValue]=useState(()=>{try{const x=JSON.parse(localStorage.getItem(key));return Array.isArray(x)?x.filter(n=>Number.isSafeInteger(n)&&n>=0):fallback}catch{return fallback}});useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}},[key,value]);return [value,setValue]}
      `}));
    }}]
  });
  const js=result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script');
  const html='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>燕园美食红黑榜｜燕园饭点编辑部</title><!-- Yanyuan Notes: subset of Xiaolai.\n'+notesLicense+'\nYanyuan Reading: subset of LXGW WenKai Lite.\n'+readingLicense+'\n--><style>html,body,#root{margin:0;min-height:100%;background:#fbf7e9}html{scroll-behavior:smooth} @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}\n'+typeStyle+'\n'+skin+'</style></head><body><div id="root"></div><noscript>请启用 JavaScript 查看交互榜单。</noscript><script>'+js+'</script></body></html>';
  const out=path.join(root,'.build','interactive.html');
  await fs.mkdir(path.dirname(out),{recursive:true});
  await fs.writeFile(out,html,'utf8');
  console.log(out,Buffer.byteLength(html,'utf8'));
})().catch(e=>{console.error(e);process.exitCode=1});
