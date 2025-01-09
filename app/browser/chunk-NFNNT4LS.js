import{a as Me}from"./chunk-FDNJO33O.js";import{c as N}from"./chunk-RVVNKWB5.js";import"./chunk-2SWJI5IR.js";import{a as Q,b as Pe,c as ke}from"./chunk-OOYENC3R.js";import{a as Be}from"./chunk-6SPTK7QA.js";import{a as Ee,b as He,c as Ve,d as O}from"./chunk-UN4TYE34.js";import{a as Te}from"./chunk-GLAC23CS.js";import"./chunk-OUZXLSMN.js";import"./chunk-5Y4A7MAH.js";import{a as xe,b as Ce,d as Ie}from"./chunk-NIY2QWE7.js";import{a as Se,b as be}from"./chunk-2UFRC7H2.js";import{b as ae}from"./chunk-565XE5Q6.js";import{a as We}from"./chunk-HUT5LNQK.js";import{a as we}from"./chunk-6M5CHABF.js";import{a as de,b as _e,d as ge,i as fe,j as ye,o as he}from"./chunk-YXGZ3Y4J.js";import{a as pe,b as se}from"./chunk-KWHJ4U2D.js";import"./chunk-PTV2L6W6.js";import{b as ve}from"./chunk-I3ZYYSXS.js";import{i as me,j as ue}from"./chunk-6CJYKBUA.js";import"./chunk-KTNSRC6L.js";import"./chunk-VVJEHS3M.js";import{a as ne,b as oe}from"./chunk-2WM322QF.js";import"./chunk-THDET7PA.js";import{A as w,Aa as E,Ab as W,B as L,Ba as H,C as T,Da as s,Ea as h,Fa as b,Gb as J,H as m,Ha as V,I as u,Ia as P,Ja as k,Lc as ce,Ma as A,Na as F,Oa as K,P as R,Pb as X,Sb as Z,U as z,V as c,Va as v,Wa as S,Yb as ee,ac as te,da as g,db as $,fa as d,fb as Y,g as qe,gc as ie,i as j,ib as G,jb as D,ka as q,la as r,ma as l,na as B,ra as C,rc as re,sa as f,sc as le,ta as p,x as I,za as M}from"./chunk-FYHOXPUP.js";var De=qe(We());var Qe=["barcodeInput"],Ue=["invoiceTable"],je=["editQty"],Re=["editPrice"],ze=["payment_input"],Ae=n=>({"ng-invalid ng-dirty":n}),Ke=()=>({standalone:!0}),Fe=n=>({invalid:n}),$e=(n,a)=>({"text-red-500":n,"text-orange-500":a}),Ye=n=>({"text-red-500":n});function Ge(n,a){if(n&1&&(r(0,"h2",20),s(1),v(2,"currency"),l()),n&2){let t=p();c(),b(" USD: ",S(2,1,t.invoiceTotal.subtotal_dollar)," ")}}function Je(n,a){if(n&1&&(r(0,"h2",21),s(1),v(2,"dollar"),l()),n&2){let t=p();c(),b(" Total: ",S(2,1,t.invoiceTotal.subtotal_dollar)," ")}}function Xe(n,a){n&1&&(r(0,"small",29),s(1,"Supplier is required"),l())}function Ze(n,a){if(n&1){let t=C();r(0,"div",23)(1,"label",30),s(2,"Payment"),l(),r(3,"p-inputNumber",31,2),k("ngModelChange",function(e){m(t);let o=p(2);return P(o.payment_amount,e)||(o.payment_amount=e),u(e)}),f("onFocus",function(e){m(t);let o=p(2);return u(o.select(e.target))}),l()()}if(n&2){let t=p(2);c(3),V("ngModel",t.payment_amount),d("ngModelOptions",A(5,Ke))("buttonLayout","horizontal")("step",1)("min",0)}}function et(n,a){if(n&1&&(r(0,"div",28)(1,"table",32)(2,"tr")(3,"th",33),s(4,"Old Balance:"),l(),r(5,"th")(6,"app-text-with-loading",34)(7,"span"),s(8),v(9,"currency"),l()()()(),r(10,"tr")(11,"th",33),s(12,"Current Invoice:"),l(),r(13,"th"),s(14),v(15,"currency"),l()(),r(16,"tr")(17,"th",33),s(18,"Payment:"),l(),r(19,"th"),s(20),v(21,"currency"),l()(),r(22,"tr")(23,"td",35),B(24,"p-divider",36),l()(),r(25,"tr")(26,"th",33),s(27,"New Balance:"),l(),r(28,"th")(29,"app-text-with-loading",37)(30,"span"),s(31),v(32,"currency"),l()()()()()()),n&2){let t=p(2);c(6),d("isLoading",t.supplier_balance_loading())("loadingBar",!0),c(2),h(S(9,8,t.supplier_balance.balance)),c(6),b(" ",S(15,10,t.invoiceTotal.subtotal_dollar)," "),c(6),b(" ",S(21,12,t.payment_amount())," "),c(9),d("isLoading",t.supplier_balance_loading())("loadingBar",!0),c(2),h(S(32,14,t.calculateNewBalance(t.invoiceTotal.subtotal_dollar,t.supplier_balance.balance,t.payment_amount())))}}function tt(n,a){if(n&1){let t=C();r(0,"div",13)(1,"div",22)(2,"div",23)(3,"label",24),s(4,"Supplier"),r(5,"span",25),s(6," *"),l()(),r(7,"p-dropdown",26),k("ngModelChange",function(e){m(t);let o=p();return P(o.selected_supplier_id,e)||(o.selected_supplier_id=e),u(e)}),f("onShow",function(){m(t);let e=p();return u(e.dropDownVisible=!0)})("onHide",function(){m(t);let e=p();return u(e.dropDownVisible=!1)})("ngModelChange",function(){m(t);let e=p();return u(e.getSupplierBalance())}),l(),g(8,Xe,2,0,"small",27),l()(),r(9,"div",22),g(10,Ze,5,6,"div",23),l(),g(11,et,33,16,"div",28),l()}if(n&2){let t=p();c(7),d("loading",t.suppliersLoading()),V("ngModel",t.selected_supplier_id),d("options",t.suppliers)("filter",!0)("showClear",!0)("autoOptionFocus",!1)("ngClass",F(10,Ae,t.submited()&&!t.selected_supplier_id())),c(),d("ngIf",t.submited()&&!t.selected_supplier_id()),c(2),q(t.selected_supplier_id()?10:-1),c(),q(t.selected_supplier_id()?11:-1)}}function it(n,a){n&1&&(r(0,"tr")(1,"th",38),s(2,"#"),l(),r(3,"th",39),s(4,"Barcode"),l(),r(5,"th",40),s(6,"Description"),l(),r(7,"th",38),s(8,"Unit"),l(),r(9,"th",41),s(10,"Price"),l(),r(11,"th",38),s(12,"Qty"),l(),r(13,"th",41),s(14,"Total"),l(),r(15,"th",38),s(16,"Del?"),l()())}function nt(n,a){if(n&1){let t=C();r(0,"p-inputNumber",49,3),k("ngModelChange",function(e){m(t);let o=p().$implicit;return P(o.unit_price,e)||(o.unit_price=e),u(e)}),f("ngModelChange",function(){m(t);let e=p().$implicit,o=p();return u(o.setPrice(e))})("onFocus",function(e){m(t);let o=p(2);return u(o.select(e.target))}),l()}if(n&2){let t=p().$implicit;V("ngModel",t.unit_price),d("maxFractionDigits",2)("min",0)}}function ot(n,a){n&1&&B(0,"i",52)}function rt(n,a){if(n&1&&(r(0,"span",50),s(1),v(2,"currency"),r(3,"span"),g(4,ot,1,0,"i",51),l()()),n&2){let t=p().$implicit,i=p();d("ngClass",K(5,$e,!t.unit_price,i.getPriceWarining(t))),c(),h(S(2,3,t.unit_price)),c(3),d("ngIf",i.getPriceWarining(t))}}function lt(n,a){if(n&1){let t=C();r(0,"p-inputNumber",53,4),k("ngModelChange",function(e){m(t);let o=p().$implicit;return P(o.quantity,e)||(o.quantity=e),u(e)}),f("onFocus",function(e){m(t);let o=p(2);return u(o.select(e.target))})("ngModelChange",function(){m(t);let e=p().$implicit,o=p();return u(o.setQty(e))}),l()}if(n&2){let t=p().$implicit;V("ngModel",t.quantity)}}function at(n,a){if(n&1&&(r(0,"span",50),s(1),l()),n&2){let t=p().$implicit;d("ngClass",F(2,Ye,!t.quantity)),c(),h(t.quantity)}}function pt(n,a){if(n&1&&(r(0,"td"),s(1),l()),n&2){let t=p().$implicit;c(),b(" ",(t.currency=="lira",t.unit_price*t.quantity)," ")}}function st(n,a){if(n&1&&(r(0,"td"),s(1),v(2,"currency"),l()),n&2){let t=p().$implicit;c(),b(" ",t.currency=="lira"?t.unit_price*t.quantity:S(2,1,t.unit_price*t.quantity)," ")}}function ct(n,a){if(n&1){let t=C();r(0,"tr")(1,"td"),s(2),l(),r(3,"td"),s(4),l(),r(5,"td"),s(6),l(),r(7,"td"),s(8),l(),r(9,"td",42)(10,"p-cellEditor"),g(11,nt,2,3,"ng-template",43)(12,rt,5,8,"ng-template",44),l()(),r(13,"td",45)(14,"p-cellEditor"),g(15,lt,2,1,"ng-template",43)(16,at,2,4,"ng-template",44),l()(),g(17,pt,2,1,"td",46)(18,st,3,3,"td",46),r(19,"td",47),f("click",function(){let e=m(t).rowIndex,o=p();return u(o.removeRow(e))}),B(20,"i",48),l()()}if(n&2){let t=a.$implicit,i=a.rowIndex,e=p();c(2),h(i+1),c(2),h(t.barcode||"---"),c(2),h(t.product_name),c(2),h(t.unit_abbreviation),c(),d("pEditableColumn",t.unit_price)("ngClass",F(10,Fe,!t.unit_price)),c(4),d("pEditableColumn",t.quantity)("ngClass",F(12,Fe,!t.quantity)),c(4),d("ngIf",e.view_currency=="lira"),c(),d("ngIf",e.view_currency=="dollar")}}function mt(n,a){if(n&1&&(r(0,"h4",55),s(1),l()),n&2){let t=p(2);c(),b(" Total units: ",t.invoiceTotal.total_qty," ")}}function ut(n,a){if(n&1&&g(0,mt,2,1,"h4",54),n&2){let t=p();d("ngIf",t.invoiceTotal.total_qty)}}function dt(n,a){n&1&&(r(0,"tr",56)(1,"td",57),s(2,"No data yet!"),l()())}function _t(n,a){if(n&1){let t=C();r(0,"p-autoComplete",58,5),k("ngModelChange",function(e){m(t);let o=p();return P(o.search_product,e)||(o.search_product=e),u(e)}),f("completeMethod",function(e){m(t);let o=p();return u(o.searchItem(e))})("onKeyUp",function(e){m(t);let o=p();return u(o.submitInvoiceInput(e))}),l(),r(2,"p-button",59),f("onClick",function(){m(t);let e=p();return u(e.dialog_products_visible=!0)}),l()}if(n&2){let t=p();V("ngModel",t.search_product),d("suggestions",t.searchedItems)("delay",150)}}function gt(n,a){if(n&1){let t=C();r(0,"p-button",60),f("onClick",function(){m(t);let e=p();return u(e.clearInvoice())}),l(),r(1,"p-button",61),f("onClick",function(){m(t);let e=p();return u(e.checkout())}),l()}if(n&2){let t=p();d("disabled",t.invoice().length==0),c(),d("loading",t.loading())("disabled",t.invoice().length==0)}}var Oe=(()=>{let a=class a{constructor(){this.suppliersService=w(Be),this.stockService=w(Te),this.supplyService=w(ke),this.notificationsService=w(Z),this.confirmationService=w(J),this.localStorageService=w(Me),this.dropDownVisible=!1,this.vh=this.localStorageService.getSupplyPageViewHeight(),this.invoiceTotal=new Q,this.search_product=null,this.searchedItems=[],this.suppliers=[],this.view_currency="dollar",this.dialog_products_visible=!1,this.invoice=this.supplyService.invoice,this.submited=this.supplyService.signal_submited,this.products=this.stockService.products,this.loading=this.supplyService.signal_submit_loading,this.stockTableLoading=this.stockService.tableLoading,this.suppliersLoading=this.suppliersService.suppliersLoading,this.subscriptions=new j,this.priceTypes=Object.keys(Pe),this.today=(0,De.default)().format("YYYY-MM-DD"),this.payment_amount=this.supplyService.payment_amount,this.selected_supplier_id=this.supplyService.selected_customer,this.supplier_balance_loading=this.suppliersService.signal_balanceLoading,this.supplier_balance={id:0,balance:"0"}}onKeyDown(i){if(this.dropDownVisible||this.dialog_products_visible)return;let e=this.editPrice||this.editQty||this.payment_input;(!e||!e.focused)&&this.focusBarcodeInput()}focusBarcodeInput(){this.barcodeInput.nativeElement.children[0].children[0].focus()}ngOnInit(){this.messages=[{severity:"info",detail:"No Invoice Yet!"}],this.subscriptions.add(this.suppliersService.suppliers$.subscribe(i=>{this.suppliers=i})),this.calculateTotal(),this.subscriptions.add(this.supplyService.reset$.subscribe(i=>{i&&(this.init(),this.supplyService.reset$.next(!1))})),this.subscriptions.add(this.supplyService.barcodeResponse.subscribe(i=>{i&&(this.addProduct(i),this.supplyService.barcodeResponse.next(null))})),this.subscriptions.add(this.suppliersService.supplierTotalDebts$.subscribe(i=>{i.id==this.selected_supplier_id()&&(this.supplier_balance=i)}))}ngOnDestroy(){this.subscriptions.unsubscribe()}setPrice(i){this.calculateTotal()}setQty(i){this.calculateTotal()}select(i){i.select()}init(){this.supplyService.selected_customer.set(null),this.supplyService.payment_amount.set(0),this.supplyService.invoice.set([]),this.submited.set(!1),this.calculateTotal()}clearInvoice(){this.confirmationService.confirm({key:"home",message:"Are you sure that you want to clear invoice?",header:"Warning",icon:"pi pi-exclamation-triangle",acceptButtonStyleClass:"p-button-danger",rejectButtonStyleClass:"p-button-secondary",defaultFocus:"reject",accept:()=>{this.init()}})}searchItem(i){let e=this.products(),o=[],_=i.query;for(let y=0;y<e.length;y++){let x=e[y];x.product_name.toLowerCase().indexOf(_.toLowerCase())>-1&&o.push(x)}this.searchedItems=o}addProduct(i){let e=this.supplyService.factor(),o=structuredClone(this.invoice()),_=o.find(y=>y.product_id===i.product_id);_?_.quantity+=e:o.push({product_id:i.product_id,barcode:i.barcode,product_name:i.product_name,unit_cost:i.unit_cost_usd,unit_price:i.unit_cost_usd,quantity:e}),this.invoice.set(o),this.supplyService.factor.set(1),this.calculateTotal()}submitInvoiceInput(i){i.key==="Enter"&&this.search_product&&(typeof this.search_product=="string"?this.submitBarcode(this.search_product):this.supplyService.barcodeResponse.next(this.search_product),this.search_product=null)}submitBarcode(i){if(i){let e=-1,o=["*","+"];for(let x=0;x<o.length;x++)if(i.indexOf(o[x])!==-1){e=i.indexOf(o[x]);break}let _=i.substring(0,e)||1,y=parseInt(i.substring(e+1,i.length));e!=-1&&e!=0?(this.supplyService.factor.set(parseInt(_)),this.supplyService.submitBarcode(y)):this.supplyService.submitBarcode(i)}}removeRow(i){this.invoice().splice(i,1),this.calculateTotal(),this.validateItems()}assignSelectedProducts(i){this.dialog_products_visible=!1,i.forEach(e=>{this.addProduct(e)})}calculateTotal(){let i=new Q,e=this.invoice();return e.length>0&&(e.forEach(o=>{i.total_qty+=o.quantity,i.cost_dollar+=o.unit_cost*o.quantity,i.subtotal_dollar+=o.unit_price*o.quantity}),i.total_dollar=i.subtotal_dollar-i.discount_dollar),this.invoiceTotal=i,i}parseFloat(i){return parseFloat(i)}validateItems(){return!!this.invoice().find(e=>!e.unit_price||!e.quantity)}getPriceWarining(i){if(!i.unit_price)return!1;let e=i.unit_cost||0,o=i.unit_price;return typeof e=="string"&&(e=parseFloat(e)),typeof o=="string"&&(o=parseFloat(o)),o<e}checkout(){let i=this.validateItems();!i&&this.selected_supplier_id()?this.confirmationService.confirm({key:"home",message:'Are you sure that you want to submit invoice"?',header:"Warning",icon:"pi pi-exclamation-triangle",acceptButtonStyleClass:"p-button-success",rejectButtonStyleClass:"p-button-secondary",defaultFocus:"reject",accept:()=>{this.supplyService.checkout({partner_id_fk:this.selected_supplier_id(),exchange_rate:this.stockService.exchangeRate().rate_value,total_cost:this.invoiceTotal.subtotal_dollar,items:this.invoice()},this.payment_amount())}}):(this.submited.set(!0),i&&this.notificationsService.showError("Please enter price for all items","home"))}getSupplierBalance(){this.selected_supplier_id()?this.suppliersService.getAccountTotalBalance(this.selected_supplier_id()):this.supplier_balance={id:0,balance:"0"}}calculateNewBalance(i,e=0,o=0){return e=parseFloat(e),e+i-o}};a.\u0275fac=function(e){return new(e||a)},a.\u0275cmp=L({type:a,selectors:[["app-supply-home"]],viewQuery:function(e,o){if(e&1&&(M(Qe,5,R),M(Ue,5),M(je,5),M(Re,5),M(ze,5)),e&2){let _;E(_=H())&&(o.barcodeInput=_.first),E(_=H())&&(o.invoiceTable=_.first),E(_=H())&&(o.editQty=_.first),E(_=H())&&(o.editPrice=_.first),E(_=H())&&(o.payment_input=_.first)}},hostBindings:function(e,o){e&1&&f("keydown",function(y){return o.onKeyDown(y)},!1,z)},decls:21,vars:4,consts:[["desktopTable",""],["invoiceTable",""],["payment_input",""],["editPrice",""],["editQty",""],["barcodeInput",""],[1,"grid","m-1"],[1,"col-12"],["styleClass","mb-3 p-2"],["pTemplate","left"],["pTemplate","right"],["pTemplate","body"],["styleClass","mt-2"],[1,"grid"],["dataKey","product_id","styleClass","p-datatable-sm ","editMode","cell",3,"value"],["pTemplate","header"],["pTemplate","summary"],["pTemplate","emptymessage"],["styleClass","mt-2 p-2"],["price","cost",3,"onHide","onSubmit","visible","products","tableLoading"],[1,"text-green-600","m-2"],[1,"text-primary","m-2"],[1,"col-2"],[1,"flex","flex-column","gap-2"],["for","supplier"],[1,"text-red-500"],["styleClass","p-inputtext-sm","id","supplier","appendTo","body","optionLabel","name","optionValue","account_id","placeholder","Select Supplier","filterBy","name",3,"ngModelChange","onShow","onHide","loading","ngModel","options","filter","showClear","autoOptionFocus","ngClass"],["class","p-error",4,"ngIf"],[1,"col-8","flex","justify-content-end"],[1,"p-error"],["for","currency"],["inputId","currency-us","mode","currency","currency","USD","locale","en-US","styleClass","w-full",1,"p-inputtext-sm",3,"ngModelChange","onFocus","ngModel","ngModelOptions","buttonLayout","step","min"],[1,"text-right"],[1,"text-green-500"],["loaderClass","flex-grow-1 flex-shrink-1",2,"width","50%",3,"isLoading","loadingBar"],["colspan","2"],["styleClass","m-0"],["loaderClass","flex-grow-1 flex-shrink-1",2,"width","63%",3,"isLoading","loadingBar"],["width","5%"],["width","20%"],["width","40%"],["width","15%"],["pEditableColumnField","unit_price",3,"pEditableColumn","ngClass"],["pTemplate","input"],["pTemplate","output"],["pEditableColumnField","quantity",3,"pEditableColumn","ngClass"],[4,"ngIf"],[1,"danger-hover",3,"click"],[1,"pi","pi-trash"],["styleClass","input-align-center","step","0",1,"p-inputtext-sm","priceEditable",3,"ngModelChange","onFocus","ngModel","maxFractionDigits","min"],[3,"ngClass"],["class","pi pi-exclamation-triangle ml-2",4,"ngIf"],[1,"pi","pi-exclamation-triangle","ml-2"],["min","1","step","0",1,"p-inputtext-sm","editable",3,"ngModelChange","onFocus","ngModel"],["class","text-center m-0",4,"ngIf"],[1,"text-center","m-0"],[1,"surface-300"],["colspan","9"],["field","product_name","name","barcodeInput","placeholder","scan or search ...","spellcheck","false",1,"p-inputtext-sm",3,"ngModelChange","completeMethod","onKeyUp","ngModel","suggestions","delay"],["styleClass","mx-2","label","Multi Select","severity","warning","size","small","icon","pi pi-list",3,"onClick"],["label","Clear","icon","pi pi-times","severity","danger","size","small","styleClass","mx-2",3,"onClick","disabled"],["label","Checkout","icon","pi pi-cart-plus","severity","success","size","small",3,"onClick","loading","disabled"]],template:function(e,o){if(e&1){let _=C();r(0,"div",6)(1,"div",7)(2,"p-toolbar",8),g(3,Ge,3,3,"ng-template",9)(4,Je,3,3,"ng-template",10),l(),r(5,"p-card"),g(6,tt,12,12,"ng-template",11),l(),r(7,"p-card",12,0)(9,"div",13)(10,"div",7)(11,"p-table",14,1),g(13,it,17,0,"ng-template",15)(14,ct,21,14,"ng-template",11)(15,ut,1,1,"ng-template",16)(16,dt,3,0,"ng-template",17),l(),r(17,"p-toolbar",18),g(18,_t,3,3,"ng-template",9)(19,gt,2,3,"ng-template",10),l()()()()()(),r(20,"products-dialog",19),f("onHide",function(){return m(_),u(o.dialog_products_visible=!1)})("onSubmit",function(x){return m(_),u(o.assignSelectedProducts(x))}),l()}e&2&&(c(11),d("value",o.invoice()),c(9),d("visible",o.dialog_products_visible)("products",o.products)("tableLoading",o.stockTableLoading()))},dependencies:[$,Y,O,ne,X,xe,re,Ee,pe,de,ge,fe,ye,N,me,ee,te,G,Ve],styles:["[_nghost-%COMP%]  .p-fieldset .p-fieldset-content{padding:.5rem}.editable[_ngcontent-%COMP%]{width:40px;height:28px}.priceEditable[_ngcontent-%COMP%]{width:60px;height:28px;text-align:center}[_nghost-%COMP%]  .p-inputnumber-input{width:100%}td[_ngcontent-%COMP%]:has(span.p-inputnumber.p-component){padding:0}td[_ngcontent-%COMP%]:has(.no-padding){padding:0}.input-align-center[_ngcontent-%COMP%], [_nghost-%COMP%]   .editable[_ngcontent-%COMP%]     span.p-inputnumber.p-component .p-inputnumber-input{text-align:center}input[_ngcontent-%COMP%]::-webkit-outer-spin-button, input[_ngcontent-%COMP%]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}input[type=number][_ngcontent-%COMP%]{appearance:textfield;-moz-appearance:textfield}[_nghost-%COMP%]  .small-button{font-size:.5rem!important;padding:.2rem .4rem!important;width:2rem!important}[_nghost-%COMP%]  .small-input>span>input{padding:.3rem!important;width:2rem!important;text-align:center}[_nghost-%COMP%]  .invoice-body>div>div{padding:0!important}[_nghost-%COMP%]  .p-dataview-emptymessage{display:none}[_nghost-%COMP%]  .p-card-content{padding:0!important}.invalid[_ngcontent-%COMP%]{border-color:var(--red-500)!important}.category-cards[_ngcontent-%COMP%]{border-radius:6px;color:#343a40;text-align:center;padding:1rem;box-shadow:0 2px 1px -1px #0003,0 1px 1px #00000024,0 1px 3px #0000001f}.selected[_ngcontent-%COMP%]{background-color:#343a40;color:#fff}"]});let n=a;return n})();var ft=[{path:"",component:Oe}],Ne=(()=>{let a=class a{};a.\u0275fac=function(e){return new(e||a)},a.\u0275mod=T({type:a}),a.\u0275inj=I({imports:[W.forChild(ft),W]});let n=a;return n})();var Le=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=T({type:n});static \u0275inj=I({imports:[D,ce,be,we,Se]})}return n})();var Ei=(()=>{let a=class a{};a.\u0275fac=function(e){return new(e||a)},a.\u0275mod=T({type:a}),a.\u0275inj=I({imports:[D,Ne,O,oe,Ce,ae,le,ve,He,se,_e,he,N,ue,Ie,Le,ie]});let n=a;return n})();export{Ei as SupplyModule};
