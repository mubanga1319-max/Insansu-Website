/* Insansu Farm Weather: live 7-day forecast from Open-Meteo plus simple farm advisories.
   The same rules run in the alert emails (alerts server). Set ALERTS_ENABLED to true once the alerts server is live. */
(function(){
  var ALERTS_ENABLED = false;
  var ALERTS_ENDPOINT = 'https://alerts.insansuventure.online/subscribe.php';

  var SITES = {
    kafue:     {name:'Kafue (Chipongwe)', lat:-15.633, lon:28.270},
    kawambwa:  {name:'Kawambwa',          lat:-9.795,  lon:29.080},
    mungwi:    {name:'Mungwi (Mpanda area)', lat:-10.200, lon:31.300}
  };
  var DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var $=function(s,r){return (r||document).querySelector(s);};

  function round(n){return Math.round(n);}
  function fmtDay(iso,i){ var d=new Date(iso+'T12:00:00'); return i===0?'Today':DAYS[d.getDay()]+' '+d.getDate(); }

  function parse(j){
    var d=j.daily, out=[];
    for(var i=0;i<d.time.length;i++){
      out.push({date:d.time[i], tmax:d.temperature_2m_max[i], tmin:d.temperature_2m_min[i], rain:d.precipitation_sum[i]||0,
        pop:d.precipitation_probability_max?d.precipitation_probability_max[i]||0:0, wind:d.wind_speed_10m_max[i]||0,
        et0:d.et0_fao_evapotranspiration?d.et0_fao_evapotranspiration[i]||0:0});
    }
    return out;
  }

  function fieldIndex(x){
    var s=100 - Math.min(60,x.rain*5) - Math.max(0,x.pop-30)*0.3 - Math.max(0,x.wind-15)*1.5 - Math.max(0,x.tmax-33)*4;
    return Math.max(0,Math.min(100,Math.round(s)));
  }
  function label(s){ return s>=70?'Good':(s>=40?'Fair':'Poor'); }

  function advisories(days, month){
    var a=[], i, name=function(k){return fmtDay(days[k].date,k);};
    var heavy=days.findIndex(function(x){return x.rain>=30;});
    if(heavy>-1) a.push({level:'warn',title:'Heavy rain expected '+name(heavy).toLowerCase(),text:'About '+round(days[heavy].rain)+' mm forecast. Clear drains and furrows, hold fertiliser and spraying, and protect seedlings from waterlogging.'});
    var run=0, wetStart=-1, wet=false;
    for(i=0;i<days.length;i++){ if(days[i].rain>=5){ if(run===0) wetStart=i; run++; if(run>=3){wet=true;break;} } else run=0; }
    if(wet) a.push({level:'watch',title:'Wet spell: watch for fungal disease',text:'Three or more wet days in a row from '+name(wetStart).toLowerCase()+'. Scout tomatoes, onions and cabbage for blight, mildew and rot, and improve airflow between plants.'});
    var heat=days.findIndex(function(x){return x.tmax>=35;});
    if(heat>-1) a.push({level:'warn',title:'Heat stress around '+name(heat).toLowerCase(),text:'Highs of '+round(days[heat].tmax)+'°C. Irrigate early morning or late evening, mulch bare soil and shade the nursery.'});
    var rainSum=0, etSum=0, tAvg=0; days.forEach(function(x){rainSum+=x.rain; etSum+=x.et0; tAvg+=x.tmax;}); tAvg/=days.length;
    if(rainSum<5 && (etSum>=30 || tAvg>=30)) a.push({level:'watch',title:'Dry week ahead: irrigation priority',text:'Under 5 mm of rain forecast for the week. Run drip lines on a regular schedule, mulch to hold moisture, and water the nursery daily.'});
    var wind=days.findIndex(function(x){return x.wind>=35;});
    if(wind>-1) a.push({level:'watch',title:'Strong wind '+name(wind).toLowerCase(),text:'Gusts up to '+round(days[wind].wind)+' km/h. Do not spray, and secure nursery covers and tall crops.'});
    var cold=days.findIndex(function(x){return x.tmin<=8;});
    if(cold>-1) a.push({level:'watch',title:'Cold night '+name(cold).toLowerCase(),text:'Lows near '+round(days[cold].tmin)+'°C. Cover young seedlings and tender leafy vegetables overnight.'});
    if(month>=9 && month<=11){
      for(i=0;i<days.length-2;i++){ if(days[i].rain>=10 && days[i].rain+days[i+1].rain+days[i+2].rain>=20){
        a.push({level:'info',title:'Early rains: planting window may be opening',text:'Rain is forecast from '+name(i).toLowerCase()+'. Wait for follow-up rains before sowing rain-fed crops, and prepare seedbeds and nursery stock.'}); break; } }
    }
    var good=[]; days.forEach(function(x,k){ if(x.rain<1 && x.pop<=20 && x.wind<=15) good.push(name(k)); });
    if(good.length) a.push({level:'good',title:'Good days for spraying and field work',text:good.slice(0,4).join(', ')+': dry, calm and low chance of rain.'});
    if(!a.length) a.push({level:'info',title:'No weather warnings this week',text:'Nothing unusual in the forecast. Keep to your normal irrigation and field routine.'});
    return a;
  }

  function icon(x){ return x.rain>=10?'Rain':(x.rain>=1||x.pop>=50?'Showers':(x.tmax>=33?'Hot':'Dry')); }

  function render(days, siteName){
    var box=$('#wx-days'); box.innerHTML='';
    days.forEach(function(x,i){
      var s=fieldIndex(x), c=label(s).toLowerCase();
      var el=document.createElement('div'); el.className='wx-day';
      el.innerHTML='<div class="wx-d">'+fmtDay(x.date,i)+'</div><div class="wx-i">'+icon(x)+'</div><div class="wx-t">'+round(x.tmax)+'° <span>'+round(x.tmin)+'°</span></div>'+
        '<div class="wx-r">'+(x.rain>=0.1?x.rain.toFixed(1)+' mm':'No rain')+(x.pop?' · '+round(x.pop)+'%':'')+'</div>'+
        '<div class="wx-idx wx-'+c+'" title="Field work index">'+label(s)+'<small>'+s+'</small></div>';
      box.appendChild(el);
    });
    var list=$('#wx-adv'); list.innerHTML='';
    advisories(days,new Date().getMonth()).forEach(function(a){
      var li=document.createElement('div'); li.className='wx-adv wx-lv-'+a.level;
      li.innerHTML='<h3></h3><p></p>'; $('h3',li).textContent=a.title; $('p',li).textContent=a.text; list.appendChild(li);
    });
    $('#wx-place').textContent=siteName;
    $('#wx-status').textContent='';
  }

  function load(key){
    var s=SITES[key]; $('#wx-status').textContent='Loading forecast…';
    var url='https://api.open-meteo.com/v1/forecast?latitude='+s.lat+'&longitude='+s.lon+
      '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,et0_fao_evapotranspiration&timezone=Africa%2FLusaka&forecast_days=7';
    fetch(url).then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(j){ render(parse(j), s.name); })
      .catch(function(){ $('#wx-status').textContent='The forecast could not be loaded right now. Please try again shortly.'; });
  }

  function initTabs(){
    var tabs=document.querySelectorAll('.wx-tab');
    tabs.forEach(function(t){ t.addEventListener('click',function(){
      tabs.forEach(function(o){o.setAttribute('aria-pressed','false');}); t.setAttribute('aria-pressed','true'); load(t.dataset.site); }); });
    load('kafue');
  }

  function initForm(){
    var form=$('#alert-form'), msg=$('#alert-msg'); if(!form) return;
    if(!ALERTS_ENABLED){
      form.hidden=true; $('#alert-soon').hidden=false; return;
    }
    form.addEventListener('submit',function(e){
      e.preventDefault(); msg.className='wx-msg'; msg.textContent='Sending…';
      var fd=new FormData(form), locs=[]; form.querySelectorAll('input[name=locations]:checked').forEach(function(c){locs.push(c.value);});
      if(!fd.get('email') && !fd.get('phone')){ msg.className='wx-msg err'; msg.textContent='Please give an email address or a phone number.'; return; }
      if(!locs.length){ msg.className='wx-msg err'; msg.textContent='Please choose at least one location.'; return; }
      var body={name:fd.get('name')||'',email:fd.get('email')||'',phone:fd.get('phone')||'',whatsapp:!!fd.get('whatsapp'),locations:locs,crops:fd.get('crops')||'',consent:!!fd.get('consent'),website:fd.get('website')||''};
      fetch(ALERTS_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
        .then(function(r){return r.json();})
        .then(function(j){ if(j.ok){ msg.className='wx-msg ok'; msg.textContent=j.message||'Thank you. Check your email to confirm your subscription.'; form.reset(); } else { msg.className='wx-msg err'; msg.textContent=j.error||'Something went wrong. Please try again.'; } })
        .catch(function(){ msg.className='wx-msg err'; msg.textContent='Could not reach the alerts service. Please try again, or message us on WhatsApp.'; });
    });
  }

  document.addEventListener('DOMContentLoaded',function(){ initTabs(); initForm(); });
})();
