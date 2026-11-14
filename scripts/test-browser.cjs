const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const {readFileSync}=require('node:fs');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const {chromium,webkit,devices}=require('playwright-core');
const filename=path.resolve(process.env.GUIDE_HTML || path.join(__dirname,'../index.html'));
const updated=true;
const engine=process.argv[2]||'chromium';
const baseline=process.env.GUIDE_BASELINE==='1';
const total=baseline?64:79;
const counts=baseline?[20,28,16]:[27,35,17];
const hash=baseline?'a2114bb36375376dff4625729c8fa914cef9e593a8590e93a5b8fddba398c057':createHash('sha256').update(readFileSync(path.join(__dirname,'../assets/author-avatar.jpg'))).digest('hex');
const newItems=[
  ['农园 · 三楼','烧椒肥牛',4],['农园 · 三楼','鸭血粉丝',3],['家园 · 三楼','麻辣烫',3],
  ['3W','照烧鸡排饭',3],['全家','照烧脆骨丸',4],['全家','韩式甜辣年糕串',3],
  ['29地下甜工社','红油青柠千层',3],['小北奶站','草莓牛奶',4],['教师之家','炙烤熔岩酸奶芝士蛋糕',5],
  ['教师之家 · 台湾美食节','宝岛盐酥鸡',4],['教师之家','小卤肉河粉',3],['教师之家','大肠包小肠',2],
  ['教师之家','台式卤肉饭',4],['教师之家','抹茶栗子蒙布朗',4],['教师之家','士林炸鸡排',3],
];
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
        assert.equal(await cards.count(),total);
        assert.deepEqual(await Promise.all(['red','mid','black'].map(t=>root.locator('.ys-card[data-tier="'+t+'"]').count())),counts);
        const rows=await cards.evaluateAll(els=>els.map(el=>[el.querySelector('.ys-local').textContent,el.querySelector('h3').textContent,Number(el.querySelector('.ys-score').getAttribute('aria-label').split(' ')[0])]));
        for(const [place,name,rating] of newItems) assert.equal(rows.filter(r=>r[0]===place&&r[1]===name&&r[2]===rating).length,baseline?0:1,name);
        assert.equal(await root.locator('.ys-byline strong').textContent(),'灰皂沫.🛁');
        assert.equal(await root.locator('.ys-special').filter({hasText:'炙烤熔岩酸奶芝士蛋糕'}).count(),baseline?0:1);
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
            assert.equal(await cards.count(),total);
            if(!baseline){
              await page.getByRole('button',{name:'教师之家专场',exact:true}).click();
              assert.equal(await cards.count(),7);
              await q.fill('炙烤熔岩酸奶芝士蛋羔');
              assert.equal(await cards.first().locator('h3').textContent(),'炙烤熔岩酸奶芝士蛋糕');
              await page.getByRole('button',{name:'清空筛选'}).click();
            }
            if(process.env.CAPTURE_AVATAR==='1'&&!safari){
              await page.evaluate(()=>window.scrollTo(0,0));
              await page.screenshot({path:path.join(__dirname,'../.build/author-mobile-review.png'),scale:'css'});
            }
          }
          console.log(engine+' JS on: '+results.join('；')+'；精确全名命中；作者头像='+Number(updated)+(updated?'；地点、星级过滤和无关词检查通过。':'。'));
        }else{
          await page.getByRole('link',{name:/黑榜/}).click();
          assert.match(page.url(),/#read-black$/);
          console.log(engine+' JS off: '+total+' cards; 作者头像='+Number(updated)+'; anchor works; '+widths[1]+'px.');
        }
        assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
        console.log('Checked '+total+' cards ('+counts.join('/')+'), '+(baseline?0:15)+' new entries, and avatar SHA256 '+hash);
      }finally{await ctx.close()}
    }
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
