presentation: 
  slides:
    -slide:
      -text: "Default position is top at the center"
        style:
          backgroundColor: #f14b4b
    -slide:
      -title:   "Predefined positioning"
      -text:   "Positioned at x left, y top"
        style:
          backgroundColor: #4bf14b
          position: left top
      -text: "Positioned at x center, y top"
        style:
          backgroundColor: #4b4bf1
          position: center top
      -text: "Positioned at x right, y top"
        style:
          backgroundColor: #f1a14b
          position: right top
      -text:   "Positioned at x left, y center"
        style:
          backgroundColor: #f14b4b
          position: left center
      -text: "Positioned at x center, y center"
        style:
          backgroundColor: #d8f14b
          position: center
      -text: "Positioned at x right, y center"
        style:
          backgroundColor: #f14b7d
          position: right center
      -text: "Positioned at x left, y bottom"
        style:
          backgroundColor: #f14bf1
          position: left bottom
      -text: "Positioned at x center, y bottom"
        style:
          backgroundColor: #14f1b4
          position: center bottom
      -text: "Positioned at x right, y bottom"
        style:
          backgroundColor: #b41ff1
          position: right bottom
    -slide:
      -title:   "Coordinate positioning"
      -text:   "Default position"
        style:
          backgroundColor: #f14b4b
      -text: "(20, 30)"
        style:
          backgroundColor: #4bf14b
          position: 20 30
      -text: "Positioned at (50, 50)"
        style:
          backgroundColor: #d8f14b
          position: 50 50
      -text: "(50, 70)"
        style:
          backgroundColor: #4b4bf1
          position: 50 70
      -text: "(80, 90)"
        style:
          backgroundColor: #f1a14b
          position: 80 90
    -slide:
      -title:   "Z-Index positioning"
        -text:   "large block in the back"
          style:
            size: 80 30
            backgroundColor: #555
            position:
              x: center
              y: center
              z: back
      -text: "medium block at default depth"
        style:
          size: 38 70
          backgroundColor: #888
          position: right top
      -text: "small block in the front"
        style:
          size: 20 10
          backgroundColor: #bdbdbd
          position: center front
    -slide:
      -group:
        style:
          size: 80 80
          backgroundColor: #ccc
          position:
            x: left
            y: center
        -text: "top center in the parent group"
          style:
            backgroundColor: #888
            position: center top
        -text: "left center in the parent group"
          style:
            backgroundColor: #888
            position: left center
        -group: 
          style:
            size: 50 50
            backgroundColor: #888
            font:
              color: "lightgrey"
            position: right bottom
          -text: "50 top in the parent group"
            style:
              backgroundColor: #522
              position: 50 top
          -text: "left 50 in the parent group"
            style:
              backgroundColor: #252
              position: left 50
          -text: "right bottom in the parent group"
            style:
              backgroundColor: #225
              position: right bottom
