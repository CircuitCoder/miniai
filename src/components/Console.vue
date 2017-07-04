<template>
  <div id="console" ref="console">
    <div v-for="msg of msgs" class="msg" :class="{ alert: msg.type === 'alert' }">
      <div class="time">{{ msg.time + ' >' }}</div>
      <div class="content">{{ msg.content }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'console',
  data() {
    return {
      msgs: [],
    }
  },

  methods: {
    alert(msg) {
      this.msgs.push({
        time: new Date(),
        type: 'alert',
        content: msg,
      });

      this.$nextTick(() => this.pullToEnd());
    },

    info(msg) {
      this.msgs.push({
        time: new Date(),
        type: 'info',
        content: msg,
      });

      this.$nextTick(() => this.pullToEnd());
    },

    pullToEnd() {
      this.$refs.console.scrollTop = this.$refs.console.scrollHeight;
    },
  }
}
</script>

<style>
#console {
  padding: 20px;
  border-top: rgba(0,0,0,.12) 1px solid;

  overflow-x: hidden;
  overflow-y: scroll;
}

.msg {
  line-height: 24px;
  font-size: 14px;

  color: rgba(0,0,0,.7);

  margin-bottom: 20px;
}

.msg .content {
  white-space: pre-line;
}

.msg.alert {
  color: #7F0000;
}

.time {
  font-weight: 800;
  opacity: 0.3;
}
</style>
