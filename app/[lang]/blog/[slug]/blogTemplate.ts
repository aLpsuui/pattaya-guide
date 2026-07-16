// Shared blog-template behaviour (reading progress, sticky TOC active-state,
// FAQ accordion). Previously duplicated in blog_posts.blog_script on every row;
// deduplicated here (brief BRIEF-02 item 3) and injected once by the blog page.
export const BLOG_TEMPLATE_SCRIPT = `(function(){
  var progress=document.getElementById('readProgress');
  var tocLinks=[].slice.call(document.querySelectorAll('#tocList a'));
  var mtocLinks=[].slice.call(document.querySelectorAll('#mtocList a'));
  var allLinks=tocLinks.concat(mtocLinks);
  var sections=tocLinks.map(function(a){return document.querySelector(a.getAttribute('href'));}).filter(Boolean);
  var tocBar=document.getElementById('tocBar');
  var tocPct=document.getElementById('tocPct');
  var mtocBar=document.getElementById('mtocBar');
  var mtocCur=document.getElementById('mtocCur');
  var ticking=false;

  function update(){
    ticking=false;
    var h=document.documentElement;
    var max=h.scrollHeight-h.clientHeight;
    var pct=max>0?(h.scrollTop/max)*100:0;
    if(pct<0)pct=0; if(pct>100)pct=100;
    if(progress)progress.style.width=pct+'%';
    if(tocBar)tocBar.style.width=pct+'%';
    if(mtocBar)mtocBar.style.width=pct+'%';
    if(tocPct)tocPct.textContent=Math.round(pct)+'% read';
    var y=window.scrollY+140;
    var cur=sections[0];
    sections.forEach(function(s){if(s&&s.offsetTop<=y)cur=s;});
    if(cur){
      var id='#'+cur.id;
      allLinks.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')===id);});
      var active=tocLinks.find(function(a){return a.getAttribute('href')===id;});
      if(active&&mtocCur)mtocCur.textContent=active.textContent;
    }
  }
  function onScroll(){if(!ticking){window.requestAnimationFrame(update);ticking=true;}}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  update();

  var mtocDetails=document.getElementById('mtocDetails');
  mtocLinks.forEach(function(a){a.addEventListener('click',function(){if(mtocDetails)mtocDetails.removeAttribute('open');});});

  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click',function(){q.parentElement.classList.toggle('open');});
  });
})();`
