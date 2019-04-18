      class Inventory {
        constructor(x, y, w, h) {
          this.x = x; this.y = y; this.w = w; this.h = h;
          this.color = "rgba(255, 255, 255, 0.5)";
          this.items = new Array();
          this.columns = 4;
        }
        addItem(sprite) {
          
          if (this.items.length == this.columns) {
            sprite.vy = -4;
            return false;
          }
          this.items.push(sprite)
          return true;
              
        }
        dropItem(index, x, y) {
          var item = this.items[index];
          if (item) {
            this.items.splice(index, 1);
            item.x = x;
            item.y = y - item.h;
            item.vx = Math.random() * 2 - 1;
            item.vy = Math.random() * -5 - 1;
          } return item;
        }
      }
      Inventory.prototype.collidePoint = Sprite.prototype.collidePoint;
      var tile_set = new Image();
      var tile_size = 16;
      var map_columns = 16;
      var map_rows = 12;
      var map_ratio = map_columns / map_rows;
      var map_floor = 148;
      var map_friction = 0.9;
      var map_gravity = 1;
      var map_scale = 1;
      var map = [ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
                  9, 9, 9,10,11,12, 9, 9,10,11,12, 9, 9, 9, 9, 9,
                  9, 9,10, 5, 0, 0,12,10, 5, 0, 0, 9, 9, 9, 9, 9,
                  9, 9, 4, 0, 0, 0, 0, 4, 0, 0, 0,12, 9, 9, 9, 9,
                  9,10, 5, 0,11, 5, 0, 5, 0, 5, 0, 0, 9, 9, 9, 9,
                 12, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12, 9, 9, 9,
                  0, 5, 0, 4, 0, 3, 0, 9, 9, 4, 0, 2, 0,12, 9, 9,
                  0, 2, 0, 5, 0, 5, 0,11,11, 5, 0, 5, 0, 0,11,11,
                  0, 2, 3, 0, 0, 0, 0, 2, 0, 0, 0, 3, 2, 0, 0, 2,
                  8, 6, 7, 8, 8, 8, 8, 7, 8, 8, 8, 7, 6, 8, 8, 7,
                  1, 1, 1, 1,13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,13,
                  8, 8, 8, 8, 6, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7];
      var context = document.querySelector("canvas").getContext("2d", { alpha: false });
      var buffer = document.createElement("canvas").getContext("2d", { alpha: false });
      var screen_h = document.documentElement.clientHeight - 16;
      var screen_w = document.documentElement.clientWidth - 16;
      var player = new Sprite(100, 100, 112, 16, 16, 32);
      var inventory = new Inventory(120, 8, 128, 32);
      var items = [new Sprite(Math.random() * 240, 100, 96, 16, tile_size, tile_size),
                   new Sprite(Math.random() * 240, 100, 0, 32, tile_size, tile_size),
                   new Sprite(Math.random() * 240, 100, 16, 32, tile_size, tile_size),
                   new Sprite(Math.random() * 240, 100, 32, 32, tile_size, tile_size),
                   new Sprite(Math.random() * 240, 100, 48, 32, tile_size, tile_size),
                   new Sprite(Math.random() * 240, 100, 64, 32, tile_size, tile_size),
                   new Sprite(Math.random() * 240, 100, 80, 32, tile_size, tile_size),
                   new Sprite(Math.random() * 240, 100, 96, 32, tile_size, tile_size)];
      var pointer = { x:100, y:0, down:false };
      function loop(time_step) {
        window.requestAnimationFrame(loop);// perpetuate the loop
        // Click inventory
        if (pointer.down && inventory.items.length > 0 && inventory.collidePoint(pointer)) {
          
          let index = Math.floor((pointer.x - inventory.x) / (inventory.w / inventory.columns));
          pointer.x = player.x + player.w * 0.5;
          let item = inventory.dropItem(index, player.x, player.y);
          if (item) items.unshift(item);
        }