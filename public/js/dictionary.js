Number.prototype.pad = function(size) {
  var s = String(this);
  while(s.length < (size || 2)){
    s = "0" + s;
  }
  return s;
}

var altNames = {
  Amazon: 'Cassia',
  Anubarak: 'Anub\'arak',
  Barbarian: 'Sonya',
  Crusader: 'Johanna',
  DemonHunter: 'Valla',
  Dryad: 'Lunara',
  DVa: 'D.Va',
  FaerieDragon: 'Brightwing',
  Guldan: 'Gul\'dan',
  Kaelthas: 'Kael\'thas',
  L90ETC: 'ETC',
  LiLi: 'Li Li',
  LostVikings: 'The Lost Vikings',
  Lucio: 'Lúcio',
  Medic: 'Lt. Morales',
  Monk: 'Kharazim',
  Necromancer: 'Xul',
  SgtHammer: 'Sgt. Hammer',
  Tinker: 'Gazlowe',
  WitchDoctor: 'Nazeebo',
  Wizard: 'Li-Ming',
  Zuljin: 'Zul\'jin'
};

var gametypes = {
  5: 'Unranked',
  6: 'Quick Match',
  7: 'Hero League',
  8: 'Team League'
};

var fullGametypes = {
  5: 'Unranked Draft',
  6: 'Quick Match',
  7: 'Hero League',
  8: 'Team League'
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
