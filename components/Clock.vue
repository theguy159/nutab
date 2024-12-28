<template>
  <div class="container">
    <div class="inner">{{ formattedTime }}</div>
  </div>
</template>


<script>
export default {
  name: "Clock",
  props: {
    format: {
      type: String,
      default: "HH:mm:ss", // Default to 24-hour format with seconds
    },
  },
  data() {
    return {
      currentTime: new Date(),
      interval: null,
    };
  },
  computed: {
    formattedTime() {
      return this.formatTime(this.currentTime, this.format);
    },
  },
  methods: {
    updateCurrentTime() {
      this.currentTime = new Date();
    },
    formatTime(date, format) {
      const parts = {
        HH: String(date.getHours()).padStart(2, "0"),
        mm: String(date.getMinutes()).padStart(2, "0"),
        ss: String(date.getSeconds()).padStart(2, "0"),
      };

      Object.entries(parts).forEach(([key, value]) => {
        format = format.replace(key, value);
      });

      return format;
    },
  },
  mounted() {
    this.interval = setInterval(this.updateCurrentTime, 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped>
.container {
  font-size: 10vw;
  display: grid;
  grid-template-columns: 1fr;
}
.inner {
  justify-self: center;
}
</style>
