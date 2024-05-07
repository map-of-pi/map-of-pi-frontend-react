import { LatLngExpression } from 'leaflet';

export interface ICoordinate {
  lat: number;
  lng: number;
}

export const dummyCoordinates: LatLngExpression[] = [
  { lat: 28.1234, lng: -15.4365 },
  { lat: 28.1256, lng: -15.4342 },
  { lat: 28.1198, lng: -15.4301 },
  { lat: 28.1283, lng: -15.4389 },
  { lat: 28.1267, lng: -15.4432 },
  { lat: 28.1211, lng: -15.4467 },
  { lat: 28.1189, lng: -15.4355 },
  { lat: 28.1223, lng: -15.4398 },
  { lat: 28.1239, lng: -15.4421 },
  { lat: 28.1265, lng: -15.4347 },
  { lat: 28.1247, lng: -15.4321 },
  { lat: 28.1276, lng: -15.4312 },
  { lat: 28.1202, lng: -15.4376 },
  { lat: 28.1193, lng: -15.4409 },
  { lat: 28.1229, lng: -15.4445 },
  { lat: 28.1254, lng: -15.4387 },
  { lat: 28.1232, lng: -15.4336 },
  { lat: 28.1278, lng: -15.4392 },
  { lat: 28.1245, lng: -15.4359 },
  { lat: 28.1215, lng: -15.4412 },
  { lat: 28.1283, lng: -15.4389 },
  { lat: 28.1, lng: -15.45 },
  { lat: -1.9676713450672898, lng: 30.190665829199233 },
  { lat: 28.1267, lng: -15.4432 },
  { lat: 28.1211, lng: -15.4467 },
  { lat: 28.1189, lng: -15.4355 },
  { lat: 28.1223, lng: -15.4398 },
  { lat: 30.0444, lng: 31.2357 }, // Cairo, Egypt
  { lat: 36.8065, lng: 10.1815 }, // Tunis, Tunisia
  { lat: 34.0333, lng: -6.85 }, // Rabat, Morocco
  { lat: 35.6895, lng: 10.9422 }, // Sfax, Tunisia
  { lat: 32.2808, lng: -9.2333 }, // Agadir, Morocco
  { lat: 27.1767, lng: 31.1859 }, // Luxor, Egypt
  { lat: 31.6338, lng: -8.0083 }, // Marrakesh, Morocco
  { lat: 30.7875, lng: 29.7077 }, // Alexandria, Egypt
  { lat: 33.9716, lng: -6.8498 }, // Casablanca, Morocco
  { lat: 33.8869, lng: 9.5375 }, // Monastir, Tunisia
  // West Africa
  { lat: 6.5244, lng: 3.3792 }, // Lagos, Nigeria
  { lat: 6.2094, lng: -1.6643 }, // Accra, Ghana
  { lat: 5.560014, lng: -0.205744 }, // Tema, Ghana
  { lat: 5.6333, lng: -0.2333 }, // Accra, Ghana
  { lat: 9.0579, lng: 7.4951 }, // Abuja, Nigeria
  { lat: 6.335, lng: 5.627 }, // Ibadan, Nigeria
  { lat: 9.0579, lng: 7.4951 }, // Abuja, Nigeria
  { lat: 14.6928, lng: -17.4467 }, // Dakar, Senegal
  { lat: 13.4549, lng: -16.579 }, // Banjul, Gambia
  { lat: 8.484, lng: -13.22994 }, // Freetown, Sierra Leone
  // East Africa
  { lat: -1.2921, lng: 36.8219 }, // Nairobi, Kenya
  { lat: -6.1659, lng: 39.2026 }, // Dar es Salaam, Tanzania
  { lat: -3.3725, lng: 29.3602 }, // Bujumbura, Burundi
  { lat: -1.9536, lng: 30.0606 }, // Kigali, Rwanda
  { lat: 0.3136, lng: 32.5811 }, // Kampala, Uganda
  { lat: -1.9706, lng: 30.1044 }, // Entebbe, Uganda
  { lat: -0.7893, lng: 36.8237 }, // Thika, Kenya
  { lat: -0.0236, lng: 37.9062 }, // Nakuru, Kenya
  { lat: -4.0435, lng: 39.6682 }, // Mombasa, Kenya
  // Central Africa
  { lat: 4.0511, lng: 9.7679 }, // Douala, Cameroon
  { lat: 0.3317, lng: 6.7311 }, // Libreville, Gabon
  { lat: 3.848, lng: 11.5021 }, // Yaoundé, Cameroon
  { lat: 6.1303, lng: 1.2163 }, // Lomé, Togo
  { lat: 4.0615, lng: 9.7875 }, // Bafoussam, Cameroon
  { lat: 4.0435, lng: 9.7043 }, // Buea, Cameroon
  { lat: 4.0667, lng: 9.7333 }, // Limbe, Cameroon
  { lat: 2.9404, lng: 9.9104 }, // Kribi, Cameroon
  { lat: 3.8667, lng: 11.5167 }, // Doumé, Cameroon
  // Southern Africa
  { lat: -25.746, lng: 28.1881 }, // Pretoria, South Africa
  { lat: -17.8252, lng: 31.0335 }, // Harare, Zimbabwe
  { lat: -33.9249, lng: 18.4241 }, // Cape Town, South Africa
  { lat: -19.0154, lng: 29.1549 }, // Bulawayo, Zimbabwe
  { lat: -26.2041, lng: 28.0473 }, // Johannesburg, South Africa
  { lat: -29.8579, lng: 31.0292 }, // Durban, South Africa
  { lat: -22.9576, lng: 18.4904 }, // Windhoek, Namibia
  { lat: -22.5597, lng: 17.0832 }, // Gaborone, Botswana
  { lat: -22.57, lng: 17.083611 }, // Gaborone, Botswana
  { lat: -22.2666, lng: 26.7247 }, // Mahalapye, Botswana
  // Other regions
  { lat: 11.8251, lng: 42.5903 }, // Djibouti City, Djibouti
  { lat: 12.05, lng: -61.75 }, // Saint George's, Grenada
  { lat: -4.4419, lng: 15.2663 }, // Brazzaville, Congo
  { lat: -25.746, lng: 28.1881 }, // Pretoria, South Africa
  { lat: -17.8252, lng: 31.0335 }, // Harare, Zimbabwe
  { lat: -33.9249, lng: 18.4241 }, // Cape Town, South Africa
  { lat: -19.0154, lng: 29.1549 }, // Bulawayo, Zimbabwe
  { lat: -26.2041, lng: 28.0473 }, // Johannesburg, South Africa
  { lat: -29.8579, lng: 31.0292 }, // Durban, South Africa
  { lat: -22.9576, lng: 18.4904 }, // Windhoek, Namibia
  { lat: -22.5597, lng: 17.0832 }, // Gaborone, Botswana
  { lat: -22.57, lng: 17.083611 }, // Gaborone, Botswana
  { lat: -22.2666, lng: 26.7247 }, // Mahalapye, Botswana
  { lat: 30.033, lng: 31.233 }, // Cairo, Egypt
  { lat: 30.0626, lng: 31.2497 }, // Heliopolis, Egypt
  { lat: 31.205753, lng: 29.924526 }, // Alexandria, Egypt
  { lat: 36.8065, lng: 10.1815 }, // Tunis, Tunisia
  { lat: 33.8869, lng: 9.5375 }, // Monastir, Tunisia
  { lat: 36.4614, lng: 10.7351 }, // Nabeul, Tunisia
  { lat: 33.8948, lng: 8.551 }, // Sousse, Tunisia
  { lat: 35.6895, lng: 10.9422 }, // Sfax, Tunisia
  { lat: 37.2763, lng: 9.8733 }, // Bizerte, Tunisia
  { lat: 30.7875, lng: 29.7077 }, // Alexandria, Egypt
  { lat: 31.6338, lng: -8.0083 }, // Marrakesh, Morocco
  { lat: 31.7917, lng: -7.0926 }, // Ouarzazate, Morocco
  { lat: 33.9716, lng: -6.8498 }, // Casablanca, Morocco
  { lat: 34.0333, lng: -6.85 }, // Rabat, Morocco
  { lat: 32.2808, lng: -9.2333 }, // Agadir, Morocco
  { lat: 27.1767, lng: 31.1859 }, // Luxor, Egypt
  { lat: 30.0444, lng: 31.2357 }, // Cairo, Egypt
  { lat: 36.8065, lng: 10.1815 }, // Tunis, Tunisia
  { lat: 34.0333, lng: -6.85 }, // Rabat, Morocco
  { lat: 35.6895, lng: 10.9422 }, // Sfax, Tunisia
  { lat: 32.2808, lng: -9.2333 }, // Agadir, Morocco
  { lat: 27.1767, lng: 31.1859 }, // Luxor, Egypt
  { lat: 31.6338, lng: -8.0083 }, // Marrakesh, Morocco
  { lat: 30.7875, lng: 29.7077 }, // Alexandria, Egypt
  { lat: 33.9716, lng: -6.8498 }, // Casablanca, Morocco
  { lat: 33.8869, lng: 9.5375 }, // Monastir, Tunisia
  { lat: 6.5244, lng: 3.3792 }, // Lagos, Nigeria
  { lat: 6.2094, lng: -1.6643 }, // Accra, Ghana
  { lat: 5.560014, lng: -0.205744 }, // Tema, Ghana
  { lat: 5.6333, lng: -0.2333 }, // Accra, Ghana
  { lat: 9.0579, lng: 7.4951 }, // Abuja, Nigeria
  { lat: 6.335, lng: 5.627 }, // Ibadan, Nigeria
  { lat: 9.0579, lng: 7.4951 }, // Abuja, Nigeria
  { lat: 14.6928, lng: -17.4467 }, // Dakar, Senegal
  { lat: 13.4549, lng: -16.579 }, // Banjul, Gambia
  { lat: 8.484, lng: -13.22994 }, // Freetown, Sierra Leone
  { lat: -1.9437, lng: 30.0596 }, // Gasabo
  { lat: -1.9562, lng: 30.0914 }, // Kicukiro
  { lat: -1.9403, lng: 30.0658 }, // Nyarugenge

  // Southern Province
  { lat: -2.6042, lng: 29.7291 }, // Gisagara
  { lat: -2.2833, lng: 29.75 }, // Huye
  { lat: -2.4628, lng: 29.5725 }, // Kamonyi
  { lat: -2.0257, lng: 29.3491 }, // Muhanga
  { lat: -2.4597, lng: 29.5613 }, // Nyanza
  { lat: -2.1233, lng: 29.7606 }, // Nyaruguru
  { lat: -2.3707, lng: 29.7233 }, // Ruhango

  // Northern Province
  { lat: -1.6957, lng: 29.2587 }, // Burera
  { lat: -1.6279, lng: 29.7451 }, // Gakenke
  { lat: -1.7322, lng: 29.4604 }, // Gicumbi
  { lat: -1.9853, lng: 29.6832 }, // Musanze
  { lat: -1.7435, lng: 29.4313 }, // Rulindo

  // Eastern Province
  { lat: -1.5303, lng: 30.0676 }, // Bugesera
  { lat: -1.9519, lng: 30.2516 }, // Gatsibo
  { lat: -2.0008, lng: 30.1195 }, // Kayonza
  { lat: -2.4905, lng: 30.1341 }, // Kirehe
  { lat: -1.9506, lng: 30.4119 }, // Ngoma
  { lat: -2.4098, lng: 30.426 }, // Nyagatare

  // Western Province
  { lat: -2.3483, lng: 29.6942 }, // Karongi
  { lat: -2.2076, lng: 29.0868 }, // Ngororero
  { lat: -2.6033, lng: 29.7567 }, // Nyabihu
  { lat: -1.9374, lng: 29.9178 }, // Nyamasheke
  { lat: -2.5895, lng: 29.7435 }, // Rubavu
  { lat: -2.4535, lng: 29.6947 }, // Rusizi
  { lat: -2.5741, lng: 29.7454 }, // Rutsiro
  { lat: 51.5074, lng: -0.1278 }, // London
  { lat: 52.4862, lng: -1.8904 }, // Birmingham
  { lat: 53.4084, lng: -2.9916 }, // Liverpool
  { lat: 53.8008, lng: -1.5491 }, // Leeds
  { lat: 52.6369, lng: -1.1398 }, // Leicester
  { lat: 51.4545, lng: -2.5879 }, // Bristol
  { lat: 52.6295, lng: -1.123 }, // Coventry
  { lat: 53.4808, lng: -2.2426 }, // Manchester
  { lat: 51.4543, lng: -0.9781 }, // Reading
  { lat: 51.3758, lng: -2.3599 }, // Bath
  { lat: 51.4826, lng: -3.1785 }, // Cardiff
  { lat: 52.1307, lng: -3.7837 }, // Aberystwyth
  { lat: 50.7184, lng: -1.8806 }, // Southampton
  { lat: 52.4068, lng: -1.5197 }, // Solihull
  { lat: 50.3755, lng: -4.1427 }, // Plymouth
  { lat: 51.45, lng: -2.5833 }, // South Gloucestershire
  { lat: 52.1936, lng: 0.1561 }, // Cambridge
  { lat: 52.0406, lng: -0.7594 }, // Bedford
  { lat: 53.8008, lng: -1.5491 }, // Leeds
  { lat: 50.9097, lng: -1.4044 }, // Portsmouth

  // Scotland
  { lat: 55.9533, lng: -3.1883 }, // Edinburgh
  { lat: 55.8642, lng: -4.2518 }, // Glasgow
  { lat: 56.4907, lng: -4.2026 }, // Fort William
  { lat: 57.4778, lng: -4.2247 }, // Inverness
  { lat: 57.1497, lng: -2.0943 }, // Aberdeen
  { lat: 56.343, lng: -2.7956 }, // St Andrews
  { lat: 56.0717, lng: -3.4523 }, // Falkirk
  { lat: 55.9411, lng: -3.1889 }, // Livingston
  { lat: 55.9533, lng: -3.1883 }, // Edinburgh
  { lat: 56.4907, lng: -4.2026 }, // Fort William

  // Wales
  { lat: 51.4816, lng: -3.1791 }, // Cardiff
  { lat: 51.6214, lng: -3.9436 }, // Swansea
  { lat: 51.8139, lng: -3.0291 }, // Brecon Beacons
  { lat: 51.6472, lng: -3.1207 }, // Pontypridd
  { lat: 51.7917, lng: -3.229 }, // Merthyr Tydfil
  { lat: 51.8797, lng: -3.9861 }, // Carmarthen
  { lat: 52.7101, lng: -3.8936 }, // Aberystwyth
  { lat: 53.2765, lng: -3.826 }, // Bangor
  { lat: 53.324, lng: -3.8305 }, // Conwy
  { lat: 51.4816, lng: -3.1791 }, // Cardiff

  // Northern Ireland
  { lat: 54.5973, lng: -5.9301 }, // Belfast
  { lat: 54.352, lng: -6.6588 }, // Armagh
  { lat: 54.331, lng: -6.4323 }, // Dungannon
  { lat: 54.9047, lng: -6.2751 }, // Derry
  { lat: 54.6538, lng: -5.6639 }, // Bangor
  { lat: 54.338, lng: -7.6452 }, // Enniskillen
  { lat: 54.4761, lng: -6.3353 }, // Lisburn
  { lat: 54.5207, lng: -6.0426 }, // Antrim
  { lat: 54.6194, lng: -5.8747 }, // Newtownards
  { lat: 54.5973, lng: -5.9301 },

  { lat: 6.5244, lng: 3.3792 }, // Lagos
  { lat: 9.0579, lng: 7.4951 }, // Abuja
  { lat: 6.5244, lng: 7.5603 }, // Onitsha
  { lat: 10.3093, lng: 9.8439 }, // Maiduguri
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 10.3167, lng: 9.0833 }, // Kano
  { lat: 4.8156, lng: 7.0498 }, // Port Harcourt
  { lat: 11.8469, lng: 13.1571 }, // Sokoto
  { lat: 5.5557, lng: 5.7818 }, // Benin City
  { lat: 7.1907, lng: 3.4158 }, // Abeokuta
  { lat: 10.2923, lng: 13.2687 }, // Yola
  { lat: 11.9653, lng: 8.315 }, // Gusau
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan
  { lat: 7.3775, lng: 3.947 }, // Ibadan

  // Egypt
  { lat: 30.0444, lng: 31.2357 }, // Cairo
  { lat: 30.0626, lng: 31.2497 }, // Heliopolis
  { lat: 31.205753, lng: 29.924526 }, // Alexandria
  { lat: 27.1767, lng: 31.1859 }, // Luxor
  { lat: 31.7917, lng: -7.0926 }, // Ouarzazate
  { lat: 30.7875, lng: 29.7077 }, // Alexandria
  { lat: 36.8065, lng: 10.1815 }, // Tunis
  { lat: 34.0333, lng: -6.85 }, // Rabat
  { lat: 35.6895, lng: 10.9422 }, // Sfax
  { lat: 32.2808, lng: -9.2333 }, // Agadir
  { lat: 27.1767, lng: 31.1859 }, // Luxor
  { lat: 33.9716, lng: -6.8498 }, // Casablanca
  { lat: 33.8869, lng: 9.5375 }, // Monastir
  { lat: 36.4614, lng: 10.7351 }, // Nabeul
  { lat: 33.8948, lng: 8.551 }, // Sousse
  { lat: 35.6895, lng: 10.9422 }, // Sfax
  { lat: 37.2763, lng: 9.8733 }, // Bizerte
  { lat: 31.6338, lng: -8.0083 }, // Marrakesh
  { lat: 33.9716, lng: -6.8498 }, // Casablanca
  { lat: 33.8869, lng: 9.5375 }, // Monastir
  { lat: 36.4614, lng: 10.7351 }, // Nabeul
  { lat: 33.8948, lng: 8.551 }, // Sousse
  { lat: 35.6895, lng: 10.9422 }, // Sfax
  { lat: 37.2763, lng: 9.8733 }, // Bizerte

  // Algeria
  { lat: 36.7372, lng: 3.087 }, // Algiers
  { lat: 36.2927, lng: 1.9836 }, // Constantine
  { lat: 36.7528, lng: 3.042 }, // Boumerdès
  { lat: 35.6976, lng: 0.6353 }, // Oran
  { lat: 35.5428, lng: -0.618 }, // Tlemcen
  { lat: 35.705, lng: -0.6253 }, // Tlemcen
  { lat: 35.282, lng: 1.645 }, // Béjaïa
  { lat: 36.7651, lng: 5.0843 }, // Skikda
  { lat: 36.2439, lng: 1.971 }, // Constantine
  { lat: 35.1972, lng: 1.6432 }, // Béjaïa
  { lat: 34.8506, lng: 0.1403 }, // Tizi Ouzou
  { lat: 37.5665, lng: 126.978 }, // Seoul
  { lat: 35.1796, lng: 129.0756 }, // Busan
  { lat: 35.8714, lng: 128.6014 }, // Daegu
  { lat: 36.3504, lng: 127.3845 }, // Daejeon
  { lat: 37.4572, lng: 126.7372 }, // Incheon
  { lat: 35.1595, lng: 126.8526 }, // Gwangju
  { lat: 35.2321, lng: 129.0825 }, // Ulsan
  { lat: 37.9075, lng: 127.0596 }, // Gyeonggi
  { lat: 37.8856, lng: 127.73 }, // Gangwon
  { lat: 36.8003, lng: 127.7007 }, // Chungcheong
  { lat: 35.5413, lng: 126.7317 }, // Jeolla
  { lat: 36.5763, lng: 128.5053 }, // Gyeongsang
  { lat: 33.4996, lng: 126.5312 }, // Jeju
  { lat: 35.5184, lng: 129.3624 }, // Gyeongbuk
  { lat: 35.5494, lng: 126.9056 }, // Gyeongnam
  { lat: 36.0322, lng: 129.3652 }, // Pohang
  { lat: 35.0728, lng: 129.052 }, // Yangsan
  { lat: 35.2331, lng: 129.0823 }, // Ulsan
  { lat: 36.2008, lng: 127.054 }, // Sejong
  { lat: 37.526, lng: 127.134 }, // Seoul
  { lat: 37.4486, lng: 126.6685 }, // Incheon
  { lat: 35.1667, lng: 129.0667 }, // Busan
  { lat: 35.1414, lng: 126.793 }, // Gwangju
  { lat: 37.5665, lng: 126.978 }, // Seoul
  { lat: 37.2894, lng: 127.0082 }, // Suwon
  { lat: 37.2636, lng: 127.0286 }, // Bundang
  { lat: 37.5683, lng: 126.9778 }, // Jongno
  { lat: 37.2753, lng: 127.0094 }, // Yongin
  { lat: 35.2027, lng: 128.1227 }, // Gimhae
  { lat: 35.242, lng: 128.6811 }, // Changwon
  { lat: 35.1116, lng: 126.8512 },
];
