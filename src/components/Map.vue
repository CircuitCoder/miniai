<template>
  <div id="map">
    <div class="row" v-for="(row, i) of map">
      <div class="slot" v-for="(slot, j) of row" :class="{ wall: slot === '*' }">
        <img src="../assets/hero.svg" v-if="hero.x == i && hero.y == j"></img>
        <img src="../assets/monster.svg" v-if="monster[i][j]"></img>
        <img src="../assets/exit.svg" v-if="slot === '#'"></img>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'board',
  data() {
    return {
      hero: {
        x: 0,
        y: 0,
      },

      map: [],
      monster: [],
    }
  },

  methods: {
    load(map) {
      this.map = map.map(r => r.split(''));
    },

    reset() {
      console.log(this.map);
      this.map.forEach((r, i) =>
        r.forEach((s, j) => {
          if(s === '^') {
            this.hero.x = i;
            this.hero.y = j;
          }
        }));

      this.monster = this.map.map(r =>
        r.map(s =>
          s === '&'
          ));
    },
  }
}
</script>

<style>
#map {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  user-select: none;
  cursor: default;
}

.row {
  margin: 5px 0;
}

.slot {
  margin: 0 5px;
  height: 20px;
  width: 20px;

  display: inline-block;
  position: relative;
}

.slot.wall {
  background: rgba(0,0,0,.12);
}

.slot > img {
  display: absolute;
  height: 20px;
  width: 20px;
  top: 0;
  left: 0;

  opacity: .7;
}
</style>
