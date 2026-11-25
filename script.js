const story=document.getElementById('story');
const panels=[...story.querySelectorAll('.panel')];
const river=document.getElementById('river');
const boat=document.getElementById('boat');
const fill=document.getElementById('progressFill');
const date=document.getElementById('currentDate');
let raf=0;
function riverY(x){const h=story.clientHeight;return h*(.51+.058*Math.sin(x/480)+.026*Math.sin(x/190+1.2));}
function drawRiver(){
 const w=panels.length*story.clientWidth,h=story.clientHeight;
 river.setAttribute('width',w);river.setAttribute('height',h);river.setAttribute('viewBox',`0 0 ${w} ${h}`);document.querySelector('.river-layer').style.width=w+'px';
 const half=x=>(story.clientWidth<600?39:57)*(1+.18*Math.sin(x/350)+.1*Math.cos(x/170));
 const ribbon=extra=>{let top=[],bottom=[];for(let x=-20;x<=w+20;x+=12){top.push(`${x},${riverY(x)-half(x)-extra}`);bottom.push(`${x},${riverY(x)+half(x)+extra}`)}return `M${top.join(' L')} L${bottom.reverse().join(' L')}Z`};
 let marks='';for(let x=40;x<w;x+=130){const offset=Math.sin(x*.087)*half(x)*.62;const y=riverY(x)+offset;marks+=`<path class="water-ripple" d="M${x} ${y}q18 -3 38 0t28 -1"/>`;if(Math.round(x/130)%4===0){let by=riverY(x)+half(x)+15;marks+=`<path class="bank-grass" d="M${x} ${by}q-3 -14 -9 -17m9 17q1 -19 8 -23m-8 23q8 -10 16 -12"/>`}}
 river.innerHTML=`<defs><linearGradient id="riverWash" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#b7dcf6"/><stop offset=".5" stop-color="#99ccff"/><stop offset="1" stop-color="#afd9ee"/></linearGradient></defs><path class="river-sand" d="${ribbon(11)}"/><path class="river-water" d="${ribbon(0)}"/>${marks}`;
 update();
}
function update(){const max=story.scrollWidth-story.clientWidth;const progress=max?story.scrollLeft/max:0;fill.style.width=(progress*100)+'%';const x=story.scrollLeft+story.clientWidth*.5;boat.style.top=riverY(x)+'px';boat.style.transform=`translate(-50%,-50%) rotate(${Math.cos(x/480)*2.6}deg)`;const idx=Math.max(0,Math.min(panels.length-1,Math.round(story.scrollLeft/story.clientWidth)));date.textContent=panels[idx].dataset.date;document.body.classList.toggle('dark',idx===0||idx===panels.length-1);}
story.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(update)},{passive:true});
window.addEventListener('resize',drawRiver);
story.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();story.scrollLeft+=e.deltaY;}},{passive:false});
function go(delta){const idx=Math.round(story.scrollLeft/story.clientWidth);story.scrollTo({left:Math.max(0,Math.min(panels.length-1,idx+delta))*story.clientWidth,behavior:'smooth'});}
document.getElementById('prev').addEventListener('click',()=>go(-1));
document.getElementById('next').addEventListener('click',()=>go(1));
document.getElementById('restart').addEventListener('click',()=>story.scrollTo({left:0,behavior:'smooth'}));
document.addEventListener('keydown',e=>{if(document.getElementById('help').hidden){if(e.key==='ArrowRight'){e.preventDefault();go(1)}if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}}else if(e.key==='Escape')closeHelp()});
const help=document.getElementById('help');function closeHelp(){help.hidden=true;document.getElementById('helpButton').focus()}
document.getElementById('helpButton').addEventListener('click',()=>{help.hidden=false;document.getElementById('closeHelp').focus()});
document.getElementById('closeHelp').addEventListener('click',closeHelp);
help.addEventListener('click',e=>{if(e.target===help)closeHelp()});
drawRiver();
