<template>
  <div class="editText">
    <pre contenteditable=true @keyup="changeValue" class="aa"></pre>
    <input type="text" v-model="currentValue" v-show=false>
  </div>
</template>

<script>
export default {
  props: ['value'],
  data () {
    return {
    }
  },
  mounted () {
    this.$el.querySelector('pre').innerHTML = this.value
  },
  methods: {
    changeValue (e) {
      this.currentValue = e.target.innerHTML;
    }
  },
  computed: {
    currentValue: {
      get: function () {
        this.$el && (this.$el.querySelector('pre').innerHTML = this.value);
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style scoped lang="scss" media="screen">
.editText {
  pre {
    outline: none;
    height: 100%;
  }
}
</style>
