<script setup lang="ts">
const a = 1;
let b = "";
var c = {};
const d = () => true;

function e() {
  return true;
}

declare let f: number;
declare const g: string;
declare var h: {};

declare function j(): boolean;
</script>

<template>
  {{ a }}
  {{ b }}
  {{ c }}
  {{ d }}
  {{ e }}
  {{ f }}
  {{ g }}
  {{ h }}
  {{ j }}
</template>
