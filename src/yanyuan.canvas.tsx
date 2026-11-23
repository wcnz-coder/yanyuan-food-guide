import { useHostTheme, useState, useMemo, useCanvasState, type CSSProperties } from "cursor/canvas";

type Dish = readonly [place: string, window: string, name: string, score: number, quote: string, detail: string, tags: readonly string[]];
const menu: readonly Dish[] = [
  ["燕南","", "擂椒饭",5,"豆角和卤肉双拼，擂椒多一点。","目前最爱。擂椒单放，怕辣可以请阿姨少放。掌中宝好吃但更辣；肥牛和小炒肉的配菜不太合胃口。",["可调辣","饭"]],
  ["燕南","", "干烧肉",1,"很火，但对我来说有点咸。","无功无过，不会再点。叠甲：可能是我的口味问题。",["偏咸","菜"]],
  ["燕南","", "芋泥饮品",3,"不太甜，喝起来温暖又厚实。","白色的，猜测没加紫薯。刚入口有点像香飘飘芋泥奶茶的香精味，多喝几口就还好。",["不太甜","饮品"]],
  ["燕南","", "迷迭香烤鸡腿",2,"皮太咸，肉又没什么味道。","卖相诱人，迷迭香味足，个头大、口感也不错。皮和肉一起吃也许能中和，但大概不会回购。",["偏咸","菜"]],
  ["农园","二楼", "小炒肉木桶饭",3,"扣两星，都扣在辣椒上。","辣椒多、厚、还很辣，既不好挑出来，也不好直接拌饭吃。更能吃辣的人可能反而喜欢。",["偏辣","饭"]],
  ["农园","一楼", "剁椒鱼头",1,"本剁椒鱼头爱好者：拉完了。","辣味基本没有，鱼肉没什么味道，还有一点腥。",["不太辣","菜"]],
  ["农园","一楼", "麻辣烫",3,"居然没汤，但冬天吃很温暖。","点的麻辣口，辣味不淡，发挥正常；肉的种类有点少。",["有辣味","菜"]],
  ["农园","二楼 · 木桶饭旁", "牛肉拌粉 / 牛肉粉",3,"二选一的话，我选牛肉拌粉。","拌粉的辣味更足，牛肉粉无功无过。别的口味还没吃过。",["有辣味","面粉"]],
  ["农园","", "轻食",3,"水煮加酱，寡淡得很合理。","本来也不是冲着重口味去吃轻食的，算是符合预期。",["清淡","菜"]],
  ["农园","", "东南亚风味芒果炒鸡",3,"芒果酸酸的，鸡甜甜的。","纯为了尝鲜，组合很神奇，味道无功无过。",["酸甜","菜"]],
  ["畅春园","", "土豆泥辣子鸡拌面",5,"吃到最后有点咸，但是我溺爱。","土豆泥很足，辣子鸡很香。第一次吃很辣，后来几次还好，辣度可能看当天的手。",["辣度浮动","偏咸","面粉"]],
  ["学一","", "襄阳牛肉面",4,"像老夫老妻稳稳过日子的安心感。","少一星是因为没什么辣味；隔壁涮羊肉的辣油很香，想吃辣可以加一点。",["可调辣","面粉"]],
  ["学一","牛肉面隔壁", "鸡杂面",4,"预制很正常，但是不要让我感受到啊。","就在襄阳牛肉面旁边。整体很好吃，扣一星是因为鸡杂略有预制感。",["面粉"]],
  ["学一","", "热干面",1,"吃到最后，只有麻酱味。","知道热干面本来就有麻酱，也可能只是我不爱这道菜；反正不会再点。",["麻酱","面粉"]],
  ["学五","", "滑蛋饭（鸡肉款）",3,"现做，挺香；但也没到满星。","具体菜名忘了。挺火的一款，卖相一般；别的口味还没试。",["饭"]],
  ["学五","面对门最右侧面食窗口", "木桶牛肉拌面",2,"太咸，还有股预制牛柳味。","木桶装，准确菜名记不清。牛肉的味道不喜欢。",["偏咸","面粉"]],
  ["学五","", "重庆小面",3,"不是惊艳款，但晚上九点多吃很香。","不太辣，味道挺好，是平时过日子会吃的那种面。",["不太辣","面粉"]],
  ["学五","", "紫薯山药饮",2,"长得像巫婆汤，甜到人都变糖了。","主要是紫薯味，山药重在参与。喜欢很甜的人可能会喜欢：美国甜度。",["很甜","饮品"]],
  ["家园","一楼 · 早餐", "五元红汤肉末面",1,"五块钱我就原谅了，但不回购。","红汤、有肉末，面本身没什么味道。",["清淡","面粉"]],
  ["家园","二楼", "重庆小面",3,"挺香，也不是很辣。","味道不错。没有给满星，因为我也不知道特别好吃的重庆小面是什么样。",["不太辣","面粉"]],
  ["家园","二楼 · 日韩窗口", "烤五花肉拌饭",3,"三星里明确会回购的一碗。","五花肉香，配泡菜和腌萝卜不腻，也管饱。扣分主要是我不太爱这两样小菜。",["会回购","饭"]],
  ["家园","二楼 · 日韩窗口", "土豆泥肉末拌饭",3,"还是喜欢土豆泥原本的味道。","土豆泥是橙色的，有韩式甜辣味。能吃，但会犹豫要不要再吃一次。",["甜辣","饭"]],
  ["家园","三楼", "香辣鸡腿饭",3,"巨大的手枪腿，皮脆、肉嫩、带蒜香。","便宜量大。扣分的是饭上甜甜的番茄味酱，不是鸡腿。",["性价比","饭"]],
  ["家园","三楼", "小炒肉饭",4,"香香，我爱。瑕不掩瑜。","有芹菜、略油，辣椒单吃也厚辣，但没农园木桶饭里那么抢戏。",["有芹菜","有辣味","饭"]],
  ["家园","三楼", "酸辣排骨面",3,"闻起来很酸，吃起来倒没那么酸。","肉很多，还有笋。挺好吃，但家园喜欢的太多，下次点不点得看心情。",["有笋","面粉"]],
  ["家园","三楼", "碗杂面",4,"好吃，还有点麻酱味。","没到建湖那家重庆小面店的碗杂面那么好吃，不过已经很可以了。",["麻酱","面粉"]],
  ["家园","四楼", "百香果鸡",4,"百香果味很足，配菜也好吃。","香，是喜欢的酸口。试吃时不用校园卡，外校朋友也能吃。",["酸香","菜"]],
  ["家园","四楼", "德式酸菜（名称待确认）",3,"酸酸的，还有腊肉培根味。","白菜吃起来有点生生的，但我喜欢这个味道；菜名记得不太确定。",["酸香","菜"]],
  ["小北奶站","", "二八酱奶茶",4,"伯牙绝弦加上芝麻糊的味道。","喜欢这一口芝麻香。",["芝麻香","饮品"]],
  ["学校咖啡厅","", "提拉米苏",1,"我最爱提拉米苏，但这块真的太甜了！","底子完全尝不出浸过酒的感觉。不回购，避雷。",["很甜","甜点"]],
  ["燕南咖啡厅","", "黑巧酸奶碗",4,"叫黑巧，吃起来却像牛奶巧克力。","虽然不是期待的黑巧味，但挺好吃，还有黄桃。酸奶碗系列已下架。",["已下架","甜点"]],
  ["燕南咖啡厅","", "抹茶酸奶碗",3,"抹茶酱很好吃！但我不爱它配芝麻酱。","两种酱搭在一起，吃到最后有点吃不下；也可能是个人口味问题。酸奶碗系列已下架。",["已下架","麻酱","甜点"]],
  ["艺园","", "烤鱼豆腐",4,"好吃，很嫩。","鱼豆腐的嫩是这串最讨喜的地方。",["烧烤","菜"]],
  ["艺园","", "金针菇粉丝",2,"还行，但金针菇没什么味。","整体没什么记忆点。",["清淡","菜"]],
  ["艺园","", "烤豆腐",3,"爱吃豆腐的人觉得好吃，我也觉得好吃。","我尝着没什么豆腐味，这倒正合我口味。",["烧烤","菜"]],
  ["艺园","", "烤五花肉",4,"我永远拥护五花肉。","师傅发挥有点不稳定，有时候会烤得很好吃。",["烧烤","菜"]],
  ["艺园","", "烤鸡翅",3,"正常的好吃，没什么特别的。","就是一串让人满意的烤鸡翅。",["烧烤","菜"]],
  ["艺园","", "烤肥肠",3,"有点膻味，但我爱吃肥肠。","对我来说这点膻味还能接受。",["烧烤","菜"]],
  ["艺园","", "烤鱼",3,"不是我熟悉的江苏那种烤鱼。","跟想象中不太一样，但挺好吃。",["菜"]],
  ["艺园","", "烤梅花肉",2,"无他，我只是不爱吃纯瘦肉的烧烤。","单品本身应该还可以，扣分是个人偏好。",["烧烤","菜"]],
  ["艺园","", "沙茶牛肉面",3,"有沙茶味，但不多。","不算惊艳。有权威人士也表示：这个沙茶面一般。",["面粉"]],
  ["艺园","", "山楂糖葫芦",2,"没裹糯米纸，糖有点黏，也难咬。","吃着不太新鲜，味道倒还好，可以解馋。",["甜点"]],
  ["小咖","", "中式卤肉帕尼尼",4,"我的早餐单品：汁水足，肉多，我超爱！","想吃咸口早餐时，会想到这份卤肉帕尼尼。",["早餐","面包"]],
  ["小咖","", "咸法酪抹茶",4,"我爱奶盖，我爱抹茶，所以溺爱。","抹茶和奶盖，两个加分项都占了。",["抹茶","饮品"]],
  ["餐车","", "东安仔鸡",3,"辣味足，肉也多，挺好吃。","听说家园三楼的更好吃，先扣两颗星留点空间。",["有辣味","菜"]],
  ["餐车","", "卤肉饭",3,"好吃，但辣味少了点。","我还是更喜欢燕南擂椒饭里的卤肉。",["饭"]],
  ["餐车","", "奥尔良汉堡",3,"我对奥尔良无感，倒喜欢这面包皮。","胜在快捷。面包皮是那种干巴巴、香香的感觉。",["快捷","面包"]],
  ["府园","", "酸菜肥肠面",4,"酸菜味很足，肥肠也很香。","好吃，我爱。",["酸香","面粉"]],
  ["府园","", "排骨米线",2,"没吃过，这两星只打给卖相。","看对面的人点了，细粉像龙须面，汤看着寡淡；对方也没有特别夸。没有尝过，不评价实际味道。",["仅观感","面粉"]],
  ["勺西","", "土耳其烤羊肉",5,"皮脆脆的，肉嫩嫩的，摆盘也像艺术品。","又香又好吃。唯一缺点是贵：三位数，不太适合一个人点。",["适合分食","偏贵","菜"]],
  ["勺西","", "炸土豆",4,"很脆，像狼牙土豆 Max 版。","个位数的快乐，我爱土豆。",["性价比","菜"]],
  ["勺西","", "炸猪排",4,"平时不太爱猪排，但这块没有预制味。","有猪肉本身的香味，外皮脆，里面瘦而不柴。",["菜"]],
  ["勺西","", "徐福烩饭",2,"暗红色，红枣和各种豆子的组合我不太爱。","红枣是那种银耳汤里的感觉；也可能做得很还原，只是我没吃惯。菜名记得不太确定。",["菜名待确认","饭"]],
  ["勺西","", "黑松露蟹肉饭",4,"米饭湿润、很香，价格也还好。","四星稍高，三星又稍低，先记四星。菜名大概是这个。",["菜名待确认","饭"]],
  ["勺西","", "手抓羊肉饭",3,"看着很威武，味道也不错。","但没有惊艳到这个价位，应该不会再点。",["偏贵","饭"]],
  ["佟园","", "辣皮子",2,"洋葱味让我想起初中食堂。","肉不多，还有股牛柳味；主要是洋葱扣的分。",["有洋葱","菜"]],
  ["佟园","", "湘味牛肉饭",4,"辣辣的，好吃，就是香草放得像配菜。","记不清是香菜还是芹菜，印象里更像香菜。菜名也记得不太确定。",["有辣味","菜名待确认","饭"]],
  ["老光华楼","Cotti Coffee", "南瓜燕麦奶",5,"像烤红薯和烤栗子混在一起，还有南瓜香。","很适合冬天，香香的、很温暖，点热的更好喝。",["热饮","饮品"]],
  ["29地下甜工社","", "开心果碱水面包",2,"碱水和开心果我都爱，但这个又干又没什么开心果味。","买的时候已经比较晚，不确定是不是新鲜度影响了口感。",["面包"]],
  ["29地下甜工社","", "芋泥可颂塔",3,"芋泥很厚，不太甜，好评。","",["不太甜","甜点"]],
  ["29地下甜工社","收银台旁小款", "榴莲千层",2,"有点酸，榴莲不多，奶油也不够香。","不确定是不是这次买的有问题。还是更喜欢建湖那款，下次想尝尝大的。",["甜点"]],
  ["29地下甜工社","", "肉肠法棍",3,"肠很多汁，挺好吃，是家里的味道。","",["面包"]],
  ["29地下甜工社","", "丹麦脏脏包",3,"正常的脏脏包味道，就是有点干巴。","中间加一点奶油夹心也许会更好。菜名记得不太确定。",["菜名待确认","面包"]],
  ["29地下甜工社","", "泡芙",3,"皮不太软，奶油有点甜，酥皮一直往身上掉。","尝起来不太像纯动物奶油；除此之外还挺好吃。",["甜点"]],
  ["农园","三楼","烧椒肥牛",4,"超好吃，我爱烧椒！辣辣的，有点藤椒味但不麻。","肥牛量还行。扣一星是因为要 70 元，不适合日常吃，而且里面有我不爱吃的豆腐。",["有辣味","偏贵","菜"]],
  ["农园","三楼","鸭血粉丝",3,"比农一贵五块，何意味？","味道还可以。粉丝比平常的粗，横截面还是方的，很神秘；鸭肝倒做得蛮好吃，一点不苦。",["面粉"]],
  ["家园","三楼","麻辣烫",3,"长得很辣，吃起来基本没辣味。","点的麻辣口，汤有点过鲜，整体还是好吃，品类也比农一丰富。味道更偏爱农一，也可能是雨夜给那碗加了分。",["不太辣","菜"]],
  ["3W","","照烧鸡排饭",3,"一个饭怎么敢卖我六十块的，太猖狂了。","吃着就是好吃的味道，没有特别惊艳；但挺适合拍照。",["偏贵","饭"]],
  ["全家","","照烧脆骨丸",4,"照烧酱很好吃，冬夜吃多加一星。","本来想打三星。我个人更喜欢有嚼劲的，这款太嫩、太好咬开了，但瑕不掩瑜。",["甜咸","小吃"]],
  ["全家","","韩式甜辣年糕串",3,"挺好吃，辣味不多也不影响。","外皮有点囊了，里面的年糕又不够韧，主要扣在口感。",["不太辣","小吃"]],
  ["29地下甜工社","","红油青柠千层",3,"单吃青柠冻和红柚冻，两层都很美味。","千层皮不够韧，所有层一起吃有点小时候植物奶油蛋糕的味道，吃到后面就还好；柚子味略淡。",["甜点"]],
  ["小北奶站","","草莓牛奶",4,"就是草莓加牛奶，很淳朴的一位。","我爱草莓，和纯牛奶放一起又不会很甜，印象分拉满，溺爱。",["不太甜","饮品"]],
  ["教师之家","","炙烤熔岩酸奶芝士蛋糕",5,"蚝豉啊……脆脆的焦糖壳不太甜，炙烤味却很足。","下面是酸奶味的酱，芝士主体口感也好；底部像木糠杯加豆乳蛋糕，还有一点苦苦的咖啡液。要 60 元，但这个味道让我能忽略价格。",["教师之家专场","不太甜","甜点"]],
  ["教师之家","台湾美食节","宝岛盐酥鸡",4,"脆脆的又不油，调味没盖住鸡肉本身的味道。","二十几元，在一众高价里算亲民。",["教师之家专场","小吃"]],
  ["教师之家","","小卤肉河粉",3,"河粉比较普通，但卤肉嫩，和别处不一样。","主要是瘦肉，总归还是好吃的。",["教师之家专场","面粉"]],
  ["教师之家","","大肠包小肠",2,"我还以为是肥肠，结果是糯米肠包香肠。","香肠像台式一口肠，也要二十几元。",["教师之家专场","小吃"]],
  ["教师之家","","台式卤肉饭",4,"比燕南的肥肉更多、更糯，整碗饭黏糊糊的，很温暖。","好吃，三十元左右，价格也还好。",["教师之家专场","饭"]],
  ["教师之家","","抹茶栗子蒙布朗",4,"抹茶的甜和苦刚刚好，配树莓酱尤其妙。","上面还有一点红豆。外层抹茶口感厚重，树莓酱轻盈，酸甜正好接住抹茶的苦。",["教师之家专场","抹茶","甜点"]],
  ["教师之家","","士林炸鸡排",3,"脆脆的，有一点像梅子的甜味。","好吃，但别的具体味道有点忘了，嘻嘻抱一丝。",["教师之家专场","小吃"]],
];
const dishes = menu.map(([place, window, name, score, quote, detail, tags], id) => ({ id, place, window, name, score, quote, detail, tags, unavailable:tags.includes("已下架") }));
const places = [...new Set(dishes.map(d => d.place))];
const tiers = [
  { id: "all", name: "全部", title: "完整榜单", desc: "按星级从高到低，保留每一条试吃记录", test: (_:number) => true },
  { id: "red", name: "红榜", title: "红榜 · 会惦记", desc: "四到五星", test: (s:number) => s >= 4 },
  { id: "mid", name: "中间档", title: "中间档 · 看口味", desc: "三星不是差评，有的还会回购", test: (s:number) => s === 3 },
  { id: "black", name: "黑榜", title: "黑榜 · 下次换一家", desc: "一到二星，按我的口味避雷", test: (s:number) => s <= 2 },
];
const quick = ["可调辣","不太辣","偏咸","很甜","面粉","饮品","烧烤","甜点","教师之家专场","已下架","仅观感"];
const pad = (n:number) => String(n).padStart(2,"0");
const locationOf = (d:typeof dishes[number]) => d.window ? d.place + " · " + d.window : d.place;
const kindOf = (tags:readonly string[]) =>
  tags.includes("饮品") ? "drink" :
  tags.includes("甜点") ? "dessert" :
  tags.includes("烧烤") ? "bbq" :
  tags.includes("面粉") ? "noodle" :
  tags.includes("面包") ? "bread" :
  tags.includes("小吃") ? "snack" :
  tags.includes("饭") ? "rice" : "dish";
const authorAvatar = "__YANYUAN_AUTHOR_AVATAR__";
const normalizeSearch = (value:string) => value.normalize("NFKC").toLowerCase();
const compactSearch = (value:string) => normalizeSearch(value).replace(/[^a-z0-9\u3400-\u9fff]+/g,"");
const queryTerms = (value:string) => normalizeSearch(value).split(/[^a-z0-9\u3400-\u9fff]+/).filter(Boolean);
const searchIndex = dishes.map(d=>({
  title:compactSearch(d.name), place:compactSearch(locationOf(d)), tags:d.tags.map(compactSearch),
  notes:[d.quote,d.detail].map(compactSearch),
}));
function oneEdit(a:string,b:string){
  if(Math.abs(a.length-b.length)>1) return false;
  if(a.length===b.length){
    let i=0;
    while(i<a.length&&a[i]===b[i]) i++;
    if(i===a.length) return true;
    return a.slice(i+1)===b.slice(i+1) ||
      (i+1<a.length&&a[i]===b[i+1]&&a[i+1]===b[i]&&a.slice(i+2)===b.slice(i+2));
  }
  const [short,long]=a.length<b.length?[a,b]:[b,a];
  let i=0;
  while(i<short.length&&short[i]===long[i]) i++;
  return short.slice(i)===long.slice(i+1);
}
function looseMatch(term:string,field:string){
  if(term.length<2||term.length>40) return 0;
  const gap=term.length===2?2:4;
  for(let start=field.indexOf(term[0]);start!==-1;start=field.indexOf(term[0],start+1)){
    let end=start;
    for(let i=1;i<term.length&&end!==-1;i++) end=field.indexOf(term[i],end+1);
    if(end!==-1&&end-start+1-term.length<=gap) return 2;
  }
  if(term.length<3) return 0;
  for(let start=0;start<=field.length-term.length+1;start++){
    for(let size=term.length-1;size<=term.length+1&&start+size<=field.length;size++){
      const part=field.slice(start,start+size);
      if((term[0]===part[0]||term[term.length-1]===part[part.length-1])&&oneEdit(term,part)) return 1;
    }
  }
  return 0;
}
function termScore(term:string,entry:typeof searchIndex[number]){
  const {title,place,tags,notes}=entry;
  if(title===term) return 120;
  if(title.startsWith(term)) return 96;
  if(title.includes(term)) return 84;
  if(place.includes(term)) return 72;
  if(tags.some(t=>t.includes(term))) return 60;
  const titleMatch=looseMatch(term,title);
  if(titleMatch) return 40+titleMatch*4;
  if(notes.some(n=>n.includes(term))) return 35;
  const placeMatch=looseMatch(term,place);
  return placeMatch?20+placeMatch*4:0;
}
function Icon({name}:{name:string}){
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  {name === "save" ? <path d="M6.5 4.5h11a1.5 1.5 0 0 1 1.5 1.5v14.2l-7-4.4-7 4.4V6a1.5 1.5 0 0 1 1.5-1.5Z"/> : name === "search" ? <><circle cx="10.5" cy="10.5" r="5.8"/><path d="m15 15 4.2 4.2"/></> : name === "random" ? <><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><path d="M8.2 8.2h.01M12 12h.01M15.8 15.8h.01M15.8 8.2h.01M8.2 15.8h.01" strokeWidth="2.8"/></> : name === "close" ? <path d="m6.5 6.5 11 11m0-11-11 11"/> : <path d="M4.5 12h14m-5.5-5.5L18.5 12 13 17.5"/>}</svg>
}
function Score({score}:{score:number}) {
  return <span className="ys-score" aria-label={score+" 星"}>{[1,2,3,4,5].map(n => <svg key={n} className={"ys-star "+(n<=score?"is-on":"is-off")} viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M12 2.6c.7 0 1.3.4 1.6 1l2 4.1c.2.4.6.7 1 .8l4.5.7c1.4.2 2 2 .9 3l-3.2 3.2c-.3.3-.5.8-.4 1.2l.8 4.5c.2 1.4-1.3 2.5-2.5 1.8l-4-2.1a1.8 1.8 0 0 0-1.6 0l-4 2.1c-1.3.7-2.8-.4-2.5-1.8l.8-4.5c.1-.4-.1-.9-.4-1.2L1.9 12.2c-1-1-.5-2.8 1-3l4.5-.7c.4-.1.8-.4 1-.8l2-4.1c.3-.6.9-1 1.6-1Z"/></svg>)}</span>;
}
function Bowl(){
  return <svg className="ys-bowl" viewBox="0 0 560 400" aria-hidden="true">
    <defs>
      <radialGradient id="ys-glow" cx="50%" cy="48%" r="50%">
        <stop offset="0%" stopColor="#fffdf6"/>
        <stop offset="82%" stopColor="#fff8e3"/>
        <stop offset="100%" stopColor="#fff3d2" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="ys-bowl-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f06e5c"/>
        <stop offset="55%" stopColor="#de5243"/>
        <stop offset="100%" stopColor="#c43d30"/>
      </linearGradient>
      <linearGradient id="ys-broth-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffe79e"/>
        <stop offset="100%" stopColor="#ffd170"/>
      </linearGradient>
    </defs>
    <circle cx="286" cy="198" r="168" fill="url(#ys-glow)"/>
    <circle cx="286" cy="198" r="144" fill="#fffdf6" stroke="#f0cf92" strokeWidth="2.5" strokeDasharray="7 8"/>
    <g className="ys-float-a" transform="translate(80 78) rotate(-10)">
      <path d="M0-25c2.2 0 4.2 1.3 5.2 3.3l5.3 10.6 11.7 1.7c4.5.7 6.3 6.2 3 9.3l-8.5 8.2 2 11.7c.8 4.4-3.9 7.8-7.9 5.7L0 20l-10.8 5.6c-4 2.1-8.7-1.3-7.9-5.7l2-11.7-8.5-8.2c-3.3-3.1-1.5-8.6 3-9.3l11.7-1.7 5.3-10.6C-4.2-23.7-2.2-25 0-25Z" fill="#ffe177" stroke="#4a2e25" strokeWidth="3.2" strokeLinejoin="round"/>
      <circle cx="-6" cy="-1" r="2.2" fill="#4a2e25"/>
      <circle cx="6" cy="-1" r="2.2" fill="#4a2e25"/>
      <path d="M-2.8 4.5q2.8 3 5.6 0" fill="none" stroke="#4a2e25" strokeWidth="2.4" strokeLinecap="round"/>
      <ellipse cx="-11.5" cy="4" rx="3.2" ry="1.8" fill="#ff98a4"/>
      <ellipse cx="11.5" cy="4" rx="3.2" ry="1.8" fill="#ff98a4"/>
    </g>
    <g className="ys-sparkle" fill="#ff97a6" stroke="#4a2e25" strokeWidth="2.4" strokeLinejoin="round">
      <path d="M386 78c-6-4-13-10-13-17 0-7 7.5-9.5 13-4 5.5-5.5 13-3 13 4 0 7-7 13-13 17Z"/>
    </g>
    <g fill="#f9be52" stroke="#4a2e25" strokeWidth="2" strokeLinejoin="round">
      <path d="M148 118l4-10 4 10 10 4-10 4-4 10-4-10-10-4Z"/>
      <path d="M440 190l3-7 3 7 7 3-7 3-3 7-3-7-7-3Z"/>
    </g>
    <g className="ys-steam" fill="none" stroke="#fffdf7" strokeWidth="10" strokeLinecap="round" opacity=".88">
      <path d="M225 112c-12-16 14-24 2-42"/>
      <path d="M276 98c-14-18 16-26 4-46"/>
      <path d="M324 114c-11-15 13-22 3-39"/>
    </g>
    <g className="ys-steam" fill="none" stroke="#d9a16c" strokeWidth="3.2" strokeLinecap="round">
      <path d="M225 112c-12-16 14-24 2-42"/>
      <path d="M276 98c-14-18 16-26 4-46"/>
      <path d="M324 114c-11-15 13-22 3-39"/>
    </g>
    <ellipse cx="286" cy="322" rx="126" ry="20" fill="#edd0a8" opacity=".75"/>
    <g stroke="#4a2e25" strokeWidth="3.4" strokeLinejoin="round">
      <path d="M160 176l-18-52c-2-5 1-10 7-11l39-8c5-1 10 2 12 7l17 53Z" fill="#466b4c"/>
      <path d="M196 164l-11-54c-1-5 3-10 8-11l38-5c5-1 10 3 11 8l11 54Z" fill="#37573d"/>
      <path d="M161 131l25-5m-21 15l24-5m11-24l24-3m-21 15l23-3" stroke="#638e68" strokeWidth="2.4" strokeLinecap="round"/>
    </g>
    <g stroke="#4a2e25" strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round">
      <path d="M306 168L498 52c5-3 11 2 9 7l-6 9L316 177Z" fill="#e6a667"/>
      <path d="M318 182L512 84c5-3 10 3 8 8l-6 8L326 191Z" fill="#d99252"/>
    </g>
    <ellipse cx="286" cy="196" rx="146" ry="50" fill="#fff4d8" stroke="#4a2e25" strokeWidth="3.8"/>
    <ellipse cx="286" cy="198" rx="132" ry="39" fill="url(#ys-broth-grad)" stroke="#4a2e25" strokeWidth="3"/>
    <g transform="translate(216 184) rotate(-14)">
      <ellipse cx="0" cy="0" rx="34" ry="24" fill="#fffdf8" stroke="#4a2e25" strokeWidth="3.2"/>
      <ellipse cx="4" cy="2" rx="18" ry="13" fill="#ff9445" stroke="#4a2e25" strokeWidth="2.8"/>
      <ellipse cx="-2" cy="-2" rx="5" ry="3" fill="#ffd29d" transform="rotate(-18 -2 -2)"/>
    </g>
    <g transform="translate(362 182) rotate(12)">
      <path d="M0-25c5 0 7 4 11 5s8-1 11 3 1 8 3 12 6 6 5 11-5 6-6 10 2 8-2 11-8 0-12 2-6 5-10 5-7-4-11-5-8 1-11-3-1-8-3-12-6-6-5-11 5-6 6-10-2-8 2-11 8 0 12-2 6-5 10-5Z" fill="#fffdf8" stroke="#4a2e25" strokeWidth="3.2" strokeLinejoin="round"/>
      <path d="M-2-2c2-4 8-3 8 2 0 6-7 10-13 8-8-2-10-12-5-18 6-7 18-6 22 3" fill="none" stroke="#f27a92" strokeWidth="3.4" strokeLinecap="round"/>
    </g>
    <g fill="none" stroke="#4a2e25" strokeWidth="8.5" strokeLinecap="round">
      <path d="M278 194c-10-26 10-38 28-44"/>
      <path d="M294 198c-6-26 12-40 28-44"/>
      <path d="M310 202c-2-24 14-36 28-40"/>
      <path d="M236 210c14-10 34 6 50-4s30 6 46-4"/>
    </g>
    <g fill="none" stroke="#ffd25e" strokeWidth="4.2" strokeLinecap="round">
      <path d="M278 194c-10-26 10-38 28-44"/>
      <path d="M294 198c-6-26 12-40 28-44"/>
      <path d="M310 202c-2-24 14-36 28-40"/>
      <path d="M236 210c14-10 34 6 50-4s30 6 46-4"/>
    </g>
    <g fill="#73b86d" stroke="#4a2e25" strokeWidth="2.4">
      <ellipse cx="264" cy="176" rx="8" ry="5" transform="rotate(-12 264 176)"/>
      <ellipse cx="326" cy="212" rx="8" ry="5" transform="rotate(15 326 212)"/>
      <ellipse cx="242" cy="216" rx="7" ry="4.5" transform="rotate(-8 242 216)"/>
    </g>
    <path d="M228 298h116l-8 24c-2 6-8 9-14 9h-72c-6 0-12-3-14-9Z" fill="#fff4d8" stroke="#4a2e25" strokeWidth="3.8" strokeLinejoin="round"/>
    <path d="M140 198c6 78 65 114 146 114s140-36 146-114c-30 27-86 38-146 38s-116-11-146-38Z" fill="url(#ys-bowl-grad)" stroke="#4a2e25" strokeWidth="3.8" strokeLinejoin="round"/>
    <path d="M146 214c34 24 84 34 140 34s106-10 140-34l-3 18c-32 22-82 32-137 32s-105-10-137-32Z" fill="#fff5da" stroke="#4a2e25" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M168 252c9 17 24 30 43 38" fill="none" stroke="#ff9c8e" strokeWidth="5.5" strokeLinecap="round" opacity=".68"/>
    <g>
      <ellipse cx="255" cy="272" rx="6.2" ry="7.2" fill="#4a2e25"/>
      <circle cx="253" cy="269.5" r="2.2" fill="#fffdf8"/>
      <ellipse cx="317" cy="272" rx="6.2" ry="7.2" fill="#4a2e25"/>
      <circle cx="315" cy="269.5" r="2.2" fill="#fffdf8"/>
      <ellipse cx="238" cy="281" rx="9.5" ry="5.5" fill="#ffa0ad" opacity=".88"/>
      <ellipse cx="334" cy="281" rx="9.5" ry="5.5" fill="#ffa0ad" opacity=".88"/>
      <path d="M275 278c3 7 11 7 11 0 0 7 8 7 11 0" fill="none" stroke="#4a2e25" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <g className="ys-float-a" transform="translate(78 272) rotate(-7)">
      <path d="M-24-12h42v48h-42Z" fill="#bfe0ff" stroke="#4a2e25" strokeWidth="3.2" strokeLinejoin="round"/>
      <path d="M-24-12l10-18h24l8 18Z" fill="#fff7e2" stroke="#4a2e25" strokeWidth="3.2" strokeLinejoin="round"/>
      <path d="M-14-38h24v8h-24Z" fill="#fff7e2" stroke="#4a2e25" strokeWidth="3.2" strokeLinejoin="round"/>
      <path d="M10-30l8 18v48h10v-48l-10-18Z" fill="#e5f2ff" stroke="#4a2e25" strokeWidth="3.2" strokeLinejoin="round"/>
      <circle cx="-11" cy="10" r="2.4" fill="#4a2e25"/>
      <circle cx="5" cy="10" r="2.4" fill="#4a2e25"/>
      <path d="M-6 17q3 3.5 6 0" fill="none" stroke="#4a2e25" strokeWidth="2.4" strokeLinecap="round"/>
      <ellipse cx="-16" cy="16" rx="3.4" ry="2" fill="#ff98a4"/>
      <ellipse cx="10" cy="16" rx="3.4" ry="2" fill="#ff98a4"/>
    </g>
    <g className="ys-float-b" transform="translate(474 282) rotate(7)">
      <path d="M-36 18h72c-4 10-18 14-36 14s-32-4-36-14Z" fill="#ffd2dc" stroke="#4a2e25" strokeWidth="3.2" strokeLinejoin="round"/>
      <path d="M-18-24h36l13 42h-62Z" fill="#ffe188" stroke="#4a2e25" strokeWidth="3.2" strokeLinejoin="round"/>
      <path d="M-18-24c0-5 36-5 36 0l4 13c-6 2-9-5-13-2-5 6-8-2-13 1-5 4-9 0-14 2Z" fill="#d98a4e" stroke="#4a2e25" strokeWidth="3.2" strokeLinejoin="round"/>
      <path d="M0-28l4-10" stroke="#4a2e25" strokeWidth="2.8" strokeLinecap="round"/>
      <circle cx="7" cy="-39" r="6" fill="#ec5b67" stroke="#4a2e25" strokeWidth="2.8"/>
      <circle cx="5" cy="-41" r="1.8" fill="#fffdf8"/>
      <circle cx="-9" cy="1" r="2.5" fill="#4a2e25"/>
      <circle cx="9" cy="1" r="2.5" fill="#4a2e25"/>
      <path d="M-4 7.5q4 3.5 8 0" fill="none" stroke="#4a2e25" strokeWidth="2.4" strokeLinecap="round"/>
      <ellipse cx="-15" cy="7" rx="3.6" ry="2" fill="#ff98a4"/>
      <ellipse cx="15" cy="7" rx="3.6" ry="2" fill="#ff98a4"/>
    </g>
    <g transform="translate(286 364)">
      <rect x="-126" y="-15" width="252" height="30" rx="15" fill="#fffdf8" stroke="#4a2e25" strokeWidth="2.5"/>
      <circle cx="-108" cy="0" r="4" fill="#ec6252"/>
      <circle cx="108" cy="0" r="4" fill="#73b86d"/>
      <text x="0" y="4.5" textAnchor="middle" fill="#4a2e25" fontSize="11.5" fontWeight="800" letterSpacing="1.1" fontFamily='"PingFang SC","Microsoft YaHei",sans-serif'>YANYUAN BENTO · 干饭时间</text>
    </g>
  </svg>;
}
const css = `
.ys{background:var(--paper);color:var(--ink);min-height:100vh;font-family:"Microsoft YaHei","PingFang SC","Noto Sans CJK SC",sans-serif;--serif:"STSong","SimSun","Songti SC","Noto Serif CJK SC",serif;--mono:Consolas,"SFMono-Regular",monospace;font-size:14px;line-height:1.55;box-sizing:border-box}
.ys *,.ys *::before,.ys *::after{box-sizing:border-box}
.ys h1,.ys h2,.ys h3,.ys p,.ys figure{margin:0}
.ys button,.ys input,.ys select{font:inherit;color:inherit}
.ys button,.ys a,.ys select{cursor:pointer}
.ys button{border:0;background:none}
.ys a{color:inherit;text-decoration:none}
.ys :focus-visible{outline:2px solid var(--hot);outline-offset:4px}
.ys [id]{scroll-margin-top:16px}
.ys-shell{width:min(100% - 72px,1280px);margin:auto}
.ys-top{display:flex;justify-content:space-between;align-items:center;min-height:66px;border-bottom:2px solid var(--ink);gap:14px}
.ys-brand{display:flex;align-items:center;gap:11px;font-weight:800;letter-spacing:.12em;white-space:nowrap}
.ys-mark{display:grid;place-items:center;width:31px;height:31px;background:var(--hot);color:var(--onhot);font-family:var(--serif);font-size:19px;font-weight:900;letter-spacing:0}
.ys-mono{font:700 11px/1.5 var(--mono);letter-spacing:.16em}
.ys-topmeta{color:var(--muted)}
.ys-topright{display:flex;align-items:center;gap:18px}
.ys-author{display:flex;align-items:center;gap:8px;padding-left:15px;border-left:1px solid var(--line);white-space:nowrap}
.ys-avatar{display:block;flex:none;width:42px;height:42px;object-fit:cover;object-position:58% 43%;border-radius:50%;border:1px solid var(--line)}
.ys-byline{display:flex;flex-direction:column;line-height:1.25;font-size:12px}
.ys-byline small{color:var(--muted);font-size:10px;margin-top:3px}
@media(max-width:580px){.ys-topright .ys-topmeta{display:none}.ys-author{padding-left:0;border:0}.ys-avatar{width:35px;height:35px}}
.ys-hero{display:grid;grid-template-columns:minmax(0,.93fr) minmax(0,1.07fr);border-bottom:1px solid var(--line)}
.ys-copy{padding:clamp(26px,4.4vw,64px) 22px clamp(28px,4.25vw,56px) 0;align-self:center}
.ys-kicker{display:flex;align-items:center;gap:9px;color:var(--hot);font-weight:800;letter-spacing:.12em;margin-bottom:16px;font-size:12px}
.ys-kicker:before{content:"";width:23px;height:2px;background:currentColor}
.ys h1{font:900 var(--hero-size)/1.04 var(--serif);letter-spacing:-.065em}
.ys h1 em{color:var(--hot);font-style:normal}
.ys-deck{max-width:30em;margin-top:22px!important;color:var(--muted);font-size:14px;line-height:1.8}
.ys-cta{display:inline-flex;align-items:center;gap:14px;margin-top:23px;padding:10px 14px;background:var(--ink);color:var(--paper)!important;font-weight:700}
.ys-cta:hover{background:var(--hot);color:var(--onhot)!important}
.ys-figure{background:var(--board);color:var(--onboard);position:relative;display:grid;place-items:center;overflow:hidden;min-width:0;min-height:225px}
.ys-figure:before{content:"";position:absolute;inset:12px;border:1px solid currentColor;opacity:.48;pointer-events:none}
.ys-figure:after{content:"";position:absolute;inset:16px;border:1px solid currentColor;opacity:.18;pointer-events:none}
.ys-bowl{display:block;width:100%;max-height:430px}
.ys-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-bottom:1px solid var(--ink)}
.ys-strip button{min-width:0;padding:11px 14px;text-align:left;display:flex;align-items:center;gap:10px;border-right:1px solid var(--line)}
.ys-strip button:first-child{padding-left:0}
.ys-strip button:last-child{border-right:0}
.ys-strip button:hover,.ys-strip button[aria-pressed=true]{color:var(--hot)}
.ys-strip button[aria-pressed=true]{border-bottom:2px solid currentColor}
.ys-strip b{font:700 clamp(19px,2.5vw,31px)/1 var(--mono);letter-spacing:-.09em}
.ys-strip span{font-size:12px;white-space:nowrap}
.ys-feature{margin-top:31px}
.ys-heading{display:flex;align-items:baseline;justify-content:space-between;gap:14px;border-bottom:1px solid var(--ink);padding-bottom:10px}
.ys-heading h2{font:900 var(--section-size)/1.25 var(--serif);letter-spacing:-.04em}
.ys-heading .ys-mono{color:var(--muted);text-align:right}
.ys-specials{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line);border-bottom:1px solid var(--line)}
.ys-special{display:grid;grid-template-columns:65px 1fr auto;align-items:center;gap:14px;padding:18px 17px!important;text-align:left;background:var(--surface)!important;min-width:0}
.ys-special:hover{background:var(--tint)!important}
.ys-index{font:400 clamp(32px,4.4vw,58px)/1 var(--serif);letter-spacing:-.11em;color:var(--hot)}
.ys-special strong{display:block;font:900 var(--feature-size)/1.25 var(--serif);margin:4px 0}
.ys-special small{display:block;color:var(--muted);font-size:12px}
.ys-special .ys-where{font-size:11px;font-weight:800;color:var(--hot);letter-spacing:.09em}
.ys-list{margin-top:45px;padding-bottom:44px}
.ys-controls{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(120px,.85fr) auto;gap:8px;margin-top:15px}
.ys-search{display:flex;align-items:center;gap:8px}
.ys-search,.ys-select,.ys-fav{background:var(--surface)!important;border:1px solid var(--line)!important;min-height:43px;padding:0 10px}
.ys-search:focus-within{border-color:var(--hot)!important}
.ys-search input{border:0;background:none;min-width:0;width:100%;outline:none!important}
.ys-search input::placeholder{color:var(--muted)}
.ys-select{width:100%}
.ys-fav{display:inline-flex;gap:6px;align-items:center;justify-content:center;white-space:nowrap}
.ys-fav[aria-pressed=true]{color:var(--hot);border-color:var(--hot)!important}
.ys-fav[aria-pressed=true] svg,.ys-book[aria-pressed=true] svg{fill:currentColor}
.ys-tabs,.ys-tags{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.ys-tabs{margin-top:12px}
.ys-tabs button,.ys-tags button{border:1px solid var(--line);padding:5px 10px;font-size:12px}
.ys-tabs button[aria-pressed=true]{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.ys-tags{margin-top:8px}
.ys-tags span{font-size:11px;color:var(--muted);margin-right:3px}
.ys-tags button[aria-pressed=true]{background:var(--tint);color:var(--hot);border-color:var(--hot)}
.ys-tabs button:hover,.ys-tags button:hover{border-color:var(--hot)}
.ys-result{margin-top:16px;padding:12px 0;border-top:1px dashed var(--line);display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
.ys-count{color:var(--muted);font-size:12px}
.ys-count b{color:var(--ink);font-size:15px}
.ys-actions{display:flex;align-items:center;gap:10px}
.ys-reset{color:var(--muted)!important;font-size:12px!important;text-decoration:underline;text-underline-offset:3px}
.ys-random{background:var(--hot)!important;color:var(--onhot)!important;display:flex;align-items:center;gap:6px;padding:7px 10px!important;font-size:12px!important;font-weight:800!important}
.ys-random:disabled{opacity:.48;cursor:not-allowed}
.ys-random svg{width:15px;height:15px}
.ys-pick{padding:13px 15px;margin:0 0 12px;background:var(--tint);border-left:3px solid var(--hot);display:flex;gap:10px;align-items:center;justify-content:space-between}
.ys-pick strong{display:block;font-size:16px}.ys-pick small{color:var(--muted)}
.ys-pick button,.ys-book{display:grid;place-items:center;width:35px;height:35px;flex:0 0 auto}
.ys-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}
.ys-card{background:var(--surface);padding:14px;min-width:0;display:flex;flex-direction:column}
.ys-cardtop{display:flex;align-items:center;justify-content:space-between;gap:5px;min-height:30px}
.ys-local{font-size:11px;font-weight:750;color:var(--muted)}
.ys-card h3{font:900 var(--card-size)/1.3 var(--serif);margin:4px 0 3px;overflow-wrap:anywhere}
.ys-card .ys-score{align-self:flex-start;display:block;color:var(--hot);font-size:15px;letter-spacing:.09em;margin-bottom:8px}
.ys-card[data-tier=black] .ys-score{color:var(--ink)}
.ys-off{color:var(--line)}
.ys-book{color:var(--muted)!important;margin:-5px -4px -3px 0}
.ys-book:hover,.ys-book[aria-pressed=true]{color:var(--hot)!important}
.ys-quote{font-size:13px;font-weight:800}
.ys-detail{font-size:12px;color:var(--muted);line-height:1.65;margin:5px 0 12px!important}
.ys-cardtags{display:flex;flex-wrap:wrap;gap:5px;margin-top:auto}
.ys-cardtags span{background:var(--tint);color:var(--ink);font-size:10px;padding:2px 6px}
.ys-cardtags .ys-unavailable{color:var(--hot);font-weight:800;border:1px solid var(--hot);padding:1px 5px}
.ys-empty{border:1px dashed var(--line);padding:19px;color:var(--muted)}
.ys-empty button{color:var(--hot);text-decoration:underline}
.ys-footer{border-top:2px solid var(--ink);padding:13px 0 26px;display:flex;justify-content:space-between;gap:10px;font-size:11px;color:var(--muted)}
@media(max-width:860px){.ys-shell{width:calc(100% - 40px)}.ys-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ys-special{grid-template-columns:44px 1fr auto;gap:8px;padding:13px 10px!important}.ys-deck{font-size:13px}}
@media(max-width:580px){.ys-shell{width:calc(100% - 28px)}.ys-top{min-height:53px}.ys-topmeta{font-size:9px;letter-spacing:.06em}.ys-hero{grid-template-columns:1fr}.ys-copy{padding:22px 0 24px}.ys-deck{margin-top:12px!important}.ys-kicker{margin-bottom:10px}.ys-cta{margin-top:13px;padding:8px 10px}.ys-figure{min-height:0}.ys-bowl{height:215px}.ys-strip button{padding:9px 5px;gap:4px;flex-wrap:wrap}.ys-strip span{font-size:11px}.ys-specials,.ys-grid{grid-template-columns:1fr}.ys-special{grid-template-columns:41px 1fr auto}.ys-feature{margin-top:23px}.ys-list{margin-top:31px}.ys-controls{grid-template-columns:1fr auto}.ys-search{grid-column:1/-1}.ys-heading .ys-mono{font-size:9px;letter-spacing:.09em}}
`;

export default function YanyuanFoodGuide(){
  const theme = useHostTheme();
  const style = {
    "--paper": theme.bg.editor, "--surface":theme.bg.elevated, "--ink":theme.text.primary,
    "--muted":theme.text.secondary, "--line":theme.stroke.primary, "--tint":theme.fill.secondary,
    "--hot":theme.accent.primary, "--onhot":theme.text.onAccent,
    "--board":theme.accent.control, "--onboard":theme.text.onAccent,
    "--hero-size":"24px","--section-size":"23px","--feature-size":"19px","--card-size":"19px",
  } as CSSProperties;
  const [tier,setTier] = useState("all");
  const [place,setPlace] = useState("");
  const [query,setQuery] = useState("");
  const [tag,setTag] = useState("");
  const [savedOnly,setSavedOnly] = useState(false);
  const [saved,setSaved] = useCanvasState<number[]>("yanyuan-saved-v1",[]);
  const [pickId,setPickId] = useState<number|null>(null);
  const filtered = useMemo(() => {
    const ts = (tiers.find(t=>t.id===tier) || tiers[0]).test;
    const terms=queryTerms(query);
    return dishes.filter(d=>ts(d.score)&&(!place||d.place===place)&&(!tag||d.tags.includes(tag))&&(!savedOnly||saved.includes(d.id)))
      .map(d=>{
        const hits=terms.map(t=>termScore(t,searchIndex[d.id]));
        return {dish:d,relevance:hits.every(Boolean)?hits.reduce((sum,n)=>sum+n,0):-1};
      }).filter(r=>r.relevance>=0)
      .sort((a,b)=>b.relevance-a.relevance||b.dish.score-a.dish.score).map(r=>r.dish);
  },[tier,place,query,tag,savedOnly,saved]);
  const picks = filtered.filter(d=>d.score>=4&&!d.unavailable);
  const pick = picks.find(d=>d.id===pickId);
  const isFiltered = tier!=="all" || !!place || !!query || !!tag || savedOnly;
  function setTab(id:string){setTier(id);setPickId(null)}
  function reset(){setTab("all");setPlace("");setQuery("");setTag("");setSavedOnly(false)}
  function jump(){document.getElementById("yanyuan-menu")?.scrollIntoView({behavior:"smooth",block:"start"})}
  function showDish(d:typeof dishes[number]){reset();setPlace(d.place);setQuery(d.name);jump()}
  function roll(){
    const pool = picks.length>1 ? picks.filter(d=>d.id!==pickId) : picks;
    if(pool.length) setPickId(pool[Math.floor(Math.random()*pool.length)].id);
  }
  return <main className="ys" style={style}>
    <div className="ys-shell">
      <header className="ys-top"><div className="ys-brand"><span className="ys-mark">食</span><span>燕园饭点编辑部</span></div><div className="ys-topright"><span className="ys-mono ys-topmeta">YANYUAN FOOD NOTES / NO. 01</span><div className="ys-author"><img className="ys-avatar" src={authorAvatar} alt="作者头像" width={42} height={42}/><span className="ys-byline"><strong>灰皂沫.🛁</strong><small>个人试吃手记</small></span></div></div></header>
      <section className="ys-hero" aria-labelledby="ys-title">
        <div className="ys-copy"><div className="ys-kicker">个人试吃档案 · 第一期</div><h1 id="ys-title">燕园美食<br/><em>红黑榜</em></h1>
        <p className="ys-deck">从「我溺爱」到「拉完了」。<br/>哪些值得专门跑一趟，哪些再火也不回购？</p>
        <a href="#yanyuan-menu" className="ys-cta" onClick={(e:{preventDefault():void})=>{e.preventDefault();jump()}}>打开榜单 <Icon name="arrow"/></a></div>
        <figure className="ys-figure"><Bowl/></figure>
      </section>
      <nav className="ys-strip" aria-label="榜单速览">
        {tiers.map(t => <button key={t.id} aria-pressed={tier===t.id} onClick={()=>{setTab(t.id);jump()}}><b>{pad(dishes.filter(d=>t.test(d.score)).length)}</b><span>{t.id==="all"?"条试吃记录":t.name}</span></button>)}
      </nav>
      <section className="ys-feature" aria-labelledby="ys-feature">
        <header className="ys-heading"><h2 id="ys-feature">五星精选</h2><span className="ys-mono">EDITOR’S PICKS / 5 OUT OF 5</span></header>
        <div className="ys-specials">{dishes.filter(d=>d.score===5).map((d,i)=><button className="ys-special" key={d.id} onClick={()=>showDish(d)}>
          <span className="ys-index" aria-hidden="true">{pad(i+1)}</span><span><span className="ys-where">{locationOf(d)}</span><strong>{d.name}</strong><small>{i===0?"豆角＋卤肉双拼，擂椒可以多加。":i===1?"土豆泥给得足，辣子鸡够香。":d.quote}</small></span><Icon name="arrow"/>
        </button>)}</div>
      </section>
      <section className="ys-list" id="yanyuan-menu" aria-labelledby="ys-list">
        <header className="ys-heading"><h2 id="ys-list">查榜 · 今天吃什么</h2><span className="ys-mono">THE TASTING INDEX</span></header>
        <div className="ys-controls">
          <label className="ys-search"><Icon name="search"/><input type="search" aria-label="搜索菜名或口味" placeholder="搜菜名、食堂、口味（支持错字、漏字）" value={query} onChange={(e:{target:{value:string}})=>{setQuery(e.target.value);setPickId(null)}}/></label>
          <select className="ys-select" aria-label="用餐地点" value={place} onChange={(e:{target:{value:string}})=>{setPlace(e.target.value);setPickId(null)}}><option value="">全部地点</option>{places.map(p=><option key={p}>{p}</option>)}</select>
          <button className="ys-fav" aria-pressed={savedOnly} onClick={()=>{setSavedOnly(!savedOnly);setPickId(null)}}><Icon name="save"/>收藏 {saved.length}</button>
        </div>
        <div className="ys-tabs" aria-label="评分档位" role="group">{tiers.map(t=><button key={t.id} aria-pressed={tier===t.id} onClick={()=>setTab(t.id)}>{t.name}{t.id==="red"?" · 4–5 星":t.id==="mid"?" · 3 星":t.id==="black"?" · 1–2 星":""}</button>)}</div>
        <div className="ys-tags" aria-label="快捷口味筛选" role="group"><span>快速筛选</span>{quick.map(q=><button key={q} aria-pressed={tag===q} onClick={()=>{setTag(tag===q?"":q);setPickId(null)}}>{q}</button>)}</div>
        <div className="ys-result"><div className="ys-count" role="status"><b>{filtered.length}</b> 条符合 · {query.trim() ? "按相关度排序" : (tiers.find(t=>t.id===tier)||tiers[0]).desc}</div><div className="ys-actions">
          {isFiltered&&<button className="ys-reset" onClick={reset}>清空筛选</button>}
          <button className="ys-random" onClick={roll} disabled={!picks.length} title="只从当前筛选结果的四、五星菜里抽；已下架的不参与"><Icon name="random"/>红榜随机点</button>
        </div></div>
        {pick&&<div className="ys-pick" key={pick.id} role="status"><div><small>今日幸运抽签 · {locationOf(pick)} · {pick.score} 星</small><strong>{pick.name}</strong><small>{pick.quote}</small></div><button aria-label="关闭随机推荐" onClick={()=>setPickId(null)}><Icon name="close"/></button></div>}
        {filtered.length ? <div className="ys-grid">{filtered.map(d=><article className="ys-card" key={d.id} data-tier={d.score>=4?"red":d.score===3?"mid":"black"} data-kind={kindOf(d.tags)}>
          <div className="ys-cardtop"><span className="ys-local">{locationOf(d)}</span><button className="ys-book" aria-label={(saved.includes(d.id)?"取消收藏 ":"收藏 ")+d.name} aria-pressed={saved.includes(d.id)} onClick={()=>setSaved(prev=>prev.includes(d.id)?prev.filter(x=>x!==d.id):[...prev,d.id])}><Icon name="save"/></button></div>
          <h3>{d.name}</h3><Score score={d.score}/><p className="ys-quote">{d.quote}</p>{d.detail&&<p className="ys-detail">{d.detail}</p>}
          <div className="ys-cardtags">{d.tags.map(q=><span className={q==="已下架"||q==="仅观感"?"ys-unavailable":undefined} key={q}>{q}</span>)}</div>
        </article>)}</div> : <div className="ys-empty">{savedOnly&&!saved.length?"还没收藏。点一道菜右上角的书签，就能把它留在这里。":"这组筛选没有匹配，换个关键词或放宽条件。"} <button onClick={reset}>回到全榜</button></div>}
      </section>
      <footer className="ys-footer"><span>燕园试吃手记 · 今天也要好好吃饭。</span><span className="ys-mono">END / 01</span></footer>
    </div>
    <style>{css}</style>
  </main>;
}
