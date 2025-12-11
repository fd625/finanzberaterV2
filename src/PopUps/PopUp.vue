<template>
  <div class="popup">
    <div class="popup__container">
      <slot name="header">
        <div class="popup__container__header">
          <div
            v-if="label"
            class="popup__container__header__label"
          >
            {{ label }}
          </div>
          <i
            class="popup__container__header__close pi pi-times"
            @click="$emit('close-popup')"
          />
        </div>
      </slot>
      <slot name="form" />
      <slot name="footer">
        <div class="popup__container__footer">
          <button
            class="popup__container__footer__button --close"
            @click="$emit('close-popup')"
          >
            Abbrechen
          </button>
          <button
            class="popup__container__footer__button --submit"
            @click="$emit('submit')"
          >
            {{ submitHeadline }}
          </button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: "" 
        },
        submitHeadline: {
            type: String,
            default: "Speichern"
        }
    },
    emits: ["close-popup", "submit"],
    data() {
        return {};
    }
};
</script>

<style lang="scss">
.popup {
    position: fixed;
    z-index: 1000;
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
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 370px;
        border-radius: 20px;
        width: 50%;
        margin: 0px auto;
        padding: 26px;
        background-color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        transition: all 0.3s ease;
        font-family: Helvetica, Arial, sans-serif;

        @media (max-width: 860px) {
            width: 80%;
        }
        &__header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            &__label {
                font-size: 21px;
            }
            &__close {
                color: #d90202;
                &:hover {
                    cursor: pointer;
                    text-shadow: 0 0 2px rgb(182, 182, 182);
                }
            }
        }
        &__footer {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            &__button {
                padding: 10px 15px;
                border: none;
                border-radius: 5px;
                &:hover {
                    cursor: pointer;
                    box-shadow: 0 0 5px grey;
                }
                &.--close {
                    background-color: #8b0000;
                    color: white;
                }
                &.--submit {
                    background-color: green;
                    color: white;
                }
            }
        }
    }
}
</style>