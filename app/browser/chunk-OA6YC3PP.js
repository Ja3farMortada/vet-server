import{a as pe}from"./chunk-6SPTK7QA.js";import{a as ee}from"./chunk-7OIYUPV4.js";import{a as ae,b as se}from"./chunk-YXGZ3Y4J.js";import{c as te,d as ie,i as ne,j as oe}from"./chunk-6CJYKBUA.js";import{a as le,b as re}from"./chunk-KTNSRC6L.js";import{A as g,Aa as x,B as k,Ba as D,Bb as Y,Da as m,G as W,Gb as A,H as d,Ha as f,I as _,Ia as b,Ja as C,La as B,M as E,Ma as T,Na as I,Pb as O,Sb as $,V as u,Yb as z,aa as j,ac as L,da as h,db as N,ec as U,fa as r,fb as R,gc as G,hc as J,i as V,ia as q,jb as H,l as M,la as s,lb as Q,ma as l,ra as v,rc as K,sa as y,sc as X,ta as p,uc as Z,w as F,z as S,za as w}from"./chunk-FYHOXPUP.js";var me=(()=>{let a=class a{constructor(i,e,o){this.http=i,this.api=e,this.notificationService=o,this.signal_loading=j(!1),this.visible$=new M(!1),this.status_action$=new M({})}deletePayment(i){this.signal_loading.set(!0),this.http.delete(`${this.api.host}/payment/${i}`).subscribe({next:e=>{this.notificationService.showSuccess("Payment deleted successfully","home")},error:e=>{this.signal_loading.set(!1)},complete:()=>{this.signal_loading.set(!1),this.visible$.next(!1),this.status_action$.next({action:"DELETE"})}})}submitSupplierPayment(i){this.signal_loading.set(!0),this.http.post(`${this.api.host}/payment/supplier`,i).subscribe({next:e=>{this.notificationService.showSuccess("Payment submitted successfully","home")},error:e=>{this.signal_loading.set(!1)},complete:()=>{this.signal_loading.set(!1),this.visible$.next(!1),this.status_action$.next({action:"ADD"})}})}submitSupplierEditPayment(i){this.signal_loading.set(!0),this.http.put(`${this.api.host}/payment/supplier`,i).subscribe({next:e=>{this.notificationService.showSuccess("Payment edited successfully","home")},error:e=>{this.signal_loading.set(!1)},complete:()=>{this.signal_loading.set(!1),this.visible$.next(!1),this.status_action$.next({action:"UPDATE"})}})}};a.\u0275fac=function(e){return new(e||a)(S(Q),S(Y),S($))},a.\u0275prov=F({token:a,factory:a.\u0275fac,providedIn:"root"});let n=a;return n})();var de=["amountInput"],_e=["supplierDropdown"],he=["paymentDateCalendar"],ye=()=>({width:"75vw"}),ge=()=>({"1199px":"85vw","575px":"95vw"}),ue=n=>({"ng-invalid ng-dirty":n});function fe(n,a){n&1&&(s(0,"small",17),m(1,"Supplier is required."),l())}function be(n,a){n&1&&(s(0,"small",17),m(1,"Date is required."),l())}function Ce(n,a){n&1&&(s(0,"small",17),m(1,"Amount is required."),l())}function Se(n,a){if(n&1){let t=v();s(0,"div",6)(1,"div",7)(2,"div",8)(3,"label",9),m(4,"Supplier"),s(5,"span",10),m(6," *"),l()(),s(7,"p-dropdown",11,0),C("ngModelChange",function(e){d(t);let o=p();return b(o.currennt_account,e)||(o.currennt_account=e),_(e)}),l(),h(9,fe,2,0,"small",12),l()(),s(10,"div",7)(11,"label",13),m(12,"Payment Date"),s(13,"span",10),m(14," *"),l()(),s(15,"p-calendar",14,1),C("ngModelChange",function(e){d(t);let o=p();return b(o.payment_date,e)||(o.payment_date=e),_(e)}),l(),h(17,be,2,0,"small",12),l(),s(18,"div",7)(19,"div",8)(20,"label",15),m(21,"Amount"),s(22,"span",10),m(23," *"),l()(),s(24,"p-inputNumber",16,2),C("ngModelChange",function(e){d(t);let o=p();return b(o.amount,e)||(o.amount=e),_(e)}),y("onFocus",function(e){d(t);let o=p();return _(o.selectInput(e))}),l(),h(26,Ce,2,0,"small",12),l()()()}if(n&2){let t=p();u(7),r("options",t.accounts),f("ngModel",t.currennt_account),r("required",!0)("filter",!0)("showClear",!0),u(2),r("ngIf",t.submitted&&!t.currennt_account),u(6),f("ngModel",t.payment_date),r("showIcon",!1)("showClear",!0)("readonlyInput",!0)("showTime",!0)("ngClass",I(18,ue,!t.payment_date)),u(2),r("ngIf",t.submitted&&!t.payment_date),u(7),f("ngModel",t.amount),r("required",!0)("autofocus",!0)("ngClass",I(20,ue,!t.amount)),u(2),r("ngIf",t.submitted&&!t.amount)}}function ve(n,a){if(n&1){let t=v();s(0,"p-button",21),y("onClick",function(){d(t);let e=p(2);return _(e.deletePayment())}),l()}if(n&2){let t=p(2);r("disabled",t.loading())}}function we(n,a){if(n&1){let t=v();h(0,ve,1,1,"p-button",18),s(1,"p-button",19),y("onClick",function(){d(t);let e=p();return _(e.closeDialog())}),l(),s(2,"p-button",20),y("onClick",function(){d(t);let e=p();return _(e.submitPayment())}),l()}if(n&2){let t=p();r("ngIf",t.dialog_mode==="edit"),u(),r("disabled",t.loading()),u(),r("loading",t.loading())}}var nt=(()=>{let a=class a{constructor(){this.visible=!1,this.accounts=[],this.dialog_mode="add",this.type="supplier",this.onClose=new E,this.onSubmit=new E,this.currennt_account=null,this.subscriptions=new V,this.accountsService=g(pe),this.paymentService=g(me),this.confirmationService=g(A),this.dateService=g(ee),this.amount=null,this.submitted=!1,this.loading=this.paymentService.signal_loading,this.payment_date=this.dateService.getCurrentDatetime()}ngOnInit(){this.subscriptions.add(this.paymentService.visible$.subscribe(i=>{this.visible=i})),this.subscriptions.add(this.paymentService.status_action$.subscribe(i=>{i.action&&(this.onSubmit.emit(i),this.accountsService.getAccountTotalBalance(this.currennt_account),this.paymentService.status_action$.next({}))}))}ngOnChanges(){this.visible&&this.dialog_mode==="edit"&&this.selected_payment?(this.amount=this.selected_payment.total_value,this.payment_date=this.dateService.formatDate(this.selected_payment.payment_date,"YYYY-MM-DD HH:mm"),this.currennt_account=this.selected_payment.partner_id):this.visible&&this.dialog_mode==="add"&&(this.payment_date=this.dateService.getCurrentDatetime(),this.currennt_account=this.selected_account)}ngOnDestroy(){this.subscriptions.unsubscribe()}closeDialog(){this.visible=!1,this.onClose.emit(),this.submitted=!1,this.amount=null}submitPayment(){this.submitted=!0,this.amount>0&&this.currennt_account&&this.payment_date?(this.payment_date=this.dateService.formatDate(this.payment_date,"YYYY-MM-DD HH:mm"),this.dialog_mode==="add"?this.paymentService.submitSupplierPayment({amount:this.amount,account_id:this.currennt_account,payment_date:this.payment_date}):this.paymentService.submitSupplierEditPayment({amount:this.amount,account_id:this.currennt_account,payment_date:this.payment_date,journal_id:this.selected_payment.journal_id})):this.amount?this.currennt_account?this.paymentDateCalendar.inputfieldViewChild.nativeElement.focus():this.supplierDropdown.applyFocus():this.amountInput.el.nativeElement.children[0].children[0].focus()}deletePayment(){this.confirmationService.confirm({key:"home",message:'Are you sure that you want to delete invoice"?',header:"Warning",icon:"pi pi-exclamation-triangle",acceptButtonStyleClass:"p-button-danger",rejectButtonStyleClass:"p-button-secondary",defaultFocus:"reject",accept:()=>{this.paymentService.deletePayment(this.selected_payment.journal_id)}})}selectInput(i){i.target.select()}};a.\u0275fac=function(e){return new(e||a)},a.\u0275cmp=k({type:a,selectors:[["supplier-payment-dialog"]],viewQuery:function(e,o){if(e&1&&(w(de,5),w(_e,5),w(he,5)),e&2){let c;x(c=D())&&(o.amountInput=c.first),x(c=D())&&(o.supplierDropdown=c.first),x(c=D())&&(o.paymentDateCalendar=c.first)}},inputs:{visible:"visible",accounts:"accounts",selected_account:"selected_account",selected_payment:"selected_payment",dialog_mode:"dialog_mode",type:"type"},outputs:{onClose:"onClose",onSubmit:"onSubmit"},standalone:!0,features:[W,B],decls:3,vars:10,consts:[["supplierDropdown",""],["paymentDateCalendar",""],["amountInput",""],["position","top","header","Payment","styleClass","p-fluid",3,"visibleChange","onHide","modal","visible","breakpoints","closeOnEscape","closable","maximizable"],["pTemplate","content"],["pTemplate","footer"],[1,"formgrid","grid"],[1,"field","col-12","md:col-4"],[1,"flex","flex-column","gap-2"],["for","supplier"],[1,"text-red-500"],["styleClass","p-inputtext-sm","id","supplier","appendTo","body","optionLabel","name","optionValue","account_id","placeholder","Select Supplier","filterBy","name",3,"ngModelChange","options","ngModel","required","filter","showClear"],["class","p-error",4,"ngIf"],["for","payment_date"],["styleClass","p-inputtext-sm w-full","appendTo","body","dateFormat","yy-mm-dd","placeholder","Date",3,"ngModelChange","ngModel","showIcon","showClear","readonlyInput","showTime","ngClass"],["for","amount"],["styleClass","input-align-center","mode","currency","currency","USD","locale","en-US","step","0",1,"p-inputtext-sm",3,"ngModelChange","onFocus","ngModel","required","autofocus","ngClass"],[1,"p-error"],["pRipple","","label","Delete","icon","pi pi-trash","severity","danger","styleClass","w-full mt-4 md:w-auto md:mt-0","size","small",3,"disabled","onClick",4,"ngIf"],["pRipple","","label","Cancel","icon","pi pi-times","severity","secondary","styleClass","w-full mt-2 md:w-auto md:ml-2","size","small",3,"onClick","disabled"],["pRipple","","label","Finish","icon","pi pi-check","severity","success","styleClass","w-full mt-2 md:w-auto md:ml-2","size","small",3,"onClick","loading"],["pRipple","","label","Delete","icon","pi pi-trash","severity","danger","styleClass","w-full mt-4 md:w-auto md:mt-0","size","small",3,"onClick","disabled"]],template:function(e,o){e&1&&(s(0,"p-dialog",3),C("visibleChange",function(P){return b(o.visible,P)||(o.visible=P),P}),y("onHide",function(){return o.closeDialog()}),h(1,Se,27,22,"ng-template",4)(2,we,3,3,"ng-template",5),l()),e&2&&(q(T(8,ye)),r("modal",!0),f("visible",o.visible),r("breakpoints",T(9,ge))("closeOnEscape",!1)("closable",!0)("maximizable",!0))},dependencies:[re,le,O,X,K,Z,se,ae,oe,ne,H,N,R,G,z,U,L,J,ie,te]});let n=a;return n})();export{nt as a};
