// import { createApp ,ref,reactive} from './vue.global.js';
// import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
// import { ref } from 'vue'
// const { createApp ,ref,reactive} = Vue;
const { createApp ,ref} = Vue;
const { Button } = antd;


class  MyTsComponet {

    // name: 'my-componet',
    setup() {
        const count = ref(0)
        return { count }
    },
    components: {
        AButton: Button,
    },
    template: `
    <a-button @click="count++">
      这是ts写的组件 {{ count }} 
    </a-button>`
    // 也可以针对一个 DOM 内联模板：
    // template: '#my-template-element'
}
