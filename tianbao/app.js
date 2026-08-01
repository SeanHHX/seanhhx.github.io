/* ============================================================
 * 甜宝幼小衔接工作台 - 应用逻辑
 * ============================================================ */

/* ==================== 数据：古诗 ==================== */
const POEMS = [
  { title: '咏鹅', author: '【唐】骆宾王', lines: '鹅，鹅，鹅，\n曲项向天歌。\n白毛浮绿水，\n红掌拨清波。' },
  { title: '静夜思', author: '【唐】李白', lines: '床前明月光，\n疑是地上霜。\n举头望明月，\n低头思故乡。' },
  { title: '春晓', author: '【唐】孟浩然', lines: '春眠不觉晓，\n处处闻啼鸟。\n夜来风雨声，\n花落知多少。' },
  { title: '悯农', author: '【唐】李绅', lines: '锄禾日当午，\n汗滴禾下土。\n谁知盘中餐，\n粒粒皆辛苦。' },
  { title: '登鹳雀楼', author: '【唐】王之涣', lines: '白日依山尽，\n黄河入海流。\n欲穷千里目，\n更上一层楼。' },
  { title: '画', author: '【唐】王维', lines: '远看山有色，\n近听水无声。\n春去花还在，\n人来鸟不惊。' },
  { title: '江雪', author: '【唐】柳宗元', lines: '千山鸟飞绝，\n万径人踪灭。\n孤舟蓑笠翁，\n独钓寒江雪。' },
  { title: '寻隐者不遇', author: '【唐】贾岛', lines: '松下问童子，\n言师采药去。\n只在此山中，\n云深不知处。' },
  { title: '赋得古原草送别', author: '【唐】白居易', lines: '离离原上草，\n一岁一枯荣。\n野火烧不尽，\n春风吹又生。' },
  { title: '游子吟', author: '【唐】孟郊', lines: '慈母手中线，\n游子身上衣。\n临行密密缝，\n意恐迟迟归。\n谁言寸草心，\n报得三春晖。' },
  { title: '咏柳', author: '【唐】贺知章', lines: '碧玉妆成一树高，\n万条垂下绿丝绦。\n不知细叶谁裁出，\n二月春风似剪刀。' },
  { title: '绝句', author: '【唐】杜甫', lines: '两个黄鹂鸣翠柳，\n一行白鹭上青天。\n窗含西岭千秋雪，\n门泊东吴万里船。' },
  { title: '清明', author: '【唐】杜牧', lines: '清明时节雨纷纷，\n路上行人欲断魂。\n借问酒家何处有？\n牧童遥指杏花村。' },
  { title: '江南春', author: '【唐】杜牧', lines: '千里莺啼绿映红，\n水村山郭酒旗风。\n南朝四百八十寺，\n多少楼台烟雨中。' },
  { title: '元日', author: '【宋】王安石', lines: '爆竹声中一岁除，\n春风送暖入屠苏。\n千门万户曈曈日，\n总把新桃换旧符。' },
  { title: '泊船瓜洲', author: '【宋】王安石', lines: '京口瓜洲一水间，\n钟山只隔数重山。\n春风又绿江南岸，\n明月何时照我还。' },
  { title: '梅花', author: '【宋】王安石', lines: '墙角数枝梅，\n凌寒独自开。\n遥知不是雪，\n为有暗香来。' },
  { title: '小池', author: '【宋】杨万里', lines: '泉眼无声惜细流，\n树阴照水爱晴柔。\n小荷才露尖尖角，\n早有蜻蜓立上头。' },
  { title: '所见', author: '【清】袁枚', lines: '牧童骑黄牛，\n歌声振林樾。\n意欲捕鸣蝉，\n忽然闭口立。' },
  { title: '村居', author: '【清】高鼎', lines: '草长莺飞二月天，\n拂堤杨柳醉春烟。\n儿童散学归来早，\n忙趁东风放纸鸢。' },
  { title: '回乡偶书', author: '【唐】贺知章', lines: '少小离家老大回，\n乡音无改鬓毛衰。\n儿童相见不相识，\n笑问客从何处来。' },
  { title: '赠汪伦', author: '【唐】李白', lines: '李白乘舟将欲行，\n忽闻岸上踏歌声。\n桃花潭水深千尺，\n不及汪伦送我情。' },
  { title: '望庐山瀑布', author: '【唐】李白', lines: '日照香炉生紫烟，\n遥看瀑布挂前川。\n飞流直下三千尺，\n疑是银河落九天。' },
  { title: '早发白帝城', author: '【唐】李白', lines: '朝辞白帝彩云间，\n千里江陵一日还。\n两岸猿声啼不住，\n轻舟已过万重山。' },
  { title: '望天门山', author: '【唐】李白', lines: '天门中断楚江开，\n碧水东流至此回。\n两岸青山相对出，\n孤帆一片日边来。' },
  { title: '黄鹤楼送孟浩然之广陵', author: '【唐】李白', lines: '故人西辞黄鹤楼，\n烟花三月下扬州。\n孤帆远影碧空尽，\n唯见长江天际流。' },
  { title: '九月九日忆山东兄弟', author: '【唐】王维', lines: '独在异乡为异客，\n每逢佳节倍思亲。\n遥知兄弟登高处，\n遍插茱萸少一人。' },
  { title: '出塞', author: '【唐】王昌龄', lines: '秦时明月汉时关，\n万里长征人未还。\n但使龙城飞将在，\n不教胡马度阴山。' },
  { title: '鹿柴', author: '【唐】王维', lines: '空山不见人，\n但闻人语响。\n返景入深林，\n复照青苔上。' },
  { title: '风', author: '【唐】李峤', lines: '解落三秋叶，\n能开二月花。\n过江千尺浪，\n入竹万竿斜。' }
];

/* ==================== 数据：成语故事 ==================== */
const IDIOMS = [
  { name: '守株待兔', pinyin: 'shǒu zhū dài tù', meaning: '比喻不主动努力，而存万一的侥幸心理，希望得到意外的收获。', story: '宋国有个农民，一天在田里干活，忽然看见一只兔子撞死在树桩上。他没花力气就白捡了一只兔子，很高兴。从此他天天守在树桩旁，等着兔子来撞死，结果再也没等到，田地也荒废了。' },
  { name: '亡羊补牢', pinyin: 'wáng yáng bǔ láo', meaning: '羊逃跑了再去修补羊圈，还不算晚。比喻出了问题以后想办法补救，可以防止继续受损失。', story: '从前有人养了一群羊，一天早上发现少了一只。邻居劝他赶紧修羊圈，他不听。第二天又少了一只，他这才后悔，赶紧修好了羊圈。从此羊再也没丢过。' },
  { name: '画蛇添足', pinyin: 'huà shé tiān zú', meaning: '画蛇时给蛇添上脚。比喻做了多余的事，反而把事情弄糟。', story: '几个人比赛画蛇，谁先画完谁喝酒。一个人最先画完，为了显示本事，又给蛇添了脚。另一个人画完了，说蛇本来没有脚，你添了脚就不是蛇了。结果酒被那个人喝了。' },
  { name: '井底之蛙', pinyin: 'jǐng dǐ zhī wā', meaning: '井底的青蛙以为天只有井口那么大。比喻见识短浅的人。', story: '一只青蛙住在废井里，对东海里的海龟说：我快乐极了！海龟告诉它大海有多大有多深，青蛙听了目瞪口呆，才知道自己的世界多么渺小。' },
  { name: '刻舟求剑', pinyin: 'kè zhōu qiú jiàn', meaning: '在船上刻记号，再按记号去找掉进水里的剑。比喻拘泥不知变通，不懂得根据实际情况处理问题。', story: '楚国人坐船渡河，剑掉进水里。他立刻在船边刻了个记号，说：我的剑就是从这里掉下去的。等船停了，他从刻记号的地方下水找剑，当然找不到了。' },
  { name: '掩耳盗铃', pinyin: 'yǎn ěr dào líng', meaning: '捂住自己的耳朵偷铃铛。比喻自己欺骗自己，明明掩盖不住的事情偏要想法子掩盖。', story: '有个小偷想偷别人家的铃铛，但铃铛一碰就会响。他以为自己听不见别人也听不见，就捂住自己的耳朵去偷，结果被抓住了。' },
  { name: '拔苗助长', pinyin: 'bá miáo zhù zhǎng', meaning: '把禾苗拔高来帮助它生长。比喻违反事物的发展规律，急于求成，反而把事情弄糟。', story: '宋国人嫌田里的禾苗长得太慢，就一棵棵往上拔高了一点。他回家说：今天太累了，我帮禾苗长高了！儿子跑去一看，禾苗全都枯死了。' },
  { name: '狐假虎威', pinyin: 'hú jiǎ hǔ wēi', meaning: '狐狸借着老虎的威风。比喻借着别人的威势来吓唬人。', story: '老虎抓住了一只狐狸，狐狸说：你不敢吃我，天帝让我做百兽之王，不信跟我走一趟。动物们看到老虎来了都跑了，老虎以为它们怕狐狸，其实怕的是老虎自己。' },
  { name: '对牛弹琴', pinyin: 'duì niú tán qín', meaning: '对着牛弹琴。比喻对不懂道理的人讲道理，白费口舌。', story: '音乐家公明仪给牛弹了一首高雅的曲子，牛只顾吃草。他又弹了类似蚊蝇和牛犊叫声的曲子，牛立刻竖起耳朵走来走去听。不是牛听不懂，是曲子不对它的胃口。' },
  { name: '自相矛盾', pinyin: 'zì xiāng máo dùn', meaning: '自己的言行相互抵触，不能自圆其说。', story: '楚国人卖矛和盾，说自己的盾什么都刺不破，又说自己的矛什么都能刺穿。有人问：用你的矛刺你的盾会怎样？他哑口无言。' },
  { name: '坐井观天', pinyin: 'zuò jǐng guān tiān', meaning: '坐在井里看天。比喻眼界小，见识少。', story: '青蛙坐在井里，小鸟飞来落在井沿上。青蛙问天有多大，小鸟说天很大。青蛙不信，说天只有井口那么大。小鸟让青蛙跳出井来看看，青蛙跳出来一看，天果然很大很大。' },
  { name: '画龙点睛', pinyin: 'huà lóng diǎn jīng', meaning: '画龙时点上眼睛。比喻在关键地方简明地点明要旨，使内容更加生动有力。', story: '画家张僧繇在寺庙墙上画了四条龙，都没画眼睛。人们问他为什么不画眼睛，他说画了眼睛龙就会飞走。大家不信，他就给两条龙画上眼睛，雷电大作，两条龙腾空飞去。' },
  { name: '闻鸡起舞', pinyin: 'wén jī qǐ wǔ', meaning: '听到鸡叫就起来舞剑。比喻有志报国的人奋发图强。', story: '祖逖和刘琨是好朋友，他们半夜听到鸡叫，祖速说：这是催我们起床的声音！两人就起来练剑。后来他们都成了大将军。' },
  { name: '铁杵磨针', pinyin: 'tiě chǔ mó zhēn', meaning: '把铁棒磨成针。比喻只要有恒心，再难的事也能做成。', story: '李白小时候不爱学习。一天他看见一位老奶奶在磨一根铁棒，问她在做什么。老奶奶说：磨针。李白说：这么粗的铁棒什么时候才能磨成针？老奶奶说：只要功夫深，铁杵磨成针。李白从此发奋读书。' },
  { name: '孔融让梨', pinyin: 'kǒng róng ràng lí', meaning: '孔融把大梨让给哥哥。比喻懂得谦让。', story: '孔融四岁时，家里吃梨，他总是拿最小的。大人问他为什么，他说：我年纪小，应该吃小的，大的给哥哥们吃。' },
  { name: '曹冲称象', pinyin: 'cáo chōng chēng xiàng', meaning: '用石头代替大象来称重。比喻用巧妙的方法解决问题。', story: '有人送给曹操一头大象，曹操想知道大象有多重，但没有那么大的秤。曹冲七岁，他说：把大象牵到船上，在船帮上画吃水线，再牵走大象装石头到同样深度，称石头重量即可。' },
  { name: '愚公移山', pinyin: 'yú gōng yí shān', meaning: '比喻坚持不懈地改造自然和坚定不移地进行斗争。', story: '愚公家门口有两座大山挡路，他决定把山搬走。智叟笑他自不量力。愚公说：我死了有儿子，儿子死了有孙子，子子孙孙无穷无尽，山却不会再长，总能搬完。天帝被感动，派神仙把山搬走了。' },
  { name: '完璧归赵', pinyin: 'wán bì guī zhào', meaning: '把和氏璧完好地送回赵国。比喻把原物完好地归还本人。', story: '赵国得到和氏璧，秦国要用十五座城来换。蔺相如带璧去秦国，发现秦国不想给城，就机智地把璧要回来，派人连夜送回赵国。' },
  { name: '负荆请罪', pinyin: 'fù jīng qǐng zuì', meaning: '背着荆条向人请罪。表示向人认错赔罪。', story: '廉颇不服蔺相如地位比自己高，蔺相如处处忍让。廉颇知道后很惭愧，脱掉上衣背着荆条到蔺相如门前请罪。两人从此成为好朋友。' },
  { name: '胸有成竹', pinyin: 'xiōng yǒu chéng zhú', meaning: '画竹子前心中已有竹子的形象。比喻做事之前已拿定主意，有了完整的计划。', story: '画家文同画竹子非常有名，他在画之前心中已经有了竹子的完整形象，所以画出来的竹子非常生动。苏轼说：画竹必先得成竹于胸中。' }
];

/* ==================== 数据：识字 ==================== */
const CHARACTERS = [
  {char:'天',pinyin:'tiān',meaning:'天空'},{char:'地',pinyin:'dì',meaning:'大地'},
  {char:'人',pinyin:'rén',meaning:'人类'},{char:'你',pinyin:'nǐ',meaning:'你'},
  {char:'我',pinyin:'wǒ',meaning:'我'},{char:'他',pinyin:'tā',meaning:'他'},
  {char:'上',pinyin:'shàng',meaning:'上面'},{char:'下',pinyin:'xià',meaning:'下面'},
  {char:'左',pinyin:'zuǒ',meaning:'左边'},{char:'右',pinyin:'yòu',meaning:'右边'},
  {char:'大',pinyin:'dà',meaning:'大小'},{char:'小',pinyin:'xiǎo',meaning:'大小'},
  {char:'多',pinyin:'duō',meaning:'多少'},{char:'少',pinyin:'shǎo',meaning:'多少'},
  {char:'山',pinyin:'shān',meaning:'大山'},{char:'水',pinyin:'shuǐ',meaning:'喝水'},
  {char:'火',pinyin:'huǒ',meaning:'火焰'},{char:'木',pinyin:'mù',meaning:'树木'},
  {char:'日',pinyin:'rì',meaning:'太阳'},{char:'月',pinyin:'yuè',meaning:'月亮'},
  {char:'石',pinyin:'shí',meaning:'石头'},{char:'土',pinyin:'tǔ',meaning:'泥土'},
  {char:'田',pinyin:'tián',meaning:'田地'},{char:'金',pinyin:'jīn',meaning:'金子'},
  {char:'花',pinyin:'huā',meaning:'花朵'},{char:'草',pinyin:'cǎo',meaning:'小草'},
  {char:'树',pinyin:'shù',meaning:'大树'},{char:'叶',pinyin:'yè',meaning:'树叶'},
  {char:'风',pinyin:'fēng',meaning:'刮风'},{char:'雨',pinyin:'yǔ',meaning:'下雨'},
  {char:'云',pinyin:'yún',meaning:'白云'},{char:'雪',pinyin:'xuě',meaning:'下雪'},
  {char:'春',pinyin:'chūn',meaning:'春天'},{char:'夏',pinyin:'xià',meaning:'夏天'},
  {char:'秋',pinyin:'qiū',meaning:'秋天'},{char:'冬',pinyin:'dōng',meaning:'冬天'},
  {char:'手',pinyin:'shǒu',meaning:'双手'},{char:'足',pinyin:'zú',meaning:'脚'},
  {char:'口',pinyin:'kǒu',meaning:'嘴巴'},{char:'目',pinyin:'mù',meaning:'眼睛'},
  {char:'耳',pinyin:'ěr',meaning:'耳朵'},{char:'头',pinyin:'tóu',meaning:'脑袋'},
  {char:'心',pinyin:'xīn',meaning:'心里'},{char:'马',pinyin:'mǎ',meaning:'马匹'},
  {char:'牛',pinyin:'niú',meaning:'小牛'},{char:'羊',pinyin:'yáng',meaning:'小羊'},
  {char:'鸟',pinyin:'niǎo',meaning:'小鸟'},{char:'鱼',pinyin:'yú',meaning:'小鱼'},
  {char:'虫',pinyin:'chóng',meaning:'虫子'},{char:'狗',pinyin:'gǒu',meaning:'小狗'},
  {char:'猫',pinyin:'māo',meaning:'小猫'},{char:'鸡',pinyin:'jī',meaning:'小鸡'},
  {char:'一',pinyin:'yī',meaning:'数字一'},{char:'二',pinyin:'èr',meaning:'数字二'},
  {char:'三',pinyin:'sān',meaning:'数字三'},{char:'四',pinyin:'sì',meaning:'数字四'},
  {char:'五',pinyin:'wǔ',meaning:'数字五'},{char:'六',pinyin:'liù',meaning:'数字六'},
  {char:'七',pinyin:'qī',meaning:'数字七'},{char:'八',pinyin:'bā',meaning:'数字八'},
  {char:'九',pinyin:'jiǔ',meaning:'数字九'},{char:'十',pinyin:'shí',meaning:'数字十'},
  {char:'百',pinyin:'bǎi',meaning:'一百'},{char:'千',pinyin:'qiān',meaning:'一千'},
  {char:'万',pinyin:'wàn',meaning:'一万'},{char:'中',pinyin:'zhōng',meaning:'中间'},
  {char:'文',pinyin:'wén',meaning:'文字'},{char:'字',pinyin:'zì',meaning:'汉字'},
  {char:'书',pinyin:'shū',meaning:'书本'},{char:'笔',pinyin:'bǐ',meaning:'铅笔'},
  {char:'纸',pinyin:'zhǐ',meaning:'纸张'},{char:'画',pinyin:'huà',meaning:'画画'},
  {char:'学',pinyin:'xué',meaning:'学习'},{char:'校',pinyin:'xiào',meaning:'学校'},
  {char:'老',pinyin:'lǎo',meaning:'老师'},{char:'师',pinyin:'shī',meaning:'老师'},
  {char:'同',pinyin:'tóng',meaning:'同学'},{char:'好',pinyin:'hǎo',meaning:'好的'},
  {char:'早',pinyin:'zǎo',meaning:'早上'},{char:'晚',pinyin:'wǎn',meaning:'晚上'},
  {char:'明',pinyin:'míng',meaning:'明亮'},{char:'白',pinyin:'bái',meaning:'白色'},
  {char:'红',pinyin:'hóng',meaning:'红色'},{char:'黄',pinyin:'huáng',meaning:'黄色'},
  {char:'蓝',pinyin:'lán',meaning:'蓝色'},{char:'绿',pinyin:'lǜ',meaning:'绿色'},
  {char:'黑',pinyin:'hēi',meaning:'黑色'},{char:'吃',pinyin:'chī',meaning:'吃饭'},
  {char:'喝',pinyin:'hē',meaning:'喝水'},{char:'看',pinyin:'kàn',meaning:'看见'},
  {char:'听',pinyin:'tīng',meaning:'听见'},{char:'说',pinyin:'shuō',meaning:'说话'},
  {char:'走',pinyin:'zǒu',meaning:'走路'},{char:'跑',pinyin:'pǎo',meaning:'跑步'},
  {char:'飞',pinyin:'fēi',meaning:'飞行'},{char:'坐',pinyin:'zuò',meaning:'坐下'},
  {char:'立',pinyin:'lì',meaning:'站立'},{char:'开',pinyin:'kāi',meaning:'打开'},
  {char:'关',pinyin:'guān',meaning:'关闭'},{char:'来',pinyin:'lái',meaning:'过来'},
  {char:'去',pinyin:'qù',meaning:'过去'},{char:'有',pinyin:'yǒu',meaning:'拥有'},
  {char:'好',pinyin:'hǎo',meaning:'好的'},{char:'爱',pinyin:'ài',meaning:'爱心'}
];

/* ==================== 数据：英语短句 ==================== */
const ENGLISH_PHRASES = [
  { en: 'Good morning!', cn: '早上好！' },
  { en: 'How are you?', cn: '你好吗？' },
  { en: 'I am fine, thank you!', cn: '我很好，谢谢！' },
  { en: 'What is your name?', cn: '你叫什么名字？' },
  { en: 'My name is Tianbao.', cn: '我叫甜宝。' },
  { en: 'Nice to meet you!', cn: '很高兴认识你！' },
  { en: 'I love you, Mom!', cn: '妈妈，我爱你！' },
  { en: 'I love you, Dad!', cn: '爸爸，我爱你！' },
  { en: 'Let us play together!', cn: '我们一起玩吧！' },
  { en: 'It is time to eat!', cn: '该吃饭啦！' },
  { en: 'It is time to sleep!', cn: '该睡觉啦！' },
  { en: 'I am hungry.', cn: '我饿了。' },
  { en: 'I am thirsty.', cn: '我渴了。' },
  { en: 'I am happy!', cn: '我很开心！' },
  { en: 'I am sad.', cn: '我有点难过。' },
  { en: 'Can you help me?', cn: '你能帮帮我吗？' },
  { en: 'Thank you very much!', cn: '非常感谢！' },
  { en: 'You are welcome!', cn: '不客气！' },
  { en: 'I am sorry.', cn: '对不起。' },
  { en: 'It is okay!', cn: '没关系！' },
  { en: 'Wash your hands, please.', cn: '请洗手。' },
  { en: 'Brush your teeth!', cn: '刷牙啦！' },
  { en: 'Time for school!', cn: '该上学了！' },
  { en: 'Good night, sweet dreams!', cn: '晚安，好梦！' },
  { en: 'I like reading books!', cn: '我喜欢看书！' },
  { en: 'Let us count numbers!', cn: '我们一起来数数！' },
  { en: 'What color is it?', cn: '它是什么颜色？' },
  { en: 'It is red!', cn: '它是红色的！' },
  { en: 'Look at the rainbow!', cn: '看那个彩虹！' },
  { en: 'The sun is shining!', cn: '太阳好亮呀！' },
  { en: 'I can do it by myself!', cn: '我自己能行！' },
  { en: 'Let us sing a song!', cn: '我们唱歌吧！' },
  { en: 'What day is today?', cn: '今天星期几？' },
  { en: 'Today is Monday.', cn: '今天是星期一。' },
  { en: 'How old are you?', cn: '你几岁了？' },
  { en: 'I am six years old.', cn: '我六岁了。' },
  { en: 'Hurry up!', cn: '快一点！' },
  { en: 'Wait for me!', cn: '等等我！' },
  { en: 'I miss you!', cn: '我想你！' },
  { en: 'Great job!', cn: '做得好！' },
  { en: 'Try again!', cn: '再试一次！' },
  { en: 'I love drawing!', cn: '我喜欢画画！' },
  { en: 'It is a beautiful day!', cn: '今天天气真好！' },
  { en: 'Where is my toy?', cn: '我的玩具在哪？' },
  { en: 'Here you are!', cn: '给你！' },
  { en: 'Be careful!', cn: '小心！' },
  { en: 'Do not worry!', cn: '别担心！' },
  { en: 'I am a big kid now!', cn: '我是大孩子了！' },
  { en: 'Let us go outside!', cn: '我们出去玩吧！' },
  { en: 'I want to learn more!', cn: '我想学更多！' }
];

/* ==================== 数据：英语单词 ==================== */
const ENGLISH_WORDS = [
  { en: 'apple', cn: '苹果', emoji: '🍎' },
  { en: 'banana', cn: '香蕉', emoji: '🍌' },
  { en: 'orange', cn: '橙子', emoji: '🍊' },
  { en: 'grape', cn: '葡萄', emoji: '🍇' },
  { en: 'water', cn: '水', emoji: '💧' },
  { en: 'milk', cn: '牛奶', emoji: '🥛' },
  { en: 'bread', cn: '面包', emoji: '🍞' },
  { en: 'cake', cn: '蛋糕', emoji: '🎂' },
  { en: 'egg', cn: '鸡蛋', emoji: '🥚' },
  { en: 'cat', cn: '猫', emoji: '🐱' },
  { en: 'dog', cn: '狗', emoji: '🐶' },
  { en: 'bird', cn: '鸟', emoji: '🐦' },
  { en: 'fish', cn: '鱼', emoji: '🐟' },
  { en: 'rabbit', cn: '兔子', emoji: '🐰' },
  { en: 'bear', cn: '熊', emoji: '🐻' },
  { en: 'pig', cn: '猪', emoji: '🐷' },
  { en: 'cow', cn: '牛', emoji: '🐮' },
  { en: 'duck', cn: '鸭子', emoji: '🦆' },
  { en: 'sun', cn: '太阳', emoji: '☀️' },
  { en: 'moon', cn: '月亮', emoji: '🌙' },
  { en: 'star', cn: '星星', emoji: '⭐' },
  { en: 'cloud', cn: '云', emoji: '☁️' },
  { en: 'rain', cn: '雨', emoji: '🌧️' },
  { en: 'snow', cn: '雪', emoji: '❄️' },
  { en: 'tree', cn: '树', emoji: '🌳' },
  { en: 'flower', cn: '花', emoji: '🌸' },
  { en: 'grass', cn: '草', emoji: '🌱' },
  { en: 'book', cn: '书', emoji: '📖' },
  { en: 'pen', cn: '笔', emoji: '🖊️' },
  { en: 'ball', cn: '球', emoji: '⚽' },
  { en: 'car', cn: '汽车', emoji: '🚗' },
  { en: 'bus', cn: '公交车', emoji: '🚌' },
  { en: 'bike', cn: '自行车', emoji: '🚲' },
  { en: 'train', cn: '火车', emoji: '🚂' },
  { en: 'plane', cn: '飞机', emoji: '✈️' },
  { en: 'boat', cn: '船', emoji: '⛵' },
  { en: 'house', cn: '房子', emoji: '🏠' },
  { en: 'school', cn: '学校', emoji: '🏫' },
  { en: 'chair', cn: '椅子', emoji: '🪑' },
  { en: 'table', cn: '桌子', emoji: '🪑' },
  { en: 'bed', cn: '床', emoji: '🛏️' },
  { en: 'clock', cn: '时钟', emoji: '🕐' },
  { en: 'shirt', cn: '衬衫', emoji: '👕' },
  { en: 'shoe', cn: '鞋子', emoji: '👟' },
  { en: 'hat', cn: '帽子', emoji: '🎩' },
  { en: 'cup', cn: '杯子', emoji: '🥤' },
  { en: 'hand', cn: '手', emoji: '✋' },
  { en: 'eye', cn: '眼睛', emoji: '👁️' },
  { en: 'ear', cn: '耳朵', emoji: '👂' },
  { en: 'nose', cn: '鼻子', emoji: '👃' },
  { en: 'mouth', cn: '嘴巴', emoji: '👄' },
  { en: 'head', cn: '头', emoji: '🧑' },
  { en: 'foot', cn: '脚', emoji: '🦶' },
  { en: 'red', cn: '红色', emoji: '🔴' },
  { en: 'blue', cn: '蓝色', emoji: '🔵' },
  { en: 'yellow', cn: '黄色', emoji: '🟡' },
  { en: 'green', cn: '绿色', emoji: '🟢' },
  { en: 'one', cn: '一', emoji: '1️⃣' },
  { en: 'two', cn: '二', emoji: '2️⃣' },
  { en: 'three', cn: '三', emoji: '3️⃣' },
  { en: 'four', cn: '四', emoji: '4️⃣' },
  { en: 'five', cn: '五', emoji: '5️⃣' }
];

/* ==================== 数据：绘本推荐 ==================== */
const PICTURE_BOOKS = [
  { title: '好饿的毛毛虫', emoji: '🐛', desc: '一只毛毛虫从星期一吃到星期日，最后变成美丽的蝴蝶。认识星期、食物和数量。' },
  { title: '猜猜我有多爱你', emoji: '🐰', desc: '小兔子和大兔子比谁更爱对方，温馨的亲子故事，感受爱的温暖。' },
  { title: '爷爷一定有办法', emoji: '🧥', desc: '爷爷把旧毯子变成外套、背心、领带……教会孩子物尽其用的智慧。' },
  { title: '逃家小兔', emoji: '🐇', desc: '小兔子想逃跑，兔妈妈说无论你变成什么我都会找到你。母爱无处不在。' },
  { title: '活了一百万次的猫', emoji: '🐱', desc: '一只猫活了一百万次，直到它遇到了自己真正爱的猫，才懂得了生命的意义。' },
  { title: '花婆婆', emoji: '🌸', desc: '花婆婆一生做了三件事，其中一件是让世界变得更美丽。学会给世界带来美好。' },
  { title: '勇气', emoji: '💪', desc: '勇气有很多种，有的令人敬佩，有的平平常常。教孩子认识勇气、拥有勇气。' },
  { title: '蚂蚁和西瓜', emoji: '🍉', desc: '一群蚂蚁合作搬运大西瓜，团结力量大。培养团队合作意识。' },
  { title: '月亮的味道', emoji: '🌙', desc: '动物们叠罗汉想要摸到月亮，尝尝月亮的味道。关于合作与梦想的故事。' },
  { title: '鳄鱼怕怕牙医怕怕', emoji: '🐊', desc: '鳄鱼和牙医互相害怕，但都得勇敢面对。适合怕看牙的小朋友。' },
  { title: '是谁嗯嗯在我的头上', emoji: '🦔', desc: '小鼹鼠头顶上被嗯嗯了，它到处找是谁干的。好笑又长知识的科普绘本。' },
  { title: '大卫不可以', emoji: '👦', desc: '调皮的大卫总是被妈妈说不可以，但妈妈永远爱他。关于规则与爱。' },
  { title: '我爸爸', emoji: '👨', desc: '用孩子的口吻描绘爸爸的伟大，爸爸像太阳一样温暖。感恩父爱。' },
  { title: '我妈妈', emoji: '👩', desc: '妈妈是了不起的厨师、神奇的画家……用爱描绘妈妈的伟大。感恩母爱。' },
  { title: '彩虹色的花', emoji: '🌈', desc: '一朵彩虹色的花把自己的花瓣送给需要帮助的小动物。学会分享与善良。' }
];

/* ==================== 数据：思维练习题 ==================== */
const THINKING_QUESTIONS = [
  { q: '小明有5个苹果，吃了2个，还剩几个？', options: ['2个','3个','4个'], answer: 1 },
  { q: '一列火车有5节车厢，每节坐4人，一共坐了多少人？', options: ['9人','20人','25人'], answer: 1 },
  { q: '小红排队做操，她前面有3人，后面有5人，这排一共有多少人？', options: ['8人','9人','7人'], answer: 1 },
  { q: '一个星期有几天？', options: ['5天','7天','10天'], answer: 1 },
  { q: '哪个不是水果？', options: ['苹果','胡萝卜','香蕉'], answer: 1 },
  { q: '2，4，6，8，下一个数字是几？', options: ['9','10','12'], answer: 1 },
  { q: '一只手有几个手指？', options: ['4个','5个','10个'], answer: 1 },
  { q: '哪个动物会飞？', options: ['鱼','小鸟','青蛙'], answer: 1 },
  { q: '3个十和5个一合起来是几？', options: ['35','53','8'], answer: 0 },
  { q: '比10大比15小的数有几个？', options: ['3个','4个','5个'], answer: 1 },
  { q: '正方形有几条边？', options: ['3条','4条','5条'], answer: 1 },
  { q: '小明比小红高，小红比小华高，谁最矮？', options: ['小明','小红','小华'], answer: 2 },
  { q: '时钟上最短的针是什么针？', options: ['时针','分针','秒针'], answer: 0 },
  { q: '一年有几个季节？', options: ['2个','4个','12个'], answer: 1 },
  { q: '5元买了一个3元的面包，找回多少钱？', options: ['1元','2元','3元'], answer: 1 },
  { q: '哪个数最大？', options: ['99','100','89'], answer: 1 },
  { q: '三角形有几条边？', options: ['2条','3条','4条'], answer: 1 },
  { q: '小猫前面有2只动物，后面有3只，一共有几只？', options: ['5只','6只','7只'], answer: 1 },
  { q: '一双袜子有几只？', options: ['1只','2只','4只'], answer: 1 },
  { q: '1个十和0个一是几？', options: ['1','10','0'], answer: 1 }
];

/* ==================== 数据：拼音对对碰 ==================== */
const PINYIN_PAIRS = [
  // Level 1 - 简单单字
  [{char:'大',py:'dà'},{char:'小',py:'xiǎo'},{char:'多',py:'duō'},{char:'少',py:'shǎo'}],
  // Level 2
  [{char:'上',py:'shàng'},{char:'下',py:'xià'},{char:'左',py:'zuǒ'},{char:'右',py:'yòu'}],
  // Level 3
  [{char:'山',py:'shān'},{char:'水',py:'shuǐ'},{char:'火',py:'huǒ'},{char:'木',py:'mù'}],
  // Level 4
  [{char:'花',py:'huā'},{char:'草',py:'cǎo'},{char:'树',py:'shù'},{char:'叶',py:'yè'}],
  // Level 5
  [{char:'春',py:'chūn'},{char:'夏',py:'xià'},{char:'秋',py:'qiū'},{char:'冬',py:'dōng'}],
  // Level 6
  [{char:'天',py:'tiān'},{char:'地',py:'dì'},{char:'日',py:'rì'},{char:'月',py:'yuè'}],
  // Level 7
  [{char:'风',py:'fēng'},{char:'雨',py:'yǔ'},{char:'云',py:'yún'},{char:'雪',py:'xuě'}],
  // Level 8
  [{char:'马',py:'mǎ'},{char:'牛',py:'niú'},{char:'羊',py:'yáng'},{char:'鸟',py:'niǎo'}]
];

/* ==================== 数据：锻炼项目 ==================== */
const EXERCISES = [
  { icon: '🤸', name: '广播体操', desc: '跟着音乐做完整广播体操', duration: '10分钟', video: '广播体操 零基础教学' },
  { icon: '🦵', name: '开合跳', desc: '双手双脚同时开合，锻炼全身', duration: '3分钟', count: '50个' },
  { icon: '🏃', name: '原地跑步', desc: '原地高抬腿跑，摆臂有力', duration: '5分钟', count: '200步' },
  { icon: '🧘', name: '拉伸运动', desc: '全身拉伸，保持柔韧性', duration: '5分钟', tip: '每个动作保持15秒' },
  { icon: '🤾', name: '拍球练习', desc: '单手或双手交替拍球', duration: '10分钟', count: '100个' },
  { icon: '🦶', name: '跳绳', desc: '双脚跳绳，注意节奏', duration: '10分钟', count: '100个' },
  { icon: '🚴', name: '户外骑车', desc: '骑自行车或滑板车', duration: '15分钟', tip: '戴好头盔' },
  { icon: '⚽', name: '踢球游戏', desc: '和小伙伴一起踢足球', duration: '15分钟', tip: '注意安全' },
  { icon: '🤝', name: '亲子瑜伽', desc: '和爸爸妈妈一起做瑜伽', duration: '10分钟', tip: '配合呼吸' },
  { icon: '🐰', name: '兔子跳', desc: '蹲下双手放头上学兔子跳', duration: '3分钟', count: '30个' }
];

/* ==================== 工具函数 ==================== */
function todayStr() { return new Date().toISOString().split('T')[0]; }

function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

function dailyPick(arr, count) {
  const seed = dayOfYear();
  const shuffled = [...arr];
  // Use seeded shuffle
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function dailyIndex(arr) {
  return dayOfYear() % arr.length;
}

function formatDate() {
  const d = new Date();
  const weekDays = ['周日','周一','周二','周三','周四','周五','周六'];
  return `${d.getMonth()+1}月${d.getDate()}日 ${weekDays[d.getDay()]}`;
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 2200);
}

function celebrate() {
  const el = document.getElementById('celebration');
  el.innerHTML = '';
  el.classList.add('show');
  const colors = ['#FF6B9D','#4ECDC4','#FFE66D','#A78BFA','#51CF66','#FFA94D','#4DABF7'];
  const emojis = ['⭐','🌟','✨','🎉','🎊','💖','🏆'];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + '%';
    c.style.top = '-20px';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDelay = Math.random() * 1 + 's';
    c.style.animationDuration = (2 + Math.random() * 2) + 's';
    if (Math.random() > 0.5) {
      c.style.background = 'transparent';
      c.style.fontSize = '1.5rem';
      c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    }
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    el.appendChild(c);
  }
  setTimeout(() => { el.classList.remove('show'); el.innerHTML = ''; }, 4000);
}

/* ==================== LocalStorage ==================== */
const STORE_KEY = 'tianbao_workstation';

function loadData() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}

function saveData(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function getDefaultData() {
  return {
    points: 0,
    checkins: {},
    rewards: [
      { id: 'r1', name: '小零食', icon: '🍬', points: 10, claimed: false },
      { id: 'r2', name: '小玩具', icon: '🧸', points: 20, claimed: false },
      { id: 'r3', name: '儿童乐园一次', icon: '🎡', points: 30, claimed: false }
    ],
    tasks: [
      { id: 't1', name: '背古诗', icon: '📜', desc: '每日背诵一首古诗' },
      { id: 't2', name: '成语故事', icon: '📚', desc: '学习一个成语故事' },
      { id: 't3', name: '认10个字', icon: '✏️', desc: '每天认识10个新字' },
      { id: 't4', name: '控笔训练', icon: '✍️', desc: '跟练视频+写字' },
      { id: 't5', name: '拼音练习', icon: '🀄', desc: '拼音拼读及练习题' },
      { id: 't6', name: '绘本阅读', icon: '📖', desc: '每日绘本故事阅读' },
      { id: 't7', name: '数学计算', icon: '🔢', desc: '40以内计算题练习' },
      { id: 't8', name: '思维练习', icon: '🧩', desc: '完成思维练习题' },
      { id: 't9', name: '英语学习', icon: '🔤', desc: '5条英语短句+单词' },
      { id: 't10', name: '体育锻炼', icon: '⚽', desc: '每天一小时锻炼' },
      { id: 't11', name: '闯关游戏', icon: '🎮', desc: '完成一个游戏闯关' }
    ],
    lastDate: ''
  };
}

let appData = loadData() || getDefaultData();

// Daily reset check
function checkDailyReset() {
  const today = todayStr();
  if (appData.lastDate !== today) {
    appData.checkins = {};
    appData.lastDate = today;
    saveData(appData);
  }
}

/* ==================== 导航 ==================== */
function goTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  document.querySelector(`.nav-item[data-page="${pageId}"]`).classList.add('active');
  // Render content
  if (pageId === 'home') renderHome();
  else if (pageId === 'chinese') renderChinese();
  else if (pageId === 'math') renderMath();
  else if (pageId === 'english') renderEnglish();
  else if (pageId === 'exercise') renderExercise();
  else if (pageId === 'games') renderGames();
  else if (pageId === 'rewards') renderRewards();
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => goTo(item.dataset.page));
});

/* ==================== 首页渲染 ==================== */
function renderHome() {
  document.getElementById('todayDate').textContent = formatDate();
  const hour = new Date().getHours();
  let greeting = '今天也要加油哦~';
  if (hour < 9) greeting = '早上好！元气满满的一天开始啦~';
  else if (hour < 12) greeting = '上午好！认真学习，你最棒！';
  else if (hour < 14) greeting = '中午好！吃饱了才有力气学习~';
  else if (hour < 18) greeting = '下午好！继续加油，快完成啦！';
  else greeting = '晚上好！今天辛苦啦~';
  document.getElementById('greetingText').textContent = greeting;

  // Progress
  const today = todayStr();
  const total = appData.tasks.length;
  const done = appData.tasks.filter(t => appData.checkins[`${today}_${t.id}`]).length;
  const progress = total > 0 ? Math.round(done / total * 100) : 0;

  const progHtml = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <span style="font-size:0.85rem;font-weight:600">已完成 ${done} / ${total} 项</span>
      <span style="font-size:0.85rem;font-weight:700;color:var(--c-primary)">${progress}%</span>
    </div>
    <div class="progress-bar"><div class="progress-bar-fill" style="width:${progress}%;background:linear-gradient(90deg,#FF6B9D,#C44BE0)"></div></div>
    ${done === total && total > 0 ? '<div style="text-align:center;margin-top:10px;font-size:0.8rem;color:var(--c-green);font-weight:700">🎉 今日全部完成！太棒了！</div>' : ''}
  `;
  document.getElementById('homeProgress').innerHTML = progHtml;

  // Points
  document.getElementById('homePoints').textContent = appData.points;
  const nextReward = appData.rewards
    .filter(r => !r.claimed && r.points > appData.points)
    .sort((a, b) => a.points - b.points)[0];
  if (nextReward) {
    const pct = Math.min(100, Math.round(appData.points / nextReward.points * 100));
    document.getElementById('homeProgressFill').style.width = pct + '%';
    document.getElementById('homeNextReward').textContent = `${nextReward.icon} ${nextReward.name} (${appData.points}/${nextReward.points}分)`;
  } else {
    document.getElementById('homeProgressFill').style.width = '100%';
    document.getElementById('homeNextReward').textContent = '所有奖励已领取！';
  }
}

/* ==================== 语文模块 ==================== */
function renderChinese() {
  document.getElementById('chineseDate').textContent = formatDate();
  const idx = dailyIndex(POEMS);
  const poem = POEMS[idx];
  const idiom = IDIOMS[dailyIndex(IDIOMS)];
  const chars = dailyPick(CHARACTERS, 10);
  const book = PICTURE_BOOKS[dailyIndex(PICTURE_BOOKS)];

  const html = `
    <!-- 古诗 -->
    <div class="card">
      <div class="card-title"><span class="emoji">📜</span>今日古诗背诵</div>
      <div class="poem-box">
        <div class="poem-title">${poem.title}</div>
        <div class="poem-author">${poem.author}</div>
        <div class="poem-lines">${poem.lines.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="poem-actions">
        <button class="btn btn-primary btn-sm" onclick="speakPoem(${idx})">🔊 听朗读</button>
        <button class="btn btn-success btn-sm" onclick="quickCheckin('t1')">✅ 打卡</button>
      </div>
    </div>

    <!-- 成语故事 -->
    <div class="card">
      <div class="card-title"><span class="emoji">📚</span>成语故事</div>
      <div class="idiom-box">
        <div class="idiom-name">${idiom.name}</div>
        <div class="idiom-pinyin">${idiom.pinyin}</div>
        <div class="idiom-meaning"><strong>释义：</strong>${idiom.meaning}</div>
        <div class="idiom-story">${idiom.story}</div>
      </div>
      <div class="poem-actions">
        <button class="btn btn-primary btn-sm" onclick="speakText('${idiom.name}。${idiom.meaning}')">🔊 听故事</button>
        <button class="btn btn-success btn-sm" onclick="quickCheckin('t2')">✅ 打卡</button>
      </div>
    </div>

    <!-- 每日识字 -->
    <div class="card">
      <div class="card-title"><span class="emoji">✏️</span>每日新认10个字</div>
      <div class="char-grid">
        ${chars.map(c => `
          <div class="char-item" onclick="speakText('${c.char}')">
            <div class="char">${c.char}</div>
            <div class="pinyin">${c.pinyin}</div>
            <div class="meaning">${c.meaning}</div>
          </div>
        `).join('')}
      </div>
      <div class="poem-actions">
        <button class="btn btn-primary btn-sm" onclick="speakChars(${JSON.stringify(chars.map(c=>c.char)).replace(/"/g,'&quot;')})">🔊 听读音</button>
        <button class="btn btn-success btn-sm" onclick="quickCheckin('t3')">✅ 打卡</button>
      </div>
    </div>

    <!-- 控笔训练 -->
    <div class="card">
      <div class="card-title"><span class="emoji">✍️</span>控笔训练</div>
      <div class="pen-train-item">
        <div class="pen-icon">📱</div>
        <div class="pen-info">
          <div class="pen-name">抖音控笔训练跟练</div>
          <div class="pen-link">在抖音搜索"控笔训练 幼小衔接"</div>
        </div>
        <button class="pen-go" onclick="window.open('https://www.douyin.com/search/控笔训练%20幼小衔接%20跟练','_blank')">去练习</button>
      </div>
      <div class="pen-train-item">
        <div class="pen-icon">✏️</div>
        <div class="pen-info">
          <div class="pen-name">写字练习</div>
          <div class="pen-link">在田字格中练习今天学的10个字</div>
        </div>
        <button class="pen-go" onclick="quickCheckin('t4')">✅ 完成</button>
      </div>
    </div>

    <!-- 拼音拼读 -->
    <div class="card">
      <div class="card-title"><span class="emoji">🀄</span>拼音拼读练习</div>
      <div id="pinyinExerciseArea"></div>
    </div>

    <!-- 绘本阅读 -->
    <div class="card">
      <div class="card-title"><span class="emoji">📖</span>今日绘本推荐</div>
      <div class="book-item">
        <div class="book-cover">${book.emoji}</div>
        <div class="book-info">
          <div class="book-title">${book.title}</div>
          <div class="book-desc">${book.desc}</div>
        </div>
      </div>
      <div class="poem-actions">
        <button class="btn btn-success btn-sm" onclick="quickCheckin('t6')">✅ 阅读打卡</button>
      </div>
    </div>
  `;
  document.getElementById('chineseContent').innerHTML = html;
  renderPinyinExercise();
}

function renderPinyinExercise() {
  const area = document.getElementById('pinyinExerciseArea');
  if (!area) return;
  // Generate a pinyin exercise
  const types = [
    { type: 'initial', q: '哪个是"b"的读音？', options: ['p','b','d'], answer: 1 },
    { type: 'initial', q: '哪个是"p"的读音？', options: ['b','p','q'], answer: 1 },
    { type: 'initial', q: '哪个是"m"的读音？', options: ['n','m','f'], answer: 1 },
    { type: 'final', q: '"ba"的声母是什么？', options: ['b','a','p'], answer: 0 },
    { type: 'final', q: '"ma"的韵母是什么？', options: ['m','a','o'], answer: 1 },
    { type: 'final', q: '"guo"有几个字母？', options: ['2个','3个','4个'], answer: 1 },
    { type: 'tone', q: '"mā"是第几声？', options: ['一声','二声','三声'], answer: 0 },
    { type: 'tone', q: '"má"是第几声？', options: ['一声','二声','四声'], answer: 1 },
    { type: 'tone', q: '"mǎ"是第几声？', options: ['二声','三声','四声'], answer: 1 },
    { type: 'tone', q: '"mà"是第几声？', options: ['一声','三声','四声'], answer: 2 },
    { type: 'combine', q: '"b"+"a"拼在一起是？', options: ['pa','ba','da'], answer: 1 },
    { type: 'combine', q: '"m"+"a"拼在一起是？', options: ['ma','na','ba'], answer: 0 },
    { type: 'combine', q: '"p"+"o"拼在一起是？', options: ['bo','po','mo'], answer: 1 },
    { type: 'combine', q: '"f"+"u"拼在一起是？', options: ['fu','tu','du'], answer: 0 },
    { type: 'word', q: '"dà"是哪个字的读音？', options: ['大','小','多'], answer: 0 },
    { type: 'word', q: '"xiǎo"是哪个字的读音？', options: ['大','小','多'], answer: 1 },
    { type: 'word', q: '"shān"是哪个字的读音？', options: ['水','火','山'], answer: 2 },
    { type: 'word', q: '"huǒ"是哪个字的读音？', options: ['火','木','水'], answer: 0 },
    { type: 'word', q: '"mù"是哪个字的读音？', options: ['木','土','日'], answer: 0 },
    { type: 'word', q: '"shuǐ"是哪个字的读音？', options: ['火','水','山'], answer: 1 }
  ];
  const ex = types[dailyIndex(types)];
  area.innerHTML = `
    <div class="pinyin-exercise">
      <div class="py-question">${ex.q}</div>
      <div class="py-hint">选一选，拼一拼~</div>
      <div class="py-options">
        ${ex.options.map((opt, i) => `<div class="py-option" onclick="checkPinyin(this, ${i===ex.answer})">${opt}</div>`).join('')}
      </div>
    </div>
    <div class="poem-actions" style="margin-top:12px">
      <button class="btn btn-primary btn-sm" onclick="renderPinyinExercise()">🔄 换一题</button>
      <button class="btn btn-success btn-sm" onclick="quickCheckin('t5')">✅ 打卡</button>
    </div>
  `;
}

function checkPinyin(el, correct) {
  const siblings = el.parentElement.querySelectorAll('.py-option');
  siblings.forEach(s => { s.classList.remove('correct','wrong'); });
  if (correct) {
    el.classList.add('correct');
    showToast('回答正确！太棒了！🌟');
  } else {
    el.classList.add('wrong');
    siblings.forEach(s => {
      if (!s.classList.contains('wrong')) {
        // Mark correct answer after wrong attempt
      }
    });
    showToast('再想想~加油！');
  }
}

/* ==================== 数学模块 ==================== */
let mathState = { correct: 0, wrong: 0, total: 0, currentProblem: null, wrongList: [] };

function generateMathProblem() {
  const methods = ['normal', 'poshi', 'coushi'];
  const method = methods[Math.floor(Math.random() * methods.length)];
  let a, b, result, display, methodTag = '';

  if (method === 'poshi') {
    // 破十法: 13 - 8 = (10 - 8) + 3 = 5
    a = 11 + Math.floor(Math.random() * 29); // 11-39
    b = 2 + Math.floor(Math.random() * 8);   // 2-9
    if (b >= a % 10 || a % 10 === 0) { a = a + (10 - a % 10) + 2; }
    result = a - b;
    const tenPart = 10;
    const remainder = a - 10;
    methodTag = `<span class="method-tag poshi">破十法</span>`;
    display = `<div style="font-size:0.75rem;color:var(--c-text-light);margin-bottom:8px">先用10减去${b}，再加上${a-10}</div>`;
  } else if (method === 'coushi') {
    // 凑十法: 8 + 7 = (8+2) + 5 = 15
    a = 2 + Math.floor(Math.random() * 8); // 2-9
    b = 2 + Math.floor(Math.random() * 8); // 2-9
    if (a + b > 18) { b = 18 - a; }
    result = a + b;
    const need = 10 - a;
    methodTag = `<span class="method-tag coushi">凑十法</span>`;
    display = `<div style="font-size:0.75rem;color:var(--c-text-light);margin-bottom:8px">${a}需要${need}凑成10，${b}分成${need}和${b-need}</div>`;
  } else {
    // 普通计算 40以内
    const isAdd = Math.random() > 0.4;
    if (isAdd) {
      a = 1 + Math.floor(Math.random() * 20);
      b = 1 + Math.floor(Math.random() * (40 - a));
      result = a + b;
      display = '';
    } else {
      a = 11 + Math.floor(Math.random() * 29);
      b = 1 + Math.floor(Math.random() * (a - 1));
      result = a - b;
      display = '';
    }
    methodTag = `<span class="method-tag normal">计算</span>`;
  }

  const op = method === 'poshi' || (method === 'normal' && result < a) ? '-' : '+';
  mathState.currentProblem = { a, b, op, result, method };
  const problemHtml = `
    ${methodTag}
    ${display}
    <div class="problem-text">${a} ${op} ${b} = ?</div>
    <input type="number" class="math-input" id="mathAnswer" placeholder="?" inputmode="numeric"
      onkeyup="if(event.key==='Enter')checkMathAnswer()">
    <div class="math-actions">
      <button class="btn btn-primary btn-sm" onclick="checkMathAnswer()">提交答案</button>
      <button class="btn btn-secondary btn-sm" onclick="generateMathProblem()">⏭ 换一题</button>
    </div>
  `;
  document.getElementById('mathProblemArea').innerHTML = problemHtml;
  setTimeout(() => { const inp = document.getElementById('mathAnswer'); if (inp) inp.focus(); }, 100);
}

function checkMathAnswer() {
  const inp = document.getElementById('mathAnswer');
  if (!inp) return;
  const val = parseInt(inp.value);
  if (isNaN(val)) { showToast('请输入答案~'); return; }
  mathState.total++;
  const p = mathState.currentProblem;
  if (val === p.result) {
    mathState.correct++;
    showToast('答对了！太棒了！🎉');
    inp.style.borderColor = 'var(--c-green)';
    inp.style.background = '#D4F4DD';
    setTimeout(() => generateMathProblem(), 1200);
  } else {
    mathState.wrong++;
    mathState.wrongList.unshift({ q: `${p.a} ${p.op} ${p.b} = ?`, answer: p.result, userAnswer: val, method: p.method });
    if (mathState.wrongList.length > 50) mathState.wrongList.pop();
    inp.style.borderColor = '#FF6B6B';
    inp.style.background = '#FFE0E0';
    showToast(`答案是 ${p.result}，加油！💪`);
    setTimeout(() => generateMathProblem(), 1500);
  }
  updateMathStats();
}

function updateMathStats() {
  const el = document.getElementById('mathStats');
  if (el) {
    el.innerHTML = `
      <div class="stat-pill total"><div class="stat-num">${mathState.total}</div><div class="stat-label">总题数</div></div>
      <div class="stat-pill correct"><div class="stat-num">${mathState.correct}</div><div class="stat-label">答对</div></div>
      <div class="stat-pill wrong"><div class="stat-num">${mathState.wrong}</div><div class="stat-label">答错</div></div>
    `;
  }
}

let thinkingState = { currentIdx: 0, answered: false };

function renderThinkingQuestion() {
  const qs = dailyPick(THINKING_QUESTIONS, 5);
  thinkingState.questions = qs;
  thinkingState.currentIdx = 0;
  thinkingState.answered = false;
  showThinkingQuestion();
}

function showThinkingQuestion() {
  const area = document.getElementById('thinkingArea');
  if (!area) return;
  const q = thinkingState.questions[thinkingState.currentIdx];
  const idx = thinkingState.currentIdx;
  area.innerHTML = `
    <div class="thinking-q">
      <div class="tq-num">第 ${idx + 1} / ${thinkingState.questions.length} 题</div>
      <div class="tq-text">${q.q}</div>
      <div class="tq-options">
        ${q.options.map((opt, i) => `<div class="tq-option" onclick="checkThinking(${i}, ${q.answer})">${opt}</div>`).join('')}
      </div>
    </div>
    <div style="display:flex;gap:8px;justify-content:center">
      ${idx > 0 ? '<button class="btn btn-secondary btn-sm" onclick="prevThinking()">⬅ 上一题</button>' : ''}
      <button class="btn btn-primary btn-sm" onclick="nextThinking()">下一题 ➡</button>
      <button class="btn btn-success btn-sm" onclick="quickCheckin('t8')">✅ 打卡</button>
    </div>
  `;
  thinkingState.answered = false;
}

function checkThinking(selected, correct) {
  if (thinkingState.answered) return;
  thinkingState.answered = true;
  const opts = document.querySelectorAll('#thinkingArea .tq-option');
  opts.forEach((o, i) => {
    if (i === correct) o.classList.add('correct');
    if (i === selected && i !== correct) o.classList.add('wrong');
  });
  if (selected === correct) showToast('答对了！真聪明！🌟');
  else showToast('没关系，再加油！');
}

function prevThinking() {
  if (thinkingState.currentIdx > 0) {
    thinkingState.currentIdx--;
    showThinkingQuestion();
  }
}

function nextThinking() {
  if (thinkingState.currentIdx < thinkingState.questions.length - 1) {
    thinkingState.currentIdx++;
    showThinkingQuestion();
  } else {
    showToast('全部完成啦！太棒了！🎉');
    renderThinkingQuestion();
  }
}

function renderMath() {
  document.getElementById('mathDate').textContent = formatDate();
  const html = `
    <!-- 计算题 -->
    <div class="card">
      <div class="card-title"><span class="emoji">🔢</span>计算练习（40以内）</div>
      <div class="math-stats" id="mathStats"></div>
      <div class="math-problem" id="mathProblemArea"></div>
      <div style="font-size:0.7rem;color:var(--c-text-light);text-align:center;margin-top:4px">
        💡 包含破十法、凑十法等计算方法
      </div>
      <div class="poem-actions">
        <button class="btn btn-success btn-sm" onclick="quickCheckin('t7')">✅ 打卡</button>
      </div>
    </div>

    <!-- 数感星球 -->
    <div class="card">
      <div class="card-title"><span class="emoji">🪐</span>数感星球</div>
      <div class="number-sense-grid">
        <div class="ns-card" onclick="showToast('🔢 数数游戏：从1数到100，再倒着数回来！')"><div class="ns-emoji">🔢</div><div class="ns-name">数数游戏</div></div>
        <div class="ns-card" onclick="showToast('🎲 比大小：掷两个骰子，比谁的大！')"><div class="ns-emoji">🎲</div><div class="ns-name">比大小</div></div>
        <div class="ns-card" onclick="showToast('🔟 凑十歌：1+9=10, 2+8=10, 3+7=10...')"><div class="ns-emoji">🔟</div><div class="ns-name">凑十歌</div></div>
        <div class="ns-card" onclick="showToast('📅 看日历：今天是几月几日星期几？')"><div class="ns-emoji">📅</div><div class="ns-name">认日历</div></div>
        <div class="ns-card" onclick="showToast('🕐 认时钟：现在几点几分？')"><div class="ns-emoji">🕐</div><div class="ns-name">认时钟</div></div>
        <div class="ns-card" onclick="showToast('🪙 数硬币：数一数有几元几角？')"><div class="ns-emoji">🪙</div><div class="ns-name">认钱币</div></div>
      </div>
    </div>

    <!-- 思维练习 -->
    <div class="card">
      <div class="card-title"><span class="emoji">🧩</span>思维练习题</div>
      <div id="thinkingArea"></div>
    </div>

    <!-- 错题本 -->
    <div class="card">
      <div class="card-title"><span class="emoji">📝</span>错题复习本</div>
      <div id="wrongListArea"></div>
    </div>
  `;
  document.getElementById('mathContent').innerHTML = html;
  updateMathStats();
  generateMathProblem();
  renderThinkingQuestion();
  renderWrongList();
}

function renderWrongList() {
  const area = document.getElementById('wrongListArea');
  if (!area) return;
  if (mathState.wrongList.length === 0) {
    area.innerHTML = `<div class="empty-state"><div class="empty-icon">🎉</div><div class="empty-text">还没有错题，继续加油！</div></div>`;
    return;
  }
  area.innerHTML = mathState.wrongList.map(w => `
    <div class="wrong-item">
      <div class="wi-q">${w.q}</div>
      <div class="wi-answer">✅ 正确答案：<strong>${w.answer}</strong>（你的答案：${w.userAnswer}）</div>
      <span class="wi-tag method-tag ${w.method === 'poshi' ? 'poshi' : w.method === 'coushi' ? 'coushi' : 'normal'}">${w.method === 'poshi' ? '破十法' : w.method === 'coushi' ? '凑十法' : '计算'}</span>
    </div>
  `).join('') + `<button class="btn btn-secondary btn-sm" style="width:100%;margin-top:8px" onclick="mathState.wrongList=[];renderWrongList()">🗑 清空错题本</button>`;
}

/* ==================== 英语模块 ==================== */
function renderEnglish() {
  document.getElementById('englishDate').textContent = formatDate();
  const phrases = dailyPick(ENGLISH_PHRASES, 5);
  const words = dailyPick(ENGLISH_WORDS, 6);

  const html = `
    <!-- 英语短句 -->
    <div class="card">
      <div class="card-title"><span class="emoji">💬</span>今日5句亲子英语</div>
      ${phrases.map((p, i) => `
        <div class="english-phrase">
          <div class="phrase-num">${i + 1}</div>
          <div class="phrase-content">
            <div class="en">${p.en}</div>
            <div class="cn">${p.cn}</div>
          </div>
          <button class="speak-btn" onclick="speakEN('${p.en}')">🔊</button>
        </div>
      `).join('')}
      <div class="poem-actions">
        <button class="btn btn-success btn-sm" onclick="quickCheckin('t9')">✅ 打卡</button>
      </div>
    </div>

    <!-- 每日单词 -->
    <div class="card">
      <div class="card-title"><span class="emoji">🍎</span>今日单词学习</div>
      <div class="word-grid">
        ${words.map(w => `
          <div class="word-card" onclick="speakEN('${w.en}')">
            <div class="word-emoji">${w.emoji}</div>
            <div class="word-en">${w.en}</div>
            <div class="word-cn">${w.cn}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  document.getElementById('englishContent').innerHTML = html;
}

/* ==================== 锻炼模块 ==================== */
function renderExercise() {
  document.getElementById('exerciseDate').textContent = formatDate();
  const picks = dailyPick(EXERCISES, 5);
  const html = `
    <div class="card" style="background:linear-gradient(135deg,#51CF66,#37B24D);color:#fff">
      <div style="font-size:1.1rem;font-weight:800;margin-bottom:4px">💪 每天运动1小时</div>
      <div style="font-size:0.8rem;opacity:0.9">选择下面的运动项目，合计约60分钟</div>
    </div>
    <div class="card">
      <div class="card-title"><span class="emoji">📋</span>今日运动计划</div>
      ${picks.map(e => `
        <div class="exercise-item">
          <div class="ex-icon">${e.icon}</div>
          <div class="ex-info">
            <div class="ex-name">${e.name}</div>
            <div class="ex-desc">${e.desc}${e.count ? ' · ' + e.count : ''}${e.tip ? ' · ' + e.tip : ''}</div>
          </div>
          <div class="ex-duration">${e.duration}</div>
        </div>
      `).join('')}
      <div class="poem-actions">
        <button class="btn btn-success btn-sm" onclick="quickCheckin('t10')">✅ 运动打卡</button>
      </div>
    </div>
  `;
  document.getElementById('exerciseContent').innerHTML = html;
}

/* ==================== 游戏模块 ==================== */
function renderGames() {
  renderPinyinGame();
  renderGooseGame();
}

/* --- 拼音对对碰游戏 --- */
let pinyinGameState = { level: 0, score: 0, selectedChar: null, selectedPy: null, matched: 0 };

function renderPinyinGame() {
  const container = document.getElementById('pinyinGame');
  if (!container) return;
  if (pinyinGameState.level >= PINYIN_PAIRS.length) {
    container.innerHTML = `
      <div class="game-header"><div class="game-score">⭐ ${pinyinGameState.score}分</div><div class="game-level">🏆 全部通关</div></div>
      <div class="empty-state">
        <div class="empty-icon">🏆</div>
        <div class="empty-text">恭喜你！全部通关啦！<br>你是拼读小达人！</div>
      </div>
      <div class="poem-actions"><button class="btn btn-primary btn-sm" onclick="pinyinGameState={level:0,score:0,selectedChar:null,selectedPy:null,matched:0};renderPinyinGame()">🔄 重新开始</button></div>
    `;
    return;
  }
  const pairs = PINYIN_PAIRS[pinyinGameState.level];
  // Shuffle pinyin order
  const charsOrder = [...pairs];
  const pyOrder = [...pairs].sort(() => Math.random() - 0.5);

  pinyinGameState.matched = 0;
  pinyinGameState.selectedChar = null;
  pinyinGameState.selectedPy = null;

  container.innerHTML = `
    <div class="game-header">
      <div class="game-score">⭐ ${pinyinGameState.score}分</div>
      <div class="game-level">第 ${pinyinGameState.level + 1} / ${PINYIN_PAIRS.length} 关</div>
    </div>
    <div style="text-align:center;font-size:0.75rem;color:var(--c-text-light);margin-bottom:12px">点击左边的字，再点击对应的拼音~</div>
    <div class="match-area">
      <div class="match-col" id="charCol">
        ${charsOrder.map((p, i) => `<div class="match-card" data-char="${p.char}" data-idx="${i}" onclick="selectChar(this)">${p.char}</div>`).join('')}
      </div>
      <div class="match-col" id="pyCol">
        ${pyOrder.map((p, i) => `<div class="match-card" data-py="${p.py}" data-idx="${i}" onclick="selectPy(this)">${p.py}</div>`).join('')}
      </div>
    </div>
  `;
}

function selectChar(el) {
  if (el.classList.contains('matched')) return;
  document.querySelectorAll('#charCol .match-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  pinyinGameState.selectedChar = el;
  tryMatch();
}

function selectPy(el) {
  if (el.classList.contains('matched')) return;
  document.querySelectorAll('#pyCol .match-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  pinyinGameState.selectedPy = el;
  tryMatch();
}

function tryMatch() {
  if (!pinyinGameState.selectedChar || !pinyinGameState.selectedPy) return;
  const charEl = pinyinGameState.selectedChar;
  const pyEl = pinyinGameState.selectedPy;
  const char = charEl.dataset.char;
  const py = pyEl.dataset.py;
  // Find matching pair
  const pairs = PINYIN_PAIRS[pinyinGameState.level];
  const match = pairs.find(p => p.char === char && p.py === py);

  if (match) {
    charEl.classList.add('matched');
    pyEl.classList.add('matched');
    charEl.classList.remove('selected');
    pyEl.classList.remove('selected');
    pinyinGameState.score += 10;
    pinyinGameState.matched++;
    showToast('配对成功！+10分 🎉');
    pinyinGameState.selectedChar = null;
    pinyinGameState.selectedPy = null;
    if (pinyinGameState.matched === pairs.length) {
      showToast('本关全部配对成功！⭐');
      pinyinGameState.score += 20;
      setTimeout(() => {
        pinyinGameState.level++;
        renderPinyinGame();
      }, 1500);
    } else {
      updatePinyinScore();
    }
  } else {
    charEl.classList.add('wrong');
    pyEl.classList.add('wrong');
    showToast('不匹配，再试试~');
    setTimeout(() => {
      charEl.classList.remove('wrong', 'selected');
      pyEl.classList.remove('wrong', 'selected');
      pinyinGameState.selectedChar = null;
      pinyinGameState.selectedPy = null;
    }, 600);
  }
}

function updatePinyinScore() {
  const scoreEl = document.querySelector('#pinyinGame .game-score');
  if (scoreEl) scoreEl.textContent = `⭐ ${pinyinGameState.score}分`;
}

/* --- 抓大鹅游戏 --- */
let gooseGameState = { score: 0, round: 0, maxRounds: 10, currentWord: null, geese: [], caught: 0, timer: null };

function renderGooseGame() {
  const container = document.getElementById('gooseGame');
  if (!container) return;
  gooseGameState = { score: 0, round: 0, maxRounds: 10, currentWord: null, geese: [], caught: 0, timer: null };
  container.innerHTML = `
    <div class="game-header">
      <div class="game-score">⭐ ${gooseGameState.score}分</div>
      <div class="game-level">第 ${gooseGameState.round + 1} / ${gooseGameState.maxRounds} 轮</div>
    </div>
    <div style="text-align:center;font-size:0.75rem;color:var(--c-text-light);margin-bottom:12px">看顶部的中文，点击对应英文的大鹅！</div>
    <div class="goose-game-area" id="gooseArea">
      <div class="goose-target" id="gooseTarget">点击开始</div>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center">
        <button class="btn btn-primary" onclick="startGooseRound()">🦢 开始抓大鹅</button>
      </div>
    </div>
  `;
}

function startGooseRound() {
  if (gooseGameState.round >= gooseGameState.maxRounds) {
    const area = document.getElementById('gooseArea');
    area.innerHTML = `
      <div class="goose-target">🏆 游戏结束！</div>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center">
        <div style="font-size:1.5rem;font-weight:800;color:var(--c-primary)">得分：${gooseGameState.score}</div>
        <div style="font-size:0.85rem;color:var(--c-text-light);margin-top:8px">${gooseGameState.score >= 80 ? '太棒了！你是英语小达人！🌟' : gooseGameState.score >= 50 ? '不错哦！继续加油！💪' : '多练习一定更棒！加油！'}</div>
        <button class="btn btn-primary btn-sm" style="margin-top:16px" onclick="renderGooseGame()">🔄 再玩一次</button>
      </div>
    `;
    return;
  }

  // Pick a word as target
  const pick = ENGLISH_WORDS[Math.floor(Math.random() * ENGLISH_WORDS.length)];
  gooseGameState.currentWord = pick;

  // Pick 3 wrong options
  const wrongs = ENGLISH_WORDS.filter(w => w.en !== pick.en).sort(() => Math.random() - 0.5).slice(0, 3);
  const allOptions = [pick, ...wrongs].sort(() => Math.random() - 0.5);

  const area = document.getElementById('gooseArea');
  area.innerHTML = `<div class="goose-target">${pick.cn}</div>`;

  // Place geese at random positions
  allOptions.forEach((w, i) => {
    const goose = document.createElement('div');
    goose.className = 'goose';
    goose.dataset.en = w.en;
    goose.dataset.correct = w.en === pick.en ? '1' : '0';
    goose.innerHTML = `<div class="goose-emoji">🦢</div><div class="goose-word">${w.en}</div>`;
    // Random position
    const maxX = Math.max(20, area.offsetWidth - 80);
    const maxY = Math.max(120, area.offsetHeight - 80);
    const x = 10 + Math.random() * (maxX - 10);
    const y = 60 + Math.random() * (maxY - 60);
    goose.style.left = x + 'px';
    goose.style.top = y + 'px';
    goose.onclick = () => catchGoose(goose);
    area.appendChild(goose);

    // Animate movement
    animateGoose(goose, area);
  });

  // Update header
  const scoreEl = document.querySelector('#gooseGame .game-score');
  const levelEl = document.querySelector('#gooseGame .game-level');
  if (scoreEl) scoreEl.textContent = `⭐ ${gooseGameState.score}分`;
  if (levelEl) levelEl.textContent = `第 ${gooseGameState.round + 1} / ${gooseGameState.maxRounds} 轮`;
}

function animateGoose(goose, area) {
  const maxX = Math.max(20, area.offsetWidth - 80);
  const maxY = Math.max(120, area.offsetHeight - 80);
  let x = parseFloat(goose.style.left);
  let y = parseFloat(goose.style.top);
  let dx = (Math.random() - 0.5) * 2;
  let dy = (Math.random() - 0.5) * 2;
  const speed = 0.8 + Math.random() * 0.8;

  goose._anim = setInterval(() => {
    if (!goose.parentElement) { clearInterval(goose._anim); return; }
    x += dx * speed;
    y += dy * speed;
    if (x < 5 || x > maxX) { dx = -dx; x = Math.max(5, Math.min(maxX, x)); }
    if (y < 55 || y > maxY) { dy = -dy; y = Math.max(55, Math.min(maxY, y)); }
    goose.style.left = x + 'px';
    goose.style.top = y + 'px';
  }, 50);
}

function catchGoose(goose) {
  const isCorrect = goose.dataset.correct === '1';
  if (isCorrect) {
    goose.classList.add('caught');
    gooseGameState.score += 10;
    gooseGameState.round++;
    gooseGameState.caught++;
    showToast('抓到了！+10分 🎉');
    // Stop all animations
    document.querySelectorAll('#gooseArea .goose').forEach(g => { if (g._anim) clearInterval(g._anim); });
    speakEN(goose.dataset.en);
    setTimeout(() => startGooseRound(), 1200);
  } else {
    goose.classList.add('wrong');
    gooseGameState.score = Math.max(0, gooseGameState.score - 5);
    showToast('不是这只！-5分 💦');
    setTimeout(() => goose.classList.remove('wrong'), 500);
  }
  const scoreEl = document.querySelector('#gooseGame .game-score');
  if (scoreEl) scoreEl.textContent = `⭐ ${gooseGameState.score}分`;
}

/* ==================== 打卡奖励模块 ==================== */
function renderRewards() {
  document.getElementById('rewardsDate').textContent = formatDate();
  document.getElementById('totalPoints').textContent = appData.points;

  // Check if all done today
  const today = todayStr();
  const allDone = appData.tasks.length > 0 && appData.tasks.every(t => appData.checkins[`${today}_${t.id}`]);
  document.getElementById('pointsSub').textContent = allDone ? '🎉 今日全部完成！' : '完成今日全部打卡 +1积分';

  // Checkin list
  const listEl = document.getElementById('checkinList');
  listEl.innerHTML = appData.tasks.map(t => {
    const key = `${today}_${t.id}`;
    const done = appData.checkins[key];
    return `
      <div class="checkin-card ${done ? 'done' : ''}" onclick="toggleCheckin('${t.id}')">
        <div class="check-circle">${done ? '✓' : ''}</div>
        <div class="check-info">
          <div class="check-name">${t.icon} ${t.name}</div>
          <div class="check-desc">${t.desc}</div>
          ${done ? `<div class="check-time">✅ 已完成 ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2,'0')}</div>` : ''}
        </div>
        <button class="delete-btn" onclick="event.stopPropagation();deleteTask('${t.id}')">✕</button>
      </div>
    `;
  }).join('');

  // Reward list
  const rewardEl = document.getElementById('rewardList');
  rewardEl.innerHTML = appData.rewards.map(r => {
    const progress = Math.min(100, Math.round(appData.points / r.points * 100));
    const canClaim = !r.claimed && appData.points >= r.points;
    return `
      <div class="reward-item ${r.claimed ? 'claimed' : ''}">
        <div class="reward-icon">${r.icon}</div>
        <div class="reward-info">
          <div class="reward-name">${r.name}</div>
          <div class="reward-pts">${r.points} 积分</div>
          ${!r.claimed ? `<div class="reward-progress">${appData.points}/${r.points}分</div><div class="progress-bar"><div class="progress-bar-fill" style="width:${progress}%"></div></div>` : ''}
        </div>
        <div class="reward-actions">
          ${canClaim ? `<button class="reward-btn edit-btn" style="background:var(--c-green);color:#fff" onclick="claimReward('${r.id}')">🎁</button>` : ''}
          <button class="reward-btn edit-btn" onclick="openEditRewardModal('${r.id}')">✏️</button>
          <button class="reward-btn del-btn" onclick="deleteReward('${r.id}')">🗑</button>
        </div>
      </div>
    `;
  }).join('');

  updateNavBadge();
}

function updateNavBadge() {
  const today = todayStr();
  const undone = appData.tasks.filter(t => !appData.checkins[`${today}_${t.id}`]).length;
  const badge = document.getElementById('navBadge');
  if (undone > 0) {
    badge.style.display = 'flex';
    badge.textContent = undone;
  } else {
    badge.style.display = 'none';
  }
}

function toggleCheckin(taskId) {
  const today = todayStr();
  const key = `${today}_${taskId}`;
  if (appData.checkins[key]) {
    delete appData.checkins[key];
    showToast('已取消打卡');
  } else {
    appData.checkins[key] = new Date().toISOString();
    showToast('打卡成功！🌟');

    // Check if all done
    const allDone = appData.tasks.every(t => appData.checkins[`${today}_${t.id}`]);
    if (allDone) {
      appData.points += 1;
      showToast('🎉 今日全部完成！+1积分！');
      celebrate();
    }
  }
  saveData(appData);
  renderRewards();
  // Update home if visible
  if (document.getElementById('page-home').classList.contains('active')) renderHome();
}

function quickCheckin(taskId) {
  const today = todayStr();
  const key = `${today}_${taskId}`;
  if (!appData.checkins[key]) {
    appData.checkins[key] = new Date().toISOString();
    showToast('打卡成功！🌟');
    const allDone = appData.tasks.every(t => appData.checkins[`${today}_${t.id}`]);
    if (allDone) {
      appData.points += 1;
      showToast('🎉 今日全部完成！+1积分！');
      celebrate();
    }
    saveData(appData);
    updateNavBadge();
  } else {
    showToast('已经打过卡啦~');
  }
}

function deleteTask(taskId) {
  if (confirm('确定删除这个打卡任务吗？')) {
    appData.tasks = appData.tasks.filter(t => t.id !== taskId);
    saveData(appData);
    renderRewards();
    showToast('已删除任务');
  }
}

function deleteReward(rewardId) {
  if (confirm('确定删除这个奖励吗？')) {
    appData.rewards = appData.rewards.filter(r => r.id !== rewardId);
    saveData(appData);
    renderRewards();
    showToast('已删除奖励');
  }
}

function claimReward(rewardId) {
  const reward = appData.rewards.find(r => r.id === rewardId);
  if (!reward) return;
  if (appData.points < reward.points) { showToast('积分不够哦~'); return; }
  if (reward.claimed) { showToast('已经领取过了~'); return; }
  appData.points -= reward.points;
  reward.claimed = true;
  saveData(appData);
  celebrate();
  showToast(`🎉 恭喜获得：${reward.icon} ${reward.name}！`);
  renderRewards();
}

/* ==================== 弹窗：添加任务/奖励 ==================== */
function openAddTaskModal() {
  const icons = ['📝','⭐','🎨','🎵','🧩','⚽','📖','🔢','✏️','🌟','💡','🎈','🏆','🌈','🦋','🌸'];
  document.getElementById('modalContent').innerHTML = `
    <h3>➕ 新增打卡任务</h3>
    <input class="modal-input" id="newTaskName" placeholder="任务名称" maxlength="20">
    <input class="modal-input" id="newTaskDesc" placeholder="任务描述" maxlength="50">
    <div style="font-size:0.75rem;color:var(--c-text-light);margin-bottom:8px">选择图标：</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
      ${icons.map(ic => `<div style="width:36px;height:36px;border-radius:8px;background:#F0F0F8;display:flex;align-items:center;justify-content:center;font-size:1.3rem;cursor:pointer;border:2px solid transparent" onclick="selectTaskIcon(this,'${ic}')">${ic}</div>`).join('')}
    </div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn btn-primary" onclick="addTask()">确认添加</button>
    </div>
  `;
  document.getElementById('modalOverlay').classList.add('show');
}

let selectedTaskIcon = '📝';
function selectTaskIcon(el, icon) {
  selectedTaskIcon = icon;
  el.parentElement.querySelectorAll('div').forEach(d => d.style.borderColor = 'transparent');
  el.style.borderColor = 'var(--c-primary)';
}

function addTask() {
  const name = document.getElementById('newTaskName').value.trim();
  const desc = document.getElementById('newTaskDesc').value.trim();
  if (!name) { showToast('请输入任务名称'); return; }
  const task = {
    id: 't' + Date.now(),
    name: name,
    icon: selectedTaskIcon,
    desc: desc || '自定义任务'
  };
  appData.tasks.push(task);
  saveData(appData);
  closeModal();
  renderRewards();
  showToast('任务添加成功！');
}

function openAddRewardModal() {
  const icons = ['🍬','🧸','🎡','🍕','🎨','🚲','📚','🎮','🍦','🎈','🎁','🚗','🪁','🏊','🎯','恐龙园','🏝'];
  document.getElementById('modalContent').innerHTML = `
    <h3>➕ 新增奖励</h3>
    <input class="modal-input" id="newRewardName" placeholder="奖励名称" maxlength="20">
    <input class="modal-input" id="newRewardPoints" type="number" placeholder="需要多少积分" min="1">
    <div style="font-size:0.75rem;color:var(--c-text-light);margin-bottom:8px">选择图标：</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
      ${icons.map(ic => `<div style="width:36px;height:36px;border-radius:8px;background:#F0F0F8;display:flex;align-items:center;justify-content:center;font-size:1.3rem;cursor:pointer;border:2px solid transparent" onclick="selectTaskIcon(this,'${ic}')">${ic}</div>`).join('')}
    </div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn btn-primary" onclick="addReward()">确认添加</button>
    </div>
  `;
  selectedTaskIcon = '🎁';
  document.getElementById('modalOverlay').classList.add('show');
}

function addReward() {
  const name = document.getElementById('newRewardName').value.trim();
  const points = parseInt(document.getElementById('newRewardPoints').value);
  if (!name) { showToast('请输入奖励名称'); return; }
  if (!points || points < 1) { showToast('请输入有效积分'); return; }
  const reward = {
    id: 'r' + Date.now(),
    name: name,
    icon: selectedTaskIcon,
    points: points,
    claimed: false
  };
  appData.rewards.push(reward);
  appData.rewards.sort((a, b) => a.points - b.points);
  saveData(appData);
  closeModal();
  renderRewards();
  showToast('奖励添加成功！');
}

function openEditRewardModal(rewardId) {
  const reward = appData.rewards.find(r => r.id === rewardId);
  if (!reward) return;
  document.getElementById('modalContent').innerHTML = `
    <h3>✏️ 编辑奖励</h3>
    <input class="modal-input" id="editRewardName" placeholder="奖励名称" value="${reward.name}" maxlength="20">
    <input class="modal-input" id="editRewardPoints" type="number" value="${reward.points}" min="1">
    <label style="display:flex;align-items:center;gap:8px;font-size:0.8rem;margin-bottom:12px;cursor:pointer">
      <input type="checkbox" id="editRewardClaimed" ${reward.claimed ? 'checked' : ''}>
      已领取
    </label>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn btn-primary" onclick="saveEditReward('${rewardId}')">保存</button>
    </div>
  `;
  document.getElementById('modalOverlay').classList.add('show');
}

function saveEditReward(rewardId) {
  const reward = appData.rewards.find(r => r.id === rewardId);
  if (!reward) return;
  const name = document.getElementById('editRewardName').value.trim();
  const points = parseInt(document.getElementById('editRewardPoints').value);
  if (!name) { showToast('请输入奖励名称'); return; }
  if (!points || points < 1) { showToast('请输入有效积分'); return; }
  reward.name = name;
  reward.points = points;
  reward.claimed = document.getElementById('editRewardClaimed').checked;
  appData.rewards.sort((a, b) => a.points - b.points);
  saveData(appData);
  closeModal();
  renderRewards();
  showToast('奖励已更新！');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

/* ==================== 语音朗读 ==================== */
function speakText(text) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 0.8;
    u.pitch = 1.1;
    speechSynthesis.speak(u);
  }
}

function speakPoem(idx) {
  const poem = POEMS[idx];
  const text = `${poem.title}。${poem.author}。${poem.lines.replace(/\n/g, '，')}`;
  speakText(text);
}

function speakChars(chars) {
  speakText(chars.join('，'));
}

function speakEN(text) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.7;
    u.pitch = 1.2;
    speechSynthesis.speak(u);
  }
}

/* ==================== 初始化 ==================== */
function init() {
  checkDailyReset();
  renderHome();
  updateNavBadge();
}

init();
