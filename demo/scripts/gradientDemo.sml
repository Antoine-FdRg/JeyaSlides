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
      -title: "Normal background color"
      style:
        backgroundColor: "orange"
