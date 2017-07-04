<template>
  <div id="map">
    <div class="row" v-for="(row, i) of map">
      <div class="slot" v-for="(slot, j) of row" :class="{ wall: slot === '*' }">
        <img src="../assets/hero.svg" v-if="y == i && x == j" :style="{ transform: `rotate(${realFacing * 90}deg)` }" alt="wys"></img>
        <img src="../assets/monster.svg" v-if="monster[i][j]" alt="怪物"></img>
        <img src="../assets/exit.svg" v-if="slot === '#'" alt="出口"></img>
      </div>
    </div>
  </div>
</template>

<script>
const DELTA_X = [ 1, 0, -1, 0 ];
const DELTA_Y = [ 0, 1, 0, -1 ];

export default {
  name: 'board',
  data() {
    return {
      x: 0,
      y: 0,
      realFacing: 0,

      map: [],
      monster: [],
    }
  },

  computed: {
    facing() {
      const raw = this.realFacing % 4;
      return raw < 0 ? raw + 4 : raw;
    }
  },

  methods: {
    load(map) {
      this.map = map.map(r => r.split(''));
    },

    forward() {
      let newX = this.x + DELTA_X[this.facing];
      let newY = this.y + DELTA_Y[this.facing];

      if(this.map.length > newY
        && this.map[newY].length > newX
        && newY > 0
        && newX > 0
        && this.map[newY][newX] !== '*'
        && !this.monster[newY][newX]) {
        this.x = newX;
        this.y = newY;
      }
    },

    turn(dir) {
      if(dir === 'left')
        --this.realFacing;
      else ++this.realFacing;
    },

    attack() {
      let newX = this.x + DELTA_X[this.facing];
      let newY = this.y + DELTA_Y[this.facing];

      if(this.map.length > newY
        && this.map[newY].length > newX
        && newY > 0
        && newX > 0
        && this.monster[newY][newX])
        this.monster[newY].splice(newX, 1, false);
    },

    reset() {
      this.map.forEach((r, i) =>
        r.forEach((s, j) => {
          if(s === '^') {
            this.x = j;
            this.y = i;
          }
        }));

      this.monster = this.map.map(r =>
        r.map(s =>
          s === '&'
          ));

      this.realFacing = 0;
    },

    isSuccess() {
      return this.map[this.y][this.x] === '#';
    },

    isFacing(target) {
      const x = this.x + DELTA_X[this.facing];
      const y = this.y + DELTA_Y[this.facing];

      if(y >= this.map.length) return false;
      if(x >= this.map[y].length) return false;
      if(y < 0) return false;
      if(x < 0) return false;

      if(target === 'air') return this.map[y][x] === ' ' ||
        (this.map[y][x] === '&' && !this.monster[y][x]);
      else if(target === 'wall')
        return this.map[y][x] === '*';
      else if(target === 'exit')
        return this.map[y][x] === '#';
      else if(target === 'dragon')
        return this.monster[y][x];
      else return false;
    }
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

  transition: transform .2s ease;
}
</style>
