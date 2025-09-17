<template>
    <div class="header">
        <img class="header__logo" :src="logoPng" alt="logo" />

        <div class="header__navigation">
            <div class="header__navigation__item">Finanzen</div>
            <div class="header__navigation__item">Kalendar</div>

        </div>
        <div class="header__user-button">
            <div class="header__user-button__icon pi pi-user"></div>
        </div>
    </div>
</template>

<script>
import logo from "../assets/logo.png";

export default {
    name: "HeaderNav",
    data() {
        return {
            logoPng: logo
        }
    },
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
                &:hover {
                    cursor: pointer;
                    text-shadow: 0 0 1px grey;
                    text-decoration: underline;
                }
            }

        }
        &__logo {
            height: 100px;
            width: 180px;
            object-fit: contain;

        }
    }
</style>