// planets and moons
module.exports = [
        { R:    23, r:   1, speed: -1.60, phi0:  35, moons: [   // mercury
        ]},
        { R:    45, r:   2, speed: -1.17, phi0: 185, moons: [   // venus
        ]},
        { R:    87, r:   2, speed: -1.00, phi0: 135, moons: [   // earth
          { R:  10, r:   1, speed: -9.00, phi0:  15 }           // the moon
        ]},
        { R:   99, r:   1, speed: -0.80, phi0: 235, moons: [   // mars
          { R:   6, r: 0.5, speed: -3.80, phi0:  15 },          // phobos
          { R:   9, r: 0.5, speed: -2.80, phi0: 115 }           // deimos
        ]},
        { R:   90, r:  22, speed: -0.43, phi0: 135, moons: [   // jupiter
          { R:  30, r:   2, speed: -7.70, phi0:  25 },          // io
          { R:  36, r:   1, speed: -2.45, phi0:  95 },          // europa
          { R:  49, r:   3, speed: -1.10, phi0: 125 },          // ganymede
          { R:  79, r:   2, speed: -0.50, phi0: 315 }           // callisto
        ]},
        { R:   88, r:  18, speed: -0.32, phi0: 260, moons: [   // saturn
          { R:  28, r:   1, speed: -4.10, phi0: 120 },          // mimas
          { R:  33, r:   1, speed: -3.90, phi0:  20 },          // enceladus
          { R:  38, r:   1, speed: -3.60, phi0:   0 },          // tethys
          { R:  44, r:   1, speed: -3.20, phi0: 100 },          // dione
          { R:  58, r:   2, speed: -2.90, phi0: 300 },          // rhea
          { R:  98, r:   5, speed: -1.30, phi0: 180 },          // titan
          { R: 188, r:   2, speed: -0.10, phi0:  10 }           // lapetus
        ]}
      ];
