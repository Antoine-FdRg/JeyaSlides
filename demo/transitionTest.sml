presentation: 
  slides:
    -slide:
      transition:
        type: zoom-in
        duration: slow
      -text:   "test zoom-in"
          style:
            backgroundColor: #f14b4b

    -slide:
      transition:
        type: zoom
        duration: fast
      -text:   "Test zoom à fast"
          

    -slide:
      transition:
        type: convex
        duration: fast
      -text:   "test convex à fast"
          style:
            size: 70 70
            backgroundColor: #0bac0b
            

    -slide:
      transition:
        type: concave
        duration: default
      -text:   "Test concave à default"
          style:
            size: 10 10
            backgroundColor: #555
        

    -slide:
      transition:
        type: slide
        duration: slow
      -text:  "test transition slide slow"
            style:
            size: 70 auto
            backgroundColor: #888

    -slide:
      transition:
        type: fade
        duration: default
      -text:   "Text fade à default"
          style:
            backgroundColor: #a0a005
            font: "Times New Roman"
        
    -slide:
      transition:
        type: fade-out
        duration: fast
      -text:   "Test fade-out à fast"
          style:
            backgroundColor: #5a05a0
            font: "Courier New" 15
              color: #ff00ff
              transformations:
                - bold
                - italic
                - underline
