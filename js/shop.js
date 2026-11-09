/* Insansu online shop: cart in the browser, order sent on WhatsApp, payment by Pay na 543 or MTN MoMo. */
(function(){
  var S=window.INSANSU_SHOP; if(!S) return;
  var KEY='insansu_cart_v1', cart={};
  var $=function(s,r){return (r||document).querySelector(s);};
  function load(){ try{ cart=JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ cart={}; } }
  function save(){ try{ localStorage.setItem(KEY,JSON.stringify(cart)); }catch(e){} }
  function money(n){ return 'K'+n.toLocaleString('en-ZM',{minimumFractionDigits:0,maximumFractionDigits:2}); }
  function byId(id){ return S.products.filter(function(p){return p.id===id;})[0]; }
  function priceText(p){ return p.price==null ? 'Price on request' : money(p.price)+(p.unit?' '+p.unit:''); }

  function renderProducts(){
    var g=$('#shop-grid'); g.innerHTML='';
    S.products.forEach(function(p){
      var el=document.createElement('article'); el.className='shop-card';
      el.innerHTML='<img alt="" loading="lazy"><div class="shop-body"><h3></h3><p class="shop-desc"></p><p class="shop-price"></p><div class="shop-add"></div></div>';
      var img=$('img',el); img.src=p.img; img.alt=p.name;
      $('h3',el).textContent=p.name; $('.shop-desc',el).textContent=p.desc; $('.shop-price',el).textContent=priceText(p);
      var add=$('.shop-add',el);
      if(p.available===false){ add.textContent='Currently unavailable'; }
      else{ var b=document.createElement('button'); b.type='button'; b.className='btn btn-small'; b.textContent='Add to order';
        b.addEventListener('click',function(){ cart[p.id]=(cart[p.id]||0)+1; save(); renderCart(); flash(b); }); add.appendChild(b); }
      g.appendChild(el);
    });
  }
  function flash(b){ var t=b.textContent; b.textContent='Added ✓'; setTimeout(function(){b.textContent=t;},900); }

  function totals(){
    var items=[], total=0, unpriced=false, count=0;
    Object.keys(cart).forEach(function(id){ var p=byId(id), q=cart[id]; if(!p||q<1) return; count+=q;
      var line=(p.price==null)?null:p.price*q; if(line==null) unpriced=true; else total+=line; items.push({p:p,q:q,line:line}); });
    return {items:items,total:total,unpriced:unpriced,count:count};
  }

  function renderCart(){
    var t=totals(), box=$('#cart-lines'); box.innerHTML='';
    var bar=$('#cart-bar'); bar.hidden=t.count===0; $('#bar-count').textContent=t.count+(t.count===1?' item':' items');
    $('#cart-empty').hidden=t.count>0; $('#checkout').hidden=t.count===0;
    t.items.forEach(function(it){
      var row=document.createElement('div'); row.className='cart-row';
      row.innerHTML='<span class="cart-name"></span><span class="cart-qty"><button type="button" aria-label="Less">−</button><b></b><button type="button" aria-label="More">+</button></span><span class="cart-line"></span>';
      $('.cart-name',row).textContent=it.p.name; $('b',row).textContent=it.q;
      $('.cart-line',row).textContent=it.line==null?'Price on request':money(it.line);
      var bs=row.querySelectorAll('button');
      bs[0].addEventListener('click',function(){ cart[it.p.id]=it.q-1; if(cart[it.p.id]<1) delete cart[it.p.id]; save(); renderCart(); });
      bs[1].addEventListener('click',function(){ cart[it.p.id]=it.q+1; save(); renderCart(); });
      box.appendChild(row);
    });
    var tt=$('#cart-total');
    tt.textContent = t.unpriced ? (t.total>0 ? money(t.total)+' so far, plus items on request' : 'We will confirm the total on WhatsApp') : money(t.total);
    $('#pay-amount').textContent = t.unpriced ? 'the total we confirm with you' : money(t.total);
  }

  function ref(){ return 'INS-'+Date.now().toString(36).slice(-5).toUpperCase(); }
  var orderRef=ref(), loc=null;
  function buildMessage(f){
    var t=totals(), L=[];
    L.push('Hello Insansu Venture, I would like to place an order. Order '+orderRef+'.','');
    t.items.forEach(function(it){ L.push('- '+it.q+' x '+it.p.name+(it.line==null?' (price to confirm)':' = '+money(it.line))); });
    L.push('', 'Total: '+(t.unpriced?(t.total>0?money(t.total)+' so far, please confirm the rest':'please confirm'):money(t.total)));
    L.push('Name: '+f.name, 'Phone: '+f.phone, 'Delivery: '+f.area+(f.address?' - '+f.address:''));
    if(f.notes) L.push('Notes: '+f.notes);
    if(loc) L.push('Location: https://maps.google.com/?q='+loc.lat.toFixed(6)+','+loc.lon.toFixed(6));
    L.push('Payment: '+(f.pay==='543'?'Pay na 543 (*543*'+S.pay543Code+'#)':f.pay==='momo'?'MTN MoMo to '+S.momoNumber:'I will choose when you confirm'));
    return L.join('\n');
  }

  function initCheckout(){
    var sel=$('#c-area'); S.deliveryAreas.forEach(function(a){ var o=document.createElement('option'); o.value=a; o.textContent=a; sel.appendChild(o); });
    $('#pay543-code').textContent=S.pay543Code; $('#pay543-dial').textContent='*543*'+S.pay543Code+'#';
    $('#pay543-link').href='tel:*543*'+S.pay543Code+'%23'; $('#momo-num').textContent=S.momoNumber;
    $('#ord-ref').textContent=orderRef;
    $('#c-loc').addEventListener('click',function(){
      var m=$('#c-loc-msg'), b=this;
      if(!navigator.geolocation){ m.textContent='Your browser cannot share location. Please type your address or landmark instead.'; return; }
      m.textContent='Finding your location…';
      navigator.geolocation.getCurrentPosition(function(p){
        loc={lat:p.coords.latitude,lon:p.coords.longitude};
        m.textContent='Location added ✓ (accuracy about '+Math.round(p.coords.accuracy)+' m). A map link will be included in your order.'; b.textContent='Update my location';
      },function(){ loc=null; m.textContent='We could not get your location. Please allow location access, or type your address or landmark instead.'; },{enableHighAccuracy:true,timeout:15000,maximumAge:60000});
    });
    $('#clear-cart').addEventListener('click',function(){ cart={}; save(); renderCart(); });
    $('#checkout').addEventListener('submit',function(e){
      e.preventDefault(); var fd=new FormData(e.target), msg=$('#co-msg');
      var f={name:(fd.get('name')||'').trim(),phone:(fd.get('phone')||'').trim(),area:fd.get('area'),address:(fd.get('address')||'').trim(),notes:(fd.get('notes')||'').trim(),pay:fd.get('pay')};
      if(!f.name||!f.phone){ msg.className='wx-msg err'; msg.textContent='Please add your name and phone number.'; return; }
      if(totals().count===0){ return; }
      msg.className='wx-msg ok'; msg.textContent='Opening WhatsApp. Please press Send there to place your order.';
      var url='https://wa.me/'+S.whatsapp+'?text='+encodeURIComponent(buildMessage(f));
      if(window.gtag){ try{ gtag('event','begin_checkout',{value:totals().total,currency:'ZMW'}); }catch(x){} }
      window.open(url,'_blank','noopener');
    });
  }

  document.addEventListener('DOMContentLoaded',function(){ load(); renderProducts(); initCheckout(); renderCart(); });
})();
