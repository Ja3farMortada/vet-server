import{a as ke}from"./chunk-GLAC23CS.js";import{A as J,Bb as Ne,Sb as Ee,aa as B,l as ae,lb as ve,w as ee}from"./chunk-FYHOXPUP.js";var Se=class{constructor(){this.cost_dollar=0,this.subtotal_dollar=0,this.total_dollar=0,this.discount_dollar=0,this.discount2_dollar=0,this.total_dollar_discount_2=0,this.vat_dollar=0,this.total_qty=0}},Ze=function(e){return e.unit_price_usd="unit_price_usd",e}(Ze||{});var Hi=(()=>{let i=class i{constructor(){this.http=J(ve),this.apiService=J(Ne),this.notificationService=J(Ee),this.stockService=J(ke),this.invoice=B([]),this.signal_submited=B(!1),this.submitCheckoutLoading=B(!1),this.reset$=new ae(!1),this.factor=B(1),this.barcodeResponse=new ae(null),this.products=this.stockService.products,this.selected_customer_id=B(null),this.payment_amount=B(0),this.operation_type=B("normal")}submitBarcode(t){let r=this.products().find(s=>s.barcode==t);r?this.barcodeResponse.next(r):this.notificationService.showError("Item not found!","home")}checkout(t,r){this.signal_submited.set(!0),this.submitCheckoutLoading.set(!0);let s=null;t.customer_id&&r&&(s={amount:r,customer_id:t.customer_id,payment_date:t.order_datetime}),this.http.post(`${this.apiService.host}/sell-orders`,{invoice:t,payment:s}).subscribe({next:o=>{this.notificationService.showSuccess(o.message,"home"),o.whatsapp&&this.notificationService.showInfo("Whatsapp sent successfully!","home",!1)},error:o=>{this.notificationService.showError(o.error.message,"home"),this.submitCheckoutLoading.set(!1)},complete:()=>{this.stockService.getItems(),this.invoice.set([]),this.signal_submited.set(!1),this.submitCheckoutLoading.set(!1),this.reset$.next(!0)}})}};i.\u0275fac=function(r){return new(r||i)},i.\u0275prov=ee({token:i,factory:i.\u0275fac,providedIn:"root"});let e=i;return e})();var W=9e15,j=1e9,he="0123456789abcdef",ne="2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058",te="3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789",de={precision:20,rounding:4,modulo:1,toExpNeg:-7,toExpPos:21,minE:-W,maxE:W,crypto:!1},_e,U,w=!0,se="[DecimalError] ",V=se+"Invalid argument: ",qe=se+"Precision limit exceeded",Ie=se+"crypto unavailable",Le="[object Decimal]",I=Math.floor,b=Math.pow,Be=/^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,He=/^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,$e=/^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,Pe=/^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,D=1e7,m=7,Ve=9007199254740991,je=ne.length-1,pe=te.length-1,d={toStringTag:Le};d.absoluteValue=d.abs=function(){var e=new this.constructor(this);return e.s<0&&(e.s=1),p(e)};d.ceil=function(){return p(new this.constructor(this),this.e+1,2)};d.clampedTo=d.clamp=function(e,i){var n,t=this,r=t.constructor;if(e=new r(e),i=new r(i),!e.s||!i.s)return new r(NaN);if(e.gt(i))throw Error(V+i);return n=t.cmp(e),n<0?e:t.cmp(i)>0?i:new r(t)};d.comparedTo=d.cmp=function(e){var i,n,t,r,s=this,o=s.d,u=(e=new s.constructor(e)).d,c=s.s,f=e.s;if(!o||!u)return!c||!f?NaN:c!==f?c:o===u?0:!o^c<0?1:-1;if(!o[0]||!u[0])return o[0]?c:u[0]?-f:0;if(c!==f)return c;if(s.e!==e.e)return s.e>e.e^c<0?1:-1;for(t=o.length,r=u.length,i=0,n=t<r?t:r;i<n;++i)if(o[i]!==u[i])return o[i]>u[i]^c<0?1:-1;return t===r?0:t>r^c<0?1:-1};d.cosine=d.cos=function(){var e,i,n=this,t=n.constructor;return n.d?n.d[0]?(e=t.precision,i=t.rounding,t.precision=e+Math.max(n.e,n.sd())+m,t.rounding=1,n=We(t,Re(t,n)),t.precision=e,t.rounding=i,p(U==2||U==3?n.neg():n,e,i,!0)):new t(1):new t(NaN)};d.cubeRoot=d.cbrt=function(){var e,i,n,t,r,s,o,u,c,f,l=this,a=l.constructor;if(!l.isFinite()||l.isZero())return new a(l);for(w=!1,s=l.s*b(l.s*l,1/3),!s||Math.abs(s)==1/0?(n=M(l.d),e=l.e,(s=(e-n.length+1)%3)&&(n+=s==1||s==-2?"0":"00"),s=b(n,1/3),e=I((e+1)/3)-(e%3==(e<0?-1:2)),s==1/0?n="5e"+e:(n=s.toExponential(),n=n.slice(0,n.indexOf("e")+1)+e),t=new a(n),t.s=l.s):t=new a(s.toString()),o=(e=a.precision)+3;;)if(u=t,c=u.times(u).times(u),f=c.plus(l),t=k(f.plus(l).times(u),f.plus(c),o+2,1),M(u.d).slice(0,o)===(n=M(t.d)).slice(0,o))if(n=n.slice(o-3,o+1),n=="9999"||!r&&n=="4999"){if(!r&&(p(u,e+1,0),u.times(u).times(u).eq(l))){t=u;break}o+=4,r=1}else{(!+n||!+n.slice(1)&&n.charAt(0)=="5")&&(p(t,e+1,1),i=!t.times(t).times(t).eq(l));break}return w=!0,p(t,e,a.rounding,i)};d.decimalPlaces=d.dp=function(){var e,i=this.d,n=NaN;if(i){if(e=i.length-1,n=(e-I(this.e/m))*m,e=i[e],e)for(;e%10==0;e/=10)n--;n<0&&(n=0)}return n};d.dividedBy=d.div=function(e){return k(this,new this.constructor(e))};d.dividedToIntegerBy=d.divToInt=function(e){var i=this,n=i.constructor;return p(k(i,new n(e),0,1,1),n.precision,n.rounding)};d.equals=d.eq=function(e){return this.cmp(e)===0};d.floor=function(){return p(new this.constructor(this),this.e+1,3)};d.greaterThan=d.gt=function(e){return this.cmp(e)>0};d.greaterThanOrEqualTo=d.gte=function(e){var i=this.cmp(e);return i==1||i===0};d.hyperbolicCosine=d.cosh=function(){var e,i,n,t,r,s=this,o=s.constructor,u=new o(1);if(!s.isFinite())return new o(s.s?1/0:NaN);if(s.isZero())return u;n=o.precision,t=o.rounding,o.precision=n+Math.max(s.e,s.sd())+4,o.rounding=1,r=s.d.length,r<32?(e=Math.ceil(r/3),i=(1/ue(4,e)).toString()):(e=16,i="2.3283064365386962890625e-10"),s=G(o,1,s.times(i),new o(1),!0);for(var c,f=e,l=new o(8);f--;)c=s.times(s),s=u.minus(c.times(l.minus(c.times(l))));return p(s,o.precision=n,o.rounding=t,!0)};d.hyperbolicSine=d.sinh=function(){var e,i,n,t,r=this,s=r.constructor;if(!r.isFinite()||r.isZero())return new s(r);if(i=s.precision,n=s.rounding,s.precision=i+Math.max(r.e,r.sd())+4,s.rounding=1,t=r.d.length,t<3)r=G(s,2,r,r,!0);else{e=1.4*Math.sqrt(t),e=e>16?16:e|0,r=r.times(1/ue(5,e)),r=G(s,2,r,r,!0);for(var o,u=new s(5),c=new s(16),f=new s(20);e--;)o=r.times(r),r=r.times(u.plus(o.times(c.times(o).plus(f))))}return s.precision=i,s.rounding=n,p(r,i,n,!0)};d.hyperbolicTangent=d.tanh=function(){var e,i,n=this,t=n.constructor;return n.isFinite()?n.isZero()?new t(n):(e=t.precision,i=t.rounding,t.precision=e+7,t.rounding=1,k(n.sinh(),n.cosh(),t.precision=e,t.rounding=i)):new t(n.s)};d.inverseCosine=d.acos=function(){var e,i=this,n=i.constructor,t=i.abs().cmp(1),r=n.precision,s=n.rounding;return t!==-1?t===0?i.isNeg()?O(n,r,s):new n(0):new n(NaN):i.isZero()?O(n,r+4,s).times(.5):(n.precision=r+6,n.rounding=1,i=i.asin(),e=O(n,r+4,s).times(.5),n.precision=r,n.rounding=s,e.minus(i))};d.inverseHyperbolicCosine=d.acosh=function(){var e,i,n=this,t=n.constructor;return n.lte(1)?new t(n.eq(1)?0:NaN):n.isFinite()?(e=t.precision,i=t.rounding,t.precision=e+Math.max(Math.abs(n.e),n.sd())+4,t.rounding=1,w=!1,n=n.times(n).minus(1).sqrt().plus(n),w=!0,t.precision=e,t.rounding=i,n.ln()):new t(n)};d.inverseHyperbolicSine=d.asinh=function(){var e,i,n=this,t=n.constructor;return!n.isFinite()||n.isZero()?new t(n):(e=t.precision,i=t.rounding,t.precision=e+2*Math.max(Math.abs(n.e),n.sd())+6,t.rounding=1,w=!1,n=n.times(n).plus(1).sqrt().plus(n),w=!0,t.precision=e,t.rounding=i,n.ln())};d.inverseHyperbolicTangent=d.atanh=function(){var e,i,n,t,r=this,s=r.constructor;return r.isFinite()?r.e>=0?new s(r.abs().eq(1)?r.s/0:r.isZero()?r:NaN):(e=s.precision,i=s.rounding,t=r.sd(),Math.max(t,e)<2*-r.e-1?p(new s(r),e,i,!0):(s.precision=n=t-r.e,r=k(r.plus(1),new s(1).minus(r),n+e,1),s.precision=e+4,s.rounding=1,r=r.ln(),s.precision=e,s.rounding=i,r.times(.5))):new s(NaN)};d.inverseSine=d.asin=function(){var e,i,n,t,r=this,s=r.constructor;return r.isZero()?new s(r):(i=r.abs().cmp(1),n=s.precision,t=s.rounding,i!==-1?i===0?(e=O(s,n+4,t).times(.5),e.s=r.s,e):new s(NaN):(s.precision=n+6,s.rounding=1,r=r.div(new s(1).minus(r.times(r)).sqrt().plus(1)).atan(),s.precision=n,s.rounding=t,r.times(2)))};d.inverseTangent=d.atan=function(){var e,i,n,t,r,s,o,u,c,f=this,l=f.constructor,a=l.precision,h=l.rounding;if(f.isFinite()){if(f.isZero())return new l(f);if(f.abs().eq(1)&&a+4<=pe)return o=O(l,a+4,h).times(.25),o.s=f.s,o}else{if(!f.s)return new l(NaN);if(a+4<=pe)return o=O(l,a+4,h).times(.5),o.s=f.s,o}for(l.precision=u=a+10,l.rounding=1,n=Math.min(28,u/m+2|0),e=n;e;--e)f=f.div(f.times(f).plus(1).sqrt().plus(1));for(w=!1,i=Math.ceil(u/m),t=1,c=f.times(f),o=new l(f),r=f;e!==-1;)if(r=r.times(c),s=o.minus(r.div(t+=2)),r=r.times(c),o=s.plus(r.div(t+=2)),o.d[i]!==void 0)for(e=i;o.d[e]===s.d[e]&&e--;);return n&&(o=o.times(2<<n-1)),w=!0,p(o,l.precision=a,l.rounding=h,!0)};d.isFinite=function(){return!!this.d};d.isInteger=d.isInt=function(){return!!this.d&&I(this.e/m)>this.d.length-2};d.isNaN=function(){return!this.s};d.isNegative=d.isNeg=function(){return this.s<0};d.isPositive=d.isPos=function(){return this.s>0};d.isZero=function(){return!!this.d&&this.d[0]===0};d.lessThan=d.lt=function(e){return this.cmp(e)<0};d.lessThanOrEqualTo=d.lte=function(e){return this.cmp(e)<1};d.logarithm=d.log=function(e){var i,n,t,r,s,o,u,c,f=this,l=f.constructor,a=l.precision,h=l.rounding,g=5;if(e==null)e=new l(10),i=!0;else{if(e=new l(e),n=e.d,e.s<0||!n||!n[0]||e.eq(1))return new l(NaN);i=e.eq(10)}if(n=f.d,f.s<0||!n||!n[0]||f.eq(1))return new l(n&&!n[0]?-1/0:f.s!=1?NaN:n?0:1/0);if(i)if(n.length>1)s=!0;else{for(r=n[0];r%10===0;)r/=10;s=r!==1}if(w=!1,u=a+g,o=$(f,u),t=i?re(l,u+10):$(e,u),c=k(o,t,u,1),K(c.d,r=a,h))do if(u+=10,o=$(f,u),t=i?re(l,u+10):$(e,u),c=k(o,t,u,1),!s){+M(c.d).slice(r+1,r+15)+1==1e14&&(c=p(c,a+1,0));break}while(K(c.d,r+=10,h));return w=!0,p(c,a,h)};d.minus=d.sub=function(e){var i,n,t,r,s,o,u,c,f,l,a,h,g=this,N=g.constructor;if(e=new N(e),!g.d||!e.d)return!g.s||!e.s?e=new N(NaN):g.d?e.s=-e.s:e=new N(e.d||g.s!==e.s?g:NaN),e;if(g.s!=e.s)return e.s=-e.s,g.plus(e);if(f=g.d,h=e.d,u=N.precision,c=N.rounding,!f[0]||!h[0]){if(h[0])e.s=-e.s;else if(f[0])e=new N(g);else return new N(c===3?-0:0);return w?p(e,u,c):e}if(n=I(e.e/m),l=I(g.e/m),f=f.slice(),s=l-n,s){for(a=s<0,a?(i=f,s=-s,o=h.length):(i=h,n=l,o=f.length),t=Math.max(Math.ceil(u/m),o)+2,s>t&&(s=t,i.length=1),i.reverse(),t=s;t--;)i.push(0);i.reverse()}else{for(t=f.length,o=h.length,a=t<o,a&&(o=t),t=0;t<o;t++)if(f[t]!=h[t]){a=f[t]<h[t];break}s=0}for(a&&(i=f,f=h,h=i,e.s=-e.s),o=f.length,t=h.length-o;t>0;--t)f[o++]=0;for(t=h.length;t>s;){if(f[--t]<h[t]){for(r=t;r&&f[--r]===0;)f[r]=D-1;--f[r],f[t]+=D}f[t]-=h[t]}for(;f[--o]===0;)f.pop();for(;f[0]===0;f.shift())--n;return f[0]?(e.d=f,e.e=oe(f,n),w?p(e,u,c):e):new N(c===3?-0:0)};d.modulo=d.mod=function(e){var i,n=this,t=n.constructor;return e=new t(e),!n.d||!e.s||e.d&&!e.d[0]?new t(NaN):!e.d||n.d&&!n.d[0]?p(new t(n),t.precision,t.rounding):(w=!1,t.modulo==9?(i=k(n,e.abs(),0,3,1),i.s*=e.s):i=k(n,e,0,t.modulo,1),i=i.times(e),w=!0,n.minus(i))};d.naturalExponential=d.exp=function(){return ge(this)};d.naturalLogarithm=d.ln=function(){return $(this)};d.negated=d.neg=function(){var e=new this.constructor(this);return e.s=-e.s,p(e)};d.plus=d.add=function(e){var i,n,t,r,s,o,u,c,f,l,a=this,h=a.constructor;if(e=new h(e),!a.d||!e.d)return!a.s||!e.s?e=new h(NaN):a.d||(e=new h(e.d||a.s===e.s?a:NaN)),e;if(a.s!=e.s)return e.s=-e.s,a.minus(e);if(f=a.d,l=e.d,u=h.precision,c=h.rounding,!f[0]||!l[0])return l[0]||(e=new h(a)),w?p(e,u,c):e;if(s=I(a.e/m),t=I(e.e/m),f=f.slice(),r=s-t,r){for(r<0?(n=f,r=-r,o=l.length):(n=l,t=s,o=f.length),s=Math.ceil(u/m),o=s>o?s+1:o+1,r>o&&(r=o,n.length=1),n.reverse();r--;)n.push(0);n.reverse()}for(o=f.length,r=l.length,o-r<0&&(r=o,n=l,l=f,f=n),i=0;r;)i=(f[--r]=f[r]+l[r]+i)/D|0,f[r]%=D;for(i&&(f.unshift(i),++t),o=f.length;f[--o]==0;)f.pop();return e.d=f,e.e=oe(f,t),w?p(e,u,c):e};d.precision=d.sd=function(e){var i,n=this;if(e!==void 0&&e!==!!e&&e!==1&&e!==0)throw Error(V+e);return n.d?(i=Ae(n.d),e&&n.e+1>i&&(i=n.e+1)):i=NaN,i};d.round=function(){var e=this,i=e.constructor;return p(new i(e),e.e+1,i.rounding)};d.sine=d.sin=function(){var e,i,n=this,t=n.constructor;return n.isFinite()?n.isZero()?new t(n):(e=t.precision,i=t.rounding,t.precision=e+Math.max(n.e,n.sd())+m,t.rounding=1,n=Xe(t,Re(t,n)),t.precision=e,t.rounding=i,p(U>2?n.neg():n,e,i,!0)):new t(NaN)};d.squareRoot=d.sqrt=function(){var e,i,n,t,r,s,o=this,u=o.d,c=o.e,f=o.s,l=o.constructor;if(f!==1||!u||!u[0])return new l(!f||f<0&&(!u||u[0])?NaN:u?o:1/0);for(w=!1,f=Math.sqrt(+o),f==0||f==1/0?(i=M(u),(i.length+c)%2==0&&(i+="0"),f=Math.sqrt(i),c=I((c+1)/2)-(c<0||c%2),f==1/0?i="5e"+c:(i=f.toExponential(),i=i.slice(0,i.indexOf("e")+1)+c),t=new l(i)):t=new l(f.toString()),n=(c=l.precision)+3;;)if(s=t,t=s.plus(k(o,s,n+2,1)).times(.5),M(s.d).slice(0,n)===(i=M(t.d)).slice(0,n))if(i=i.slice(n-3,n+1),i=="9999"||!r&&i=="4999"){if(!r&&(p(s,c+1,0),s.times(s).eq(o))){t=s;break}n+=4,r=1}else{(!+i||!+i.slice(1)&&i.charAt(0)=="5")&&(p(t,c+1,1),e=!t.times(t).eq(o));break}return w=!0,p(t,c,l.rounding,e)};d.tangent=d.tan=function(){var e,i,n=this,t=n.constructor;return n.isFinite()?n.isZero()?new t(n):(e=t.precision,i=t.rounding,t.precision=e+10,t.rounding=1,n=n.sin(),n.s=1,n=k(n,new t(1).minus(n.times(n)).sqrt(),e+10,0),t.precision=e,t.rounding=i,p(U==2||U==4?n.neg():n,e,i,!0)):new t(NaN)};d.times=d.mul=function(e){var i,n,t,r,s,o,u,c,f,l=this,a=l.constructor,h=l.d,g=(e=new a(e)).d;if(e.s*=l.s,!h||!h[0]||!g||!g[0])return new a(!e.s||h&&!h[0]&&!g||g&&!g[0]&&!h?NaN:!h||!g?e.s/0:e.s*0);for(n=I(l.e/m)+I(e.e/m),c=h.length,f=g.length,c<f&&(s=h,h=g,g=s,o=c,c=f,f=o),s=[],o=c+f,t=o;t--;)s.push(0);for(t=f;--t>=0;){for(i=0,r=c+t;r>t;)u=s[r]+g[t]*h[r-t-1]+i,s[r--]=u%D|0,i=u/D|0;s[r]=(s[r]+i)%D|0}for(;!s[--o];)s.pop();return i?++n:s.shift(),e.d=s,e.e=oe(s,n),w?p(e,a.precision,a.rounding):e};d.toBinary=function(e,i){return we(this,2,e,i)};d.toDecimalPlaces=d.toDP=function(e,i){var n=this,t=n.constructor;return n=new t(n),e===void 0?n:(P(e,0,j),i===void 0?i=t.rounding:P(i,0,8),p(n,e+n.e+1,i))};d.toExponential=function(e,i){var n,t=this,r=t.constructor;return e===void 0?n=R(t,!0):(P(e,0,j),i===void 0?i=r.rounding:P(i,0,8),t=p(new r(t),e+1,i),n=R(t,!0,e+1)),t.isNeg()&&!t.isZero()?"-"+n:n};d.toFixed=function(e,i){var n,t,r=this,s=r.constructor;return e===void 0?n=R(r):(P(e,0,j),i===void 0?i=s.rounding:P(i,0,8),t=p(new s(r),e+r.e+1,i),n=R(t,!1,e+t.e+1)),r.isNeg()&&!r.isZero()?"-"+n:n};d.toFraction=function(e){var i,n,t,r,s,o,u,c,f,l,a,h,g=this,N=g.d,v=g.constructor;if(!N)return new v(g);if(f=n=new v(1),t=c=new v(0),i=new v(t),s=i.e=Ae(N)-g.e-1,o=s%m,i.d[0]=b(10,o<0?m+o:o),e==null)e=s>0?i:f;else{if(u=new v(e),!u.isInt()||u.lt(f))throw Error(V+u);e=u.gt(i)?s>0?i:f:u}for(w=!1,u=new v(M(N)),l=v.precision,v.precision=s=N.length*m*2;a=k(u,i,0,1,1),r=n.plus(a.times(t)),r.cmp(e)!=1;)n=t,t=r,r=f,f=c.plus(a.times(r)),c=r,r=i,i=u.minus(a.times(r)),u=r;return r=k(e.minus(n),t,0,1,1),c=c.plus(r.times(f)),n=n.plus(r.times(t)),c.s=f.s=g.s,h=k(f,t,s,1).minus(g).abs().cmp(k(c,n,s,1).minus(g).abs())<1?[f,t]:[c,n],v.precision=l,w=!0,h};d.toHexadecimal=d.toHex=function(e,i){return we(this,16,e,i)};d.toNearest=function(e,i){var n=this,t=n.constructor;if(n=new t(n),e==null){if(!n.d)return n;e=new t(1),i=t.rounding}else{if(e=new t(e),i===void 0?i=t.rounding:P(i,0,8),!n.d)return e.s?n:e;if(!e.d)return e.s&&(e.s=n.s),e}return e.d[0]?(w=!1,n=k(n,e,0,i,1).times(e),w=!0,p(n)):(e.s=n.s,n=e),n};d.toNumber=function(){return+this};d.toOctal=function(e,i){return we(this,8,e,i)};d.toPower=d.pow=function(e){var i,n,t,r,s,o,u=this,c=u.constructor,f=+(e=new c(e));if(!u.d||!e.d||!u.d[0]||!e.d[0])return new c(b(+u,f));if(u=new c(u),u.eq(1))return u;if(t=c.precision,s=c.rounding,e.eq(1))return p(u,t,s);if(i=I(e.e/m),i>=e.d.length-1&&(n=f<0?-f:f)<=Ve)return r=Fe(c,u,n,t),e.s<0?new c(1).div(r):p(r,t,s);if(o=u.s,o<0){if(i<e.d.length-1)return new c(NaN);if(e.d[i]&1||(o=1),u.e==0&&u.d[0]==1&&u.d.length==1)return u.s=o,u}return n=b(+u,f),i=n==0||!isFinite(n)?I(f*(Math.log("0."+M(u.d))/Math.LN10+u.e+1)):new c(n+"").e,i>c.maxE+1||i<c.minE-1?new c(i>0?o/0:0):(w=!1,c.rounding=u.s=1,n=Math.min(12,(i+"").length),r=ge(e.times($(u,t+n)),t),r.d&&(r=p(r,t+5,1),K(r.d,t,s)&&(i=t+10,r=p(ge(e.times($(u,i+n)),i),i+5,1),+M(r.d).slice(t+1,t+15)+1==1e14&&(r=p(r,t+1,0)))),r.s=o,w=!0,c.rounding=s,p(r,t,s))};d.toPrecision=function(e,i){var n,t=this,r=t.constructor;return e===void 0?n=R(t,t.e<=r.toExpNeg||t.e>=r.toExpPos):(P(e,1,j),i===void 0?i=r.rounding:P(i,0,8),t=p(new r(t),e,i),n=R(t,e<=t.e||t.e<=r.toExpNeg,e)),t.isNeg()&&!t.isZero()?"-"+n:n};d.toSignificantDigits=d.toSD=function(e,i){var n=this,t=n.constructor;return e===void 0?(e=t.precision,i=t.rounding):(P(e,1,j),i===void 0?i=t.rounding:P(i,0,8)),p(new t(n),e,i)};d.toString=function(){var e=this,i=e.constructor,n=R(e,e.e<=i.toExpNeg||e.e>=i.toExpPos);return e.isNeg()&&!e.isZero()?"-"+n:n};d.truncated=d.trunc=function(){return p(new this.constructor(this),this.e+1,1)};d.valueOf=d.toJSON=function(){var e=this,i=e.constructor,n=R(e,e.e<=i.toExpNeg||e.e>=i.toExpPos);return e.isNeg()?"-"+n:n};function M(e){var i,n,t,r=e.length-1,s="",o=e[0];if(r>0){for(s+=o,i=1;i<r;i++)t=e[i]+"",n=m-t.length,n&&(s+=H(n)),s+=t;o=e[i],t=o+"",n=m-t.length,n&&(s+=H(n))}else if(o===0)return"0";for(;o%10===0;)o/=10;return s+o}function P(e,i,n){if(e!==~~e||e<i||e>n)throw Error(V+e)}function K(e,i,n,t){var r,s,o,u;for(s=e[0];s>=10;s/=10)--i;return--i<0?(i+=m,r=0):(r=Math.ceil((i+1)/m),i%=m),s=b(10,m-i),u=e[r]%s|0,t==null?i<3?(i==0?u=u/100|0:i==1&&(u=u/10|0),o=n<4&&u==99999||n>3&&u==49999||u==5e4||u==0):o=(n<4&&u+1==s||n>3&&u+1==s/2)&&(e[r+1]/s/100|0)==b(10,i-2)-1||(u==s/2||u==0)&&(e[r+1]/s/100|0)==0:i<4?(i==0?u=u/1e3|0:i==1?u=u/100|0:i==2&&(u=u/10|0),o=(t||n<4)&&u==9999||!t&&n>3&&u==4999):o=((t||n<4)&&u+1==s||!t&&n>3&&u+1==s/2)&&(e[r+1]/s/1e3|0)==b(10,i-3)-1,o}function ie(e,i,n){for(var t,r=[0],s,o=0,u=e.length;o<u;){for(s=r.length;s--;)r[s]*=i;for(r[0]+=he.indexOf(e.charAt(o++)),t=0;t<r.length;t++)r[t]>n-1&&(r[t+1]===void 0&&(r[t+1]=0),r[t+1]+=r[t]/n|0,r[t]%=n)}return r.reverse()}function We(e,i){var n,t,r;if(i.isZero())return i;t=i.d.length,t<32?(n=Math.ceil(t/3),r=(1/ue(4,n)).toString()):(n=16,r="2.3283064365386962890625e-10"),e.precision+=n,i=G(e,1,i.times(r),new e(1));for(var s=n;s--;){var o=i.times(i);i=o.times(o).minus(o).times(8).plus(1)}return e.precision-=n,i}var k=function(){function e(t,r,s){var o,u=0,c=t.length;for(t=t.slice();c--;)o=t[c]*r+u,t[c]=o%s|0,u=o/s|0;return u&&t.unshift(u),t}function i(t,r,s,o){var u,c;if(s!=o)c=s>o?1:-1;else for(u=c=0;u<s;u++)if(t[u]!=r[u]){c=t[u]>r[u]?1:-1;break}return c}function n(t,r,s,o){for(var u=0;s--;)t[s]-=u,u=t[s]<r[s]?1:0,t[s]=u*o+t[s]-r[s];for(;!t[0]&&t.length>1;)t.shift()}return function(t,r,s,o,u,c){var f,l,a,h,g,N,v,L,C,A,E,_,Y,Z,fe,z,X,ce,F,x,y=t.constructor,le=t.s==r.s?1:-1,q=t.d,S=r.d;if(!q||!q[0]||!S||!S[0])return new y(!t.s||!r.s||(q?S&&q[0]==S[0]:!S)?NaN:q&&q[0]==0||!S?le*0:le/0);for(c?(g=1,l=t.e-r.e):(c=D,g=m,l=I(t.e/g)-I(r.e/g)),F=S.length,X=q.length,C=new y(le),A=C.d=[],a=0;S[a]==(q[a]||0);a++);if(S[a]>(q[a]||0)&&l--,s==null?(Z=s=y.precision,o=y.rounding):u?Z=s+(t.e-r.e)+1:Z=s,Z<0)A.push(1),N=!0;else{if(Z=Z/g+2|0,a=0,F==1){for(h=0,S=S[0],Z++;(a<X||h)&&Z--;a++)fe=h*c+(q[a]||0),A[a]=fe/S|0,h=fe%S|0;N=h||a<X}else{for(h=c/(S[0]+1)|0,h>1&&(S=e(S,h,c),q=e(q,h,c),F=S.length,X=q.length),z=F,E=q.slice(0,F),_=E.length;_<F;)E[_++]=0;x=S.slice(),x.unshift(0),ce=S[0],S[1]>=c/2&&++ce;do h=0,f=i(S,E,F,_),f<0?(Y=E[0],F!=_&&(Y=Y*c+(E[1]||0)),h=Y/ce|0,h>1?(h>=c&&(h=c-1),v=e(S,h,c),L=v.length,_=E.length,f=i(v,E,L,_),f==1&&(h--,n(v,F<L?x:S,L,c))):(h==0&&(f=h=1),v=S.slice()),L=v.length,L<_&&v.unshift(0),n(E,v,_,c),f==-1&&(_=E.length,f=i(S,E,F,_),f<1&&(h++,n(E,F<_?x:S,_,c))),_=E.length):f===0&&(h++,E=[0]),A[a++]=h,f&&E[0]?E[_++]=q[z]||0:(E=[q[z]],_=1);while((z++<X||E[0]!==void 0)&&Z--);N=E[0]!==void 0}A[0]||A.shift()}if(g==1)C.e=l,_e=N;else{for(a=1,h=A[0];h>=10;h/=10)a++;C.e=a+l*g-1,p(C,u?s+C.e+1:s,o,N)}return C}}();function p(e,i,n,t){var r,s,o,u,c,f,l,a,h,g=e.constructor;e:if(i!=null){if(a=e.d,!a)return e;for(r=1,u=a[0];u>=10;u/=10)r++;if(s=i-r,s<0)s+=m,o=i,l=a[h=0],c=l/b(10,r-o-1)%10|0;else if(h=Math.ceil((s+1)/m),u=a.length,h>=u)if(t){for(;u++<=h;)a.push(0);l=c=0,r=1,s%=m,o=s-m+1}else break e;else{for(l=u=a[h],r=1;u>=10;u/=10)r++;s%=m,o=s-m+r,c=o<0?0:l/b(10,r-o-1)%10|0}if(t=t||i<0||a[h+1]!==void 0||(o<0?l:l%b(10,r-o-1)),f=n<4?(c||t)&&(n==0||n==(e.s<0?3:2)):c>5||c==5&&(n==4||t||n==6&&(s>0?o>0?l/b(10,r-o):0:a[h-1])%10&1||n==(e.s<0?8:7)),i<1||!a[0])return a.length=0,f?(i-=e.e+1,a[0]=b(10,(m-i%m)%m),e.e=-i||0):a[0]=e.e=0,e;if(s==0?(a.length=h,u=1,h--):(a.length=h+1,u=b(10,m-s),a[h]=o>0?(l/b(10,r-o)%b(10,o)|0)*u:0),f)for(;;)if(h==0){for(s=1,o=a[0];o>=10;o/=10)s++;for(o=a[0]+=u,u=1;o>=10;o/=10)u++;s!=u&&(e.e++,a[0]==D&&(a[0]=1));break}else{if(a[h]+=u,a[h]!=D)break;a[h--]=0,u=1}for(s=a.length;a[--s]===0;)a.pop()}return w&&(e.e>g.maxE?(e.d=null,e.e=NaN):e.e<g.minE&&(e.e=0,e.d=[0])),e}function R(e,i,n){if(!e.isFinite())return De(e);var t,r=e.e,s=M(e.d),o=s.length;return i?(n&&(t=n-o)>0?s=s.charAt(0)+"."+s.slice(1)+H(t):o>1&&(s=s.charAt(0)+"."+s.slice(1)),s=s+(e.e<0?"e":"e+")+e.e):r<0?(s="0."+H(-r-1)+s,n&&(t=n-o)>0&&(s+=H(t))):r>=o?(s+=H(r+1-o),n&&(t=n-r-1)>0&&(s=s+"."+H(t))):((t=r+1)<o&&(s=s.slice(0,t)+"."+s.slice(t)),n&&(t=n-o)>0&&(r+1===o&&(s+="."),s+=H(t))),s}function oe(e,i){var n=e[0];for(i*=m;n>=10;n/=10)i++;return i}function re(e,i,n){if(i>je)throw w=!0,n&&(e.precision=n),Error(qe);return p(new e(ne),i,1,!0)}function O(e,i,n){if(i>pe)throw Error(qe);return p(new e(te),i,n,!0)}function Ae(e){var i=e.length-1,n=i*m+1;if(i=e[i],i){for(;i%10==0;i/=10)n--;for(i=e[0];i>=10;i/=10)n++}return n}function H(e){for(var i="";e--;)i+="0";return i}function Fe(e,i,n,t){var r,s=new e(1),o=Math.ceil(t/m+4);for(w=!1;;){if(n%2&&(s=s.times(i),be(s.d,o)&&(r=!0)),n=I(n/2),n===0){n=s.d.length-1,r&&s.d[n]===0&&++s.d[n];break}i=i.times(i),be(i.d,o)}return w=!0,s}function Ce(e){return e.d[e.d.length-1]&1}function Oe(e,i,n){for(var t,r=new e(i[0]),s=0;++s<i.length;)if(t=new e(i[s]),t.s)r[n](t)&&(r=t);else{r=t;break}return r}function ge(e,i){var n,t,r,s,o,u,c,f=0,l=0,a=0,h=e.constructor,g=h.rounding,N=h.precision;if(!e.d||!e.d[0]||e.e>17)return new h(e.d?e.d[0]?e.s<0?0:1/0:1:e.s?e.s<0?0:e:NaN);for(i==null?(w=!1,c=N):c=i,u=new h(.03125);e.e>-2;)e=e.times(u),a+=5;for(t=Math.log(b(2,a))/Math.LN10*2+5|0,c+=t,n=s=o=new h(1),h.precision=c;;){if(s=p(s.times(e),c,1),n=n.times(++l),u=o.plus(k(s,n,c,1)),M(u.d).slice(0,c)===M(o.d).slice(0,c)){for(r=a;r--;)o=p(o.times(o),c,1);if(i==null)if(f<3&&K(o.d,c-t,g,f))h.precision=c+=10,n=s=u=new h(1),l=0,f++;else return p(o,h.precision=N,g,w=!0);else return h.precision=N,o}o=u}}function $(e,i){var n,t,r,s,o,u,c,f,l,a,h,g=1,N=10,v=e,L=v.d,C=v.constructor,A=C.rounding,E=C.precision;if(v.s<0||!L||!L[0]||!v.e&&L[0]==1&&L.length==1)return new C(L&&!L[0]?-1/0:v.s!=1?NaN:L?0:v);if(i==null?(w=!1,l=E):l=i,C.precision=l+=N,n=M(L),t=n.charAt(0),Math.abs(s=v.e)<15e14){for(;t<7&&t!=1||t==1&&n.charAt(1)>3;)v=v.times(e),n=M(v.d),t=n.charAt(0),g++;s=v.e,t>1?(v=new C("0."+n),s++):v=new C(t+"."+n.slice(1))}else return f=re(C,l+2,E).times(s+""),v=$(new C(t+"."+n.slice(1)),l-N).plus(f),C.precision=E,i==null?p(v,E,A,w=!0):v;for(a=v,c=o=v=k(v.minus(1),v.plus(1),l,1),h=p(v.times(v),l,1),r=3;;){if(o=p(o.times(h),l,1),f=c.plus(k(o,new C(r),l,1)),M(f.d).slice(0,l)===M(c.d).slice(0,l))if(c=c.times(2),s!==0&&(c=c.plus(re(C,l+2,E).times(s+""))),c=k(c,new C(g),l,1),i==null)if(K(c.d,l-N,A,u))C.precision=l+=N,f=o=v=k(a.minus(1),a.plus(1),l,1),h=p(v.times(v),l,1),r=u=1;else return p(c,C.precision=E,A,w=!0);else return C.precision=E,c;c=f,r+=2}}function De(e){return String(e.s*e.s/0)}function me(e,i){var n,t,r;for((n=i.indexOf("."))>-1&&(i=i.replace(".","")),(t=i.search(/e/i))>0?(n<0&&(n=t),n+=+i.slice(t+1),i=i.substring(0,t)):n<0&&(n=i.length),t=0;i.charCodeAt(t)===48;t++);for(r=i.length;i.charCodeAt(r-1)===48;--r);if(i=i.slice(t,r),i){if(r-=t,e.e=n=n-t-1,e.d=[],t=(n+1)%m,n<0&&(t+=m),t<r){for(t&&e.d.push(+i.slice(0,t)),r-=m;t<r;)e.d.push(+i.slice(t,t+=m));i=i.slice(t),t=m-i.length}else t-=r;for(;t--;)i+="0";e.d.push(+i),w&&(e.e>e.constructor.maxE?(e.d=null,e.e=NaN):e.e<e.constructor.minE&&(e.e=0,e.d=[0]))}else e.e=0,e.d=[0];return e}function Ge(e,i){var n,t,r,s,o,u,c,f,l;if(i.indexOf("_")>-1){if(i=i.replace(/(\d)_(?=\d)/g,"$1"),Pe.test(i))return me(e,i)}else if(i==="Infinity"||i==="NaN")return+i||(e.s=NaN),e.e=NaN,e.d=null,e;if(He.test(i))n=16,i=i.toLowerCase();else if(Be.test(i))n=2;else if($e.test(i))n=8;else throw Error(V+i);for(s=i.search(/p/i),s>0?(c=+i.slice(s+1),i=i.substring(2,s)):i=i.slice(2),s=i.indexOf("."),o=s>=0,t=e.constructor,o&&(i=i.replace(".",""),u=i.length,s=u-s,r=Fe(t,new t(n),s,s*2)),f=ie(i,n,D),l=f.length-1,s=l;f[s]===0;--s)f.pop();return s<0?new t(e.s*0):(e.e=oe(f,l),e.d=f,w=!1,o&&(e=k(e,r,u*4)),c&&(e=e.times(Math.abs(c)<54?b(2,c):Q.pow(2,c))),w=!0,e)}function Xe(e,i){var n,t=i.d.length;if(t<3)return i.isZero()?i:G(e,2,i,i);n=1.4*Math.sqrt(t),n=n>16?16:n|0,i=i.times(1/ue(5,n)),i=G(e,2,i,i);for(var r,s=new e(5),o=new e(16),u=new e(20);n--;)r=i.times(i),i=i.times(s.plus(r.times(o.times(r).minus(u))));return i}function G(e,i,n,t,r){var s,o,u,c,f=1,l=e.precision,a=Math.ceil(l/m);for(w=!1,c=n.times(n),u=new e(t);;){if(o=k(u.times(c),new e(i++*i++),l,1),u=r?t.plus(o):t.minus(o),t=k(o.times(c),new e(i++*i++),l,1),o=u.plus(t),o.d[a]!==void 0){for(s=a;o.d[s]===u.d[s]&&s--;);if(s==-1)break}s=u,u=t,t=o,o=s,f++}return w=!0,o.d.length=a+1,o}function ue(e,i){for(var n=e;--i;)n*=e;return n}function Re(e,i){var n,t=i.s<0,r=O(e,e.precision,1),s=r.times(.5);if(i=i.abs(),i.lte(s))return U=t?4:1,i;if(n=i.divToInt(r),n.isZero())U=t?3:2;else{if(i=i.minus(n.times(r)),i.lte(s))return U=Ce(n)?t?2:3:t?4:1,i;U=Ce(n)?t?1:4:t?3:2}return i.minus(r).abs()}function we(e,i,n,t){var r,s,o,u,c,f,l,a,h,g=e.constructor,N=n!==void 0;if(N?(P(n,1,j),t===void 0?t=g.rounding:P(t,0,8)):(n=g.precision,t=g.rounding),!e.isFinite())l=De(e);else{for(l=R(e),o=l.indexOf("."),N?(r=2,i==16?n=n*4-3:i==8&&(n=n*3-2)):r=i,o>=0&&(l=l.replace(".",""),h=new g(1),h.e=l.length-o,h.d=ie(R(h),10,r),h.e=h.d.length),a=ie(l,10,r),s=c=a.length;a[--c]==0;)a.pop();if(!a[0])l=N?"0p+0":"0";else{if(o<0?s--:(e=new g(e),e.d=a,e.e=s,e=k(e,h,n,t,0,r),a=e.d,s=e.e,f=_e),o=a[n],u=r/2,f=f||a[n+1]!==void 0,f=t<4?(o!==void 0||f)&&(t===0||t===(e.s<0?3:2)):o>u||o===u&&(t===4||f||t===6&&a[n-1]&1||t===(e.s<0?8:7)),a.length=n,f)for(;++a[--n]>r-1;)a[n]=0,n||(++s,a.unshift(1));for(c=a.length;!a[c-1];--c);for(o=0,l="";o<c;o++)l+=he.charAt(a[o]);if(N){if(c>1)if(i==16||i==8){for(o=i==16?4:3,--c;c%o;c++)l+="0";for(a=ie(l,r,i),c=a.length;!a[c-1];--c);for(o=1,l="1.";o<c;o++)l+=he.charAt(a[o])}else l=l.charAt(0)+"."+l.slice(1);l=l+(s<0?"p":"p+")+s}else if(s<0){for(;++s;)l="0"+l;l="0."+l}else if(++s>c)for(s-=c;s--;)l+="0";else s<c&&(l=l.slice(0,s)+"."+l.slice(s))}l=(i==16?"0x":i==2?"0b":i==8?"0o":"")+l}return e.s<0?"-"+l:l}function be(e,i){if(e.length>i)return e.length=i,!0}function Je(e){return new this(e).abs()}function Ke(e){return new this(e).acos()}function Qe(e){return new this(e).acosh()}function Ye(e,i){return new this(e).plus(i)}function ze(e){return new this(e).asin()}function xe(e){return new this(e).asinh()}function ye(e){return new this(e).atan()}function ei(e){return new this(e).atanh()}function ii(e,i){e=new this(e),i=new this(i);var n,t=this.precision,r=this.rounding,s=t+4;return!e.s||!i.s?n=new this(NaN):!e.d&&!i.d?(n=O(this,s,1).times(i.s>0?.25:.75),n.s=e.s):!i.d||e.isZero()?(n=i.s<0?O(this,t,r):new this(0),n.s=e.s):!e.d||i.isZero()?(n=O(this,s,1).times(.5),n.s=e.s):i.s<0?(this.precision=s,this.rounding=1,n=this.atan(k(e,i,s,1)),i=O(this,s,1),this.precision=t,this.rounding=r,n=e.s<0?n.minus(i):n.plus(i)):n=this.atan(k(e,i,s,1)),n}function ni(e){return new this(e).cbrt()}function ti(e){return p(e=new this(e),e.e+1,2)}function ri(e,i,n){return new this(e).clamp(i,n)}function si(e){if(!e||typeof e!="object")throw Error(se+"Object expected");var i,n,t,r=e.defaults===!0,s=["precision",1,j,"rounding",0,8,"toExpNeg",-W,0,"toExpPos",0,W,"maxE",0,W,"minE",-W,0,"modulo",0,9];for(i=0;i<s.length;i+=3)if(n=s[i],r&&(this[n]=de[n]),(t=e[n])!==void 0)if(I(t)===t&&t>=s[i+1]&&t<=s[i+2])this[n]=t;else throw Error(V+n+": "+t);if(n="crypto",r&&(this[n]=de[n]),(t=e[n])!==void 0)if(t===!0||t===!1||t===0||t===1)if(t)if(typeof crypto<"u"&&crypto&&(crypto.getRandomValues||crypto.randomBytes))this[n]=!0;else throw Error(Ie);else this[n]=!1;else throw Error(V+n+": "+t);return this}function oi(e){return new this(e).cos()}function ui(e){return new this(e).cosh()}function Te(e){var i,n,t;function r(s){var o,u,c,f=this;if(!(f instanceof r))return new r(s);if(f.constructor=r,Me(s)){f.s=s.s,w?!s.d||s.e>r.maxE?(f.e=NaN,f.d=null):s.e<r.minE?(f.e=0,f.d=[0]):(f.e=s.e,f.d=s.d.slice()):(f.e=s.e,f.d=s.d?s.d.slice():s.d);return}if(c=typeof s,c==="number"){if(s===0){f.s=1/s<0?-1:1,f.e=0,f.d=[0];return}if(s<0?(s=-s,f.s=-1):f.s=1,s===~~s&&s<1e7){for(o=0,u=s;u>=10;u/=10)o++;w?o>r.maxE?(f.e=NaN,f.d=null):o<r.minE?(f.e=0,f.d=[0]):(f.e=o,f.d=[s]):(f.e=o,f.d=[s]);return}else if(s*0!==0){s||(f.s=NaN),f.e=NaN,f.d=null;return}return me(f,s.toString())}else if(c!=="string")throw Error(V+s);return(u=s.charCodeAt(0))===45?(s=s.slice(1),f.s=-1):(u===43&&(s=s.slice(1)),f.s=1),Pe.test(s)?me(f,s):Ge(f,s)}if(r.prototype=d,r.ROUND_UP=0,r.ROUND_DOWN=1,r.ROUND_CEIL=2,r.ROUND_FLOOR=3,r.ROUND_HALF_UP=4,r.ROUND_HALF_DOWN=5,r.ROUND_HALF_EVEN=6,r.ROUND_HALF_CEIL=7,r.ROUND_HALF_FLOOR=8,r.EUCLID=9,r.config=r.set=si,r.clone=Te,r.isDecimal=Me,r.abs=Je,r.acos=Ke,r.acosh=Qe,r.add=Ye,r.asin=ze,r.asinh=xe,r.atan=ye,r.atanh=ei,r.atan2=ii,r.cbrt=ni,r.ceil=ti,r.clamp=ri,r.cos=oi,r.cosh=ui,r.div=fi,r.exp=ci,r.floor=li,r.hypot=ai,r.ln=hi,r.log=di,r.log10=gi,r.log2=pi,r.max=mi,r.min=wi,r.mod=vi,r.mul=Ni,r.pow=Ei,r.random=ki,r.round=Si,r.sign=Ci,r.sin=bi,r.sinh=Mi,r.sqrt=_i,r.sub=qi,r.sum=Ii,r.tan=Li,r.tanh=Pi,r.trunc=Ai,e===void 0&&(e={}),e&&e.defaults!==!0)for(t=["precision","rounding","toExpNeg","toExpPos","maxE","minE","modulo","crypto"],i=0;i<t.length;)e.hasOwnProperty(n=t[i++])||(e[n]=this[n]);return r.config(e),r}function fi(e,i){return new this(e).div(i)}function ci(e){return new this(e).exp()}function li(e){return p(e=new this(e),e.e+1,3)}function ai(){var e,i,n=new this(0);for(w=!1,e=0;e<arguments.length;)if(i=new this(arguments[e++]),i.d)n.d&&(n=n.plus(i.times(i)));else{if(i.s)return w=!0,new this(1/0);n=i}return w=!0,n.sqrt()}function Me(e){return e instanceof Q||e&&e.toStringTag===Le||!1}function hi(e){return new this(e).ln()}function di(e,i){return new this(e).log(i)}function pi(e){return new this(e).log(2)}function gi(e){return new this(e).log(10)}function mi(){return Oe(this,arguments,"lt")}function wi(){return Oe(this,arguments,"gt")}function vi(e,i){return new this(e).mod(i)}function Ni(e,i){return new this(e).mul(i)}function Ei(e,i){return new this(e).pow(i)}function ki(e){var i,n,t,r,s=0,o=new this(1),u=[];if(e===void 0?e=this.precision:P(e,1,j),t=Math.ceil(e/m),this.crypto)if(crypto.getRandomValues)for(i=crypto.getRandomValues(new Uint32Array(t));s<t;)r=i[s],r>=429e7?i[s]=crypto.getRandomValues(new Uint32Array(1))[0]:u[s++]=r%1e7;else if(crypto.randomBytes){for(i=crypto.randomBytes(t*=4);s<t;)r=i[s]+(i[s+1]<<8)+(i[s+2]<<16)+((i[s+3]&127)<<24),r>=214e7?crypto.randomBytes(4).copy(i,s):(u.push(r%1e7),s+=4);s=t/4}else throw Error(Ie);else for(;s<t;)u[s++]=Math.random()*1e7|0;for(t=u[--s],e%=m,t&&e&&(r=b(10,m-e),u[s]=(t/r|0)*r);u[s]===0;s--)u.pop();if(s<0)n=0,u=[0];else{for(n=-1;u[0]===0;n-=m)u.shift();for(t=1,r=u[0];r>=10;r/=10)t++;t<m&&(n-=m-t)}return o.e=n,o.d=u,o}function Si(e){return p(e=new this(e),e.e+1,this.rounding)}function Ci(e){return e=new this(e),e.d?e.d[0]?e.s:0*e.s:e.s||NaN}function bi(e){return new this(e).sin()}function Mi(e){return new this(e).sinh()}function _i(e){return new this(e).sqrt()}function qi(e,i){return new this(e).sub(i)}function Ii(){var e=0,i=arguments,n=new this(i[e]);for(w=!1;n.s&&++e<i.length;)n=n.plus(i[e]);return w=!0,p(n,this.precision,this.rounding)}function Li(e){return new this(e).tan()}function Pi(e){return new this(e).tanh()}function Ai(e){return p(e=new this(e),e.e+1,1)}d[Symbol.for("nodejs.util.inspect.custom")]=d.toString;d[Symbol.toStringTag]="Decimal";var Q=d.constructor=Te(de);ne=new Q(ne);te=new Q(te);var T=Q;var Wi=(()=>{let i=class i{add(t,r){let s=new T(t),o=new T(r);return s.add(o).toNumber()}subtract(t,r){let s=new T(t),o=new T(r);return s.sub(o).toNumber()}multiply(t,r){let s=new T(t),o=new T(r);return s.mul(o).toNumber()}divide(t,r){let s=new T(t),o=new T(r);return s.div(o).toNumber()}decimal(t){return new T(t).toNumber()}};i.\u0275fac=function(r){return new(r||i)},i.\u0275prov=ee({token:i,factory:i.\u0275fac,providedIn:"root"});let e=i;return e})();export{Se as a,Ze as b,Hi as c,Wi as d};
