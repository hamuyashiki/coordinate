/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * 管理者設定画面jabascript でやること
 * １．"データをメイン画面に反映"ボタンを押されたときに
 *     管理者設定用画面で設定した 材料名、献立名、名前　を取得し
 *     メイン画面用jsで読み込む変数に保存する
 * ２．メイン画面から管理者画面に戻ってきたときに　前回の設定値をテーブルに反映する
 * ３．入力された材料テーブル、献立名を　材料-献立テーブルの軸に転記する * 
 * ４．初期設定値を準備し、"初期設定を使う"ボタンが押されたとき　各設定テーブルに反映する
 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

 
/**
 * 1-1) "データをメイン画面に反映"ボタンを押されたときに呼び出される関数の定義
 *      管理者設定用画面で設定した　材料名、献立名、名前を　変数に入れる
 */
function adminSettingGet() {

  // 材料テーブル読み出し
  var arrySyokuzaiSettei = document.getElementsByName("syokuzai-settei")
  var zairyouName = "";
  // 配列の要素(最後の1要素を除く)を "," でつないだ文字列に変換
  for (i = 0; i < (arrySyokuzaiSettei.length - 1); i++) {
    zairyouName = zairyouName + arrySyokuzaiSettei[i].value + ','
  };
  // 配列の要素(最後の1要素)を文字列に追加
  zairyouName = zairyouName + arrySyokuzaiSettei[arrySyokuzaiSettei.length - 1].value  
  // js-kondate-main*.htmlで読み出せるようlocalStorageに保存する
  localStorage.setItem('key1', zairyouName);

  // 献立テーブル読み出し
  var arryMenuSettei = document.getElementsByName("kondate-settei")
  var menuName = "";
  // 配列の要素(最後の1要素を除く)を "," でつないだ文字列に変換
  for (i = 0; i < (arryMenuSettei.length - 1); i++) {
    menuName = menuName + arryMenuSettei[i].value + ','
  };
  // 配列の要素(最後の1要素)を文字列に追加
  menuName = menuName + arryMenuSettei[arryMenuSettei.length - 1].value  
  // js-kondate-main*.htmlで読み出せるようlocalStorageに保存する
  localStorage.setItem('key2', menuName);

  // 名前テーブル読み出し
  var arryNamaeSettei = document.getElementsByName("namae-settei")
  var namae = "";
  // 配列の要素(最後の1要素を除く)を "," でつないだ文字列に変換
  for (i = 0; i < (arryNamaeSettei.length - 1); i++) {
    namae = namae + arryNamaeSettei[i].value + ','
  };
  // 配列の要素(最後の1要素)を文字列に追加
  namae = namae + arryNamaeSettei[arryNamaeSettei.length - 1].value  
  // js-kondate-main*.htmlで読み出せるようlocalStorageに保存する
  localStorage.setItem('key3', namae);

  /**
   * 1-2) 材料-献立テーブルcheckboxの状態を読み出し
   *      配列の要素を "," でつないだ文字列に変換し変数に入れる
  */
 // checkboxの状態取得し0,1として変数に保存
  var menuNo1 = document.getElementsByName("menuNo1");
  if (menuNo1[0].checked) {
    var mustZairyouMenu1 = 1;
  } else {
    mustZairyouMenu1 = 0;
  }
  for (i = 1; i < menuNo1.length; i++) {
    if (menuNo1[i].checked) {
      var a = 1;
    } else {
      var a = 0;
    }
    mustZairyouMenu1 = mustZairyouMenu1 + ',' + a
  }
  var menuNo2 = document.getElementsByName("menuNo2");
  if (menuNo2[0].checked) {
    var mustZairyouMenu2 = 1;
  } else {
    mustZairyouMenu2 = 0;
  }
  for (i = 1; i < menuNo2.length; i++) {
    if (menuNo2[i].checked) {
      var b = 1;
    } else {
      var b = 0;
    }
    mustZairyouMenu2 = mustZairyouMenu2 + ',' + b
  }
  var menuNo3 = document.getElementsByName("menuNo3");
  if (menuNo3[0].checked) {
    var mustZairyouMenu3 = 1;
  } else {
    mustZairyouMenu3 = 0;
  }
  for (i = 1; i < menuNo3.length; i++) {
    if (menuNo3[i].checked) {
      var c = 1;
    } else {
      var c = 0;
    }
    mustZairyouMenu3 = mustZairyouMenu3 + ',' + c
  }
  var menuNo4 = document.getElementsByName("menuNo4");
  if (menuNo4[0].checked) {
    var mustZairyouMenu4 = 1;
  } else {
    mustZairyouMenu4 = 0;
  }
  for (i = 1; i < menuNo1.length; i++) {
    if (menuNo4[i].checked) {
      var d = 1;
    } else {
      var d = 0;
    }
    mustZairyouMenu4 = mustZairyouMenu4 + ',' + d
  }
  var menuNo5 = document.getElementsByName("menuNo5");
  if (menuNo5[0].checked) {
    var mustZairyouMenu5 = 1;
  } else {
    mustZairyouMenu5 = 0;
  }
  for (i = 1; i < menuNo5.length; i++) {
    if (menuNo5[i].checked) {
      var e = 1;
    } else {
      var e = 0;
    }
    mustZairyouMenu5 = mustZairyouMenu5 + ',' + e
  }
  var menuNo6 = document.getElementsByName("menuNo6");
  if (menuNo6[0].checked) {
    var mustZairyouMenu6 = 1;
  } else {
    mustZairyouMenu6 = 0;
  }
  for (i = 1; i < menuNo6.length; i++) {
    if (menuNo6[i].checked) {
      var f = 1;
    } else {
      var f = 0;
    }
    mustZairyouMenu6 = mustZairyouMenu6 + ',' + f
  }
  /* 
   * 1-3) メイン画面のjsで読み出せるようlocalStorageに保存する
   */
  localStorage.setItem('key4', mustZairyouMenu1);
  localStorage.setItem('key5', mustZairyouMenu2);
  localStorage.setItem('key6', mustZairyouMenu3);
  localStorage.setItem('key7', mustZairyouMenu4);
  localStorage.setItem('key8', mustZairyouMenu5);
  localStorage.setItem('key9', mustZairyouMenu6);
}


/** 
 * ２．管理者画面からメイン画面に行き、再度 管理者画面に戻ったときの処理
 * 　　管理者画面の設定が空欄にならないよう　localStorage から値を読み出し　管理者画面の該当部分に書き込む
 *        材料テーブル、献立テーブル、名前テーブル（textboxの記載)
 *        材料-献立テーブル(軸情報とcheckboxの状態)　について行う
 */

// 2-1) 材料テーブルについて
// textboxに前回記載された内容をlocalStorage から読み出す
let zairyouObj = localStorage.getItem('key1');
// ","を含んだ文字列を配列に直す
zairyoName = zairyouObj.split(",");
// 配列の要素をtextboxに書き込む
let textZairyou = document.getElementsByName("syokuzai-settei");
for (i = 0; i < textZairyou.length; i++) {
  textZairyou[i].value = zairyoName[i];
};

// 2-2) 献立テーブルについて
// textboxに前回記載された内容をlocalStorage から読み出す
let menuObj = localStorage.getItem('key2');
// ","を含んだ文字列を配列に直す
menuName = menuObj.split(",");
// 配列の要素をtextboxに書き込む
let textMenu = document.getElementsByName("kondate-settei");
for (i = 0; i < textMenu.length; i++) {
  textMenu[i].value = menuName[i];
};

// 2-3) 名前テーブルについて
// textboxに前回記載された内容をlocalStorage から読み出す
let namaeObj = localStorage.getItem('key3');
// ","を含んだ文字列を配列に直す
namae = namaeObj.split(",");
// 配列の要素をtextboxに書き込む
let textNamae = document.getElementsByName("namae-settei");
for (i = 0; i < textNamae.length; i++) {
  textNamae[i].value = namae[i];
};

/** 
 * 2-4) 材料-献立テーブルについて  メイン画面から管理者画面に戻った際に前回値を反映させる処理 
 */

/** 2-4-1) 前回材料テーブルおよび献立テーブルに記入した材料と献立を
 * 材料-献立テーブルの行/列の見出しに再度表示させる
*/
let menuTableColumn = document.getElementsByName("menuTable-column");
for (i = 1; i < menuTableColumn.length; i++) {
  menuTableColumn[i].innerText = textZairyou[i - 1].value;
}
let menuTableRow = document.getElementsByName("menuTable-row");
for (i = 0; i < menuTableRow.length; i++) {
  menuTableRow[i].innerText = textMenu[i].value;
}

/** 2-4-2) checkboxの前回の状態をlocalStorage から読み出し
 * 材料-献立テーブルのcheckboxに書き込む
 */
// 献立1について
let menu1checkObj = localStorage.getItem('key4');
  // ","を含んだ文字列を配列に直す
var mustZairyou1 = menu1checkObj.split(",");
// 献立2について
let menu2checkObj = localStorage.getItem('key5');
  // ","を含んだ文字列を配列に直す
mustZairyou2 = menu2checkObj.split(",");
// 献立3について
let menu3checkObj = localStorage.getItem('key6');
  // ","を含んだ文字列を配列に直す
mustZairyou3 = menu3checkObj.split(",");
// 献立4について
var menu4checkObj = localStorage.getItem('key7');
  // ","を含んだ文字列を配列に直す
mustZairyou4 = menu4checkObj.split(",");
// 献立5について
var menu5checkObj = localStorage.getItem('key8');
  // ","を含んだ文字列を配列に直す
mustZairyou5 = menu5checkObj.split(",");
// 献立6について
var menu6checkObj = localStorage.getItem('key9');
  // ","を含んだ文字列を配列に直す
mustZairyou6 = menu6checkObj.split(",");

// checkboxに書き込むため　配列の要素の値0,1をfalse,true に直す
// 配列の準備
var mustZairyouA = [, , , , ,];
var mustZairyouB = [, , , , ,];
var mustZairyouC = [, , , , ,];
var mustZairyouD = [, , , , ,];
var mustZairyouE = [, , , , ,];
var mustZairyouF = [, , , , ,];

// memo: このif文は　判別式　"==="だと通らなかったため "=="としている 
for (i = 0; i < mustZairyou1.length; i++) {
  if (mustZairyou1[i] == 1) { mustZairyouA[i] = true; }
  else { mustZairyouA[i] = false; }
}
for (i = 0; i < mustZairyou2.length; i++) {
  if (mustZairyou2[i] == 1) { mustZairyouB[i] = true; }
  else { mustZairyouB[i] = false; }
}
for (i = 0; i < mustZairyou3.length; i++) {
  if (mustZairyou3[i] == 1) { mustZairyouC[i] = true; }
  else { mustZairyouC[i] = false; }
}
for (i = 0; i < mustZairyou4.length; i++) {
  if (mustZairyou4[i] == 1) { mustZairyouD[i] = true; }
  else { mustZairyouD[i] = false; }
}
for (i = 0; i < mustZairyou5.length; i++) {
  if (mustZairyou5[i] == 1) { mustZairyouE[i] = true; }
  else { mustZairyouE[i] = false; }
}
for (i = 0; i < mustZairyou6.length; i++) {
  if (mustZairyou6[i] == 1) { mustZairyouF[i] = true; }
  else { mustZairyouF[i] = false; }
}
// checkboxの要素の取得
var checkboxMenuNo1 = document.getElementsByName("menuNo1");
var checkboxMenuNo2 = document.getElementsByName("menuNo2");
var checkboxMenuNo3 = document.getElementsByName("menuNo3");
var checkboxMenuNo4 = document.getElementsByName("menuNo4");
var checkboxMenuNo5 = document.getElementsByName("menuNo5");
var checkboxMenuNo6 = document.getElementsByName("menuNo6");

// chekboxに書き込み
for (i = 0; i < checkboxMenuNo1.length; i++) {
  checkboxMenuNo1[i].checked = mustZairyouA[i]
};
for (i = 0; i < checkboxMenuNo2.length; i++) {
  checkboxMenuNo2[i].checked = mustZairyouB[i]
};
for (i = 0; i < checkboxMenuNo3.length; i++) {
  checkboxMenuNo3[i].checked = mustZairyouC[i]
};
for (i = 0; i < checkboxMenuNo4.length; i++) {
  checkboxMenuNo4[i].checked = mustZairyouD[i]
};
for (i = 0; i < checkboxMenuNo5.length; i++) {
  checkboxMenuNo5[i].checked = mustZairyouE[i]
};
for (i = 0; i < checkboxMenuNo6.length; i++) {
  checkboxMenuNo6[i].checked = mustZairyouF[i]
};


/**
 *  ３．"「１．材料テーブル」と「２．献立テーブル」のデータを「５．献立と必要な材料テーブル」に反映してください" ボタン
 * 　　　が押された際の処理
 *      材料テーブルに記入した材料を　材料-献立テーブルの材料列に書き込む
 *      献立テーブルに記入した材料を　材料-献立テーブルの献立行に書き込む
 */
function reflectOtherTable() {
  let menuTableColumn = document.getElementsByName("menuTable-column");
  for (i = 1; i < menuTableColumn.length; i++) {
    menuTableColumn[i].innerText = textZairyou[i - 1].value;
  }
 let menuTableRow = document.getElementsByName("menuTable-row");
 for (i = 0; i < menuTableRow.length; i++) {
   menuTableRow[i].innerText = textMenu[i].value;
 }    
}

/**
 * ４．初期設定を使うボタンを押された場合の処理
 * 　　開発者側で用意した　材料と献立の組み合わせを使う
 * 
 *     memo: 管理者画面の表示を上書きしておけば　
 *           "データをメイン画面に反映"ボタンを押されたときに　改めて管理者画面のデータを読み出すので
 *           メイン画面へデータを送る処理の変更は不要
 */

function defoultSettingGet() {
  // 材料テーブル初期値
  const zairyou = ['たまご', 'ひき肉', 'タマネギ', 'キャベツ', '肉', '魚'];
  // 献立テーブル初期値
  const kondate = ['カレー', 'ハンバーグ', 'すき焼き', 'オムライス', 'お好み焼き', '魚のフライ'];
  // 名前テーブル初期値
  const family = ['お母さん', 'お父さん', 'お兄ちゃん', 'お姉ちゃん'];
  /**
   * 材料-献立テーブル初期値
   * 各変数は　献立名を表しており　配列の要素は　それぞれの材料の要否を表している 
   * true は必要な材料　false は不要な材料
   **/
  const menu1Zairyou = [false, false, true, false, true, false];
  const menu2Zairyou = [true, true, true, false, false, false];
  const menu3Zairyou = [true, false, false, false, true, false];
  const menu4Zairyou = [true, false, true, false, false, false];
  const menu5Zairyou = [true, false, false, true, true, false];
  const menu6Zairyou = [false, false, false, true, false, true];

  var initialZairyouList = document.getElementsByName("syokuzai-settei")
  var initialMenuList = document.getElementsByName("kondate-settei")
  var initialNameList = document.getElementsByName("namae-settei")

  let initialMenuTableColumn = document.getElementsByName("menuTable-column");
  let initialMenuTableRow = document.getElementsByName("menuTable-row");
  var initialMenuNo1 = document.getElementsByName("menuNo1");
  var initialMenuNo2 = document.getElementsByName("menuNo2");
  var initialMenuNo3 = document.getElementsByName("menuNo3");
  var initialMenuNo4 = document.getElementsByName("menuNo4");
  var initialMenuNo5 = document.getElementsByName("menuNo5");
  var initialMenuNo6 = document.getElementsByName("menuNo6");

  for (i = 0; i < initialZairyouList.length; i++) {
    initialZairyouList[i].value = zairyou[i];
  }
  for (i = 0; i < initialMenuList.length; i++) {
    initialMenuList[i].value = kondate[i]
  }
  for (i = 0; i < initialNameList.length; i++) {
    initialNameList[i].value = family[i];
  }

  for (i = 1; i < initialMenuTableColumn.length; i++) {
    initialMenuTableColumn[i].innerText = zairyou[i - 1];
  }
  for (i = 0; i < menuTableRow.length; i++) {
    initialMenuTableRow[i].innerText = kondate[i];
  }
  for (i = 0; i < initialMenuNo1.length; i++) {
    initialMenuNo1[i].checked = menu1Zairyou[i];
  }
  for (i = 0; i < initialMenuNo2.length; i++) {
    initialMenuNo2[i].checked = menu2Zairyou[i];
  }
  for (i = 0; i < initialMenuNo3.length; i++) {
    initialMenuNo3[i].checked = menu3Zairyou[i];
  }
  for (i = 0; i < initialMenuNo4.length; i++) {
    initialMenuNo4[i].checked = menu4Zairyou[i];
  }
  for (i = 0; i < initialMenuNo5.length; i++) {
    initialMenuNo5[i].checked = menu5Zairyou[i];
  }
  for (i = 0; i < initialMenuNo6.length; i++) {
    initialMenuNo6[i].checked = menu6Zairyou[i];
  }
}