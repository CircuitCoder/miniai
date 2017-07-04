<template>
  <div id="app">
    <editor @ready="setup" ref="editor"></editor>
    <div id="output">
      <div id="level-indicator" v-if="level >= 0">
        第 {{ level + 1 }} 关 <span class="title">{{ levelName }}</span>
        <div id="toolbelt">
          <img src="./assets/help.svg" @click="help = true"></img>
          <img src="./assets/play.svg" @click="run" v-if="!running"></img>
          <img src="./assets/stop.svg" @click="stop" v-if="running">
        </div>
      </div>
      <div id="level-indicator" v-if="level < 0">
        正在加载...
      </div>
      <board ref="board"></board>
      <console ref="console"></console>
    </div>

    <transition name="opacity">
      <div class="overlay" v-if="winning">
        <div class="overlay-inner">
          <div class="dialog-title">恭喜！</div>
          <div class="dialog-hint">
            朋友，你帮助 wys 逃离了复杂险恶的实验楼！这给清华附中高等研究实验室带来了新生，带来了质的飞跃，带来了明天的曙光！<br>
            请<strong>刷新</strong>以把 wys 放回实验楼中，重新开始。
          </div>
        </div>
      </div>
    </transition>

    <transition name="opacity">
      <div class="overlay" v-if="help" @click="help = false">
        <div class="overlay-inner">
          <div class="dialog-title">参考</div>
          <div class="dialog-hint">
            <div class="ref">WALK 步数: 前进
              TURN right/left: 转向
              ATTACK: 攻击
              IF [NOT] FACING air/wall/exit/dragon: 条件
              END: 条件块结束
              LOOP: 返回指令开始</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Editor from './components/Editor';
import Board from './components/Map';
import Console from './components/Console';
import LEVELS from './levels';

const RUNNING_INTERVAL = 1000;

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
      running: false,
      intervalId: -1,
      runner: null,
      winning: false,
      help: false,
    }
  },

  methods: {
    load(i) {
      if(i >= LEVELS.length) {
        this.winning = true;
        return;
      }

      this.level = i;
      this.$refs.board.load(LEVELS[i].map);
      this.$refs.board.reset();
      this.$refs.editor.setSample(LEVELS[i].sample);
      this.$refs.console.info(LEVELS[i].description);
    },

    setup() {
      this.load(0);
    },

    run() {
      this.runner = this.$refs.editor.exec();

      if(this.runner.err) {
        this.$refs.console.alert(this.runner.err);
        return;
      }

      this.running = true;

      const loop = () => {
        const instruction = this.runner.next(this.$refs.board);

        if(instruction.err) {
          this.$refs.console.alert(instruction.err);
          setTimeout(() => {
            this.stop();
          }, 200);
        }

        else if(instruction.type === 'walk')
          for(let i = 0; i<instruction.args; ++i)
            this.$refs.board.forward();
        else if(instruction.type === 'turn')
          this.$refs.board.turn(instruction.args);
        else if(instruction.type === 'attack')
          this.$refs.board.attack();

        if(this.$refs.board.isSuccess()) {
          this.stop();
          setTimeout(() => this.load(this.level + 1), 200);
        }
      };

      this.intervalId = setInterval(loop, RUNNING_INTERVAL);
      loop();
    },

    stop() {
      //TODO: implement,

      clearInterval(this.intervalId);
      this.running = false;
      this.runner.stop();
      this.$refs.board.reset();
    }
  },
  computed: {
    levelName() {
      return LEVELS[this.level].name;
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

.title {
  opacity: 0.7;
  font-size: 20px;
}

.opacity-enter-active {
  transition: opacity .2s ease-in, backdrop-filter .2s ease-in;
}

.opacity-leave-active {
  transition: opacity .2s ease-out, backdrop-filter .2s ease-out;
}

.opacity-enter, .opacity-leave-to {
  opacity: 0;
}

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;

  background: rgba(0,0,0,.03);
  backdrop-filter: blur(2px);

  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-inner {
  width: 400px;
  padding: 40px 60px;
  background: white;
  box-shadow: rgba(0,0,0,.12) 0 4px 6px;
}

.dialog-title {
  font-size: 24px;
  line-height: 36px;
  margin-bottom: 10px;
}

.ref {
  white-space: pre-line;
}
</style>
