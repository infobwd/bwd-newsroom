/* App Experience v1.2: no artificial splash wait or personal-data caching. */
(() => {
  'use strict';
  let finished=false;
  function finishLaunch(){
    if(finished)return;finished=true;
    document.documentElement.classList.remove('app-launching');
    document.getElementById('app-launch')?.remove();
  }
  window.BWDLoading=Object.freeze({finishLaunch});
  // Network stalls cannot trap a visitor behind the launch overlay indefinitely.
  window.setTimeout(finishLaunch,10000);
  window.addEventListener('pagehide',finishLaunch,{once:true});
})();
