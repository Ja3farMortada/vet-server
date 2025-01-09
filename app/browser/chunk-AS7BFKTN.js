import{a as z,b as H}from"./chunk-2UFRC7H2.js";import{a as U}from"./chunk-6M5CHABF.js";import{$a as y,Aa as b,Ac as S,B as V,Ba as w,Bc as ge,C as G,Ca as W,Cb as me,Cc as A,Da as P,Db as ce,Ea as j,Eb as k,Ec as Te,Gc as ye,H as d,I as u,Kb as pe,Kc as $,Lc as q,M,Mb as Q,N as B,Na as O,Oa as X,Pb as de,Qa as ee,Qb as ue,V as a,W as f,Xa as te,Z as J,Za as ie,_a as E,ca as D,cb as ne,da as h,db as N,ea as m,eb as se,fa as r,fb as oe,gb as ae,hb as re,ic as fe,ja as T,jb as le,la as c,ma as p,na as _,oa as I,oc as he,pa as C,pc as _e,qa as F,ra as v,sa as x,ta as l,x as Y,xc as R,ya as K,yc as L,za as Z}from"./chunk-FYHOXPUP.js";var Ie=["container"],Ce=t=>[t,"p-toast-message"],ve=(t,o,e,n)=>({showTransformParams:t,hideTransformParams:o,showTransitionParams:e,hideTransitionParams:n}),xe=t=>({value:"visible",params:t}),be=(t,o)=>({$implicit:t,closeFn:o}),we=t=>({$implicit:t});function Oe(t,o){t&1&&F(0)}function Ee(t,o){if(t&1&&(I(0),h(1,Oe,1,0,"ng-container",4),C()),t&2){let e=l();a(),r("ngTemplateOutlet",e.headlessTemplate)("ngTemplateOutletContext",X(2,be,e.message,e.onCloseIconClick))}}function ke(t,o){if(t&1&&_(0,"span"),t&2){let e=l(3);T("p-toast-message-icon pi "+e.message.icon)}}function Se(t,o){t&1&&_(0,"CheckIcon"),t&2&&m("aria-hidden",!0)("data-pc-section","icon")}function Ae(t,o){t&1&&_(0,"InfoCircleIcon"),t&2&&m("aria-hidden",!0)("data-pc-section","icon")}function Ve(t,o){t&1&&_(0,"TimesCircleIcon"),t&2&&m("aria-hidden",!0)("data-pc-section","icon")}function Me(t,o){t&1&&_(0,"ExclamationTriangleIcon"),t&2&&m("aria-hidden",!0)("data-pc-section","icon")}function De(t,o){if(t&1&&(c(0,"span",13),I(1),h(2,Se,1,2,"CheckIcon",6)(3,Ae,1,2,"InfoCircleIcon",6)(4,Ve,1,2,"TimesCircleIcon",6)(5,Me,1,2,"ExclamationTriangleIcon",6),C(),p()),t&2){let e=l(3);m("aria-hidden",!0)("data-pc-section","icon"),a(2),r("ngIf",e.message.severity==="success"),a(),r("ngIf",e.message.severity==="info"),a(),r("ngIf",e.message.severity==="error"),a(),r("ngIf",e.message.severity==="warn")}}function Fe(t,o){if(t&1&&(I(0),h(1,ke,1,2,"span",8)(2,De,6,6,"span",9),c(3,"div",10)(4,"div",11),P(5),p(),c(6,"div",12),P(7),p()(),C()),t&2){let e=l(2);a(),r("ngIf",e.message.icon),a(),r("ngIf",!e.message.icon),a(),m("data-pc-section","text"),a(),m("data-pc-section","summary"),a(),j(e.message.summary),a(),m("data-pc-section","detail"),a(),j(e.message.detail)}}function Ze(t,o){t&1&&F(0)}function Pe(t,o){if(t&1&&_(0,"span"),t&2){let e=l(3);T("pt-1 text-base p-toast-message-icon pi "+e.message.closeIcon)}}function je(t,o){t&1&&_(0,"TimesIcon",16),t&2&&(r("styleClass","p-toast-icon-close-icon"),m("aria-hidden",!0)("data-pc-section","closeicon"))}function Ne(t,o){if(t&1){let e=v();c(0,"button",14),x("click",function(i){d(e);let s=l(2);return u(s.onCloseIconClick(i))})("keydown.enter",function(i){d(e);let s=l(2);return u(s.onCloseIconClick(i))}),h(1,Pe,1,2,"span",8)(2,je,1,3,"TimesIcon",15),p()}if(t&2){let e=l(2);m("aria-label",e.closeAriaLabel)("data-pc-section","closebutton"),a(),r("ngIf",e.message.closeIcon),a(),r("ngIf",!e.message.closeIcon)}}function Qe(t,o){if(t&1&&(c(0,"div",5),h(1,Fe,8,7,"ng-container",6)(2,Ze,1,0,"ng-container",4)(3,Ne,3,4,"button",7),p()),t&2){let e=l();r("ngClass",e.message==null?null:e.message.contentStyleClass),m("data-pc-section","content"),a(),r("ngIf",!e.template),a(),r("ngTemplateOutlet",e.template)("ngTemplateOutletContext",O(6,we,e.message)),a(),r("ngIf",(e.message==null?null:e.message.closable)!==!1)}}function Re(t,o){if(t&1){let e=v();c(0,"p-toastItem",3),x("onClose",function(i){d(e);let s=l();return u(s.onMessageClose(i))})("@toastAnimation.start",function(i){d(e);let s=l();return u(s.onAnimationStart(i))})("@toastAnimation.done",function(i){d(e);let s=l();return u(s.onAnimationEnd(i))}),p()}if(t&2){let e=o.$implicit,n=o.index,i=l();r("message",e)("index",n)("life",i.life)("template",i.template)("headlessTemplate",i.headlessTemplate)("@toastAnimation",void 0)("showTransformOptions",i.showTransformOptions)("hideTransformOptions",i.hideTransformOptions)("showTransitionOptions",i.showTransitionOptions)("hideTransitionOptions",i.hideTransitionOptions)}}var Le=(()=>{class t{zone;config;message;index;life;template;headlessTemplate;showTransformOptions;hideTransformOptions;showTransitionOptions;hideTransitionOptions;onClose=new M;containerViewChild;timeout;constructor(e,n){this.zone=e,this.config=n}ngAfterViewInit(){this.initTimeout()}initTimeout(){this.message?.sticky||this.zone.runOutsideAngular(()=>{this.timeout=setTimeout(()=>{this.onClose.emit({index:this.index,message:this.message})},this.message?.life||this.life||3e3)})}clearTimeout(){this.timeout&&(clearTimeout(this.timeout),this.timeout=null)}onMouseEnter(){this.clearTimeout()}onMouseLeave(){this.initTimeout()}onCloseIconClick=e=>{this.clearTimeout(),this.onClose.emit({index:this.index,message:this.message}),e.preventDefault()};get closeAriaLabel(){return this.config.translation.aria?this.config.translation.aria.close:void 0}ngOnDestroy(){this.clearTimeout()}static \u0275fac=function(n){return new(n||t)(f(B),f(Q))};static \u0275cmp=V({type:t,selectors:[["p-toastItem"]],viewQuery:function(n,i){if(n&1&&Z(Ie,5),n&2){let s;b(s=w())&&(i.containerViewChild=s.first)}},hostAttrs:[1,"p-element"],inputs:{message:"message",index:[2,"index","index",y],life:[2,"life","life",y],template:"template",headlessTemplate:"headlessTemplate",showTransformOptions:"showTransformOptions",hideTransformOptions:"hideTransformOptions",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions"},outputs:{onClose:"onClose"},features:[D],decls:5,vars:18,consts:[["container",""],["notHeadless",""],["role","alert","aria-live","assertive","aria-atomic","true",3,"mouseenter","mouseleave","ngClass"],[4,"ngIf","ngIfElse"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[1,"p-toast-message-content",3,"ngClass"],[4,"ngIf"],["type","button","class","p-toast-icon-close p-link","pRipple","",3,"click","keydown.enter",4,"ngIf"],[3,"class",4,"ngIf"],["class","p-toast-message-icon",4,"ngIf"],[1,"p-toast-message-text"],[1,"p-toast-summary"],[1,"p-toast-detail"],[1,"p-toast-message-icon"],["type","button","pRipple","",1,"p-toast-icon-close","p-link",3,"click","keydown.enter"],[3,"styleClass",4,"ngIf"],[3,"styleClass"]],template:function(n,i){if(n&1){let s=v();c(0,"div",2,0),x("mouseenter",function(){return d(s),u(i.onMouseEnter())})("mouseleave",function(){return d(s),u(i.onMouseLeave())}),h(2,Ee,2,5,"ng-container",3)(3,Qe,4,8,"ng-template",null,1,te),p()}if(n&2){let s=W(4);T(i.message==null?null:i.message.styleClass),r("ngClass",O(9,Ce,"p-toast-message-"+(i.message==null?null:i.message.severity)))("@messageState",O(16,xe,ee(11,ve,i.showTransformOptions,i.hideTransformOptions,i.showTransitionOptions,i.hideTransitionOptions))),m("id",i.message==null?null:i.message.id)("data-pc-name","toast")("data-pc-section","root"),a(2),r("ngIf",i.headlessTemplate)("ngIfElse",s)}},dependencies:()=>[N,oe,re,he,q,H,U,z,$],encapsulation:2,data:{animation:[R("messageState",[ge("visible",S({transform:"translateY(0)",opacity:1})),A("void => *",[S({transform:"{{showTransformParams}}",opacity:0}),L("{{showTransitionParams}}")]),A("* => void",[L("{{hideTransitionParams}}",S({height:0,opacity:0,transform:"{{hideTransformParams}}"}))])])]},changeDetection:0})}return t})(),ut=(()=>{class t{document;renderer;messageService;cd;config;key;autoZIndex=!0;baseZIndex=0;life=3e3;style;styleClass;get position(){return this._position}set position(e){this._position=e,this.cd.markForCheck()}preventOpenDuplicates=!1;preventDuplicates=!1;showTransformOptions="translateY(100%)";hideTransformOptions="translateY(-100%)";showTransitionOptions="300ms ease-out";hideTransitionOptions="250ms ease-in";breakpoints;onClose=new M;containerViewChild;templates;messageSubscription;clearSubscription;messages;messagesArchieve;template;headlessTemplate;_position="top-right";constructor(e,n,i,s,g){this.document=e,this.renderer=n,this.messageService=i,this.cd=s,this.config=g}styleElement;id=ce();ngOnInit(){this.messageSubscription=this.messageService.messageObserver.subscribe(e=>{if(e)if(Array.isArray(e)){let n=e.filter(i=>this.canAdd(i));this.add(n)}else this.canAdd(e)&&this.add([e])}),this.clearSubscription=this.messageService.clearObserver.subscribe(e=>{e?this.key===e&&(this.messages=null):this.messages=null,this.cd.markForCheck()})}ngAfterViewInit(){this.breakpoints&&this.createStyle()}add(e){this.messages=this.messages?[...this.messages,...e]:[...e],this.preventDuplicates&&(this.messagesArchieve=this.messagesArchieve?[...this.messagesArchieve,...e]:[...e]),this.cd.markForCheck()}canAdd(e){let n=this.key===e.key;return n&&this.preventOpenDuplicates&&(n=!this.containsMessage(this.messages,e)),n&&this.preventDuplicates&&(n=!this.containsMessage(this.messagesArchieve,e)),n}containsMessage(e,n){return e?e.find(i=>i.summary===n.summary&&i.detail==n.detail&&i.severity===n.severity)!=null:!1}ngAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"message":this.template=e.template;break;case"headless":this.headlessTemplate=e.template;break;default:this.template=e.template;break}})}onMessageClose(e){this.messages?.splice(e.index,1),this.onClose.emit({message:e.message}),this.cd.detectChanges()}onAnimationStart(e){e.fromState==="void"&&(this.renderer.setAttribute(this.containerViewChild?.nativeElement,this.id,""),this.autoZIndex&&this.containerViewChild?.nativeElement.style.zIndex===""&&k.set("modal",this.containerViewChild?.nativeElement,this.baseZIndex||this.config.zIndex.modal))}onAnimationEnd(e){e.toState==="void"&&this.autoZIndex&&me.isEmpty(this.messages)&&k.clear(this.containerViewChild?.nativeElement)}createStyle(){if(!this.styleElement){this.styleElement=this.renderer.createElement("style"),this.styleElement.type="text/css",fe.setAttribute(this.styleElement,"nonce",this.config?.csp()?.nonce),this.renderer.appendChild(this.document.head,this.styleElement);let e="";for(let n in this.breakpoints){let i="";for(let s in this.breakpoints[n])i+=s+":"+this.breakpoints[n][s]+" !important;";e+=`
                    @media screen and (max-width: ${n}) {
                        .p-toast[${this.id}] {
                           ${i}
                        }
                    }
                `}this.renderer.setProperty(this.styleElement,"innerHTML",e)}}destroyStyle(){this.styleElement&&(this.renderer.removeChild(this.document.head,this.styleElement),this.styleElement=null)}ngOnDestroy(){this.messageSubscription&&this.messageSubscription.unsubscribe(),this.containerViewChild&&this.autoZIndex&&k.clear(this.containerViewChild.nativeElement),this.clearSubscription&&this.clearSubscription.unsubscribe(),this.destroyStyle()}static \u0275fac=function(n){return new(n||t)(f(ne),f(J),f(pe),f(ie),f(Q))};static \u0275cmp=V({type:t,selectors:[["p-toast"]],contentQueries:function(n,i,s){if(n&1&&K(s,de,4),n&2){let g;b(g=w())&&(i.templates=g)}},viewQuery:function(n,i){if(n&1&&Z(Ie,5),n&2){let s;b(s=w())&&(i.containerViewChild=s.first)}},hostAttrs:[1,"p-element"],inputs:{key:"key",autoZIndex:[2,"autoZIndex","autoZIndex",E],baseZIndex:[2,"baseZIndex","baseZIndex",y],life:[2,"life","life",y],style:"style",styleClass:"styleClass",position:"position",preventOpenDuplicates:[2,"preventOpenDuplicates","preventOpenDuplicates",E],preventDuplicates:[2,"preventDuplicates","preventDuplicates",E],showTransformOptions:"showTransformOptions",hideTransformOptions:"hideTransformOptions",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",breakpoints:"breakpoints"},outputs:{onClose:"onClose"},features:[D],decls:3,vars:5,consts:[["container",""],[1,"p-toast","p-component",3,"ngClass","ngStyle"],[3,"message","index","life","template","headlessTemplate","showTransformOptions","hideTransformOptions","showTransitionOptions","hideTransitionOptions","onClose",4,"ngFor","ngForOf"],[3,"onClose","message","index","life","template","headlessTemplate","showTransformOptions","hideTransformOptions","showTransitionOptions","hideTransitionOptions"]],template:function(n,i){n&1&&(c(0,"div",1,0),h(2,Re,1,10,"p-toastItem",2),p()),n&2&&(T(i.styleClass),r("ngClass","p-toast-"+i._position)("ngStyle",i.style),a(2),r("ngForOf",i.messages))},dependencies:[N,se,ae,Le],styles:[`@layer primeng{.p-toast{position:fixed;width:25rem}.p-toast-message{overflow:hidden}.p-toast-message-content{display:flex;align-items:flex-start}.p-toast-message-text{flex:1 1 auto}.p-toast-top-right{top:20px;right:20px}.p-toast-top-left{top:20px;left:20px}.p-toast-bottom-left{bottom:20px;left:20px}.p-toast-bottom-right{bottom:20px;right:20px}.p-toast-top-center{top:20px;left:50%;transform:translate(-50%)}.p-toast-bottom-center{bottom:20px;left:50%;transform:translate(-50%)}.p-toast-center{left:50%;top:50%;min-width:20vw;transform:translate(-50%,-50%)}.p-toast-icon-close{display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;flex:none}.p-toast-icon-close.p-link{cursor:pointer}}
`],encapsulation:2,data:{animation:[R("toastAnimation",[A(":enter, :leave",[ye("@*",Te())])])]},changeDetection:0})}return t})(),ft=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=G({type:t});static \u0275inj=Y({imports:[le,_e,q,H,U,z,$,ue]})}return t})();export{ut as a,ft as b};
