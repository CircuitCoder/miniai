<template>
  <div id="console">
    <div v-for="msg of msgs" class="msg" :class="{ alert: msg.type === 'alert' }">
      <div class="time">{{ msg.time + ' >' }}</div>
      {{ msg.content }}
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
    },

    info(msg) {
      this.msgs.push({
        time: new Date(),
        type: 'info',
        content: msg,
      });
    }
  }
}
</script>

<style>
#console {
  padding: 20px;
  border-top: rgba(0,0,0,.3) 1px solid;

  overflow-x: hidden;
  overflow-y: scroll;
}

.msg {
  line-height: 24px;
  font-size: 14px;

  color: rgba(0,0,0,.7);
}

.msg.alert {
  background: #FF4C4C;
  color: #7F0000;
}

.time {
  font-weight: 800;
  opacity: 0.3;
}
</style>
