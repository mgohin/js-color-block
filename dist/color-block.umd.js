var k=Object.defineProperty;var f=(e,l,c)=>l in e?k(e,l,{enumerable:!0,configurable:!0,writable:!0,value:c}):e[l]=c;var t=(e,l,c)=>(f(e,typeof l!="symbol"?l+"":l,c),c);(function(e,l){typeof exports=="object"&&typeof module!="undefined"?l(exports):typeof define=="function"&&define.amd?define(["exports"],l):(e=typeof globalThis!="undefined"?globalThis:e||self,l(e.MyLib={}))})(this,function(e){"use strict";window.ColorBlockConfiguration={clipboard:{validColorTitle:i=>`click to copy value ${i}`,invalidColorTitle:i=>`${i} is an invalid color - click to copy value`}};const l=()=>{const i=document.createElement("template");return i.innerHTML=`
        <style>
        
        :host {
            display: inline-block;
        }
        
        .color-block {
          position: relative;
          display: inline-block;
          width: 10px;
          height: 10px;
          line-height: 10px;
          border: 1px solid #444;
        }
        
        .color-block .color {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 10px;
            height: 10px;
        }
        
        .color-block.copy::after {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          
          width: 10px;
          height: 10px;
          line-height: 10px;
          text-align: center;
          
          animation-duration: .5s;
          animation-name: botToTop;
        }
        
        .color-block.copy-success::after {
          content: '\\2713';
          font-size: 16px;
          color: green;
        }
        
        .color-block.copy-failed::after {
          content: '\\00D7';
          font-size: 16px;
          color: red;
        }
        
        @keyframes botToTop  {
           0% {
              top:0;
              opacity: 0;
           }
           
           50% {
            opacity: 1;
           }
           
           100% {
              top:-200%;
              opacity: 0;
           }
        
        }
        
        .color-block .color.invalid {
            position: relative;
        }
        
        .color-block .color.invalid::before,
        .color-block .color.invalid::after {
            position: absolute;
            content: '';
            width: 100%;
            top: 50%;
            height: 1px;
            background-color: red;
        }
        
        .color-block .color.invalid::before {
            transform: rotate(45deg);
        }
        
        .color-block .color.invalid::after {
            transform: rotate(-45deg);
        }
        </style>
        <span class="color-block">
            <span class="color"></span>
            <span class="copy"></span>
        </span>
        <span class="color-text"></span>
        `,i};class c{static ifValid(o){return new p(o)}}class p{constructor(o){t(this,"_validCb");this._validCb=o}ifInvalid(o){return new _(this._validCb,o)}}class _{constructor(o,s){t(this,"_validCb");t(this,"_invalidCb");t(this,"parsers",[r.CssVar(),r.OtherCssColors()]);this._validCb=o,this._invalidCb=s}parse(o){const s=this.parsers.find(h=>h.handle(o));s?this._validCb(s.format(o)):this._invalidCb(o)}}class r{constructor(o,s){t(this,"_handleCb");t(this,"_parseCb");this._handleCb=o,this._parseCb=s}handle(o){return this._handleCb(o)}format(o){return this._parseCb(o)}static CssVar(){return new r(o=>typeof o=="string"&&o.trim().startsWith("--"),o=>`var(${o.trim()})`)}static OtherCssColors(){return new r(o=>typeof o=="string"&&CSS.supports("color",o.trim()),o=>o.trim())}}class b{constructor(o){t(this,"_colorBlockEl");t(this,"_clickListener");this._colorBlockEl=o.getElement()}bindValid(o){this._colorBlockEl.setAttribute("title",ColorBlockConfiguration.clipboard.validColorTitle(o)),this._bind(o)}bindInvalid(o){this._colorBlockEl.setAttribute("title",ColorBlockConfiguration.clipboard.invalidColorTitle(o)),this._bind(o)}_bind(o){this._clickListener=()=>this._copyToClipBoard(o),this._colorBlockEl.addEventListener("click",this._clickListener)}unbind(){this._clickListener&&(this._colorBlockEl.removeEventListener("click",this._clickListener),this._clickListener=null)}_clearCopyState(){this._colorBlockEl.classList.remove("copy-success"),this._colorBlockEl.classList.remove("copy-failed")}_copySuccess(){this._newCopyState("success")}_copyFailed(){this._newCopyState("failed")}_newCopyState(o){this._clearCopyState(),this._colorBlockEl.classList.add("copy"),this._colorBlockEl.classList.add("copy-"+o),setTimeout(()=>{this._colorBlockEl.classList.remove("copy"),this._colorBlockEl.classList.remove("copy-"+o)},500)}_copyToClipBoard(o){navigator.clipboard.writeText(o).then(()=>{this._copySuccess()},()=>{this._copyFailed()})}}class C{constructor(o){t(this,"_htmlEl");this._htmlEl=o,this._colorEl=o.querySelector(".color-block .color"),this._copyToClipboard=new b(this),this._colorParser=c.ifValid(this._setValidColor.bind(this)).ifInvalid(this._setInvalidColor.bind(this))}getElement(){return this._htmlEl}setColor(o){this._colorParser.parse(o)}disconnect(){this._copyToClipboard.unbind()}_setValidColor(o){this._colorEl.style.backgroundColor=o,this._copyToClipboard.bindValid(o)}_setInvalidColor(o){this._colorEl.classList.add("invalid"),this._copyToClipboard.bindInvalid(o)}}const a=class{constructor(o,s){t(this,"_shadowRoot");t(this,"_colorBlockEl");this._shadowRoot=o,this._colorBlockEl=s.getElement()}onAttributeChanged(o,s){!this._handle(o)||(s==="true"?this._shadowRoot.appendChild(this._colorBlockEl):this._shadowRoot.prepend(this._colorBlockEl))}_handle(o){return o===a.ATTR_COLOR_AFTER_TEXT}};let n=a;t(n,"ATTR_COLOR_AFTER_TEXT","color-after-text");class d extends HTMLElement{constructor(){super();t(this,"_colorText");t(this,"_colorBlock");t(this,"_colorAfterTextAttribute");this._createTemplate(),this._bindElements(),this._colorAfterTextAttribute=new n(this.shadowRoot,this._colorBlock)}static get observedAttributes(){return[n.ATTR_COLOR_AFTER_TEXT]}_createTemplate(){this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(l().content.cloneNode(!0))}_bindElements(){this._colorText=this.shadowRoot.querySelector(".color-text"),this._colorBlock=new C(this.shadowRoot.querySelector(".color-block"))}connectedCallback(){setTimeout(()=>{this._colorText.innerHTML=this.textContent,this._colorBlock.setColor(this.textContent)})}disconnectedCallback(){this._colorBlock.disconnect()}attributeChangedCallback(s,h,u){this._colorAfterTextAttribute.onAttributeChanged(s,u)}}customElements.define("color-block",d),e.ColorBlockWebComponent=d,Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
