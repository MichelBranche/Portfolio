/**
 * Cursore custom come sul portfolio (stesso markup #brutalCursor + classi CSS in style.css).
 */
;(function () {
  var cursor = document.getElementById('brutalCursor')
  if (!cursor) return

  function positionCursor(x, y) {
    cursor.style.transform = 'translate(' + x + 'px, ' + y + 'px) translate(-3px, -3px)'
  }

  document.addEventListener('mousemove', function (e) {
    positionCursor(e.clientX, e.clientY)
  })

  document.addEventListener('mouseover', function (e) {
    var t = e.target
    if (!t.closest) return
    if (t.closest('.admin-preview-window article, #btn-add-new')) cursor.classList.add('brutal-cursor--grab')
    else if (t.closest('a, button, input, textarea, select, summary, label, .btn'))
      cursor.classList.add('brutal-cursor--large')
  })

  document.addEventListener('mouseout', function (e) {
    var rt = e.relatedTarget
    if (!rt || !rt.closest('.admin-preview-window article, #btn-add-new'))
      cursor.classList.remove('brutal-cursor--grab')
    if (!rt || !rt.closest('a, button, input, textarea, select, summary, label, .btn'))
      cursor.classList.remove('brutal-cursor--large')
  })

  var clickImg = cursor.querySelector('.brutal-cursor__img--click')
  if (clickImg) {
    var img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = function () {
      var w = img.naturalWidth
      var h = img.naturalHeight
      var canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      var pdata = ctx.getImageData(0, 0, w, h)
      var p = pdata.data
      var light = 240
      function isWhite(i) {
        return p[i] >= light && p[i + 1] >= light && p[i + 2] >= light
      }
      function idx(x, y) {
        return (y * w + x) * 4
      }
      var stack = []
      for (var x = 0; x < w; x++) {
        if (isWhite(idx(x, 0))) stack.push([x, 0])
        if (h > 1 && isWhite(idx(x, h - 1))) stack.push([x, h - 1])
      }
      for (var y = 0; y < h; y++) {
        if (isWhite(idx(0, y))) stack.push([0, y])
        if (w > 1 && isWhite(idx(w - 1, y))) stack.push([w - 1, y])
      }
      var seen = {}
      while (stack.length) {
        var pt = stack.pop()
        var px = pt[0]
        var py = pt[1]
        var k = px + ',' + py
        if (seen[k]) continue
        if (px < 0 || px >= w || py < 0 || py >= h) continue
        var i = idx(px, py)
        if (!isWhite(i)) continue
        seen[k] = true
        p[i + 3] = 0
        stack.push([px - 1, py])
        stack.push([px + 1, py])
        stack.push([px, py - 1])
        stack.push([px, py + 1])
      }
      ctx.putImageData(pdata, 0, 0)
      try {
        clickImg.src = canvas.toDataURL('image/png')
      } catch (err) {}
    }
    img.src = clickImg.getAttribute('src') || 'assets/cursor-click.png'
  }
})()
