presentation: 
  name: "Style tests!" 
  author: "Emma"
  slides:
    -slide:
      transition:
        type: zoom-in
        duration: slow
      elements:
        -text: 
          content: "test zoom-in"
          style:
            backgroundColor: #f14b4b

    -slide:
      transition:
        type: zoom
        duration: fast
      elements:
        -text: 
          content: "Test zoom à fast"
          

    -slide:
      transition:
        type: convex
        duration: fast
      elements:
        -text: 
          content: "test convex à fast"
          style:
            size: 70  70
            backgroundColor: #0bac0b
            

    -slide:
      transition:
        type: concave
        duration: default
      elements:
        -text: 
          content: "Test concave à default"
          style:
            size: 10 10
            backgroundColor: #555
        

    -slide:
      transition:
        type: slide
        duration: slow
      elements:
        -text: 
            content: "test transition slide slow"
            style:
            size: 70 auto
            backgroundColor: #888

    -slide:
      transition:
        type: fade
        duration: default
      elements:
        -text: 
          content: "Text fade à default"
          style:
            backgroundColor: #a0a005
            font:
              name: "Times New Roman"
        

    -slide:
      transition:
        type: fade-out
        duration: fast
      elements:
        -text: 
          content: "Test fade-out à fast"
          style:
            backgroundColor: #5a05a0
            font:
              name: "Courier New"
              size: 64
              color: #ff00ff
              transformations:
                - bold
                - italic
                - underline
