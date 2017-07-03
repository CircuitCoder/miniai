<template>
  <div id="app">
    <editor @ready="setup" ref="editor"></editor>
    <div id="output">
      <div id="level-indicator" v-if="level >= 0">
        第 {{ level + 1 }} 关
        <div id="toolbelt">
          <img src="./assets/help.svg"></img>
          <img src="./assets/play.svg"></img>
        </div>
      </div>
      <div id="level-indicator" v-if="level < 0">
        正在加载...
      </div>
      <board ref="board"></board>
      <console ref="console"></console>
    </div>
  </div>
</template>

<script>
import Editor from './components/Editor';
import Board from './components/Map';
import Console from './components/Console';
import LEVELS from './levels';

export default {
  name: 'app',
  components: {
    Editor,
    Board,
    Console,
  },
  data(){
    return {
      level: -1,
    }
  },

  methods: {
    load(i) {
      this.level = i;
      this.$refs.board.load(LEVELS[i].map);
      this.$refs.board.reset();
      this.$refs.editor.setSample(LEVELS[i].sample);
      this.$refs.console.info(LEVELS[i].description);
    },

    setup() {
      this.load(0);
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  display: flex;

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

#app > * {
  flex: 1;
}

#editor {
  box-shadow: rgba(0,0,0,.12) 4px 0 6px;
}

#output {
  display: flex;
  flex-direction: column;
}

#output > * {
  flex: 1;
}

#level-indicator {
  line-height: 60px;
  height: 60px;
  padding: 0 20px;
  font-size: 24px;

  box-shadow: rgba(0,0,0,.12) 0 2px 3px;
  flex: 0;
}

#toolbelt {
  float: right;
  display: flex;
  align-items: center;
  height: 100%;
}

#toolbelt > img {
  margin-left: 10px;
  cursor: pointer;
  opacity: 0.56;

  transition: opacity 0.2s ease;
}

#toolbelt > img:hover {
  opacity: 0.7;
}
</style>
