<template>
    <div class="popup">
        <div class="popup__container">
            <slot name="header">
                <div class="popup__container__header">
                    <i class="popup__container__header__close pi pi-times" @click="this.$emit('close-popup')"></i>
                </div>
            </slot>
        </div>
        <slot name="form">

        </slot>
        <slot name="footer">
            <div class="popup__container__footer">
                <button class="popup__container__footer__button --close">Abbrechen</button>
                <button class="popup__container__footer__button --submit">Hinzufügen</button>
            </div>
        </slot>
    </div>
</template>

<script>

export default {
    data() {
        return {

        }
    },
    methods: {
      
    }
}
</script>

<style lang="scss">
.popup {
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
        &__footer {
            justify-content: space-between;
        }
    }
}
</style>