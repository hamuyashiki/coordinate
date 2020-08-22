/** >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * ☆　献立調整アプリ について　☆
 * 概要：　献立のアンケートと冷蔵庫の食材在庫状況から　最適な献立を決めるとともに　買い物リストを作る
 * 献立の決め方：step1 事前に準備された献立の多数決で決める
 *              step2 step1の多数決で決まらなかったときは、
 *                    希望の多かった献立のうち買い物の品数が最も少ないものに決める
 * その他の要件：事前に準備された献立に希望が無い場合は自由記入できること
 *                  ⇒ 全員希望が無かった場合は　自由記入の結果を候補とすること
 *              何度もやり直しができること
 *              決定した献立と買い物リストを印刷できること
 * 
 *              材料名、献立名、メンバー名（家族の名前）については別画面（管理者用画面)で変更可能であること
 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

 /* ==================================================
  管理者画面の設定が未実施である場合の警告の表示場所を決める
  調整結果の表示場所を決める
  表示エリアの記載を一旦全て消去する関数を準備する  
  memo:"メニューを決める"ボタンと　"もう一度やるボタン"　をクリックした時それぞれに必要なので　その外で定義する
 ====================================================*/
 const initialAlert = document.getElementById('initial-alert')
 const resultDivided = document.getElementById('result-area');
/**
 * 指定した要素の子要素を全て削除する
 * @param {HTMLElement} element HTMLの要素
 */
function removeAllChildren(element) {
  while (element.firstChild) {
    // 子どもの要素があるかぎり削除
    element.removeChild(element.firstChild);
  }
}

/* =========================================================
  メイン画面が開かれたとき　管理者画面で設定した内容を　メイン画面のテーブルに反映する
============================================================ */

const keyName = ['key1', 'key2', 'key3', 'key4', 'key5', 'key6', 'key7', 'key8', 'key9'];
var adminSetting = new Array(9);

for (let i = 0; i < keyName.length; i++) {
  // 1) 管理者画面の各テーブルの配列を文字列化した値を key1～9 で読み出す
  let setteiYomidashi = localStorage.getItem(keyName[i]);
  // 管理者画面の設定が未実施である場合に警告を表示する
  if(setteiYomidashi === null){
    removeAllChildren(initialAlert);
  const indicateAlert = document.createElement('h2');
  indicateAlert.innerText = '管理者画面を設定してから使用してください';
  initialAlert.appendChild(indicateAlert);
  }else{
    removeAllChildren(initialAlert);}
  // 2) ","を含んだ各文字列を配列に直す
  adminSetting[i] = setteiYomidashi.split(",");
}
// 2) 材料テーブル、献立テーブル、名前テーブル、各献立ごとの必要な材料のテーブルの軸に用いる別名の配列に代入する
var zairyouName = adminSetting[0];
var menuName = adminSetting[1];
var kazokuName = adminSetting[2];
var menu1Zairyou = adminSetting[3];
var menu2Zairyou = adminSetting[4];
var menu3Zairyou = adminSetting[5];
var menu4Zairyou = adminSetting[6];
var menu5Zairyou = adminSetting[7];
var menu6Zairyou = adminSetting[8];

// 3) 管理者画面のデータで材料テーブルの材料名軸を上書きする
let zairyouNameOverWrite = document.getElementsByName("zairyou-Name");
for (i = 0; i < zairyouNameOverWrite.length; i++) { zairyouNameOverWrite[i].innerText = zairyouName[i] };

// 3) 管理者画面のデータでメイン画面の献立テーブルの献立名軸を上書きする
let menuNameOverWrite = document.getElementsByName("menu-Name");
for (i = 0; i < menuNameOverWrite.length; i++) { menuNameOverWrite[i].innerText = menuName[i] };

// 3) 管理者画面のデータで名前テーブルの名前軸を上書きする
let kazokuNameOverWrite = document.getElementsByName("kazoku-name");
for (i = 0; i < kazokuNameOverWrite.length; i++) { kazokuNameOverWrite[i].innerText = kazokuName[i] };


/** ================================================
 * 献立テーブルの checkbox："この中には無い"　がクリックされた場合の処理
 *    ・チェックを付けられた ==> 同一人物の他の献立のcheckboxのチェックをはずし　自由記入欄を有効にする
 *    ・チェックを外された   ==> 自由記入欄を空欄にし入力できないようにする
 ===================================================*/

// 家族の献立希望のcheckboxの状態を取得し献立ごとの配列に格納する 
var orderMenu1 = document.getElementsByName("menu1");
var orderMenu2 = document.getElementsByName("menu2");
var orderMenu3 = document.getElementsByName("menu3");
var orderMenu4 = document.getElementsByName("menu4");
var orderMenu5 = document.getElementsByName("menu5");
var orderMenu6 = document.getElementsByName("menu6");
var orderSonota = document.getElementsByName("sonota");
var freeEntry = document.getElementsByName("free-entry")
/* ----------------------------------------
 checkbox:"この中には無い" を選択した場合の処理関数の定義
  <==メイン画面のhtml で呼び出される
 */
function clearfunc() {
  for (i = 0; i < orderSonota.length; i++) {
    if (orderSonota[i].checked) {

      // 同一人物の他の献立のcheckboxのチェックをはずす
      orderMenu1[i].checked = false;
      orderMenu2[i].checked = false;
      orderMenu3[i].checked = false;
      orderMenu4[i].checked = false;
      orderMenu5[i].checked = false;
      orderMenu6[i].checked = false;

      // textboxを有効化する
      freeEntry[i].disabled = false;
    }
    else {
      // checkbox "この中にはない" のチェックをはずした場合　textboxを無効化しtextboxを空欄にする
      freeEntry[i].disabled = true;
      freeEntry[i].value = "";
    }
  }
}

/** =============================================
   * メニューを決めるボタン　を押したら処理する内容
   * 　1-1)材料在庫テーブルのcheckboxの状態を配列に取り込む
   *   1-2)table / form / name ="menuRequest" のcheckboxの状態を取り込む
   *   2-1)各献立で　どの材料が不足しているかを　配列 fusoku* に入れる
   *   2-2)各献立の不足材料数を求める(step2で使用する)
   *   3)step1(多数決) で献立を決める
   *   4)step2(買い物材料数の少ないもの) で献立を決める
   ==============================================*/

// メニューを決めるボタン　のクリック情報を取得する
const arbitrationButton = document.getElementById('arbitration');
// メニューを決めるボタン　がクリックされた
arbitrationButton.onclick = () => {

  /** -------------------------------------------
   * 1-1)材料在庫テーブルのcheckboxの状態を配列に取り込む
   *    メニューを決めるボタンがクリックされた時点での
   *    冷蔵庫にある材料のcheckbox の状態を(1:在庫あり、0:在庫なし) として
   *    材料の在庫の配列に取り込む
   */
  var syokuzaiList = document.getElementsByName("syokuzai");

  if (syokuzaiList[0].checked) {
    var a = 1;
  } else {
    var a = 0;
  }
  if (syokuzaiList[1].checked) {
    var b = 1;
  } else {
    var b = 0;
  }
  if (syokuzaiList[2].checked) {
    var c = 1;
  } else {
    var c = 0;
  }
  if (syokuzaiList[3].checked) {
    var d = 1;
  } else {
    var d = 0;
  }
  if (syokuzaiList[4].checked) {
    var e = 1;
  } else {
    var e = 0;
  }
  if (syokuzaiList[5].checked) {
    var f = 1;
  } else {
    var f = 0;
  }

  var zaiko = [a, b, c, d, e, f];

  /** -----------------------------------------
  1-2) 各献立希望のcheckboxの状態を取得し配列に格納する
  */
  var orderMenu1 = document.getElementsByName("menu1");
  var orderMenu2 = document.getElementsByName("menu2");
  var orderMenu3 = document.getElementsByName("menu3");
  var orderMenu4 = document.getElementsByName("menu4");
  var orderMenu5 = document.getElementsByName("menu5");
  var orderMenu6 = document.getElementsByName("menu6");
  var orderSonota = document.getElementsByName("sonota");

  // 献立希望のcheckbox状態を 0,1 として保存する配列を作る
  //  orderMenu*Array = [家族1の選択, 家族2の選択, 家族3の選択, 家族4の選択];
  var orderMenu1Array = new Array(4);
  var orderMenu2Array = new Array(4);
  var orderMenu3Array = new Array(4);
  var orderMenu4Array = new Array(4);
  var orderMenu5Array = new Array(4);
  var orderMenu6Array = new Array(4);
  var orderMenu7Array = new Array(4);

  // 献立希望のcheckbox状態を 0,1 として保存する  
  for (i = 0; i < orderMenu1Array.length; i++) {
    if (orderMenu1[i].checked) {
      orderMenu1Array[i] = 1;
    } else {
      orderMenu1Array[i] = 0;
    }
    if (orderMenu2[i].checked) {
      orderMenu2Array[i] = 1;
    } else {
      orderMenu2Array[i] = 0;
    }
    if (orderMenu3[i].checked) {
      orderMenu3Array[i] = 1;
    } else {
      orderMenu3Array[i] = 0;
    }
    if (orderMenu4[i].checked) {
      orderMenu4Array[i] = 1;
    } else {
      orderMenu4Array[i] = 0;
    }
    if (orderMenu5[i].checked) {
      orderMenu5Array[i] = 1;
    } else {
      orderMenu5Array[i] = 0;
    }
    if (orderMenu6[i].checked) {
      orderMenu6Array[i] = 1;
    } else {
      orderMenu6Array[i] = 0;
    }
    if (orderSonota[i].checked) {
      orderMenu7Array[i] = 1;
    } else {
      orderMenu7Array[i] = 0;
    }
  }

  /** -----------------------------------------------------------
   * 2-1) 各献立で　どの材料が不足しているかを　配列 fusoku* に入れる
   *      memo: fusuku* は　不足している材料について　マイナス　の値を取る
   *            fusoku*　は　不要材料の在庫あり の場合をプラス側にカウントしないように
   *           （在庫-必要材料)*必要材料　で算出する
   *            その結果　fusoku* は必要材料なしの場合 在庫有無に関わらず　0 となる
   */

  // 献立1 ～　献立6 の各材料の不足状態の配列を作る
  var fusoku1 = new Array(6);
  var fusoku2 = new Array(6);
  var fusoku3 = new Array(6);
  var fusoku4 = new Array(6);
  var fusoku5 = new Array(6);
  var fusoku6 = new Array(6);

  for (i = 0; i < fusoku1.length; i++) {
    fusoku1[i] = (zaiko[i] - menu1Zairyou[i]) * menu1Zairyou[i];
  }
  for (i = 0; i < fusoku2.length; i++) {
    fusoku2[i] = (zaiko[i] - menu2Zairyou[i]) * menu2Zairyou[i];
  }
  for (i = 0; i < fusoku3.length; i++) {
    fusoku3[i] = (zaiko[i] - menu3Zairyou[i]) * menu3Zairyou[i];
  }
  for (i = 0; i < fusoku4.length; i++) {
    fusoku4[i] = (zaiko[i] - menu4Zairyou[i]) * menu4Zairyou[i];
  }
  for (i = 0; i < fusoku5.length; i++) {
    fusoku5[i] = (zaiko[i] - menu5Zairyou[i]) * menu5Zairyou[i];
  }
  for (i = 0; i < fusoku6.length; i++) {
    fusoku6[i] = (zaiko[i] - menu6Zairyou[i]) * menu6Zairyou[i];
  }

  /** --------------------------------------------
   * 2-2)各献立での不足材料の数を 変数sumFusoku* に入れる　step2 で買い物の品数の比較として使用する
   * memo:sumFusoku* >= 0 の場合 不足材料はなく買い物不要
  */
  var sumFusoku1 = fusoku1[0] + fusoku1[1] + fusoku1[2] + fusoku1[3] + fusoku1[4] + fusoku1[5];
  var sumFusoku2 = fusoku2[0] + fusoku2[1] + fusoku2[2] + fusoku2[3] + fusoku2[4] + fusoku2[5];
  var sumFusoku3 = fusoku3[0] + fusoku3[1] + fusoku3[2] + fusoku3[3] + fusoku3[4] + fusoku3[5];
  var sumFusoku4 = fusoku4[0] + fusoku4[1] + fusoku4[2] + fusoku4[3] + fusoku4[4] + fusoku4[5];
  var sumFusoku5 = fusoku5[0] + fusoku5[1] + fusoku5[2] + fusoku5[3] + fusoku5[4] + fusoku5[5];
  var sumFusoku6 = fusoku6[0] + fusoku6[1] + fusoku6[2] + fusoku6[3] + fusoku6[4] + fusoku6[5];

  /** -----------------
   * 3) 調整 Step1 の処理
   *    ==> 多数決で献立を決める
   *   3-1)各献立のチェック数を求める
   * 　3-2)全献立のチェック数の最大値を求める
   *   3-3)チェック数最大の献立を識別する変数(初期値=1)に識別可能な数値(素数)を乗算する
   *   3-4)素数での剰余により選ばれた献立を識別する
   *   3-5)希望数最大の献立について   *
   *          その献立が多数決で最大だったことを示す変数に値をセット
   *          希望数最大の献立が複数あるかを判断する変数に値をセット
   *          献立の表示内容をセット
   *   3-6)調整結果の表示内容(献立、買い物リスト)を決定　　　
   */

  // 3-1)各献立のチェック数(希望者数)カウント
  var dish1Point = (orderMenu1Array[0] + orderMenu1Array[1] + orderMenu1Array[2] + orderMenu1Array[3]);
  var dish2Point = (orderMenu2Array[0] + orderMenu2Array[1] + orderMenu2Array[2] + orderMenu2Array[3]);
  var dish3Point = (orderMenu3Array[0] + orderMenu3Array[1] + orderMenu3Array[2] + orderMenu3Array[3]);
  var dish4Point = (orderMenu4Array[0] + orderMenu4Array[1] + orderMenu4Array[2] + orderMenu4Array[3]);
  var dish5Point = (orderMenu5Array[0] + orderMenu5Array[1] + orderMenu5Array[2] + orderMenu5Array[3]);
  var dish6Point = (orderMenu6Array[0] + orderMenu6Array[1] + orderMenu6Array[2] + orderMenu6Array[3]);

  // 3-2)チェック数の最大値(変数maximum)を計算
  var maximum = Math.max(dish1Point, dish2Point, dish3Point, dish4Point, dish5Point, dish6Point);

  /** 
   * 3-3)変数mostSelectedDishNum は　多数決で最も選ばれた献立を識別するための変数
   * 初期値を 1 として 選ばれた献立ごとに固有の素数を乗算する
   * memo:mostSelectedDishNum の各素数での剰余を調べることによって　どの献立が選ばれたかを判定することができる
  */

  var mostSelectedDishNum = 1;

  if (maximum === 0) {
    ;
    // 既定の献立1～6に希望が無かった場合 step1 では何も処理しない 表示については別途対応
  }
  else {
    // 規定の献立1～6に希望があった場合 最も選ばれた献立を認識する変数を計算する
    if (dish1Point === maximum) {
      mostSelectedDishNum = mostSelectedDishNum * 2;
    }
    if (dish2Point === maximum) {
      mostSelectedDishNum = mostSelectedDishNum * 3;
    }
    if (dish3Point === maximum) {
      mostSelectedDishNum = mostSelectedDishNum * 5;
    }
    if (dish4Point === maximum) {
      mostSelectedDishNum = mostSelectedDishNum * 7;
    }
    if (dish5Point === maximum) {
      mostSelectedDishNum = mostSelectedDishNum * 11;
    }
    if (dish6Point === maximum) {
      mostSelectedDishNum = mostSelectedDishNum * 13;
    }
  }

  /** 
   * 3-4)素数の剰余により 希望の多い献立を表示する
   *     また、希望が別れた場合を判定する
   */

  // 表示処理用変数の初期化
  var spritDecision = 0;
  var result01 = null;
  var result02 = null;
  var result03 = null;
  var result04 = null;
  var result05 = null;
  var result06 = null;
  /**
   * 変数dish*Select は
   * 値 0 でその献立が選ばれたことを示す変数
   * 不足材料数の比較時に選択されていない献立の不足材料が表示されることを避けるため初期値は -255とする
   */
  var dish1Select = -255;
  var dish2Select = -255;
  var dish3Select = -255;
  var dish4Select = -255;
  var dish5Select = -255;
  var dish6Select = -255;

  /**
   * 3-5) 希望が分かれているか(同じ投票数の献立があるか)を判断する変数spritDecision　を演算する
   *      (spritDecision > 1 の場合 step1 で判定せず step2 で判定する)
   *      また、step1により決まった場合の献立表示用メッセージを　変数result* に設定する
   *      また、各献立の希望数が最大がであった場合に その献立の変数 dish*Select の値を 0 にする
   *     （複数の献立について 0 の場合もある） 
   */
  if (mostSelectedDishNum % 2 === 0) { spritDecision++, result01 = '希望の多い献立は ' + menuName[0] + ' です', dish1Select = 0 }
  else { result01 = '' }
  if (mostSelectedDishNum % 3 === 0) { spritDecision++, result02 = '希望の多い献立は ' + menuName[1] + ' です', dish2Select = 0 }
  else { result02 = '' }
  if (mostSelectedDishNum % 5 === 0) { spritDecision++, result03 = '希望の多い献立は ' + menuName[2] + ' です', dish3Select = 0 }
  else { result03 = '' }
  if (mostSelectedDishNum % 7 === 0) { spritDecision++, result04 = '希望の多い献立は ' + menuName[3] + ' です', dish4Select = 0 }
  else { result04 = '' }
  if (mostSelectedDishNum % 11 === 0) { spritDecision++, result05 = '希望の多い献立は ' + menuName[4] + ' です', dish5Select = 0 }
  else { result05 = '' }
  if (mostSelectedDishNum % 13 === 0) { spritDecision++, result06 = '希望の多い献立は ' + menuName[5] + ' です', dish6Select = 0 }
  else { result06 = '' }

  /* ----------------------
   *3-6)step1用 表示内容のセット
   *     3-6-1) checkboxにチェックが入らなかった場合の表示
   *            checkboxにチェックが入った場合の表示
   *     3-6-2) 買い物リストの表示     　　
   */

  /*
   * 3-6-1) 所定の献立に希望が無い場合の献立の表示
   *        自由記入のtextboxに記入があれば　候補として表示する
   */
  var freeEntryResult = "";
  if (spritDecision === 0) {
    for (j = 0; j < freeEntry.length; j++) {
      if (freeEntry[j].value !== "") {
        freeEntryResult = freeEntryResult + "  " + kazokuName[j] + "は「" + (freeEntry[j].value) + "」";
      } else { freeEntryResult = freeEntryResult + "  " }
    }
    todayMenu = '所定の献立は 人気がありません';
    /*
     * textboxが全て空欄の場合と それ以外で　表示の内容を変える
     * memo: textboxが全て空欄の場合でも freeEntryResultには半角スペースが8つ入っているので注意
     */
    if (freeEntryResult === "        ") {
      ninkido = '特別な希望もありません'
    }
    else {
      ninkido = freeEntryResult + '  を食べたがっています'
    }
  }
  // checkboxにチェックが入り step1の多数決で献立が決まったときの表示
  else {
    todayMenu = result01 + result02 + result03 + result04 + result05 + result06;
    var ninkido = maximum + '人が希望しています';
  }

  /*
   * 3-6-2) 買い物リストの表示
   */

  /**
    * 不足している材料を表示する関数
    * @param {number} sumFusoku 各献立の不足材料数
    * @param {number} fusoku 各献立の各材料の不足状態
    * @param {string} zairyouName 材料の名前
    * @return {string} 買い物リスト
    */
  function indicateFusokuSyokuzai(sumFusoku, fusoku, zairyouName) {
    var kaimonoList = '';
    if (sumFusoku >= 0) { kaimonoList = '買い物は不要です'; }  // 材料に不足がない場合　買い物は不要とコメントする
    else {
      for (let i = 0; i < fusoku.length; i++) {
        if (fusoku[i] < 0) { kaimonoList = kaimonoList + zairyouName[i] + " を買い物リストに入れてください" + "\n"; }
        else {
          ;
        }
      }
    }
    return kaimonoList;
  }
  /** 
   * step1 における買い物リスト
   * 希望者数最大の献立(dish*Select = 0) において不足している材料を表示する
   */
  if (spritDecision === 0) {
  // 既定の献立に希望ない場合は　買い物リストは空欄にする
    kaimonoList = '';
  }
  // 選ばれた献立における不足材料を買い物リストkaimonoListにセットする
  // memo: step1では　dish*Select = 0 が複数とならない
  else {
    if (dish1Select === 0) {
      kaimonoList = indicateFusokuSyokuzai(sumFusoku1, fusoku1, zairyouName);
    }
    else if (dish2Select === 0) {
      kaimonoList = indicateFusokuSyokuzai(sumFusoku2, fusoku2, zairyouName);
    }
    else if (dish3Select === 0) {
      kaimonoList = indicateFusokuSyokuzai(sumFusoku3, fusoku3, zairyouName);
    }
    else if (dish4Select === 0) {
      kaimonoList = indicateFusokuSyokuzai(sumFusoku4, fusoku4, zairyouName);
    }
    else if (dish5Select === 0) {
      kaimonoList = indicateFusokuSyokuzai(sumFusoku5, fusoku5, zairyouName);
    }
    else if (dish6Select === 0) {
      kaimonoList = indicateFusokuSyokuzai(sumFusoku6, fusoku6, zairyouName);
    }
    else { ; }
  }

  /**
   * 4) 調整 Step2 の処理
   * spritDecision > 1 (献立希望が別れたの意味)の場合は　step1による献立表示はしない　step2の処理をする
   * step2 では　なるべく材料の買い物が少なくて済む献立を選ぶ
   * memo: sumFusoku*は　不足していると負の値を取るため不足が少ない方が大きい値を取る
   *       なお、不足している材料数が同じ場合は 献立表の下にある献立が優先される
   */
  if (spritDecision > 1) {
    /* 
     * 4-1) Step2の判断ロジック部
     * mostSelectedDishNum で選ばれた料理を判別し　その献立について
     * 他の献立との買い物材料数：sumFusoku* の比較により買い物材料数が少ないかを判断する
     * 全ての他の献立に対し　買い物材料数が少なければ その献立をstep2の結果として選び
     * 変数：menuNoに献立番号を保存し、献立表示内容をセットする
     * sumFusoku*は献立が選択されたか否かによらず　在庫と必要材料のみで算出しているため
     * 選択された献立よりも選択されていない献立のsumFusoku*が小さい可能性がある
     * そこで献立が選ばれたかを示す変数：dish*Select は初期値を-255,献立を選択された場合　0 とし
     * 比較される献立のsumFusoku*に加えることで　選択されていない献立の不足材料が表示されるのを防ぐ
     */
    if (mostSelectedDishNum % 2 === 0 && (sumFusoku1 > sumFusoku2 + dish2Select) && (sumFusoku1 > sumFusoku3 + dish3Select)
      && (sumFusoku1 > sumFusoku4 + dish4Select) && (sumFusoku1 > sumFusoku5 + dish5Select)
      && (sumFusoku1 > sumFusoku6 + dish6Select)) { todayMenu = '今晩の献立は ' + menuName[0] + ' がいいですよ'; var menuNo = 1; }
    else if (mostSelectedDishNum % 3 === 0 && (sumFusoku2 > sumFusoku3 + dish3Select) && (sumFusoku2 > sumFusoku4 + dish4Select)
      && (sumFusoku2 > sumFusoku5 + dish5Select) && (sumFusoku2 > sumFusoku6 + dish6Select)) { todayMenu = '今晩の献立は ' + menuName[1] + ' がいいですよ'; var menuNo = 2; }
    else if (mostSelectedDishNum % 5 === 0 && (sumFusoku3 > sumFusoku4 + dish4Select) && (sumFusoku3 > sumFusoku5 + dish5Select)
      && (sumFusoku3 > sumFusoku6 + dish6Select)) { todayMenu = '今晩の献立は ' + menuName[2] + ' がいいですよ'; var menuNo = 3; }
    else if (mostSelectedDishNum % 7 === 0 && (sumFusoku4 > sumFusoku5 + dish5Select) && (sumFusoku4 > sumFusoku6 + dish6Select)) { todayMenu = '今晩の献立は ' + menuName[3] + ' がいいですよ'; var menuNo = 4; }
    else if (mostSelectedDishNum % 11 === 0 && (sumFusoku5 > sumFusoku6 + dish6Select)) { todayMenu = '今晩の献立は ' + menuName[4] + ' がいいですよ'; var menuNo = 5; }
    else { todayMenu = '今晩の献立は ' + menuName[5] + ' がいいですよ'; var menuNo = 6; }
    // step2は人気度の表示不要なので 空 とする
    var ninkido = ''

    /*
     * 4-2) step2用表示処理
     *      step2の結果として選ばれた献立について不足材料を抽出しstep1 でセットした買い物表示用変数を上書きする
     *      表示をする
     */
    // step1 でセットされた買い物リストをクリアする
    kaimonoList = '';  
    // 選ばれた献立における不足材料を買い物リストkaimonoListにセットする
    if (menuNo === 1) {
      kaimonoList = indicateFusokuSyokuzai(sumFusoku1, fusoku1, zairyouName);
    }
    else if (menuNo === 2) {
      kaimonoList = indicateFusokuSyokuzai(sumFusoku2, fusoku2, zairyouName);
    }
    else if (menuNo === 3) {
      kaimonoList = indicateFusokuSyokuzai(sumFusoku3, fusoku3, zairyouName);
    }
    else if (menuNo === 4) {
      kaimonoList = indicateFusokuSyokuzai(sumFusoku4, fusoku4, zairyouName);
    }
    else if (menuNo === 5) {
      kaimonoList = indicateFusokuSyokuzai(sumFusoku5, fusoku5, zairyouName);
    }
    else if (menuNo === 6) {
      kaimonoList = indicateFusokuSyokuzai(sumFusoku6, fusoku6, zairyouName);
    }
    // 献立希望が分かれなかった場合 step2ではなにも処理しない
    else { ; }
  }

  // 結果表示エリアの作成
  removeAllChildren(resultDivided);
  const header = document.createElement('h3');

  header.innerText = '今日のメニューは';
  resultDivided.appendChild(header);

  // 結果　献立の表示
  const paragraph = document.createElement('p');
  paragraph.innerText = todayMenu;
  resultDivided.appendChild(paragraph);

  const paragraph2 = document.createElement('p');
  paragraph2.innerText = ninkido;
  resultDivided.appendChild(paragraph2);

  // 結果　買い物リストの表示
  const header2 = document.createElement('h3');

  header2.innerText = '買い物リスト';
  resultDivided.appendChild(header2);

  const paragraph3 = document.createElement('p');
  paragraph3.innerText = kaimonoList;
  resultDivided.appendChild(paragraph3);

}
/** 
 * 'もう一度やる' ボタンクリックした場合の処理
 *  やること：check boxのチェックをクリアする
 *           自由記入のtextbox の記載内容を消去する
 *           自由記入のtextbox を記入不可にする
 *           献立調整結果表示を消去する
 */

const retryButton = document.getElementById('retry');

retryButton.onclick = () => {

  // 食材リストのcheckbox をクリア
  const zaikoCheck = document.reizouko.syokuzai;
  for ( i = 0; i < zaikoCheck.length; i++) {
    zaikoCheck[i].checked = false; // ON・OFFを切り替え    
  }
  // 献立リクエストのcheckbox をクリア
  const request1 = document.menuRequest.menu1;
  for ( i = 0; i < request1.length; i++) {
    request1[i].checked = false; // ON・OFFを切り替え    
  }
  const request2 = document.menuRequest.menu2;
  for ( i = 0; i < request2.length; i++) {
    request2[i].checked = false; // ON・OFFを切り替え    
  }
  const request3 = document.menuRequest.menu3;
  for ( i = 0; i < request3.length; i++) {
    request3[i].checked = false; // ON・OFFを切り替え 
  }
  const request4 = document.menuRequest.menu4;
  for ( i = 0; i < request4.length; i++) {
    request4[i].checked = false; // ON・OFFを切り替え    
  }
  const request5 = document.menuRequest.menu5;
  for ( i = 0; i < request5.length; i++) {
    request5[i].checked = false; // ON・OFFを切り替え    
  }
  const request6 = document.menuRequest.menu6;
  for ( i = 0; i < request6.length; i++) {
    request6[i].checked = false; // ON・OFFを切り替え 
  }
  const request7 = document.menuRequest.sonota;
  for ( i = 0; i < request7.length; i++) {
    request7[i].checked = false; // ON・OFFを切り替え 
  }
  /* 自由記入の textbox を記入不可(disable)にする
     自由記入の textbox の記載内容を消去する */
  for (i = 0; i < orderSonota.length; i++) {
    freeEntry[i].disabled = true;
    freeEntry[i].value = "";
  }
  // 前回の結果をクリア
  removeAllChildren(resultDivided);

}