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
    name: "My-Button",
    props: {
        label: String,
        color: String
    }
}
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