var CACHE_STATIC_VERSION = 'static-v1';


self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Install');

  event.waitUntil(
    caches.open(CACHE_STATIC_VERSION)
      .then(function(cache) {
        console.log('[Service Worker] Precaching App...');
        // 何でもキャッシュできる。cssとかの中で更にリクエストが発生する場合は、動的にキャッシュする必要がある（後述）
        cache.addAll();
      })
  );

});

self.addEventListener('activate', function(event) {
  console.log('[ServiceWorker] Activate');

});

// サービスワーカー有効化に必須
self.addEventListener('fetch', function(event) {
});





const registerInstallAppEvent = (elem) => {

  window.addEventListener('beforeinstallprompt', function(event){
    console.log("beforeinstallprompt: ", event);
    event.preventDefault(); //バナー表示をキャンセル
    elem.promptEvent = event; //eventを保持しておく
    elem.style.display = "block"; //要素を表示する
    return false;
  });

  //インストールダイアログの表示処理
  function installApp() {
    if(elem.promptEvent){
      elem.promptEvent.prompt(); //ダイアログ表示
      elem.promptEvent.userChoice.then(function(choice){
        elem.style.display = "none";
        elem.promptEvent = null; //一度しか使えないため後始末
      });//end then
    }
  }//end installApp
  //ダイアログ表示を行うイベントを追加

  elem.addEventListener("click", installApp);

}

self.onload = function () {
  const pwa_btn = document.getElementById("PWAInstallBtn")
  registerInstallAppEvent(pwa_btn);
};
