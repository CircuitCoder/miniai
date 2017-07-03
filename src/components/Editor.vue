<template>
  <div id="editor">
    <div id="editor-inner" ref="editor"></div>
  </div>
</template>

<script>
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
      this.editor = window.monaco.editor.create(this.$refs.editor, {
        glyphMargin: true,
      });
      this.$emit('ready');
    });
  },

  methods: {
    setSample(code) {
      this.editor.setValue(code);
    }
  }
}
</script>

<style>
#editor-inner {
  height: 100%;
}
</style>
