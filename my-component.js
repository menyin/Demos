const tmp=`
<div>Count is: {{ count }}</div>
<button @click="count++">+1</button>
`;

// my-component.js
import { ref } from 'vue'

export default {
    setup() {
        const count = ref(0)
        return { count }
    },
    template: tmp
}
