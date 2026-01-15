presentation:
  name: "Gradient Demo"
  author: "SlideML"
  displaySlideNumber: true

  slides:
    -slide:
      -title: "Vertical Gradient (default)"
      style:
        backgroundColor: gradient "#ff6a00" "#ee0979"

    -slide:
      -title: "Horizontal Gradient"
      style:
        backgroundColor: gradient "#2193b0" "#6dd5ed" horizontal

    -slide:
      -title: "Radial Gradient"
      style:
        backgroundColor: gradient "#cc2b5e" "#753a88" radial

    -slide:
      -title: "With shorthand colors"
      style:
        backgroundColor: gradient "green" "blue" radial

    -slide:
      -title: "Normal background color on an element"
      style:
        backgroundColor: "orange"

    -slide:
      backgroundColor: gradient "orange" "yellow" radial
      -title: "Gradient background color for the whole slide"

    -slide:
      backgroundColor: "green"
      -title: "Normal background color for the whole slide"      
