<template>
    <div class="popup-add-contract">
       <Popup @close-popup="this.$emit('close-popup')">
       
       </Popup>
    </div>
</template>

<script>
import { Form } from '@primevue/forms';
import Popup from './PopUp.vue';

export default {
    data() {
        return {

        }
    },
    methods: {
      
    },
    components: {
        Popup
    }
}
</script>

<style lang="scss">

</style>