const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const {chromium,webkit,devices}=require('playwright-core');
const filename=path.resolve(__dirname,'../index.html');
const updated=true;
const engine=process.argv[2]||'chromium';
const hash='a2114bb36375376dff4625729c8fa914cef9e593a8590e93a5b8fddbA398c057'.toLowerCase();
const fuzzyCases=[['擂饭','擂椒饭'],['南瓜燕麦奈','南瓜燕麦奶'],['土耳其烤肉羊','土耳其烤羊肉'],['勺西 烤羊','土耳其烤羊肉']];
(async()=>{
  const safari=engine==='webkit';
  const browser=await (safari?webkit:chromium).launch(safari?{headless:true}:{headless:true,executablePath:process.env.CHROMIUM_PATH});
  try{
    for(const javaScriptEnabled of [false,true]){
      const ctx=await browser.newContext({...devices[safari?'iPhone 13':'Pixel 7'],javaScriptEnabled,offline:true,reducedMotion:'reduce'});
      try{
        const page=await ctx.newPage(),errors=[],external=[];
        page.on('pageerror',e=>errors.push(String(e)));
        page.on('request',r=>{if(/^https?:/i.test(r.url()))external.push(r.url())});
        await page.goto(pathToFileURL(filename).href);
        const root=page.locator(javaScriptEnabled?'#root main.ys':'#static-menu');
        await root.waitFor();
        if(javaScriptEnabled) await page.locator('#static-menu').waitFor({state:'detached'});
        const cards=root.locator('.ys-card');
        assert.equal(await cards.count(),64);
        const avatar=root.locator('img[alt="作者头像"]');
        assert.equal(await avatar.count(),updated?1:0);
        if(updated){
          const src=await avatar.getAttribute('src');
          assert.match(src,/^data:image\/jpeg;base64,/);
          assert.equal(createHash('sha256').update(Buffer.from(src.split(',')[1],'base64')).digest('hex'),hash);
          await avatar.evaluate(img=>img.decode());
          assert.ok(await avatar.evaluate(img=>img.naturalWidth>0));
          await avatar.isVisible().then(assert.ok);
        }
        const widths=await page.locator('html').evaluate(e=>[e.scrollWidth,e.clientWidth]);
        assert.equal(widths[0],widths[1]);
        if(javaScriptEnabled){
          const q=page.getByRole('searchbox',{name:'搜索菜名或口味'});
          const title=cards.locator('h3');
          const results=[];
          for(const [input,want] of fuzzyCases){
            await q.fill(input);
            if(updated) assert.equal(await title.first().textContent(),want);
            else if(input!=='勺西 烤羊') assert.equal(await cards.count(),0);
            else assert.equal(await title.first().textContent(),want);
            results.push(input+' → '+(await title.first().count()?await title.first().textContent():'无结果'));
          }
          await q.fill('南瓜燕麦奶');
          assert.equal(await title.first().textContent(),'南瓜燕麦奶');
          if(updated){
            await q.fill('南瓜燕麦奈');
            await page.getByRole('combobox',{name:'用餐地点'}).selectOption('勺西');
            assert.equal(await cards.count(),0);
            await page.getByRole('combobox',{name:'用餐地点'}).selectOption('老光华楼');
            assert.equal(await title.first().textContent(),'南瓜燕麦奶');
            await page.getByRole('button',{name:'黑榜 · 1–2 星'}).click();
            assert.equal(await cards.count(),0);
            await page.getByRole('button',{name:'清空筛选'}).click();
            await q.fill('甜甜圈火箭发动机');
            assert.equal(await cards.count(),0);
            await page.getByRole('button',{name:'清空筛选'}).click();
            assert.equal(await cards.count(),64);
            if(process.env.CAPTURE_AVATAR==='1'&&!safari){
              await page.evaluate(()=>window.scrollTo(0,0));
              await page.screenshot({path:path.join(__dirname,'../.build/author-mobile-review.png'),scale:'css'});
            }
          }
          console.log(engine+' JS on: '+results.join('；')+'；精确全名命中；作者头像='+Number(updated)+(updated?'；地点、星级过滤和无关词检查通过。':'。'));
        }else{
          await page.getByRole('link',{name:/黑榜/}).click();
          assert.match(page.url(),/#read-black$/);
          console.log(engine+' JS off: 64 cards; 作者头像='+Number(updated)+'; anchor works; '+widths[1]+'px.');
        }
        assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
      }finally{await ctx.close()}
    }
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
