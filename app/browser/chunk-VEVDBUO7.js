import{a as ee}from"./chunk-5ROHNZMS.js";import{a as se,b as le}from"./chunk-SW5CXPYQ.js";import{c as ie,d as ne,i as oe,j as ae}from"./chunk-P3OYWVPG.js";import{a as re,b as me}from"./chunk-GRPO54WU.js";import{a as _e,b as te}from"./chunk-EVKGT6TP.js";import{$a as M,Aa as l,Ab as Y,Cb as O,Fa as w,Ga as g,Ha as m,Ic as K,J as T,Jc as X,Lc as Z,M as v,N as h,Na as W,O as I,Oa as j,Pa as B,Ra as c,Sb as R,U as V,V as u,Va as y,W as d,Wa as f,Xa as C,Xb as $,Za as N,_ as D,_a as P,ec as z,g as de,ha as p,hc as A,i as E,l as S,nc as L,oa as k,ra as _,rc as Q,ta as r,ub as q,vc as U,wa as F,wb as H,xc as G,yc as J,za as s}from"./chunk-UKD27P7M.js";var ce=(()=>{let o=class o{constructor(n,e,a){this.http=n,this.api=e,this.notificationService=a,this.signal_loading=k(!1),this.visible$=new S(!1),this.status_action$=new S({})}submitCustomerPayment(n){this.signal_loading.set(!0),this.http.post(`${this.api.host}/payment/customer`,n).subscribe({next:e=>{this.notificationService.showSuccess("Payment submitted successfully","home")},error:e=>{this.signal_loading.set(!1)},complete:()=>{this.signal_loading.set(!1),this.visible$.next(!1),this.status_action$.next({action:"ADD"})}})}submitCustomerEditPayment(n){this.signal_loading.set(!0),this.http.put(`${this.api.host}/payment/customer`,n).subscribe({next:e=>{this.notificationService.showSuccess("Payment edited successfully","home")},error:e=>{this.signal_loading.set(!1)},complete:()=>{this.signal_loading.set(!1),this.visible$.next(!1),this.status_action$.next({action:"UPDATE"})}})}deletePayment(n){this.signal_loading.set(!0),this.http.delete(`${this.api.host}/payment/${n}`).subscribe({next:e=>{this.notificationService.showSuccess("Payment deleted successfully","home")},error:e=>{this.signal_loading.set(!1)},complete:()=>{this.signal_loading.set(!1),this.visible$.next(!1),this.status_action$.next({action:"DELETE"})}})}};o.\u0275fac=function(e){return new(e||o)(v(O),v(R),v(A))},o.\u0275prov=T({token:o,factory:o.\u0275fac,providedIn:"root"});let i=o;return i})();var ue=de(_e());var ge=["amountInput"],ye=()=>({width:"75vw"}),fe=()=>({"1199px":"85vw","575px":"95vw"}),pe=i=>({"ng-invalid ng-dirty":i});function Ce(i,o){i&1&&(s(0,"small",15),c(1,"Customer is required."),l())}function be(i,o){i&1&&(s(0,"small",15),c(1,"Date is required."),l())}function ve(i,o){i&1&&(s(0,"small",15),c(1,"Ammount is required."),l())}function we(i,o){if(i&1){let t=w();s(0,"div",4)(1,"div",5)(2,"div",6)(3,"label",7),c(4,"Customer"),s(5,"span",8),c(6," *"),l()(),s(7,"p-dropdown",9),C("ngModelChange",function(e){u(t);let a=m();return f(a.selected_account,e)||(a.selected_account=e),d(e)}),l(),_(8,Ce,2,0,"small",10),l()(),s(9,"div",5)(10,"label",11),c(11,"Payment Date"),s(12,"span",8),c(13," *"),l()(),s(14,"p-calendar",12,0),C("ngModelChange",function(e){u(t);let a=m();return f(a.payment_date,e)||(a.payment_date=e),d(e)}),l(),_(16,be,2,0,"small",10),l(),s(17,"div",5)(18,"div",6)(19,"label",13),c(20,"Amount"),s(21,"span",8),c(22," *"),l()(),s(23,"p-inputNumber",14),C("ngModelChange",function(e){u(t);let a=m();return f(a.amount,e)||(a.amount=e),d(e)}),l(),_(24,ve,2,0,"small",10),l()()()}if(i&2){let t=m();p(7),r("options",t.accounts),y("ngModel",t.selected_account),r("required",!0)("filter",!0)("showClear",!0),p(),r("ngIf",t.submitted&&!t.selected_account),p(6),y("ngModel",t.payment_date),r("showIcon",!1)("showClear",!0)("readonlyInput",!0)("showTime",!0)("ngClass",M(18,pe,!t.payment_date)),p(2),r("ngIf",t.submitted&&!t.payment_date),p(7),y("ngModel",t.amount),r("required",!0)("autofocus",!0)("ngClass",M(20,pe,t.submitted&&!t.amount)),p(),r("ngIf",t.submitted&&!t.amount)}}function xe(i,o){if(i&1){let t=w();s(0,"p-button",19),g("onClick",function(){u(t);let e=m(2);return d(e.deletePayment())}),l()}if(i&2){let t=m(2);r("disabled",t.loading())}}function Se(i,o){if(i&1){let t=w();_(0,xe,1,1,"p-button",16),s(1,"p-button",17),g("onClick",function(){u(t);let e=m();return d(e.closeDialog())}),l(),s(2,"p-button",18),g("onClick",function(){u(t);let e=m();return d(e.submitPayment())}),l()}if(i&2){let t=m();r("ngIf",t.dialog_mode==="edit"),p(),r("disabled",t.loading()),p(),r("loading",t.loading())}}var ot=(()=>{let o=class o{constructor(){this.visible=!1,this.accounts=[],this.dialog_mode="add",this.type="customer",this.onClose=new D,this.onSubmit=new D,this.current_account=null,this.subscriptions=new E,this.customersService=h(ee),this.paymentService=h(ce),this.confirmationService=h($),this.dateService=h(te),this.amount=null,this.submitted=!1,this.loading=this.paymentService.signal_loading,this.payment_date=this.dateService.getCurrentDatetime()}ngOnInit(){this.subscriptions.add(this.paymentService.visible$.subscribe(n=>{this.visible=n})),this.subscriptions.add(this.paymentService.status_action$.subscribe(n=>{n.action&&(this.onSubmit.emit(n),this.customersService.getCustomerTotalBalance(this.current_account),this.paymentService.status_action$.next({}))}))}ngOnChanges(){this.visible&&this.dialog_mode==="edit"&&this.selected_payment?(this.amount=this.selected_payment.total_value,this.payment_date=this.dateService.formatDate(this.selected_payment.payment_date,"YYYY-MM-DD HH:mm"),this.current_account=this.selected_payment.partner_id):this.visible&&this.dialog_mode==="add"&&(this.payment_date=this.dateService.getCurrentDatetime(),this.current_account=this.selected_account)}ngOnDestroy(){this.subscriptions.unsubscribe()}closeDialog(){this.visible=!1,this.onClose.emit(),this.submitted=!1,this.amount=null}submitPayment(){this.submitted=!0,this.amount>0&&this.current_account&&this.payment_date?(this.payment_date=(0,ue.default)(this.payment_date).format("YYYY-MM-DD HH:mm:ss"),this.dialog_mode==="add"?this.paymentService.submitCustomerPayment({amount:this.amount,account_id:this.current_account,payment_date:this.payment_date}):this.paymentService.submitCustomerEditPayment({amount:this.amount,account_id:this.current_account,payment_date:this.payment_date,journal_id:this.selected_payment.journal_id})):this.amountInput.nativeElement.focus()}deletePayment(){this.confirmationService.confirm({key:"home",message:'Are you sure that you want to delete invoice"?',header:"Warning",icon:"pi pi-exclamation-triangle",acceptButtonStyleClass:"p-button-danger",rejectButtonStyleClass:"p-button-secondary",defaultFocus:"reject",accept:()=>{this.paymentService.deletePayment(this.selected_payment.journal_id)}})}selectInput(n){n.target.select()}};o.\u0275fac=function(e){return new(e||o)},o.\u0275cmp=I({type:o,selectors:[["payment-dialog"]],viewQuery:function(e,a){if(e&1&&W(ge,5),e&2){let b;j(b=B())&&(a.amountInput=b.first)}},inputs:{visible:"visible",accounts:"accounts",selected_account:"selected_account",selected_payment:"selected_payment",dialog_mode:"dialog_mode",type:"type"},outputs:{onClose:"onClose",onSubmit:"onSubmit"},standalone:!0,features:[V,N],decls:3,vars:10,consts:[["paymentDateCalendar",""],["position","top","header","Payment","styleClass","p-fluid",3,"visibleChange","onHide","modal","visible","breakpoints","closeOnEscape","closable","maximizable"],["pTemplate","content"],["pTemplate","footer"],[1,"formgrid","grid"],[1,"field","col-12","md:col-4"],[1,"flex","flex-column","gap-2"],["for","customer"],[1,"text-red-500"],["styleClass","p-inputtext-sm","id","customer","appendTo","body","optionLabel","name","optionValue","account_id","placeholder","Select Customer","filterBy","name",3,"ngModelChange","options","ngModel","required","filter","showClear"],["class","p-error",4,"ngIf"],["for","payment_date"],["styleClass","p-inputtext-sm w-full","appendTo","body","dateFormat","yy-mm-dd","placeholder","Date",3,"ngModelChange","ngModel","showIcon","showClear","readonlyInput","showTime","ngClass"],["for","amount"],["styleClass","input-align-center","mode","currency","currency","USD","locale","en-US","step","0",1,"p-inputtext-sm",3,"ngModelChange","ngModel","required","autofocus","ngClass"],[1,"p-error"],["pRipple","","label","Delete","icon","pi pi-trash","severity","danger","styleClass","w-full mt-4 md:w-auto md:mt-0","size","small",3,"disabled","onClick",4,"ngIf"],["pRipple","","label","Cancel","icon","pi pi-times","severity","secondary","styleClass","w-full mt-2 md:w-auto md:ml-2","size","small",3,"onClick","disabled"],["pRipple","","label","Finish","icon","pi pi-check","severity","success","styleClass","w-full mt-2 md:w-auto md:ml-2","size","small",3,"onClick","loading"],["pRipple","","label","Delete","icon","pi pi-trash","severity","danger","styleClass","w-full mt-4 md:w-auto md:mt-0","size","small",3,"onClick","disabled"]],template:function(e,a){e&1&&(s(0,"p-dialog",1),C("visibleChange",function(x){return f(a.visible,x)||(a.visible=x),x}),g("onHide",function(){return a.closeDialog()}),_(1,we,25,22,"ng-template",2)(2,Se,3,3,"ng-template",3),l()),e&2&&(F(P(8,ye)),r("modal",!0),y("visible",a.visible),r("breakpoints",P(9,fe))("closeOnEscape",!1)("closable",!0)("maximizable",!0))},dependencies:[me,re,z,X,K,Z,le,se,ae,oe,Y,q,H,G,L,U,Q,J,ne,ie]});let i=o;return i})();export{ot as a};
