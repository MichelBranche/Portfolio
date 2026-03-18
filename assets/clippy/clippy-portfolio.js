/**
 * Clippy integration: fixed bottom-right, follows scroll
 */
(function () {
  window.addEventListener("load", function () {
    var wrapper = document.getElementById("clippy-wrapper");
    var clippy = document.getElementById("clippy");
    if (!wrapper || !clippy) return;
    wrapper.style.pointerEvents = "none";
    clippy.style.pointerEvents = "auto";
  });
})();
