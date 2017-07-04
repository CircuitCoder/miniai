<template>
  <div id="editor">
    <div id="editor-inner" ref="editor"></div>
  </div>
</template>

<script>
import MONARCH_DEF from '../monarch.config.js';

export default {
  name: 'editor',
  data() {
    return {
      editor: null,
    };
  },
  mounted() {
    const require = window.require;
    require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.8.3/min/vs' }});
    require(['vs/editor/editor.main'], () => {
      window.monaco.languages.setMonarchTokensProvider('miniai', MONARCH_DEF);
      window.monaco.languages.register({
        id: 'miniai',
      });
      window.monaco.languages.registerCompletionItemProvider('miniai', {
        provideCompletionItems() {
          return [
            {
              type: 13,
              label: 'WALK',
            }, {
              type: 13,
              label: 'ATTACK',
            }, {
              type: 13,
              label: 'TURN',
            }, {
              type: 13,
              label: 'IF',
            }, {
              type: 13,
              label: 'END',
            }, {
              type: 13,
              label: 'LOOP',
            }, {
              type: 0,
              label: 'NOT',
            }, {
              type: 0,
              label: 'FACING',
            }, {
              type: 11,
              label: 'right',
            }, {
              type: 11,
              label: 'left',
            }, {
              type: 11,
              label: 'wall',
            }, {
              type: 11,
              label: 'air',
            }, {
              type: 11,
              label: 'exit',
            }, {
              type: 11,
              label: 'dragon',
            }
          ];
        }
      });
      console.log(MONARCH_DEF);
      this.editor = window.monaco.editor.create(this.$refs.editor, {
        glyphMargin: true,
        language: 'miniai',
      });
      this.$emit('ready');
    });
  },

  methods: {
    setSample(code) {
      this.editor.setValue(code);
    },

    exec() {
      const lines = this.editor.getValue().split('\n').map(e => e.split(' ').filter(e => e.length > 0));
      const entry = lines.findIndex(l => l.length > 0);

      if(entry == -1) return {
        err: '你的指令是空的!',
      };

      let ifDelta = 0

      for(let l of lines) {
        if(l.length === 0) continue;

        if(l[0] === 'IF') ++ifDelta;
        else if(l[0] === 'END') --ifDelta;

        if(ifDelta < 0)
          return {
            err: '请检查 IF 与 END 是否配对',
          };
      }

      if(ifDelta !== 0) return {
        err: '请检查 IF 与 END 是否配对',
      };

      this.editor.updateOptions({
        readOnly: true,
      });

      return {
        ptr: entry,
        content: lines,
        oldDec: [],
        editor: this.editor,
        next(map) {
          while(this.content[this.ptr].length === 0) {
            ++this.ptr;
            if(this.ptr == this.content.length) this.ptr = 0;
          }

          this.oldDec = this.editor.deltaDecorations(this.oldDec, []);

          const lineSeg = this.ptr + 1;

          setTimeout(() => {
            this.oldDec = this.editor.deltaDecorations(this.oldDec, [{
              range: new monaco.Range(lineSeg, 1, lineSeg, 1),
              options: {
                isWholeLine: true,
                className: 'highlight-line',
                glyphMarginClassName: 'highlight-glyph',
              }
            }])
          }, 100);

          const tokens = this.content[this.ptr];

          ++this.ptr;
          if(this.ptr == this.content.length) this.ptr = 0;

          if(tokens[0] === 'END') {
            if(tokens.length > 1)
              return { err: 'END 语句不需要参数' };
            return { type: 'end' };
          } else if(tokens[0] === 'WALK') {
            if(tokens.length != 2)
              return { err: 'WALK 只需要一个正整数参数!' };

            let number = Number.parseInt(tokens[1], 10);
            if((!Number.isInteger(number)) || number <= 0)
              return { err: 'WALK 只需要一个正整数参数!' };

            return {
              type: 'walk',
              args: number
            };
          } else if(tokens[0] === 'ATTACK') {
            if(tokens.length !== 1)
              return { err: 'ATTACK 不需要参数!' };
            return { type: 'attack' };
          } else if(tokens[0] === 'TURN') {
            if(tokens.length !== 2 || (tokens[1] !== 'left' && tokens[1] !== 'right'))
              return { err: 'TURN 需要一个参数，应为 left, right 之一' };
            return {
              type: 'turn',
              args: tokens[1],
            };
          } else if(tokens[0] === 'LOOP') {
            if(tokens.length > 1)
              return { err: 'LOOP 语句不需要参数' };
            this.ptr = 0;
            return { type: 'loop' };
          } else if(tokens[0] === 'IF') {
            let positive;
            let target;
            if(tokens[1] === 'NOT') {
              if(tokens[2] === 'FACING')  {
                positive = false;
                target = tokens[3];
              } else {
                return { err: '在 IF NOT 后应该紧接着 FACING 关键字' };
              }
            } else if(tokens[1] === 'FACING') {
              positive = true;
              target = tokens[2];
            } else {
              return { err: '在 IF 后应该为 NOT 或 FACING 关键字' };
            }

            let result;

            console.log(target);

            if(target !== 'air'
              && target !== 'wall'
              && target !== 'exit'
              && target !== 'dragon')
              return { err: 'IF [NOT] FACING 的目标应为 air, wall, exit 或 dragon' };
            else result = map.isFacing(target);

            if(!positive) result = !result;

            console.log(result);

            if(!result)
              this.ptr = this.findPairingEnd(this.ptr);

            return { type: 'IF' };
          } else {
            return {
              err: `未知指令: ${tokens[0]}`,
            }
          }
        },
        stop() {
          this.editor.updateOptions({
            readOnly: false,
          });
          this.editor.deltaDecorations(this.oldDec, []);
        },
        findPairingEnd(start) {
          let ifCount = 1;
          while(true) {
            while(this.content[start].length === 0)
              ++start;

            if(this.content[start][0] === 'IF') ++ifCount;
            else if(this.content[start][0] === 'END') --ifCount;

            if(ifCount === 0) return start;
            ++start;
          }
        }
      };
    },
  }
}
</script>

<style>
#editor-inner {
  height: 100%;
}

@keyframes blink {
  0% {
    background: rgba(0,0,0,.12);
  }

  100% {
    background: rgba(0,0,0,0);
  }
}

.highlight-line {
  animation: blink 0.2s ease-out;
}

.highlight-glyph {
  background-image: url('../assets/ptr.svg');
  background-size: contain;
  opacity: .7;
}
</style>
