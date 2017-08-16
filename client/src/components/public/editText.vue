<template>
  <div class="editText">
    <pre contenteditable=true @keydown="changeValue" @keydown.enter="enter" @keydown.enter.ctrl="ctrlEnter"></pre>
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
    this.$el.querySelector('pre').innerHTML = this.value;
  },
  methods: {
    changeValue (e) {
      this.currentValue = e.target.innerHTML;
    },
    enter (e) {
      e.preventDefault();
      if (!e.ctrlKey) this.$emit('enter');
      return false;
    },
    ctrlEnter (e) {
      e.preventDefault();
      let innerHTML = e.target.innerHTML;
      document.execCommand('insertHTML', false, '<br/>');
      if (innerHTML === e.target.innerHTML) {
        document.execCommand('insertHTML', false, '<br/><br/>');
      }
      this.currentValue = e.target.innerHTML;
      return false;
    }
  },
  watch: {
    value: function (val) {
      if (val === '') this.$el && (this.$el.querySelector('pre').innerHTML = val);
    }
  },
  computed: {
    currentValue: {
      get: function () {
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
