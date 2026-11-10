const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright-core');
const root = path.resolve(__dirname, '..');
const original = path.join(root,'.build','interactive.html');
const modified = path.join(root,'index.html');
const chrome = process.env.CHROMIUM_PATH;

(async () => {
  const html = await fs.readFile(original,'utf8');
  const browser = await chromium.launch({executablePath:chrome,headless:true});
  let snapshot;
  try {
    const page = await browser.newPage({offline:true});
    await page.goto(pathToFileURL(original).href);
    await page.locator('.ys-card').first().waitFor();
    snapshot = await page.evaluate(() => {
      const clone = document.querySelector('#root > main').cloneNode(true);
      clone.id = 'static-menu';
      const shell = clone.querySelector('.ys-shell');
      const list = shell.querySelector('.ys-list');
      const collection = [...list.querySelectorAll('.ys-card')];
      const tiers = [['red','红榜 · 四到五星'], ['mid','中间档 · 三星'], ['black','黑榜 · 一到二星']];
      const menu = shell.querySelector('.ys-strip');
      const makeLink = (to, label) => {
        const el = document.createElement('a'); el.href = '#'+to; el.textContent = label; return el;
      };
      for (const [i, el] of [...menu.children].entries()) {
        const link = makeLink(i ? 'read-'+tiers[i-1][0] : list.id,'');
        link.replaceChildren(...el.childNodes);
        el.replaceWith(link);
      }
      for (const [i, button] of [...shell.querySelectorAll('.ys-special')].entries()) {
        const link = makeLink('read-dish-'+(i+1),'');
        link.className = button.className;
        link.replaceChildren(...button.childNodes);
        button.replaceWith(link);
        collection[i].id = 'read-dish-'+(i+1);
      }
      list.querySelector('h2').textContent = '试吃全榜';
      const note = document.createElement('p');
      note.className = 'ys-reading-note';
      note.textContent = '阅读版 · '+collection.length+' 条试吃记录 · 无需联网或运行脚本';
      list.replaceChildren(list.querySelector('header'),note);
      for (const [id,title] of tiers) {
        const section = document.createElement('section');
        section.className = 'ys-reading-tier';
        section.id = 'read-'+id;
        const heading = document.createElement('h3');
        heading.textContent = title;
        section.append(heading);
        const grid = document.createElement('div');
        grid.className = 'ys-grid';
        for (const card of collection.filter(c=>c.dataset.tier === id)) {
          card.querySelector('.ys-book').remove();
          grid.append(card);
        }
        section.append(grid);list.append(section);
      }
      const supplemental = document.createElement('style');
      supplemental.textContent = '.ys-strip a{min-width:0;padding:11px 14px;display:flex;align-items:center;gap:10px;border-right:1px solid var(--line)}.ys-strip a:first-child{padding-left:0}.ys-strip a:last-child{border-right:0}.ys-strip a:hover{color:var(--hot)}.ys-reading-note{color:var(--muted);padding:12px 0;font-size:12px}.ys-reading-tier{margin-bottom:22px}.ys-reading-tier>h3{font-weight:800;margin:8px 0}.ys-reading-tier[id=read-red]>h3{color:var(--hot)}@media(max-width:580px){.ys-strip a{padding:9px 5px;gap:4px;flex-wrap:wrap}}';
      clone.append(supplemental);
      return clone.outerHTML;
    });
  } finally { await browser.close(); }
  const count=(snapshot.match(/class="ys-card"/g)||[]).length;
  assert.ok(count>0);
  if(process.argv[4]) assert.equal(count,Number(process.argv[4]));
  assert.equal((snapshot.match(/<button\b/g)||[]).length,0);
  const marker = '<div id="root"></div><noscript>请启用 JavaScript 查看交互榜单。</noscript>';
  assert.equal(html.split(marker).length,2);
  const bootstrap = '<script>(function(){var root=document.getElementById("root"),reading=document.getElementById("static-menu");function removeReadingIfReady(){if(root.querySelector("main.ys")&&reading.parentNode){reading.parentNode.removeChild(reading);return true}return false}if(!removeReadingIfReady()&&window.MutationObserver){var watcher=new MutationObserver(function(){if(removeReadingIfReady())watcher.disconnect()});watcher.observe(root,{childList:true,subtree:true})}}());</script>';
  const next = html.replace(marker, '\n'+snapshot+'\n<div id="root"></div>\n')
                   .replace('</body></html>','\n'+bootstrap+'\n</body></html>');
  assert.ok(next.includes(html.slice(html.indexOf('<script>'),html.lastIndexOf('</script>')+9)));
  await fs.writeFile(modified,next,'utf8');
  console.log(modified + ' | ' + Buffer.byteLength(next) + ' bytes; original interactive JS preserved byte-for-byte');
})().catch(error=>{console.error(error);process.exitCode=1});
