import{a as Ee,b as ke}from"./chunk-VMMTEAFY.js";import{a as ge}from"./chunk-36L3CAHM.js";import"./chunk-L3LCD3J6.js";import{b as $,d as Re,o as Te}from"./chunk-SW5CXPYQ.js";import{a as be,b as Ce}from"./chunk-6KSUBTBA.js";import"./chunk-4UGCOW2V.js";import{c as ve,d as B,i as ye,j as we}from"./chunk-P3OYWVPG.js";import{a as De,b as z}from"./chunk-GRPO54WU.js";import{a as fe,b as he}from"./chunk-VRTFVVJY.js";import{c as xe,d as Se}from"./chunk-ULBQ4ARH.js";import{$a as Q,Aa as l,Ab as V,Ba as g,Cb as F,Fa as C,Ga as h,Ha as p,Ic as j,J as R,Jc as P,K as T,Kc as _e,Lc as A,N as c,Na as X,O as D,Oa as Y,P as E,Pa as Z,Qa as G,Ra as s,Rb as J,Sa as y,Sb as N,Ta as k,V as u,Va as ee,W as f,Wa as te,Xa as ie,Xb as H,Za as re,_ as q,_a as x,ab as ne,ec as O,ha as m,hc as L,jc as le,lc as K,nc as se,oa as v,oc as ae,ra as _,sb as oe,sc as me,ta as d,tc as de,ub as I,uc as pe,wa as U,wb as M,wc as ce,yc as ue,za as o}from"./chunk-UKD27P7M.js";var Ie=(()=>{let t=class t{constructor(){this.api=c(N),this.http=c(F),this.notificationService=c(L),this.reminders=v([]),this.remindersLoading=v(!1),this.getAllReminders()}getAllReminders(){this.remindersLoading.set(!0),this.http.get(`${this.api.host}/reminders`).subscribe({next:n=>{this.reminders.set(n),this.remindersLoading.set(!1)},error:n=>{this.notificationService.showError(n.error,"home"),this.remindersLoading.set(!1)}})}deleteReminder(n){this.http.delete(`${this.api.host}/reminders/${n}`).subscribe({next:e=>{this.notificationService.showSuccess(e.message,"home"),this.getAllReminders()},error:e=>{this.notificationService.showError(e.error,"home")}})}markNotified(n){this.http.patch(`${this.api.host}/reminders/notify`,n).subscribe({next:e=>{this.notificationService.showSuccess(e.message,"home"),this.getAllReminders()},error:e=>{this.notificationService.showError(e.error,"home")}})}markCompleted(n){this.http.patch(`${this.api.host}/reminders/complete`,n).subscribe({next:e=>{this.notificationService.showSuccess(e.message,"home"),this.getAllReminders()},error:e=>{this.notificationService.showError(e.error,"home")}})}};t.\u0275fac=function(e){return new(e||t)},t.\u0275prov=R({token:t,factory:t.\u0275fac,providedIn:"root"});let i=t;return i})();var Me=(()=>{let t=class t{constructor(){this.api=c(N),this.http=c(F),this.notificationService=c(L),this.submitLoading=v(!1),this.reminderSubmitted=v(!1)}addReminder(n){this.submitLoading.set(!0),this.http.post(`${this.api.host}/reminders`,n).subscribe({next:e=>{this.notificationService.showSuccess(e.message,"home"),this.submitLoading.set(!1),this.reminderSubmitted.set(!this.reminderSubmitted())},error:e=>{this.notificationService.showError(e.error,"home"),this.submitLoading.set(!1)}})}updateReminder(n){this.submitLoading.set(!0),this.http.put(`${this.api.host}/reminders`,n).subscribe({next:e=>{this.notificationService.showSuccess(e.message,"home"),this.submitLoading.set(!1),this.reminderSubmitted.set(!this.reminderSubmitted())},error:e=>{this.notificationService.showError(e.error,"home"),this.submitLoading.set(!1)}})}};t.\u0275fac=function(e){return new(e||t)},t.\u0275prov=R({token:t,factory:t.\u0275fac,providedIn:"root"});let i=t;return i})();var je=()=>({width:"65vw"}),Pe=()=>({"1199px":"75vw","575px":"95vw"}),Ve=i=>({"ng-invalid ng-dirty":i});function Ae(i,t){i&1&&(o(0,"small",17),s(1,"Title is required."),l())}function Be(i,t){i&1&&(o(0,"small",17),s(1,"Date is required."),l())}function $e(i,t){if(i&1&&(o(0,"form",3)(1,"div",4)(2,"div",5)(3,"div",6)(4,"label",7),s(5,"Title"),o(6,"span",8),s(7," *"),l()(),g(8,"p-dropdown",9),_(9,Ae,2,0,"small",10),l()(),o(10,"div",5)(11,"label",11),s(12,"Due Date"),o(13,"span",8),s(14," *"),l()(),g(15,"p-calendar",12),_(16,Be,2,0,"small",10),l(),o(17,"div",5)(18,"label",11),s(19,"Repeat"),o(20,"span",8),s(21," *"),l()(),g(22,"p-dropdown",13),l(),o(23,"div",14)(24,"label",15),s(25,"Reminder Notes"),l(),o(26,"textarea",16),s(27,"                    "),l()()()()),i&2){let r=p();d("formGroup",r.reminderForm),m(8),d("options",r.titles)("ngClass",Q(10,Ve,r.reminder_title.invalid&&(r.reminder_title.dirty||r.reminder_title.touched||r.submitted))),m(),d("ngIf",r.reminder_title.invalid&&(r.reminder_title.dirty||r.reminder_title.touched||r.submitted)),m(6),d("showIcon",!1)("showClear",!0)("readonlyInput",!0)("ngClass",Q(12,Ve,r.due_date.invalid&&(r.due_date.dirty||r.due_date.touched||r.submitted))),m(),d("ngIf",r.due_date.invalid&&(r.due_date.dirty||r.due_date.touched||r.submitted)),m(6),d("options",r.options)}}function ze(i,t){if(i&1){let r=C();o(0,"p-button",18),h("onClick",function(){u(r);let e=p();return f(e.closeDialog())}),l(),o(1,"p-button",19),h("onClick",function(){u(r);let e=p();return f(e.submitReminder())}),l()}if(i&2){let r=p();m(),d("loading",r.submitLoading())}}var W=(()=>{let t=class t{set dialog_mode(n){this.dialogMode=n}set selected_reminder(n){this.reminderForm.patchValue(n)}get reminder_title(){return this.reminderForm.get("reminder_title")}get due_date(){return this.reminderForm.get("due_date")}closeDialog(){this.clearInputs(),this.OnClose.emit()}clearInputs(){this.visible=!1,this.reminderForm.reset()}submitReminder(){this.submitted=!0,this.reminderForm.valid&&(this.dialogMode==="add"?this.reminderDialogService.addReminder(this.reminderForm.value):this.dialogMode==="edit"&&this.reminderDialogService.updateReminder(this.reminderForm.value))}constructor(){this.visible=!1,this.OnClose=new q,this.OnSubmit=new q,this.dialogMode=null,this.confirmationService=c(H),this.reminderDialogService=c(Me),this.dateService=c(ge),this.fb=c(ce),this.reminderForm=this.fb.group({reminder_id:[null],reminder_title:[null,K.required],due_date:[null,K.required],repeat_after:[null],reminder_text:[null]}),this.titles=[{label:"---",value:null},{label:"Vaccine",value:"Vaccine"},{label:"Deworming",value:"Deworming"},{label:"Defleaing",value:"Defleaing"},{label:"Hydatic cyst",value:"Hydatic cyst"},{label:"Other",value:"Other"}],this.options=[{label:"Never",value:null},{label:"Every Month",value:"30"},{label:"2 Months",value:"60"},{label:"3 Months",value:"90"},{label:"6 Months",value:"180"}],this.submitLoading=this.reminderDialogService.submitLoading,this.submitted=!1,this.reminderSubmitted=this.reminderDialogService.reminderSubmitted,oe(()=>{this.reminderSubmitted(),this.visible=!1,this.OnSubmit.emit()})}};t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=D({type:t,selectors:[["reminder-dialog"]],inputs:{visible:"visible",dialog_mode:"dialog_mode",selected_reminder:"selected_reminder"},outputs:{OnClose:"OnClose",OnSubmit:"OnSubmit"},standalone:!0,features:[re],decls:3,vars:11,consts:[["position","top","styleClass","p-fluid",3,"visibleChange","onHide","header","modal","visible","breakpoints","closeOnEscape","closable","maximizable"],["pTemplate","content"],["pTemplate","footer"],[3,"formGroup"],[1,"formgrid","grid"],[1,"field","col-12","md:col-4"],[1,"flex","flex-column","gap-2"],["for","Type"],[1,"text-red-500"],["formControlName","reminder_title","styleClass","p-inputtext-sm","appendTo","body","scrollHeight","300px",3,"options","ngClass"],["class","p-error",4,"ngIf"],["for","payment_date"],["formControlName","due_date","styleClass","p-inputtext-sm w-full","appendTo","body","dateFormat","yy-mm-dd","placeholder","Date",3,"showIcon","showClear","readonlyInput","ngClass"],["formControlName","repeat_after","styleClass","p-inputtext-sm","appendTo","body",3,"options"],[1,"field","col-12"],["for","notes"],["rows","6","cols","30","pInputTextarea","","formControlName","reminder_text","spellcheck","false"],[1,"p-error"],["pRipple","","size","small","label","Cancel","icon","pi pi-times","severity","secondary","styleClass","w-full mt-2 md:w-auto md:ml-2",3,"onClick"],["pRipple","","size","small","label","Finish","icon","pi pi-check","severity","success","styleClass","w-full mt-2 md:w-auto md:ml-2",3,"onClick","loading"]],template:function(e,a){e&1&&(o(0,"p-dialog",0),ie("visibleChange",function(S){return te(a.visible,S)||(a.visible=S),S}),h("onHide",function(){return a.closeDialog()}),_(1,$e,28,14,"ng-template",1)(2,ze,2,1,"ng-template",2),l()),e&2&&(U(x(9,je)),d("header",a.dialogMode+" reminder")("modal",!0),ee("visible",a.visible),d("breakpoints",x(10,Pe))("closeOnEscape",!1)("closable",!0)("maximizable",!0))},dependencies:[V,I,M,P,j,O,we,ye,B,ve,$,ue,me,le,se,ae,de,pe,z,De,A,ke,Ee]});let i=t;return i})();var qe=["rt"],Ge=()=>[10,15,50,100],Qe=()=>["reminder_title","reminder_text","name","pet_name"],Je=(i,t)=>({" pi-check-circle text-green-600":i,"pi-times-circle text-red-600":t});function Ke(i,t){if(i&1){let r=C();o(0,"span",9),g(1,"i",10),o(2,"input",11,1),h("input",function(e){u(r),p();let a=G(6);return f(a.filterGlobal(e.target.value,"contains"))}),l()(),o(4,"p-button",12),h("click",function(){u(r);let e=p();return f(e.refreshReminders())}),l(),o(5,"p-button",13),h("click",function(){u(r);let e=p();return f(e.openReminderDialog("add"))}),l()}if(i&2){let r=p(),n=G(6);m(2),d("value",n.filters.global==null?null:n.filters.global.value),m(2),d("loading",r.remindersLoading())}}function Ue(i,t){i&1&&(o(0,"tr")(1,"th"),s(2,"Title"),l(),o(3,"th"),s(4,"Description"),l(),o(5,"th"),s(6,"Due Date"),l(),o(7,"th"),s(8,"Customer"),l(),o(9,"th"),s(10,"Pet Name"),l(),o(11,"th"),s(12,"is Notified?"),l(),o(13,"th",14),s(14,"Options"),l()())}function Xe(i,t){if(i&1&&(o(0,"small",22),s(1),l()),i&2){let r=p().$implicit;m(),k("Repeat each: ",r.repeat_after," days")}}function Ye(i,t){if(i&1&&(o(0,"small"),s(1),l()),i&2){let r=p().$implicit;m(),y(r.phone)}}function Ze(i,t){if(i&1){let r=C();o(0,"p-button",23),h("onClick",function(){u(r);let e=p().$implicit,a=p();return f(a.markCompleted(e))}),l()}}function et(i,t){if(i&1){let r=C();o(0,"tr")(1,"td"),s(2),l(),o(3,"td"),s(4),l(),o(5,"td"),s(6),g(7,"br"),_(8,Xe,2,1,"small",15),l(),o(9,"td"),s(10),g(11,"br"),_(12,Ye,2,1,"small",16),l(),o(13,"td"),s(14),l(),o(15,"td"),g(16,"i",17),l(),o(17,"td")(18,"p-button",18),h("onClick",function(){let e=u(r).$implicit,a=p();return f(a.openReminderDialog("edit",e))}),l(),o(19,"p-button",19),h("onClick",function(){let e=u(r).$implicit,a=p();return f(a.deleteReminder(e))}),l(),o(20,"p-button",20),h("onClick",function(){let e=u(r).$implicit,a=p();return f(a.markNotified(e))}),l(),_(21,Ze,1,0,"p-button",21),l()()}if(i&2){let r=t.$implicit;m(2),y(r.reminder_title),m(2),y(r.reminder_text||"---"),m(2),k(" ",r.due_date," "),m(2),d("ngIf",r.repeat_after),m(2),k(" ",r.name||"---"," "),m(2),d("ngIf",r.phone),m(2),y(r.pet_name||"---"),m(2),d("ngClass",ne(9,Je,r.has_notified,!r.has_notified)),m(5),d("ngIf",r.repeat_after)}}var Fe=(()=>{let t=class t{constructor(){this.reminderService=c(Ie),this.confirmationService=c(H),this.reminders=this.reminderService.reminders,this.remindersLoading=this.reminderService.remindersLoading,this.selectedReminder=null,this.reminderDialogVisible=!1}refreshReminders(){this.remindersTable?.reset(),this.reminderService.getAllReminders()}openReminderDialog(n,e){this.dialogMode=n,e?this.selectedReminder=e:this.selectedReminder=null,this.reminderDialogVisible=!0}closeDialog(){this.reminderDialogVisible=!1,this.selectedReminder=null}deleteReminder(n){this.confirmationService.confirm({key:"home",message:"Are you sure you want to delete selected reminder?",header:"Warning",icon:"pi pi-exclamation-triangle",acceptButtonStyleClass:"p-button-danger",rejectButtonStyleClass:"p-button-secondary",defaultFocus:"reject",accept:()=>{this.reminderService.deleteReminder(n.reminder_id)}})}markNotified(n){this.confirmationService.confirm({key:"home",message:"Are you sure you want to mark selected reminder as notified?",header:"Warning",icon:"pi pi-exclamation-triangle",acceptButtonStyleClass:"p-button-danger",rejectButtonStyleClass:"p-button-secondary",defaultFocus:"reject",accept:()=>{this.reminderService.markNotified(n)}})}markCompleted(n){this.confirmationService.confirm({key:"home",message:"Are you sure you want to mark selected reminder as completed?",header:"Warning",icon:"pi pi-exclamation-triangle",acceptButtonStyleClass:"p-button-danger",rejectButtonStyleClass:"p-button-secondary",defaultFocus:"reject",accept:()=>{this.reminderService.markCompleted(n)}})}};t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=D({type:t,selectors:[["app-reminders-home"]],viewQuery:function(e,a){if(e&1&&X(qe,5),e&2){let b;Y(b=Z())&&(a.remindersTable=b.first)}},decls:10,vars:14,consts:[["rt",""],["tableSearch",""],[1,"grid","m-1"],[1,"col-12"],["pTemplate","left"],["styleClass","p-datatable-sm","currentPageReportTemplate","Showing {first} to {last} of {totalRecords} records",3,"value","paginator","rows","showCurrentPageReport","rowsPerPageOptions","alwaysShowPaginator","globalFilterFields","filterDelay","loading"],["pTemplate","header"],["pTemplate","body"],[3,"OnClose","OnSubmit","visible","dialog_mode","selected_reminder"],[1,"p-input-icon-left"],[1,"pi","pi-search"],["pInputText","","type","search","placeholder","Search ...",1,"p-inputtext-sm",3,"input","value"],["label","Refresh","icon","pi pi-refresh","size","small","styleClass","mx-2 ",3,"click","loading"],["label","New","icon","pi pi-plus","severity","success","size","small",3,"click"],["width","15%"],["class","text-green-600",4,"ngIf"],[4,"ngIf"],[1,"pi",3,"ngClass"],["pTooltip","Edit","tooltipPosition","bottom","size","small","severity","warning","icon","fas fa-edit","styleClass","mr-2",3,"onClick"],["pTooltip","Delete","tooltipPosition","bottom","size","small","severity","danger","icon","pi pi-trash","styleClass","mr-2",3,"onClick"],["pTooltip","Mark as Notified","tooltipPosition","bottom","size","small","severity","info","icon","pi pi-envelope","styleClass","mr-2",3,"onClick"],["pTooltip","Mark as Completed","tooltipPosition","bottom","size","small","severity","success","icon","pi pi-check",3,"onClick",4,"ngIf"],[1,"text-green-600"],["pTooltip","Mark as Completed","tooltipPosition","bottom","size","small","severity","success","icon","pi pi-check",3,"onClick"]],template:function(e,a){if(e&1){let b=C();o(0,"div",2)(1,"div",3)(2,"p-card")(3,"p-toolbar"),_(4,Ke,6,2,"ng-template",4),l(),o(5,"p-table",5,0),_(7,Ue,15,0,"ng-template",6)(8,et,22,12,"ng-template",7),l()()()(),o(9,"reminder-dialog",8),h("OnClose",function(){return u(b),f(a.closeDialog())})("OnSubmit",function(){return u(b),f(a.refreshReminders())}),l()}e&2&&(m(5),d("value",a.reminders())("paginator",!0)("rows",10)("showCurrentPageReport",!0)("rowsPerPageOptions",x(12,Ge))("alwaysShowPaginator",!0)("globalFilterFields",x(13,Qe))("filterDelay",0)("loading",a.remindersLoading()),m(4),d("visible",a.reminderDialogVisible)("dialog_mode",a.dialogMode)("selected_reminder",a.selectedReminder))},dependencies:[I,M,fe,O,j,Re,_e,be,W,xe]});let i=t;return i})();var tt=[{path:"",component:Fe}],Ne=(()=>{let t=class t{};t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=E({type:t}),t.\u0275inj=T({imports:[J.forChild(tt),J]});let i=t;return i})();var mi=(()=>{let t=class t{};t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=E({type:t}),t.\u0275inj=T({imports:[V,Ne,he,P,Te,z,A,$,B,Ce,W,Se]});let i=t;return i})();export{mi as RemindersModule};
