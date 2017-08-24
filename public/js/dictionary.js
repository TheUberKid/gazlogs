'use strict';

Number.prototype.pad = function(size) {
  var s = String(this);
  while(s.length < (size || 2)){
    s = '0' + s;
  }
  return s;
}

var altNames = {
  Abathur: {"PrimaryName": "Abathur", "ImageURL": "Abathur", "AttributeName": "Abat", "Group": "Specialist", "SubGroup": "Utility", "Translations": "Abatur,АБАТУР,아바투르,阿巴瑟"},
  Alarak: {"PrimaryName": "Alarak", "ImageURL": "Alarak", "AttributeName": "Alar", "Group": "Assassin", "SubGroup": "Ambusher", "Translations": "亞拉瑞克,阿拉纳克,알라라크,Аларак"},
  Anubarak: {"PrimaryName": "Anub'arak", "ImageURL": "Anubarak", "AttributeName": "Anub", "Group": "Warrior", "SubGroup": "Tank", "Translations": "Anub’arak,Ануб'арак,아눕아락,阿努巴拉克"},
  Artanis: {"PrimaryName": "Artanis", "ImageURL": "Artanis", "AttributeName": "Arts", "Group": "Warrior", "SubGroup": "Bruiser", "Translations": "아르타니스,亞坦尼斯,阿塔尼斯,Артанис"},
  Arthas: {"PrimaryName": "Arthas", "ImageURL": "Arthas", "AttributeName": "Arth", "Group": "Warrior", "SubGroup": "Bruiser", "Translations": "АРТАС,아서스,阿尔萨斯,阿薩斯,Артас"},
  Auriel: {"PrimaryName": "Auriel", "ImageURL": "Auriel", "AttributeName": "Auri", "Group": "Support", "SubGroup": "Healer", "Translations": "Ауриэль,奥莉尔,奧莉爾,아우리엘"},
  Azmodan: {"PrimaryName": "Azmodan", "ImageURL": "Azmodan", "AttributeName": "Azmo", "Group": "Specialist", "SubGroup": "Siege", "Translations": "Asmodan,Азмодан,Azmodán,Azmadan,아즈모단,阿兹莫丹,阿茲莫丹"},
  FaerieDragon: {"PrimaryName": "Brightwing", "ImageURL": "Brightwing", "AttributeName": "Faer", "Group": "Support", "SubGroup": "Healer", "Translations": "Luisaile,Funkelchen,Alafeliz,Jasnoskrzydła,Alachiara,СВЕТИК,Alasol,Asaluz,빛나래,光明之翼,亮翼"},
  Amazon: {"PrimaryName": "Cassia", "ImageURL": "Cassia", "AttributeName": "Amaz", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "Cássia,Kasja,Кассия,카시아,卡西娅,卡西雅"},
  Chen: {"PrimaryName": "Chen", "ImageURL": "Chen", "AttributeName": "Chen", "Group": "Warrior", "SubGroup": "Bruiser", "Translations": "Чэнь,Czen,첸,老陳,陈"},
  Cho: {"PrimaryName": "Cho", "ImageURL": "Cho", "AttributeName": "CCho", "Group": "Warrior", "SubGroup": "Tank", "Translations": "Чо,초,古,Czo,丘,Cha,Che"},
  Chromie: {"PrimaryName": "Chromie", "ImageURL": "Chromie", "AttributeName": "Chro", "Group": "Assassin", "SubGroup": "Burst Damage", "Translations": "Crona,Cromi,克罗米,克羅米,Chronia,Cromie,Хроми,크로미"},
  DVa: {"PrimaryName": "D.Va", "ImageURL": "DVa", "AttributeName": "DVA0", "Group": "Warrior", "SubGroup": "Tank", "Translations": "D.Va"},
  Dehaka: {"PrimaryName": "Dehaka", "ImageURL": "Dehaka", "AttributeName": "Deha", "Group": "Warrior", "SubGroup": "Bruiser", "Translations": "Дехака,데하카,德哈卡"},
  Diablo: {"PrimaryName": "Diablo", "ImageURL": "Diablo", "AttributeName": "Diab", "Group": "Warrior", "SubGroup": "Tank", "Translations": "ДИАБЛО,Диабло,디아블로,迪亚波罗,迪亞布羅"},
  L90ETC: {"PrimaryName": "E.T.C.", "ImageURL": "ETC", "AttributeName": "L90E", "Group": "Warrior", "SubGroup": "Tank", "Translations": "ETC,C.T.E.,정예 타우렌 족장,精英牛头人酋长,精英牛頭大佬"},
  Falstad: {"PrimaryName": "Falstad", "ImageURL": "Falstad", "AttributeName": "Fals", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "ФАЛСТАД,폴스타트,弗斯塔德"},
  Gall: {"PrimaryName": "Gall", "ImageURL": "Gall", "AttributeName": "Gall", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "Галл,갈,加尔,Gal,加利"},
  Garrosh: {"PrimaryName": "Garrosh", "ImageURL": "Garrosh", "AttributeName": "Garr", "Group": "Warrior", "SubGroup": "Tank", "Translations": "加尔鲁什,가로쉬,Гаррош"},
  Tinker: {"PrimaryName": "Gazlowe", "ImageURL": "Gazlowe", "AttributeName": "Tink", "Group": "Specialist", "SubGroup": "Siege", "Translations": "Gazleu,Gazol,Sparachiodi,ГАЗЛОУ,Gasganete,가즈로,加兹鲁维,加茲魯維"},
  Genji: {"PrimaryName": "Genji", "ImageURL": "Genji", "AttributeName": "Genj", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "Гэндзи,源氏,겐지"},
  Greymane: {"PrimaryName": "Greymane", "ImageURL": "Greymane", "AttributeName": "Genn", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "Cringris,Cringrís,Graumähne,Grisetête,Mantogrigio,Szarogrzywy,Седогрив,格雷迈恩,葛雷邁恩,그레이메인"},
  Guldan: {"PrimaryName": "Gul'dan", "ImageURL": "Guldan", "AttributeName": "Guld", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "古爾丹,古尔丹,Gul’dan,굴단,Гул'дан"},
  Illidan: {"PrimaryName": "Illidan", "ImageURL": "Illidan", "AttributeName": "Illi", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "ИЛЛИДАН,일리단,伊利丹"},
  Jaina: {"PrimaryName": "Jaina", "ImageURL": "Jaina", "AttributeName": "Jain", "Group": "Assassin", "SubGroup": "Burst Damage", "Translations": "Джайна,제이나,珍娜,吉安娜"},
  Crusader: {"PrimaryName": "Johanna", "ImageURL": "Johanna", "AttributeName": "Crus", "Group": "Warrior", "SubGroup": "Tank", "Translations": "요한나,Джоанна,乔汉娜,喬安娜"},
  Kaelthas: {"PrimaryName": "Kael'thas", "ImageURL": "Kaelthas", "AttributeName": "Kael", "Group": "Assassin", "SubGroup": "Burst Damage", "Translations": "Kael’thas,캘타스,凱爾薩斯,凯尔萨斯,Кель'тас"},
  Kerrigan: {"PrimaryName": "Kerrigan", "ImageURL": "Kerrigan", "AttributeName": "Kerr", "Group": "Assassin", "SubGroup": "Ambusher", "Translations": "КЕРРИГАН,케리건,凯瑞甘,凱莉根"},
  Monk: {"PrimaryName": "Kharazim", "ImageURL": "Kharazim", "AttributeName": "Monk", "Group": "Support", "SubGroup": "Healer", "Translations": "克拉辛,卡拉辛姆,카라짐,Каразим"},
  Leoric: {"PrimaryName": "Leoric", "ImageURL": "Leoric", "AttributeName": "Leor", "Group": "Warrior", "SubGroup": "Bruiser", "Translations": "Leoryk,Леорик,李奥瑞克,李奧瑞克,레오릭,Léoric"},
  LiLi: {"PrimaryName": "Li Li", "ImageURL": "LiLi", "AttributeName": "LiLi", "Group": "Support", "SubGroup": "Healer", "Translations": "ЛИ ЛИ,리 리,丽丽,莉莉"},
  Wizard: {"PrimaryName": "Li-Ming", "ImageURL": "LiMing", "AttributeName": "Wiza", "Group": "Assassin", "SubGroup": "Burst Damage", "Translations": "李敏,리밍,Ли-Мин"},
  Medic: {"PrimaryName": "Lt. Morales", "ImageURL": "LtMorales", "AttributeName": "Medi", "Group": "Support", "SubGroup": "Healer", "Translations": "Lt Morales,Ten. Morales,Teniente Morales,Tte. Morales,莫拉莉斯中尉,모랄레스 중위,Лейтенант Моралес,莫拉萊斯中尉,Por. Morales"},
  Lucio: {"PrimaryName": "Lúcio", "ImageURL": "Lúcio", "AttributeName": "Luci", "Group": "Support", "SubGroup": "Healer", "Translations": "Lucio,Лусио,루시우,卢西奥,路西歐"},
  Dryad: {"PrimaryName": "Lunara", "ImageURL": "Lunara", "AttributeName": "Drya", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "露娜拉,루나라,Лунара,AyHapa"},
  Malfurion: {"PrimaryName": "Malfurion", "ImageURL": "Malfurion", "AttributeName": "Malf", "Group": "Support", "SubGroup": "Healer", "Translations": "МАЛФУРИОН,말퓨리온,玛法里奥,瑪法里恩"},
  Malthael: {"PrimaryName": "Malthael", "ImageURL": "Malthael", "AttributeName": "MALT", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "Maltael,Malthaël,Малтаэль,马萨伊尔,瑪瑟爾,말티엘"},
  Medivh: {"PrimaryName": "Medivh", "ImageURL": "Medivh", "AttributeName": "Mdvh", "Group": "Specialist", "SubGroup": "Support", "Translations": "麥迪文,麦迪文,메디브,Медив"},
  Muradin: {"PrimaryName": "Muradin", "ImageURL": "Muradin", "AttributeName": "Mura", "Group": "Warrior", "SubGroup": "Tank", "Translations": "МУРАДИН,무라딘,穆拉丁"},
  Murky: {"PrimaryName": "Murky", "ImageURL": "Murky", "AttributeName": "Murk", "Group": "Specialist", "SubGroup": "Utility", "Translations": "Bourbie,Męcik,Fosky,МУРЧАЛЬ,Murquinho,머키,鱼人,奔波尔霸,莫奇"},
  WitchDoctor: {"PrimaryName": "Nazeebo", "ImageURL": "Nazeebo", "AttributeName": "Witc", "Group": "Specialist", "SubGroup": "Sustained Damage", "Translations": "Witch Doctor,Féticheur,Hexendoktor,Medico Brujo,Szaman,Sciamano,Nasibo,Nazebo,Назибо,Nazibo,나지보,纳兹波,納奇班"},
  Nova: {"PrimaryName": "Nova", "ImageURL": "Nova", "AttributeName": "Nova", "Group": "Assassin", "SubGroup": "Ambusher", "Translations": "НОВА,노바,诺娃,諾娃"},
  Probius: {"PrimaryName": "Probius", "ImageURL": "Probius", "AttributeName": "Prob", "Group": "Specialist", "SubGroup": "Siege", "Translations": "Sondius,Пробиус,普罗比斯,普羅比斯,Probiusz,프로비우스,EDN-OS"},
  Ragnaros: {"PrimaryName": "Ragnaros", "ImageURL": "Ragnaros", "AttributeName": "Ragn", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "拉格納羅斯,拉格纳罗斯,라그나로스,Рагнарос"},
  Raynor: {"PrimaryName": "Raynor", "ImageURL": "Raynor", "AttributeName": "Rayn", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "РЕЙНОР,레이너,雷诺,雷諾"},
  Rehgar: {"PrimaryName": "Rehgar", "ImageURL": "Rehgar", "AttributeName": "Rehg", "Group": "Support", "SubGroup": "Healer", "Translations": "РЕГАР,레가르,雷加尔,雷加"},
  Rexxar: {"PrimaryName": "Rexxar", "ImageURL": "Rexxar", "AttributeName": "Rexx", "Group": "Warrior", "SubGroup": "Tank", "Translations": "Рексар,雷克萨,雷克薩,렉사르"},
  Samuro: {"PrimaryName": "Samuro", "ImageURL": "Samuro", "AttributeName": "Samu", "Group": "Assassin", "SubGroup": "Ambusher", "Translations": "萨穆罗,薩姆羅,Самуро,사무로,Samura"},
  SgtHammer: {"PrimaryName": "Sgt. Hammer", "ImageURL": "SgtHammer", "AttributeName": "Sgth", "Group": "Specialist", "SubGroup": "Siege", "Translations": "Sgt Marteau,Sergeant Hammer,Sgto. Hammer,Sierżant Petarda,Sergente Hammer,Sgto. Martillo,Сержант Кувалда,Sargento Maza,Sgt. Marreta,해머 상사,重锤军士,榔頭中士,Sierż. Petarda"},
  Barbarian: {"PrimaryName": "Sonya", "ImageURL": "Sonya", "AttributeName": "Barb", "Group": "Warrior", "SubGroup": "Bruiser", "Translations": "Sonia,Barbare,Barbarian,Barbarin,Bárbara,Соня,야만용사,野蛮人,소냐,野蠻人,桑娅,桑雅"},
  Stitches: {"PrimaryName": "Stitches", "ImageURL": "Stitches", "AttributeName": "Stit", "Group": "Warrior", "SubGroup": "Tank", "Translations": "Kleiner,Puntos,Zszywaniec,Tritacarne,Balafré,СТЕЖОК,Suturino,누더기,缝合怪,縫合怪"},
  Stukov: {"PrimaryName": "Stukov", "ImageURL": "Stukov", "AttributeName": "STUK", "Group": "Support", "SubGroup": "Healer", "Translations": "斯杜科夫,스투코프,Stiukow,Стуков,斯托科夫"},
  Sylvanas: {"PrimaryName": "Sylvanas", "ImageURL": "Sylvanas", "AttributeName": "Sylv", "Group": "Specialist", "SubGroup": "Siege", "Translations": "Sylvana,希尔瓦娜斯,希瓦娜斯,실바나스,Sylwana,Сильвана"},
  Tassadar: {"PrimaryName": "Tassadar", "ImageURL": "Tassadar", "AttributeName": "Tass", "Group": "Support", "SubGroup": "Support", "Translations": "ТАССАДАР,태사다르,塔萨达尔,塔薩達,Тассадар"},
  Butcher: {"PrimaryName": "The Butcher", "ImageURL": "TheButcher", "AttributeName": "Butc", "Group": "Assassin", "SubGroup": "Ambusher", "Translations": "El Carnicero,O Açougueiro,屠夫,도살자,Der Schlächter,Мясник,Le Boucher,Macellaio,Rzeźnik"},
  LostVikings: {"PrimaryName": "The Lost Vikings", "ImageURL": "TheLostVikings", "AttributeName": "Lost", "Group": "Specialist", "SubGroup": "Utility", "Translations": "Os Vikings Perdidos,Потерявшиеся викинги,Los Vikingos perdidos,Les Vikings perdus,Vichinghi Sperduti,Zaginieni Wikingowie,Lost Vikings,失落的維京人,失落的维京人,길 잃은 바이킹"},
  Thrall: {"PrimaryName": "Thrall", "ImageURL": "Thrall", "AttributeName": "Thra", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "Тралл,萨尔,스랄,索爾"},
  Tracer: {"PrimaryName": "Tracer", "ImageURL": "Tracer", "AttributeName": "Tra0", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "Трейсер,Smuga,猎空,트레이서,閃光"},
  Tychus: {"PrimaryName": "Tychus", "ImageURL": "Tychus", "AttributeName": "Tych", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "ТАЙКУС,타이커스,泰凯斯,泰科斯"},
  Tyrael: {"PrimaryName": "Tyrael", "ImageURL": "Tyrael", "AttributeName": "Tyrl", "Group": "Warrior", "SubGroup": "Bruiser", "Translations": "ТИРАЭЛЬ,Tyraël,티리엘,泰瑞尔,泰瑞爾"},
  Tyrande: {"PrimaryName": "Tyrande", "ImageURL": "Tyrande", "AttributeName": "Tyrd", "Group": "Support", "SubGroup": "Support", "Translations": "ТИРАНДА,티란데,泰兰德,泰蘭妲"},
  Uther: {"PrimaryName": "Uther", "ImageURL": "Uther", "AttributeName": "Uthe", "Group": "Support", "SubGroup": "Healer", "Translations": "УТЕР,우서,乌瑟尔,烏瑟"},
  Valeera: {"PrimaryName": "Valeera", "ImageURL": "Valeera", "AttributeName": "VALE", "Group": "Assassin", "SubGroup": "Ambusher", "Translations": "Valira,Валира,瓦莉拉,瓦麗拉,발리라"},
  DemonHunter: {"PrimaryName": "Valla", "ImageURL": "Valla", "AttributeName": "Demo", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "Vala,Demon Hunter,Chasseuse De Demons,Dämonenjägerin,Cazadora de demonios,Łowczyni Demonów,Cacciatrice di Demoni,Валла,Tyla,Caçadora de Demônios,악마사냥꾼,발라,猎魔人,狩魔獵人,维拉,維拉"},
  Varian: {"PrimaryName": "Varian", "ImageURL": "Varian", "AttributeName": "Vari", "Group": "Assassin", "SubGroup": "Bruiser", "Translations": "瓦里安,바리안,Вариан,바리인"},
  Necromancer: {"PrimaryName": "Xul", "ImageURL": "Xul", "AttributeName": "Necr", "Group": "Specialist", "SubGroup": "Siege", "Translations": "蘇爾,祖尔,줄,Зул"},
  Zagara: {"PrimaryName": "Zagara", "ImageURL": "Zagara", "AttributeName": "Zaga", "Group": "Specialist", "SubGroup": "Siege", "Translations": "ЗАГАРА,자가라,扎加拉,札迦拉"},
  Zarya: {"PrimaryName": "Zarya", "ImageURL": "Zarya", "AttributeName": "Zary", "Group": "Warrior", "SubGroup": "Tank", "Translations": "札莉雅,查莉娅,자리야,Zaria,Заря,자라야"},
  Zeratul: {"PrimaryName": "Zeratul", "ImageURL": "Zeratul", "AttributeName": "Zera", "Group": "Assassin", "SubGroup": "Ambusher", "Translations": "ЗЕРАТУЛ,제라툴,泽拉图,澤拉圖"},
  Zuljin: {"PrimaryName": "Zul'jin", "ImageURL": "Zuljin", "AttributeName": "ZULJ", "Group": "Assassin", "SubGroup": "Sustained Damage", "Translations": "Zul’jin,祖爾金,祖尔金,줄진,Зул'джин"}
};
function heroByAttr(attrName){
  for(var i in altNames)
    if(altNames[i].AttributeName === attrName) return i;
  return null;
}

var gameTypes = {
  6: 'Unranked',
  7: 'Quick Match',
  8: 'Hero League',
  9: 'Team League'
};

var fullGameTypes = {
  6: 'Unranked Draft',
  7: 'Quick Match',
  8: 'Hero League',
  9: 'Team League'
}

var regions = {
  1: 'North America'
}

var months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
];

var dropdowns = document.getElementsByClassName('dropdown');
for(var i in dropdowns){
  if(dropdowns[i].children) dropdowns[i].addEventListener('click', function(){
    this.className = this.className === 'dropdown' ? 'dropdown active' : 'dropdown';
  })
}

function getDate(date){
  if(date == null) date = Date.now();
  date = new Date(date);
  return date.getUTCDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
}

function getTimeSince(date){
  var elapsed = Date.now() - date;
  var unit;
  if(elapsed > 1000 * 60 * 60){
    unit = 'hour';
    elapsed = Math.floor(elapsed / (1000 * 60 * 60));
  } else if(elapsed > 1000 * 60){
    unit = 'minute';
    elapsed = Math.floor(elapsed / (1000 * 60));
  } else {
    unit = 'second';
    elapsed = Math.floor(elapsed / 1000);
  }
  return elapsed + ' ' + unit + (elapsed === 1 ? '' : 's');
}
