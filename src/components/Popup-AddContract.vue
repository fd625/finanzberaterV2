<template>
    <div class="popup-add-contract">
       <Popup>
        
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
.popup-add-contract {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.3s ease;
    &__container {
        height: 500px;
        border-radius: 20px;
        width: 400px;
        margin: 0px auto;
        padding: 20px 30px;
        background-color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        transition: all 0.3s ease;
        font-family: Helvetica, Arial, sans-serif;
        &__header {
            direction: rtl;
            &__close {
                color: #d90202;
                &:hover {
                    cursor: pointer;
                    text-shadow: 0 0 2px rgb(182, 182, 182);
                }
            }
        }
    }
}
</style>