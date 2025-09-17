<template>
    <div class="header">
        <img class="header__logo" :src="logoPng" alt="logo" />
        <div class="header__container">
            <div class="header__navigation">
                <div class="header__navigation__item" @click="navigate('Home')">Finanzen</div>
                <div class="header__navigation__item" @click="navigate('Calendar')">Kalendar</div>
    
            </div>
            <div class="header__user-button">
                <i class="header__user-button__icon pi pi-user"></i>
            </div>
        </div>
    </div>
</template>

<script>
import logo from "../assets/logo.png";
import 'primeicons/primeicons.css'

export default {
    name: "HeaderNav",
    data() {
        return {
            logoPng: logo
        }
    },
    methods: {
        navigate(to) {
            this.$emit('navigate', to);
        }
    }
}
</script>

<style lang="scss">
    .header {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        &__navigation {
            display: flex;
            flex-direction: row;
            &__item {
                margin: 0 20px; 
                color: black;
                text-decoration: none;
                &:hover {
                    cursor: pointer;
                    text-decoration: underline;
                }
            }
        }
        &__user-button {
            &__icon {
                margin-right: 40px;
                padding: 5px;
                border: 1px solid;
                border-radius: 50%;
                &:hover {
                    cursor: pointer;
                    box-shadow: 0 0 5px gray;
                }
            }
        }
        &__container {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
        &__logo {
            height: 100px;
            width: 180px;
            object-fit: contain;

        }
    }
</style>