<template>
  <button 
    class="my-button" 
    :style="{'background-color' : color}" 
    @click="$emit('clicked')"
  >
    {{ label }}
  </button>
</template>

<script>
export default {
    name: "MyButton", 
    props: {
        label: {
            type: String,
            default: "" 
        },
        color: {
            type: String,
            default: "#417d41" 
        }
    },
    emits: ["clicked"]
};
</script>

<style lang="scss">
.my-button {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    &:hover {
        cursor: pointer;
        box-shadow: 0 0 5px grey;
    }
}
</style>