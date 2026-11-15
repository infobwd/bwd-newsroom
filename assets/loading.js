/* App Experience v1.3: native iOS startup only; never re-cover tab navigation.
   Keep this API for existing async loaders. Loading is represented by skeletons. */
(() => {
  'use strict';
  let finished=false;
  function finishLaunch(){
    if(finished)return;
    finished=true;
    // Safe cleanup for a previously cached v1.2 page during PWA upgrades.
    document.documentElement.classList.remove('app-launching');
    document.getElementById('app-launch')?.remove();
  }
  window.BWDLoading=Object.freeze({finishLaunch});
})();
