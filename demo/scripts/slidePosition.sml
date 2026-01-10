presentation: 
  slides:
    -slide:
      elements:
        -text: 
          content: "Default position is top at the center"
          style:
            backgroundColor: #f14b4b
    -slide:
      elements:
        -title: 
          content: "Predefined positioning"
        -text: 
          content: "Positioned at x left, y top"
          style:
            backgroundColor: #4bf14b
            position: left top
        -text:
          content: "Positioned at x center, y top"
          style:
            backgroundColor: #4b4bf1
            position:
              x: center
              y: top
        -text:
          content: "Positioned at x right, y top"
          style:
            backgroundColor: #f1a14b
            position:
              x: right
              y: top
        -text: 
          content: "Positioned at x left, y center"
          style:
            backgroundColor: #f14b4b
            position:
              x: left
              y: center
        -text:
          content: "Positioned at x center, y center"
          style:
            backgroundColor: #d8f14b
            position: center
        -text:
          content: "Positioned at x right, y center"
          style:
            backgroundColor: #f14b7d
            position:
              x: right
              y: center
        -text: 
          content: "Positioned at x left, y bottom"
          style:
            backgroundColor: #f14bf1
            position:
              x: left
              y: bottom
        -text:
          content: "Positioned at x center, y bottom"
          style:
            backgroundColor: #14f1b4
            position:
              x: center
              y: bottom
        -text:
          content: "Positioned at x right, y bottom"
          style:
            backgroundColor: #b41ff1
            position: right bottom
    -slide:
      elements:
        -title: 
          content: "Coordinate positioning"
        -text: 
          content: "Default position"
          style:
            backgroundColor: #f14b4b
        -text: 
          content: "(20, 30)"
          style:
            backgroundColor: #4bf14b
            position:
              x: 20
              y: 30
        -text:
          content: "(70, 40)"
          style:
            backgroundColor: #d8f14b
            position: 70 40
        -text:
          content: "(40, 60)"
          style:
            backgroundColor: #4b4bf1
            position:
              x: 40
              y: 60
        -text:
          content: "(80, 90)"
          style:
            backgroundColor: #f1a14b
            position: 80 90
    -slide:
      elements:
        -title: 
          content: "Z-Index positioning"
        -text: 
          content: "large block in the back"
          style:
            size: 80 30
            backgroundColor: #555
            position:
              x: center
              y: center
              z: back
        -text:
          content: "medium block at default depth"
          style:
            size: 38 70
            backgroundColor: #888
            position:
              x: right
              y: top
        -text:
          content: "small block in the front"
          style:
            size: 20 10
            backgroundColor: #bdbdbd
            position: center center front
    -slide:
      elements:
        -group:
          style:
            size: 80 80
            backgroundColor: #ccc
            position:
              x: left
              y: center
          elements:
            -text: 
              content: "top center in the parent group"
              style:
                backgroundColor: #888
                position:
                  x: center
                  y: top
            -text: 
              content: "left center in the parent group"
              style:
                backgroundColor: #888
                position:
                  x: left
                  y: center
            -group: 
              style:
                size: 50 50
                backgroundColor: #888
                font:
                  color: "lightgrey"
                position:
                  x: right
                  y: bottom
              elements:            
                -text: 
                content: "50 top in the parent group"
                style:
                  backgroundColor: #522
                  position:
                    x: 50
                    y: top
                -text: 
                  content: "left 50 in the parent group"
                  style:
                    backgroundColor: #252
                    position:
                      x: left
                      y: 50
                -text:
                  content: "right bottom in the parent group"
                  style:
                    backgroundColor: #225
                    position:
                      x: right
                      y: bottom
