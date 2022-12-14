import type { ERA, PLANET, SATELLITE, STAR, SPOT } from './date.js';
import { FancyDate } from './date.js';

export const 九星 = [
	'九紫火',
	'八白土',
	'七赤金',
	'六白金',
	'五黄土',
	'四緑木',
	'三碧木',
	'二黒土',
	'一白水'
] as const;
const 九星rev = [
	'一白水',
	'二黒土',
	'三碧木',
	'四緑木',
	'五黄土',
	'六白金',
	'七赤金',
	'八白土',
	'九紫火'
] as const;

export const 九曜 = [
	'羅睺',
	'土曜',
	'水曜',
	'金曜',
	'日曜',
	'火曜',
	'計都',
	'月曜',
	'木曜'
] as const;
export const 七曜 = ['月', '火', '水', '木', '金', '土', '日'] as const;
export const 六曜 = ['先勝', '友引', '先負', '仏滅', '大安', '赤口'] as const;

export const 東方青龍 = ['角', '亢', '氐', '房', '心', '尾', '箕'] as const;
export const 北方玄武 = ['斗', '牛', '女', '虚', '危', '室', '壁'] as const;
export const 西方百虎 = ['奎', '婁', '胃', '昴', '畢', '觜', '参'] as const;
export const 南方朱雀 = ['井', '鬼', '柳', '星', '張', '翼', '軫'] as const;
export const 二十八宿 = [...東方青龍, ...北方玄武, ...西方百虎, ...南方朱雀] as const;

const 北方玄武cut = ['斗', '女', '虚', '危', '室', '壁'] as const;
export const 二十七宿 = [...東方青龍, ...北方玄武cut, ...西方百虎, ...南方朱雀] as const;

export const 九星かな = [
	'きゅうしか',
	'はっぱくど',
	'しちせききん',
	'ろっぱくきん',
	'ごおうど',
	'しろくもく',
	'さんぺきもく',
	'じこくど',
	'いっぱくすい'
] as const;
const 九星かなrev = [
	'いっぱくすい',
	'じこくど',
	'さんぺきもく',
	'しろくもく',
	'ごおうど',
	'ろっぱくきん',
	'しちせききん',
	'はっぱくど',
	'きゅうしか'
] as const;
export const 九曜かな = [
	'らごう',
	'どよう',
	'すいよう',
	'きんよう',
	'にちよう',
	'かよう',
	'けいと',
	'げつよう',
	'もくよう'
] as const;
export const 七曜かな = ['げつ', 'か', 'すい', 'もく', 'きん', 'ど', 'にち'] as const;
export const 六曜かな = [
	'せんかち',
	'ともびき',
	'せんまけ',
	'ぶつめつ',
	'たいあん',
	'しゃっく'
] as const;

export const 東方青龍かな = ['す', 'あみ', 'とも', 'そい', 'なかご', 'あしたれ', 'み'] as const;
export const 北方玄武かな = [
	'ひきつ',
	'いなみ',
	'うるき',
	'とみて',
	'うみやめ',
	'はつい',
	'なまめ'
] as const;
export const 西方百虎かな = [
	'とかき',
	'たたら',
	'えきえ',
	'すばる',
	'あめふり',
	'とろき',
	'からすき'
] as const;
export const 南方朱雀かな = [
	'ちちり',
	'たまほめ',
	'ぬりこ',
	'ほとおり',
	'ちりこ',
	'たすき',
	'みつかけ'
] as const;
export const 二十八宿かな = [
	...東方青龍かな,
	...北方玄武かな,
	...西方百虎かな,
	...南方朱雀かな
] as const;

const 北方玄武かなcut = ['ひきつ', 'うるき', 'とみて', 'うみやめ', 'はつい', 'なまめ'] as const;
export const 二十七宿かな = [
	...東方青龍かな,
	...北方玄武かなcut,
	...西方百虎かな,
	...南方朱雀かな
] as const;

export const 月相 = [
	'朔',
	'既朔',
	'三日月',
	'上弦',
	'上弦',
	'上弦',
	'上弦',
	'上弦',
	'上弦',
	'上弦',
	'上弦',
	'上弦',
	'十三夜',
	'小望月',
	'満月',
	'十六夜',
	'立待月',
	'居待月',
	'臥待月',
	'更待月',
	'下限',
	'下限',
	'下限',
	'下限',
	'下限',
	'下限',
	'下限',
	'下限',
	'晦',
	'晦'
] as const;
export const 時鐘 = [
	'暁九ツ',
	'暁八ツ',
	'暁七ツ',
	'明六ツ',
	'朝五ツ',
	'朝四ツ',
	'昼九ツ',
	'昼八ツ',
	'昼七ツ',
	'暮六ツ',
	'夜五ツ',
	'夜四ツ'
] as const;

export const 月相かな = [
	'さく',
	'きさく',
	'みかづき',
	'じょうげん',
	'じょうげん',
	'じょうげん',
	'じょうげん',
	'じょうげん',
	'じょうげん',
	'じょうげん',
	'じょうげん',
	'じょうげん',
	'じゅうさんや',
	'こもちづき',
	'まんげつ',
	'いざよい',
	'たちまちづき',
	'いまちづき',
	'ふしまちづき',
	'ふけまちづき',
	'かげん',
	'かげん',
	'かげん',
	'かげん',
	'かげん',
	'かげん',
	'かげん',
	'かげん',
	'つごもり',
	'つごもり'
] as const;
export const 時鐘かな = [
	'ぎょうここのつ',
	'ぎょうやつ',
	'ぎょうななつ',
	'あけむつ',
	'あさいつつ',
	'あさよつ',
	'ひるここのつ',
	'ひるやつ',
	'ひるななつ',
	'くれむつ',
	'よるいつつ',
	'よるよつ'
] as const;

export const 和風月名 = [
	'睦月',
	'如月',
	'弥生',
	'卯月',
	'皐月',
	'水無月',
	'文月',
	'葉月',
	'長月',
	'神無月',
	'霜月',
	'師走'
] as const;

export const 二十四節季 = [
	'立春',
	'雨水',
	'啓蟄',
	'春分',
	'清明',
	'穀雨',
	'立夏',
	'小満',
	'芒種',
	'夏至',
	'小暑',
	'大暑',
	'立秋',
	'処暑',
	'白露',
	'秋分',
	'寒露',
	'霜降',
	'立冬',
	'小雪',
	'大雪',
	'冬至',
	'小寒',
	'大寒'
] as const;

export const 和風月名かな = [
	'むつき',
	'きさらぎ',
	'やよい',
	'うづき',
	'さつき',
	'みなつき',
	'ふみつき',
	'はつき',
	'ながつき',
	'かんなづき',
	'しもつき',
	'しわす'
] as const;

export const 二十四節季かな = [
	'りっしゅん',
	'うすい',
	'けいちつ',
	'しゅんぶん',
	'せいめい',
	'こくう',
	'りっか',
	'しょうまん',
	'ぼうしゅ',
	'げし',
	'しょうしょ',
	'たいしょ',
	'りっしゅう',
	'しょしょ',
	'はくろ',
	'しゅうぶん',
	'かんろ',
	'そうこう',
	'りっとう',
	'しょうせつ',
	'たいせつ',
	'とうじ',
	'しょうかん',
	'だいかん'
] as const;

export const 十干 = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const 十二支 = [
	'子',
	'丑',
	'寅',
	'卯',
	'辰',
	'巳',
	'午',
	'未',
	'申',
	'酉',
	'戌',
	'亥'
] as const;

export const 十干かな = [
	'きのえ',
	'きのと',
	'ひのえ',
	'ひのと',
	'つちのえ',
	'つちのと',
	'かのえ',
	'かのと',
	'みずのえ',
	'みずのと'
] as const;
export const 十二支かな = [
	'ね',
	'うし',
	'とら',
	'う',
	'たつ',
	'み',
	'うま',
	'ひつじ',
	'さる',
	'とり',
	'いぬ',
	'い'
] as const;

// 号, 開始時刻
export const 元号 = [
	['大化', -41795686800000],
	['白雉', -41648029200000],
	['朱鳥', -40499427600000],
	['大宝', -40034941200000],
	['慶雲', -39936445200000],
	['和銅', -39821446800000],
	['霊亀', -39579958800000],
	['養老', -39509715600000],
	['神亀', -39314365200000],
	['天平', -39140787600000],
	['天平感宝', -38520090000000],
	['天平勝宝', -38510845200000],
	['天平宝字', -38256829200000],
	['天平神護', -38023117200000],
	['神護景雲', -37940691600000],
	['宝亀', -37842541200000],
	['天応', -37518368400000],
	['延暦', -37465837200000],
	['大同', -36718304400000],
	['弘仁', -36580496400000],
	['天長', -36160678800000],
	['承和', -35844541200000],
	['嘉祥', -35389558800000],
	['仁寿', -35298838800000],
	['斉衡', -35186432400000],
	['天安', -35115757200000],
	['貞観', -35047414800000],
	['元慶', -34478298000000],
	['仁和', -34232922000000],
	['寛平', -34099779600000],
	['昌泰', -33816646800000],
	['延喜', -33713053200000],
	['延長', -33026950800000],
	['承平', -32775613200000],
	['天慶', -32551491600000],
	['天暦', -32270778000000],
	['天徳', -31938742800000],
	['応和', -31835062800000],
	['康保', -31725939600000],
	['安和', -31597981200000],
	['天禄', -31545968400000],
	['天延', -31428982800000],
	['貞元', -31347939600000],
	['天元', -31272598800000],
	['永観', -31133494800000],
	['寛和', -31071200400000],
	['永延', -31009338000000],
	['永祚', -30935120400000],
	['正暦', -30896931600000],
	['長徳', -30760419600000],
	['長保', -30638682000000],
	['寛弘', -30464586000000],
	['長和', -30196227600000],
	['寛仁', -30061184400000],
	['治安', -29940570000000],
	['万寿', -29832483600000],
	['長元', -29706339600000],
	['長暦', -29431069200000],
	['長久', -29317280400000],
	['寛徳', -29191050000000],
	['永承', -29145949200000],
	['天喜', -28934442000000],
	['康平', -28756890000000],
	['治暦', -28537261200000],
	['延久', -28421485200000],
	['承保', -28252227600000],
	['承暦', -28150621200000],
	['永保', -28046682000000],
	['応徳', -27952592400000],
	['寛治', -27853059600000],
	['嘉保', -27609930000000],
	['永長', -27548499600000],
	['承徳', -27517568400000],
	['康和', -27463395600000],
	['長治', -27322045200000],
	['嘉承', -27253270800000],
	['天仁', -27179830800000],
	['天永', -27120214800000],
	['永久', -27023360400000],
	['元永', -26876134800000],
	['保安', -26811766800000],
	['天治', -26684758800000],
	['大治', -26629635600000],
	['天承', -26470746000000],
	['長承', -26421411600000],
	['保延', -26335702800000],
	['永治', -26140784400000],
	['康治', -26116160400000],
	['天養', -26058013200000],
	['久安', -26014640400000],
	['仁平', -25840803600000],
	['久寿', -25720794000000],
	['保元', -25674915600000],
	['平治', -25581085200000],
	['永暦', -25556461200000],
	['応保', -25506003600000],
	['長寛', -25455286800000],
	['永万', -25385994000000],
	['仁安', -25348323600000],
	['嘉応', -25265725200000],
	['承安', -25200838800000],
	['安元', -25067610000000],
	['治承', -25003328400000],
	['養和', -24877443600000],
	['寿永', -24850832400000],
	['元暦', -24790525200000],
	['文治', -24749917200000],
	['建久', -24602173200000],
	['正治', -24317571600000],
	['建仁', -24260029200000],
	['元久', -24164989200000],
	['建永', -24095523600000],
	['承元', -24049818000000],
	['建暦', -23941472400000],
	['建保', -23854986000000],
	['承久', -23686074000000],
	['貞応', -23591552400000],
	['元仁', -23509386000000],
	['嘉禄', -23496598800000],
	['安貞', -23413222800000],
	['寛喜', -23375379600000],
	['貞永', -23278698000000],
	['天福', -23244397200000],
	['文暦', -23196790800000],
	['嘉禎', -23167501200000],
	['暦仁', -23067709200000],
	['延応', -23061402000000],
	['仁治', -23017251600000],
	['寛元', -22934739600000],
	['宝治', -22806954000000],
	['建長', -22741462800000],
	['康元', -22505418000000],
	['正嘉', -22491766800000],
	['正元', -22426966800000],
	['文応', -22392406800000],
	['弘長', -22366314000000],
	['文永', -22271187600000],
	['建治', -21919280400000],
	['弘安', -21829770000000],
	['正応', -21508362000000],
	['永仁', -21341955600000],
	['正安', -21161638800000],
	['乾元', -21049750800000],
	['嘉元', -21025558800000],
	['徳治', -20920150800000],
	['延慶', -20861917200000],
	['応長', -20783638800000],
	['正和', -20753744400000],
	['文保', -20599606800000],
	['元応', -20531091600000],
	['元亨', -20472858000000],
	['正中', -20354144400000],
	['嘉暦', -20309302800000],
	['元徳', -20204499600000],
	['元弘', -20142378000000, '南'],
	['正慶', -20120346000000, '北'],
	['建武', -20064099600000],
	['延元', -19997744400000, '南'],
	['興国', -19867712400000, '南'],
	['正平', -19657674000000, '南'],
	['建徳', -18913856400000, '南'],
	['文中', -18859942800000, '南'],
	['天授', -18760496400000, '南'],
	['弘和', -18580784400000, '南'],
	['元中', -18479782800000, '南'],
	['暦応', -19918861200000, '北'],
	['康永', -19804035600000, '北'],
	['貞和', -19694912400000, '北'],
	['観応', -19556586000000, '北'],
	['文和', -19474938000000, '北'],
	['延文', -19365037200000, '北'],
	['康安', -19206838800000, '北'],
	['貞治', -19161478800000, '北'],
	['応安', -18990925200000, '北'],
	['永和', -18768186000000, '北'],
	['康暦', -18641005200000, '北'],
	['永徳', -18579574800000, '北'],
	['至徳', -18484966800000, '北'],
	['嘉慶', -18373078800000, '北'],
	['康応', -18328237200000, '北'],
	['明徳', -18293590800000, '北'],
	['応永', -18157683600000],
	['正長', -17089261200000],
	['永享', -17047789200000],
	['嘉吉', -16686982800000],
	['文安', -16593670800000],
	['宝徳', -16420784400000],
	['享徳', -16326608400000],
	['康正', -16229667600000],
	['長禄', -16163053200000],
	['寛正', -16059027600000],
	['文正', -15897718800000],
	['応仁', -15863936400000],
	['文明', -15795594000000],
	['長享', -15222243600000],
	['延徳', -15155802000000],
	['明応', -15064131600000],
	['文亀', -14792835600000],
	['永正', -14698314000000],
	['大永', -14145354000000],
	['享禄', -13926157200000],
	['天文', -13800358800000],
	['弘治', -13068550800000],
	['永禄', -12994074000000],
	['元亀', -12609334800000],
	['天正', -12506864400000],
	['文禄', -11896189200000],
	['慶長', -11772118800000],
	['元和', -11181402000000],
	['寛永', -10909501200000],
	['正保', -10254934800000],
	['慶安', -10152982800000],
	['承応', -10009818000000],
	['明暦', -9928602000000],
	['万治', -9825699600000],
	['寛文', -9738781200000],
	['延宝', -9346266000000],
	['天和', -9092941200000],
	['貞享', -9017082000000],
	['元禄', -8873485200000],
	['宝永', -8385066000000],
	['正徳', -8159389200000],
	['享保', -7996438800000],
	['元文', -7370730000000],
	['寛保', -7217802000000],
	['延享', -7123885200000],
	['寛延', -6986941200000],
	['宝暦', -6881014800000],
	['明和', -6485130000000],
	['安永', -6218586000000],
	['天明', -5954374800000],
	['寛政', -5707530000000],
	['享和', -5326506000000],
	['文化', -5231552400000],
	['文政', -4784173200000],
	['天保', -4384573200000],
	['弘化', -3943933200000],
	['嘉永', -3842154000000],
	['安政', -3627882000000],
	['万延', -3462858000000],
	['文久', -3432186000000],
	['元治', -3337664400000],
	['慶応', -3303104400000],
	['明治', -3216790800000],
	['大正', -1812186000000],
	['昭和', -1357635600000],
	['平成', 600188400000],
	['令和', 1556636400000]
] as const;
export const 北朝元号 = 元号.filter(([, , s]) => '南' !== s);
export const 南朝元号 = 元号.filter(([, , s]) => '北' !== s);

export const 太陽: STAR = [null, null, null] as const;

export const 地球: PLANET = [
	太陽,
	[31556925147, 1553119080000], // 2019/03/21 06:58
	[86400000, 0, 23.4397] // LOD ではなく、暦上の1日。Unix epoch では閏秒を消し去るため。
] as const;

export const 火星: PLANET = [
	太陽,
	[59355616881, 1540684800000], // 公転周期 UTC 2018/10/28 00:00
	[88740035, 0, 25.19] // 自転周期 24時間39分35秒。
] as const;

export const 水星: PLANET = [
	太陽,
	[7596288000, 1553119080000], // 太陽年 2019/03/21 06:58
	[15192576000, 0, 0.01] // 太陽日
] as const;

export const 金星: PLANET = [
	太陽,
	[19414456423, 1553119080000], // 公転周期 2019/03/21 06:58
	[10087251840, 0, -2.64] // 太陽日
] as const;

export const 木星: PLANET = [
	太陽,
	[374322050280, 1553119080000], // 公転周期 2019/03/21 06:58
	[35769600, 0, 3.12] // 自転周期
] as const;

export const 土星: PLANET = [
	太陽,
	[931964092416, 1553119080000], // 公転周期 2019/03/21 06:58
	[37920035, 0, 25.33] // 自転周期
] as const;

export const 天王星: PLANET = [
	太陽,
	[2658822788376, 1553119080000], // 公転周期 2019/03/21 06:58
	[62061120, 0, -82.23] // 自転周期
] as const;

export const 海王星: PLANET = [
	太陽,
	[5200376904000, 1553119080000], // 公転周期  2019/03/21 06:58
	[64800000, 0, 28.32] // 自転周期
] as const;

export const 冥王星: PLANET = [
	太陽,
	[7818100727754, 0], // 公転周期
	[551856672, 0, -60.41] // 自転周期
] as const;

export const セレス: PLANET = [
	太陽,
	[145423814400, 0], // 公転周期
	[32667012, 0, 4] // 自転周期
] as const;

export const ハウメア: PLANET = [
	太陽,
	[8908394904000, 0], // 公転周期
	[14095440, 0, 0] // 自転周期
] as const;

export const マケマケ: PLANET = [
	太陽,
	[9639268920000, 0], // 公転周期
	[27975600, 0, 0] // 自転周期
] as const;

export const エリス: PLANET = [
	太陽,
	[17610403104000, 0], // 公転周期
	[93240000, 0, 0] // 自転周期
] as const;

export const 白分月: SATELLITE = [
	地球,
	[2551442889, 1577310360000], // 2019/12/26 06:46
	[2551442889, 0, 6.68]
] as const;

export const 黒分月: SATELLITE = [
	地球,
	[2551442889, 1577310360000 - 2551442889 / 2], // 2019/12/26 06:46
	[2551442889, 0, 6.68]
] as const;
export const 月: SATELLITE = 白分月;

export const ガニメデ: SATELLITE = [木星, [618192000, 0]] as const;
export const カリスト: SATELLITE = [木星, [1441929600, 0]] as const;
export const タイタン: SATELLITE = [土星, [1377684374, 0]] as const;
export const チタニア: SATELLITE = [天王星, [752198400, 0]] as const;
export const トリトン: SATELLITE = [海王星, [507733056, 0]] as const;

export const ナマカ: SATELLITE = [ハウメア, [1579245120, 0]] as const;
export const ヒイアカ: SATELLITE = [ハウメア, [4273516800, 0]] as const;
export const カロン: SATELLITE = [冥王星, [551880000, 0]];
export const ディスノミア: SATELLITE = [エリス, [1362700800, 0]] as const;

export const 東京: SPOT = [月, 35.7, 139.8, 15 * +9] as const;
export const zürich: SPOT = [月, 47.3, 8.5, 15 * +1] as const;
export const Paris: SPOT = [月, 48.9, 2.4, 15 * 0] as const;
export const Romus: SPOT = [月, 42.0, 12.5, 15 * +1] as const;
export const London: SPOT = [月, 51.5, 0.0, 15 * 0] as const;
export const NewYork: SPOT = [月, 40.3, -74.0, 15 * -5] as const;
export const NewYork_Summer: SPOT = [月, 40.3, -74.0, 15 * -4] as const;
export const Madurai: SPOT = [白分月, 9.8, 78.1, 15 * +5.5] as const;
export const Jaypore: SPOT = [黒分月, 18.8, 82.5, 15 * +5.5] as const;

// ---  -  I  L -OP R TUVWX -
// --- efghijkl no qr t v   z

const g = new FancyDate()
	.spot(...London)
	.era('西暦', '紀元前')
	.calendar(
		['1970年 木-斗 庚戌-辛巳', 'y年 E-V a-A', 0],
		[4, 100, 400],
		[31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	)
	.algo({
		M: [12],
		H: [24],
		m: [60],
		s: [60],

		N: [月相, 月相かな],

		E: [七曜, 七曜かな],
		V: [二十八宿, 二十八宿かな],
		Z: [二十四節季, 二十四節季かな],

		a: [60],
		A: [60],
		B: [十二支, 十二支かな],
		C: [十干, 十干かな]
	})
	.init();

const UTC = g;
const Gregorian = g
	.dup()
	.spot(...東京)
	.init();

const Julian = g
	.dup()
	.spot(...Romus)
	.calendar(
		['1582/10/5(金) 壬午-甲戌', 'y/M/d(E) a-A', g.parse('1582年10月15日')!],
		[4],
		[31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	)
	.init();

const アマンタ = g
	.dup()
	.spot(...Madurai)
	.era('サカ歴', '紀元前')
	.calendar(['1891-09-08(木) 庚戌-辛巳 三碧木-七赤金', 'y-M-d(E) a-A f-F', 0])
	.daily('Rise')
	.algo({
		f: [九星, 九星かな],
		F: [九星rev, 九星かなrev]
	})
	.init();

const プールニマンタ = g
	.dup()
	.spot(...Jaypore)
	.era('サカ歴', '紀元前')
	.calendar(['1891-09-23(木) 庚戌-辛巳 三碧木-七赤金', 'y-M-d(E) a-A f-F', 0])
	.daily('Rise')
	.algo({
		f: [九星, 九星かな],
		F: [九星rev, 九星かなrev]
	})
	.init();

const 平気法 = g
	.dup()
	.lang('Gy年Mod日', 'Gy年Mod日(E)Homo')
	.spot(...東京)
	.era('皇紀', '紀元前', 北朝元号)
	.calendar(['2629年12月7日 赤口-昴 己酉-辛巳 九紫火-七赤金', 'y年M月d日 E-V a-A f-F', 0])
	.daily('Sunny')
	.algo({
		E: [六曜, 六曜かな],
		V: [二十七宿, 二十七宿かな],
		M: [和風月名, 和風月名かな],
		H: [時鐘, 時鐘かな],
		m: [
			['', '半'],
			['', 'はん']
		],
		s: [3600],
		S: [1000],

		f: [九星, 九星かな],
		F: [九星rev, 九星かなrev]
	})
	.init();

const Romulus = g
	.dup()
	.spot(...Romus)
	.era('ロムルス暦', '紀元前')
	.calendar(['754年1月16日(H) 辛酉-己亥', 'y年M月d日(E) a-A', g.parse('1年3月22日')!], null, [
		31,
		30,
		31,
		30,
		31,
		30,
		30,
		31,
		30,
		30,
		null
	])
	.algo({
		M: [11],
		E: [[...'ABCDEFGH'], null] as const
	})
	.init();

// Gregorianは太陽暦なので、SATELLITE未定義でもよい
const MarsGregorian = g
	.dup()
	.spot([火星] as any as SATELLITE, 35, 0, 0)
	.era('西暦', '紀元前')
	.calendar(
		['1年(火) 壬子-辛巳', 'y年(E) a-A', g.parse('0年4月1日')!], // 春分が３月くらいになるよう、恣意的に決めました。
		[1, 7, 70]
	)
	.algo({
		M: [20]
	})
	.init();

const Jupiter = g
	.dup()
	.spot(カリスト, 35, 0, 0)
	.era('西暦', '紀元前')
	.calendar(
		['1年(火) 壬子-辛巳', 'y年(E) a-A', g.parse('0年4月1日')!] // 春分が３月くらいになるよう、恣意的に決めました。
	)
	.algo({
		H: [10],
		M: [260],
		N: [40],
		Z: [520]
	})
	.init();

const フランス革命暦 = g
	.dup()
	.spot(...Paris)
	.era('革命暦', '紀元前')
	.calendar(
		['1年1月1日 1曜 壬子-癸酉', 'y年M月d日 E曜 a-A', g.parse('1792年9月22日')!],
		[4, 100, 400],
		[30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, null]
	)
	.algo({
		M: [
			[
				'葡萄月',
				'霧月',
				'霜月',
				'雪月',
				'雨月',
				'風月',
				'芽月',
				'花月',
				'牧月',
				'収穫月',
				'熱月',
				'実月',
				'休日'
			],
			[
				'Vendémiaire',
				'Brumaire',
				'Frimaire',
				'Nivôse',
				'Pluviôse',
				'Ventôse',
				'Germinal',
				'Floréal',
				'Prairial',
				'Messidor',
				'Thermidor',
				'Fructidor',
				'Vacances'
			]
		] as const,
		H: [10],
		m: [100],
		s: [100],

		E: [10]
	})
	.init();

const Beat = g
	.dup()
	.spot(...zürich)
	.era('@', '紀元前')
	.algo({
		H: [1000],
		m: [100]
	})
	.init();

export const Calendar = {
	UTC,
	Gregorian,
	Julian,
	アマンタ,
	プールニマンタ,
	平気法,
	Romulus,
	MarsGregorian,
	Jupiter,
	フランス革命暦,
	Beat
};
