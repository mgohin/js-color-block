export const getTemplate = () => {
    const template = document.createElement('template');
    template.innerHTML = `
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
        <slot></slot>
        `;

    return template;
};
