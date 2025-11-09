<script lang="ts" setup>
defineProps<{
  name: string;
}>();
</script>
<template>
  <div>
    <span>{{ name }}</span>
  </div>
</template>
